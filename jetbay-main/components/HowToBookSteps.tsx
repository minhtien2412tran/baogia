'use client';

import React from 'react';
import { Mail, MessageSquare, CreditCard, Plane } from 'lucide-react';

export const HowToBookSteps = () => {
  const steps = [
    {
      step: "Step 1",
      title: "Enquiry",
      desc1: "Share your travel details and preferences, including destinations, dates, and passenger needs.",
      desc2: "Our proprietary system and team will carefully review your request to match you with the most suitable aircraft for your journey.",
      tag: "Find the right aircraft for your needs",
      icon: Mail,
      isHighlighted: false,
    },
    {
      step: "Step 2",
      title: "Tailored Quotation",
      desc1: "Your dedicated Private Charter Specialist will design a personalised flight plan tailored to your requirements.",
      desc2: "We will recommend the most suitable aircraft and provide a competitive, transparent quotation based on your journey.",
      tag: "Receive a fully tailored flight solution",
      icon: MessageSquare,
      isHighlighted: false,
    },
    {
      step: "Step 3",
      title: "Confirmation & Payment",
      desc1: "Once you're happy with your itinerary, you can review and sign the charter agreement securely.",
      desc2: "Choose your preferred payment method and confirm your booking with full transparency and no hidden fees.",
      tag: "Secure and transparent booking process",
      icon: CreditCard,
      isHighlighted: false,
    },
    {
      step: "Step 4",
      title: "Fly & Enjoy",
      desc1: "From pre-flight arrangements to arrival, our team manages every detail of your journey.",
      desc2: "Enjoy a seamless experience with personalised service, allowing you to relax and focus on what matters most.",
      tag: "Sit back and enjoy the experience",
      icon: Plane,
      isHighlighted: true,
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Section Title Header */}
      <div className="mb-8">
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          How To Book Your Jet
        </h2>
        <p className="text-[13.5px] sm:text-[14px] text-slate-500 dark:text-gray-400 font-medium mt-1">
          Simple, Efficient, Reliable. Follow these four steps to book your charter flight.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className={`rounded-[22px] p-6 flex flex-col justify-between border transition-all duration-300 ${
                item.isHighlighted
                  ? 'bg-[#EAF8F7] dark:bg-[#152E32] border-[#C3EFEA] dark:border-[#1E4D48] shadow-xs'
                  : 'bg-[#F9FAFC] dark:bg-[#152033] border-slate-100 dark:border-gray-800 shadow-2xs'
              }`}
            >
              <div>
                {/* Header Row: Step Pill + Graphic Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-gray-300 bg-white dark:bg-[#0E1726] px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-gray-700 shadow-3xs">
                    {item.step}
                  </span>
                  
                  {/* Decorative Icon Container */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#80B5FF] to-[#3B82F6] text-white flex items-center justify-center shadow-xs">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-[#0B1F3A] dark:text-white mb-3">
                  {item.title}
                </h3>

                {/* Description Paragraphs */}
                <div className="space-y-2 text-[12px] text-slate-600 dark:text-gray-300 leading-relaxed font-normal">
                  <p>{item.desc1}</p>
                  <p>{item.desc2}</p>
                </div>
              </div>

              {/* Tag at bottom */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>{item.tag}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
