import React from 'react';
import { Plane, ArrowUp, BarChart2 } from 'lucide-react';

export const Stats = () => {
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0B1120] pt-24 pb-12 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[100px] md:text-[140px] font-bold text-[#F1F5F9] dark:text-[#0B1F3A] -z-10 whitespace-nowrap overflow-hidden pointer-events-none tracking-tighter w-full text-center mix-blend-multiply dark:mix-blend-lighten">
            Jetbay
          </div>
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white leading-[1.1] tracking-[-0.02em] max-w-3xl">
            A leading global private<br/>jet charter platform
          </h2>
          
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1A263D] text-[#13B2A6] dark:text-[#40DACD] px-5 py-2.5 rounded-full text-[14px] font-bold border border-gray-100 dark:border-gray-800 shadow-sm whitespace-nowrap">
            Trusted Worldwide
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#13B2A6] dark:text-[#40DACD]"><path d="M5 12l5 5l10 -10"/></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 items-start relative z-10">
          
          {/* No.1 Volume */}
          <div className="flex flex-col">
            <div className="bg-[#2C6262] text-white px-3 py-1 text-[12px] font-bold rounded transform -rotate-3 w-max mb-6 flex items-center gap-1.5">
              <BarChart2 size={14} /> Volume
            </div>
            <h3 className="text-[48px] md:text-[56px] font-bold text-[#0B1F3A] dark:text-white leading-none mb-4">No.1</h3>
            <h4 className="text-[#0B1F3A] dark:text-white font-bold text-[18px] mb-3">Asia&apos;s Transaction Volume</h4>
            <p className="text-[#4A4A4A] dark:text-gray-400 text-[14px] leading-relaxed">
              JETBAY leads private aviation transactions across Asia, connecting key business and leisure hubs with precision. A trusted platform for high-volume and time-critical flights.
            </p>
          </div>

          {/* 190+ Countries */}
          <div className="flex flex-col">
            <h3 className="text-[#13B2A6] dark:text-[#40DACD] text-[48px] md:text-[56px] font-bold leading-none mb-4">190+</h3>
            <h4 className="text-[#0B1F3A] dark:text-white font-bold text-[18px] mb-3">Countries Flown</h4>
            <p className="text-[#4A4A4A] dark:text-gray-400 text-[14px] leading-relaxed mb-6">
              Our global network spans over 190 countries, providing seamless access to major cities and remote destinations. Wherever you fly, JETBAY is already there.
            </p>
            <div className="mt-auto relative w-full pt-4">
              <div className="w-full h-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="absolute top-[17px] left-0 -translate-y-1/2 text-[#13B2A6] dark:text-[#40DACD] bg-[#F8FAFC] dark:bg-[#0B1120] pr-2">
                <Plane size={24} className="transform rotate-45" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* 5K+ Annual Flights */}
          <div className="flex flex-col">
            <h3 className="text-[#0B1F3A] dark:text-white text-[48px] md:text-[56px] font-bold leading-none mb-4">5K+</h3>
            <h4 className="text-[#0B1F3A] dark:text-white font-bold text-[18px] mb-3">Annual Flights</h4>
            <p className="text-[#4A4A4A] dark:text-gray-400 text-[14px] leading-relaxed">
              Thousands of flights are managed through our platform every year, backed by experienced operators and rigorous safety standards. Operational excellence at a truly global scale.
            </p>
          </div>

          {/* 10K+ Clients */}
          <div className="rounded-[24px] bg-[#111827] p-8 shadow-md flex flex-col text-white relative overflow-hidden -mt-4">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-16">
              <ArrowUp size={24} strokeWidth={2} className="text-white" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-white text-[48px] md:text-[56px] font-bold leading-none mb-4">10K+</h3>
              <h4 className="text-[#13B2A6] dark:text-[#40DACD] font-bold text-[18px] mb-3">Clients Served Worldwide</h4>
              <p className="text-white/80 text-[14px] leading-relaxed">
                From corporate leaders to private individuals, JETBAY supports thousands of clients with tailored aviation solutions. Every journey is handled with care, discretion, and reliability.
              </p>
            </div>
            
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#40DACD] rounded-full blur-[100px] opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
