import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { apiLocale } from '../../../config/locales';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { JB, destinationThumb } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

export async function generateMetadata() {
  return buildMetadata({ title: 'Blogs', description: 'Private aviation insights and travel guides.' });
}

export default async function BlogsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getBlogs(apiLocale(locale)), { blogs: [] });

  return (
    <SubPageLayout
      locale={locale}
      title="Blogs"
      description="Insights, guides, and stories from the world of private aviation."
      tag="Company"
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
