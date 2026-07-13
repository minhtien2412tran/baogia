import { apiLocale } from '../../../config/locales';
import { buildMetadata } from '../../../lib/metadata';
import { parseAboutUsBody } from '../../../lib/about-us-default';
import { rebrandText } from '../../../lib/brand';
import { AboutUsPage } from '../../../components/pages/AboutUsPage';
import { contentSeo, fetchContentPage } from '../../../lib/content-page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await fetchContentPage('about-us', apiLocale(locale));
  const seo = contentSeo(page);
  return buildMetadata({
    title: seo?.title ? rebrandText(seo.title) : 'About JetVina',
    description: seo?.description
      ? rebrandText(seo.description)
      : 'Learn About JetVina — your global private jet charter partner.',
    path: '/about-us',
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await fetchContentPage('about-us', apiLocale(locale));
  const data = parseAboutUsBody(page?.body);

  if (page?.title) {
    data.heroTitle = rebrandText(String(page.title));
  }
  if (page?.excerpt) {
    data.heroSubtitle = rebrandText(String(page.excerpt));
  }

  return <AboutUsPage locale={locale} data={data} />;
}
