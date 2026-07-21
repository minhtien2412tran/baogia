'use client';

import React from 'react';
import Image from 'next/image';

export const CorporateCharterBento = () => {
  const items = [
    {
      title: "Global Coverage",
      desc: "Available 24/7, our business jet network connects you to major financial and business hubs worldwide, landing at over 5,000 regional and international airports.",
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800"
    },
    {
      title: "AI-Powered Efficiency",
      desc: "Our smart air charter system uses advanced AI to optimize route planning, fleet matching, instant pricing transparency, and real-time empty leg availability.",
      img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800"
    },
    {
      title: "Uncompromised Safety",
      desc: "We operate exclusively with WYVERN and ARGUS safety-rated aircraft, certified crew, and rigorous pre-flight audits to guarantee complete peace of mind.",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800"
    },
    {
      title: "Industry Leader",
      desc: "With over 10,000 successfully completed corporate charter missions and an unmatched safety record, Jetbay is the premier partner for elite corporate flight services.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className="group relative h-[300px] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-end p-6 lg:p-8"
          >
            {/* Background Image */}
            <Image 
              src={item.img} 
              alt={item.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            
            {/* Dark background overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-[#0B1F3A]/20 group-hover:from-black/98 group-hover:via-[#0B1F3A]/85 transition-all duration-300 z-10"></div>

            {/* Text details */}
            <div className="relative z-20">
              <h3 className="text-white font-bold text-[18px] md:text-[20px] mb-2 tracking-tight group-hover:text-[#40DACD] transition-colors">
                {item.title}
              </h3>
              <p className="text-white/70 text-[12.5px] md:text-[13px] leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300 font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
