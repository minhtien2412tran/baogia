'use client';

import React from 'react';
import Image from 'next/image';

export const CorporateCharterInfo = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Corporate & Business Jet
        </h2>
      </div>

      {/* Banner: Full-width container with floating card */}
      <div className="relative w-full min-h-[300px] md:h-[340px] lg:h-[360px] rounded-[24px] overflow-hidden mb-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800 bg-[#E8F5FD] flex items-center">
        
        {/* Background Image: Airplane flying */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop" 
            alt="Business Jet" 
            fill 
            className="object-cover object-[right_30%_center]"
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Abstract Geometric Elements on bottom-right (recreating the design) */}
        <div className="absolute inset-y-0 right-0 w-1/2 z-10 pointer-events-none hidden md:block">
          {/* Indigo/purple/blue diamond shapes and triangles */}
          <div className="absolute bottom-[-20px] right-[8%] w-32 h-32 bg-[#4F46E5]/20 dark:bg-[#4F46E5]/30 rotate-45 rounded-lg"></div>
          <div className="absolute bottom-[-30px] right-[22%] w-24 h-24 bg-[#3B82F6]/15 dark:bg-[#3B82F6]/25 rotate-45 rounded-md"></div>
          <div className="absolute bottom-[20px] right-[4%] w-16 h-16 bg-[#818CF8]/20 dark:bg-[#818CF8]/30 rotate-12 rounded-sm"></div>
          
          {/* White outline geometric squares */}
          <div className="absolute bottom-[40px] right-[15%] w-16 h-16 border-2 border-white/30 dark:border-white/15 rotate-45 rounded-md"></div>
          <div className="absolute bottom-[70px] right-[25%] w-12 h-12 border border-white/20 dark:border-white/10 rotate-12 rounded-md"></div>
          <div className="absolute bottom-[10px] right-[35%] w-20 h-20 border border-white/25 dark:border-white/15 rotate-45 rounded-lg"></div>
        </div>

        {/* Content Layout */}
        <div className="relative z-20 w-full h-full flex items-center px-6 py-8 md:px-12 lg:px-16">
          {/* Floating Save Time Card */}
          <div className="w-full md:max-w-[420px] lg:max-w-[450px] bg-white dark:bg-[#152033]/95 backdrop-blur-md rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/80 dark:border-gray-800 transition-all duration-300 hover:shadow-[0_12px_45px_rgba(0,0,0,0.09)]">
            <div className="flex items-start gap-4 mb-4">
              {/* Custom SVG Icon representing document/file with yellow info badge */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#13B2A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#13B2A6]">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                {/* Yellow/gold info circle badge */}
                <div className="absolute bottom-1 right-1 bg-white dark:bg-[#152033] rounded-full p-0.5 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4A64A" className="text-[#D4A64A]">
                    <circle cx="12" cy="12" r="10" fill="#D4A64A" />
                    <line x1="12" y1="16" x2="12" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="12" y1="8" x2="12.01" y2="8" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center">
                <h3 className="text-[18px] lg:text-[20px] font-bold text-[#0B1F3A] dark:text-white leading-snug tracking-tight">
                  Save time with Business Jet
                </h3>
              </div>
            </div>
            
            <p className="text-[13px] lg:text-[13.5px] text-gray-500 dark:text-gray-300 leading-[1.65] font-medium">
              Jetbay specialises in providing seamless and efficient corporate air charter solutions tailored to your specific business needs. We offer a premium, hassle-free experience for corporate travel, ensuring you reach your destination with utmost comfort and convenience.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
