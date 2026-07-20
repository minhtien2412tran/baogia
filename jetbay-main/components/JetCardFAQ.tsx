'use client';
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'Do my Jet Card hours expire?',
    a: 'No, Jetbay Jet Card hours never expire as long as your account remains active. You can use them at your own pace.'
  },
  {
    q: 'Are there any blackout dates?',
    a: 'We offer zero blackout dates for all Jet Card members. While we require 24-48 hours notice during peak periods to guarantee availability, you will never be restricted from flying.'
  },
  {
    q: 'Can I use multiple aircraft on the same day?',
    a: 'Yes, Jet Card members can request multiple aircraft on the same day, subject to availability. This is perfect for coordinating travel for different groups.'
  },
  {
    q: 'Is catering included in my hourly rate?',
    a: 'Standard premium catering and beverages are included in your hourly rate. Special requests or extensive catering may incur additional charges.'
  }
];

export const JetCardFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="w-full bg-[#070B14] py-24 border-t border-white/5">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border border-white/5 rounded-2xl overflow-hidden transition-colors ${open === idx ? 'bg-[#111827]' : 'bg-transparent hover:bg-[#111827]/50'}`}
            >
              <button 
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="text-[16px] font-bold text-white pr-8">{faq.q}</span>
                <span className="text-white/50 shrink-0">
                  {open === idx ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${open === idx ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-[14px] text-white/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
