'use client';

import React from 'react';

export const AirAmbulancePartnerships = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-16 font-sans">
      
      {/* Title block with gold left line */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#D4A64A]"></div>
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
            Our Partnership &amp; Membership
          </h2>
        </div>
        <p className="text-[13px] md:text-[13.5px] text-gray-400 dark:text-gray-400 font-medium ml-4.5 mt-0.5">
          Experienced &amp; Professional
        </p>
      </div>

      {/* 5-Column Clean Logo Container with Vertical Dividers */}
      <div className="w-full bg-white dark:bg-[#152033] rounded-[16px] border border-slate-100 dark:border-gray-800 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-gray-800/80 items-center min-h-[90px]">
          
          {/* Logo 1: Beijing 999 */}
          <div className="flex items-center justify-center p-4 h-full hover:opacity-90 transition-opacity cursor-pointer">
            <div className="flex items-center gap-2">
              {/* Red Cross */}
              <div className="w-6 h-6 bg-red-600 rounded-2xs flex items-center justify-center shrink-0">
                <div className="w-4 h-1.5 bg-white absolute" />
                <div className="w-1.5 h-4 bg-white absolute" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black italic tracking-tighter text-slate-800 dark:text-white leading-none">
                  BEIJING
                </span>
                <span className="text-[15px] font-black italic text-emerald-600 leading-none tracking-tighter">
                  999
                </span>
              </div>
            </div>
          </div>

          {/* Logo 2: Red Dot Air Ambulance */}
          <div className="flex items-center justify-center p-4 h-full hover:opacity-90 transition-opacity cursor-pointer">
            <div className="flex items-center gap-2">
              {/* Red Circle Badge */}
              <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center shrink-0 shadow-2xs">
                <span className="text-white font-bold text-xs">+</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-extrabold text-[#B91C1C] dark:text-red-400 leading-tight">
                  Red Dot
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                  Air Ambulance
                </span>
              </div>
            </div>
          </div>

          {/* Logo 3: NBAA */}
          <div className="flex items-center justify-center p-4 h-full hover:opacity-90 transition-opacity cursor-pointer">
            <div className="flex items-center gap-2">
              {/* NBAA Ring Logo */}
              <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0 text-[#1E3A8A] dark:text-blue-400" fill="currentColor">
                <path d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm0 22c-5.52 0-10-4.48-10-10S10.48 6 16 6s10 4.48 10 10-4.48 10-10 10z" />
                <path d="M8 16c4 0 8-2 12-6 0 0-4 10-12 6z" fill="#0066FF" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#1E3A8A] dark:text-blue-300 leading-none tracking-tight">
                  NBAA
                </span>
                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-tight leading-tight">
                  NATIONAL BUSINESS AVIATION ASSOCIATION
                </span>
              </div>
            </div>
          </div>

          {/* Logo 4: AsBAA / EBAA */}
          <div className="flex items-center justify-center p-4 h-full hover:opacity-90 transition-opacity cursor-pointer">
            <div className="flex items-center gap-2">
              {/* Triangular Emblem */}
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 32 32" className="w-7 h-7 text-[#0F2942] dark:text-blue-300" fill="none">
                  <polygon points="16,4 28,26 4,26" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M16 8 L22 22 L10 22 Z" fill="#0066FF" opacity="0.6" />
                  <path d="M8 20 Q16 12 24 20" stroke="#0066FF" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-extrabold text-[#0B1F3A] dark:text-white leading-tight">
                  AsBAA
                </span>
                <span className="text-[7.5px] font-semibold text-slate-400 uppercase tracking-tight leading-tight">
                  Asian Business Aviation Association
                </span>
              </div>
            </div>
          </div>

          {/* Logo 5: Medical Air Service Worldwide */}
          <div className="flex items-center justify-center p-4 h-full hover:opacity-90 transition-opacity cursor-pointer">
            <div className="flex items-center gap-2">
              {/* Winged Caduceus Symbol */}
              <div className="w-7 h-7 flex items-center justify-center text-red-600 shrink-0">
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="currentColor">
                  <path d="M16 6 L18 10 L22 8 L20 12 L26 12 L22 16 L28 18 L20 20 L22 24 L18 22 L16 28 L14 22 L10 24 L12 20 L4 18 L10 16 L6 12 L12 12 L10 8 L14 10 Z" fill="#DC2626" opacity="0.8" />
                  <circle cx="16" cy="16" r="3" fill="#991B1B" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#991B1B] dark:text-red-400 leading-tight">
                  Medical Air Service
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  WORLDWIDE
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
