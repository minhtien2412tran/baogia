import React from 'react';
import { ClipboardCheck, LayoutGrid, Sparkles, ChevronDown } from 'lucide-react';

export const FixedPriceInfoCards = () => {
  const cards = [
    {
      icon: <ClipboardCheck size={28} className="text-[#F5B041]" strokeWidth={2} />,
      iconBg: 'bg-orange-50 dark:bg-orange-500/10',
      title: 'How Fixed Price Booking Works',
      desc: 'Choose a route, select your aircraft category, and submit your trip details. Once payment or payment authorisation is re...'
    },
    {
      icon: <LayoutGrid size={28} className="text-[#13B2A6]" strokeWidth={2} />,
      iconBg: 'bg-[#E6F7F6] dark:bg-[#13B2A6]/10',
      title: 'Aircraft Categories at a Glance',
      desc: 'Fixed Price Routes are booked by category rather than a guaranteed aircraft model, giving you a clearer way to compare o...'
    },
    {
      icon: <Sparkles size={28} className="text-[#F5B041]" strokeWidth={2} />,
      iconBg: 'bg-orange-50 dark:bg-orange-500/10',
      title: 'Why We Curated These Routes',
      desc: 'We built these routes around common charter demand so pricing can be shown upfront by aircraft category, with a more str...'
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-[#152033] rounded-[24px] border border-gray-100 dark:border-gray-800 p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] flex flex-col">
            <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6`}>
              {card.icon}
            </div>
            <h3 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-3 leading-tight">{card.title}</h3>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-6 flex-1 leading-relaxed">{card.desc}</p>
            <button className="flex items-center gap-1.5 text-[14px] font-semibold text-[#13B2A6] hover:opacity-80 transition-opacity mt-auto w-fit">
              Show More <ChevronDown size={16} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
