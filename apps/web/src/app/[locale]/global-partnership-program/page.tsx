import { ServicePage } from '../../../components/layout/ServicePage';
import { PartnerProgramsSection } from '../../../components/partner/PartnerProgramsSection';
import { PartnerApplicationForm } from '../../../components/partner/PartnerApplicationForm';
import { servicePageMetadata } from '../../../lib/service-page';

const KEY = 'global-partnership-program';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return servicePageMetadata(KEY, locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <ServicePage locale={locale} pageKey={KEY} />
      <PartnerProgramsSection />
      <PartnerApplicationForm />
    </>
  );
}
