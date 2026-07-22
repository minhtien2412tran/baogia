'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const PetTravelFAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const leftFaqs = [
    {
      q: "Can I fly with multiple pets on a private jet flight?",
      a: "Yes! Unlike commercial airlines that cap the number of pets per cabin, Jetbay allows you to fly with multiple pets, provided the total aircraft payload and space limits are respected."
    },
    {
      q: "Can I travel with my pet to any destination?",
      a: "Virtually anywhere, as long as the destination country permits live animal entry. Jetbay's charter team coordinates with international customs and quarantine authorities to ensure complete entry compliance."
    },
    {
      q: "What documents are required for private pet transport by air?",
      a: "Typically required documents include valid rabies vaccination certificates, a health clearance certificate from a licensed veterinarian (issued within 10 days of travel), pet passport, microchip records, and destination import permits."
    },
    {
      q: "Should I sedate my pet before the flight?",
      a: "Veterinarians generally advise against sedating pets during air travel as it can affect their breathing and blood pressure at high altitudes. Because pets sit right next to you in the main cabin, they naturally remain calm without sedation."
    }
  ];

  const rightFaqs = [
    {
      q: "Do pets fly in the main cabin along with passengers?",
      a: "Absolutely. On all Jetbay pet charters, your pets fly directly inside the executive passenger cabin right beside you, never in cargo."
    },
    {
      q: "Does my pet need to stay in a kennel during the flight?",
      a: "While taxiing, takeoff, and landing require pets to be safely secured (or in a soft carrier for small pets), once at cruising altitude, your pet can relax comfortably on custom protective seat covers or pet bedding in the cabin."
    },
    {
      q: "Are there size or breed restrictions for dogs on private jets?",
      a: "No! There are no breed bans or weight limits on Jetbay private flights. Brachycephalic (short-nosed) breeds, large working dogs, and giant breeds are all welcome."
    },
    {
      q: "Do I need to bring food for my pet, or is it provided on the flight?",
      a: "We recommend bringing your pet's regular food to avoid digestive upset. However, Jetbay can arrange specialized fresh pet catering, gourmet treats, and filtered water upon request."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* 2 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
        
        {/* Left Column */}
        <div>
          {leftFaqs.map((faq, i) => {
            const index = i;
            const isOpen = openIdx === index;
            return (
              <div 
                key={index} 
                className="border-b border-slate-100 dark:border-gray-800/80 transition-colors"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4.5 px-1 flex items-center justify-between text-left gap-4 font-semibold text-[13.5px] md:text-[14px] text-[#0B1F3A] dark:text-gray-100 hover:text-[#0066FF] dark:hover:text-[#40DACD] transition-colors cursor-pointer group"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown 
                    size={15} 
                    className={`shrink-0 transition-transform duration-200 text-slate-400 group-hover:text-slate-600 dark:text-gray-400 ${isOpen ? 'rotate-180 text-[#0066FF]' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="pb-4 px-1 text-[13px] text-slate-500 dark:text-gray-400 leading-relaxed font-medium animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div>
          {rightFaqs.map((faq, i) => {
            const index = i + 10;
            const isOpen = openIdx === index;
            return (
              <div 
                key={index} 
                className="border-b border-slate-100 dark:border-gray-800/80 transition-colors"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4.5 px-1 flex items-center justify-between text-left gap-4 font-semibold text-[13.5px] md:text-[14px] text-[#0B1F3A] dark:text-gray-100 hover:text-[#0066FF] dark:hover:text-[#40DACD] transition-colors cursor-pointer group"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown 
                    size={15} 
                    className={`shrink-0 transition-transform duration-200 text-slate-400 group-hover:text-slate-600 dark:text-gray-400 ${isOpen ? 'rotate-180 text-[#0066FF]' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="pb-4 px-1 text-[13px] text-slate-500 dark:text-gray-400 leading-relaxed font-medium animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
