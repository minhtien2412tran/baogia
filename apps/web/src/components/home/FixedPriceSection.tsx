type Route = Record<string, unknown>;

export function FixedPriceSection({ locale, routes }: { locale: string; routes: Route[] }) {
  const p = `/${locale}`;
  return (
    <section className="jb-section" style={{ background: 'var(--jb-bg-elevated)' }}>
      <div className="jb-container">
        <div className="jb-section-header">
          <div>
            <h2 className="jb-section-title">Fixed-Price Charter Routes</h2>
            <p className="jb-section-desc">Experience price certainty on our most requested global routes.</p>
          </div>
          <a href={`${p}/fixed-price-charter`} className="jb-link-gold">View All Fixed-Price Routes →</a>
        </div>

        <div className="jb-routes-scroll">
          {routes.map((r) => {
            const from = r.fromAirport as { city: string; iata: string };
            const to = r.toAirport as { city: string; iata: string };
            const tiers = (r.priceOptions as Array<{ category: string; price: number; paxLimit: number }>) ?? [];
            return (
              <div key={String(r.slug)} className="jb-route-card">
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
                {tiers.map((t) => (
                  <div key={t.category} className="jb-tier">
                    <div>
                      <div className="jb-tier-label">{t.category} Jets</div>
                      <div className="jb-tier-pax">Up to {t.paxLimit} passengers</div>
                    </div>
                    <div className="jb-tier-price">USD {t.price.toLocaleString()}</div>
                  </div>
                ))}
                <a href={`${p}/fixed-price-charter/${r.slug}`} className="jb-book-btn">Book Now</a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
