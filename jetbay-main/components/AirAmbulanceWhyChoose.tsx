'use client';

import React from 'react';
import Image from 'next/image';

export const AirAmbulanceWhyChoose = () => {
  const images = [
    "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=400",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400",
    "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=400",
    "https://images.unsplash.com/photo-1587745416684-47953f16f02f?q=80&w=400"
  ];

  const points = [
    {
      title: "Extensive Aircraft Network",
      desc: "Our deep understanding of available aircraft ensures we select the most suitable option for your specific medical requirements."
    },
    {
      title: "Specialist On-Board Care",
      desc: "Our flights are manned by specialist doctors who deliver personalised medical care tailored to your needs."
    },
    {
      title: "Proven Excellence",
      desc: "With a proven track record in safe and reliable air medical transport, we guarantee peace of mind during critical situations."
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      
      {/* Title block with gold left line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#D4A64A]"></div>
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Why Choose Jetbay for Air Ambulance Services?
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: 2x2 Image Collage */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {images.map((imgUrl, idx) => (
            <div key={idx} className="relative h-[130px] sm:h-[150px] rounded-[18px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <Image 
                src={imgUrl} 
                alt={`Why Choose Jetbay ${idx + 1}`} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        {/* Right Side: Description and 3 Bullet points */}
        <div className="lg:col-span-7 space-y-5">
          <p className="text-[13.5px] md:text-[14px] font-semibold text-[#0B1F3A] dark:text-gray-200 leading-relaxed">
            Charter an air ambulance with Jetbay for your air medical transport needs. With extensive experience in numerous and successful medevac missions, we provide :
          </p>

          <div className="space-y-4 pt-1">
            {points.map((pt, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#0066FF] mt-2 shrink-0"></div>
                <div>
                  <h3 className="text-[14px] md:text-[14.5px] font-extrabold text-[#0B1F3A] dark:text-white leading-tight mb-1">
                    {pt.title}
                  </h3>
                  <p className="text-[12.5px] md:text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
