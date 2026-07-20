import React from 'react';
import Image from 'next/image';

export const GolfLogos = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-8 mb-8">
      <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tighter text-[#0B1F3A] dark:text-white">CHALLENGE</span>
          <span className="text-xl text-[#45BDB5]">TOUR</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600"></div>
          <span className="font-bold text-xl tracking-tighter text-[#0B1F3A] dark:text-white">USOPEN</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-serif text-sm tracking-widest text-[#0B1F3A] dark:text-white">THE</span>
          <span className="font-serif text-2xl tracking-widest text-[#0B1F3A] dark:text-white">OPEN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl tracking-tighter text-[#0B1F3A] dark:text-white">PGA</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-8 bg-blue-800 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};
