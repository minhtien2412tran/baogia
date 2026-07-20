import React from 'react';
import { TopbarFull } from '@/components/TopbarFull';
import { Footer } from '@/components/Footer';
import { MembershipsHero } from '@/components/MembershipsHero';
import { MembershipsIntro } from '@/components/MembershipsIntro';
import { MembershipsSteps } from '@/components/MembershipsSteps';
import { MembershipsPrivileges } from '@/components/MembershipsPrivileges';
import { MembershipsBankPerks } from '@/components/MembershipsBankPerks';
import { MembershipsServicePrivileges } from '@/components/MembershipsServicePrivileges';
import { MembershipsCTA } from '@/components/MembershipsCTA';
import { Stats } from '@/components/Stats';

export default function MembershipsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans selection:bg-[#40DACD]/30">
      <TopbarFull />
      
      <main className="flex-1 w-full">
        <MembershipsHero />
        <MembershipsIntro />
        <MembershipsSteps />
        <MembershipsPrivileges />
        <MembershipsBankPerks />
        <MembershipsServicePrivileges />
        <MembershipsCTA />
        <Stats />
      </main>
      
      <Footer />
    </div>
  );
}
