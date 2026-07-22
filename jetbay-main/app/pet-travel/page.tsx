import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { PetTravelHero } from '@/components/PetTravelHero';
import { PetTravelIntro } from '@/components/PetTravelIntro';
import { PetTravelPromotions } from '@/components/PetTravelPromotions';
import { PetTravelBannerQuote } from '@/components/PetTravelBannerQuote';
import { PetTravelBenefits } from '@/components/PetTravelBenefits';
import { PetTravelWhyJetbay } from '@/components/PetTravelWhyJetbay';
import { PetTravelFleet } from '@/components/PetTravelFleet';
import { PetTravelProcess } from '@/components/PetTravelProcess';
import { PetTravelFAQ } from '@/components/PetTravelFAQ';

export default function PetTravelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <PetTravelHero />
          <PetTravelIntro />
          <PetTravelPromotions />
          <PetTravelBannerQuote />
          <PetTravelBenefits />
          <PetTravelWhyJetbay />
          <PetTravelFleet />
          <PetTravelProcess />
          <PetTravelFAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
