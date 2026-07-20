'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearToken } from '../lib/api';
import { usePermissions } from './PermissionContext';
import {
  NAV_GROUPS,
  NAV_ROOT,
  findActiveGroupId,
  isNavActive,
  type NavGroup,
  type NavSectionId,
} from '../lib/adminNav';
import {
  clearLegacyNavOrder,
  getNavGroupOrder,
  getNavSectionToggles,
  getOpenGroups,
  reorderList,
  setNavGroupOrder,
  setOpenGroups,
} from '../lib/adminPrefs';

const DEFAULT_SECTIONS_SAFE: Record<NavSectionId, boolean> = {
  ops: true,
  commercial: true,
  fleet: true,
  legal: true,
  content: true,
  system: true,
};

export function AdminShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { can, ready } = usePermissions();
  const currentPath = active ?? pathname ?? '/dashboard';

  const defaultGroupIds = useMemo(() => NAV_GROUPS.map((g) => g.id), []);
  const [groupOrder, setGroupOrder] = useState<NavSectionId[]>(defaultGroupIds);
  const [sections, setSections] = useState(() => ({ ...DEFAULT_SECTIONS_SAFE }));
  const [open, setOpen] = useState<Set<NavSectionId>>(() => new Set(['ops']));
  const [prefsReady, setPrefsReady] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragGroup, setDragGroup] = useState<NavSectionId | null>(null);

  useEffect(() => {
    clearLegacyNavOrder();
    setGroupOrder(getNavGroupOrder(defaultGroupIds));
    setSections(getNavSectionToggles());
    setOpen(getOpenGroups(['ops']));
    setPrefsReady(true);

    const onPrefs = () => {
      setGroupOrder(getNavGroupOrder(defaultGroupIds));
      setSections(getNavSectionToggles());
    };
    window.addEventListener('storage', onPrefs);
    window.addEventListener('jetvina-admin-prefs', onPrefs);
    return () => {
      window.removeEventListener('storage', onPrefs);
      window.removeEventListener('jetvina-admin-prefs', onPrefs);
    };
  }, [defaultGroupIds]);

  // Auto-expand the group that contains the active route (no collapse of others).
  useEffect(() => {
    const activeGroup = findActiveGroupId(currentPath);
    if (!activeGroup) return;
    setOpen((prev) => {
      if (prev.has(activeGroup)) return prev;
      const next = new Set(prev);
      next.add(activeGroup);
      setOpenGroups(next);
      return next;
    });
  }, [currentPath]);

  const byId = useMemo(() => new Map(NAV_GROUPS.map((g) => [g.id, g])), []);

  const visibleGroups = useMemo(() => {
    return groupOrder
      .map((id) => byId.get(id))
      .filter((g): g is NavGroup => Boolean(g))
      .filter((g) => sections[g.id] !== false)
      .map((g) => ({
        ...g,
        children: g.children.filter((c) => !ready || can(c.permission)),
      }))
      .filter((g) => g.children.length > 0);
  }, [groupOrder, byId, sections, ready, can]);

  function logout() {
    clearToken();
    router.push('/login');
  }

  function toggleGroup(id: NavSectionId) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setOpenGroups(next);
      return next;
    });
  }

  function onDropGroup(target: NavSectionId) {
    if (!dragGroup || dragGroup === target || !reorderMode) return;
    const from = groupOrder.indexOf(dragGroup);
    const to = groupOrder.indexOf(target);
    if (from < 0 || to < 0) return;
    const next = reorderList(groupOrder, from, to);
    setGroupOrder(next);
    setNavGroupOrder(next);
    setDragGroup(null);
  }

  const showRoot = !ready || can(NAV_ROOT.permission);

  return (
    <div className="jb-shell">
      <aside className="jb-shell__aside">
        <div className="jb-shell__brand-row">
          <div className="jb-shell__brand">
            <span className="jb-shell__mark" aria-hidden>
              JV
            </span>
            JetVina Admin
          </div>
          <button type="button" className="jb-shell__logout" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="jb-shell__nav-tools">
          <button
            type="button"
            className={`jb-shell__tool${reorderMode ? ' is-on' : ''}`}
            onClick={() => setReorderMode((v) => !v)}
            title="Drag parent groups to reorder"
          >
            {reorderMode ? 'Done' : 'Reorder'}
          </button>
        </div>

        <nav className="jb-shell__nav" aria-label="Admin">
          {showRoot ? (
            <Link
              href={NAV_ROOT.href}
              className={`jb-shell__link jb-shell__link--root${
                isNavActive(currentPath, NAV_ROOT.href) ? ' is-active' : ''
              }`}
            >
              {NAV_ROOT.label}
            </Link>
          ) : null}

          {prefsReady
            ? visibleGroups.map((g) => {
                const isOpen = open.has(g.id) || reorderMode;
                const groupActive = g.children.some((c) => isNavActive(currentPath, c.href));
                return (
                  <div
                    key={g.id}
                    className={`jb-shell__group${groupActive ? ' is-current' : ''}${
                      reorderMode ? ' is-draggable' : ''
                    }`}
                    draggable={reorderMode}
                    onDragStart={() => setDragGroup(g.id)}
                    onDragOver={(e) => {
                      if (reorderMode) e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      onDropGroup(g.id);
                    }}
                  >
                    <button
                      type="button"
                      className={`jb-shell__parent${groupActive ? ' is-active' : ''}`}
                      aria-expanded={isOpen}
                      onClick={() => {
                        if (reorderMode) return;
                        toggleGroup(g.id);
                      }}
                    >
                      <span className="jb-shell__chevron" aria-hidden>
                        {isOpen ? '▾' : '▸'}
                      </span>
                      <span className="jb-shell__parent-label">
                        {reorderMode ? '⋮⋮ ' : ''}
                        {g.label}
                      </span>
                      <span className="jb-shell__count">{g.children.length}</span>
                    </button>
                    {isOpen ? (
                      <div className="jb-shell__children">
                        {g.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={`jb-shell__link jb-shell__link--child${
                              isNavActive(currentPath, c.href) ? ' is-active' : ''
                            }`}
                            onClick={(e) => {
                              if (reorderMode) e.preventDefault();
                            }}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </nav>
      </aside>
      <main className="jb-shell__main">{children}</main>
    </div>
  );
}
