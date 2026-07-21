'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaneTakeoff, PlaneLanding, Calendar, Minus, Plus, ArrowRightLeft, Send } from 'lucide-react';

export const CorporateCharterHero = () => {
  const [passengerCount, setPassengerCount] = useState(2);
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');

  const incrementPassengers = () => setPassengerCount(prev => prev + 1);
  const decrementPassengers = () => setPassengerCount(prev => Math.max(1, prev - 1));

  return (
    <div id="corporatecharter-hero-section" className="px-4 lg:px-8 pt-4 lg:pt-6 mb-24 w-full flex flex-col items-center">
      <section id="hero-banner-inner" className="relative w-full h-[350px] lg:h-[460px] flex flex-col items-center justify-center rounded-[24px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920&auto=format&fit=crop" 
            alt="Business Jet in flight" 
            fill 
            className="object-cover object-[center_40%]"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-transparent"></div>
        
        <div className="relative z-10 text-left px-8 w-full max-w-[1440px] -mt-16 lg:-mt-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.15] flex items-center flex-wrap gap-2 md:gap-3 max-w-3xl">
            Global Corporate and Luxury Business Air Charter
            <div className="w-3.5 h-3.5 bg-[#D4A64A] shrink-0 mt-2"></div>
          </h1>
        </div>
      </section>

      {/* Search Form - Overlaps Hero */}
      <div id="search-form-container" className="relative z-20 w-full max-w-[1440px] -mt-16 lg:-mt-24 bg-white dark:bg-[#152033] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 lg:p-8 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 transition-colors">
        <div className="flex items-center gap-6 mb-8 px-2">
          <button 
            onClick={() => setTripType('oneway')}
            className={`px-5 py-2 text-[14px] font-bold rounded-full border transition-all ${
              tripType === 'oneway' 
                ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD] border-[#40DACD]/15 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            One-way
          </button>
          <button 
            onClick={() => setTripType('roundtrip')}
            className={`px-5 py-2 text-[14px] font-bold rounded-full border transition-all ${
              tripType === 'roundtrip' 
                ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD] border-[#40DACD]/15 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Round-trip
          </button>
          <button 
            onClick={() => setTripType('multicity')}
            className={`px-5 py-2 text-[14px] font-bold rounded-full border transition-all ${
              tripType === 'multicity' 
                ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD] border-[#40DACD]/15 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Multi-city
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row items-end gap-3 lg:gap-4 mb-6 relative w-full">
          
          {/* From */}
          <div className="flex-[1.2] w-full">
            <span className="text-[13px] text-[#0B1F3A] dark:text-gray-300 font-bold block mb-2">From</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-white dark:bg-[#0E1726] hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <PlaneTakeoff className="text-gray-400 dark:text-gray-500" size={18} strokeWidth={2.5} />
              <input type="text" placeholder="From" defaultValue="Hanoi (HAN)" className="outline-none text-[14px] text-[#0B1F3A] dark:text-white bg-transparent w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-bold" />
            </div>
          </div>
          
          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center pb-3">
            <ArrowRightLeft size={16} className="text-[#13B2A6] dark:text-[#40DACD] cursor-pointer hover:scale-105 transition-transform" strokeWidth={2.5} />
          </div>
          
          {/* To */}
          <div className="flex-[1.2] w-full">
            <span className="text-[13px] text-[#0B1F3A] dark:text-gray-300 font-bold block mb-2">To</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-white dark:bg-[#0E1726] hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <PlaneLanding className="text-gray-400 dark:text-gray-500" size={18} strokeWidth={2.5} />
              <input type="text" placeholder="To" defaultValue="Singapore (SIN)" className="outline-none text-[14px] text-[#0B1F3A] dark:text-white bg-transparent w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-bold" />
            </div>
          </div>
          
          {/* Departure */}
          <div className="flex-1 w-full">
            <span className="text-[13px] text-[#0B1F3A] dark:text-gray-300 font-bold block mb-2">Departure (Local)</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-white dark:bg-[#0E1726] hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
              <Calendar className="text-gray-400 dark:text-gray-500" size={18} strokeWidth={2.5} />
              <div className="text-[14px] text-[#0B1F3A] dark:text-white font-bold whitespace-nowrap">
                21 / Jul / 2026
              </div>
            </div>
          </div>
          
          {/* Passengers */}
          <div className="flex-1 w-full">
            <span className="text-[13px] text-[#0B1F3A] dark:text-gray-300 font-bold block mb-2">Passengers</span>
            <div className="flex items-center justify-between w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-white dark:bg-[#0E1726]">
              <button 
                type="button"
                onClick={decrementPassengers}
                className="w-5 h-5 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1D2A3F] transition-colors"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span className="text-[14px] font-bold text-[#0B1F3A] dark:text-white">{passengerCount}</span>
              <button 
                type="button"
                onClick={incrementPassengers}
                className="w-5 h-5 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1D2A3F] transition-colors"
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
        
        <button className="w-full bg-[#40DACD] hover:bg-[#34C4B8] text-[#050505] font-bold py-4 rounded-xl transition-all text-[15px] shadow-sm flex items-center justify-center gap-2 transform active:scale-[0.99]">
          <Send size={18} />
          Search Available Aircraft
        </button>
      </div>
    </div>
  );
};
