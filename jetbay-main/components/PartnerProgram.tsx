import React from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';

export const PartnerProgram = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      <div className="bg-white border border-[#EAEAEA] rounded-[32px] p-3 lg:p-4 flex flex-col lg:flex-row shadow-[0_2px_15px_rgba(0,0,0,0.03)] items-stretch">
        
        {/* Left Image */}
        <div className="w-full lg:w-[45%] relative min-h-[350px] lg:min-h-[460px] rounded-[24px] overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Mountains" 
            fill 
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-[55%] p-6 lg:p-12 xl:p-16 flex flex-col justify-center">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#F5F7FA] border border-[#E9EDF2] text-[#0B1F3A] px-4 py-1.5 rounded-full text-[13px] font-medium w-max mb-8">
            <Users size={15} strokeWidth={1.5} />
            Program Partner
          </div>
          
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] mb-5 leading-[1.15] tracking-[-0.02em]">
            Join the Jetbay Global Partner<br />
            Program
          </h2>
          
          <p className="text-[16.5px] text-[#4A4A4A] mb-8 leading-relaxed">
            Join our Global Partner Program. Refer clients, choose your preferred partnership program, and leverage our global fleet with comprehensive support with no prior aviation experience required.
          </p>
          
          <div className="flex flex-col items-start gap-5">
            <button className="bg-[#40DACD] hover:bg-[#34C4B8] text-[#050505] px-7 py-3 rounded-[8px] font-bold text-[14.5px] transition-colors w-max shadow-sm">
              Become a Partner
            </button>
            <a href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:text-[#34C4B8] text-[14.5px] font-medium underline underline-offset-[4px] decoration-[#13B2A6]/40 hover:decoration-[#13B2A6] transition-colors">
              Explore More about Jetbay Partner Program
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
};
