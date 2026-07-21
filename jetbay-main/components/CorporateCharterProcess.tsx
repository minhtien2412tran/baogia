'use client';

import React from 'react';
import { ClipboardList, FileCheck, CreditCard, Shield, Sparkles } from 'lucide-react';

export const CorporateCharterProcess = () => {
  const steps = [
    {
      title: "Inquiry",
      desc: "Submit Your Request Online.",
      icon: ClipboardList
    },
    {
      title: "Quotation",
      desc: "Receive Your Tailored Quotation.",
      icon: FileCheck
    },
    {
      title: "Contract & Payment",
      desc: "Endorse & Make Payment.",
      icon: CreditCard
    },
    {
      title: "Trip Preparation",
      desc: "Personalised Flight Experience.",
      icon: Shield
    },
    {
      title: "Enjoy Your Trip",
      desc: "Relax and Enjoy Your Journey.",
      icon: Sparkles
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Header row with Title and Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
            Business Charter Booking Process
          </h2>
        </div>
        
        <button className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-[#1A2E44] dark:hover:bg-[#243B54] text-blue-600 dark:text-blue-400 font-bold rounded-xl text-[13.5px] transition-colors shadow-sm cursor-pointer self-start sm:self-auto">
          View More
        </button>
      </div>

      {/* Steps Row connected with line */}
      <div className="relative w-full">
        {/* Connection Line (hidden on small screens) */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gray-100 dark:bg-gray-800 z-0"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-[#152033] border-2 border-gray-100 dark:border-gray-800 shadow-md group-hover:shadow-lg flex items-center justify-center mb-6 transition-all duration-300 relative">
                  <div className="w-20 h-20 rounded-full bg-[#F4FBFB] dark:bg-[#0E1726] flex items-center justify-center group-hover:bg-[#EBF7F6] dark:group-hover:bg-[#1A3B37] transition-all duration-300">
                    <IconComponent className="text-[#13B2A6] dark:text-[#40DACD] transition-transform duration-300 group-hover:scale-105" size={32} />
                  </div>
                  
                  {/* Step number label */}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gray-100 dark:bg-[#0E1726] text-gray-500 dark:text-gray-400 text-[12px] font-bold flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    {idx + 1}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-[#0B1F3A] dark:text-white font-bold text-[16px] md:text-[17px] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed max-w-[180px] font-medium">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
