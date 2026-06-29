import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';

export async function generateMetadata() {
  return buildMetadata({ title: 'Video Centre', description: 'Aircraft tours and destination videos.' });
}

export default async function VideoCentrePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getVideos(), { videos: [] });

  return (
    <SubPageLayout locale={locale} title="Video Centre" description="Explore our fleet and destinations on video." tag="Media">
      <div className="jb-dest-grid">
        {data.videos.map((v: Record<string, unknown>) => (
          <div key={String(v.slug)} className="jb-dest-card">
            <div className="jb-dest-img">▶ {String(v.title)}</div>
            <div className="jb-dest-body">
              <p className="jb-dest-meta">{String(v.duration ?? '')}</p>
            </div>
          </div>
        ))}
      </div>
    </SubPageLayout>
  );
}
