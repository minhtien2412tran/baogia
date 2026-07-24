'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMegaMenu, tn } from '@jetbay/i18n';
import { navHref, navLinkIcon } from '../../config/navigation';
import { CdnImage } from '../ui/CdnImage';
import { BrandLogo } from '../brand/BrandLogo';
import { JETVINA_OFFICIAL_LOGO_ENABLED } from '../../lib/brand';
import { AppIcon } from '../ui/AppIcon';
import { IconButton } from '../ui/IconButton';
import { LanguagePicker, LocaleCurrencySelector } from './LocaleCurrencySelector';
import { HeaderUserMenu, MegaMenuAuthLinks } from './HeaderUserMenu';
import { t } from '../../lib/i18n';

export function JetBayHeader({ locale, currency = 'USD' }: { locale: string; currency?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const menu = getMegaMenu(locale);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  const currentGroup = menu[activeGroupIdx] ?? menu[0];

  return (
    <>
      <header className="jb-header">
        <div className="jb-header-inner">
          <button type="button" className="jb-menu-btn icon-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <span className="jb-menu-icon" aria-hidden>
              <AppIcon name="menu" size="md" />
            </span>
            <span className="jb-menu-label jb-hide-mobile">{t(locale, 'menu')}</span>
          </button>
          <Link href={navHref(locale, '')} className="jb-logo-link brand-logo-link">
            <BrandLogo context="header" priority officialLogoEnabled={JETVINA_OFFICIAL_LOGO_ENABLED} />
          </Link>
          <nav className="jb-desktop-nav jb-hide-mobile" aria-label="Main">
            {menu.slice(0, 4).map((group) => (
              <div key={group.title} className="jb-nav-dropdown">
                <button type="button" className="jb-nav-trigger">{group.title}</button>
                <div className="jb-nav-panel">
                  {group.links.map((link) => {
                    const icon = navLinkIcon(link.href);
                    return (
                      <Link key={link.href} href={navHref(locale, link.href)} className="jb-nav-panel-link">
                        {icon ? (
                          <span className="jb-nav-panel-icon" aria-hidden>
                            <CdnImage src={icon} alt="" width={28} height={28} />
                          </span>
                        ) : null}
                        <span className="jb-nav-panel-text">
                          <strong>{link.label}</strong>
                          {link.description && <span>{link.description}</span>}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <button type="button" className="jb-nav-trigger" onClick={() => setMenuOpen(true)}>
              {tn(locale, 'more')}
            </button>
          </nav>
          <div className="jb-header-actions">
            <LocaleCurrencySelector locale={locale} currency={currency} />
            <HeaderUserMenu locale={locale} />
            <Link href={navHref(locale, '/contact')} className="jb-btn-contact">
              <AppIcon name="phone" size="sm" aria-hidden />
              {t(locale, 'contactUs')}
            </Link>
          </div>
        </div>
      </header>

      <div className={`jb-mega-overlay${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="jb-mega-backdrop" onClick={closeMenu} />
        <div className="jb-mega-panel jb-mega-vertical-panel">
          <div className="jb-mega-header">
            <BrandLogo context="mobile" officialLogoEnabled={JETVINA_OFFICIAL_LOGO_ENABLED} />
            <IconButton name="close" label="Close menu" onClick={closeMenu} />
          </div>

          <div className="jb-mega-lang">
            <LanguagePicker locale={locale} className="jb-lang-picker--mobile" />
          </div>

          <div className="jb-mega-vertical">
            <nav className="jb-mega-sidebar" aria-label="Menu categories">
              {menu.map((group, idx) => (
                <button
                  key={group.title}
                  type="button"
                  className={`jb-mega-sidebar-item${activeGroupIdx === idx ? ' active' : ''}`}
                  onClick={() => setActiveGroupIdx(idx)}
                >
                  {group.title}
                </button>
              ))}
            </nav>

            <div className="jb-mega-content">
              <h2 className="jb-mega-content-title">{currentGroup?.title}</h2>
              <ul className="jb-mega-link-list">
                {currentGroup?.links.map((link) => {
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
            <MegaMenuAuthLinks locale={locale} onNavigate={closeMenu} />
          </div>
        </div>
      </div>
    </>
  );
}
