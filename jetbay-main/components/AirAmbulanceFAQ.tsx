'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const AirAmbulanceFAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const leftFaqs = [
    {
      q: "What is a medevac flight and how does it work with Jetbay?",
      a: "A medevac (medical evacuation) flight is a specialized air transport service equipped with medical equipment and staffed by healthcare professionals to safely move patients requiring urgent or intensive medical care."
    },
    {
      q: "Is medevac only for emergencies?",
      a: "No, while medevac flights are frequently dispatched for critical emergencies, Jetbay also provides non-emergency air medical transport for patients needing bed-to-bed relocations, post-surgery travel, or specialized hospital transfers."
    },
    {
      q: "What types of medical aircraft are available through Jetbay?",
      a: "Jetbay operates a diverse fleet of medical aircraft ranging from turboprops for short regional transfers to long-range executive jets equipped with full ICU cabins for intercontinental flights."
    },
    {
      q: "Is there medical staff onboard during a Jetbay medevac flight?",
      a: "Yes. Every Jetbay medevac flight includes a qualified medical team tailored to the patient's condition, such as flight doctors, critical care paramedics, or specialized nurses."
    },
    {
      q: "Can Jetbay arrange international air ambulance transfers?",
      a: "Absolutely. Jetbay specializes in cross-border air ambulance logistics, including international overflight permits, landing clearances, ground transport synchronization, and medical customs processing."
    }
  ];

  const rightFaqs = [
    {
      q: "How quickly can Jetbay dispatch a medevac flight?",
      a: "Depending on permit approvals and aircraft location, Jetbay can typically dispatch a fully equipped medevac jet within 2 to 4 hours of mission confirmation."
    },
    {
      q: "What information is needed to arrange a medevac with Jetbay?",
      a: "We require the patient's current medical report, treating physician contact details, departure and destination medical facilities, and passport/visa documentation for international flights."
    },
    {
      q: "Are Jetbay medevac services covered by insurance?",
      a: "Many private health and international travel insurance policies cover air ambulance transfers. Our flight coordination team can assist in providing necessary documentation for insurance claims."
    },
    {
      q: "Can a family member accompany the patient?",
      a: "Yes, in most cases 1 to 2 family members can accompany the patient onboard free of charge, provided aircraft weight and space parameters allow."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Frequently Asked Questions about Air Ambulance Services
        </h2>
      </div>

      {/* 2 Column Clean Border Divider Grid */}
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
