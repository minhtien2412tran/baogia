import React from 'react';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { AIRPORTS_DATA } from '@/lib/airportsData';
import { AirportDetailHero } from '@/components/AirportDetailHero';
import { AirportDetailContent } from '@/components/AirportDetailContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AirportDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const airport = AIRPORTS_DATA.find(item => item.slug === slug) || AIRPORTS_DATA[0];

  if (!airport) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <AirportDetailHero airport={airport} />
          <AirportDetailContent />
          <Footer />
        </main>
      </div>
    </div>
  );
}
