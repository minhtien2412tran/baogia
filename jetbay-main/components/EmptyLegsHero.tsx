import React from 'react';
import { PlaneTakeoff, PlaneLanding, ArrowRightLeft, ShieldCheck, CheckCircle2, Headphones, Award } from 'lucide-react';
import Image from 'next/image';

export const EmptyLegsHero = () => {
  return (
    <div className="w-full px-4 lg:px-8 pt-6 pb-12">
      <div className="relative w-full rounded-[32px] overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-8 md:p-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop" 
            alt="Private Jet over water" 
            fill 
            className="object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#0B1F3A]/60"></div>
          {/* subtle gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0B1F3A]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-[1000px] mx-auto mt-8">
          
          <div className="px-5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6">
            <span className="text-[12px] font-bold text-white tracking-wide">Empty Leg Deals</span>
          </div>

          <h1 className="text-[42px] md:text-[56px] lg:text-[64px] font-bold text-white mb-6 text-center leading-[1.1] tracking-[-0.02em]">
            Private Jet Empty Leg Flights<span className="text-[#F5B041]">.</span>
          </h1>

          <p className="text-[16px] md:text-[18px] text-white/90 text-center max-w-3xl mb-12 font-medium">
            Enjoy up to <span className="text-[#40DACD]">75% savings</span> on private jet flights with exclusive empty leg deals - same aircraft, crew and luxury at a fraction of the cost.
          </p>

          {/* Search Box */}
          <div className="w-full bg-white dark:bg-[#152033] rounded-[24px] p-2 flex flex-col md:flex-row items-center shadow-lg mb-10 border border-gray-100 dark:border-gray-800">
            
            <div className="flex-1 flex items-center w-full md:w-auto h-[56px] pl-6 pr-4 relative">
              <PlaneTakeoff size={22} className="text-[#94A3B8] mr-3 shrink-0" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="From" 
                className="w-full h-full bg-transparent outline-none text-[#0B1F3A] dark:text-white text-[16px] placeholder:text-[#94A3B8]" 
              />
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-[36px] h-[36px] -ml-[18px] -mr-[18px] z-10 bg-white dark:bg-[#152033] rounded-full border border-gray-200 dark:border-gray-700 text-[#94A3B8] shadow-sm">
              <ArrowRightLeft size={14} strokeWidth={1.5} />
            </div>

            <div className="flex-1 flex items-center w-full md:w-auto h-[56px] pl-10 pr-6 relative">
              <PlaneLanding size={22} className="text-[#94A3B8] mr-3 shrink-0" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="To" 
                className="w-full h-full bg-transparent outline-none text-[#0B1F3A] dark:text-white text-[16px] placeholder:text-[#94A3B8]" 
              />
            </div>

            <button className="w-full md:w-[140px] h-[52px] md:h-[52px] bg-[#13B2A6] hover:bg-[#10998f] text-white font-bold text-[16px] rounded-[16px] mt-2 md:mt-0 shadow-sm shrink-0 transition-colors">
              Search
            </button>
            
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[#F5B041]" strokeWidth={2.5} />
              <span className="text-[13px] font-medium text-white/90">WYVERN Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#F5B041]" strokeWidth={2.5} />
              <span className="text-[13px] font-medium text-white/90">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones size={16} className="text-[#F5B041]" strokeWidth={2.5} />
              <span className="text-[13px] font-medium text-white/90">24/7 Concierge</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#F5B041]" strokeWidth={2.5} />
              <span className="text-[13px] font-medium text-white/90">NBAA Member</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
