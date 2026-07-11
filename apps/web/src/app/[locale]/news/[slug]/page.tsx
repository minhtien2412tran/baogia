import { t, tn } from '@jetbay/i18n';
import { SlugDetailLayout, SlugHeroImage } from '../../../../components/layout/SlugDetailLayout';
import { LightSection } from '../../../../components/layout/LightSection';
import { QuoteSearchWidget } from '../../../../components/QuoteSearchWidget';
import { api, safeApi } from '../../../../lib/api';
import { apiLocale } from '../../../../config/locales';
import { buildMetadata } from '../../../../lib/metadata';
import { JB } from '../../../../config/jetbay-cdn';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = await safeApi(() => api.getNewsArticle(slug, apiLocale(locale)), null);
  return buildMetadata({
    title: article ? String(article.title) : t(locale, 'newsTag'),
    description: article ? String(article.excerpt ?? '') : '',
    path: `/${locale}/news/${slug}`,
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await safeApi(() => api.getNewsArticle(slug, apiLocale(locale)), null);

  if (!article) {
    return (
      <SlugDetailLayout
        locale={locale}
        title={t(locale, 'articleNotFound')}
        breadcrumb={[
          { label: tn(locale, 'home'), href: '' },
          { label: tn(locale, 'news'), href: '/news' },
          { label: t(locale, 'notFoundShort') },
        ]}
        backHref="/news"
        backLabel={tn(locale, 'news')}
      >
        <p>{t(locale, 'articleUnavailable')}</p>
      </SlugDetailLayout>
    );
  }

  const thumb = article.thumbnail ? String(article.thumbnail) : JB.pages.newsDefault;
  const publishedAt = String(article.publishedAt ?? '');

  return (
    <SlugDetailLayout
      locale={locale}
      title={String(article.title)}
      tag={t(locale, 'newsTag')}
      heroImage={thumb}
      publishedAt={publishedAt}
      excerpt={String(article.excerpt ?? '')}
      breadcrumb={[
        { label: tn(locale, 'home'), href: '' },
        { label: tn(locale, 'news'), href: '/news' },
        { label: String(article.title) },
      ]}
      backHref="/news"
      backLabel={t(locale, 'allNews')}
      footer={
        <LightSection title={t(locale, 'readyToFly')} subtitle={t(locale, 'readyToFlySubtitle')}>
          <QuoteSearchWidget locale={locale} />
        </LightSection>
      }
    >
      <SlugHeroImage src={thumb} alt={String(article.title)} />
      <div className="jb-prose jb-slug-prose">{String(article.body ?? article.excerpt ?? '')}</div>
    </SlugDetailLayout>
  );
}
