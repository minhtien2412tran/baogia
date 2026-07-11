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
    title: tn(locale, 'blogs'),
    description: t(locale, 'blogsMetaDesc'),
    path: `/${locale}/blogs`,
  });
}

export default async function BlogsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getBlogs(apiLocale(locale)), { blogs: [] });

  return (
    <SubPageLayout
      locale={locale}
      title={tn(locale, 'blogs')}
      description={t(locale, 'blogsHeroDesc')}
      tag={tn(locale, 'navCompany')}
      heroImage={JB.pages.newsDefault}
    >
      <div className="jb-news-grid">
        {data.blogs.map((b: Record<string, unknown>) => {
          const thumb = b.thumbnail ? String(b.thumbnail) : JB.pages.newsDefault;
          return (
            <Link key={String(b.slug)} href={navHref(locale, `/blogs/${b.slug}`)} className="jb-news-card">
              <div className="jb-news-card-img">
                <CdnImage src={thumb} alt={String(b.title)} fill className="jb-cover-img" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="jb-news-card-body">
                <h3>{String(b.title)}</h3>
                <p>{String(b.excerpt ?? '')}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </SubPageLayout>
  );
}
