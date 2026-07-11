import { t } from '@jetbay/i18n';
import { EmptyLegAlertsForm } from './EmptyLegAlertsForm';

type EmptyLeg = Record<string, unknown>;

export function EmptyLegsSection({ locale, emptyLegs }: { locale: string; emptyLegs: EmptyLeg[] }) {
  const p = `/${locale}`;
  return (
    <section className="jb-section">
      <div className="jb-container">
        <div className="jb-section-header">
          <div>
            <h2 className="jb-section-title">{t(locale, 'emptyLegsNearYou')}</h2>
            <p className="jb-section-desc">{t(locale, 'emptyLegsSectionDesc')}</p>
          </div>
          <a href={`${p}/empty-leg`} className="jb-link-gold">
            {t(locale, 'viewMoreEmptyLeg')}
          </a>
        </div>

        {emptyLegs.length === 0 ? (
          <p className="jb-section-desc">{t(locale, 'emptyLegsEmptyDesc')}</p>
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
                  <span className="jb-discount-badge">
                    {t(locale, 'discountOff', { n: String(el.discountPct) })}
                  </span>
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
