import React from 'react';
import { ChevronRight, FileSearch, Headset, CreditCard, Car, Armchair } from 'lucide-react';

export const GroupCharterProcess = () => {
  const steps = [
    {
      icon: FileSearch,
      title: "Inquiry",
      desc: "Submit Your Request Online."
    },
    {
      icon: Headset,
      title: "Quotation",
      desc: "Receive Your Tailored Quotation."
    },
    {
      icon: CreditCard,
      title: "Contract & Payment",
      desc: "Endorse & Make Payment."
    },
    {
      icon: Car,
      title: "Trip Preparation",
      desc: "Personalised Flight Experience."
    },
    {
      icon: Armchair,
      title: "Enjoy Your Trip",
      desc: "Relax and Enjoy Your Journey."
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="bg-[#F8FAFC] dark:bg-[#152033] rounded-[24px] p-8 lg:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative border border-gray-100 dark:border-gray-800">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
              <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
                Group Charter Booking Process
              </h2>
            </div>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 pl-4 md:pl-5">
              Streamlined, effortless, and efficient.
            </p>
          </div>
          <button className="bg-[#5668D5] hover:bg-[#4657BA] text-white font-medium px-6 py-2.5 rounded-md text-[14px] transition-colors shadow-sm">
            View More
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 px-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
                {/* Organic blob background simulation */}
                <div className="absolute inset-0 bg-[#E6EDFF] dark:bg-[#1E293B] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] scale-90 group-hover:scale-100 transition-transform duration-500"></div>
                {/* Secondary accent blob */}
                <div className="absolute inset-2 bg-white/50 dark:bg-black/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] rotate-45"></div>
                <step.icon size={34} strokeWidth={1.5} className="relative z-10 text-[#5668D5] dark:text-[#818CF8]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[180px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        
        {/* Right Arrow Navigation (Mock) */}
        <div className="absolute -right-4 top-[65%] -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 bg-white dark:bg-[#1A263D] rounded-full shadow-md text-[#5668D5] z-10 cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100 dark:border-gray-700">
          <ChevronRight size={20} strokeWidth={2.5} />
        </div>

      </div>
    </div>
  );
};
