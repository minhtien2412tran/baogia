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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <Hero />
          <PromoBanner />
          <EmptyLegs />
          <FixedPriceRoutes />
          <CuratedFlights />
          <MedicalAssistance />
          <JetCard />
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
