import React from 'react';
import { Plus } from 'lucide-react';

export const FixedPriceFAQ = () => {
  const faqs = [
    "What does \"fixed price\" mean for these routes?",
    "How do I choose the right aircraft category?",
    "Can I choose a specific aircraft model?",
    "Are prices shown one-way or round-trip?",
    "What if my route isn't listed?"
  ];

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0F172A]/50 py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col items-center">
        <h2 className="text-[32px] md:text-[38px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] mb-12 text-center">
          FAQs About Popular Fixed-Price Private Jet Routes
        </h2>
        
        <div className="w-full bg-white dark:bg-[#152033] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm px-8 md:px-12 py-4">
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className={`py-6 flex items-center justify-between cursor-pointer group ${i !== faqs.length - 1 ? 'border-b border-gray-100 dark:border-gray-800/60' : ''}`}>
                <span className="text-[#0B1F3A] dark:text-gray-100 font-medium text-[16px] group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{faq}</span>
                <Plus size={20} className="text-gray-400 group-hover:text-[#0B1F3A] dark:group-hover:text-white transition-colors" strokeWidth={2.5} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
