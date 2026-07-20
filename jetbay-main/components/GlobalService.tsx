import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const GlobalService = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <div className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-r from-[#173A3E] via-[#1F4C52] to-[#2B6063] shadow-sm flex items-center min-h-[220px]">
        {/* Decorative elements or background image layer if needed */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/3 lg:w-1/2">
          <Image 
            src="https://picsum.photos/seed/privatejetinterior/800/400" 
            alt="Private Jet Interior" 
            fill 
            className="object-cover object-right opacity-60 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#173A3E] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 px-8 py-10 md:px-12 md:py-14 max-w-2xl">
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-white mb-4 tracking-[-0.02em] leading-tight">
            Private Jet Charter, <span className="text-[#6EE7B7]">Simplified.</span>
          </h2>
          <p className="text-white/80 text-[16px] md:text-[18px] mb-8 font-medium max-w-[500px]">
            Charter private flights worldwide with flexible schedules, fully tailored to your needs.
          </p>
          <button className="flex items-center gap-2 text-white font-semibold text-[15px] hover:text-[#6EE7B7] transition-colors group">
            Explore Private Jet Charter <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/40 cursor-pointer"></div>
          <div className="w-2 h-2 rounded-full bg-white/40 cursor-pointer"></div>
          <div className="w-5 h-2 rounded-full bg-[#40DACD] cursor-pointer"></div>
        </div>
      </div>
    </div>
  )
}

