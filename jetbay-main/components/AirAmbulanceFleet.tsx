'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Gauge, Navigation } from 'lucide-react';

export const AirAmbulanceFleet = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const aircrafts = [
    {
      name: "Gulfstream G100",
      speed: "Cruising Speed: 740km/h",
      range: "Maximum Range: 4,661km",
      featured: true,
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600"
    },
    {
      name: "Gulfstream G150",
      speed: "Cruising Speed: 850km/h",
      range: "Maximum Range: 5,556km",
      featured: true,
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600"
    },
    {
      name: "Gulfstream G550",
      speed: "Cruising Speed: 850km/h",
      range: "Maximum Range: 11,528km",
      featured: false,
      img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=600"
    },
    {
      name: "Citation XLS",
      speed: "Cruising Speed: 724km/h",
      range: "Maximum Range: 3,880km",
      featured: false,
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600"
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
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans relative">
      
      {/* Title block with gold left line */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
            Our Medevac Aircraft Fleet
          </h2>
        </div>
        <p className="text-[13.5px] md:text-[14px] text-gray-500 dark:text-gray-400 font-medium ml-4.5 mt-1">
          Flight available 24/7
        </p>
      </div>

      {/* Fleet Slider Wrapper */}
      <div className="relative w-full">
        
        {/* Left Floating Arrow */}
        {showLeftBtn && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-[-20px] top-[45%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Right Floating Arrow */}
        {showRightBtn && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-[-20px] top-[45%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {aircrafts.map((ac, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-[#152033] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Aircraft Image */}
              <div className="relative h-[180px] w-full shrink-0 overflow-hidden">
                <Image 
                  src={ac.img} 
                  alt={ac.name} 
                  fill 
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Featured Badge */}
                {ac.featured && (
                  <div className="absolute top-3 left-3 bg-[#D4A64A] text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm uppercase tracking-wider">
                    <span className="text-[12px]">🔥</span> Featured
                  </div>
                )}
              </div>

              {/* Bottom Specs Info */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <h3 className="text-[17px] font-extrabold text-[#0B1F3A] dark:text-white mb-3 tracking-tight">
                  {ac.name}
                </h3>

                <div className="space-y-2 text-[12.5px] text-gray-500 dark:text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Gauge size={15} className="text-gray-400" />
                    <span>{ac.speed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation size={15} className="text-gray-400" />
                    <span>{ac.range}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
