'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export const AboutAwards = () => {
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0E1726] py-16 font-sans">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-[3px] h-6 bg-[#D4A64A]"></div>
              <h2 className="text-[24px] font-semibold text-[#0B1F3A] dark:text-white">
                Awards & Recognition
              </h2>
            </div>
            <p className="text-[14px] text-gray-500 dark:text-gray-400">
              Celebrating Excellence in Jet Charter
            </p>
          </div>
          <button className="bg-white dark:bg-[#152033] border border-[#E2E8F0] dark:border-gray-700 text-[#13B2A6] dark:text-[#40DACD] px-4 py-2 rounded-full text-[13px] font-semibold shadow-sm flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-[#1C2A44] transition-colors cursor-pointer">
            11+ awards
          </button>
        </div>

        {/* Awards Carousel (Grid fallback for simplicity) */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden">
            
            {/* Award 1 */}
            <div className="relative rounded-[16px] overflow-hidden bg-white dark:bg-[#152033] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center p-8 min-h-[220px]">
              <div className="absolute inset-0 z-0 opacity-20">
                <Image 
                  src="https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?q=80&w=600" 
                  alt="Abstract background" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-[12px] italic text-gray-500 dark:text-gray-400 mb-1">Award Name</p>
                <h3 className="text-[28px] font-extrabold text-[#0B1F3A] dark:text-white">The 13th</h3>
                <h4 className="text-[36px] font-black text-blue-600">CFS</h4>
                {/* 3D trophy placeholder image */}
                <div className="mt-4 relative w-20 h-20 mx-auto">
                  <Image 
                    src="https://images.unsplash.com/photo-1569931727315-feac72449767?q=80&w=200" 
                    alt="Trophy" 
                    fill 
                    className="object-contain drop-shadow-lg rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Award 2 */}
            <div className="relative rounded-[16px] overflow-hidden bg-white dark:bg-[#152033] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center p-8 min-h-[220px]">
              <div className="absolute inset-0 z-0 opacity-20">
                <Image 
                  src="https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?q=80&w=600" 
                  alt="Abstract background" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-[12px] italic text-gray-500 dark:text-gray-400 mb-1">Award Name</p>
                <h3 className="text-[28px] font-extrabold text-[#0B1F3A] dark:text-white">The 13th</h3>
                <h4 className="text-[36px] font-black text-blue-600">PF</h4>
                {/* 3D trophy placeholder image */}
                <div className="mt-4 relative w-20 h-20 mx-auto">
                  <Image 
                    src="https://images.unsplash.com/photo-1569931727315-feac72449767?q=80&w=200" 
                    alt="Trophy" 
                    fill 
                    className="object-contain drop-shadow-lg rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Award 3 */}
            <div className="relative rounded-[16px] overflow-hidden bg-white dark:bg-[#152033] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center p-8 min-h-[220px]">
              <div className="absolute inset-0 z-0 opacity-20">
                <Image 
                  src="https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?q=80&w=600" 
                  alt="Abstract background" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-[12px] italic text-gray-500 dark:text-gray-400 mb-1">Award Name</p>
                <h3 className="text-[28px] font-extrabold text-[#0B1F3A] dark:text-white">The 2023</h3>
                <h4 className="text-[36px] font-black text-blue-600">IIMP</h4>
                {/* 3D trophy placeholder image */}
                <div className="mt-4 relative w-20 h-20 mx-auto">
                  <Image 
                    src="https://images.unsplash.com/photo-1569931727315-feac72449767?q=80&w=200" 
                    alt="Trophy" 
                    fill 
                    className="object-contain drop-shadow-lg rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Arrow Navigation Overlay */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-[#13B2A6] transition-colors z-20 cursor-pointer hidden md:block">
            <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </div>
  );
};
