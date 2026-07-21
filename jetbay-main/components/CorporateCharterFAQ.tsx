'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const CorporateCharterFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can I book a corporate charter for multi-destination trips?",
      a: "Yes, our multi-city booking options allow you to coordinate complex, multi-stop itineraries. This enables your executive team to connect several regional offices or clients in a single business trip with complete scheduling efficiency."
    },
    {
      q: "How many passengers can travel on a corporate air charter?",
      a: "Our private jets can accommodate groups of almost any size. Standard light business jets carry 4 to 8 passengers, midsize and super-midsize models hold 8 to 12, while ultra-long-range jets and customized regional airliner group charters can fly teams of 16 up to 100+ travelers."
    },
    {
      q: "Can I hold meetings during the flight?",
      a: "Absolutely. Many of our featured business jets are explicitly designed as mobile workspaces. They come equipped with custom conference tables, high-speed secure satellite Wi-Fi, power outlets, state-of-the-art cabin quietness, and privacy partitions so you can work and discuss confidentially."
    },
    {
      q: "What in-flight amenities and services are available on corporate air charters?",
      a: "Typical corporate amenities include high-speed secure Wi-Fi, fully adjustable leather captain's chairs, gourmet catering customized to your dietary needs, conference tables, satellite communications, restrooms (some with showers on ultra-long-range models), and dedicated flight host services."
    },
    {
      q: "What types of aircraft are available for business air charters?",
      a: "We offer a diverse fleet ranging from light cabin jets (e.g., Embraer Phenom 300) and midsize jets (e.g., Citation Latitude) to ultra-long-range heavy jets (e.g., Gulfstream G650ER and Bombardier Global 6000) that can comfortably cross continents and oceans non-stop."
    }
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      {/* Accordions */}
      <div className="space-y-4 max-w-4xl">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between text-left py-4 text-[#0B1F3A] dark:text-white font-bold text-[15.5px] md:text-[16.5px] tracking-tight hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="shrink-0 ml-4 w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 dark:bg-[#152033] border border-gray-100 dark:border-gray-800 text-[#0B1F3A] dark:text-white group">
                  {isOpen ? (
                    <Minus size={14} strokeWidth={2.5} className="text-[#13B2A6] dark:text-[#40DACD]" />
                  ) : (
                    <Plus size={14} strokeWidth={2.5} />
                  )}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 text-[13.5px] md:text-[14.5px] leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
