import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { AirAmbulanceHero } from '@/components/AirAmbulanceHero';
import { AirAmbulanceSOSBanner } from '@/components/AirAmbulanceSOSBanner';
import { AirAmbulancePromotions } from '@/components/AirAmbulancePromotions';
import { AirAmbulanceBedToBed } from '@/components/AirAmbulanceBedToBed';
import { AirAmbulanceFleet } from '@/components/AirAmbulanceFleet';
import { AirAmbulanceGlobalService } from '@/components/AirAmbulanceGlobalService';
import { AirAmbulanceMedicalEquipment } from '@/components/AirAmbulanceMedicalEquipment';
import { AirAmbulanceTestimonials } from '@/components/AirAmbulanceTestimonials';
import { AirAmbulanceWhyChoose } from '@/components/AirAmbulanceWhyChoose';
import { AirAmbulancePartnerships } from '@/components/AirAmbulancePartnerships';
import { AirAmbulanceFAQ } from '@/components/AirAmbulanceFAQ';

export default function AirAmbulancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <AirAmbulanceHero />
          <AirAmbulanceSOSBanner />
          <AirAmbulancePromotions />
          <AirAmbulanceBedToBed />
          <AirAmbulanceFleet />
          <AirAmbulanceGlobalService />
          <AirAmbulanceMedicalEquipment />
          <AirAmbulanceTestimonials />
          <AirAmbulanceWhyChoose />
          <AirAmbulancePartnerships />
          <AirAmbulanceFAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
