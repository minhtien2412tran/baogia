import Link from 'next/link';
import { SubPageLayout } from '../../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';

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
      <SubPageLayout locale={locale} title="Route not found">
        <p>This route is no longer available.</p>
        <Link href={navHref(locale, '/fixed-price-charter')} className="jb-link-gold">← All routes</Link>
      </SubPageLayout>
    );
  }

  const from = route.fromAirport as { city: string; iata: string };
  const to = route.toAirport as { city: string; iata: string };
  const tiers = (route.priceOptions as Array<{ category: string; price: number; paxLimit: number }>) ?? [];

  return (
    <SubPageLayout
      locale={locale}
      title={`${from.city} → ${to.city}`}
      description={`Fixed-price charter from ${from.iata} to ${to.iata}`}
      tag="Fixed Price"
      breadcrumb={[
        { label: 'Home', href: '' },
        { label: 'Fixed Price', href: '/fixed-price-charter' },
        { label: `${from.iata} → ${to.iata}` },
      ]}
    >
      {tiers.map((t) => (
        <div key={t.category} className="jb-tier" style={{ maxWidth: 480 }}>
          <div>
            <div className="jb-tier-label">{t.category} Jets</div>
            <div className="jb-tier-pax">Up to {t.paxLimit} passengers</div>
          </div>
          <div className="jb-tier-price">USD {t.price.toLocaleString()}</div>
        </div>
      ))}
      <div className="jb-cta-row" style={{ marginTop: 24 }}>
        <Link href={navHref(locale, '/')} className="jb-btn-primary">Book This Route</Link>
      </div>
    </SubPageLayout>
  );
}
