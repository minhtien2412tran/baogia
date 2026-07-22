'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const PetTravelBannerQuote = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      <div className="bg-slate-50 dark:bg-[#152033] rounded-[24px] border border-slate-100 dark:border-gray-800 p-4 sm:p-6 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Image Block: Dogs on Private Jet Seat */}
          <div className="md:col-span-5 lg:col-span-4 relative h-[200px] sm:h-[220px] rounded-[18px] overflow-hidden shadow-xs">
            <Image 
              src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800" 
              alt="Beloved dogs in private jet cabin seat" 
              fill 
              className="object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quote / Details Block */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            <p className="text-[14px] md:text-[15px] text-slate-700 dark:text-gray-200 leading-relaxed font-medium">
              Imagine soaring above the clouds, your beloved pet comfortably by your side. With Jetbay&apos;s private pet flights, you can make this a reality. Say goodbye to cramped cargo holds and anxious journeys—your furry companion experiences the same luxury, safety, and personalized care as you do.
              {isExpanded && (
                <span className="block mt-3 animate-fadeIn text-slate-600 dark:text-gray-300">
                  Whether moving to a new country, going on a family getaway, or seeking specialized veterinary care abroad, Jetbay ensures hassle-free pet charters tailored to your exact itinerary. From pre-flight clearance and documentation assistance to customized in-cabin pet bedding and catering, every detail is handled with elite precision.
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
