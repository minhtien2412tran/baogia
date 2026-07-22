'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Destination } from '@/lib/destinationsData';

interface Props {
  destination: Destination;
}

export const DestinationDetailCities = ({ destination }: Props) => {
  if (!destination.cities || destination.cities.length === 0) return null;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Explore Cities in {destination.name}
        </h2>
      </div>

      {/* Cities 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {destination.cities.map((city, idx) => (
          <div 
            key={idx} 
            className="group relative rounded-[22px] overflow-hidden min-h-[280px] flex flex-col justify-end p-6 text-center border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image 
                src={city.image} 
                alt={city.name} 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
            </div>

            {/* City Content */}
            <div className="relative z-10 space-y-3">
              <h3 className="text-[22px] font-extrabold text-white tracking-tight drop-shadow-md">
                {city.name}
              </h3>
              <div className="flex justify-center">
                <Link 
                  href="/airports" 
                  className="bg-black/60 hover:bg-black/80 text-white border border-white/30 text-[12.5px] font-bold px-6 py-2 rounded-lg transition-all active:scale-95 shadow-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
