'use client';

import React from 'react';
import { FileText, Calculator, CreditCard, Luggage, HeartHandshake } from 'lucide-react';

export const EventCharterProcess = () => {
  const steps = [
    {
      title: "Inquiry",
      sub: "Submit Your Request Online.",
      icon: FileText,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "Quotation",
      sub: "Receive Your Tailored Quotation.",
      icon: Calculator,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-900/30"
    },
    {
      title: "Contract & Payment",
      sub: "Endorse & Make Payment.",
      icon: CreditCard,
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
    },
    {
      title: "Trip Preparation",
      sub: "Personalised Flight Experience.",
      icon: Luggage,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
    },
    {
      title: "Enjoy Your Trip",
      sub: "Relax and Enjoy Your Journey.",
      icon: HeartHandshake,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-900/30"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      <div className="bg-[#F4F8FA] dark:bg-[#152033] rounded-[24px] p-6 sm:p-8 border border-slate-100 dark:border-gray-800 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex flex-col items-center space-y-2.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.color} shadow-2xs transition-transform hover:scale-110`}>
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#0B1F3A] dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                    {step.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
