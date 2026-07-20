/** Admin UI preferences (nav order, widget order, section toggles) — localStorage. */

import {
  DEFAULT_NAV_SECTIONS,
  NAV_SECTION_LABELS,
  type NavSectionId,
} from './adminNav';

export type { NavSectionId };
export { DEFAULT_NAV_SECTIONS, NAV_SECTION_LABELS };

const WIDGET_KEY = 'jetvina_admin_dashboard_widgets';
const SECTION_KEY = 'jetvina_admin_nav_sections';
const GROUP_ORDER_KEY = 'jetvina_admin_nav_group_order';
const OPEN_GROUPS_KEY = 'jetvina_admin_nav_open';

export const DEFAULT_DASHBOARD_WIDGETS = [
  'stats',
  'revenue',
  'quotes',
  'bookings',
] as const;

export type DashboardWidgetId = (typeof DEFAULT_DASHBOARD_WIDGETS)[number];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDashboardWidgetOrder(): DashboardWidgetId[] {
  const saved = readJson<string[]>(WIDGET_KEY, [...DEFAULT_DASHBOARD_WIDGETS]);
  const allowed = new Set<string>(DEFAULT_DASHBOARD_WIDGETS);
  const ordered = saved.filter((id): id is DashboardWidgetId => allowed.has(id));
  for (const id of DEFAULT_DASHBOARD_WIDGETS) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  return ordered;
}

export function setDashboardWidgetOrder(ids: DashboardWidgetId[]) {
  writeJson(WIDGET_KEY, ids);
}

export function getNavSectionToggles(): Record<NavSectionId, boolean> {
  const raw = readJson<Partial<Record<string, boolean>>>(SECTION_KEY, {});
  // Migrate legacy `contracts` key → `legal`
  if (raw.contracts != null && raw.legal == null) {
    raw.legal = raw.contracts;
  }
  return { ...DEFAULT_NAV_SECTIONS, ...(raw as Partial<Record<NavSectionId, boolean>>) };
}

export function setNavSectionToggles(value: Record<NavSectionId, boolean>) {
  writeJson(SECTION_KEY, value);
}

export function getNavGroupOrder(defaultIds: NavSectionId[]): NavSectionId[] {
  const saved = readJson<string[]>(GROUP_ORDER_KEY, []);
  if (!saved.length) return defaultIds;
  const set = new Set(defaultIds);
  const ordered = saved.filter((id): id is NavSectionId => set.has(id as NavSectionId));
  for (const id of defaultIds) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  return ordered;
}

export function setNavGroupOrder(ids: NavSectionId[]) {
  writeJson(GROUP_ORDER_KEY, ids);
}

export function getOpenGroups(defaultOpen: NavSectionId[]): Set<NavSectionId> {
  const saved = readJson<string[] | null>(OPEN_GROUPS_KEY, null);
  if (!saved) return new Set(defaultOpen);
  return new Set(saved.filter((id): id is NavSectionId => Boolean(id)));
}

export function setOpenGroups(ids: Set<NavSectionId>) {
  writeJson(OPEN_GROUPS_KEY, [...ids]);
}

export function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return list;
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

/** Group permission keys by prefix before first `.` */
export function groupPermissions(catalog: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const p of catalog) {
    const group = p.includes('.') ? p.split('.')[0] : 'other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(p);
  }
  for (const g of Object.keys(groups)) groups[g].sort();
  return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
}

/** Clear legacy flat nav-order key (no longer used). */
export function clearLegacyNavOrder() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jetvina_admin_nav_order');
}
