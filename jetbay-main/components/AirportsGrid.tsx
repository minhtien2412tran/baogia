'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AIRPORTS_DATA } from '@/lib/airportsData';
import { ChevronDown } from 'lucide-react';

export const AirportsGrid = () => {
  const [activeRegion, setActiveRegion] = useState('North America');

  const regions = ['North America', 'Europe', 'Popular Routes'];

  // Filter items by region
  const filteredAirports = AIRPORTS_DATA.filter(
    item => item.region === activeRegion || activeRegion === 'Popular Routes'
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16 font-sans">
      
      {/* Header & Subhead */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#0B1F3A] dark:text-white tracking-tight mb-3">
          Connecting You to Premier Private Jet Airports
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-slate-500 dark:text-gray-400 max-w-4xl font-medium leading-relaxed">
          Explore a curated collection of airports and routes within the Jetbay network, highlighting our global reach and tailored private charter solutions.
        </p>
      </div>

      {/* Region Tabs */}
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-slate-200 dark:border-gray-800 pb-3 mb-8 scrollbar-none text-[15px] font-semibold">
        {regions.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveRegion(tab)}
            className={`whitespace-nowrap transition-colors cursor-pointer relative pb-1 ${
              activeRegion === tab
                ? 'text-[#0B1F3A] dark:text-white font-bold border-b-2 border-[#0B1F3A] dark:border-white'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Airports 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAirports.map((item) => (
          <div key={item.slug} className="group flex flex-col gap-4">
            <Link 
              href={`/airports/${item.slug}`}
              className="relative rounded-[4px] overflow-hidden min-h-[220px] sm:min-h-[240px] flex flex-col justify-center p-6 transition-all duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
              </div>

              {/* Card Content Overlay */}
              <div className="relative z-10 text-white text-center space-y-3">
                <h3 className="text-[18px] sm:text-[20px] font-bold tracking-tight px-4">
                  Private Jet Charter from {item.name}
                </h3>
                <div className="inline-block bg-[#40DACD] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {item.code}
                </div>
              </div>
            </Link>

            {/* Title Below Image */}
            <h4 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white">
              <Link href={`/airports/${item.slug}`} className="hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors">
                {item.title}
              </Link>
            </h4>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-12 text-center">
        <button className="text-[14px] font-bold text-[#0B1F3A] dark:text-white hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto">
          <span>View More</span>
          <ChevronDown size={16} />
        </button>
      </div>

    </div>
  );
};
