'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const CorporateCharterBusinessJetCharter = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Business Jet Charter
        </h2>
      </div>

      {/* Main card */}
      <div className="w-full bg-white dark:bg-[#152033] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch">
        
        {/* Left Side: Business jet with executives on tarmac */}
        <div className="relative w-full md:w-[40%] min-h-[220px] md:min-h-[260px] shrink-0">
          <Image 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800" 
            alt="Business jet on runway with passengers" 
            fill 
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Side: Description content */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center bg-white dark:bg-[#152033]">
          <div className="text-[14px] md:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            <p>
              In the dynamic landscape of today&apos;s business world, time is of the essence and efficiency is paramount. Corporate air charter offers a superior alternative to commercial travel, providing busy executives with unparalleled schedule flexibility, privacy, and speed.
            </p>
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/80 space-y-4 animate-fadeIn text-gray-500 dark:text-gray-400">
                <p>
                  With Jetbay&apos;s specialized corporate flight solutions, you have access to thousands of regional airports globally, allowing you to bypass congested airline hubs and land much closer to your ultimate business meeting.
                </p>
                <p>
                  Our modern, executive-configured cabins serve as secure mobile offices, allowing you to conduct confidential discussions, prepare presentations, and rest in absolute comfort and silence during flight.
                </p>
              </div>
            )}
          </div>

          {/* Toggle View More Button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#13B2A6] dark:text-[#40DACD] hover:opacity-85 transition-opacity cursor-pointer self-center"
          >
            <span>{isExpanded ? 'View Less' : 'View More'}</span>
            {isExpanded ? (
              <ChevronUp size={16} strokeWidth={2.5} className="bg-[#EBF7F6] dark:bg-[#1A3B37] rounded-full p-0.5" />
            ) : (
              <ChevronDown size={16} strokeWidth={2.5} className="bg-[#EBF7F6] dark:bg-[#1A3B37] rounded-full p-0.5" />
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
