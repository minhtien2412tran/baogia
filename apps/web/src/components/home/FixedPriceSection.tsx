import { t } from '@jetbay/i18n';

type Route = Record<string, unknown>;

export function FixedPriceSection({ locale, routes }: { locale: string; routes: Route[] }) {
  const p = `/${locale}`;
  return (
    <section className="jb-section" style={{ background: 'var(--jb-bg-elevated)' }}>
      <div className="jb-container">
        <div className="jb-section-header">
          <div>
            <h2 className="jb-section-title">{t(locale, 'fixedPricePageTitle')}</h2>
            <p className="jb-section-desc">{t(locale, 'fixedPricePageDesc')}</p>
          </div>
          <a href={`${p}/fixed-price-charter`} className="jb-link-gold">
            {t(locale, 'viewAllFixedPriceRoutes')}
          </a>
        </div>

        <div className="jb-routes-scroll">
          {routes.map((r) => {
            const from = r.fromAirport as { city: string; iata: string };
            const to = r.toAirport as { city: string; iata: string };
            const tiers =
              (r.priceOptions as Array<{
                category: string;
                categoryLabel?: string;
                price: number;
                paxLimit: number;
                includedTerms?: string | null;
              }>) ?? [];
            return (
              <div key={String(r.slug)} className="jb-route-card jb-tilt-card" data-tilt-max="8">
                <div className="jb-tilt-card__inner">
                  <div className="jb-route-airports">
                    <div>
                      <div className="jb-iata">{from?.iata}</div>
                      <div className="jb-city">{from?.city}</div>
                    </div>
                    <span className="jb-route-arrow">→</span>
                    <div>
                      <div className="jb-iata">{to?.iata}</div>
                      <div className="jb-city">{to?.city}</div>
                    </div>
                  </div>
                  {tiers.length === 0 ? (
                    <p className="jb-tier-empty">{t(locale, 'pricingOnRequest')}</p>
                  ) : (
                    tiers.map((tier) => (
                      <div key={tier.category} className="jb-tier">
                        <div>
                          <div className="jb-tier-label">
                            {t(locale, 'categoryJets', { category: tier.categoryLabel ?? tier.category })}
                          </div>
                          <div className="jb-tier-pax">{t(locale, 'upToPassengers', { n: tier.paxLimit })}</div>
                          {tier.includedTerms ? <div className="jb-tier-terms">{tier.includedTerms}</div> : null}
                        </div>
                        <div className="jb-tier-price">USD {tier.price.toLocaleString()}</div>
                      </div>
                    ))
                  )}
                  <a href={`${p}/fixed-price-charter/${r.slug}`} className="jb-book-btn">
                    {t(locale, 'bookNow')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
