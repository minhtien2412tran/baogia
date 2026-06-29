import Link from 'next/link';
import { SubPageLayout } from '../../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const page = await safeApi(() => api.getContentPage(slug), null);
  return buildMetadata({
    title: page ? String(page.title ?? slug) : slug,
    description: page ? String(page.excerpt ?? '') : '',
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await safeApi(() => api.getContentPage(slug, locale), null);

  return (
    <SubPageLayout
      locale={locale}
      title={page ? String(page.title ?? slug) : slug.replace(/-/g, ' ')}
      tag="Legal"
    >
      {page ? (
        <article className="jb-content-block jb-prose">{String(page.body ?? page.content ?? '')}</article>
      ) : (
        <>
          <p className="jb-section-desc">Content for this page will be published soon.</p>
          <Link href={navHref(locale, '')} className="jb-link-gold">← Home</Link>
        </>
      )}
    </SubPageLayout>
  );
}
