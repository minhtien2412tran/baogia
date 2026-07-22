'use client';

import React from 'react';
import Image from 'next/image';
import { FileText } from 'lucide-react';

export const AirAmbulanceSOSBanner = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Jetbay SOS
        </h2>
      </div>

      {/* SOS Banner Box */}
      <div className="relative w-full rounded-[28px] overflow-hidden min-h-[300px] md:min-h-[320px] shadow-md border border-gray-100 dark:border-gray-800 flex items-center p-6 md:p-10">
        
        {/* Background rescue image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200" 
            alt="Jetbay SOS Emergency Rescue Crew" 
            fill 
            className="object-cover object-right"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
        </div>

        {/* Floating White Content Card */}
        <div className="relative z-10 bg-white/95 dark:bg-[#152033]/95 backdrop-blur-md max-w-[500px] p-6 md:p-8 rounded-[24px] border border-white/60 dark:border-gray-700/60 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          
          {/* Gold Badge Header */}
          <div className="flex items-center gap-2.5 text-[#D4A64A] mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] dark:bg-[#2B2313] flex items-center justify-center border border-[#EEDCBA]">
              <FileText size={18} className="text-[#D4A64A]" />
            </div>
            <span className="text-[16px] md:text-[18px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
              Jetbay Medevac and SOS Service
            </span>
          </div>

          {/* Description */}
          <p className="text-[13.5px] md:text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            Rapid medical air support, when you need it most. Jetbay provides comprehensive air ambulance and medevac services with global reach, ensuring expert medical care and safe transport for patients worldwide.
          </p>
        </div>

        {/* Red Decorative Geometric Shapes at Bottom Right */}
        <div className="absolute bottom-0 right-12 z-10 hidden md:flex items-end gap-1.5 opacity-90">
          <div className="w-10 h-16 bg-[#DC2626] transform -skew-x-12 rounded-t-sm shadow-md"></div>
          <div className="w-10 h-24 bg-[#B91C1C] transform -skew-x-12 rounded-t-sm shadow-md"></div>
          <div className="w-10 h-32 bg-[#991B1B] transform -skew-x-12 rounded-t-sm shadow-md"></div>
        </div>

      </div>

    </div>
  );
};
