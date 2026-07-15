import Link from 'next/link';
import { t, tn } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, loadApi } from '../../../lib/api';
import { apiLocale } from '../../../config/locales';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { JB } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ApiLoadNotice } from '../../../components/ui/ApiLoadNotice';
import { rebrandText } from '../../../lib/brand';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: tn(locale, 'news'),
    description: t(locale, 'newsMetaDesc'),
    path: `/${locale}/news`,
  });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const load = await loadApi(() => api.getNews(apiLocale(locale)), { news: [] });
  const data = load.data;

  return (
    <SubPageLayout
      locale={locale}
      title={tn(locale, 'news')}
      description={t(locale, 'newsHeroDesc')}
      tag={tn(locale, 'navCompany')}
      heroImage={JB.pages.newsDefault}
    >
      {!load.ok ? (
        <ApiLoadNotice locale={locale} kind="error" />
      ) : data.news.length === 0 ? (
        <EmptyState
          variant="dark"
          icon="news"
          title={t(locale, 'noNewsTitle')}
          description={t(locale, 'noNewsDesc')}
          action={{ label: t(locale, 'noNewsCta'), href: navHref(locale, '/private-jet-charter') }}
        />
      ) : (
        <div className="jb-news-grid">
          {data.news.map((n: Record<string, unknown>) => {
            const thumb = n.thumbnail ? String(n.thumbnail) : JB.pages.newsDefault;
            const title = rebrandText(String(n.title));
            const excerpt = rebrandText(String(n.excerpt ?? ''));
            return (
              <Link key={String(n.slug)} href={navHref(locale, `/news/${n.slug}`)} className="jb-news-card">
                <div className="jb-news-card-img">
                  <CdnImage src={thumb} alt={title} fill className="jb-cover-img" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <div className="jb-news-card-body">
                  <h3>{title}</h3>
                  <p>{excerpt}</p>
                  <small>{String(n.publishedAt ?? '').slice(0, 10)}</small>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </SubPageLayout>
  );
}
