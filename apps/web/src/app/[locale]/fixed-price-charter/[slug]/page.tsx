import Link from 'next/link';
import { SlugDetailLayout } from '../../../../components/layout/SlugDetailLayout';
import { FixedPriceBookForm } from '../../../../components/forms/FixedPriceBookForm';
import { LightSection } from '../../../../components/layout/LightSection';
import { QuoteSearchWidget } from '../../../../components/QuoteSearchWidget';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';
import { fixedPriceRouteHero } from '../../../../config/jetbay-cdn';
import { CdnImage } from '../../../../components/ui/CdnImage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = await safeApi(() => api.getFixedPriceRoute(slug), null);
  const title = route
    ? `${(route.fromAirport as { city: string })?.city} → ${(route.toAirport as { city: string })?.city}`
    : 'Fixed Price Route';
  return buildMetadata({ title, description: 'Fixed-price private jet charter route.' });
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
        title="Route not found"
        breadcrumb={[{ label: 'Home', href: '' }, { label: 'Fixed Price', href: '/fixed-price-charter' }, { label: 'Not found' }]}
        backHref="/fixed-price-charter"
        backLabel="All routes"
      >
        <p>This route is no longer available.</p>
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
        tag="Fixed Price"
        heroImage={hero}
        excerpt={`Transparent fixed pricing from ${from.iata} to ${to.iata}. Price certainty on this popular route.`}
        breadcrumb={[
          { label: 'Home', href: '' },
          { label: 'Fixed Price', href: '/fixed-price-charter' },
          { label: `${from.iata} → ${to.iata}` },
        ]}
        backHref="/fixed-price-charter"
        backLabel="All Fixed-Price Routes"
      >
        <div className="jb-route-detail-hero">
          <CdnImage src={hero} alt={`${from.city} to ${to.city}`} width={1200} height={400} className="jb-route-detail-img" priority />
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

        <LightSection title="Pricing tiers" subtitle="Choose the aircraft category that fits your party size.">
          <div className="jb-pricing-tiers">
            {tiers.length === 0 ? (
              <p className="jb-tier-empty">Pricing on request — contact concierge for a quote.</p>
            ) : (
              tiers.map((t) => (
                <div key={t.category} className="jb-pricing-tier-card">
                  <div>
                    <div className="jb-tier-label">{t.categoryLabel ?? t.category} Jets</div>
                    <div className="jb-tier-pax">Up to {t.paxLimit} passengers</div>
                    {t.includedTerms ? <div className="jb-tier-terms">{t.includedTerms}</div> : null}
                  </div>
                  <div className="jb-tier-price">USD {t.price.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </LightSection>

        <section className="jb-sub-section">
          <h2 className="jb-section-title">What&apos;s included</h2>
          <ul className="jb-bullet-list">
            <li>Aircraft, crew, and standard handling fees</li>
            <li>Departure and arrival at private terminals (FBO)</li>
            <li>24/7 JetBay concierge support</li>
          </ul>
          <h2 className="jb-section-title" style={{ marginTop: 32 }}>What&apos;s not included</h2>
          <ul className="jb-bullet-list">
            <li>Catering upgrades and ground transportation</li>
            <li>International handling and overflight permits where applicable</li>
            <li>De-icing, hangar, or overnight fees if required</li>
          </ul>
        </section>

        <FixedPriceBookForm
          routeId={Number(route.id)}
          tiers={tiers}
        />

        <div className="jb-cta-row">
          <Link href={navHref(locale, '/booking-process')} className="jb-btn-outline">How Booking Works</Link>
        </div>
      </SlugDetailLayout>

      <LightSection title="Search this route" subtitle="Get a tailored quote in minutes.">
        <QuoteSearchWidget locale={locale} />
      </LightSection>
    </>
  );
}
