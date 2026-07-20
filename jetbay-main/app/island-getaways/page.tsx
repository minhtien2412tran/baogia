'use client';
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { IslandHero } from '@/components/IslandHero';
import { IslandFeatured } from '@/components/IslandFeatured';
import { IslandInfo } from '@/components/IslandInfo';
import { IslandFAQ } from '@/components/IslandFAQ';

export default function IslandGetawaysPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden bg-white dark:bg-[#0B1121]">
          <IslandHero />
          <IslandFeatured />
          <IslandInfo />
          <IslandFAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
