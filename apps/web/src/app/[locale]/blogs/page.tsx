import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';

export async function generateMetadata() {
  return buildMetadata({ title: 'Blogs', description: 'Private aviation insights and travel guides.' });
}

export default async function BlogsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getBlogs(), { blogs: [] });

  return (
    <SubPageLayout locale={locale} title="Blogs" description="Insights, guides, and stories from the world of private aviation." tag="Company">
      <div className="jb-article-list">
        {data.blogs.map((b: Record<string, unknown>) => (
          <Link key={String(b.slug)} href={navHref(locale, `/blogs/${b.slug}`)} className="jb-article-card">
            <h3>{String(b.title)}</h3>
            <p>{String(b.excerpt ?? '')}</p>
          </Link>
        ))}
      </div>
    </SubPageLayout>
  );
}
