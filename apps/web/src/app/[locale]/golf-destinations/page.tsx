import Link from 'next/link';
import { tn } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { apiLocale } from '../../../config/locales';
import { JB, destinationThumb } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: tn(locale, 'golfGetaways'),
    description: tn(locale, 'golfGetawaysDesc'),
    path: `/${locale}/golf-destinations`,
  });
}

export default async function GolfDestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getDestinations({ category: 'GOLF', locale: apiLocale(locale), limit: 50 }), {
    destinations: [],
  });

  return (
    <SubPageLayout
      locale={locale}
      title={tn(locale, 'golfGetaways')}
      description={tn(locale, 'golfGetawaysDesc')}
      tag={tn(locale, 'navDestinations')}
      heroImage={JB.sections.islandBg}
    >
      <div className="jb-dest-grid">
        {data.destinations.map((d: Record<string, unknown>) => {
          const slug = String(d.slug);
          const thumb = d.thumbnail ? String(d.thumbnail) : destinationThumb(slug);
          return (
            <Link key={slug} href={navHref(locale, `/destination?slug=${slug}`)} className="jb-dest-card">
              <div className="jb-dest-img">
                {thumb && <CdnImage src={thumb} alt={String(d.city)} fill className="jb-cover-img" sizes="33vw" />}
              </div>
              <div className="jb-dest-body">
                <span className="jb-dest-tag">{String(d.category)}</span>
                <h3 className="jb-dest-name">{String(d.title ?? d.city)}</h3>
                <p className="jb-dest-meta">
                  {String(d.city)}, {String(d.country)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </SubPageLayout>
  );
}
