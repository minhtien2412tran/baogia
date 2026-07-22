'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, ArrowUpRight } from 'lucide-react';

export const NewsHero = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12 font-sans">
      
      {/* Featured News Card */}
      <div className="bg-white dark:bg-[#152033] rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          <div className="flex items-center gap-2 mb-6 text-gray-500 dark:text-gray-400">
            <FileText size={20} />
            <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white leading-tight">
              Jetbay Expands Its Fixed-Price Route Model for Private Aviation Clients
            </h2>
          </div>

          <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Jetbay&apos;s fixed-price route model brings greater pricing clarity to selected high-demand private aviation corridors.
          </p>

          <div>
            <Link href="/news/jetbay-expands-fixed-price" className="inline-flex items-center gap-2 bg-[#3B5998] hover:bg-[#2d4373] text-white px-6 py-3 rounded-full text-[14px] font-semibold transition-colors">
              <span>Read More</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
          
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
          <Image 
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200" 
            alt="Jetbay dashboard" 
            fill 
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Overlaid Content */}
          <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
            <span className="inline-block bg-[#13B2A6] text-white text-[11px] font-bold px-2.5 py-1 rounded mb-3 tracking-wide">PRESS</span>
            <h3 className="text-white text-[24px] md:text-[32px] font-bold leading-tight mb-2">
              Jetbay Expands Its Fixed-Price Route Model
            </h3>
            <p className="text-gray-300 text-[12px] font-semibold tracking-wider">
              BY: VIVIEN ONG
            </p>
          </div>
        </div>

      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></button>
        <button className="w-2.5 h-2.5 rounded-full bg-[#0B1F3A] dark:bg-white cursor-pointer"></button>
        <button className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></button>
      </div>

    </div>
  );
};
