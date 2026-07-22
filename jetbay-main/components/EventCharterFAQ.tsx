'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const EventCharterFAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const leftFaqs = [
    {
      q: "How much do charter flights for events cost?",
      a: "Event charter flight costs vary depending on aircraft type, flight distance, duration, airport landing fees, and bespoke in-flight catering or branding requirements. Contact Jetbay for a transparent, tailored quote."
    },
    {
      q: "What types of event private jet charters are available in your fleet?",
      a: "Our fleet ranges from light and midsize jets for intimate executive meetings to heavy jets and VIP airliner conversions (such as Boeing BBJ and Airbus ACJ) capable of carrying up to 100+ attendees."
    },
    {
      q: "How many people can an event charter flight carry?",
      a: "From 4 to 12 passengers on light jets up to large groups of 20 to 100+ guests on dedicated VIP regional airliners."
    },
    {
      q: "How much luggage can I take on an event charter flight?",
      a: "Luggage capacity depends on aircraft size. Larger event aircraft feature generous cargo holds capable of accommodating stage equipment, golf bags, wardrobe trunks, and event merchandise."
    }
  ];

  const rightFaqs = [
    {
      q: "Can I organise group travel for events using charter flights?",
      a: "Yes! Group event travel is one of Jetbay&apos;s primary specialties. We coordinate seamless group logistics, dedicated check-in desks, and synchronized multi-aircraft departures if required."
    },
    {
      q: "What in-flight amenities and services are available on event private jets?",
      a: "Custom amenities include bespoke gourmet dining, champagne service, customized headrest covers, branded cabin menus, Wi-Fi connectivity, and personalized in-flight entertainment."
    },
    {
      q: "Can the charter flight schedule be adjusted to fit the event timings?",
      a: "Absolutely. Private jet charters fly on your exact schedule. If your conference runs late or your wedding celebration extends into the evening, the aircraft waits for you."
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
