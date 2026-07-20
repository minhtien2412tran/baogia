/** Hierarchical Admin nav — source of truth for sidebar tree. */

export type NavSectionId =
  | 'ops'
  | 'commercial'
  | 'fleet'
  | 'legal'
  | 'content'
  | 'system';

export type NavLeaf = {
  href: string;
  label: string;
  permission: string;
};

export type NavGroup = {
  id: NavSectionId;
  label: string;
  /** Any of these unlocks the group header (OR). */
  permissions: string[];
  children: NavLeaf[];
};

export type NavRootLink = {
  href: string;
  label: string;
  permission: string;
};

export const NAV_ROOT: NavRootLink = {
  href: '/dashboard',
  label: 'Overview',
  permission: 'dashboard.view',
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'ops',
    label: 'Operations',
    permissions: ['quote.view', 'booking.view', 'payment.view', 'user.manage'],
    children: [
      { href: '/dashboard/schedule', label: 'Flight calendar', permission: 'dashboard.view' },
      { href: '/dashboard/quotes', label: 'Quotes', permission: 'quote.view' },
      { href: '/dashboard/bookings', label: 'Bookings', permission: 'booking.view' },
      { href: '/dashboard/payments', label: 'Payments', permission: 'payment.view' },
      { href: '/dashboard/users', label: 'Users', permission: 'user.manage' },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    permissions: [
      'fixed_price.view',
      'empty_leg.view',
      'jet_card.view',
      'travel_credit.view',
      'partner.view',
    ],
    children: [
      { href: '/dashboard/fixed-price', label: 'Fixed Price', permission: 'fixed_price.view' },
      { href: '/dashboard/empty-legs', label: 'Empty Legs', permission: 'empty_leg.view' },
      { href: '/dashboard/jet-card', label: 'Jet Card', permission: 'jet_card.view' },
      { href: '/dashboard/travel-credits', label: 'Travel Credits', permission: 'travel_credit.view' },
      { href: '/dashboard/partners', label: 'Partners', permission: 'partner.view' },
    ],
  },
  {
    id: 'fleet',
    label: 'Fleet',
    permissions: ['aircraft.view', 'airport.view', 'operator.view'],
    children: [
      { href: '/dashboard/aircraft', label: 'Aircraft', permission: 'aircraft.view' },
      { href: '/dashboard/airports', label: 'Airports', permission: 'airport.view' },
      { href: '/dashboard/operators', label: 'Operators', permission: 'operator.view' },
    ],
  },
  {
    id: 'legal',
    label: 'Legal & access',
    permissions: ['contract.view', 'permission.manage'],
    children: [
      { href: '/dashboard/contracts', label: 'Contracts', permission: 'contract.view' },
      { href: '/dashboard/permissions', label: 'Permissions', permission: 'permission.manage' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    permissions: [
      'content.view',
      'content_source.view',
      'content_sync.discover',
      'content_rights.view',
      'content_media.view',
    ],
    children: [
      { href: '/dashboard/content', label: 'Articles', permission: 'content.view' },
      { href: '/dashboard/content/pages', label: 'Pages', permission: 'content.view' },
      { href: '/dashboard/content/videos', label: 'Videos', permission: 'content.view' },
      { href: '/dashboard/destinations', label: 'Destinations', permission: 'content.view' },
      { href: '/dashboard/content/about-us', label: 'About Us', permission: 'content.view' },
      {
        href: '/dashboard/content/booking-process',
        label: 'Booking Process',
        permission: 'content.view',
      },
      { href: '/dashboard/media', label: 'Media library', permission: 'content_media.view' },
      { href: '/dashboard/media-review', label: 'Media review', permission: 'content_media.view' },
      { href: '/dashboard/content-sources', label: 'Sources', permission: 'content_source.view' },
      { href: '/dashboard/content-sync', label: 'Sync', permission: 'content_sync.discover' },
      { href: '/dashboard/content-rights', label: 'Rights', permission: 'content_rights.view' },
      { href: '/dashboard/jetbay-cleanup', label: 'Brand cleanup', permission: 'content_source.view' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    permissions: ['email_template.view', 'audit.view', 'settings.view'],
    children: [
      {
        href: '/dashboard/email-templates',
        label: 'Email templates',
        permission: 'email_template.view',
      },
      { href: '/dashboard/audit-logs', label: 'Audit logs', permission: 'audit.view' },
      { href: '/dashboard/settings', label: 'Settings', permission: 'settings.view' },
    ],
  },
];

export const NAV_SECTION_LABELS: Record<NavSectionId, string> = Object.fromEntries(
  NAV_GROUPS.map((g) => [g.id, g.label]),
) as Record<NavSectionId, string>;

export const DEFAULT_NAV_SECTIONS: Record<NavSectionId, boolean> = {
  ops: true,
  commercial: true,
  fleet: true,
  legal: true,
  content: true,
  system: true,
};

export function allNavHrefs(): string[] {
  return [NAV_ROOT.href, ...NAV_GROUPS.flatMap((g) => g.children.map((c) => c.href))];
}

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function findActiveGroupId(pathname: string | null): NavSectionId | null {
  if (!pathname) return null;
  for (const g of NAV_GROUPS) {
    if (g.children.some((c) => isNavActive(pathname, c.href))) return g.id;
  }
  return null;
}
