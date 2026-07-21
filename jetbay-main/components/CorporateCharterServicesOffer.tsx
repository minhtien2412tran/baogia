'use client';

import React from 'react';
import Image from 'next/image';

export const CorporateCharterServicesOffer = () => {
  const services = [
    {
      title: "Corporate Air Charter for Luxury Business",
      desc: "Elevate your business travel experience with customized, high-end private jet charter solutions, offering maximum safety and privacy.",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
    },
    {
      title: "Corporate Air Charter for MICE (Meetings, Incentives, Conferences, Exhibitions)",
      desc: "Simplify group travel for your MICE events, ensuring seamless transportation, schedule control, and dedicated support for delegates.",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800"
    },
    {
      title: "Corporate Air Charter for Official Delegation",
      desc: "Facilitate seamless travel for official delegations and governmental representatives with private, high-security flights.",
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800"
    },
    {
      title: "Corporate Air Charter for Personnel Logistics",
      desc: "Optimise your personnel logistics with our corporate shuttle services, ensuring safe, reliable, and timely team transfers.",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Corporate and Business Charter Services
        </h2>
      </div>

      {/* Grid of 4 cards exactly matching the screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((svc, idx) => (
          <div 
            key={idx}
            className="group bg-white dark:bg-[#152033] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col h-[340px] md:h-[350px] cursor-pointer"
          >
            {/* Top: Image Container */}
            <div className="relative h-[220px] w-full shrink-0 overflow-hidden">
              <Image 
                src={svc.img} 
                alt={svc.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              
              {/* Premium badge with blue bullet dot */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm z-10">
                <span>More</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] inline-block shadow-[0_0_8px_#3B82F6]"></span>
              </div>
            </div>

            {/* Bottom: White Content Area */}
            <div className="p-5 flex flex-col justify-between flex-1 bg-white dark:bg-[#152033]">
              <div>
                <h3 className="text-[15px] md:text-[15.5px] font-extrabold text-[#0B1F3A] dark:text-white mb-2 tracking-tight leading-snug line-clamp-1 group-hover:text-[#13B2A6] dark:group-hover:text-[#40DACD] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-[12.5px] md:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 font-medium">
                  {svc.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

