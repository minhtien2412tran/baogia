import React from 'react';
import Image from 'next/image';
import { ChevronRight, CreditCard } from 'lucide-react';

const SlantedShape = ({ className }: { className?: string }) => (
  <svg width="26" height="14" viewBox="0 0 26 14" fill="none" className={className}>
    <path d="M5 0h6l-5 14H0l5-14z" fill="currentColor" fillOpacity="0.5" />
    <path d="M15 0h8l-5 14h-8l5-14z" fill="currentColor" />
  </svg>
);

export const JetCard = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      <div className="relative rounded-[16px] overflow-hidden bg-[#050505] min-h-[480px] flex flex-col lg:flex-row shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
            <Image 
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1400&auto=format&fit=crop" 
                alt="Jet Card Background" 
                fill 
                className="object-cover opacity-[0.55]" 
                unoptimized
            />
        </div>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent w-[65%]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/20 to-transparent"></div>
        
        <div className="relative z-10 w-full lg:w-[35%] p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#1C150D]/60 border border-[#8C7454]/60 text-[#DAB059] px-3.5 py-1.5 rounded-full text-[12px] font-medium w-max mb-5">
            <CreditCard size={14} strokeWidth={1.5} />
            Jet Card
          </div>
          
          {/* Title */}
          <h2 className="text-[28px] md:text-[34px] lg:text-[36px] font-bold text-white mb-6 leading-[1.08] tracking-[-0.02em]">
            Elevate Your Travel<br />
            with The Jetbay Jet<br />
            Card
          </h2>
          
          {/* Button */}
          <button className="bg-[#E4B351] hover:bg-[#D1A649] text-[#000000] px-6 py-2.5 rounded-[4px] font-bold text-[14px] transition-colors w-max mb-5 shadow-sm">
            Apply for Jet Card
          </button>
          
          {/* Link */}
          <a href="#" className="text-white hover:text-gray-300 text-[12px] font-medium transition-colors underline underline-offset-[3px] decoration-white/70 hover:decoration-white w-max">
            More information about Jet Card
          </a>
        </div>
        
        <div className="relative z-10 w-full lg:w-[65%] p-8 lg:p-10 xl:p-12 flex items-center justify-end">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full">
            
            {/* 10 Hour Card */}
            <div className="bg-[#1A1A1C] rounded-[12px] p-5 lg:p-6 border border-white/[0.04] transition-all group flex flex-col shadow-2xl relative overflow-hidden h-[230px]">
              {/* Top Left subtle highlight */}
              <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none"></div>
              {/* Liquid Curve */}
              <div className="absolute bottom-0 right-0 w-[85%] h-[80%] bg-[#0A0A0A] rounded-tl-[130px] pointer-events-none"></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-4 mt-1">
                  <SlantedShape className="text-white opacity-95 w-[20px] h-[12px]" />
                </div>
                <h3 className="text-[#F5F2E9] font-bold text-[16px] lg:text-[17px] mb-4 tracking-tight">10 Hour Jet Card</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-[12px] lg:text-[12.5px] text-[#E8E2D2] leading-snug font-medium">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#E8E2D2] mt-1.5 shrink-0"></span>
                    <span>Occasional private flyers</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[12px] lg:text-[12.5px] text-[#E8E2D2] leading-snug font-medium">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#E8E2D2] mt-1.5 shrink-0"></span>
                    <span>Flexibility without long-term commitment</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-2 flex items-center gap-1.5 text-[#F5F2E9] text-[13px] font-bold transition-colors relative z-10 cursor-pointer group-hover:text-white">
                Unlock Now <ChevronRight size={14} strokeWidth={3} />
              </div>
            </div>
            
            {/* 25 Hour Card */}
            <div className="bg-[#1C1A16] rounded-[12px] p-5 lg:p-6 border border-white/[0.04] transition-all group flex flex-col shadow-2xl relative overflow-hidden h-[230px]">
              {/* Top Left subtle highlight */}
              <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-br from-[#E4B351]/[0.08] to-transparent pointer-events-none"></div>
              {/* Liquid Curve */}
              <div className="absolute bottom-0 right-0 w-[85%] h-[80%] bg-[#0C0B09] rounded-tl-[130px] pointer-events-none"></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-4 mt-1">
                  <SlantedShape className="text-[#E4B351] w-[20px] h-[12px]" />
                </div>
                <h3 className="text-[#F5F2E9] font-bold text-[16px] lg:text-[17px] mb-4 tracking-tight">25 Hour Jet Card</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-[12px] lg:text-[12.5px] text-[#E8E2D2] leading-snug font-medium">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#E8E2D2] mt-1.5 shrink-0"></span>
                    <span>Business travellers & executives</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[12px] lg:text-[12.5px] text-[#E8E2D2] leading-snug font-medium">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#E8E2D2] mt-1.5 shrink-0"></span>
                    <span>Lower hourly rates, priority booking</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-2 flex items-center gap-1.5 text-[#F5F2E9] text-[13px] font-bold transition-colors relative z-10 cursor-pointer group-hover:text-white">
                Unlock Now <ChevronRight size={14} strokeWidth={3} />
              </div>
            </div>
            
            {/* 50 Hour Card */}
            <div className="bg-[#181920] rounded-[12px] p-5 lg:p-6 border border-white/[0.04] transition-all group flex flex-col shadow-2xl relative overflow-hidden h-[230px]">
              {/* Starry Background */}
              <div className="absolute inset-0 opacity-[0.4] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #d0d0d0, rgba(0,0,0,0)), radial-gradient(1px 1px at 10px 100px, #c0c0c0, rgba(0,0,0,0))', backgroundSize: '120px 120px' }}></div>
              {/* Top Left subtle highlight */}
              <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-br from-[#A6BCED]/[0.08] to-transparent pointer-events-none"></div>
              {/* Liquid Curve */}
              <div className="absolute bottom-0 right-0 w-[85%] h-[80%] bg-[#0B0C10] rounded-tl-[130px] pointer-events-none"></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-4 mt-1">
                  <SlantedShape className="text-[#D8DFEE] w-[20px] h-[12px]" />
                </div>
                <h3 className="text-[#F5F2E9] font-bold text-[16px] lg:text-[17px] mb-4 tracking-tight">50 Hour Jet Card</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-[12px] lg:text-[12.5px] text-[#E8E2D2] leading-snug font-medium">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#E8E2D2] mt-1.5 shrink-0"></span>
                    <span>Frequent global travellers</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[12px] lg:text-[12.5px] text-[#E8E2D2] leading-snug font-medium">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#E8E2D2] mt-1.5 shrink-0"></span>
                    <span>Best value, ultimate convenience</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-2 flex items-center gap-1.5 text-[#F5F2E9] text-[13px] font-bold transition-colors relative z-10 cursor-pointer group-hover:text-white">
                Unlock Now <ChevronRight size={14} strokeWidth={3} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
