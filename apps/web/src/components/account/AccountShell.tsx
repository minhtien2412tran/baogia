'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAccount } from './AccountContext';
import { AccountMotion, AccountSkeleton } from './AccountUI';
import { t } from '../../lib/i18n';

const links: { href: string; key: 'overview' | 'manageTrips' | 'myQuotes' | 'jetCard' | 'travelCredits' | 'payments' | 'documents' }[] = [
  { href: '', key: 'overview' },
  { href: '/bookings', key: 'manageTrips' },
  { href: '/quotes', key: 'myQuotes' },
  { href: '/jet-card', key: 'jetCard' },
  { href: '/travel-credits', key: 'travelCredits' },
  { href: '/payments', key: 'payments' },
  { href: '/documents', key: 'documents' },
];

export function AccountLayoutInner({ locale, children }: { locale: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const { data, loading, error, displayName, initials, logout, refresh } = useAccount();
  const base = `/${locale}/account`;

  return (
    <main className="jb-subpage jb-account-page">
      <AccountMotion />
      <div className="jb-container">
        <div className="jb-account-layout">
          <aside className="jb-account-sidebar jb-motion-reveal">
            <div className="jb-account-user-card">
              {data?.profile.avatarUrl ? (
                <img className="jb-account-avatar jb-account-avatar--image" src={data.profile.avatarUrl} alt="" />
              ) : (
                <span className="jb-account-avatar" aria-hidden>{initials}</span>
              )}
              <div className="jb-account-user-meta">
                <strong>{displayName || t(locale, 'myAccount')}</strong>
                {data?.profile.email && <span>{data.profile.email}</span>}
                {data?.profile.phone && <span>{data.profile.phone}</span>}
                {data?.profile.accountType && (
                  <span className="jb-account-badge">{data.profile.accountType}</span>
                )}
              </div>
            </div>

            <nav className="jb-account-nav" aria-label={t(locale, 'myAccount')}>
              {links.map((l) => {
                const href = `${base}${l.href}`;
                const active = l.href === '' ? pathname === base : pathname?.startsWith(href);
                const count =
                  l.key === 'myQuotes'
                    ? data?.stats.quotes
                    : l.key === 'payments'
                      ? data?.stats.payments
                      : l.key === 'documents'
                        ? data?.stats.documents
                        : undefined;
                return (
                  <Link
                    key={l.href}
                    href={href}
                    className={`jb-account-nav-link${active ? ' active' : ''}`}
                  >
                    <span>{t(locale, l.key)}</span>
                    {count !== undefined && count > 0 && (
                      <span className="jb-account-nav-count">{count}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {data?.profile.role && ['ADMIN', 'SALES', 'CONTRACT_APPROVER'].includes(data.profile.role) && (
              <a
                className="jb-account-system-link"
                href="https://admin.minhtien.online/dashboard"
                target="_blank"
                rel="noreferrer"
              >
                <span className="jb-account-system-link__icon" aria-hidden>↗</span>
                <span>
                  <strong>{t(locale, 'systemDashboard')}</strong>
                  <small>CRM, quotes and bookings</small>
                </span>
              </a>
            )}

            <button type="button" className="jb-account-logout" onClick={() => void logout()}>
              {t(locale, 'logout')}
            </button>
          </aside>

          <div className="jb-account-main">
            {loading ? (
              <AccountSkeleton />
            ) : error ? (
              <div className="jb-account-panel jb-account-panel--error" role="alert">
                <h2>{t(locale, 'accountLoadFailed')}</h2>
                <p className="jb-account-meta">{t(locale, 'accountLoadFailedHint')}</p>
                <p className="jb-account-meta jb-account-error-detail">{error}</p>
                <div className="jb-account-actions">
                  <button type="button" className="jb-btn-primary" onClick={() => void refresh()}>
                    {t(locale, 'retry')}
                  </button>
                  <Link href={`/${locale}/login`} className="jb-btn-ghost">
                    {t(locale, 'login')}
                  </Link>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/** @deprecated Use account layout AccountLayoutClient — kept for pages not yet migrated */
export function AccountShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  return <AccountLayoutInner locale={locale}>{children}</AccountLayoutInner>;
}

export function useAccountAuth(locale: string) {
  const router = useRouter();

  function requireToken(): string | null {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jetbay_token') : null;
    if (!token) {
      router.push(`/${locale}/login`);
      return null;
    }
    return token;
  }

  return { requireToken };
}
