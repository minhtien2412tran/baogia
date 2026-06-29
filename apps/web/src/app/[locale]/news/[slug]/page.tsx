import Link from 'next/link';
import { SubPageLayout } from '../../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';

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
      <SubPageLayout locale={locale} title="Article not found">
        <Link href={navHref(locale, '/news')} className="jb-link-gold">← News</Link>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout
      locale={locale}
      title={String(article.title)}
      tag="News"
      breadcrumb={[{ label: 'Home', href: '' }, { label: 'News', href: '/news' }, { label: String(article.title) }]}
    >
      <article className="jb-content-block">
        <p className="jb-section-desc">{String(article.publishedAt ?? '').slice(0, 10)}</p>
        <div className="jb-prose">{String(article.body ?? article.excerpt ?? '')}</div>
      </article>
    </SubPageLayout>
  );
}
