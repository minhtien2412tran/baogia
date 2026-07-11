import Link from 'next/link';
import { t, tn } from '@jetbay/i18n';
import { SlugDetailLayout } from '../../../../components/layout/SlugDetailLayout';
import { FixedPriceBookForm } from '../../../../components/forms/FixedPriceBookForm';
import { LightSection } from '../../../../components/layout/LightSection';
import { QuoteSearchWidget } from '../../../../components/QuoteSearchWidget';
import { RouteFlightBanner } from '../../../../components/fixed-price/RouteFlightBanner';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';
import { fixedPriceRouteHero } from '../../../../config/jetbay-cdn';
import { MediaHeroImage } from '../../../../components/ui/MediaHeroImage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const route = await safeApi(() => api.getFixedPriceRoute(slug), null);
  const title = route
    ? `${(route.fromAirport as { city: string })?.city} → ${(route.toAirport as { city: string })?.city}`
    : t(locale, 'routeNotFound');
  return buildMetadata({
    title,
    description: t(locale, 'fixedPriceRouteMetaDesc'),
    path: `/${locale}/fixed-price-charter/${slug}`,
  });
}

export default async function FixedPriceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const route = await safeApi(() => api.getFixedPriceRoute(slug), null);

  if (!route) {
    return (
      <SlugDetailLayout
        locale={locale}
        title={t(locale, 'routeNotFound')}
        breadcrumb={[
          { label: tn(locale, 'home'), href: '' },
          { label: tn(locale, 'fixedPriceCharter'), href: '/fixed-price-charter' },
          { label: t(locale, 'routeNotFound') },
        ]}
        backHref="/fixed-price-charter"
        backLabel={t(locale, 'allRoutes')}
      >
        <p>{t(locale, 'routeUnavailable')}</p>
      </SlugDetailLayout>
    );
  }

  const from = route.fromAirport as { city: string; iata: string; name?: string };
  const to = route.toAirport as { city: string; iata: string; name?: string };
  const tiers =
    (route.priceOptions as Array<{
      category: string;
      categoryLabel?: string;
      price: number;
      paxLimit: number;
      includedTerms?: string | null;
    }>) ?? [];
  const hero = fixedPriceRouteHero(slug, route.thumbnail ? String(route.thumbnail) : null);

  return (
    <>
      <SlugDetailLayout
        locale={locale}
        wideBody
        title={`${from.city} → ${to.city}`}
        tag={t(locale, 'fixedPriceLabel')}
        heroImage={hero}
        excerpt={t(locale, 'fixedPriceExcerpt', { from: from.iata, to: to.iata })}
        breadcrumb={[
          { label: tn(locale, 'home'), href: '' },
          { label: tn(locale, 'fixedPriceCharter'), href: '/fixed-price-charter' },
          { label: `${from.iata} → ${to.iata}` },
        ]}
        backHref="/fixed-price-charter"
        backLabel={t(locale, 'allFixedPriceRoutesBack')}
      >
        <MediaHeroImage src={hero} alt={`${from.city} → ${to.city}`} variant="wide" priority />

        <RouteFlightBanner
          fromIata={from.iata}
          fromCity={from.city}
          toIata={to.iata}
          toCity={to.city}
        />

        <div className="jb-fp-detail-grid">
          <div className="jb-fp-detail-main">
            <section className="jb-fp-tier-section">
              <h2 className="jb-section-title">{t(locale, 'pricingTiers')}</h2>
              <p className="jb-section-desc">{t(locale, 'pricingTiersSubtitle')}</p>
              <div className="jb-fp-tier-cards">
                {tiers.length === 0 ? (
                  <p className="jb-tier-empty">{t(locale, 'pricingOnRequestDetail')}</p>
                ) : (
                  tiers.map((tier) => (
                    <div key={tier.category} className="jb-fp-tier-card">
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
              </div>
            </section>

            <div className="jb-fp-inclusions">
              <div className="jb-fp-inclusion-panel">
                <h3>{t(locale, 'whatsIncluded')}</h3>
                <ul className="jb-bullet-list">
                  <li>{t(locale, 'fpIncluded1')}</li>
                  <li>{t(locale, 'fpIncluded2')}</li>
                  <li>{t(locale, 'fpIncluded3')}</li>
                </ul>
              </div>
              <div className="jb-fp-inclusion-panel">
                <h3>{t(locale, 'whatsNotIncluded')}</h3>
                <ul className="jb-bullet-list">
                  <li>{t(locale, 'fpNotIncluded1')}</li>
                  <li>{t(locale, 'fpNotIncluded2')}</li>
                  <li>{t(locale, 'fpNotIncluded3')}</li>
                </ul>
              </div>
            </div>

            <div className="jb-fp-detail-foot">
              <Link href={navHref(locale, '/booking-process')} className="jb-btn-outline">
                {t(locale, 'howBookingWorks')}
              </Link>
            </div>
          </div>

          <FixedPriceBookForm
            locale={locale}
            routeId={Number(route.id)}
            tiers={tiers}
            fromIata={from.iata}
            toIata={to.iata}
          />
        </div>
      </SlugDetailLayout>

      <LightSection title={t(locale, 'searchThisRoute')} subtitle={t(locale, 'searchThisRouteSubtitle')}>
        <QuoteSearchWidget locale={locale} />
      </LightSection>
    </>
  );
}

