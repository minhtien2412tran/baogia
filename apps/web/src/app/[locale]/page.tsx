import { api, safeApi } from '../../lib/api';
import { buildMetadata } from '../../lib/metadata';
import { HeroSection } from '../../components/home/HeroSection';
import { PromoCarousel } from '../../components/home/PromoCarousel';
import { EmptyLegsSection } from '../../components/home/EmptyLegsSection';
import { FixedPriceSection } from '../../components/home/FixedPriceSection';
import { DestinationsSection } from '../../components/home/DestinationsSection';
import { SosSection } from '../../components/home/SosSection';
import { JetCardHomeSection } from '../../components/home/JetCardHomeSection';
import { PartnerSection } from '../../components/home/PartnerSection';
import { AppDownloadSection } from '../../components/home/AppDownloadSection';
import { WhySections } from '../../components/home/WhySections';
import { StatsSection } from '../../components/home/StatsSection';
import { MediaLogos } from '../../components/home/MediaLogos';

export async function generateMetadata() {
  return buildMetadata({
    title: 'Best Private Jet Charter In Global 2026',
    description: 'Global Private Jet Charter: Access to 10,000+ Aircraft. Seamless, trusted access to private aviation worldwide.',
    path: '/',
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [routes, emptyLegs, destinations, jetPlans] = await Promise.all([
    safeApi(() => api.getFixedPriceRoutes('Europe'), { routes: [] }),
    safeApi(() => api.getEmptyLegs(), { emptyLegs: [] }),
    safeApi(() => api.getDestinations(), { destinations: [] }),
    safeApi(() => api.getJetCardPlans(), { plans: [] }),
  ]);

  return (
    <>
      <main>
        <HeroSection locale={locale} />
        <PromoCarousel locale={locale} />
        <EmptyLegsSection locale={locale} emptyLegs={emptyLegs.emptyLegs} />
        <FixedPriceSection locale={locale} routes={routes.routes} />
        <DestinationsSection locale={locale} destinations={destinations.destinations} />
        <SosSection locale={locale} />
        <JetCardHomeSection locale={locale} plans={jetPlans.plans} />
        <PartnerSection locale={locale} />
        <AppDownloadSection locale={locale} />
        <WhySections locale={locale} />
        <StatsSection />
        <MediaLogos />
      </main>
    </>
  );
}
