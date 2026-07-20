import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export const GroupCharterDescription = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Group Air Charter
        </h2>
      </div>

      <div className="flex flex-col md:flex-row bg-[#F8FAFC] dark:bg-[#152033] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="w-full md:w-[40%] h-[200px] md:h-auto relative">
          <Image 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop" 
            alt="Group at sunset" 
            fill 
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-center">
          <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            A group air charter offers the exclusive use of a private aircraft for your travel needs. This means you dictate the schedule, choose your preferred departure and arrival airports, and enjoy a level o...
          </p>
          <div className="flex justify-center md:justify-start">
            <button className="flex items-center gap-1 text-[#2B60DF] dark:text-[#6B9CFF] font-medium text-[14px] hover:underline">
              View More <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
