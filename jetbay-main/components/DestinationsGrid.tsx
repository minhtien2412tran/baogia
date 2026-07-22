'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DESTINATIONS_DATA } from '@/lib/destinationsData';

export const DestinationsGrid = () => {
  const [activeContinent, setActiveContinent] = useState('Asia');

  const continents = [
    'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Central America', 'Oceania', 'Caribbean'
  ];

  // Filter items by continent
  const filteredDestinations = DESTINATIONS_DATA.filter(
    item => item.continent === activeContinent
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Header & Subhead */}
      <div className="mb-8">
        <h2 className="text-[26px] md:text-[30px] font-extrabold text-[#0B1F3A] dark:text-white tracking-tight mb-2">
          Explore with Jetbay
        </h2>
        <p className="text-[13.5px] sm:text-[14px] text-slate-500 dark:text-gray-400 max-w-5xl font-medium leading-relaxed">
          Explore these fascinating tourist cities with the added convenience of private charter flights, and experience the unique charm of different cultures in ultimate comfort. Whether you prefer a relaxing beach vacation, exploring historical landmarks, or enjoying the hustle and bustle of modern cities, Jetbay is making sure to provide you with unforgettable memories.
        </p>
      </div>

      {/* Continent Tabs */}
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-slate-200 dark:border-gray-800 pb-3 mb-8 scrollbar-none text-[14px] font-semibold">
        {continents.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveContinent(tab)}
            className={`whitespace-nowrap transition-colors cursor-pointer relative pb-1 ${
              activeContinent === tab
                ? 'text-[#13B2A6] dark:text-[#40DACD] font-bold border-b-2 border-[#13B2A6] dark:border-[#40DACD]'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Destinations 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDestinations.map((item) => (
          <Link 
            key={item.slug} 
            href={`/destinations/${item.slug}`}
            className="group relative rounded-[20px] overflow-hidden min-h-[260px] sm:min-h-[290px] flex flex-col justify-end p-6 border border-slate-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image 
                src={item.heroImage} 
                alt={item.name} 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"></div>
            </div>

            {/* Featured Badge */}
            {item.featured && (
              <div className="absolute top-4 left-4 z-10 bg-amber-500/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-xs flex items-center gap-1">
                <span>🔥 Featured</span>
              </div>
            )}

            {/* Card Content Overlay */}
            <div className="relative z-10 text-white space-y-1.5">
              <h3 className="text-[22px] sm:text-[24px] font-bold tracking-tight">
                {item.name}
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-gray-200 line-clamp-2 font-normal leading-relaxed opacity-90">
                {item.shortDesc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Button / Link */}
      <div className="mt-10 text-center">
        <button className="text-[13.5px] font-bold text-slate-500 dark:text-gray-400 hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors cursor-pointer">
          View more
        </button>
      </div>

    </div>
  );
};
