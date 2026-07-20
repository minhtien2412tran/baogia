import React from 'react';
import Image from 'next/image';

export const PromoBanner = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <div className="relative w-full rounded-[16px] overflow-hidden bg-[#F2F9F8] flex items-center h-[200px] md:h-[240px] shadow-sm">
        
        {/* Abstract Background Shapes via SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 240">
          {/* Top Left Teal */}
          <path d="M0 0 L100 0 C50 60 0 60 0 120 Z" fill="#42A69A" />
          {/* Bottom Left Blue */}
          <path d="M0 160 C50 150 80 200 80 240 L0 240 Z" fill="#5283D8" />
          {/* Bottom Left Pale Mint */}
          <path d="M0 240 L80 240 C100 160 200 160 300 240 Z" fill="#C7E9E4" />
          
          {/* Top Right Light Teal */}
          <path d="M600 0 C650 120 900 130 1200 50 L1200 0 Z" fill="#8AE0D4" />
          {/* Top Right Dark */}
          <path d="M950 0 C1000 80 1100 90 1200 160 L1200 0 Z" fill="#21353C" />
          {/* Bottom Right Yellow */}
          <path d="M1200 120 C1150 150 1150 200 1200 240 L1200 240 Z" fill="#E2B14C" />
          {/* White cutout area over yellow on right */}
          <path d="M1200 150 C1100 180 1100 240 1150 240 L1200 240 Z" fill="#F2F9F8" />
        </svg>

        <div className="relative z-10 flex w-full h-full items-center justify-between px-6 md:px-12">
          
          {/* Left image area (2026 Logo) */}
          <div className="flex-shrink-0 w-[45%] md:w-[40%] max-w-[450px] h-[80%] relative flex items-center justify-center">
             {/* Using a placeholder that can be replaced with the exact graphic */}
             {/* Creating a CSS fallback that looks vaguely like the 2026 text with gold confetti if the image fails, but mainly relying on an image */}
            <div className="w-full h-full relative font-black text-[#173838] flex items-center justify-center text-[80px] md:text-[130px] leading-none tracking-tighter">
              2026
              {/* Confetti specs simulated with small absolute divs */}
              <div className="absolute top-[20%] left-[10%] w-3 h-1 bg-[#40DACD] transform rotate-45"></div>
              <div className="absolute top-[40%] right-[15%] w-2 h-2 bg-[#40DACD] transform rotate-12"></div>
              <div className="absolute bottom-[20%] left-[25%] w-4 h-1.5 bg-[#40DACD] transform -rotate-12"></div>
              <div className="absolute bottom-[30%] right-[20%] w-3 h-1 bg-[#40DACD] transform rotate-45"></div>
            </div>
            
            {/* If the user provides the real image url, it will overlap here */}
            {/* <Image src="your-2026-image.png" alt="2026 World Cup" fill className="object-contain" /> */}
          </div>
          
          {/* Content area */}
          <div className="flex-1 flex flex-col justify-center pl-4 md:pl-10">
            <h2 className="text-[#21353C] text-[22px] sm:text-3xl md:text-[42px] font-black tracking-tight leading-[1.1] mb-2 md:mb-4 uppercase">
              Jet Travel <br />
              For <span className="text-[#3DBEB2]">The World Cup</span>
            </h2>
            <div className="flex items-start md:items-center gap-2">
              <span className="text-[14px] md:text-[16px] mt-0.5 md:mt-0">🏆</span>
              <p className="text-[#4A5568] text-[12px] md:text-[14.5px] font-medium leading-tight md:leading-normal max-w-md">
                Private jet travel between host cities, tailored to your match-day schedule
              </p>
            </div>
          </div>
        </div>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <div className="w-5 h-1.5 rounded-full bg-[#40DACD]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]"></div>
        </div>

      </div>
    </div>
  );
};
