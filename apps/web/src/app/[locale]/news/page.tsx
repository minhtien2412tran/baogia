import Link from 'next/link';
import { t, tn } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { apiLocale } from '../../../config/locales';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { JB } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

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
  const data = await safeApi(() => api.getNews(apiLocale(locale)), { news: [] });

  return (
    <SubPageLayout
      locale={locale}
      title={tn(locale, 'news')}
      description={t(locale, 'newsHeroDesc')}
      tag={tn(locale, 'navCompany')}
      heroImage={JB.pages.newsDefault}
    >
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
