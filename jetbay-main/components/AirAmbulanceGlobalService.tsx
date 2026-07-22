'use client';

import React from 'react';
import { Clock, FileCheck, Globe } from 'lucide-react';

export const AirAmbulanceGlobalService = () => {
  const stats = [
    {
      icon: Clock,
      title: "Flight Experience",
      value: "4,000+ Hours Combined"
    },
    {
      icon: FileCheck,
      title: "Completed",
      value: "1,000+ Medical Missions"
    },
    {
      icon: Globe,
      title: "Fly to",
      value: "190+ Countries & Regions"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title block with gold left line */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
            Global Air Ambulance Service
          </h2>
        </div>
        <p className="text-[13.5px] md:text-[14px] text-gray-500 dark:text-gray-400 font-medium ml-4.5 mt-1">
          Choose Jetbay for efficient, worry-free critical care transfers, domestically and internationally
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full bg-[#EBF3FE] dark:bg-[#121E31] rounded-[28px] p-6 md:p-10 border border-blue-100/60 dark:border-gray-800 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        
        {/* Left Stats Column */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-[320px] shrink-0 z-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="flex-1 bg-[#4C88FF] text-white p-5 md:p-6 rounded-[20px] shadow-sm flex flex-col justify-between min-h-[110px]"
              >
                <div className="flex items-center gap-2 text-white/90 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon size={16} strokeWidth={2.5} className="text-white" />
                  </div>
                  <span className="text-[12px] md:text-[13px] font-semibold uppercase tracking-wider opacity-90">
                    {stat.title}
                  </span>
                </div>
                <div className="text-[18px] md:text-[20px] font-extrabold tracking-tight">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right World Map Graphic with Arc Connections */}
        <div className="flex-1 w-full relative min-h-[260px] md:min-h-[320px] flex items-center justify-center">
          
          {/* World Dotted Map Vector Representation */}
          <div className="relative w-full max-w-[700px] h-[260px] md:h-[300px] flex items-center justify-center">
            
            {/* SVG Flight Routes Map Overlay */}
            <svg viewBox="0 0 800 400" className="w-full h-full opacity-80" fill="none">
              {/* World Map Dotted Pattern Background */}
              <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" className="fill-blue-400/40 dark:fill-blue-300/30" />
              </pattern>
              <rect width="800" height="400" fill="url(#dotPattern)" />

              {/* Connected Flight Arcs */}
              <path d="M 200 220 Q 350 100 480 180" stroke="#0066FF" strokeWidth="2.5" strokeDasharray="6 4" />
              <path d="M 480 180 Q 580 120 680 240" stroke="#0066FF" strokeWidth="2.5" strokeDasharray="6 4" />
              <path d="M 200 220 Q 420 280 680 240" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />

              {/* Glowing Route Nodes */}
              <circle cx="200" cy="220" r="6" className="fill-[#0066FF] animate-ping opacity-75" />
              <circle cx="200" cy="220" r="5" className="fill-[#0066FF]" />

              <circle cx="480" cy="180" r="6" className="fill-[#0066FF] animate-ping opacity-75" />
              <circle cx="480" cy="180" r="5" className="fill-[#0066FF]" />

              <circle cx="680" cy="240" r="6" className="fill-[#0066FF] animate-ping opacity-75" />
              <circle cx="680" cy="240" r="5" className="fill-[#0066FF]" />
            </svg>

          </div>

        </div>

      </div>

    </div>
  );
};
