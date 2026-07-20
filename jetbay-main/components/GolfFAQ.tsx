import React from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: "Which U.S. golf destinations are best for a weekend trip?",
  },
  {
    question: "What's the most golf-focused fly-in destination in the U.S.?",
  },
  {
    question: "Which airport should I use for Pinehurst?",
  },
  {
    question: "Can we fly with golf clubs and extra luggage on a private jet?",
  },
  {
    question: "How far in advance should we book a peak-season golf charter?",
  }
];

export const GolfFAQ = () => {
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#111A2E] py-20 lg:py-24 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8">
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white text-center mb-12 tracking-tight">
          FAQs About Private Jet Golf Getaways
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="bg-white dark:bg-[#152033] rounded-[16px] p-6 flex items-center justify-between cursor-pointer border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <span className="text-[15px] font-semibold text-[#0B1F3A] dark:text-gray-200 pr-8">
                {faq.question}
              </span>
              <Plus className="text-gray-400 shrink-0" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
