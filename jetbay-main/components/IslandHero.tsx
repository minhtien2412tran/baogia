import React from 'react';
import Image from 'next/image';
import { Sparkles, Users } from 'lucide-react';

export const IslandHero = () => {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-white to-[#E6F8F7] dark:from-[#0B1121] dark:to-[#152033] py-16 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1A263D] px-4 py-2 rounded-full w-fit mb-6 shadow-sm border border-orange-100 dark:border-gray-700">
              <Sparkles size={16} className="text-[#D4A64A]" />
              <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Exclusive Travel</span>
            </div>
            
            <h1 className="text-[42px] md:text-[56px] lg:text-[64px] font-bold text-[#0B1F3A] dark:text-white leading-[1.1] tracking-tight mb-8">
              Top Island<br />
              Destinations by<br />
              <span className="text-[#D4A64A]">Private Jet</span>
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0B1121] bg-blue-400 z-30"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0B1121] bg-blue-300 z-20"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0B1121] bg-yellow-400 z-10"></div>
              </div>
              <span className="text-[14px] font-medium text-gray-600 dark:text-gray-400">
                2,500+ Travelers
              </span>
            </div>
          </div>

          {/* Right Column (Image Grid) */}
          <div className="flex-1 w-full relative h-[500px] sm:h-[600px] lg:h-[650px]">
            {/* Decorative arrow */}
            <div className="absolute top-10 -left-12 text-[#D4A64A] hidden lg:block">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20 Q 60 -20, 115 20" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="6 6" />
                <path d="M110 10 L120 20 L110 30" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </div>
            {/* Decorative squiggle top right */}
            <div className="absolute top-0 right-10 text-[#D4A64A] hidden lg:block">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 10 Q 10 0, 20 10 T 40 10 T 60 10" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Destinations Pill */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[13px] font-bold text-gray-800 dark:text-white">50+ Destinations</span>
            </div>

            {/* Images Grid */}
            <div className="absolute top-0 left-0 w-[45%] h-[40%] rounded-[24px] overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
              <Image src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?q=80&w=800&auto=format&fit=crop" alt="Santorini" fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-medium">Santorini</div>
            </div>

            <div className="absolute top-[10%] right-0 w-[50%] h-[40%] rounded-[24px] overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
              <Image src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800&auto=format&fit=crop" alt="Caribbean" fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-medium">Caribbean</div>
            </div>

            <div className="absolute bottom-[10%] left-0 w-[45%] h-[40%] rounded-[24px] overflow-hidden shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
              <Image src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop" alt="Maldives" fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-medium">Maldives</div>
            </div>

            <div className="absolute bottom-[5%] right-[25%] w-[40%] h-[35%] rounded-[24px] overflow-hidden shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-30">
              <Image src="https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=800&auto=format&fit=crop" alt="Bora Bora" fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-medium">Bora Bora</div>
            </div>

            <div className="absolute bottom-0 right-0 w-[35%] h-[30%] rounded-[24px] overflow-hidden shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-500 z-40 border-4 border-white dark:border-[#152033]">
              <Image src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop" alt="Private Jet" fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-medium">Private Jet</div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
