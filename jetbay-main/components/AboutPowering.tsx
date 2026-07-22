'use client';

import React from 'react';
import Image from 'next/image';

export const AboutPowering = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16 font-sans">
      
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-[3px] h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] font-semibold text-[#0B1F3A] dark:text-white">
          Powering Global Journeys
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Card 1 */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[220px] rounded-[16px] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=800" 
              alt="People talking" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">
              Global Charter Platform
            </h3>
            <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Jetbay is a global private jet booking platform headquartered in Singapore with 6 other offices worldwide, providing exceptional service globally.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[220px] rounded-[16px] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1544257121-72f1bd9a6dc0?q=80&w=800" 
              alt="People in a private jet" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">
              10,000+ Jets, Seamless Bookings
            </h3>
            <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed">
              We provide fast, competitive, and seamless booking experiences, connecting customers to a fleet of over 10,000 business jets and aircraft worldwide.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
