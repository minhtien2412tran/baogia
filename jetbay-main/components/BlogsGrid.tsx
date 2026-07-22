'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BLOGS_DATA } from '@/lib/blogsData';
import { ChevronDown } from 'lucide-react';

export const BlogsGrid = () => {
  const [activeCategory, setActiveCategory] = useState('Private Jet Guide');

  const categories = ['Private Jet Guide', 'Events & Activities', 'Jetbay Highlights', 'Client Stories', 'Aircraft & Fleets'];

  // Filter items by category
  const filteredBlogs = BLOGS_DATA.filter(
    item => item.category === activeCategory
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16 font-sans">
      
      {/* Header & Subhead */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#0B1F3A] dark:text-white tracking-tight mb-3">
          Exploring Private Aviation, Events & Insights
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-slate-500 dark:text-gray-400 max-w-4xl font-medium leading-relaxed">
          Jetbay curates expert insights, data-led perspectives, and access to the world&apos;s most anticipated global events. From major sporting and cultural gatherings to strategic private aviation guidance, our editorial content supports informed planning as demand rises throughout the year.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-slate-200 dark:border-gray-800 pb-3 mb-8 scrollbar-none text-[15px] font-semibold">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`whitespace-nowrap transition-colors cursor-pointer relative pb-1 ${
              activeCategory === tab
                ? 'text-[#0B1F3A] dark:text-white font-bold border-b-2 border-[#0B1F3A] dark:border-white'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Blogs 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {filteredBlogs.map((item) => (
          <div key={item.slug} className="group flex flex-col gap-4">
            <Link 
              href={`/blogs/${item.slug}`}
              className="relative w-full aspect-video rounded-[8px] overflow-hidden block transition-all duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>

            {/* Title Below Image */}
            <h4 className="text-[18px] sm:text-[20px] font-bold text-[#0B1F3A] dark:text-white leading-tight">
              <Link href={`/blogs/${item.slug}`} className="hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors">
                {item.title}
              </Link>
            </h4>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-16 text-center">
        <button className="text-[14px] font-bold text-[#0B1F3A] dark:text-white hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto">
          <span>View More</span>
          <ChevronDown size={16} />
        </button>
      </div>

    </div>
  );
};
