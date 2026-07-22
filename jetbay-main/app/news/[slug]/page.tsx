import React from 'react';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { NEWS_DATA } from '@/lib/newsData';
import { NewsDetail } from '@/components/NewsDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const news = NEWS_DATA.find(item => item.slug === slug) || NEWS_DATA.find(item => item.slug === 'avoid-flight-delays-winter-storms') || NEWS_DATA[0];

  if (!news) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <NewsDetail news={news} />
          <Footer />
        </main>
      </div>
    </div>
  );
}
