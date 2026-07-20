import React from 'react';
import Image from 'next/image';
import { PlaneTakeoff, PlaneLanding, Calendar, Minus, Plus, ArrowRightLeft } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="px-4 lg:px-6 pt-4 lg:pt-6 mb-24 w-full flex flex-col items-center">
      <section className="relative w-full h-[350px] lg:h-[460px] flex flex-col items-center justify-center rounded-[24px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/tropicaljet/1920/1080" 
            alt="Private Jet over ocean" 
            fill 
            className="object-cover object-[center_70%]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 text-center text-white px-4 w-full max-w-5xl -mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1] mb-5">
            Global Private Jet Charter: Access to <br className="hidden md:block" />10,000+ Aircraft
          </h1>
          <p className="text-lg md:text-xl text-white/95 font-medium mb-10">
            Seamless, trusted access to private aviation worldwide.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-[13px] lg:text-[15px] font-medium text-white">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#40DACD]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secure Payment
            </div>
            <div className="w-px h-4 bg-white/50 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#40DACD]">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              24/7 Global Concierge Support
            </div>
            <div className="w-px h-4 bg-white/50 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#40DACD]">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Premium Aircraft
            </div>
          </div>
        </div>
      </section>

      {/* Search Form - Overlaps Hero */}
      <div className="relative z-20 w-full max-w-[1440px] -mt-12 lg:-mt-20 bg-white dark:bg-[#152033] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 lg:p-8 text-gray-900 dark:text-white">
        <div className="flex items-center gap-6 mb-8 px-2">
          <button className="px-5 py-2 bg-[#E6F8F7] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD] text-[14px] font-medium rounded-full">One-way</button>
          <button className="text-gray-600 dark:text-gray-300 text-[14px] font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Round-Trip</button>
          <button className="text-gray-600 dark:text-gray-300 text-[14px] font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Multi-City</button>
        </div>
        
        <div className="flex flex-col lg:flex-row items-end gap-3 lg:gap-4 mb-6 relative w-full">
          
          {/* From */}
          <div className="flex-[1.2] w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">From</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <PlaneTakeoff className="text-gray-600 dark:text-gray-400" size={18} strokeWidth={2} />
              <input type="text" placeholder="From" className="outline-none text-[14px] text-gray-900 dark:text-white bg-transparent w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium" />
            </div>
          </div>
          
          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center pb-3">
            <ArrowRightLeft size={16} className="text-[#13B2A6] dark:text-[#40DACD]" strokeWidth={2.5} />
          </div>
          
          {/* To */}
          <div className="flex-[1.2] w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">To</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <PlaneLanding className="text-gray-600 dark:text-gray-400" size={18} strokeWidth={2} />
              <input type="text" placeholder="To" className="outline-none text-[14px] text-gray-900 dark:text-white bg-transparent w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium" />
            </div>
          </div>
          
          {/* Departure */}
          <div className="flex-1 w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">Departure (Local)</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <Calendar className="text-gray-600 dark:text-gray-400" size={18} strokeWidth={2} />
              <div className="text-[14px] text-gray-900 dark:text-white font-medium whitespace-nowrap">
                13 / Jul / 2026
              </div>
            </div>
          </div>
          
          {/* Passengers */}
          <div className="flex-1 w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">Passengers</span>
            <div className="flex items-center justify-between w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <button className="w-5 h-5 rounded-full border border-gray-900 dark:border-gray-300 flex items-center justify-center text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A364D] transition-colors"><Minus size={12} strokeWidth={2.5} /></button>
              <span className="text-[14px] font-medium text-gray-900 dark:text-white">2</span>
              <button className="w-5 h-5 rounded-full border border-gray-900 dark:border-gray-300 flex items-center justify-center text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A364D] transition-colors"><Plus size={12} strokeWidth={2.5} /></button>
            </div>
          </div>
        </div>
        
        <button className="w-full bg-[#40DACD] hover:bg-[#34C4B8] text-[#050505] font-medium py-3.5 rounded-lg transition-colors text-[15px] shadow-sm flex items-center justify-center">
          Search Available Aircraft
        </button>
      </div>
    </div>
  );
};
