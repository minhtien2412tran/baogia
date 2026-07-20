'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, ActionBtn } from '../../../components/AdminFormFields';
import { usePermissions } from '../../../components/PermissionContext';
import { adminApi } from '../../../lib/api';
import { groupPermissions } from '../../../lib/adminPrefs';

type Effect = 'INHERIT' | 'ALLOW' | 'DENY';
type Tab = 'roles' | 'users' | 'scope';

const EDITABLE_ROLES = ['SALES', 'CONTRACT_APPROVER'] as const;

export default function PermissionsPage() {
  const { can } = usePermissions();
  const [tab, setTab] = useState<Tab>('roles');
  const [catalog, setCatalog] = useState<string[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [myRole, setMyRole] = useState('');
  const [editRole, setEditRole] = useState<(typeof EDITABLE_ROLES)[number]>('SALES');
  const [roleGranted, setRoleGranted] = useState<Set<string>>(new Set());
  const [selectedAvail, setSelectedAvail] = useState<Set<string>>(new Set());
  const [selectedGranted, setSelectedGranted] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<
    Array<{ id: number; email: string; role: string; firstName?: string | null; lastName?: string | null }>
  >([]);
  const [userId, setUserId] = useState('');
  const [ticks, setTicks] = useState<Record<string, Effect>>({});
  const [groupOn, setGroupOn] = useState<Record<string, boolean>>({});
  const [scopeCountry, setScopeCountry] = useState('VN');
  const [scopeType, setScopeType] = useState('COUNTRY');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const groups = useMemo(() => groupPermissions(catalog), [catalog]);

  const load = useCallback(() => {
    Promise.all([
      adminApi.getPermissionCatalog().catch(() => ({ permissions: [] as string[] })),
      adminApi.getMyPermissions(),
      adminApi.getUsers().catch(() => ({ data: [] as unknown[] })),
    ])
      .then(([cat, me, userRes]) => {
        setCatalog(cat.permissions ?? []);
        setMine(me.permissions ?? []);
        setMyRole(me.role ?? '');
        const staff = ((userRes.data ?? []) as Array<Record<string, unknown>>).filter((u) =>
          ['SALES', 'CONTRACT_APPROVER', 'ADMIN', 'USER'].includes(String(u.role)),
        );
        setUsers(
          staff.map((u) => ({
            id: Number(u.id),
            email: String(u.email),
            role: String(u.role),
            firstName: (u.firstName as string) ?? null,
            lastName: (u.lastName as string) ?? null,
          })),
        );
        setUserId((prev) => (prev ? prev : staff[0] ? String(staff[0].id) : ''));
      })
      .catch((e: Error) => setMsg(e.message));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, [load]);

  const loadRole = useCallback(async (role: string) => {
    setBusy(true);
    try {
      const res = await adminApi.getRolePermissions(role);
      setRoleGranted(new Set(res.permissions ?? []));
      setSelectedAvail(new Set());
      setSelectedGranted(new Set());
      setMsg(`Loaded role ${role} (${(res.permissions ?? []).length} permissions)`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Load role failed');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'roles' && can('permission.manage')) {
      void loadRole(editRole);
    }
  }, [tab, editRole, can, loadRole]);

  const available = useMemo(
    () => catalog.filter((p) => !roleGranted.has(p)),
    [catalog, roleGranted],
  );

  function transfer(toGranted: boolean) {
    if (toGranted) {
      const next = new Set(roleGranted);
      for (const p of selectedAvail) next.add(p);
      setRoleGranted(next);
      setSelectedAvail(new Set());
    } else {
      const next = new Set(roleGranted);
      for (const p of selectedGranted) next.delete(p);
      setRoleGranted(next);
      setSelectedGranted(new Set());
    }
  }

  function toggleGroupRole(group: string, on: boolean) {
    const perms = groups[group] ?? [];
    const next = new Set(roleGranted);
    for (const p of perms) {
      if (on) next.add(p);
      else next.delete(p);
    }
    setRoleGranted(next);
    setGroupOn((g) => ({ ...g, [group]: on }));
  }

  async function saveRole() {
    setBusy(true);
    try {
      await adminApi.setRolePermissions(editRole, [...roleGranted].sort());
      setMsg(`Saved ${roleGranted.size} permissions for ${editRole}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save role failed');
    } finally {
      setBusy(false);
    }
  }

  async function loadUser(id = userId) {
    if (!id) return;
    setBusy(true);
    try {
      const d = await adminApi.getUserPermissionDetail(Number(id));
      const next: Record<string, Effect> = {};
      for (const p of catalog) next[p] = 'INHERIT';
      for (const o of (d.overrides as Array<{ permission: string; effect: Effect }>) ?? []) {
        next[o.permission] = o.effect;
      }
      setTicks(next);
      const scopes = (d.scopes as Array<{ scopeType?: string; countryCode?: string }>) ?? [];
      if (scopes[0]?.countryCode) {
        setScopeType(scopes[0].scopeType ?? 'COUNTRY');
        setScopeCountry(scopes[0].countryCode);
      }
      setMsg(`Loaded user #${id}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Load user failed');
    } finally {
      setBusy(false);
    }
  }

  function setGroupTicks(group: string, effect: Effect) {
    const perms = groups[group] ?? [];
    setTicks((t) => {
      const next = { ...t };
      for (const p of perms) next[p] = effect;
      return next;
    });
  }

  async function saveTicks() {
    if (!userId) return;
    setBusy(true);
    try {
      const overrides = Object.entries(ticks)
        .filter(([, effect]) => effect !== 'INHERIT')
        .map(([permission, effect]) => ({ permission, effect }));
      await adminApi.setUserPermissionOverrides(Number(userId), overrides);
      setMsg(`Saved ${overrides.length} overrides for user #${userId}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function saveScope() {
    if (!userId) return;
    setBusy(true);
    try {
      if (scopeType === 'ALL') {
        await adminApi.setUserAirportScopes(Number(userId), [{ scopeType: 'ALL' }]);
      } else if (scopeType === 'NONE') {
        await adminApi.setUserAirportScopes(Number(userId), [{ scopeType: 'NONE' }]);
      } else {
        await adminApi.setUserAirportScopes(Number(userId), [
          { scopeType: 'COUNTRY', countryCode: scopeCountry },
        ]);
      }
      setMsg(`Saved airport scope ${scopeType} for user #${userId}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Scope failed');
    } finally {
      setBusy(false);
    }
  }

  if (!can('permission.manage') && !can('user.manage')) {
    return (
      <AdminShell active="/dashboard/permissions">
        <SectionTitle>Permissions</SectionTitle>
        <Muted>You need permission.manage to edit RBAC.</Muted>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="/dashboard/permissions">
      <SectionTitle>Permissions & scopes</SectionTitle>
      <Muted>
        Role templates · per-user ALLOW/DENY · airport scope. Resolution: DENY &gt; ALLOW &gt; ROLE. Your
        role: {myRole || '—'}.
      </Muted>

      <div className="jb-tabs" role="tablist">
        {(
          [
            ['roles', 'Role groups'],
            ['users', 'Per user'],
            ['scope', 'Airport scope'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`jb-tabs__btn${tab === id ? ' is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {msg ? <p className="jb-perm__msg">{msg}</p> : null}

      <div className="jb-perm__panel">
        <Muted>My effective permissions ({mine.length})</Muted>
        <p className="jb-perm__mine">{mine.length ? mine.join(', ') : 'ADMIN bypass / none'}</p>
      </div>

      {tab === 'roles' ? (
        <div className="jb-perm__panel">
          <div className="jb-perm__toolbar">
            <label>
              Role{' '}
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as (typeof EDITABLE_ROLES)[number])}
              >
                {EDITABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <ActionBtn onClick={() => void loadRole(editRole)} disabled={busy}>
              Reload
            </ActionBtn>
            <ActionBtn onClick={() => void saveRole()} disabled={busy || !can('permission.manage')}>
              Save role
            </ActionBtn>
          </div>

          <div className="jb-perm__groups">
            {Object.keys(groups).map((g) => {
              const allOn = (groups[g] ?? []).every((p) => roleGranted.has(p));
              return (
                <label key={g} className="jb-perm__group-tick">
                  <input
                    type="checkbox"
                    checked={groupOn[g] ?? allOn}
                    onChange={(e) => toggleGroupRole(g, e.target.checked)}
                  />
                  <strong>{g}</strong>
                  <span>({groups[g]?.length ?? 0})</span>
                </label>
              );
            })}
          </div>

          <div className="jb-transfer">
            <div className="jb-transfer__col">
              <h4>Available</h4>
              <select
                multiple
                size={14}
                className="jb-transfer__list"
                value={[...selectedAvail]}
                onChange={(e) =>
                  setSelectedAvail(
                    new Set(Array.from(e.target.selectedOptions).map((o) => o.value)),
                  )
                }
              >
                {available.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="jb-transfer__actions">
              <Button type="button" onClick={() => transfer(true)} disabled={!selectedAvail.size}>
                → Grant
              </Button>
              <Button type="button" onClick={() => transfer(false)} disabled={!selectedGranted.size}>
                ← Revoke
              </Button>
            </div>
            <div className="jb-transfer__col">
              <h4>Granted ({roleGranted.size})</h4>
              <select
                multiple
                size={14}
                className="jb-transfer__list"
                value={[...selectedGranted]}
                onChange={(e) =>
                  setSelectedGranted(
                    new Set(Array.from(e.target.selectedOptions).map((o) => o.value)),
                  )
                }
              >
                {[...roleGranted].sort().map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Muted>ADMIN always bypasses the catalog — templates apply to SALES / CONTRACT_APPROVER.</Muted>
        </div>
      ) : null}

      {tab === 'users' ? (
        <div className="jb-perm__panel">
          <div className="jb-perm__toolbar">
            <label>
              User{' '}
              <select
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  void loadUser(e.target.value);
                }}
              >
                <option value="">Select…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    #{u.id} {u.email} ({u.role})
                  </option>
                ))}
              </select>
            </label>
            <ActionBtn onClick={() => void loadUser()} disabled={!userId || busy}>
              Load
            </ActionBtn>
            <ActionBtn onClick={() => void saveTicks()} disabled={!userId || busy}>
              Save overrides
            </ActionBtn>
          </div>

          <div className="jb-perm__groups">
            {Object.keys(groups).map((g) => (
              <div key={g} className="jb-perm__group-actions">
                <strong>{g}</strong>
                <ActionBtn onClick={() => setGroupTicks(g, 'ALLOW')}>All ALLOW</ActionBtn>
                <ActionBtn onClick={() => setGroupTicks(g, 'DENY')}>All DENY</ActionBtn>
                <ActionBtn onClick={() => setGroupTicks(g, 'INHERIT')}>All INHERIT</ActionBtn>
              </div>
            ))}
          </div>

          <div className="jb-perm__ticks">
            {catalog.map((p) => (
              <label key={p} className="jb-perm__tick-row">
                <code>{p}</code>
                {(['INHERIT', 'ALLOW', 'DENY'] as Effect[]).map((eff) => (
                  <span key={eff}>
                    <input
                      type="radio"
                      name={`perm-${p}`}
                      checked={(ticks[p] ?? 'INHERIT') === eff}
                      onChange={() => setTicks((t) => ({ ...t, [p]: eff }))}
                    />{' '}
                    {eff}
                  </span>
                ))}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'scope' ? (
        <div className="jb-perm__panel">
          <div className="jb-perm__toolbar">
            <label>
              User{' '}
              <select value={userId} onChange={(e) => setUserId(e.target.value)}>
                <option value="">Select…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    #{u.id} {u.email}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="jb-perm__field">
            Scope type{' '}
            <select value={scopeType} onChange={(e) => setScopeType(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="COUNTRY">COUNTRY</option>
              <option value="NONE">NONE</option>
            </select>
          </label>
          {scopeType === 'COUNTRY' ? (
            <AdminField label="Country code" value={scopeCountry} onChange={setScopeCountry} />
          ) : null}
          <ActionBtn onClick={() => void saveScope()} disabled={!userId || busy}>
            Save airport scope
          </ActionBtn>
          <Muted>COUNTRY=VN → staff only sees VN airports on admin airport lists.</Muted>
        </div>
      ) : null}
    </AdminShell>
  );
}
