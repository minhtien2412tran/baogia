import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { OnDemandHero } from '@/components/OnDemandHero';
import { GlobalService } from '@/components/GlobalService';
import { Promotions } from '@/components/Promotions';
import { OnDemandServices } from '@/components/OnDemandServices';
import { ExceptionalService } from '@/components/ExceptionalService';
import { PopularJets } from '@/components/PopularJets';
import { CharterProcess } from '@/components/CharterProcess';
import { FAQ } from '@/components/FAQ';
import { Stats } from '@/components/Stats';
import { Footer } from '@/components/Footer';

export default function OnDemandCharterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <OnDemandHero />
          <GlobalService />
          <Promotions />
          <OnDemandServices />
          <ExceptionalService />
          <PopularJets />
          <CharterProcess />
          <FAQ />
          <Stats />
          <Footer />
        </main>
      </div>
    </div>
  );
}
