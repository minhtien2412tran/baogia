'use client';

import React from 'react';
import Image from 'next/image';

export const EventCharterServices = () => {
  const services = [
    {
      title: "Charter Flight for Corporate Events",
      desc: "Impress your clients and team with a private aircraft tailored for business summits, trade shows, product launches, and incentive trips.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800",
    },
    {
      title: "Event Charter Flight for Weddings",
      desc: "Make your wedding day even more special by transporting bridal parties and guests directly to remote destination wedding locations.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
    },
    {
      title: "Event Charter Flight for Parties",
      desc: "Celebrate in style with a private aircraft for milestone birthdays, anniversaries, gala celebrations, and VIP group weekend getaways.",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
    },
    {
      title: "Event Charter Flight for Music Concerts",
      desc: "Ensure your artists, bands, and production crew arrive on time and fully refreshed for concert tours and international music festivals.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800",
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Section Title Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Event Charter Flight Services We Offer
        </h2>
      </div>

      {/* Grid of 4 Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((card, idx) => (
          <div 
            key={idx}
            className="group relative bg-white dark:bg-[#152033] rounded-[20px] overflow-hidden border border-slate-100 dark:border-gray-800 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container with "More" Badge */}
            <div className="relative h-[160px] w-full overflow-hidden">
              <Image 
                src={card.image} 
                alt={card.title} 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-gray-900/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                More
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
              <h3 className="text-[15px] font-bold text-[#0B1F3A] dark:text-white leading-snug">
                {card.title}
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-3">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
