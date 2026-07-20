import React from 'react';
import { ChevronDown, FileCheck2, LayoutGrid } from 'lucide-react';

export const IslandInfo = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Block */}
        <div className="bg-white dark:bg-[#152033] rounded-[24px] p-8 border border-gray-100 dark:border-gray-800 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
          <div className="w-12 h-12 bg-[#Fef9c3] dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mb-6">
            <FileCheck2 className="text-yellow-600 dark:text-yellow-500" size={24} />
          </div>
          <h3 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white mb-3 tracking-tight">
            Why Fly Private for an Island Getaway?
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            Island travel is timing-sensitive—resort check-ins, weekend flight windows, and limited capacity during peak periods. Pri...
          </p>
          <button className="flex items-center gap-1.5 text-[14px] font-semibold text-[#40DACD] hover:text-[#35B5AA] transition-colors">
            Show More
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Right Block */}
        <div className="bg-white dark:bg-[#152033] rounded-[24px] p-8 border border-gray-100 dark:border-gray-800 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
          <div className="w-12 h-12 bg-[#E0F2FE] dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-6">
            <LayoutGrid className="text-sky-500 dark:text-sky-400" size={24} />
          </div>
          <h3 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white mb-3 tracking-tight">
            Planning Notes for Private Jet Island Travel
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            A few details can make island itineraries significantly smoother—especially for peak travel weeks...
          </p>
          <button className="flex items-center gap-1.5 text-[14px] font-semibold text-[#40DACD] hover:text-[#35B5AA] transition-colors">
            Show More
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
