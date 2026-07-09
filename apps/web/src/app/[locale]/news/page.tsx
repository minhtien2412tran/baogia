import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { JB } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

export async function generateMetadata() {
  return buildMetadata({ title: 'News', description: 'Latest news from JetBay private aviation.' });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getNews(), { news: [] });

  return (
    <SubPageLayout locale={locale} title="News" description="Latest updates from JetBay." tag="Company" heroImage={JB.pages.newsDefault}>
      <div className="jb-news-grid">
        {data.news.map((n: Record<string, unknown>) => {
          const thumb = n.thumbnail ? String(n.thumbnail) : JB.pages.newsDefault;
          return (
            <Link key={String(n.slug)} href={navHref(locale, `/news/${n.slug}`)} className="jb-news-card">
              <div className="jb-news-card-img">
                <CdnImage src={thumb} alt={String(n.title)} fill className="jb-cover-img" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="jb-news-card-body">
                <h3>{String(n.title)}</h3>
                <p>{String(n.excerpt ?? '')}</p>
                <small>{String(n.publishedAt ?? '').slice(0, 10)}</small>
              </div>
            </Link>
          );
        })}
      </div>
    </SubPageLayout>
  );
}
