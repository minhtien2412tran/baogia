import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { GolfHero } from '@/components/GolfHero';
import { GolfLogos } from '@/components/GolfLogos';
import { GolfFeatured } from '@/components/GolfFeatured';
import { GolfInfo } from '@/components/GolfInfo';
import { GolfFAQ } from '@/components/GolfFAQ';

export default function GolfGetawaysPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <GolfHero />
          <GolfLogos />
          <GolfFeatured />
          <GolfInfo />
          <GolfFAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
