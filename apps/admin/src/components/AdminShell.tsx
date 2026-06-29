'use client';

import { PageShell, colors } from '@j-ta/ui';

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/bookings', label: 'Bookings' },
  { href: '/dashboard/fixed-price', label: 'Fixed Price' },
  { href: '/dashboard/empty-legs', label: 'Empty Legs' },
  { href: '/dashboard/content', label: 'Content' },
  { href: '/dashboard/audit-logs', label: 'Audit Logs' },
];

export function AdminShell({ children, active }: { children: React.ReactNode; active?: string }) {
  return (
    <PageShell>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <aside style={{ minWidth: 180 }}>
          <h2 style={{ color: colors.accent, margin: '0 0 16px' }}>J-TA Admin</h2>
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
