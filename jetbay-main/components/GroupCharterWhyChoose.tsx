import React from 'react';
import Image from 'next/image';

export const GroupCharterWhyChoose = () => {
  const reasons = [
    {
      title: "Global Coverage",
      desc: "Available 24/7, our jet charter network...",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "AI-Powered Efficiency",
      desc: "Our smart air charter system uses AI to...",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Uncompromised Safety",
      desc: "With certified aircraft, experienced pilots,...",
      image: "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Industry Leader",
      desc: "With over 10,000 satisfied clients and a...",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Why Choose Group Air Charters by Jetbay
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((reason, index) => (
          <div key={index} className="relative h-[240px] rounded-[24px] overflow-hidden group cursor-pointer">
            <Image 
              src={reason.image} 
              alt={reason.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h3 className="text-[18px] font-bold mb-1 leading-tight">{reason.title}</h3>
              <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed">
                {reason.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
