import React from 'react';
import { Plus } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    "What is the cost of air charter services?",
    "Are charter flights safe for travel?",
    "What is the maximum passenger capacity for a charter flight?",
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] mb-12 leading-[1.15]">Frequently Asked Questions About Our Private Jet Charter Services</h2>
      
      <div className="bg-[#F8FAFC] dark:bg-[#152033]/40 rounded-[32px] p-8 md:p-12 relative border border-gray-100/90 dark:border-gray-800 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.02)]">
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className={`py-6 flex items-center justify-between cursor-pointer group ${i !== faqs.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
              <span className="text-[#0B1F3A] dark:text-gray-100 font-semibold text-[16px] group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{faq}</span>
              <Plus size={20} className="text-[#0B1F3A] dark:text-gray-100" strokeWidth={2.5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

