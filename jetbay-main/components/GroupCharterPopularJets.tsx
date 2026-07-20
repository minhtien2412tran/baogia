import React from 'react';
import Image from 'next/image';
import { Users, Route } from 'lucide-react';

export const GroupCharterPopularJets = () => {
  const jets = [
    {
      name: "Boeing BBJ",
      seats: "40",
      range: "8,100 km",
      image: "https://images.unsplash.com/photo-1556559322-b5071efadc88?q=80&w=800&auto=format&fit=crop",
      featured: true
    },
    {
      name: "Airbus ACJ",
      seats: "18",
      range: "11,112 km",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
      featured: true
    },
    {
      name: "Embraer Lineage 1000",
      seats: "19",
      range: "8,519 km",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop",
      featured: false
    },
    {
      name: "Bombardier Challenger 850",
      seats: "14",
      range: "5,430 km",
      image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=800&auto=format&fit=crop",
      featured: false
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Popular Group Jets We Offer
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {jets.map((jet, index) => (
          <div key={index} className="flex flex-col group cursor-pointer">
            <div className="relative h-[200px] w-full rounded-[16px] overflow-hidden mb-4 bg-gray-100 dark:bg-[#152033]">
              <Image 
                src={jet.image} 
                alt={jet.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {jet.featured && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0B1F3A] text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <span className="text-[#D4A64A]">🔥</span> Featured
                </div>
              )}
            </div>
            
            <h3 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white mb-3">
              {jet.name}
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                <Users size={14} />
                Seats: {jet.seats}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                <Route size={14} />
                Maximum Range: {jet.range}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
