'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CorporateCharterBenefits = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const benefits = [
    {
      title: "Save Time with Flexible Departure Schedule",
      desc: "With corporate air charter, you dictate the schedule. Fly when you want, minimize layovers, and eliminate terminal delays.",
      img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600" // Close-up of wristwatch on wrist
    },
    {
      title: "Access Remote Location and Regional Airports",
      desc: "Expand your business reach with access to thousands of regional airports closer to your ultimate business destination.",
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600" // Jet nose front on tarmac
    },
    {
      title: "Boost Productivity with In-Flight Wi-Fi and Amenities",
      desc: "Transform your travel time into productive hours. Cabins are equipped with fast secure Wi-Fi, power outlets, and quiet spaces.",
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600" // Let's use a phone hand inside jet or similar cabin
    },
    {
      title: "Ensure Privacy for Confidential Business Discussions",
      desc: "Maintain the confidentiality of your sensitive documents, intellectual property, and key team discussions in a private cabin.",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600" // Executive on headphones working
    },
    {
      title: "Travel Comfortably Premium Seating and Fine Dining",
      desc: "Experience the epitome of luxury. Rest on fully reclining leather seats and enjoy tailored executive catering.",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600" // Passengers enjoying in-flight premium drinks
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
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans relative group/outer">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Benefits of Business Jet Charter
        </h2>
      </div>

      {/* Main Slider Wrapper */}
      <div className="relative w-full">
        
        {/* Left Arrow (Floating overlay) */}
        {showLeftBtn && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-[-20px] top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Right Arrow (Floating overlay) */}
        {showRightBtn && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-[-20px] top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-[#152033] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {benefits.map((benefit, idx) => (
            <div 
              key={idx}
              className="w-[280px] md:w-[320px] shrink-0 bg-white dark:bg-[#152033] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 snap-start flex flex-col h-[400px]"
            >
              {/* Image banner */}
              <div className="relative h-[220px] w-full shrink-0 overflow-hidden">
                <Image 
                  src={benefit.img} 
                  alt={benefit.title} 
                  fill 
                  className="object-cover transition-transform duration-500 hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Premium pill badge with blue bullet dot */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm">
                  <span>More</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] inline-block shadow-[0_0_8px_#3B82F6]"></span>
                </div>
              </div>

              {/* Content info */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-[15.5px] md:text-[16px] font-extrabold text-[#0B1F3A] dark:text-white mb-2 tracking-tight leading-snug line-clamp-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[12.5px] md:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 font-medium">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

