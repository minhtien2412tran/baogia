'use client';

import React from 'react';
import Image from 'next/image';

export const DestinationsHero = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pt-4 pb-10 font-sans">
      
      {/* Hero Banner Container */}
      <div className="relative w-full rounded-[28px] overflow-hidden bg-[#1A1615] min-h-[300px] sm:min-h-[340px] md:min-h-[380px] flex flex-col justify-center items-center text-center p-8 md:p-12 shadow-sm border border-stone-800">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Image 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600" 
            alt="Destinations hero backdrop" 
            fill 
            className="object-cover object-center"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <h1 className="text-[26px] sm:text-[34px] md:text-[42px] font-extrabold text-white drop-shadow-md tracking-tight flex items-center justify-center gap-2 flex-wrap">
            <span>Explore Exciting New Destinations with Jetbay</span>
            <span className="w-3.5 h-3.5 bg-[#D4A64A] inline-block rounded-xs shadow-xs"></span>
          </h1>
          <p className="text-[13.5px] sm:text-[15px] text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Experience world-renowned destinations, landmarks, and create unforgettable memories. Embrace the freedom of private jet travel with Jetbay.
          </p>
        </div>

      </div>

    </div>
  );
};
