import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { EmptyLegsHero } from '@/components/EmptyLegsHero';
import { EmptyLegsLiveDeals } from '@/components/EmptyLegsLiveDeals';
import { EmptyLegsWhyChoose } from '@/components/EmptyLegsWhyChoose';
import { EmptyLegsInfo } from '@/components/EmptyLegsInfo';
import { EmptyLegsStats } from '@/components/EmptyLegsStats';
import { EmptyLegsBanner } from '@/components/EmptyLegsBanner';
import { EmptyLegsFAQ } from '@/components/EmptyLegsFAQ';

export default function EmptyLegsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors font-sans selection:bg-[#13B2A6]/20">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <EmptyLegsHero />
          <EmptyLegsLiveDeals />
          <EmptyLegsWhyChoose />
          <EmptyLegsInfo />
          <EmptyLegsStats />
          <EmptyLegsBanner />
          <EmptyLegsFAQ />
          <Footer />
        </main>
        
      </div>
    </div>
  );
}
