'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { t } from '../../lib/i18n';

const links: { href: string; key: 'overview' | 'myQuotes' | 'jetCard' | 'travelCredits' | 'payments' | 'documents' }[] = [
  { href: '', key: 'overview' },
  { href: '/quotes', key: 'myQuotes' },
  { href: '/jet-card', key: 'jetCard' },
  { href: '/travel-credits', key: 'travelCredits' },
  { href: '/payments', key: 'payments' },
  { href: '/documents', key: 'documents' },
];

export function AccountShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const base = `/${locale}/account`;

  async function logout() {
    const refreshToken = localStorage.getItem('jetbay_refresh_token');
    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch {
        /* revoke best-effort */
      }
    }
    localStorage.removeItem('jetbay_token');
    localStorage.removeItem('jetbay_refresh_token');
    localStorage.removeItem('jetbay_user_id');
    router.push(`/${locale}/login`);
  }

  return (
    <main className="jb-subpage">
      <div className="jb-container jb-sub-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 className="jb-auth-title" style={{ margin: 0 }}>
            {t(locale, 'myAccount')}
          </h1>
          <button type="button" className="jb-btn jb-btn-ghost" onClick={logout}>
            {t(locale, 'logout')}
          </button>
        </div>

        <nav className="jb-account-nav" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          {links.map((l) => {
            const href = `${base}${l.href}`;
            const active = l.href === '' ? pathname === base : pathname?.startsWith(href);
            return (
              <Link
                key={l.href}
                href={href}
                style={{
                  color: active ? '#c9a84c' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {t(locale, l.key)}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </main>
  );
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jetbay_token');
}

export function useAccountAuth(locale: string) {
  const router = useRouter();

  function requireToken(): string | null {
    const token = getToken();
    if (!token) {
      router.push(`/${locale}/login`);
      return null;
    }
    return token;
  }

  return { requireToken };
}
