import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

export const FixedPriceHero = () => {
  return (
    <div className="relative w-full max-w-[1800px] mx-auto px-4 lg:px-12 xl:px-20 pt-12 pb-24 overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[120%] bg-[#E6F7F6]/50 rounded-full blur-[120px] dark:bg-[#13B2A6]/10"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20">
        
        {/* Left Side: Text and Graphic */}
        <div className="w-full lg:w-[45%] flex flex-col items-start pt-12">
          <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-bold text-[#0B1F3A] dark:text-white leading-[1.1] mb-4 tracking-[-0.02em]">
            Fixed-Price<br />
            Private Jet <span className="text-[#F5B041]">Routes</span>
          </h1>
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[18px] mb-12">
            Explore guaranteed private jet charter rates
          </p>

          {/* Map Dots Graphic */}
          <div className="w-full max-w-[500px] mb-6">
            <div className="relative h-[80px] w-full flex items-center">
              {/* Dotted line */}
              <div className="absolute top-1/2 left-[5%] right-[5%] h-0 border-t-2 border-dashed border-[#13B2A6]/50 dark:border-[#40DACD]/50 z-0"></div>
              
              {/* Pins */}
              <div className="absolute top-1/2 left-[5%] -translate-y-1/2 -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-[#13B2A6] ring-4 ring-[#13B2A6]/20"></div>
              </div>
              
              <div className="absolute top-[20%] left-[30%] -translate-y-1/2 -translate-x-1/2 z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-md flex items-center justify-center border border-gray-100 dark:border-gray-800 text-[#13B2A6]">
                    <MapPin size={24} strokeWidth={2} />
                  </div>
                  {/* Connecting dashed line to main horizontal line */}
                  <div className="absolute top-full left-1/2 w-0 h-[22px] border-l-2 border-dashed border-[#13B2A6]/50 -translate-x-1/2"></div>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-[60%] -translate-y-1/2 -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-[#13B2A6] ring-4 ring-[#13B2A6]/20"></div>
              </div>
              
              <div className="absolute top-[20%] left-[85%] -translate-y-1/2 -translate-x-1/2 z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-md flex items-center justify-center border border-gray-100 dark:border-gray-800 text-[#13B2A6]">
                    <MapPin size={24} strokeWidth={2} />
                  </div>
                  <div className="absolute top-full left-1/2 w-0 h-[22px] border-l-2 border-dashed border-[#13B2A6]/50 -translate-x-1/2"></div>
                </div>
              </div>
            </div>
            <p className="text-[12px] text-[#4A4A4A] dark:text-gray-400 mt-4">
              <span className="font-bold text-[#0B1F3A] dark:text-white">Including:</span> Europe, North America, with more regions to be launched soon
            </p>
          </div>
        </div>

        {/* Right Side: Images */}
        <div className="w-full lg:w-[55%] relative h-[550px]">
           {/* Decorative Badge */}
           <div className="absolute top-12 right-20 z-30 w-[100px] h-[100px] rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
             <div className="w-[80px] h-[80px] rounded-full border border-white/60 flex items-center justify-center text-white text-[11px] font-bold uppercase tracking-widest text-center leading-tight transform -rotate-12">
               WORLDWIDE<br/>COVERAGE
             </div>
           </div>

           {/* Main Image */}
           <div className="absolute top-0 right-[15%] w-[65%] h-[450px] rounded-[40px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] z-20">
             <Image src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop" alt="Castle" fill className="object-cover" referrerPolicy="no-referrer" />
           </div>

           {/* Secondary Image */}
           <div className="absolute top-[100px] right-0 w-[45%] h-[400px] rounded-[40px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] z-10">
             <Image src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop" alt="City" fill className="object-cover" referrerPolicy="no-referrer" />
           </div>
           
           <div className="absolute bottom-2 left-[20%] z-20">
             <div className="text-[14px] font-bold text-[#13B2A6]">Instant Quote</div>
             <div className="text-[10px] text-gray-500 uppercase tracking-wide">Worldwide Coverage | 24/7 Charter Experts</div>
           </div>
        </div>

      </div>
    </div>
  );
};
