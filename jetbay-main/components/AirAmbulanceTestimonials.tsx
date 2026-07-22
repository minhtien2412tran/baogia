'use client';

import React from 'react';
import Image from 'next/image';

export const AirAmbulanceTestimonials = () => {
  const testimonials = [
    {
      name: "Fortune 500 Travel Director",
      quote: "Jetbay made my wife's transfer smooth and comfortable. We felt truly cared for.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
    },
    {
      name: "International Model",
      quote: "Jetbay's quick actions and great equipment ensured my father's safe journey. We felt at ease.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
    },
    {
      name: "Asian E-commerce CEO",
      quote: "I can't thank Jetbay enough. Their compassion during my child's emergency made all the difference.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200"
    },
    {
      name: "European Luxury CEO",
      quote: "Jetbay made booking a breeze—they got my needs, found the perfect jet, and helped me save on unnecessary costs.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Client Testimonials
        </h2>
      </div>

      {/* Grid of 4 Testimonial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, idx) => (
          <div 
            key={idx}
            className="bg-[#FAFBFD] dark:bg-[#152033] rounded-[24px] p-6 border border-gray-100 dark:border-gray-800/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between h-[180px]"
          >
            {/* User Profile Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                <Image 
                  src={t.avatar} 
                  alt={t.name} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-[13.5px] font-bold text-[#0B1F3A] dark:text-white leading-tight">
                {t.name}
              </h3>
            </div>

            {/* Testimonial Quote */}
            <p className="text-[12.5px] text-gray-600 dark:text-gray-300 italic leading-relaxed line-clamp-4 font-medium">
              &ldquo;{t.quote}&rdquo;
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
