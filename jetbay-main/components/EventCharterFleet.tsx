'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Navigation } from 'lucide-react';

export const EventCharterFleet = () => {
  const fleet = [
    {
      name: "Bombardier Challenger 850",
      seats: "Seats: 14",
      range: "Maximum Range: 5,430 km",
      featured: true,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800",
    },
    {
      name: "Embraer Phenom 300",
      seats: "Seats: 6",
      range: "Maximum Range: 3,650 km",
      featured: true,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800",
    },
    {
      name: "Boeing BBJ",
      seats: "Seats: 40",
      range: "Maximum Range: 8,100 km",
      featured: false,
      image: "https://images.unsplash.com/photo-1508672019048-805479767531?q=80&w=800",
    },
    {
      name: "Airbus ACJ",
      seats: "Seats: 18",
      range: "Maximum Range: 11,112 km",
      featured: false,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800",
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {fleet.map((jet, idx) => (
          <div 
            key={idx}
            className="group bg-white dark:bg-[#152033] rounded-[20px] overflow-hidden border border-slate-100 dark:border-gray-800 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container with Featured Tag */}
            <div className="relative h-[160px] w-full overflow-hidden">
              <Image 
                src={jet.image} 
                alt={jet.name} 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {jet.featured && (
                <div className="absolute top-3 left-3 bg-[#D4A64A] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <span>🔥</span> Featured
                </div>
              )}
            </div>

            {/* Aircraft Details */}
            <div className="p-4 sm:p-5 space-y-3">
              <h3 className="text-[15px] font-bold text-[#0B1F3A] dark:text-white leading-snug">
                {jet.name}
              </h3>
              
              <div className="space-y-1 text-[12px] text-slate-500 dark:text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  <span>{jet.seats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-slate-400" />
                  <span>{jet.range}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
