'use client';

import React from 'react';
import { Landmark, CreditCard, ShieldCheck } from 'lucide-react';

export const HowToPaySection = () => {
  const methods = [
    {
      title: "Bank Transfer",
      desc: "Transfer funds directly from your bank account. Reliable and preferred for larger transactions.",
      icon: Landmark,
    },
    {
      title: "Credit Card",
      desc: "Instant payment via major credit card providers for a seamless checkout experience.",
      icon: CreditCard,
    },
    {
      title: "Card Hold + Bank Transfer",
      desc: "Secure your booking with a credit card hold, then complete payment via bank transfer.",
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Container Box */}
      <div className="bg-[#F8FAFC] dark:bg-[#152033] rounded-[28px] p-8 sm:p-10 border border-slate-100 dark:border-gray-800 shadow-2xs">
        
        {/* Section Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
            How to Pay
          </h2>
          <p className="text-[13.5px] text-slate-500 dark:text-gray-400 font-medium mt-1.5">
            Choose the payment method that suits your preference. All transactions are secure and transparent.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-[#0E1726] rounded-[20px] p-6 border border-slate-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-800 text-[#0B1F3A] dark:text-[#40DACD] flex items-center justify-center mb-4 border border-slate-200/60 dark:border-gray-700">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-[12.5px] text-slate-500 dark:text-gray-400 font-normal leading-relaxed">
                    {method.desc}
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
