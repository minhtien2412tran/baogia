import React from 'react';
import Image from 'next/image';

export const MobileApp = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <div className="flex flex-col-reverse md:flex-row bg-[#F8FAFC] dark:bg-[#152033] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm items-center relative">
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1A263D] text-[#0B1F3A] dark:text-gray-200 px-4 py-2 rounded-full text-[13px] font-semibold w-max mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            Download Our App
          </div>
          
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-6 leading-[1.1] tracking-[-0.02em]">
            Book Private Jets on the Go
          </h2>
          
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[16.5px] leading-relaxed mb-10 max-w-lg">
            Experience seamless booking with our mobile app. Manage your flight requests, stay updated on trip details, and access private aviation from anywhere in the world.
          </p>
          
          <div>
            <button className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors">
              <svg viewBox="0 0 384 512" width="24" height="24" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-tight">Download on the</div>
                <div className="text-[16px] font-semibold leading-tight -mt-0.5">App Store</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full h-[400px] md:h-auto min-h-[500px] relative">
          <Image src="https://picsum.photos/seed/mobileapp/800/800" alt="Mobile App" fill className="object-cover md:object-right" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#F8FAFC] dark:from-[#152033] via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  )
}
