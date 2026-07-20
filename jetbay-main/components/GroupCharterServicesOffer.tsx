import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export const GroupCharterServicesOffer = () => {
  const services = [
    {
      title: "Group Air Charter for Business Travel",
      desc: "Enhance your business travels with a cor...",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Group Air Charter for Sports Team",
      desc: "Ensure your sports team travels with ease...",
      image: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Group Air Charter for Pilgrimage",
      desc: "Embark on a spiritual journey with comfor...",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Group Air Charter for Tour and Travel",
      desc: "Explore the world with your group in luxur...",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Group Air Charter Services We Offer
        </h2>
      </div>
      
      <p className="text-[15px] text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
        Jetbay provides a comprehensive range of private jet charters tailored to various different groups, large or small:
      </p>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="rounded-[16px] overflow-hidden bg-[#F8FAFC] dark:bg-[#152033] border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative h-[160px] w-full">
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  More <ChevronRight size={12} strokeWidth={3} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-2 leading-tight">
                  {service.title}
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right Arrow Navigation (Mock) */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 bg-white dark:bg-[#1A263D] rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-[#13B2A6] z-10 cursor-pointer">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};
