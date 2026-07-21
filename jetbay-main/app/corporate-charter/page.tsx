'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { CorporateCharterHero } from '@/components/CorporateCharterHero';
import { CorporateCharterInfo } from '@/components/CorporateCharterInfo';
import { CorporateCharterPromotions } from '@/components/CorporateCharterPromotions';
import { CorporateCharterBusinessJetCharter } from '@/components/CorporateCharterBusinessJetCharter';
import { CorporateCharterBenefits } from '@/components/CorporateCharterBenefits';
import { CorporateCharterServicesOffer } from '@/components/CorporateCharterServicesOffer';
import { CorporateCharterBento } from '@/components/CorporateCharterBento';
import { CorporateCharterPopularJets } from '@/components/CorporateCharterPopularJets';
import { CorporateCharterProcess } from '@/components/CorporateCharterProcess';
import { CorporateCharterFAQ } from '@/components/CorporateCharterFAQ';

export default function CorporateCharterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <CorporateCharterHero />
          <CorporateCharterInfo />
          <CorporateCharterPromotions />
          <CorporateCharterBusinessJetCharter />
          <CorporateCharterBenefits />
          <CorporateCharterServicesOffer />
          <CorporateCharterBento />
          <CorporateCharterPopularJets />
          <CorporateCharterProcess />
          <CorporateCharterFAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
