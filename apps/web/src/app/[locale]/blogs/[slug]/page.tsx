import Link from 'next/link';
import { SubPageLayout } from '../../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await safeApi(() => api.getBlog(slug), null);
  return buildMetadata({
    title: post ? String(post.title) : 'Blog',
    description: post ? String(post.excerpt ?? '') : '',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await safeApi(() => api.getBlog(slug), null);

  if (!post) {
    return (
      <SubPageLayout locale={locale} title="Post not found">
        <Link href={navHref(locale, '/blogs')} className="jb-link-gold">← Blogs</Link>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout
      locale={locale}
      title={String(post.title)}
      tag="Blog"
      breadcrumb={[{ label: 'Home', href: '' }, { label: 'Blogs', href: '/blogs' }, { label: String(post.title) }]}
    >
      <article className="jb-content-block">
        <div className="jb-prose">{String(post.body ?? post.excerpt ?? '')}</div>
      </article>
    </SubPageLayout>
  );
}
