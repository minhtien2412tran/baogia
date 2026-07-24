import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { FixedPriceHero } from '@/components/FixedPriceHero';
import { FixedPriceRoutesGrid } from '@/components/FixedPriceRoutesGrid';
import { FixedPriceInfoCards } from '@/components/FixedPriceInfoCards';
import { FixedPriceFAQ } from '@/components/FixedPriceFAQ';
import { FixedPriceContact } from '@/components/FixedPriceContact';
import { Footer } from '@/components/Footer';
import { api, loadApi } from '@/lib/api';
import { mapFixedRoutes } from '@/lib/mappers';

export default async function FixedPriceCharterPage() {
  const routesLoad = await loadApi(() => api.getFixedPriceRoutes(), { routes: [] });
  const routes = mapFixedRoutes(routesLoad.data.routes as Array<Record<string, unknown>>);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <FixedPriceHero />
          <FixedPriceRoutesGrid routes={routes} loadError={routesLoad.ok ? null : routesLoad.error} />
          <FixedPriceInfoCards />
          <FixedPriceFAQ />
          <FixedPriceContact />
          <Footer />
        </main>
      </div>
    </div>
  );
}
