import { HeroSection } from '../../components/home/HeroSection';
import { PromoCarousel } from '../../components/home/PromoCarousel';
import { FixedPriceSection } from '../../components/home/FixedPriceSection';
import { EmptyLegsSection } from '../../components/home/EmptyLegsSection';
import { DestinationsSection } from '../../components/home/DestinationsSection';
import { SosSection } from '../../components/home/SosSection';
import { JetCardHomeSection } from '../../components/home/JetCardHomeSection';
import { PartnerSection } from '../../components/home/PartnerSection';
import { AppDownloadSection } from '../../components/home/AppDownloadSection';
import { WhySections } from '../../components/home/WhySections';
import { StatsSection } from '../../components/home/StatsSection';
import { MediaSection } from '../../components/home/MediaSection';
import { NewsHomeSection } from '../../components/home/NewsHomeSection';
import { NewsletterBand } from '../../components/home/NewsletterBand';
import { api, loadApi } from '../../lib/api';
import { buildMetadata } from '../../lib/metadata';
import { SHOW_UNVERIFIED_MARKETING_SECTIONS } from '../../lib/brand';
import { fixedPriceRegion } from '../../config/jetbay-cdn';

export async function generateMetadata() {
  return buildMetadata({
    title: 'Private Jet Charter',
    description: 'Private air charter booking — request quotes, empty legs, and managed itineraries.',
    path: '/',
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const region = fixedPriceRegion(locale);
  const [routesLoad, emptyLegsLoad, jetPlansLoad] = await Promise.all([
    loadApi(() => api.getFixedPriceRoutes(region), { routes: [] }),
    loadApi(() => api.getEmptyLegs(), { emptyLegs: [] }),
    loadApi(() => api.getJetCardPlans(), { plans: [] }),
  ]);

  return (
    <main>
      <HeroSection locale={locale} />
      <PromoCarousel locale={locale} />
      <FixedPriceSection
        locale={locale}
        routes={routesLoad.data.routes}
        loadError={!routesLoad.ok}
      />
      <EmptyLegsSection
        locale={locale}
        emptyLegs={emptyLegsLoad.data.emptyLegs}
        loadError={!emptyLegsLoad.ok}
      />
      <DestinationsSection locale={locale} />
      {SHOW_UNVERIFIED_MARKETING_SECTIONS ? (
        <>
          <SosSection locale={locale} />
          <JetCardHomeSection
            locale={locale}
            plans={jetPlansLoad.data.plans}
            loadError={!jetPlansLoad.ok}
          />
          <PartnerSection locale={locale} />
          <AppDownloadSection locale={locale} />
          <WhySections locale={locale} />
        </>
      ) : null}
      <StatsSection />
      <NewsHomeSection locale={locale} />
      <NewsletterBand locale={locale} />
      <MediaSection locale={locale} />
    </main>
  );
}
