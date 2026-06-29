import { EmptyLegAlertsForm } from './EmptyLegAlertsForm';

type EmptyLeg = Record<string, unknown>;

export function EmptyLegsSection({ locale, emptyLegs }: { locale: string; emptyLegs: EmptyLeg[] }) {
  const p = `/${locale}`;
  return (
    <section className="jb-section">
      <div className="jb-container">
        <div className="jb-section-header">
          <div>
            <h2 className="jb-section-title">Empty Legs Near You</h2>
            <p className="jb-section-desc">Last-minute private jet deals at reduced rates</p>
          </div>
          <a href={`${p}/empty-leg`} className="jb-link-gold">View More Empty Leg →</a>
        </div>

        {emptyLegs.length === 0 ? (
          <p className="jb-section-desc">No empty legs available right now. Subscribe below for alerts.</p>
        ) : (
          <div className="jb-empty-grid">
            {emptyLegs.map((el) => {
              const from = el.fromAirport as { city?: string; iata?: string } | undefined;
              const to = el.toAirport as { city?: string; iata?: string } | undefined;
              return (
                <a
                  key={String(el.slug)}
                  href={`${p}/empty-leg-recommendation/${el.slug}`}
                  className="jb-empty-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <span className="jb-discount-badge">{String(el.discountPct)}% off</span>
                  <div className="jb-route-line">
                    {from?.city ?? from?.iata} → {to?.city ?? to?.iata}
                  </div>
                  <div className="jb-price">USD {Number(el.price).toLocaleString()}</div>
                </a>
              );
            })}
          </div>
        )}

        <EmptyLegAlertsForm locale={locale} />
      </div>
    </section>
  );
}
