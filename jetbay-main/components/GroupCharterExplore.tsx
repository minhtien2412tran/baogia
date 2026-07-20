import React from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';

export const GroupCharterExplore = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Explore Jetbay Group Charter Services
        </h2>
      </div>

      <div className="relative w-full h-[360px] md:h-[400px] rounded-[24px] overflow-hidden">
        {/* Background Image */}
        <Image 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop" 
          alt="Island resort view" 
          fill 
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Floating Card */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 lg:left-16 w-[90%] max-w-[480px] bg-white/95 dark:bg-[#152033]/95 backdrop-blur-sm rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E6F8F7] dark:bg-[#1A3B37] flex items-center justify-center text-[#13B2A6] dark:text-[#40DACD]">
              <Users size={22} />
            </div>
            <h3 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white">Group Air Charter</h3>
          </div>
          <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">
            Experience the pinnacle of luxury and efficiency with Jetbay&apos;s Group Air Charter services. We provide bespoke travel solutions tailored to your needs, ensuring a seamless and prestigious journey for your entire entourage.
          </p>
        </div>
      </div>
    </div>
  );
};
