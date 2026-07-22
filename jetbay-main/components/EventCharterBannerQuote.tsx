'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const EventCharterBannerQuote = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Title Header with Gold Left Accent Line */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Event Charter Flights
        </h2>
      </div>

      <div className="bg-slate-50 dark:bg-[#152033] rounded-[24px] border border-slate-100 dark:border-gray-800 p-4 sm:p-6 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Image Block: Passengers Celebrating / Cheering in Private Jet Cabin */}
          <div className="md:col-span-5 lg:col-span-4 relative h-[200px] sm:h-[220px] rounded-[18px] overflow-hidden shadow-xs">
            <Image 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800" 
              alt="Passengers celebrating an event onboard private jet" 
              fill 
              className="object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details Block */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            <p className="text-[14px] md:text-[15px] text-slate-700 dark:text-gray-200 leading-relaxed font-medium">
              Elevate your next event with a private jet charter. Imagine the freedom of having an aircraft available 24/7, without the commitments of ownership, ready to whisk you away to any destination on your exact schedule.
              {isExpanded && (
                <span className="block mt-3 animate-fadeIn text-slate-600 dark:text-gray-300">
                  Whether hosting high-profile corporate summits, destination weddings, major sports finals, or VIP music tours, Jetbay coordinates tailored flight solutions. From bespoke in-flight catering and branded aircraft liveries to seamless VIP airport transfers, we ensure every guest experiences unmatched comfort and prestige.
                </span>
              )}
            </p>

            <div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0066FF] dark:text-[#40DACD] hover:underline cursor-pointer"
              >
                <span>{isExpanded ? 'View Less' : 'View More'}</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
