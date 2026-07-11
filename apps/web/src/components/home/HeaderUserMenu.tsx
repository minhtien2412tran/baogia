'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { navHref } from '../../config/navigation';
import { t } from '../../lib/i18n';
import { useAuthSession, useLogout, userDisplayName, userInitials } from '../auth/useAuthSession';

const ACCOUNT_LINKS = [
  { href: '/account', key: 'overview' as const },
  { href: '/account/quotes', key: 'myQuotes' as const },
  { href: '/account/jet-card', key: 'jetCard' as const },
  { href: '/account/travel-credits', key: 'travelCredits' as const },
  { href: '/account/payments', key: 'payments' as const },
  { href: '/account/documents', key: 'documents' as const },
];

export function HeaderUserMenu({ locale }: { locale: string }) {
  const { loggedIn, user, loading } = useAuthSession();
  const logout = useLogout(locale);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  if (loading) {
    return <span className="jb-header-auth-skeleton jb-hide-mobile" aria-hidden />;
  }

  if (!loggedIn) {
    return (
      <div className="jb-header-auth jb-hide-mobile">
        <Link href={navHref(locale, '/login')} className="jb-header-link">{t(locale, 'login')}</Link>
        <Link href={navHref(locale, '/register')} className="jb-header-link jb-header-link--muted">
          {t(locale, 'register')}
        </Link>
      </div>
    );
  }

  const name = userDisplayName(user);
  const initials = userInitials(user);

  return (
    <div className={`jb-header-user${open ? ' open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="jb-header-user__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="jb-header-user__avatar" aria-hidden>{initials}</span>
        <span className="jb-header-user__name jb-hide-mobile">{name}</span>
        <span className="jb-header-user__chev" aria-hidden>▾</span>
      </button>

      {open && (
        <div className="jb-header-user__panel" role="menu">
          <div className="jb-header-user__profile">
            <span className="jb-header-user__avatar jb-header-user__avatar--lg">{initials}</span>
            <div>
              <strong>{name}</strong>
              {user?.email && <span className="jb-header-user__email">{user.email}</span>}
            </div>
          </div>
          <div className="jb-header-user__links">
            {ACCOUNT_LINKS.map((l) => (
              <Link
                key={l.href}
                href={navHref(locale, l.href)}
                className="jb-header-user__link"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {t(locale, l.key)}
              </Link>
            ))}
          </div>
          <button type="button" className="jb-header-user__logout" onClick={() => void logout()}>
            {t(locale, 'logout')}
          </button>
        </div>
      )}
    </div>
  );
}

/** Mobile mega-menu auth block */
export function MegaMenuAuthLinks({ locale, onNavigate }: { locale: string; onNavigate?: () => void }) {
  const { loggedIn, user } = useAuthSession();
  const logout = useLogout(locale);

  if (!loggedIn) {
    return (
      <>
        <Link href={navHref(locale, '/login')} onClick={onNavigate}>{t(locale, 'login')}</Link>
        <Link href={navHref(locale, '/register')} onClick={onNavigate}>{t(locale, 'register')}</Link>
      </>
    );
  }

  return (
    <>
      <Link href={navHref(locale, '/account')} onClick={onNavigate}>
        {t(locale, 'myAccount')}{user ? ` · ${userDisplayName(user)}` : ''}
      </Link>
      <button
        type="button"
        className="jb-mega-footer-btn"
        onClick={() => {
          onNavigate?.();
          void logout();
        }}
      >
        {t(locale, 'logout')}
      </button>
    </>
  );
}
