import { SlugDetailLayout, SlugHeroImage } from '../../../../components/layout/SlugDetailLayout';
import { LightSection } from '../../../../components/layout/LightSection';
import { QuoteSearchWidget } from '../../../../components/QuoteSearchWidget';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { JB } from '../../../../config/jetbay-cdn';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await safeApi(() => api.getNewsArticle(slug), null);
  return buildMetadata({
    title: article ? String(article.title) : 'News',
    description: article ? String(article.excerpt ?? '') : '',
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await safeApi(() => api.getNewsArticle(slug), null);

  if (!article) {
    return (
      <SlugDetailLayout
        locale={locale}
        title="Article not found"
        breadcrumb={[{ label: 'Home', href: '' }, { label: 'News', href: '/news' }, { label: 'Not found' }]}
        backHref="/news"
        backLabel="News"
      >
        <p>This article is no longer available.</p>
      </SlugDetailLayout>
    );
  }

  const thumb = article.thumbnail ? String(article.thumbnail) : JB.pages.newsDefault;
  const publishedAt = String(article.publishedAt ?? '');

  return (
    <>
      <SlugDetailLayout
        locale={locale}
        title={String(article.title)}
        tag="News"
        heroImage={thumb}
        publishedAt={publishedAt}
        excerpt={String(article.excerpt ?? '')}
        breadcrumb={[{ label: 'Home', href: '' }, { label: 'News', href: '/news' }, { label: String(article.title) }]}
        backHref="/news"
        backLabel="All News"
        footer={
          <LightSection title="Ready to fly?" subtitle="Search available aircraft for your next journey.">
            <QuoteSearchWidget locale={locale} />
          </LightSection>
        }
      >
        <SlugHeroImage src={thumb} alt={String(article.title)} />
        <div className="jb-prose jb-slug-prose">{String(article.body ?? article.excerpt ?? '')}</div>
      </SlugDetailLayout>
    </>
  );
}
