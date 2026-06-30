import { api, safeApi } from '../../lib/api';
import { apiLocale } from '../../config/locales';
import { buildMetadata } from '../../lib/metadata';
import { parseBookingProcessBody } from '../../lib/booking-process-default';
import { rebrandText } from '../../lib/brand';
import { BookingProcessPage } from '../../components/pages/BookingProcessPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await safeApi(() => api.getContentPage('booking-process', apiLocale(locale)), null);
  return buildMetadata({
    title: page?.seoMeta?.title ? rebrandText(String(page.seoMeta.title)) : 'How Booking Works',
    description: page?.seoMeta?.description
      ? rebrandText(String(page.seoMeta.description))
      : 'Step-by-step guide to chartering a private jet with J-TA.',
    path: '/booking-process',
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await safeApi(() => api.getContentPage('booking-process', apiLocale(locale)), null);
  const data = parseBookingProcessBody(page?.body);

  if (page?.title) {
    data.heroTitle = rebrandText(String(page.title));
  }
  if (page?.excerpt) {
    data.heroSubtitle = rebrandText(String(page.excerpt));
  }

  return <BookingProcessPage locale={locale} data={data} />;
}
