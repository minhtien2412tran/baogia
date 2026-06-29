'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MEGA_MENU, QUICK_LINKS, navHref } from '../../config/navigation';
import { LocaleCurrencySelector } from './LocaleCurrencySelector';

export function JetBayHeader({ locale, currency = 'USD' }: { locale: string; currency?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setExpanded(null);
  }

  return (
    <>
      <header className="jb-header">
        <div className="jb-header-inner">
          <button type="button" className="jb-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <span className="jb-menu-icon" aria-hidden>☰</span>
            <span className="jb-menu-label jb-hide-mobile">Menu</span>
          </button>
          <Link href={navHref(locale, '')} className="jb-logo">J-TA</Link>
          <nav className="jb-desktop-nav jb-hide-mobile" aria-label="Main">
            {MEGA_MENU.slice(0, 4).map((group) => (
              <div key={group.title} className="jb-nav-dropdown">
                <button type="button" className="jb-nav-trigger">{group.title}</button>
                <div className="jb-nav-panel">
                  {group.links.map((link) => (
                    <Link key={link.href} href={navHref(locale, link.href)} className="jb-nav-panel-link">
                      <strong>{link.label}</strong>
                      {link.description && <span>{link.description}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="jb-nav-trigger"
              onClick={() => setMenuOpen(true)}
            >
              More
            </button>
          </nav>
          <div className="jb-header-actions">
            <LocaleCurrencySelector locale={locale} currency={currency} />
            <Link href={navHref(locale, '/login')} className="jb-header-link jb-hide-mobile">Log In</Link>
            <Link href={navHref(locale, '/private-jet-charter')} className="jb-btn-contact">
              <span aria-hidden>📞</span> Contact Us
            </Link>
          </div>
        </div>
      </header>

      <div className={`jb-mega-overlay${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="jb-mega-backdrop" onClick={closeMenu} />
        <div className="jb-mega-panel">
          <div className="jb-mega-header">
            <span className="jb-logo">J-TA</span>
            <button type="button" className="jb-menu-btn" onClick={closeMenu} aria-label="Close menu">✕</button>
          </div>
          <div className="jb-mega-grid">
            {MEGA_MENU.map((group) => (
              <div key={group.title} className="jb-mega-group">
                <button
                  type="button"
                  className={`jb-mega-group-title${expanded === group.title ? ' open' : ''}`}
                  onClick={() => setExpanded(expanded === group.title ? null : group.title)}
                >
                  {group.title}
                  <span className="jb-mega-chevron">{expanded === group.title ? '−' : '+'}</span>
                </button>
                <ul className={`jb-mega-links${expanded === group.title ? ' expanded' : ''}`}>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={navHref(locale, link.href)} onClick={closeMenu}>
                        {link.label}
                        {link.description && <small>{link.description}</small>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="jb-mega-footer">
            {QUICK_LINKS.map((l) => (
              <Link key={l.href} href={navHref(locale, l.href)} onClick={closeMenu}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
