import { apiLocale } from '../../../config/locales';
import { buildMetadata } from '../../../lib/metadata';
import { parseBookingProcessBody } from '../../../lib/booking-process-default';
import { rebrandText } from '../../../lib/brand';
import { BookingProcessPage } from '../../../components/pages/BookingProcessPage';
import { contentSeo, fetchContentPage } from '../../../lib/content-page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await fetchContentPage('booking-process', apiLocale(locale));
  const seo = contentSeo(page);
  return buildMetadata({
    title: seo?.title ? rebrandText(seo.title) : 'How Booking Works',
    description: seo?.description
      ? rebrandText(seo.description)
      : 'Step-by-step guide to chartering a private jet with J-TA.',
    path: '/booking-process',
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await fetchContentPage('booking-process', apiLocale(locale));
  const data = parseBookingProcessBody(page?.body);

  if (page?.title) {
    data.heroTitle = rebrandText(String(page.title));
  }
  if (page?.excerpt) {
    data.heroSubtitle = rebrandText(String(page.excerpt));
  }

  return <BookingProcessPage locale={locale} data={data} />;
}
