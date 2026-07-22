'use client';

import React from 'react';
import Image from 'next/image';

export const AboutHero = () => {
  return (
    <div className="w-full relative font-sans">
      
      {/* Background Hero Banner Container - Full Bleed */}
      <div className="relative w-full h-[320px] md:h-[400px] flex flex-col justify-center overflow-hidden bg-[#1A1615]">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600" 
            alt="Business district skyscrapers looking up" 
            fill 
            className="object-cover object-center"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Title Header */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-[36px] sm:text-[44px] md:text-[54px] font-extrabold text-white drop-shadow-md tracking-tight leading-tight">
            Your Global Air Charter Partner
          </h1>
        </div>
      </div>

    </div>
  );
};
