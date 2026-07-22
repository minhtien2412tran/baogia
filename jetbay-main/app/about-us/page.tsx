import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { AboutHero } from '@/components/AboutHero';
import { AboutPowering } from '@/components/AboutPowering';
import { AboutRedefining } from '@/components/AboutRedefining';
import { AboutTeam } from '@/components/AboutTeam';
import { AboutAwards } from '@/components/AboutAwards';
import { AboutWhyCharter } from '@/components/AboutWhyCharter';
import { AboutContact } from '@/components/AboutContact';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <AboutHero />
          <AboutPowering />
          <AboutRedefining />
          <AboutTeam />
          <AboutAwards />
          <AboutWhyCharter />
          <AboutContact />
          <Footer />
        </main>
      </div>
    </div>
  );
}
