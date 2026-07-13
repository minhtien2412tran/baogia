'use client';

import { useRouter } from 'next/navigation';
import { clearToken } from '../lib/api';

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/bookings', label: 'Bookings' },
  { href: '/dashboard/fixed-price', label: 'Fixed Price' },
  { href: '/dashboard/empty-legs', label: 'Empty Legs' },
  { href: '/dashboard/jet-card', label: 'Jet Card' },
  { href: '/dashboard/travel-credits', label: 'Travel Credits' },
  { href: '/dashboard/aircraft', label: 'Aircraft' },
  { href: '/dashboard/contracts', label: 'Contracts' },
  { href: '/dashboard/permissions', label: 'Permissions' },
  { href: '/dashboard/partners', label: 'Partners' },
  { href: '/dashboard/content', label: 'Articles' },
  { href: '/dashboard/content-sources', label: 'Content Sources' },
  { href: '/dashboard/content-sync', label: 'Content Sync' },
  { href: '/dashboard/content-rights', label: 'Content Rights' },
  { href: '/dashboard/media-review', label: 'Media Review' },
  { href: '/dashboard/jetbay-cleanup', label: 'JetBay Cleanup' },
  { href: '/dashboard/content/pages', label: 'CMS Pages' },
  { href: '/dashboard/content/videos', label: 'Videos' },
  { href: '/dashboard/content/about-us', label: 'About Us CMS' },
  { href: '/dashboard/content/booking-process', label: 'Booking Process' },
  { href: '/dashboard/destinations', label: 'Destinations' },
  { href: '/dashboard/airports', label: 'Airports' },
  { href: '/dashboard/operators', label: 'Operators' },
  { href: '/dashboard/email-templates', label: 'Email Templates' },
  { href: '/dashboard/media', label: 'Media' },
  { href: '/dashboard/users', label: 'Users' },
  { href: '/dashboard/audit-logs', label: 'Audit Logs' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function AdminShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();

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
            JetBay Admin
          </div>
          <button type="button" className="jb-shell__logout" onClick={logout}>
            Logout
          </button>
        </div>
        <nav className="jb-shell__nav" aria-label="Admin">
          {nav.map((n) => (
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
