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
  const post = await safeApi(() => api.getBlog(slug, apiLocale(locale)), null);
  return buildMetadata({
    title: post ? String(post.title) : t(locale, 'blogTag'),
    description: post ? String(post.excerpt ?? '') : '',
    path: `/${locale}/blogs/${slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await safeApi(() => api.getBlog(slug, apiLocale(locale)), null);

  if (!post) {
    return (
      <SlugDetailLayout
        locale={locale}
        title={t(locale, 'postNotFound')}
        breadcrumb={[
          { label: tn(locale, 'home'), href: '' },
          { label: tn(locale, 'blogs'), href: '/blogs' },
          { label: t(locale, 'notFoundShort') },
        ]}
        backHref="/blogs"
        backLabel={tn(locale, 'blogs')}
      >
        <p>{t(locale, 'postUnavailable')}</p>
      </SlugDetailLayout>
    );
  }

  const thumb = post.thumbnail ? String(post.thumbnail) : JB.pages.newsDefault;

  return (
    <SlugDetailLayout
      locale={locale}
      title={String(post.title)}
      tag={t(locale, 'blogTag')}
      heroImage={thumb}
      excerpt={String(post.excerpt ?? '')}
      breadcrumb={[
        { label: tn(locale, 'home'), href: '' },
        { label: tn(locale, 'blogs'), href: '/blogs' },
        { label: String(post.title) },
      ]}
      backHref="/blogs"
      backLabel={t(locale, 'allBlogs')}
      footer={
        <LightSection title={t(locale, 'planNextFlight')} subtitle={t(locale, 'planNextFlightSubtitle')}>
          <QuoteSearchWidget locale={locale} />
        </LightSection>
      }
    >
      <SlugHeroImage src={thumb} alt={String(post.title)} />
      <div className="jb-prose jb-slug-prose">{String(post.body ?? post.excerpt ?? '')}</div>
    </SlugDetailLayout>
  );
}
