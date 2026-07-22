'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const AirAmbulanceMedicalEquipment = () => {
  const [selectedRole, setSelectedRole] = useState<number>(1); // Default selected: Doctors (index 1)

  const column1 = [
    "Emergency medical suction pump",
    "Mobile oxygen",
    "Intensive Care Unit",
    "Multi-channel intensive care ventilator",
    "Flight doctor and paramedic",
    "Twelve-channel Multifunction ECG"
  ];

  const column2 = [
    "External pacemaker",
    "Multifunction vacuum mattress",
    "Biphasic defibrillator",
    "Four infusion pumps",
    "Pulse oximetry",
    "3D Sonography"
  ];

  const crewRoles = [
    {
      title: "Pilots",
      desc: "Highly experienced captains with thousands of hours in emergency medical aviation.",
      icon: (
        <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
          <path d="M18 6C13.5 6 9 8.5 9 12V16C9 17.5 10 18.5 11.5 18.5H24.5C26 18.5 27 17.5 27 16V12C27 8.5 22.5 6 18 6Z" fill="#3B82F6" />
          <path d="M7 16H29V19C29 20.1 28.1 21 27 21H9C7.9 21 7 20.1 7 19V16Z" fill="#1D4ED8" />
          <circle cx="18" cy="13" r="2.5" fill="#F59E0B" />
          <path d="M12 24C12 22 14.5 21 18 21C21.5 21 24 22 24 24V28H12V24Z" fill="#1E3A8A" />
          <path d="M15 24L18 28L21 24" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: "Doctors",
      desc: "Specialist doctors with expertise in critical care and aeromedical transport.",
      icon: (
        <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
          <circle cx="18" cy="11" r="5" fill="#F59E0B" />
          <path d="M10 27C10 22.5 13.5 20 18 20C22.5 20 26 22.5 26 27V29H10V27Z" fill="#3B82F6" />
          <path d="M14 20C14 22.5 15.8 24.5 18 24.5C20.2 24.5 22 22.5 22 20" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="26" r="1.5" fill="#F59E0B" />
        </svg>
      )
    },
    {
      title: "Paramedics",
      desc: "Certified flight paramedics equipped for advanced life support and continuous care.",
      icon: (
        <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
          <circle cx="18" cy="11" r="5" fill="#F59E0B" />
          <path d="M10 27C10 22.5 13.5 20 18 20C22.5 20 26 22.5 26 27V29H10V27Z" fill="#3B82F6" />
          <path d="M18 22V26M16 24H20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: "Medical Equipment",
      desc: "State-of-the-art ICU equipment integrated directly into the aircraft cabin.",
      icon: (
        <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
          <rect x="7" y="8" width="22" height="16" rx="3" fill="#3B82F6" />
          <rect x="9" y="10" width="18" height="12" rx="1.5" fill="#EFF6FF" />
          <path d="M11 16H13.5L15 13L17.5 19L19.5 15L21 16H25" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 28H22M18 24V28" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: "Accompaniment",
      desc: "Comfortable seating and dedicated care for accompanying family members.",
      icon: (
        <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
          <circle cx="14" cy="11" r="4" fill="#3B82F6" />
          <path d="M7 27C7 23 10 20 14 20C18 20 21 23 21 27V28H7V27Z" fill="#2563EB" />
          <circle cx="23" cy="13" r="3.5" fill="#F59E0B" />
          <path d="M18 27C18 24 20 22 23 22C26 22 28 24 28 27V28H18V27Z" fill="#D97706" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-7 bg-[#D4A64A]"></div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Advanced Medical Equipment for Air Transport
        </h2>
      </div>

      {/* Main Gray Card Container */}
      <div className="bg-[#F4F6F9] dark:bg-[#152033] rounded-[24px] p-6 md:p-8 lg:p-10 border border-gray-100 dark:border-gray-800 shadow-sm relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Aircraft Layout Diagram & Speech Bubble */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[260px]">
            
            {/* Medevac Aircraft Top-View SVG Floorplan */}
            <div className="w-full max-w-[480px] bg-white dark:bg-[#0E1726] rounded-[20px] p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center min-h-[220px]">
              <svg viewBox="0 0 520 200" className="w-full h-auto drop-shadow-sm" fill="none">
                {/* Outer Aircraft Fuselage Hull */}
                <path 
                  d="M 60 100 C 60 50, 110 30, 180 30 L 420 30 C 470 30, 490 60, 500 100 C 490 140, 470 170, 420 170 L 180 170 C 110 170, 60 150, 60 100 Z" 
                  fill="#E2E8F0" 
                  stroke="#94A3B8" 
                  strokeWidth="3" 
                />

                {/* Windows top side */}
                <rect x="180" y="24" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="220" y="24" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="260" y="24" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="300" y="24" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="340" y="24" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="380" y="24" width="16" height="6" rx="3" fill="#3B82F6" />

                {/* Windows bottom side */}
                <rect x="180" y="170" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="220" y="170" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="260" y="170" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="300" y="170" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="340" y="170" width="16" height="6" rx="3" fill="#3B82F6" />
                <rect x="380" y="170" width="16" height="6" rx="3" fill="#3B82F6" />

                {/* Interior Cabin Floor Area */}
                <path 
                  d="M 90 100 C 90 65, 120 42, 180 42 L 410 42 C 450 42, 470 65, 480 100 C 470 135, 450 158, 410 158 L 180 158 C 120 158, 90 135, 90 100 Z" 
                  fill="#CBD5E1" 
                  stroke="#CBD5E1" 
                />

                {/* Cockpit Section Line */}
                <line x1="160" y1="42" x2="160" y2="158" stroke="#94A3B8" strokeWidth="2.5" />

                {/* Cockpit Seats (Left) */}
                <rect x="120" y="55" width="24" height="28" rx="5" fill="#1D4ED8" />
                <rect x="120" y="117" width="24" height="28" rx="5" fill="#1D4ED8" />

                {/* Cabin Wood Floor Center */}
                <rect x="165" y="46" width="280" height="108" rx="4" fill="#94A3B8" opacity="0.25" />

                {/* Executive Passenger Seats (4 Blue Seats facing center) */}
                {/* Top Row Seats */}
                <rect x="200" y="52" width="28" height="30" rx="6" fill="#1D4ED8" />
                <rect x="280" y="52" width="28" height="30" rx="6" fill="#1D4ED8" />
                {/* Bottom Row Seats */}
                <rect x="200" y="118" width="28" height="30" rx="6" fill="#1D4ED8" />
                <rect x="280" y="118" width="28" height="30" rx="6" fill="#1D4ED8" />

                {/* Central Stretcher Bed / ICU Bed */}
                <rect x="330" y="76" width="105" height="48" rx="6" fill="#64748B" />
                <rect x="334" y="80" width="97" height="40" rx="4" fill="#D97706" />
                {/* Mattress Straps */}
                <line x1="360" y1="80" x2="360" y2="120" stroke="#F59E0B" strokeWidth="3" />
                <line x1="390" y1="80" x2="390" y2="120" stroke="#F59E0B" strokeWidth="3" />
                {/* Pillow */}
                <rect x="338" y="86" width="16" height="28" rx="3" fill="#FEF3C7" />

                {/* Rear Cabinet / Medical Supply Module */}
                <rect x="442" y="52" width="30" height="96" rx="4" fill="#64748B" />
                <line x1="442" y1="100" x2="472" y2="100" stroke="#94A3B8" strokeWidth="2" />
              </svg>
            </div>

          </div>

          {/* Right Side: Description & Vertical Connected Checklist */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-[13.5px] md:text-[14px] font-medium text-slate-700 dark:text-gray-200 leading-relaxed">
              Jetbay caters to your individual needs with professional medical crews and specialised equipment tailored to the patient&apos;s health condition.
            </p>

            {/* Two Columns Checklist with Vertical Blue Dotted Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* Column 1 */}
              <div className="space-y-4">
                {column1.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Vertical Blue Dotted Line */}
                    {idx < column1.length - 1 && (
                      <div className="absolute left-[9px] top-[18px] w-[2px] h-[calc(100%+8px)] border-l-2 border-dotted border-[#3B82F6] z-0" />
                    )}
                    {/* Check Circle Icon */}
                    <div className="relative z-10 w-[20px] h-[20px] rounded-full bg-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {/* Item Text */}
                    <span className="text-[13px] font-medium text-slate-600 dark:text-gray-300 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                {column2.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Vertical Blue Dotted Line */}
                    {idx < column2.length - 1 && (
                      <div className="absolute left-[9px] top-[18px] w-[2px] h-[calc(100%+8px)] border-l-2 border-dotted border-[#3B82F6] z-0" />
                    )}
                    {/* Check Circle Icon */}
                    <div className="relative z-10 w-[20px] h-[20px] rounded-full bg-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {/* Item Text */}
                    <span className="text-[13px] font-medium text-slate-600 dark:text-gray-300 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Speech Bubble Tooltip positioned right above the bottom roles */}
      <div className="relative mt-6 mb-8 flex justify-center">
        {/* Dynamic Tooltip speech bubble based on selected role */}
        <div className="relative bg-white dark:bg-[#152033] border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[280px] sm:max-w-[320px] text-center transition-all duration-300">
          <p className="text-[12.5px] sm:text-[13px] font-medium text-slate-700 dark:text-gray-200 leading-snug">
            {crewRoles[selectedRole].desc}
          </p>
          {/* Downward Pointer Caret */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-[#152033] filter drop-shadow-xs"></div>
        </div>
      </div>

      {/* Bottom Row: 5 Crew & Service Role Icon Circles */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-[1000px] mx-auto">
        {crewRoles.map((role, idx) => {
          const isSelected = selectedRole === idx;
          return (
            <button 
              key={idx} 
              onClick={() => setSelectedRole(idx)}
              className="flex flex-col items-center justify-center group focus:outline-none cursor-pointer"
            >
              {/* Soft Circle Icon Wrapper */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 mb-2.5 ${
                isSelected 
                  ? 'bg-white dark:bg-[#152033] shadow-[0_8px_24px_rgba(59,130,246,0.18)] border-2 border-[#3B82F6] scale-105' 
                  : 'bg-white/80 dark:bg-[#152033]/80 hover:bg-white shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md'
              }`}>
                {role.icon}
              </div>
              <span className={`text-[12px] sm:text-[13.5px] font-bold text-center transition-colors ${
                isSelected ? 'text-[#0B1F3A] dark:text-white' : 'text-slate-600 dark:text-gray-400 group-hover:text-[#0B1F3A]'
              }`}>
                {role.title}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
