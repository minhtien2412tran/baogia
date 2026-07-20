import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const Promotions = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] leading-[1.15] mb-8">
        Private Jet Promotions
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[400px]">
        {/* Jet Card Program */}
        <div className="relative flex-1 rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm">
          <Image src="https://picsum.photos/seed/golfer/800/600" alt="Private Jet Card Program" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          
          <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-between">
            <div className="max-w-xs">
              <h3 className="text-white text-2xl font-bold mb-4 leading-tight">Private Jet Card Program</h3>
              <p className="text-gray-200 text-[15px] leading-relaxed">
                Enjoy predictable pricing, priority access, and complete flexibility with a Jetbay Jet Card designed for frequent private flyers.
              </p>
            </div>
            
            <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 w-max hover:bg-gray-50 transition-colors mt-8">
              Explore Jet Card <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Travel Credit Program */}
        <div className="flex-1 md:max-w-[400px] rounded-[2rem] bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-800 p-8 md:p-10 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
          <div>
            <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-4 leading-tight">Travel Credit Program</h3>
            <p className="text-[#4A4A4A] dark:text-gray-400 text-[15px] leading-relaxed">
              Earn exclusive travel credits on every private jet booking and reinvest them into future flights with Jetbay.
            </p>
          </div>
          
          <button className="text-gray-900 dark:text-white font-semibold text-[14px] flex items-center gap-2 mt-8 hover:text-[#13B2A6] dark:text-[#40DACD] dark:hover:text-[#13B2A6] dark:text-[#40DACD] transition-colors w-max">
            View Travel Credits <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
