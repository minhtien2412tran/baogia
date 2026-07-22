'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const PetTravelPromotions = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fly Smarter - Jet Card */}
        <div className="relative bg-white dark:bg-[#152033] rounded-[24px] border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden flex items-center p-6 sm:p-8 min-h-[180px] group">
          <div className="relative z-10 max-w-[55%] space-y-2">
            <span className="inline-block bg-[#0066FF] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Fly Smarter
            </span>
            <h3 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white leading-snug">
              Jet Card
            </h3>
            <p className="text-[12.5px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
              Enjoy flexibility and guaranteed rates with the Jetbay Jet Card.
            </p>
            <div className="pt-2">
              <Link 
                href="/jet-card"
                className="inline-flex items-center text-[13px] font-bold text-[#0066FF] dark:text-[#40DACD] hover:underline"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" 
              alt="Jet Card Pilot" 
              fill 
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Save & Earn - Travel Credit */}
        <div className="relative bg-white dark:bg-[#152033] rounded-[24px] border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden flex items-center p-6 sm:p-8 min-h-[180px] group">
          <div className="relative z-10 max-w-[55%] space-y-2">
            <span className="inline-block bg-[#0066FF] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Save &amp; Earn
            </span>
            <h3 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white leading-snug">
              Travel Credit
            </h3>
            <p className="text-[12.5px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
              Earn exclusive credits on private jet bookings.
            </p>
            <div className="pt-2">
              <Link 
                href="/memberships"
                className="inline-flex items-center text-[13px] font-bold text-[#0066FF] dark:text-[#40DACD] hover:underline"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" 
              alt="Travel Credit Skyline" 
              fill 
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
