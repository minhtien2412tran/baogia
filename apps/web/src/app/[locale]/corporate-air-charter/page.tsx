import { ServicePage } from '../../../components/layout/ServicePage';
import { servicePageMetadata } from '../../../lib/service-page';

const KEY = 'corporate-air-charter';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return servicePageMetadata(KEY, locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ServicePage locale={locale} pageKey={KEY} />;
}
