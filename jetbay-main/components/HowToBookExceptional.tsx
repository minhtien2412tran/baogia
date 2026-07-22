'use client';

import React from 'react';
import Image from 'next/image';

export const HowToBookExceptional = () => {
  const features = [
    {
      title: "Global Coverage",
      desc: "Available 24/7, our private jet network spans 190+ countries with 20,000+ private jet flights, ensuring global reach and seamless connectivity.",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800",
    },
    {
      title: "AI-Powered Efficiency",
      desc: "Our smart air charter system uses AI to match your needs, securing the best aircraft and planning your private jet trip in 1-2 hours.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800",
    },
    {
      title: "Uncompromised Safety",
      desc: "With certified aircraft, experienced pilots, and trusted partners, Jetbay prioritises safety and reliability in every private jet flight.",
      image: "https://images.unsplash.com/photo-1508672019048-805479767531?q=80&w=800",
    },
    {
      title: "Industry Leader",
      desc: "With over 10,000 satisfied clients and a 99% satisfaction rate, we're Asia's leading provider of premium private jet charter services.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800",
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Section Title Header */}
      <div className="mb-8">
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          What Makes Our Private Air Charter Service Exceptional
        </h2>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((item, idx) => (
          <div 
            key={idx}
            className="group bg-white dark:bg-[#152033] rounded-[22px] overflow-hidden border border-slate-100 dark:border-gray-800 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative h-[160px] w-full overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
              <h3 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white">
                {item.title}
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-gray-400 font-normal leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
