import React from 'react';
import Image from 'next/image';
import { ChevronRight, Play } from 'lucide-react';

export const ExploreWorld = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] leading-[1.15]">
          Explore the World with Jetbay
        </h2>
        <button className="flex items-center gap-1 font-medium text-[#0B1F3A] dark:text-white hover:text-gray-600 transition-colors">
          Explore <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Card 1 */}
        <div className="relative rounded-[24px] overflow-hidden group shadow-sm h-[300px] md:h-[400px]">
          <Image src="https://picsum.photos/seed/event1/800/600" alt="Event" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col">
            <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-2 max-w-sm mt-4">
              <span className="text-[#40DACD]">EBACE 2025 WRAPPED UP</span><br/>
              THE BIGGEST MOMENTS YOU CAN&apos;T MISS
            </h3>
            <p className="text-white font-medium tracking-widest text-[13px] uppercase mb-auto">EVENT HIGHLIGHT</p>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <Play className="text-white ml-1" fill="currentColor" size={24} />
            </div>

            <div className="text-white font-bold tracking-[0.2em] text-lg">JETBAY</div>
          </div>
        </div>

        {/* Video Card 2 */}
        <div className="relative rounded-[24px] overflow-hidden group shadow-sm h-[300px] md:h-[400px]">
          <Image src="https://picsum.photos/seed/event2/800/600" alt="Event" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#352F44]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors z-10 mb-6 mt-16">
              <Play className="text-white ml-1" fill="currentColor" size={24} />
            </div>
            
            <h3 className="text-white text-2xl md:text-3xl font-[200] italic tracking-wider opacity-90 max-w-sm font-serif">
              Celebrating<br/>10 years of Innovation
            </h3>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <div className="text-white/80 font-bold tracking-[0.2em] text-lg">JETBAY</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
