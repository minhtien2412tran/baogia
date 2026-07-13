import { BRAND_LEGAL, JETVINA_OFFICIAL_LOGO_ENABLED, SHOW_UNVERIFIED_PARTNER_LOGOS } from '../../lib/brand';
import Link from 'next/link';
import { getFooterCompany, getFooterServices, tn } from '@jetbay/i18n';
import { navHref } from '../../config/navigation';
import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';
import { BrandLogo } from '../brand/BrandLogo';
import { NewsletterForm } from './NewsletterForm';
import { t } from '../../lib/i18n';
import { AppIcon } from '../ui/AppIcon';

export function JetBayFooter({ locale }: { locale: string }) {
  const p = `/${locale}`;
  const services = getFooterServices(locale);
  const company = getFooterCompany(locale);

  return (
    <footer className="jb-footer">
      <div className="jb-container">
        <div className="jb-footer-grid">
          <div className="jb-footer-brand">
            <Link href={p} className="jb-logo-link brand-logo-link" style={{ display: 'inline-block', marginBottom: 16 }}>
              <BrandLogo context="footer" officialLogoEnabled={JETVINA_OFFICIAL_LOGO_ENABLED} />
            </Link>
            <p className="jb-footer-tagline">{tn(locale, 'footerTagline')}</p>
            <p className="jb-footer-newsletter-title">
              <AppIcon name="mail" size="sm" aria-hidden /> {t(locale, 'newsletter')}
            </p>
            <p className="jb-footer-newsletter-hint">{tn(locale, 'footerNewsletterHint')}</p>
            <NewsletterForm locale={locale} />
            <div className="jb-payment-row">
              {JB.payment.map((c) => (
                <CdnImage key={c.alt} src={c.src} alt={c.alt} width={48} height={32} className="jb-pay-img" />
              ))}
            </div>
          </div>
          <div>
            <h4 className="jb-footer-col-label">{t(locale, 'services')}</h4>
            <ul className="jb-footer-links">
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={navHref(locale, l.href)}>
                    <AppIcon name="chevronRight" size="xs" aria-hidden /> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="jb-footer-col-label">{t(locale, 'company')}</h4>
            <ul className="jb-footer-links">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={navHref(locale, l.href)}>
                    <AppIcon name="chevronRight" size="xs" aria-hidden /> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {SHOW_UNVERIFIED_PARTNER_LOGOS ? (
            <div>
              <h4 className="jb-footer-col-label">{tn(locale, 'memberships')}</h4>
              <div className="jb-membership-row">
                {JB.membership.map((m) => (
                  <CdnImage key={m.alt} src={m.src} alt={m.alt} width={72} height={40} className="jb-member-img" />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="jb-footer-col-label">{tn(locale, 'memberships')}</h4>
              <p className="jb-footer-tagline" style={{ fontSize: 13 }}>
                Association badges available after client media approval.
              </p>
            </div>
          )}
        </div>
        <div className="jb-footer-bottom">
          <span>
            © {new Date().getFullYear()} {BRAND_LEGAL}. {tn(locale, 'copyright')}
          </span>
          <div className="jb-social">{/* Social links omitted until client provides official accounts. */}</div>
        </div>
      </div>
    </footer>
  );
}
