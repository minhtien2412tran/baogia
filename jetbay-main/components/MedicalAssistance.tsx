import React from 'react';
import Image from 'next/image';
import { BriefcaseMedical } from 'lucide-react';

export const MedicalAssistance = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column - Card */}
        <div className="flex-1 bg-white dark:bg-[#152033] rounded-[16px] p-8 lg:p-12 flex flex-col justify-center border border-[#E2E8F0] dark:border-gray-800 shadow-sm">
          
          <div className="inline-flex items-center gap-2 bg-[#E6F4F1] dark:bg-teal-900/30 text-[#0B1F3A] dark:text-white px-3.5 py-1.5 rounded-full text-[13.5px] font-semibold w-max mb-6">
            <BriefcaseMedical size={16} strokeWidth={2} className="text-[#0B1F3A] dark:text-white" />
            24/7 Emergency Support
          </div>
          
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-6 leading-[1.15] tracking-[-0.02em]">
            Jetbay SOS Global Medical Air<br className="hidden lg:block" /> Assistance
          </h2>
          
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[16.5px] leading-[1.6] mb-10 max-w-[480px]">
            24/7 rapid-response medical evacuation, combining world-class healthcare networks with uncompromising aviation safety.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-[#5EEAD4] hover:bg-[#45D6C0] text-[#0B1F3A] px-6 py-3 rounded-[6px] font-semibold text-[15px] transition-colors whitespace-nowrap">
              Request Jetbay SOS
            </button>
            <button className="border border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#E6F4F1] dark:hover:bg-teal-900/20 px-6 py-3 rounded-[6px] font-semibold text-[15px] transition-colors whitespace-nowrap">
              Learn About Jetbay SOS
            </button>
          </div>
          
        </div>
        
        {/* Right Column - Image */}
        <div className="flex-1 h-[400px] lg:h-auto min-h-[480px] relative rounded-[16px] overflow-hidden">
          <Image src="https://picsum.photos/seed/medical-helicopter/1000/1000" alt="Medical Air Assistance Helicopter" fill className="object-cover" />
        </div>
        
      </div>
    </div>
  );
};
