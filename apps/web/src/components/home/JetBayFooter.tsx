import Link from 'next/link';
import { FOOTER_COMPANY, FOOTER_SERVICES, navHref } from '../../config/navigation';
import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';
import { NewsletterForm } from './NewsletterForm';
import { t } from '../../lib/i18n';

export function JetBayFooter({ locale }: { locale: string }) {
  const p = `/${locale}`;
  return (
    <footer className="jb-footer">
      <div className="jb-container">
        <div className="jb-footer-grid">
          <div>
            <Link href={p} className="jb-logo-link" style={{ display: 'inline-block', marginBottom: 16 }}>
              <CdnImage src={JB.logo} alt="JetBay" width={120} height={32} className="jb-logo-img" />
            </Link>
            <p style={{ color: 'var(--jb-text-muted)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
              A leading global private jet charter platform. Seamless access to 10,000+ aircraft worldwide.
            </p>
            <h4>{t(locale, 'newsletter')}</h4>
            <p style={{ fontSize: 13, color: 'var(--jb-text-muted)', margin: '0 0 8px' }}>
              Get exclusive deals and updates on private jet travel
            </p>
            <NewsletterForm locale={locale} />
            <div className="jb-payment-row">
              {JB.payment.map((c) => (
                <CdnImage key={c.alt} src={c.src} alt={c.alt} width={48} height={32} className="jb-pay-img" />
              ))}
            </div>
          </div>
          <div>
            <h4>{t(locale, 'services')}</h4>
            <ul className="jb-footer-links">
              {FOOTER_SERVICES.map((l) => (
                <li key={l.href}><Link href={navHref(locale, l.href)}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t(locale, 'company')}</h4>
            <ul className="jb-footer-links">
              {FOOTER_COMPANY.map((l) => (
                <li key={l.href}><Link href={navHref(locale, l.href)}>{l.label}</Link></li>
              ))}
            </ul>
            <h4 style={{ marginTop: 24 }}>Memberships</h4>
            <div className="jb-membership-row">
              {JB.membership.map((m) => (
                <CdnImage key={m.alt} src={m.src} alt={m.alt} width={72} height={40} className="jb-member-img" />
              ))}
            </div>
          </div>
        </div>
        <div className="jb-footer-bottom">
          <span>© {new Date().getFullYear()} JetBay Inc. All rights reserved.</span>
          <div className="jb-social">
            {JB.social.map((s) => (
              <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.alt}>
                <CdnImage src={s.src} alt={s.alt} width={24} height={24} className="jb-social-icon" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
