import { SlugDetailLayout, SlugHeroImage } from '../../../../components/layout/SlugDetailLayout';
import { LightSection } from '../../../../components/layout/LightSection';
import { QuoteSearchWidget } from '../../../../components/QuoteSearchWidget';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { JB } from '../../../../config/jetbay-cdn';

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
      <SlugDetailLayout
        locale={locale}
        title="Post not found"
        breadcrumb={[{ label: 'Home', href: '' }, { label: 'Blogs', href: '/blogs' }, { label: 'Not found' }]}
        backHref="/blogs"
        backLabel="Blogs"
      >
        <p>This post is no longer available.</p>
      </SlugDetailLayout>
    );
  }

  const thumb = post.thumbnail ? String(post.thumbnail) : JB.pages.newsDefault;

  return (
    <SlugDetailLayout
      locale={locale}
      title={String(post.title)}
      tag="Blog"
      heroImage={thumb}
      excerpt={String(post.excerpt ?? '')}
      breadcrumb={[{ label: 'Home', href: '' }, { label: 'Blogs', href: '/blogs' }, { label: String(post.title) }]}
      backHref="/blogs"
      backLabel="All Blogs"
      footer={
        <LightSection title="Plan your next flight" subtitle="Search available aircraft worldwide.">
          <QuoteSearchWidget locale={locale} />
        </LightSection>
      }
    >
      <SlugHeroImage src={thumb} alt={String(post.title)} />
      <div className="jb-prose jb-slug-prose">{String(post.body ?? post.excerpt ?? '')}</div>
    </SlugDetailLayout>
  );
}
