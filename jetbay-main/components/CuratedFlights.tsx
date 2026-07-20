import React from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Map, Umbrella } from 'lucide-react';

export const CuratedFlights = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      
      {/* Top Badge */}
      <div className="flex items-center justify-start mb-5">
        <div className="inline-flex items-center gap-2 bg-[#EAF6F6] border border-teal-100 dark:border-teal-800/30 dark:bg-teal-900/30 px-3.5 py-1.5 rounded-full">
          <Map size={16} className="text-[#0B1F3A] dark:text-white" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-[#0B1F3A] dark:text-white">Curated Flights</span>
        </div>
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="max-w-3xl">
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-2 tracking-[-0.02em] leading-[1.2]">
            Fly to the World&apos;s Most <span className="text-[#40DACD]">Exclusive</span> Destinations
          </h2>
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[15px]">
            Discover hand-picked global retreats with bespoke private jet access designed around your itinerary.
          </p>
        </div>
        
        {/* Nav Arrows */}
        <div className="flex items-center bg-[#F1F5F9] dark:bg-gray-800 rounded-full p-1 h-fit shrink-0">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all text-[#94A3B8]">
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all text-[#0B1F3A] dark:text-white">
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-[#E2E8F0] dark:border-gray-800">
        <div className="flex items-center gap-8 overflow-x-auto pb-3.5 no-scrollbar">
          <button className="text-[#13B2A6] dark:text-[#40DACD] font-semibold text-[14px] pb-3.5 border-b-[2px] border-[#40DACD] whitespace-nowrap relative top-[2px]">
            Island Escapes
          </button>
          <button className="text-[#0B1F3A] dark:text-gray-300 hover:text-gray-600 dark:hover:text-white font-medium text-[14px] pb-3.5 whitespace-nowrap transition-colors relative top-[2px]">
            Ski Escapes
          </button>
          <button className="text-[#0B1F3A] dark:text-gray-300 hover:text-gray-600 dark:hover:text-white font-medium text-[14px] pb-3.5 whitespace-nowrap transition-colors relative top-[2px]">
            Golf Escapes
          </button>
        </div>
        <button className="text-[#0B1F3A] dark:text-white font-bold text-[13px] flex items-center gap-1 hover:text-gray-600 transition-colors whitespace-nowrap mb-4 md:mb-0">
          View All Destinations <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 h-auto md:h-[480px]">
        {/* Intro Card */}
        <div className="relative rounded-[16px] overflow-hidden group shadow-sm flex flex-col bg-white dark:bg-[#152033] border border-[#E2E8F0] dark:border-gray-800 h-[480px]">
          <div className="absolute inset-0 z-0">
            <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop" alt="Beach" fill className="object-cover" />
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#1A263D]/95 backdrop-blur-md rounded-[12px] p-5 shadow-sm border border-white/20 z-10">
             <div className="mb-3 text-[#0B1F3A] dark:text-white">
               <Umbrella size={24} strokeWidth={2} className="text-[#0B1F3A] dark:text-white" />
             </div>
             <h3 className="text-[19px] font-bold text-[#0B1F3A] dark:text-white mb-2 tracking-tight leading-tight">Island Escapes</h3>
             <p className="text-[#64748B] dark:text-gray-400 text-[13px] leading-relaxed">
               Private jet access to leading island destinations for long weekends, resort stays, and seamless luxury leisure travel from the United States.
             </p>
          </div>
        </div>

        {/* Destination 2 */}
        <div className="relative rounded-[16px] overflow-hidden group shadow-sm flex flex-col bg-white dark:bg-[#152033] border border-[#E2E8F0] dark:border-gray-800 h-[480px] hover:shadow-md transition-all duration-300 cursor-pointer">
          <div className="relative w-full h-[55%] overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000&auto=format&fit=crop" alt="Nassau" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
               <div className="bg-black/35 backdrop-blur-md px-6 py-3 rounded-[6px] text-white font-bold tracking-[0.15em] text-[13px] border border-white/10">
                 NASSAU
               </div>
            </div>
          </div>
          
          <div className="flex-1 p-5 flex flex-col relative z-20 bg-white dark:bg-[#152033]">
             <div className="bg-[#FDF3E1] dark:bg-yellow-900/30 text-[#40DACD] text-[11px] font-bold px-3 py-1 rounded-full w-max mb-3 tracking-wide">Island</div>
             <div className="text-[#64748B] text-[12px] mb-1 truncate">Nassau, The Bahamas</div>
             <h4 className="text-[19px] font-bold text-[#0B1F3A] dark:text-white mb-auto leading-tight">Bahamas Classic</h4>
             
             <div className="text-right mt-4">
               <span className="text-[#40DACD] font-bold text-[14px] group-hover:opacity-80 transition-opacity">Explore Destination</span>
             </div>
          </div>
        </div>

        {/* Destination 3 */}
        <div className="relative rounded-[16px] overflow-hidden group shadow-sm flex flex-col bg-white dark:bg-[#152033] border border-[#E2E8F0] dark:border-gray-800 h-[480px] hover:shadow-md transition-all duration-300 cursor-pointer">
          <div className="relative w-full h-[55%] overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop" alt="Providenciales" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
               <div className="bg-black/35 backdrop-blur-md px-6 py-3 rounded-[6px] text-white font-bold tracking-[0.15em] text-[13px] border border-white/10">
                 PROVIDENCIALES
               </div>
            </div>
          </div>
          
          <div className="flex-1 p-5 flex flex-col relative z-20 bg-white dark:bg-[#152033]">
             <div className="bg-[#FDF3E1] dark:bg-yellow-900/30 text-[#40DACD] text-[11px] font-bold px-3 py-1 rounded-full w-max mb-3 tracking-wide">Island</div>
             <div className="text-[#64748B] text-[12px] mb-1 truncate">Providenciales, Turks and Caicos Islands</div>
             <h4 className="text-[19px] font-bold text-[#0B1F3A] dark:text-white mb-auto leading-tight">Resort Island Escape</h4>
             
             <div className="text-right mt-4">
               <span className="text-[#40DACD] font-bold text-[14px] group-hover:opacity-80 transition-opacity">Explore Destination</span>
             </div>
          </div>
        </div>

        {/* Destination 4 */}
        <div className="relative rounded-[16px] overflow-hidden group shadow-sm flex flex-col bg-white dark:bg-[#152033] border border-[#E2E8F0] dark:border-gray-800 h-[480px] hover:shadow-md transition-all duration-300 cursor-pointer">
          <div className="relative w-full h-[55%] overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1588733103629-b77afe0425ce?q=80&w=1000&auto=format&fit=crop" alt="St. Barts" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
               <div className="bg-black/35 backdrop-blur-md px-6 py-3 rounded-[6px] text-white font-bold tracking-[0.15em] text-[13px] border border-white/10">
                 ST. BARTS
               </div>
            </div>
          </div>
          
          <div className="flex-1 p-5 flex flex-col relative z-20 bg-white dark:bg-[#152033]">
             <div className="bg-[#FDF3E1] dark:bg-yellow-900/30 text-[#40DACD] text-[11px] font-bold px-3 py-1 rounded-full w-max mb-3 tracking-wide">Island</div>
             <div className="text-[#64748B] text-[12px] mb-1 truncate">St. Barts, Saint Barthelemy</div>
             <h4 className="text-[19px] font-bold text-[#0B1F3A] dark:text-white mb-auto leading-tight">Iconic Boutique Island</h4>
             
             <div className="text-right mt-4">
               <span className="text-[#40DACD] font-bold text-[14px] group-hover:opacity-80 transition-opacity">Explore Destination</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
