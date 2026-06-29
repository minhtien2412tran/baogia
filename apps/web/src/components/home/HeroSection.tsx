import { QuoteSearchWidget } from '../QuoteSearchWidget';

export function HeroSection({ locale, currency }: { locale: string; currency?: string }) {
  return (
    <section className="jb-hero">
      <div className="jb-hero-bg" aria-hidden />
      <div className="jb-hero-content">
        <h1>Global Private Jet Charter: Access to 10,000+ Aircraft</h1>
        <p className="jb-hero-sub">Seamless, trusted access to private aviation worldwide.</p>

        <div className="jb-trust-row">
          <span className="jb-trust-item">
            <span className="jb-trust-icon">✓</span> Secure Payment
          </span>
          <span className="jb-trust-divider">|</span>
          <span className="jb-trust-item">
            <span className="jb-trust-icon">✓</span> 24/7 Global Concierge Support
          </span>
          <span className="jb-trust-divider">|</span>
          <span className="jb-trust-item">
            <span className="jb-trust-icon">✓</span> Premium Aircraft
          </span>
        </div>

        <QuoteSearchWidget locale={locale} currency={currency} />
      </div>
    </section>
  );
}
