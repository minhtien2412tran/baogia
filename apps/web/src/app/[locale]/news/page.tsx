import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';

export async function generateMetadata() {
  return buildMetadata({ title: 'News', description: 'Latest news from J-TA private aviation.' });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getNews(), { news: [] });

  return (
    <SubPageLayout locale={locale} title="News" description="Latest updates from J-TA." tag="Company">
      <div className="jb-article-list">
        {data.news.map((n: Record<string, unknown>) => (
          <Link key={String(n.slug)} href={navHref(locale, `/news/${n.slug}`)} className="jb-article-card">
            <h3>{String(n.title)}</h3>
            <p>{String(n.excerpt ?? '')}</p>
            <small>{String(n.publishedAt ?? '').slice(0, 10)}</small>
          </Link>
        ))}
      </div>
    </SubPageLayout>
  );
}
