import Link from 'next/link';
import { t, tn } from '@jetbay/i18n';
import { SlugDetailLayout } from '../../../../components/layout/SlugDetailLayout';
import { FixedPriceBookForm } from '../../../../components/forms/FixedPriceBookForm';
import { LightSection } from '../../../../components/layout/LightSection';
import { QuoteSearchWidget } from '../../../../components/QuoteSearchWidget';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';
import { fixedPriceRouteHero } from '../../../../config/jetbay-cdn';
import { CdnImage } from '../../../../components/ui/CdnImage';

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
        <div className="jb-route-detail-hero">
          <CdnImage
            src={hero}
            alt={`${from.city} → ${to.city}`}
            width={1200}
            height={400}
            className="jb-route-detail-img"
            priority
          />
        </div>

        <div className="jb-route-detail-airports">
          <div className="jb-route-detail-airport">
            <div className="jb-iata">{from.iata}</div>
            <div className="jb-city">{from.city}</div>
            {from.name && <div className="jb-airport-name">{from.name}</div>}
          </div>
          <span className="jb-route-arrow jb-route-arrow-lg">→</span>
          <div className="jb-route-detail-airport">
            <div className="jb-iata">{to.iata}</div>
            <div className="jb-city">{to.city}</div>
            {to.name && <div className="jb-airport-name">{to.name}</div>}
          </div>
        </div>

        <LightSection title={t(locale, 'pricingTiers')} subtitle={t(locale, 'pricingTiersSubtitle')}>
          <div className="jb-pricing-tiers">
            {tiers.length === 0 ? (
              <p className="jb-tier-empty">{t(locale, 'pricingOnRequestDetail')}</p>
            ) : (
              tiers.map((tier) => (
                <div key={tier.category} className="jb-pricing-tier-card">
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
        </LightSection>

        <section className="jb-sub-section">
          <h2 className="jb-section-title">{t(locale, 'whatsIncluded')}</h2>
          <ul className="jb-bullet-list">
            <li>{t(locale, 'fpIncluded1')}</li>
            <li>{t(locale, 'fpIncluded2')}</li>
            <li>{t(locale, 'fpIncluded3')}</li>
          </ul>
          <h2 className="jb-section-title" style={{ marginTop: 32 }}>
            {t(locale, 'whatsNotIncluded')}
          </h2>
          <ul className="jb-bullet-list">
            <li>{t(locale, 'fpNotIncluded1')}</li>
            <li>{t(locale, 'fpNotIncluded2')}</li>
            <li>{t(locale, 'fpNotIncluded3')}</li>
          </ul>
        </section>

        <FixedPriceBookForm locale={locale} routeId={Number(route.id)} tiers={tiers} />

        <div className="jb-cta-row">
          <Link href={navHref(locale, '/booking-process')} className="jb-btn-outline">
            {t(locale, 'howBookingWorks')}
          </Link>
        </div>
      </SlugDetailLayout>

      <LightSection title={t(locale, 'searchThisRoute')} subtitle={t(locale, 'searchThisRouteSubtitle')}>
        <QuoteSearchWidget locale={locale} />
      </LightSection>
    </>
  );
}
