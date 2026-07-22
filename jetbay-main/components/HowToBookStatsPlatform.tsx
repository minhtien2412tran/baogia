'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const HowToBookStatsPlatform = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title Header */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight flex items-center gap-2">
          <span>A leading global private jet charter platform</span>
          <ArrowUpRight size={22} className="text-[#0B1F3A] dark:text-white" />
        </h2>
        <span className="bg-[#EAF8F7] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD] text-[11px] font-bold px-3 py-1 rounded-full border border-[#C3EFEA] dark:border-[#1E4D48]">
          Trusted Worldwide
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Card 1: No. 1 Asia's Transaction Volume */}
        <div className="lg:col-span-3 bg-[#F8FAFC] dark:bg-[#152033] rounded-[24px] p-6 border border-slate-100 dark:border-gray-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="inline-block bg-[#13B2A6] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-4">
              Volume
            </div>
            <h3 className="text-[32px] font-extrabold text-[#0B1F3A] dark:text-white leading-tight">
              No.1
            </h3>
            <h4 className="text-[14px] font-bold text-[#0B1F3A] dark:text-gray-200 mt-1 mb-3">
              Asia&apos;s Transaction Volume
            </h4>
            <p className="text-[12px] text-slate-500 dark:text-gray-400 font-normal leading-relaxed">
              Jetbay leads private aviation transactions across Asia, connecting key business and leisure hubs with precision. A trusted platform for high-volume and time-critical flights.
            </p>
          </div>
        </div>

        {/* Card 2: 190+ Countries Flown */}
        <div className="lg:col-span-3 bg-white dark:bg-[#152033] rounded-[24px] p-6 border border-slate-100 dark:border-gray-800 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <h3 className="text-[36px] font-extrabold text-[#13B2A6] dark:text-[#40DACD] leading-none mb-1">
              190+
            </h3>
            <span className="inline-block bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-4">
              Countries Flown
            </span>
            <p className="text-[12px] text-slate-500 dark:text-gray-400 font-normal leading-relaxed">
              Our global network spans over 190 countries, providing seamless access to major cities and remote destinations. Wherever you fly, Jetbay is already there.
            </p>
          </div>

          {/* Plane path trajectory icon line at bottom */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 dark:from-gray-800 dark:via-gray-600 dark:to-gray-800 relative flex items-center justify-center">
              <span className="text-slate-500 text-[10px] bg-white dark:bg-[#152033] px-2 font-mono">✈</span>
            </div>
          </div>
        </div>

        {/* Card 3: 5K+ Annual Flights */}
        <div className="lg:col-span-3 bg-white dark:bg-[#152033] rounded-[24px] p-6 border border-slate-100 dark:border-gray-800 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-[36px] font-extrabold text-[#0B1F3A] dark:text-white leading-none mb-1">
              5K+
            </h3>
            <h4 className="text-[14px] font-bold text-[#0B1F3A] dark:text-gray-200 mb-3">
              Annual Flights
            </h4>
            <p className="text-[12px] text-slate-500 dark:text-gray-400 font-normal leading-relaxed">
              Thousands of flights are managed through our platform every year, backed by experienced operators and rigorous safety standards. Operational excellence at a truly global scale.
            </p>
          </div>
        </div>

        {/* Card 4: 10K+ Clients Served Worldwide (Dark Teal Accent Card) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#0B2D38] via-[#0E3D48] to-[#0A232C] text-white rounded-[24px] p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="text-[#40DACD] mb-4">
              <ArrowUpRight size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-[36px] font-extrabold text-white leading-none mb-1">
              10K+
            </h3>
            <h4 className="text-[14px] font-bold text-[#40DACD] mb-3">
              Clients Served Worldwide
            </h4>
            <p className="text-[12px] text-slate-200/90 font-normal leading-relaxed">
              From corporate leaders to private individuals, Jetbay supports thousands of clients with tailored aviation solutions. Every journey is handled with care, discretion, and reliability.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
