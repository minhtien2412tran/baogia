import Link from 'next/link';
import { t, tn } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { DestinationExplorer } from '../../../components/destinations/DestinationExplorer';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { apiLocale } from '../../../config/destination-categories';
import { destinationThumb } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: tn(locale, 'allDestinations'),
    description: t(locale, 'destinationsMetaDesc'),
    path: `/${locale}/destination`,
  });
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
    const item = await safeApi(() => api.getDestination(slug, apiLocale(locale)), null);
    if (item) {
      const thumb = item.thumbnail ? String(item.thumbnail) : destinationThumb(String(item.slug));
      return (
        <SubPageLayout locale={locale} title={String(item.title ?? item.city)} tag={t(locale, 'destinationTag')}>
          {thumb && (
            <div className="jb-dest-detail-hero">
              <CdnImage src={thumb} alt={String(item.city)} width={1200} height={400} className="jb-route-detail-img" />
            </div>
          )}
          <div className="jb-content-block">
            <p>{String(item.tagline ?? `${item.city}, ${item.country}`)}</p>
            {item.description ? <p className="jb-section-desc">{String(item.description)}</p> : null}
            <Link href={navHref(locale, '/')} className="jb-btn-primary">
              {t(locale, 'searchFlightsTo', { city: String(item.city) })}
            </Link>
          </div>
        </SubPageLayout>
      );
    }
  }

  return (
    <SubPageLayout
      locale={locale}
      title={tn(locale, 'allDestinations')}
      description={t(locale, 'destinationsHubDesc')}
      tag={tn(locale, 'navDestinations')}
    >
      <DestinationExplorer locale={locale} variant="hub" initialCategory={category} />
    </SubPageLayout>
  );
}
