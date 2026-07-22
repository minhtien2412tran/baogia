import React from 'react';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { DESTINATIONS_DATA } from '@/lib/destinationsData';
import { DestinationDetailHero } from '@/components/DestinationDetailHero';
import { DestinationDetailArticle } from '@/components/DestinationDetailArticle';
import { DestinationDetailCities } from '@/components/DestinationDetailCities';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const destination = DESTINATIONS_DATA.find(item => item.slug === slug) || DESTINATIONS_DATA[0];

  if (!destination) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <DestinationDetailHero destination={destination} />
          <DestinationDetailArticle destination={destination} />
          <DestinationDetailCities destination={destination} />
          <Footer />
        </main>
      </div>
    </div>
  );
}
