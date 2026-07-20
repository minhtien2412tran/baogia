import React from 'react';

export const EmptyLegsBanner = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="w-full bg-[#F4F9F8] dark:bg-[#13B2A6]/5 rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center p-12 lg:p-20 text-center">
        
        {/* Geometric Background Shapes */}
        <div className="absolute right-0 bottom-0 opacity-40 dark:opacity-20 flex">
          <div className="w-24 h-24 bg-[#E6F7F6] dark:bg-[#13B2A6]/20"></div>
          <div className="w-24 h-24 bg-[#D1F0EE] dark:bg-[#13B2A6]/40 transform -translate-y-24"></div>
          <div className="w-24 h-24 bg-[#BDE9E6] dark:bg-[#13B2A6]/60"></div>
        </div>
        
        <div className="absolute left-0 top-0 opacity-40 dark:opacity-20 flex">
           <div className="w-16 h-16 bg-[#E6F7F6] dark:bg-[#13B2A6]/20"></div>
           <div className="w-16 h-16 bg-[#D1F0EE] dark:bg-[#13B2A6]/40 transform translate-y-16"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-2xl">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B1F3A] dark:text-white mb-4 tracking-[-0.02em]">
            When it matters most, you&apos;re not alone
          </h2>
          <p className="text-[16px] text-gray-600 dark:text-gray-300 mb-10">
            Speak with a charter specialist for immediate medical flight planning.
          </p>
          
          <button className="h-[48px] px-8 bg-[#40DACD] hover:bg-[#34C4B8] text-[#050505] font-bold text-[15px] rounded-lg transition-colors shadow-md">
            Contact our concierge
          </button>
        </div>

      </div>
    </div>
  );
};
