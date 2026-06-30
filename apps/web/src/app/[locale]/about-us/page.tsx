import { api, safeApi } from '../../lib/api';
import { apiLocale } from '../../config/locales';
import { buildMetadata } from '../../lib/metadata';
import { parseAboutUsBody } from '../../lib/about-us-default';
import { rebrandText } from '../../lib/brand';
import { AboutUsPage } from '../../components/pages/AboutUsPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await safeApi(() => api.getContentPage('about-us', apiLocale(locale)), null);
  return buildMetadata({
    title: page?.seoMeta?.title ? rebrandText(String(page.seoMeta.title)) : 'About J-TA',
    description: page?.seoMeta?.description
      ? rebrandText(String(page.seoMeta.description))
      : 'Learn about J-TA — your global private jet charter partner.',
    path: '/about-us',
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await safeApi(() => api.getContentPage('about-us', apiLocale(locale)), null);
  const data = parseAboutUsBody(page?.body);

  if (page?.title) {
    data.heroTitle = rebrandText(String(page.title));
  }
  if (page?.excerpt) {
    data.heroSubtitle = rebrandText(String(page.excerpt));
  }

  return <AboutUsPage locale={locale} data={data} />;
}
