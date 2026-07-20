import React from 'react';
import Image from 'next/image';

export const GroupCharterPromotions = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12 mb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Private jet promotions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Jet Card */}
        <div className="relative h-[240px] rounded-[24px] overflow-hidden group border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white dark:bg-[#152033]">
          
          {/* Tag (Behind Image) */}
          <div className="absolute top-0 left-[35%] bg-[#3B82F6] text-white text-[14px] font-bold pl-[12%] pr-5 py-2 rounded-br-[16px] z-0 shadow-sm">
            Fly Smarter
          </div>

          {/* Image (Slanted) */}
          <div 
            className="absolute left-0 top-0 h-full w-[45%] z-20"
            style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1544885876-061327142721?q=80&w=800&auto=format&fit=crop" 
              alt="Pilot" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Content */}
          <div className="absolute right-0 top-0 h-full w-[60%] p-6 lg:p-8 flex flex-col justify-center z-10">
            <div className="max-w-[260px]">
              <h3 className="text-[22px] font-bold text-[#0B1F3A] dark:text-white mb-2">Jet Card</h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Enjoy flexibility and guaranteed rates with the Jetbay Jet Card.
              </p>
            </div>
            
            <div className="absolute bottom-6 right-6">
              <button className="bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#3B82F6] dark:text-[#93C5FD] font-bold px-6 py-2.5 rounded-lg text-[13px] hover:bg-[#DBEAFE] dark:hover:bg-[#1E40AF] transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Travel Credit */}
        <div className="relative h-[240px] rounded-[24px] overflow-hidden group border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white dark:bg-[#152033]">
          
          {/* Tag (Behind Image) */}
          <div className="absolute top-0 left-[35%] bg-[#3B82F6] text-white text-[14px] font-bold pl-[12%] pr-5 py-2 rounded-br-[16px] z-0 shadow-sm">
            Save & Earn
          </div>

          {/* Image (Slanted) */}
          <div 
            className="absolute left-0 top-0 h-full w-[45%] z-20 bg-white"
            style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1579543232043-34e8f7d983e2?q=80&w=800&auto=format&fit=crop" 
              alt="Airplane in sky" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Content */}
          <div className="absolute right-0 top-0 h-full w-[60%] p-6 lg:p-8 flex flex-col justify-center z-10">
            <div className="max-w-[260px]">
              <h3 className="text-[22px] font-bold text-[#0B1F3A] dark:text-white mb-2">Travel Credit</h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Earn exclusive credits on private jet bookings.
              </p>
            </div>
            
            <div className="absolute bottom-6 right-6">
              <button className="bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#3B82F6] dark:text-[#93C5FD] font-bold px-6 py-2.5 rounded-lg text-[13px] hover:bg-[#DBEAFE] dark:hover:bg-[#1E40AF] transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
