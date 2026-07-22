'use client';

import React from 'react';
import Image from 'next/image';

export const EventCharterWhyJetbay = () => {
  const cards = [
    {
      title: "Global Coverage",
      desc: "Available 24/7, our private jet network connects thousands of primary and regional airports worldwide.",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800",
    },
    {
      title: "AI-Powered Efficiency",
      desc: "Our smart air charter system uses AI to rapidly source and match aircraft for complex event itineraries.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800",
    },
    {
      title: "Uncompromised Safety",
      desc: "With certified aircraft, experienced pilots, and strict audit checks, event safety is our highest priority.",
      image: "https://images.unsplash.com/photo-1508672019048-805479767531?q=80&w=800",
    },
    {
      title: "Industry Leader",
      desc: "With over 10,000 satisfied clients and an outstanding event execution record, Jetbay leads private aviation.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800",
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Section Title Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Why Choose Event Aircraft Charters by Jetbay
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <div 
            key={idx}
            className="group relative rounded-[20px] overflow-hidden h-[240px] sm:h-[260px] shadow-sm flex flex-col justify-end p-5 text-white border border-slate-100 dark:border-gray-800"
          >
            {/* Background Image */}
            <Image 
              src={card.image} 
              alt={card.title} 
              fill 
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

            {/* Content */}
            <div className="relative z-20 space-y-1.5">
              <h3 className="text-[17px] font-bold tracking-tight text-white leading-snug">
                {card.title}
              </h3>
              <p className="text-[12px] text-gray-200 font-medium leading-relaxed opacity-95">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
