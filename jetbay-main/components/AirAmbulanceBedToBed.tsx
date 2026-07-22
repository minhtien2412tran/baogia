'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const AirAmbulanceBedToBed = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const steps = [
    {
      step: "Step 1: Patient Pickup & Ground Transport",
      desc: "The air ambulance service begins with the patient being picked up by ground ambulance equipped with full ICU support.",
      img: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?q=80&w=800" // Ambulance / ground transport
    },
    {
      step: "Step 2: Airport Transfer & Departure",
      desc: "Upon arrival at the airport, the patient is promptly and securely transferred directly to the waiting medevac aircraft.",
      img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=800" // Medical team at jet
    },
    {
      step: "Step 3: Medevac Flight & In-Flight Care",
      desc: "Our state-of-the-art medevac aircraft, equipped with intensive care equipment, provides continuous medical monitoring during flight.",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800" // Inside medevac jet
    }
  ];

  const updateButtonVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 10);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateButtonVisibility);
      updateButtonVisibility();
      window.addEventListener('resize', updateButtonVisibility);
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateButtonVisibility);
      window.removeEventListener('resize', updateButtonVisibility);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title block with gold left line */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
            Bed-to-Bed Air Ambulance Service
          </h2>
        </div>
        <p className="text-[13.5px] md:text-[14px] text-gray-500 dark:text-gray-400 font-medium ml-4.5 mt-1">
          Prioritising Safety and Comfort Throughout the Journey
        </p>
      </div>

      {/* Slider Wrapper */}
      <div className="relative w-full">
        
        {/* Left Floating Button */}
        {showLeftBtn && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-[-20px] top-[50%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Right Floating Button */}
        {showRightBtn && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-[-20px] top-[50%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Grid / Horizontal Scroll */}
        <div 
          ref={scrollRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((item, idx) => (
            <div 
              key={idx}
              className="group relative h-[320px] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-end p-6"
            >
              {/* Background Image */}
              <Image 
                src={item.img} 
                alt={item.step} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/50 transition-all duration-500 z-10"></div>

              {/* Top Right "More ·" Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm z-20">
                <span>More</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] inline-block shadow-[0_0_8px_#3B82F6]"></span>
              </div>

              {/* Bottom Content Overlay */}
              <div className="relative z-20">
                {/* Step Pill Badge */}
                <div className="bg-[#0066FF] text-white text-[11px] sm:text-[12px] font-bold px-3.5 py-1 rounded-lg w-fit mb-3 shadow-sm uppercase tracking-wide">
                  {item.step}
                </div>
                <p className="text-white/90 text-[13px] md:text-[13.5px] leading-relaxed line-clamp-2 font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
