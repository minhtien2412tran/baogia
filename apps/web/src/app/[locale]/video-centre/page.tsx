import { t, tn } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { LightSection } from '../../../components/layout/LightSection';
import { api, safeApi } from '../../../lib/api';
import { apiLocale } from '../../../config/locales';
import { buildMetadata } from '../../../lib/metadata';
import { JB, videoThumb } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: tn(locale, 'videoCentre'),
    description: t(locale, 'videoMetaDesc'),
    path: `/${locale}/video-centre`,
  });
}

function formatDuration(seconds: unknown): string {
  const s = Number(seconds ?? 0);
  if (!s) return '';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default async function VideoCentrePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getVideos(apiLocale(locale)), { videos: [] });

  return (
    <>
      <SubPageLayout
        locale={locale}
        title={tn(locale, 'videoCentre')}
        description={t(locale, 'videoHeroDesc')}
        tag={t(locale, 'mediaTag')}
        heroImage={JB.videoThumbs[0]}
      >
        <div className="jb-video-grid">
          {data.videos.map((v: Record<string, unknown>, i: number) => {
            const thumb = videoThumb(i, v.thumbnail ? String(v.thumbnail) : null);
            const url = v.videoUrl ? String(v.videoUrl) : undefined;
            return (
              <article key={String(v.slug)} className="jb-video-card">
                <div className="jb-video-thumb">
                  <CdnImage src={thumb} alt={String(v.title ?? 'Video')} fill className="jb-cover-img" sizes="(max-width:768px) 100vw, 33vw" />
                  <span className="jb-video-play" aria-hidden>
                    ▶
                  </span>
                  {v.duration != null && Number(v.duration) > 0 && (
                    <span className="jb-video-duration">{formatDuration(v.duration)}</span>
                  )}
                </div>
                <div className="jb-video-body">
                  <h3>{String(v.title ?? v.slug)}</h3>
                  {v.viewCount != null && (
                    <p className="jb-video-meta">{t(locale, 'videoViews', { n: Number(v.viewCount).toLocaleString() })}</p>
                  )}
                  {url && url.startsWith('http') && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="jb-link-gold">
                      {t(locale, 'watchVideo')}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </SubPageLayout>

      {data.videos.length === 0 && (
        <LightSection title={t(locale, 'featuredVideos')} subtitle={t(locale, 'featuredVideosSubtitle')}>
          <div className="jb-video-grid">
            {JB.videoThumbs.slice(0, 6).map((thumb, i) => (
              <article key={thumb} className="jb-video-card">
                <div className="jb-video-thumb">
                  <CdnImage src={thumb} alt={`Video ${i + 1}`} fill className="jb-cover-img" sizes="33vw" />
                  <span className="jb-video-play" aria-hidden>
                    ▶
                  </span>
                </div>
                <div className="jb-video-body">
                  <h3>JetBay Highlights {i + 1}</h3>
                </div>
              </article>
            ))}
          </div>
        </LightSection>
      )}
    </>
  );
}
