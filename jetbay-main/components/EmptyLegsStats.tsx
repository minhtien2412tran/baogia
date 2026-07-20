import React from 'react';
import { ArrowUpRight, BarChart2, ArrowRight } from 'lucide-react';

export const EmptyLegsStats = () => {
  return (
    <div className="w-full bg-white dark:bg-[#0B1121] py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
          <h2 className="text-[36px] md:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] leading-[1.2] max-w-[600px]">
            A leading global private jet charter platform <ArrowUpRight size={32} className="inline-block -mt-1" />
          </h2>
          <div className="px-6 py-3 bg-[#E6F7F6] dark:bg-[#13B2A6]/10 rounded-[24px] border border-[#13B2A6]/20">
            <span className="text-[13px] font-bold text-[#13B2A6] block leading-[1.4]">Trusted<br/>Worldwide</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#152033] rounded-[24px] p-8 border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="flex items-center gap-2 bg-[#1A2E35] text-white px-3 py-1.5 rounded-full w-fit mb-12">
              <BarChart2 size={14} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Volume</span>
            </div>
            
            <h3 className="text-[52px] font-bold text-[#0B1F3A] dark:text-white leading-none mb-4 tracking-tight">No.1</h3>
            <h4 className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-4">Asia&apos;s Transaction Volume</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed mt-auto">
              Jetbay leads private aviation transactions across Asia, connecting key business and leisure hubs with precision. A trusted platform for high-volume and time-critical flights.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#152033] rounded-[24px] p-8 border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
            <h3 className="text-[52px] font-bold text-[#13B2A6] leading-none mb-4 mt-8 tracking-tight">190+</h3>
            <h4 className="text-[15px] font-bold text-[#13B2A6] mb-4">Countries Flown</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Our global network spans over 190 countries, providing seamless access to major cities and remote destinations. Wherever you fly, Jetbay is already there.
            </p>
            <div className="mt-auto pt-8 flex items-center w-full">
              <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <ArrowRight size={14} className="text-gray-400 ml-2" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#152033] rounded-[24px] p-8 border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
            <h3 className="text-[52px] font-bold text-[#0B1F3A] dark:text-white leading-none mb-4 mt-8 tracking-tight">5K+</h3>
            <h4 className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-4">Annual Flights</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed mt-auto">
              Thousands of flights are managed through our platform every year, backed by experienced operators and rigorous safety standards. Operational excellence at a truly global scale.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#243447] rounded-[24px] p-8 shadow-lg flex flex-col relative overflow-hidden">
            
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-10 bg-white/5">
              <ArrowUpRight size={20} className="text-white" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-[48px] font-bold text-white leading-none mb-4 tracking-tight">10K+</h3>
            <h4 className="text-[15px] font-bold text-white mb-4">Clients Served Worldwide</h4>
            <p className="text-[13px] text-white/80 leading-relaxed mt-auto">
              From corporate leaders to private individuals, Jetbay supports thousands of clients with tailored aviation solutions. Every journey is handled with care, discretion, and reliability.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
