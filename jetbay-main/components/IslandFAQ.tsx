import React from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  "Which island destinations are best for a long weekend?",
  "Why do some island trips route via a nearby gateway like St. Maarten (SXM)?",
  "Can private jets carry beach luggage and extra bags easily?",
  "How far in advance should we book peak-season island travel?"
];

export const IslandFAQ = () => {
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#111A2E] py-20 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-[32px] md:text-[36px] font-bold text-[#0B1F3A] dark:text-white mb-12 tracking-tight">
          FAQs About Private Jet Island Getaways
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-[#152033] rounded-[16px] p-6 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800"
            >
              <h4 className="text-[15px] font-semibold text-[#0B1F3A] dark:text-white text-left pr-8">
                {faq}
              </h4>
              <Plus className="text-gray-400 shrink-0" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
