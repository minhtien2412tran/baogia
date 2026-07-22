'use client';

import React from 'react';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { Destination } from '@/lib/destinationsData';

interface Props {
  destination: Destination;
}

export const DestinationDetailHero = ({ destination }: Props) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pt-4 font-sans">
      
      {/* Hero Card */}
      <div className="relative w-full rounded-[28px] overflow-hidden bg-[#1A1615] min-h-[380px] md:min-h-[440px] flex flex-col justify-between p-6 md:p-10 lg:p-12 shadow-sm border border-stone-800">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-85">
          <Image 
            src={destination.heroImage} 
            alt={destination.name} 
            fill 
            className="object-cover object-center"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
        </div>

        {/* Share Button (Top Right) */}
        <div className="relative z-10 flex justify-end">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[13px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20">
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>

        {/* Hero Main Titles */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3 my-auto">
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-extrabold text-white drop-shadow-md tracking-tight">
            {destination.name}
          </h1>
          <p className="text-[13.5px] sm:text-[15px] text-gray-100 font-medium leading-relaxed drop-shadow-xs max-w-2xl mx-auto">
            {destination.fullDesc}
          </p>
        </div>

        {/* Basic Info Pill at bottom center */}
        <div className="relative z-10 flex justify-center mt-4">
          <span className="bg-white/25 backdrop-blur-md text-white text-[12px] font-bold px-4 py-1 rounded-full border border-white/30">
            Basic Info
          </span>
        </div>

      </div>

      {/* Floating Basic Info Bar */}
      <div className="relative z-20 max-w-4xl mx-auto -mt-6 bg-white dark:bg-[#152033] rounded-full p-4 sm:px-8 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        
        {/* Country Flag Circle */}
        <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 relative shadow-2xs flex items-center justify-center bg-gray-100">
          {destination.basicInfo.flagUrl ? (
            <Image 
              src={destination.basicInfo.flagUrl} 
              alt={destination.name} 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-xl">🇵🇭</span>
          )}
        </div>

        {/* Capital */}
        <div className="flex items-center gap-2 text-center sm:text-left shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <div>
            <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Capital</div>
            <div className="text-[11.5px] text-gray-500 dark:text-gray-400 font-medium">{destination.basicInfo.capital}</div>
          </div>
        </div>

        {/* Currency */}
        <div className="flex items-center gap-2 text-center sm:text-left shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <div>
            <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Currency</div>
            <div className="text-[11.5px] text-gray-500 dark:text-gray-400 font-medium">{destination.basicInfo.currency}</div>
          </div>
        </div>

        {/* Language(s) */}
        <div className="flex items-center gap-2 text-center sm:text-left shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <div>
            <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Language(s)</div>
            <div className="text-[11.5px] text-gray-500 dark:text-gray-400 font-medium">{destination.basicInfo.languages}</div>
          </div>
        </div>

        {/* Population */}
        <div className="flex items-center gap-2 text-center sm:text-left shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <div>
            <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Population</div>
            <div className="text-[11.5px] text-gray-500 dark:text-gray-400 font-medium">{destination.basicInfo.population}</div>
          </div>
        </div>

      </div>

    </div>
  );
};
