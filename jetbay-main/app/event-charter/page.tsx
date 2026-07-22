import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { EventCharterHero } from '@/components/EventCharterHero';
import { EventCharterIntro } from '@/components/EventCharterIntro';
import { EventCharterPromotions } from '@/components/EventCharterPromotions';
import { EventCharterBannerQuote } from '@/components/EventCharterBannerQuote';
import { EventCharterServices } from '@/components/EventCharterServices';
import { EventCharterWhyJetbay } from '@/components/EventCharterWhyJetbay';
import { EventCharterFleet } from '@/components/EventCharterFleet';
import { EventCharterProcess } from '@/components/EventCharterProcess';
import { EventCharterFAQ } from '@/components/EventCharterFAQ';

export default function EventCharterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <EventCharterHero />
          <EventCharterIntro />
          <EventCharterPromotions />
          <EventCharterBannerQuote />
          <EventCharterServices />
          <EventCharterWhyJetbay />
          <EventCharterFleet />
          <EventCharterProcess />
          <EventCharterFAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
