import { ServicePage } from '../../../components/layout/ServicePage';
import { servicePageMetadata } from '../../../lib/service-page';

const KEY = 'jetbay-private-jet-app';

export function generateMetadata() {
  return servicePageMetadata(KEY);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ServicePage locale={locale} pageKey={KEY} />;
}
