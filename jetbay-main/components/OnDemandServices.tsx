import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

export const OnDemandServices = () => {
  const services = [
    {
      title: "Private Jet Charter for Business Travel",
      desc: "Optimise your business travel with our efficient and flexible private air charter services. We offer tailored solutions for executives and corporate teams, ensuring seamless and productive journeys. Whether you need a corporate charter jet for a crucial meeting or a multi-city tour, we'll get you there in style and comfort.",
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800"
    },
    {
      title: "Private Jet Charter for Leisure Travel",
      desc: "Embark on unforgettable adventures with our private aircraft charters for leisure. From exotic beach getaways to mountain retreats, enjoy personalized services, ultimate comfort, and a flight schedule designed entirely around your vacation needs.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800"
    },
    {
      title: "Private Jet Charter for Medical Transport",
      desc: "In times of medical urgency, our private jets provide swift and secure transportation for patients, medical teams, and critical equipment. Equipped with life-support systems and staffed by professionals, we ensure safe transfers.",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800"
    },
    {
      title: "Private Jet Charter for Pet Travel",
      desc: "Bring your beloved companions along on your journeys with our pet-friendly private jet charter services. Avoid the stress of commercial pet transport and keep your pets by your side in the cabin for a comfortable flight.",
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800"
    }
  ];

  return (
    <div id="ondemand-services-section" className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] leading-[1.15] mb-3">
            Our Private Air Charter Services
          </h2>
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[16.5px]">
            Customized solutions for every travel requirement.
          </p>
        </div>
        
        {/* Nav Arrows */}
        <div className="flex items-center bg-[#F1F5F9] dark:bg-gray-800 rounded-full p-1 h-fit shrink-0">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all text-[#94A3B8]">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all text-[#0B1F3A] dark:text-white">
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((svc, idx) => (
          <div 
            key={idx} 
            className="rounded-[24px] overflow-hidden relative h-[440px] group cursor-pointer border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col"
          >
            {/* Background Image */}
            <Image 
              src={svc.img} 
              alt={svc.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              referrerPolicy="no-referrer"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent group-hover:from-[#0B1F3A]/98 group-hover:via-[#0B1F3A]/90 group-hover:to-[#0B1F3A]/85 transition-all duration-500 z-10 flex flex-col justify-end p-6 lg:p-8">
              
              {/* Top Right Arrow Icon on Hover */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-[#0B1F3A] flex items-center justify-center opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-md">
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </div>

              {/* Text content with slide up */}
              <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h3 className="text-white font-bold text-[20px] leading-snug mb-3 tracking-tight">
                  {svc.title}
                </h3>
                
                {/* Description - Clamped in normal state, fully visible on hover */}
                <p className="text-white/80 text-[14.5px] leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                  {svc.desc}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
