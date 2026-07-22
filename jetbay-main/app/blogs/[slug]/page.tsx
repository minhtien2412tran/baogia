import React from 'react';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { BLOGS_DATA } from '@/lib/blogsData';
import { BlogDetailHero } from '@/components/BlogDetailHero';
import { BlogDetailContent } from '@/components/BlogDetailContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const blog = BLOGS_DATA.find(item => item.slug === slug) || BLOGS_DATA[0];

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors">
      <Topbar />
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          <BlogDetailHero blog={blog} />
          <BlogDetailContent />
          <Footer />
        </main>
      </div>
    </div>
  );
}
