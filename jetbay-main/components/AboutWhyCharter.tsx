'use client';

import React from 'react';
import Image from 'next/image';

export const AboutWhyCharter = () => {
  const reasons = [
    'Comprehensive and Competitive Solutions',
    '24/7 Fast Quotations',
    'Seamless Booking Process',
    'Tailored Solutions by Our Specialists'
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-20 font-sans">
      
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: Jet Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full aspect-video lg:aspect-[4/3] rounded-[16px] overflow-hidden shadow-sm">
            <Image 
              src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200" 
              alt="Private jet nose close up" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Side: Text & Bullets */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[3px] h-6 bg-[#D4A64A]"></div>
            <h2 className="text-[26px] md:text-[30px] font-bold text-[#0B1F3A] dark:text-white">
              Why Charter with Jetbay?
            </h2>
          </div>
          
          <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
            Jetbay offers bespoke charter solutions, connecting you to a global fleet.
          </p>

          <ul className="space-y-4 mb-8">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <span className="text-[14px] font-semibold text-[#0B1F3A] dark:text-gray-300">
                  {reason}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-[13.5px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
            Jetbay offers seamless private jet charters with access to 10,000+ aircraft worldwide, ensuring luxury, flexibility, and safety for business, leisure, and special events—all backed by 24/7 expert support.
          </p>

        </div>

      </div>

    </div>
  );
};
