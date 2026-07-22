'use client';

import React from 'react';
import Image from 'next/image';

export const PetTravelBenefits = () => {
  const benefits = [
    {
      title: "Travel Comfortably Together",
      desc: "Forget cramped cargo holds and separation anxiety. Your pet stays right beside you in the main cabin, enjoying plush leather seating and personalized attention.",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800",
    },
    {
      title: "Stress-Free Travel For Pets",
      desc: "We understand that air travel can be intimidating for pets. Cabin temperature control, low cabin noise, and familiar human presence ensure a calm flight.",
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=800",
    },
    {
      title: "No Size or Breed Restrictions",
      desc: "Say goodbye to commercial airline weight caps or snub-nosed breed bans. Large dogs, multiple pets, and all breeds are welcomed warmly onboard.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800",
    },
    {
      title: "Year-Round Travel Flexibility",
      desc: "Commercial flights restrict pet travel during hot summer or freezing winter months. Private jet charters fly year-round without seasonal temperature embargoes.",
      image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800",
    },
    {
      title: "Travel Freely with Your Pack",
      desc: "Bring your whole furry family along. Whether you have multiple dogs, cats, or exotic pets, our spacious jet cabins accommodate your complete household.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800",
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Grid of Benefit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {benefits.map((card, idx) => (
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
