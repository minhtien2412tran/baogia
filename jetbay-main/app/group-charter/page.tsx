'use client';
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { GroupCharterHero } from '@/components/GroupCharterHero';
import { GroupCharterExplore } from '@/components/GroupCharterExplore';
import { GroupCharterPromotions } from '@/components/GroupCharterPromotions';
import { GroupCharterDescription } from '@/components/GroupCharterDescription';
import { GroupCharterServicesOffer } from '@/components/GroupCharterServicesOffer';
import { GroupCharterWhyChoose } from '@/components/GroupCharterWhyChoose';
import { GroupCharterPopularJets } from '@/components/GroupCharterPopularJets';
import { GroupCharterProcess } from '@/components/GroupCharterProcess';
import { GroupCharterFAQ } from '@/components/GroupCharterFAQ';

export default function GroupCharterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <GroupCharterHero />
          <GroupCharterExplore />
          <GroupCharterPromotions />
          <GroupCharterDescription />
          <GroupCharterServicesOffer />
          <GroupCharterWhyChoose />
          <GroupCharterPopularJets />
          <GroupCharterProcess />
          <GroupCharterFAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
