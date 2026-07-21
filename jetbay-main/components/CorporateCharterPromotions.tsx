'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const CorporateCharterPromotions = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight animate-fadeIn">
          Business jet promotions
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12">
        
        {/* Card 1: Jet Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end w-full group">
          {/* Left: Overlapping Image Card */}
          <div className="relative w-full sm:w-[200px] h-[200px] rounded-[24px] overflow-hidden shrink-0 shadow-md z-10 transition-transform duration-500 group-hover:scale-[1.01]">
            <Image 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600" 
              alt="Jet Card Executive Pilot" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right: Text Content Card */}
          <div className="relative flex-1 bg-[#F8FAFC] dark:bg-[#152033] rounded-[24px] sm:rounded-l-none sm:rounded-r-[24px] border border-gray-100 dark:border-gray-800/80 p-6 md:p-8 pt-10 sm:pt-6 flex flex-col justify-between h-auto sm:h-[172px] sm:mt-[28px] mt-[-16px] sm:ml-[-20px] z-0 shadow-sm transition-all duration-300 hover:shadow-md">
            {/* Absolute Badge positioned at top boundary */}
            <div className="absolute top-[-14px] sm:top-[-28px] left-[24px] sm:left-[36px] bg-[#0066FF] text-white text-[11px] sm:text-[12px] font-bold px-4 py-1.5 sm:py-2 rounded-t-[10px] rounded-r-[10px] shadow-sm uppercase tracking-wider select-none whitespace-nowrap">
              Fly Smarter
            </div>

            <div className="mb-4 sm:mb-0">
              <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#0B1F3A] dark:text-white mb-2 tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-[#40DACD] transition-colors">
                Jet Card
              </h3>
              <p className="text-[13px] md:text-[13.5px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[340px]">
                Enjoy flexibility and guaranteed rates with the Jetbay Jet Card.
              </p>
            </div>

            <div className="flex justify-end mt-4 sm:mt-0">
              <Link 
                href="#" 
                className="bg-[#EBF3FF] hover:bg-[#D6E7FF] dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-[#0066FF] dark:text-blue-400 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm whitespace-nowrap"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Travel Credit */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end w-full group">
          {/* Left: Overlapping Image Card */}
          <div className="relative w-full sm:w-[200px] h-[200px] rounded-[24px] overflow-hidden shrink-0 shadow-md z-10 transition-transform duration-500 group-hover:scale-[1.01]">
            <Image 
              src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=600" 
              alt="Private jet flying high" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right: Text Content Card */}
          <div className="relative flex-1 bg-[#F8FAFC] dark:bg-[#152033] rounded-[24px] sm:rounded-l-none sm:rounded-r-[24px] border border-gray-100 dark:border-gray-800/80 p-6 md:p-8 pt-10 sm:pt-6 flex flex-col justify-between h-auto sm:h-[172px] sm:mt-[28px] mt-[-16px] sm:ml-[-20px] z-0 shadow-sm transition-all duration-300 hover:shadow-md">
            {/* Absolute Badge positioned at top boundary */}
            <div className="absolute top-[-14px] sm:top-[-28px] left-[24px] sm:left-[36px] bg-[#0066FF] text-white text-[11px] sm:text-[12px] font-bold px-4 py-1.5 sm:py-2 rounded-t-[10px] rounded-r-[10px] shadow-sm uppercase tracking-wider select-none whitespace-nowrap">
              Save & Earn
            </div>

            <div className="mb-4 sm:mb-0">
              <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#0B1F3A] dark:text-white mb-2 tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-[#40DACD] transition-colors">
                Travel Credit
              </h3>
              <p className="text-[13px] md:text-[13.5px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[340px]">
                Earn exclusive credits on private jet bookings.
              </p>
            </div>

            <div className="flex justify-end mt-4 sm:mt-0">
              <button 
                className="bg-[#EBF3FF] hover:bg-[#D6E7FF] dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-[#0066FF] dark:text-blue-400 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

