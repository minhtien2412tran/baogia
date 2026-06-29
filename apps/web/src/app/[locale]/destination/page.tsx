import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';

export async function generateMetadata() {
  return buildMetadata({ title: 'Destinations', description: 'Curated private jet destinations worldwide.' });
}

export default async function DestinationHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ slug?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { slug, category } = await searchParams;

  if (slug) {
    const dest = await safeApi(() => api.getDestinations(), { destinations: [] });
    const item = dest.destinations.find((d: Record<string, unknown>) => d.slug === slug);
    if (item) {
      return (
        <SubPageLayout locale={locale} title={String(item.title ?? item.city)} tag="Destination">
          <div className="jb-content-block">
            <p>{String(item.tagline ?? `${item.city}, ${item.country}`)}</p>
            <p className="jb-section-desc">Charter a private jet to {String(item.city)} with J-TA concierge support.</p>
            <Link href={navHref(locale, '/')} className="jb-btn-primary">Search Flights to {String(item.city)}</Link>
          </div>
        </SubPageLayout>
      );
    }
  }

  const data = await safeApi(() => api.getDestinations(category), { destinations: [] });

  return (
    <SubPageLayout locale={locale} title="All Destinations" description="Explore curated getaways by private jet." tag="Destinations">
      <div className="jb-dest-grid">
        {data.destinations.map((d: Record<string, unknown>) => (
          <Link key={String(d.slug)} href={navHref(locale, `/destination?slug=${d.slug}`)} className="jb-dest-card">
            <div className="jb-dest-img">[Image: {String(d.city)}]</div>
            <div className="jb-dest-body">
              <h3 className="jb-dest-name">{String(d.title ?? d.city)}</h3>
              <p className="jb-dest-meta">{String(d.city)}, {String(d.country)}</p>
            </div>
          </Link>
        ))}
      </div>
    </SubPageLayout>
  );
}
