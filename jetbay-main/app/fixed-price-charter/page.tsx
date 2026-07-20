import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { FixedPriceHero } from '@/components/FixedPriceHero';
import { FixedPriceRoutesGrid } from '@/components/FixedPriceRoutesGrid';
import { FixedPriceInfoCards } from '@/components/FixedPriceInfoCards';
import { FixedPriceFAQ } from '@/components/FixedPriceFAQ';
import { FixedPriceContact } from '@/components/FixedPriceContact';
import { Footer } from '@/components/Footer';

export default function FixedPriceCharterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <FixedPriceHero />
          <FixedPriceRoutesGrid />
          <FixedPriceInfoCards />
          <FixedPriceFAQ />
          <FixedPriceContact />
          <Footer />
        </main>
      </div>
    </div>
  );
}
