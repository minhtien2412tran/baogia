import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Route, Gauge, ArrowUpDown, ArrowLeftRight, Ruler, Bed } from 'lucide-react';

export const PopularJets = () => {
  const jets = [
    { 
      pax: 7, 
      name: "Phenom 300", 
      desc: "Best-selling light jet. Class-leading speed and BMW-designed interior for premier regional jet charter.", 
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
      range: "3,650 km",
      speed: "839 km/h",
      height: "1.49 m",
      width: "1.55 m",
      length: "5.24 m",
      sleeping: "N/A"
    },
    { 
      pax: 8, 
      name: "Citation XLS", 
      desc: "Popular midsize jet. Features a spacious stand-up cabin and agile runway access for seamless private jet charter.", 
      img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=800",
      range: "3,440 km",
      speed: "802 km/h",
      height: "1.73 m",
      width: "1.68 m",
      length: "5.64 m",
      sleeping: "N/A"
    },
    { 
      pax: 10, 
      name: "Challenger 350", 
      desc: "Top super-midsize jet. Wide flat-floor cabin and coast-to-coast range for a seamless premium private flight.", 
      img: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=800",
      range: "5,926 km",
      speed: "882 km/h",
      height: "1.83 m",
      width: "2.19 m",
      length: "7.68 m",
      sleeping: "3-4"
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 bg-white dark:bg-transparent">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] leading-[1.15]">Compare and Book Our Most Popular Private Jets</h2>
        <div className="hidden md:flex items-center gap-2 mb-2">
          <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#152033] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#152033] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm hover:bg-gray-100 dark:hover:bg-[#1A263D] transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {jets.map((jet, i) => (
          <div 
            key={i} 
            className="rounded-[24px] border border-gray-100/90 dark:border-gray-800 bg-[#F8FAFC] dark:bg-[#111A2E] p-6 md:p-8 flex flex-col h-[650px] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] cursor-pointer group overflow-hidden"
          >
            {/* Header: Passengers */}
            <div className="flex flex-col mb-4 shrink-0">
              <span className="text-[#94A3B8] dark:text-gray-500 text-[48px] font-bold leading-none mb-1">{jet.pax}</span>
              <span className="text-[#0B1F3A]/60 dark:text-gray-400 text-[11px] font-bold tracking-wider uppercase">Passengers</span>
            </div>
            
            {/* Image section: occupies remaining space, scales down smoothly when specs table opens */}
            <div className="flex-1 min-h-[100px] relative w-full mb-6 flex items-center justify-center transform group-hover:scale-95 transition-all duration-500 ease-in-out">
               <Image src={jet.img} alt={jet.name} fill className="object-contain drop-shadow-md" referrerPolicy="no-referrer" />
            </div>
            
            {/* Jet Name & Desc */}
            <div className="shrink-0 mb-2">
              <h3 className="text-[#0B1F3A] dark:text-white text-[24px] font-bold mb-2 tracking-tight">{jet.name}</h3>
              <p className="text-[#4A4A4A] dark:text-gray-400 text-[14px] leading-relaxed pr-2">
                {jet.desc}
              </p>
            </div>

            {/* Specifications table sliding down inside the card on hover */}
            <div className="grid transition-all duration-500 ease-in-out grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 shrink-0">
              <div className="overflow-hidden">
                <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800/60 space-y-3.5">
                  <div className="flex justify-between items-center text-[13.5px] border-b border-gray-100 dark:border-gray-800/60 pb-2.5">
                    <span className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <Route size={16} className="text-[#13B2A6] dark:text-[#40DACD]" /> Range
                    </span>
                    <span className="font-bold text-[#0B1F3A] dark:text-white">{jet.range}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[13.5px] border-b border-gray-100 dark:border-gray-800/60 pb-2.5">
                    <span className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <Gauge size={16} className="text-[#13B2A6] dark:text-[#40DACD]" /> Cruising Speed
                    </span>
                    <span className="font-bold text-[#0B1F3A] dark:text-white">{jet.speed}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[13.5px] border-b border-gray-100 dark:border-gray-800/60 pb-2.5">
                    <span className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <ArrowUpDown size={16} className="text-[#13B2A6] dark:text-[#40DACD]" /> Cabin Height
                    </span>
                    <span className="font-bold text-[#0B1F3A] dark:text-white">{jet.height}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[13.5px] border-b border-gray-100 dark:border-gray-800/60 pb-2.5">
                    <span className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <ArrowLeftRight size={16} className="text-[#13B2A6] dark:text-[#40DACD]" /> Cabin Width
                    </span>
                    <span className="font-bold text-[#0B1F3A] dark:text-white">{jet.width}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[13.5px] border-b border-gray-100 dark:border-gray-800/60 pb-2.5">
                    <span className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <Ruler size={16} className="text-[#13B2A6] dark:text-[#40DACD]" /> Cabin Length
                    </span>
                    <span className="font-bold text-[#0B1F3A] dark:text-white">{jet.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[13.5px] pb-1">
                    <span className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <Bed size={16} className="text-[#13B2A6] dark:text-[#40DACD]" /> Sleeping
                    </span>
                    <span className="font-bold text-[#0B1F3A] dark:text-white">{jet.sleeping}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

