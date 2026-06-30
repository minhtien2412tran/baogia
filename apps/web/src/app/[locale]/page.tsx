import { api, safeApi } from '../../lib/api';

import { buildMetadata } from '../../lib/metadata';

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

import { fixedPriceRegion } from '../../config/jetbay-cdn';



export async function generateMetadata() {

  return buildMetadata({

    title: 'Best Private Jet Charter In The USA 2026',

    description: 'Global Private Jet Charter: Access to 10,000+ Aircraft. Seamless, trusted access to private aviation worldwide.',

    path: '/',

  });

}



export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {

  const { locale } = await params;

  const region = fixedPriceRegion(locale);

  const [routes, emptyLegs, jetPlans] = await Promise.all([

    safeApi(() => api.getFixedPriceRoutes(region), { routes: [] }),

    safeApi(() => api.getEmptyLegs(), { emptyLegs: [] }),

    safeApi(() => api.getJetCardPlans(), { plans: [] }),

  ]);



  return (

    <main>

      <HeroSection locale={locale} />

      <PromoCarousel locale={locale} />

      <FixedPriceSection locale={locale} routes={routes.routes} />

      <EmptyLegsSection locale={locale} emptyLegs={emptyLegs.emptyLegs} />

      <DestinationsSection locale={locale} />

      <SosSection locale={locale} />

      <JetCardHomeSection locale={locale} plans={jetPlans.plans} />

      <PartnerSection locale={locale} />

      <AppDownloadSection locale={locale} />

      <WhySections locale={locale} />

      <StatsSection />

      <MediaSection />

    </main>

  );

}

