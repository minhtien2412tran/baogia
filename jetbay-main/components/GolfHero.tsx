import React from 'react';
import Image from 'next/image';
import { Plane, Flag } from 'lucide-react';

export const GolfHero = () => {
  return (
    <div className="w-full relative py-8 px-4 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative w-full min-h-[460px] lg:min-h-[520px] rounded-[32px] overflow-hidden flex flex-col p-8 lg:p-12 xl:p-16">
          {/* Background Image */}
          <Image 
            src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop" 
            alt="Golf Background" 
            fill 
            className="object-cover z-0"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 z-0"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center w-full gap-8 h-full flex-1">
            
            {/* Left Content */}
            <div className="max-w-3xl flex-1 flex flex-col justify-center h-full">
              <div className="bg-[#f6e6f2] px-4 py-1.5 rounded-full w-fit mb-6">
                <span className="text-[13px] font-bold text-[#d22d9b] tracking-wide">Exclusive Travel</span>
              </div>
              
              <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-white leading-[1.15] tracking-tight mb-8">
                Discover the Top Golf<br />
                Destinations in the United<br />
                States by <span className="text-[#45BDB5]">Private Jet</span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-8">
                {["Private Jet", "Golf Courses", "Luxury Travel", "VIP Service"].map((tag, i) => (
                  <div key={i} className="px-5 py-2 rounded-full bg-black/20 border border-white/40 text-white text-[13px] font-medium backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card */}
            <div className="w-full lg:w-[380px] bg-white/20 backdrop-blur-md border border-white/30 rounded-[24px] p-5 text-white shrink-0 shadow-lg">
              <div className="relative w-full h-[160px] rounded-[16px] overflow-hidden mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop" 
                  alt="Private Jet Interior" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-[16px] lg:text-[18px] font-medium mb-4 text-white/95 leading-tight">Fly private to exclusive golf destinations</h3>
              <div className="flex items-center gap-6 text-[13px] font-medium text-white/90">
                <div className="flex items-center gap-2">
                  <Plane size={16} />
                  <span>Private Charter</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag size={16} />
                  <span>6 Destinations</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
