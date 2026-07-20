import React from 'react';
import Image from 'next/image';

export const ExceptionalService = () => {
  const items = [
    { title: "Global Coverage", desc: "Available 24/7, our private jet network spans 190+ countries with 20,000+ private jet flights, ensuring global reach and seamless connectivity.", img: "https://picsum.photos/seed/globalcov/600/400" },
    { title: "AI-Powered Efficiency", desc: "Our smart air charter system uses AI to match your needs, securing the best aircraft and planning your private jet trip in 1-2 hours.", img: "https://picsum.photos/seed/aieff/600/400" },
    { title: "Uncompromised Safety", desc: "With certified aircraft, experienced pilots, and trusted partners, JETBAY prioritises safety and reliability in every private jet flight.", img: "https://picsum.photos/seed/safety/600/400" },
    { title: "Industry Leader", desc: "With over 10,000 satisfied clients and a 99% satisfaction rate, we're Asia's leading provider of premium private jet charter services.", img: "https://picsum.photos/seed/leader/600/400" },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] mb-10 text-center leading-[1.15]">What Makes Our Private Air Charter Service Exceptional</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-[#152033] group cursor-pointer hover:shadow-md transition-all flex flex-col h-full">
            <div className="h-48 relative w-full overflow-hidden">
               <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
               <h3 className="text-[#0B1F3A] dark:text-white font-bold text-[18px] mb-3">{item.title}</h3>
               <p className="text-[#4A4A4A] dark:text-gray-400 text-[15px] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

