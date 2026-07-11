import Link from 'next/link';
import { t, tn } from '@jetbay/i18n';
import { SubPageLayout } from '../../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../../lib/api';
import { apiLocale } from '../../../../config/locales';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await safeApi(() => api.getContentPage(slug, apiLocale(locale)), null);
  return buildMetadata({
    title: page ? String(page.title ?? slug) : slug,
    description: page ? String(page.excerpt ?? '') : '',
    path: `/${locale}/article/${slug}`,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await safeApi(() => api.getContentPage(slug, apiLocale(locale)), null);

  return (
    <SubPageLayout
      locale={locale}
      title={page ? String(page.title ?? slug) : slug.replace(/-/g, ' ')}
      tag={t(locale, 'legalTag')}
    >
      {page ? (
        <article className="jb-content-block jb-prose">{String(page.body ?? page.content ?? '')}</article>
      ) : (
        <>
          <p className="jb-section-desc">{tn(locale, 'contentComingSoon')}</p>
          <Link href={navHref(locale, '')} className="jb-link-gold">
            ← {tn(locale, 'home')}
          </Link>
        </>
      )}
    </SubPageLayout>
  );
}
