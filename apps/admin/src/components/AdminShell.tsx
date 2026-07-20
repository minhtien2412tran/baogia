'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, clearToken } from '../lib/api';

const nav = [
  { href: '/dashboard', label: 'Overview', permission: 'dashboard.view' },
  { href: '/dashboard/quotes', label: 'Quotes', permission: 'quote.view' },
  { href: '/dashboard/bookings', label: 'Bookings', permission: 'booking.view' },
  { href: '/dashboard/fixed-price', label: 'Fixed Price', permission: 'fixed_price.view' },
  { href: '/dashboard/empty-legs', label: 'Empty Legs', permission: 'empty_leg.view' },
  { href: '/dashboard/jet-card', label: 'Jet Card', permission: 'jet_card.view' },
  { href: '/dashboard/travel-credits', label: 'Travel Credits', permission: 'travel_credit.view' },
  { href: '/dashboard/aircraft', label: 'Aircraft', permission: 'aircraft.view' },
  { href: '/dashboard/contracts', label: 'Contracts', permission: 'contract.view' },
  { href: '/dashboard/permissions', label: 'Permissions', permission: 'permission.manage' },
  { href: '/dashboard/partners', label: 'Partners', permission: 'partner.view' },
  { href: '/dashboard/content', label: 'Articles', permission: 'content.view' },
  { href: '/dashboard/content-sources', label: 'Content Sources', permission: 'content_source.view' },
  { href: '/dashboard/content-sync', label: 'Content Sync', permission: 'content_sync.discover' },
  { href: '/dashboard/content-rights', label: 'Content Rights', permission: 'content_rights.view' },
  { href: '/dashboard/media-review', label: 'Media Review', permission: 'content_media.view' },
  { href: '/dashboard/jetbay-cleanup', label: 'Brand Cleanup', permission: 'content_source.view' },
  { href: '/dashboard/content/pages', label: 'CMS Pages', permission: 'content.view' },
  { href: '/dashboard/content/videos', label: 'Videos', permission: 'content.view' },
  { href: '/dashboard/content/about-us', label: 'About Us CMS', permission: 'content.view' },
  { href: '/dashboard/content/booking-process', label: 'Booking Process', permission: 'content.view' },
  { href: '/dashboard/destinations', label: 'Destinations', permission: 'content.view' },
  { href: '/dashboard/airports', label: 'Airports', permission: 'airport.view' },
  { href: '/dashboard/operators', label: 'Operators', permission: 'operator.view' },
  { href: '/dashboard/email-templates', label: 'Email Templates', permission: 'email_template.view' },
  { href: '/dashboard/media', label: 'Media', permission: 'content_media.view' },
  { href: '/dashboard/users', label: 'Users', permission: 'user.manage' },
  { href: '/dashboard/audit-logs', label: 'Audit Logs', permission: 'audit.view' },
  { href: '/dashboard/settings', label: 'Settings', permission: 'settings.view' },
];

export function AdminShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Set<string> | null>(null);

  useEffect(() => {
    let mounted = true;
    void adminApi.getMyPermissions()
      .then((data) => {
        if (mounted) setPermissions(new Set(data.permissions));
      })
      .catch(() => {
        if (mounted) setPermissions(new Set());
      });
    return () => {
      mounted = false;
    };
  }, []);

  function logout() {
    clearToken();
    router.push('/login');
  }

  return (
    <div className="jb-shell">
      <aside className="jb-shell__aside">
        <div className="jb-shell__brand-row">
          <div className="jb-shell__brand">
            <span className="jb-shell__mark" aria-hidden>
              JB
            </span>
            JetVina Admin
          </div>
          <button type="button" className="jb-shell__logout" onClick={logout}>
            Logout
          </button>
        </div>
        <nav className="jb-shell__nav" aria-label="Admin">
          {nav.filter((n) => permissions === null || permissions.has(n.permission)).map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`jb-shell__link${active === n.href ? ' is-active' : ''}`}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="jb-shell__main">{children}</main>
    </div>
  );
}
