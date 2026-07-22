'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

export const EventCharterIntro = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Title Header with Gold Left Accent Line */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Book a Private Jet for Event
        </h2>
      </div>

      {/* Intro Banner with Background Image & Floating Glass Card */}
      <div className="relative w-full rounded-[24px] overflow-hidden min-h-[320px] md:min-h-[380px] shadow-sm flex items-center p-6 md:p-10 border border-slate-100 dark:border-gray-800">
        
        {/* Background Image: Stylish traveler with hat looking out at jet tarmac */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600" 
            alt="Traveler preparing for private event charter flight" 
            fill 
            className="object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10"></div>
        </div>

        {/* Floating White Card */}
        <div className="relative z-10 max-w-lg bg-white/95 dark:bg-[#152033]/95 backdrop-blur-md rounded-[20px] p-6 sm:p-8 shadow-xl border border-white/60 dark:border-gray-800">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD] flex items-center justify-center shrink-0">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0B1F3A] dark:text-white leading-tight">
              Discover Jetbay Events Charter
            </h3>
          </div>
          <p className="text-[13.5px] sm:text-[14px] text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
            Experience the pinnacle of travel with Jetbay&apos;s private jet charter services for events of all sizes. Charter our aircraft to indulge in a luxurious, seamless travel experience for corporate events, weddings, parties, concerts, and more.
          </p>
        </div>

      </div>

    </div>
  );
};
