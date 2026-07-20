import { t } from '@jetbay/i18n';
import { formatDate, formatNumber } from '../../config/locales';
import { EmptyLegAlertsForm } from './EmptyLegAlertsForm';
import { FlightScrollRail } from '../ui/FlightScrollRail';
import { ApiLoadNotice } from '../ui/ApiLoadNotice';

type EmptyLeg = Record<string, unknown>;

export function EmptyLegsSection({
  locale,
  emptyLegs,
  loadError,
}: {
  locale: string;
  emptyLegs: EmptyLeg[];
  loadError?: boolean;
}) {
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

        {loadError ? (
          <ApiLoadNotice locale={locale} kind="error" />
        ) : emptyLegs.length === 0 ? (
          <p className="jb-section-desc">{t(locale, 'emptyLegsEmptyDesc')}</p>
        ) : (
          <FlightScrollRail trackClassName="jb-empty-rail" ariaLabel={t(locale, 'emptyLegsNearYou')}>
            {emptyLegs.map((el) => {
              const from = el.fromAirport as { city?: string; iata?: string } | undefined;
              const to = el.toAirport as { city?: string; iata?: string } | undefined;
              const discount = Number(el.discountPct ?? 0);
              const departAt = el.departAt ? new Date(String(el.departAt)) : null;
              return (
                <a
                  key={String(el.slug)}
                  href={`${p}/empty-leg-recommendation/${el.slug}`}
                  className="jb-empty-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {discount > 0 ? (
                    <span className="jb-discount-badge">
                      {t(locale, 'discountOff', { n: String(discount) })}
                    </span>
                  ) : null}
                  <div className="jb-route-line">
                    {from?.city ?? from?.iata} → {to?.city ?? to?.iata}
                  </div>
                  {departAt && !Number.isNaN(departAt.getTime()) ? (
                    <div className="jb-empty-leg-date">
                      {t(locale, 'emptyLegDepartLabel')}: {formatDate(departAt, locale)}
                    </div>
                  ) : null}
                  <div className="jb-price">USD {formatNumber(Number(el.price), locale)}</div>
                </a>
              );
            })}
          </FlightScrollRail>
        )}

        <EmptyLegAlertsForm locale={locale} />
      </div>
    </section>
  );
}
