import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { HowToBookHero } from '@/components/HowToBookHero';
import { HowToBookSteps } from '@/components/HowToBookSteps';
import { HowToBookExceptional } from '@/components/HowToBookExceptional';
import { HowToPaySection } from '@/components/HowToPaySection';
import { HowToBookStatsPlatform } from '@/components/HowToBookStatsPlatform';

export default function HowToBookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <HowToBookHero />
          <HowToBookSteps />
          <HowToBookExceptional />
          <HowToPaySection />
          <HowToBookStatsPlatform />
          <Footer />
        </main>
      </div>
    </div>
  );
}
