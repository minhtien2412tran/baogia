'use client';

import { useRouter } from 'next/navigation';
import { PageShell, colors } from '@j-ta/ui';
import { clearToken } from '../lib/api';

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/bookings', label: 'Bookings' },
  { href: '/dashboard/fixed-price', label: 'Fixed Price' },
  { href: '/dashboard/empty-legs', label: 'Empty Legs' },
  { href: '/dashboard/jet-card', label: 'Jet Card' },
  { href: '/dashboard/travel-credits', label: 'Travel Credits' },
  { href: '/dashboard/partners', label: 'Partners' },
  { href: '/dashboard/content', label: 'Content' },
  { href: '/dashboard/content/about-us', label: 'About Us CMS' },
  { href: '/dashboard/content/booking-process', label: 'Booking Process CMS' },
  { href: '/dashboard/destinations', label: 'Destinations' },
  { href: '/dashboard/airports', label: 'Airports' },
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
    <PageShell>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <aside style={{ minWidth: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ color: colors.accent, margin: 0 }}>J-TA Admin</h2>
            <button type="button" onClick={logout} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 12 }}>
              Logout
            </button>
          </div>
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{
                display: 'block',
                padding: '8px 0',
                color: active === n.href ? colors.accent : colors.textMuted,
                textDecoration: 'none',
                fontSize: 14,
              }}
            >
              {n.label}
            </a>
          ))}
        </aside>
        <main style={{ flex: 1, minWidth: 280 }}>{children}</main>
      </div>
    </PageShell>
  );
}
