import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';
import { QuoteSearchWidget } from '../QuoteSearchWidget';

export function HeroSection({ locale, currency }: { locale: string; currency?: string }) {
  return (
    <section className="jb-hero">
      <div
        className="jb-hero-bg"
        aria-hidden
        style={{ backgroundImage: `linear-gradient(105deg, rgba(10, 12, 15, 0.92) 0%, rgba(10, 12, 15, 0.55) 45%, rgba(10, 12, 15, 0.75) 100%), url(${JB.homeBg})` }}
      />
      <div className="jb-hero-content">
        <h1>Global Private Jet Charter: Access to 10,000+ Aircraft</h1>
        <p className="jb-hero-sub">Seamless, trusted access to private aviation worldwide.</p>

        <div className="jb-trust-row">
          <span className="jb-trust-item">
            <CdnImage src={JB.trust.shield} alt="" width={16} height={16} className="jb-trust-icon-img" />
            Secure Payment
          </span>
          <span className="jb-trust-divider">|</span>
          <span className="jb-trust-item">
            <CdnImage src={JB.trust.support} alt="" width={16} height={16} className="jb-trust-icon-img" />
            24/7 Global Concierge Support
          </span>
          <span className="jb-trust-divider">|</span>
          <span className="jb-trust-item">
            <CdnImage src={JB.trust.star} alt="" width={16} height={16} className="jb-trust-icon-img" />
            Premium Aircraft
          </span>
        </div>

        <QuoteSearchWidget locale={locale} currency={currency} />
      </div>
    </section>
  );
}
