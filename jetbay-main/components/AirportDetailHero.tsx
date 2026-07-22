'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, ArrowRightLeft, Search, Plane } from 'lucide-react';
import { Airport } from '@/lib/airportsData';

interface Props {
  airport: Airport;
}

export const AirportDetailHero = ({ airport }: Props) => {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip' | 'multi-city'>('one-way');
  const [fromLocation, setFromLocation] = useState(`${airport.name} (${airport.code})`);
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-07-22');
  const [passengers, setPassengers] = useState(2);

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  return (
    <div className="w-full relative font-sans">
      
      {/* Background Hero Banner Container - Full Bleed */}
      <div className="relative w-full h-[480px] md:h-[560px] flex flex-col overflow-hidden bg-[#1A1615]">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={airport.heroImage} 
            alt={airport.title} 
            fill 
            className="object-cover object-center"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        {/* Hero Title Header */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 lg:px-8 pt-20 md:pt-32 text-center">
          <h1 className="text-[32px] sm:text-[40px] md:text-[50px] font-extrabold text-white drop-shadow-md tracking-tight leading-tight max-w-4xl mx-auto">
            {airport.title}
          </h1>
        </div>
      </div>

      {/* Flight Search Widget - Overlapping the hero bottom */}
      <div className="relative z-20 max-w-[1100px] mx-auto px-4 lg:px-8 -mt-24 sm:-mt-32 mb-10">
        <div className="w-full bg-white dark:bg-[#152033] rounded-[16px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800">
          
          {/* Trip Type Tabs */}
          <div className="flex items-center gap-6 mb-5 text-[13.5px] font-bold text-gray-600 dark:text-gray-300">
            <button 
              onClick={() => setTripType('one-way')}
              className={`pb-1.5 cursor-pointer transition-colors ${tripType === 'one-way' ? 'text-[#13B2A6] dark:text-[#40DACD] border-b-2 border-[#13B2A6]' : 'hover:text-gray-900 dark:hover:text-white'}`}
            >
              One-way
            </button>
            <button 
              onClick={() => setTripType('round-trip')}
              className={`pb-1.5 cursor-pointer transition-colors ${tripType === 'round-trip' ? 'text-[#13B2A6] dark:text-[#40DACD] border-b-2 border-[#13B2A6]' : 'hover:text-gray-900 dark:hover:text-white'}`}
            >
              Round-trip
            </button>
            <button 
              onClick={() => setTripType('multi-city')}
              className={`pb-1.5 cursor-pointer transition-colors ${tripType === 'multi-city' ? 'text-[#13B2A6] dark:text-[#40DACD] border-b-2 border-[#13B2A6]' : 'hover:text-gray-900 dark:hover:text-white'}`}
            >
              Multi-city
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* From Input */}
            <div className="lg:col-span-3 relative bg-gray-50 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 flex flex-col justify-center transition-all focus-within:border-[#13B2A6]">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">From</label>
              <div className="flex items-center gap-2 mt-0.5">
                <Plane size={14} className="text-[#13B2A6] rotate-45 shrink-0" />
                <input 
                  type="text" 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="From" 
                  className="w-full bg-transparent text-[13px] font-semibold text-[#0B1F3A] dark:text-white outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <button 
                onClick={swapLocations}
                type="button"
                className="w-7 h-7 rounded bg-white dark:bg-gray-800 flex items-center justify-center text-[#13B2A6] shadow-xs border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <ArrowRightLeft size={14} />
              </button>
            </div>

            {/* To Input */}
            <div className="lg:col-span-3 relative bg-gray-50 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 flex flex-col justify-center transition-all focus-within:border-[#13B2A6]">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">To</label>
              <div className="flex items-center gap-2 mt-0.5">
                <Plane size={14} className="text-gray-400 -rotate-45 shrink-0" />
                <input 
                  type="text" 
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="To" 
                  className="w-full bg-transparent text-[13px] font-semibold text-[#0B1F3A] dark:text-white outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Departure (Local) Date */}
            <div className="lg:col-span-3 relative bg-gray-50 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 flex flex-col justify-center transition-all focus-within:border-[#13B2A6]">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departure (Local)</label>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <input 
                  type="date" 
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent text-[13px] font-semibold text-[#0B1F3A] dark:text-white outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Passengers Stepper */}
            <div className="lg:col-span-2 relative bg-gray-50 dark:bg-[#0E1726] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 flex flex-col justify-center">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Passengers</label>
              <div className="flex items-center justify-between mt-0.5">
                <button 
                  type="button" 
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  -
                </button>
                <span className="text-[13px] font-semibold text-[#0B1F3A] dark:text-white">
                  {passengers}
                </span>
                <button 
                  type="button" 
                  onClick={() => setPassengers(passengers + 1)}
                  className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Search Button */}
          <div className="mt-4">
            <button className="w-full bg-[#40DACD] hover:bg-[#13B2A6] text-white py-3 rounded-lg font-bold text-[14px] transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Plane size={16} className="rotate-45" />
              <span>Search Available Aircraft</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
