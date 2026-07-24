import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Hero } from '@/components/Hero';
import { PromoBanner } from '@/components/PromoBanner';
import { EmptyLegs } from '@/components/EmptyLegs';
import { FixedPriceRoutes } from '@/components/FixedPriceRoutes';
import { CuratedFlights } from '@/components/CuratedFlights';
import { MedicalAssistance } from '@/components/MedicalAssistance';
import { JetCard } from '@/components/JetCard';
import { PartnerProgram } from '@/components/PartnerProgram';
import { MobileApp } from '@/components/MobileApp';
import { WhyCharter } from '@/components/WhyCharter';
import { WhyChoose } from '@/components/WhyChoose';
import { ExploreWorld } from '@/components/ExploreWorld';
import { LogoStrip } from '@/components/LogoStrip';
import { Stats } from '@/components/Stats';
import { Footer } from '@/components/Footer';
import { api, loadApi } from '@/lib/api';
import { mapEmptyLegs, mapFixedRoutes, mapJetPlans } from '@/lib/mappers';

export default async function Home() {
  const [emptyLoad, routesLoad, plansLoad] = await Promise.all([
    loadApi(() => api.getEmptyLegs(), { emptyLegs: [] }),
    loadApi(() => api.getFixedPriceRoutes(), { routes: [] }),
    loadApi(() => api.getJetCardPlans(), { plans: [] }),
  ]);

  const emptyLegs = mapEmptyLegs(emptyLoad.data.emptyLegs as Array<Record<string, unknown>>);
  const routes = mapFixedRoutes(routesLoad.data.routes as Array<Record<string, unknown>>);
  const plans = mapJetPlans(plansLoad.data.plans as Array<Record<string, unknown>>);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <Hero />
          <PromoBanner />
          <EmptyLegs legs={emptyLegs} loadError={emptyLoad.ok ? null : emptyLoad.error} />
          <FixedPriceRoutes routes={routes} loadError={routesLoad.ok ? null : routesLoad.error} />
          <CuratedFlights />
          <MedicalAssistance />
          <JetCard plans={plans} loadError={plansLoad.ok ? null : plansLoad.error} />
          <PartnerProgram />
          <MobileApp />
          <WhyCharter />
          <WhyChoose />
          <ExploreWorld />
          <LogoStrip />
          <Stats />
          <Footer />
        </main>
      </div>
    </div>
  );
}
