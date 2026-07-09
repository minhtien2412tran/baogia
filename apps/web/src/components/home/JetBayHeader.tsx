'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MEGA_MENU, QUICK_LINKS, navHref, navLinkIcon } from '../../config/navigation';
import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';
import { LocaleCurrencySelector } from './LocaleCurrencySelector';
import { t } from '../../lib/i18n';

export function JetBayHeader({ locale, currency = 'USD' }: { locale: string; currency?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(MEGA_MENU[0].title);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  const currentGroup = MEGA_MENU.find((g) => g.title === activeGroup) ?? MEGA_MENU[0];

  return (
    <>
      <header className="jb-header">
        <div className="jb-header-inner">
          <button type="button" className="jb-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <span className="jb-menu-icon" aria-hidden>
              <CdnImage src={JB.globalIcon} alt="" width={20} height={20} className="jb-header-icon" />
            </span>
            <span className="jb-menu-label jb-hide-mobile">{t(locale, 'menu')}</span>
          </button>
          <Link href={navHref(locale, '')} className="jb-logo-link">
            <CdnImage src={JB.logo} alt="JetBay" width={120} height={32} className="jb-logo-img" priority />
          </Link>
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
            <button type="button" className="jb-nav-trigger" onClick={() => setMenuOpen(true)}>
              More
            </button>
          </nav>
          <div className="jb-header-actions">
            <LocaleCurrencySelector locale={locale} currency={currency} />
            <Link href={navHref(locale, '/login')} className="jb-header-link jb-hide-mobile">{t(locale, 'login')}</Link>
            <Link href={navHref(locale, '/private-jet-charter')} className="jb-btn-contact">
              <CdnImage src={JB.callIcon} alt="" width={16} height={16} className="jb-header-icon-sm" />
              {t(locale, 'contactUs')}
            </Link>
          </div>
        </div>
      </header>

      <div className={`jb-mega-overlay${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="jb-mega-backdrop" onClick={closeMenu} />
        <div className="jb-mega-panel jb-mega-vertical-panel">
          <div className="jb-mega-header">
            <CdnImage src={JB.logo} alt="JetBay" width={100} height={28} className="jb-logo-img" />
            <button type="button" className="jb-menu-btn" onClick={closeMenu} aria-label="Close menu">✕</button>
          </div>

          <div className="jb-mega-vertical">
            <nav className="jb-mega-sidebar" aria-label="Menu categories">
              {MEGA_MENU.map((group) => (
                <button
                  key={group.title}
                  type="button"
                  className={`jb-mega-sidebar-item${activeGroup === group.title ? ' active' : ''}`}
                  onClick={() => setActiveGroup(group.title)}
                >
                  {group.title}
                </button>
              ))}
            </nav>

            <div className="jb-mega-content">
              <h2 className="jb-mega-content-title">{currentGroup.title}</h2>
              <ul className="jb-mega-link-list">
                {currentGroup.links.map((link) => {
                  const icon = navLinkIcon(link.href);
                  return (
                    <li key={link.href}>
                      <Link href={navHref(locale, link.href)} className="jb-mega-link-item" onClick={closeMenu}>
                        {icon && (
                          <span className="jb-mega-link-icon">
                            <CdnImage src={icon} alt="" width={40} height={40} className="jb-cdn-icon" />
                          </span>
                        )}
                        <span className="jb-mega-link-text">
                          <strong>{link.label}</strong>
                          {link.description && <small>{link.description}</small>}
                        </span>
                        <span className="jb-mega-link-arrow" aria-hidden>›</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
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
