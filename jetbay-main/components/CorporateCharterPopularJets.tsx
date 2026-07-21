'use client';

import React from 'react';
import Image from 'next/image';
import { Users2, Compass, Award } from 'lucide-react';

export const CorporateCharterPopularJets = () => {
  const jets = [
    {
      name: "Gulfstream G650ER",
      seats: 14,
      range: "13,890 km",
      featured: true,
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600"
    },
    {
      name: "Gulfstream G550",
      seats: 15,
      range: "12,501 km",
      featured: true,
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600"
    },
    {
      name: "Bombardier Global 6000",
      seats: 13,
      range: "11,112 km",
      featured: false,
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600"
    },
    {
      name: "Dassault Falcon 7X",
      seats: 11,
      range: "11,019 km",
      featured: false,
      img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Popular Business Jets We Offer
        </h2>
      </div>

      {/* Grid of 4 jets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {jets.map((jet, idx) => (
          <div 
            key={idx}
            className="group bg-white dark:bg-[#152033] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Jet Image */}
            <div className="relative h-[200px] w-full overflow-hidden">
              <Image 
                src={jet.img} 
                alt={jet.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              
              {/* Featured Badge */}
              {jet.featured && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Award size={12} />
                  <span>Featured</span>
                </div>
              )}
            </div>

            {/* Jet Specifications */}
            <div className="p-6">
              <h3 className="text-[17px] md:text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-4 tracking-tight">
                {jet.name}
              </h3>
              
              <div className="space-y-2.5 text-[13px] text-gray-500 dark:text-gray-400 font-medium border-t border-gray-50 dark:border-gray-800 pt-4">
                <div className="flex items-center gap-2.5">
                  <Users2 size={16} className="text-gray-400 dark:text-gray-500" />
                  <span>Seats: {jet.seats}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Compass size={16} className="text-gray-400 dark:text-gray-500" />
                  <span>Maximum Range: {jet.range}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
