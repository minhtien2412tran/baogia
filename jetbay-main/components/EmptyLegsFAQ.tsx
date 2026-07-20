'use client';
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const EmptyLegsFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    "When is an empty leg flight a good travel option?",
    "What should I consider before booking an empty leg flight?",
    "How much can I save on an empty leg flight?",
    "Which destinations are available for empty leg flights?",
    "Do empty leg flights include catering and other amenities?",
    "How often are empty leg flights available?",
    "Is an empty leg flight suitable for group travel?"
  ];

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0B1121]/50 py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col items-center">
        
        <h2 className="text-[32px] md:text-[38px] font-bold text-[#0B1F3A] dark:text-white mb-16 text-center tracking-[-0.02em]">
          Frequently Asked Questions About Empty Leg Flights
        </h2>

        <div className="w-full bg-white dark:bg-[#152033] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm px-8 md:px-12 py-4">
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className={`py-6 flex items-center justify-between cursor-pointer group ${i !== faqs.length - 1 ? 'border-b border-gray-100 dark:border-gray-800/60' : ''}`} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <h3 className="text-[16px] font-medium text-[#0B1F3A] dark:text-white pr-8 group-hover:text-[#13B2A6] transition-colors">
                  {faq}
                </h3>
                <div className="text-gray-400 group-hover:text-[#13B2A6] transition-colors shrink-0">
                  {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
