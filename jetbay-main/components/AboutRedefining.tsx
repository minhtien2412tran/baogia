'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export const AboutRedefining = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-16 font-sans">
      
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-[3px] h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] font-semibold text-[#0B1F3A] dark:text-white">
          Redefining Private Aviation
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#152033] rounded-[16px] border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="relative w-full sm:w-[140px] h-[140px] rounded-[12px] overflow-hidden shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=400" 
              alt="Woman in front of private jet" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white mb-4">
              Fly Without Owning
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={16} className="text-[#D4A64A]" />
                <span>Aircraft available 24/7</span>
              </li>
              <li className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={16} className="text-[#D4A64A]" />
                <span>No ownership commitments</span>
              </li>
              <li className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={16} className="text-[#D4A64A]" />
                <span>Competitive pricing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#152033] rounded-[16px] border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="relative w-full sm:w-[140px] h-[140px] rounded-[12px] overflow-hidden shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400" 
              alt="Airplane flying over city" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white mb-4">
              Fly Anywhere with Jetbay
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={16} className="text-[#D4A64A]" />
                <span>10,000 private jets worldwide</span>
              </li>
              <li className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={16} className="text-[#D4A64A]" />
                <span>Fly anytime, anywhere</span>
              </li>
              <li className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={16} className="text-[#D4A64A]" />
                <span>Best prices</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
