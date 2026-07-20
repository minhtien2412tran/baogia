import React from 'react';
import Image from 'next/image';
import { ArrowRightLeft, ChevronRight, ChevronDown, Send } from 'lucide-react';

const emptyLegsData = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/jet1/400/200',
    model: 'Pilatus PC-12',
    seats: '8 seats',
    date: 'Jul 31, 2026',
    fromCity: 'Glasgow City',
    fromCountry: 'United Kingdom (EGPF)',
    toCity: 'Dublin',
    toCountry: 'Ireland (EIWT)',
    price: '3,848',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/jet2/400/200',
    fromCity: 'Belfast',
    fromCountry: 'United Kingdom (EGAA)',
    toCity: 'London',
    toCountry: 'United Kingdom (EGKB)',
    price: '4,510',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/jet3/400/200',
    fromCity: 'Belfast',
    fromCountry: 'United Kingdom (EGAA)',
    toCity: 'London',
    toCountry: 'United Kingdom (EGKB)',
    price: '4,510',
  }
];

export const EmptyLegs = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-2 tracking-[-0.02em] leading-[1.15]">Empty Legs Near You</h2>
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[15px]">Last-minute private jet deals at reduced rates</p>
        </div>
        <button className="flex items-center gap-1 text-[14px] font-medium text-[#0B1F3A] dark:text-white hover:text-gray-600 transition-colors mb-2">
          View More <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {emptyLegsData.map((leg) => (
          <div key={leg.id} className="bg-white dark:bg-[#152033] rounded-[16px] border border-[#E2E8F0] dark:border-gray-800 flex flex-col overflow-hidden">
            <div className="relative w-full h-[240px] overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800">
              {/* Background gradient for the image area */}
              {leg.id === 1 ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#5c6068] via-[#e4e5e7] to-white z-0" />
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-10" />
                  <div className="absolute top-4 left-5 z-20 text-white">
                    <div className="font-bold text-[16px] mb-0.5 tracking-tight">Model: {leg.model}</div>
                    <div className="text-[14px] text-white/90 font-medium">{leg.seats} <span className="mx-1 opacity-70">|</span> {leg.date}</div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-white z-0" />
              )}
              
              <div className="relative z-20 w-full h-full p-4 pb-0 flex items-center justify-center">
                <Image src={leg.image} alt="Private Jet" fill className="object-contain p-2 scale-[1.1]" />
              </div>
            </div>
            
            <div className="p-5 px-6">
              <div className="flex items-center justify-between mb-8 relative">
                <div className="w-[42%]">
                  <div className="font-medium text-[#1E293B] dark:text-white text-[16px] mb-1 truncate">{leg.fromCity}</div>
                  <div className="text-[#94A3B8] text-[13px] truncate">{leg.fromCountry}</div>
                </div>
                
                <div className="w-7 h-7 rounded-full bg-[#ECFDF5] dark:bg-[#1A2E35] flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                  <ArrowRightLeft size={14} className="text-[#10B981]" />
                </div>
                
                <div className="w-[42%] text-right">
                  <div className="font-medium text-[#1E293B] dark:text-white text-[16px] mb-1 truncate">{leg.toCity}</div>
                  <div className="text-[#94A3B8] text-[13px] truncate">{leg.toCountry}</div>
                </div>
              </div>
              
              <div className="border-t border-[#F1F5F9] dark:border-gray-800 pt-5 flex items-center justify-between">
                <div>
                  <div className="text-[#F5B041] text-[13px] font-medium mb-0.5">From</div>
                  <div className="text-[#F5B041] font-bold text-[18px]">USD {leg.price}</div>
                </div>
                <button className="border border-[#CBD5E1] dark:border-gray-600 text-[#0B1F3A] dark:text-white text-[14px] font-medium px-5 py-2.5 rounded-[8px] hover:bg-gray-50 dark:hover:bg-[#1A263D] transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F8F9FA] dark:bg-[#152033] rounded-[16px] p-6 pb-8 flex flex-col transition-colors">
        <div className="flex items-center justify-between cursor-pointer w-full mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1A263D] flex items-center justify-center shadow-sm border border-[#F1F5F9]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#13B2A6] dark:text-[#40DACD]">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-[#0B1F3A] dark:text-white">Not seeing your route? Subscribe for matching empty legs</h3>
          </div>
          <button className="text-[#0B1F3A] dark:text-white p-1">
            <ChevronDown size={20} strokeWidth={2.5} className="rotate-180 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full">
            <div className="flex-1 w-full flex items-center bg-white dark:bg-[#1A263D] border border-[#E2E8F0] dark:border-gray-700 rounded-[10px] px-4 py-3.5">
              <span className="text-[#94A3B8] mr-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </span>
              <input type="text" placeholder="Departure city or airport" className="w-full bg-transparent outline-none text-[#0B1F3A] dark:text-white text-[14px]" />
            </div>
            
            <div className="text-[#13B2A6] dark:text-[#40DACD] rotate-90 md:rotate-0 px-2">
              <ArrowRightLeft size={16} strokeWidth={2.5} />
            </div>

            <div className="flex-1 w-full flex items-center bg-white dark:bg-[#1A263D] border border-[#E2E8F0] dark:border-gray-700 rounded-[10px] px-4 py-3.5">
              <span className="text-[#94A3B8] mr-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15" transform="rotate(180 12 8.5)"/></svg>
              </span>
              <input type="text" placeholder="Destination city or airport" className="w-full bg-transparent outline-none text-[#0B1F3A] dark:text-white text-[14px]" />
            </div>
            
            <button className="text-[#13B2A6] dark:text-[#40DACD] font-medium text-[15px] whitespace-nowrap hidden md:block ml-2 pl-3">
              + Add Preferred
            </button>
          </div>
          
          <div className="w-full border-t border-dashed border-[#CBD5E1] dark:border-gray-700 my-2"></div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full">
            <div className="flex-1 w-full flex items-center bg-[#F1F5F9] dark:bg-[#1A263D] rounded-[10px] px-4 py-3.5 border border-transparent">
              <input type="email" placeholder="Enter your email to receive alerts" className="w-full bg-transparent outline-none text-[#0B1F3A] dark:text-white text-[14px] placeholder:text-[#94A3B8]" />
            </div>
            <button className="w-full md:w-auto bg-[#40DACD] hover:bg-[#34C4B8] text-[#050505] font-semibold px-6 py-3.5 rounded-[10px] flex items-center justify-center gap-2 transition-colors text-[14px]">
              <Send size={16} strokeWidth={2.5} />
              Get Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
