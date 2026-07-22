'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, ArrowRightLeft, Search, Plane } from 'lucide-react';

export const HowToBookHero = () => {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip' | 'multi-city'>('one-way');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-07-22');
  const [passengers, setPassengers] = useState(2);

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pt-4 pb-12 font-sans">
      
      {/* Hero Banner Container */}
      <div className="relative w-full rounded-[28px] overflow-hidden bg-[#1A1615] min-h-[440px] md:min-h-[480px] flex flex-col justify-between p-6 md:p-10 lg:p-12 shadow-sm border border-stone-800">
        
        {/* Background Image - High-end Warm Hotel Reception / Executive Lounge */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Image 
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600" 
            alt="Luxury lounge backdrop" 
            fill 
            className="object-cover object-center"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        </div>

        {/* Hero Title Header */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-2 md:pt-4">
          <h1 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-extrabold text-white drop-shadow-md tracking-tight flex items-center justify-center gap-2">
            <span>How to Charter a Flight</span>
            <span className="w-3.5 h-3.5 bg-[#D4A64A] inline-block rounded-xs shadow-sm"></span>
          </h1>
        </div>

        {/* Flight Search Widget */}
        <div className="relative z-10 max-w-5xl mx-auto w-full bg-white/95 dark:bg-[#152033]/95 backdrop-blur-md rounded-[24px] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-white/40 dark:border-gray-800 mt-8">
          
          {/* Trip Type Tabs */}
          <div className="flex items-center gap-6 mb-4 text-[13.5px] font-bold text-gray-600 dark:text-gray-300">
            <button 
              onClick={() => setTripType('one-way')}
              className={`pb-1 cursor-pointer transition-colors ${tripType === 'one-way' ? 'text-[#13B2A6] dark:text-[#40DACD] border-b-2 border-[#13B2A6]' : 'hover:text-gray-900'}`}
            >
              One-way
            </button>
            <button 
              onClick={() => setTripType('round-trip')}
              className={`pb-1 cursor-pointer transition-colors ${tripType === 'round-trip' ? 'text-[#13B2A6] dark:text-[#40DACD] border-b-2 border-[#13B2A6]' : 'hover:text-gray-900'}`}
            >
              Round-trip
            </button>
            <button 
              onClick={() => setTripType('multi-city')}
              className={`pb-1 cursor-pointer transition-colors ${tripType === 'multi-city' ? 'text-[#13B2A6] dark:text-[#40DACD] border-b-2 border-[#13B2A6]' : 'hover:text-gray-900'}`}
            >
              Multi-city
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* From Input */}
            <div className="lg:col-span-3 relative bg-gray-50/80 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex flex-col justify-center transition-all focus-within:border-[#13B2A6] focus-within:bg-white">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">From</label>
              <div className="flex items-center gap-2 mt-0.5">
                <Plane size={16} className="text-gray-400 rotate-45 shrink-0" />
                <input 
                  type="text" 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="From" 
                  className="w-full bg-transparent text-[14px] font-semibold text-[#0B1F3A] dark:text-white outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Swap Button (Desktop) */}
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <button 
                onClick={swapLocations}
                type="button"
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-transform active:scale-95 cursor-pointer"
                title="Swap departure and destination"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* To Input */}
            <div className="lg:col-span-3 relative bg-gray-50/80 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex flex-col justify-center transition-all focus-within:border-[#13B2A6] focus-within:bg-white">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">To</label>
              <div className="flex items-center gap-2 mt-0.5">
                <Plane size={16} className="text-gray-400 -rotate-45 shrink-0" />
                <input 
                  type="text" 
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="To" 
                  className="w-full bg-transparent text-[14px] font-semibold text-[#0B1F3A] dark:text-white outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Departure (Local) Date */}
            <div className="lg:col-span-3 relative bg-gray-50/80 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex flex-col justify-center transition-all focus-within:border-[#13B2A6] focus-within:bg-white">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Departure (Local)</label>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <input 
                  type="date" 
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent text-[14px] font-semibold text-[#0B1F3A] dark:text-white outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Passengers Stepper */}
            <div className="lg:col-span-2 relative bg-gray-50/80 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 flex flex-col justify-center">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">Passengers</label>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <button 
                  type="button" 
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm shadow-xs hover:bg-gray-100 flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  -
                </button>
                <span className="text-[14px] font-bold text-[#0B1F3A] dark:text-white px-2">
                  {passengers}
                </span>
                <button 
                  type="button" 
                  onClick={() => setPassengers(passengers + 1)}
                  className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm shadow-xs hover:bg-gray-100 flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Search Button */}
          <div className="mt-4">
            <button className="w-full bg-[#13B2A6] hover:bg-[#0E978D] text-white py-3.5 px-6 rounded-xl font-bold text-[15px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]">
              <Search size={18} strokeWidth={2.5} />
              <span>Search Available Aircraft</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
