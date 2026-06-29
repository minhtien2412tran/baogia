import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';

export async function generateMetadata() {
  return buildMetadata({ title: 'Island Destinations', description: 'Private jet access to leading island destinations.' });
}

export default async function IslandDestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getDestinations('ISLAND'), { destinations: [] });

  return (
    <SubPageLayout locale={locale} title="Island Escapes" description="Private jet access to the world's finest islands." tag="Destinations">
      <div className="jb-dest-grid">
        {data.destinations.map((d: Record<string, unknown>) => (
          <Link key={String(d.slug)} href={navHref(locale, `/destination?slug=${d.slug}`)} className="jb-dest-card">
            <div className="jb-dest-img">[Image: {String(d.city)}]</div>
            <div className="jb-dest-body">
              <span className="jb-dest-tag">{String(d.category)}</span>
              <h3 className="jb-dest-name">{String(d.title ?? d.city)}</h3>
              <p className="jb-dest-meta">{String(d.city)}, {String(d.country)}</p>
            </div>
          </Link>
        ))}
      </div>
    </SubPageLayout>
  );
}
