import React from 'react';
import Image from 'next/image';
import { ChevronRight, MoveDown } from 'lucide-react';

const fixedRoutes = [
  {
    id: 1,
    from: { code: 'LTN', city: 'London' },
    to: { code: 'LBG', city: 'Paris' },
    priceLight: '13,500',
    priceMid: '27,000',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    from: { code: 'LBG', city: 'Paris' },
    to: { code: 'LTN', city: 'London' },
    priceLight: '13,500',
    priceMid: '27,000',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    from: { code: 'LTN', city: 'London' },
    to: { code: 'NCE', city: 'Nice' },
    priceLight: '15,000',
    priceMid: '35,000',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    from: { code: 'NCE', city: 'Nice' },
    to: { code: 'LTN', city: 'London' },
    priceLight: '15,000',
    priceMid: '35,000',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 5,
    from: { code: 'LBG', city: 'Paris' },
    to: { code: 'NCE', city: 'Nice' },
    priceLight: '13,000',
    priceMid: '33,000',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 6,
    from: { code: 'NCE', city: 'Nice' },
    to: { code: 'LBG', city: 'Paris' },
    priceLight: '13,000',
    priceMid: '33,000',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop'
  }
];

export const FixedPriceRoutes = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-2 tracking-[-0.02em] leading-[1.15]">Fixed-Price Charter Routes</h2>
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[15px]">Experience price certainty on our most requested global routes.</p>
        </div>
        <button className="flex items-center gap-1 text-[14px] font-semibold text-[#0B1F3A] dark:text-white hover:text-gray-600 transition-colors mb-2">
          View All Fixed-Price Routes <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {fixedRoutes.map((route) => (
          <div key={route.id} className="group bg-white dark:bg-[#152033] rounded-[16px] border border-[#E2E8F0] dark:border-gray-800 hover:border-transparent p-5 flex flex-col sm:flex-row gap-6 lg:gap-10 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            
            {/* Hover Background */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {route.image && <Image src={route.image} alt={route.to.city} fill className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-r from-[#065561]/95 via-[#065561]/80 to-transparent z-10" />
            </div>
            
            <div className="relative z-20 w-[80px] lg:w-[90px] flex flex-col justify-center text-left">
              <div className="text-[28px] font-bold text-[#0B1F3A] group-hover:text-white dark:text-white leading-[1.1] transition-colors">{route.from.code}</div>
              <div className="text-[13px] text-[#64748B] group-hover:text-gray-300 mt-0.5 mb-1.5 transition-colors">{route.from.city}</div>
              <div className="text-[#94A3B8] group-hover:text-gray-400 my-0.5 transition-colors"><MoveDown size={16} strokeWidth={2} /></div>
              <div className="text-[28px] font-bold text-[#0B1F3A] group-hover:text-white dark:text-white leading-[1.1] mt-1.5 transition-colors">{route.to.code}</div>
              <div className="text-[13px] text-[#64748B] group-hover:text-gray-300 mt-0.5 transition-colors">{route.to.city}</div>
            </div>
            
            <div className="relative z-20 flex-1 flex flex-col justify-center gap-3 group-hover:gap-3.5 group-hover:py-1 transition-all duration-300">
              
              {/* Light Jets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 border border-[#E2E8F0] group-hover:border-transparent group-hover:p-0 group-hover:pb-3.5 group-hover:border-b group-hover:border-white/20 dark:border-gray-700 rounded-[10px] group-hover:rounded-none transition-all duration-300">
                <div className="flex flex-col mb-2 sm:mb-0">
                  <div className="text-[13px] text-[#475569] group-hover:text-white font-medium dark:text-gray-400 mb-0.5 transition-colors">Light Jets</div>
                  <div className="text-[14px]">
                    <span className="font-bold text-[#F5B041]">USD {route.priceLight}</span>
                    <span className="text-[#94A3B8] group-hover:text-gray-300 mx-2 transition-colors">•</span>
                    <span className="text-[#64748B] group-hover:text-white font-medium transition-colors">Up to 8 passengers</span>
                  </div>
                </div>
                <button className="font-bold text-[14px] text-[#13B2A6] dark:text-[#40DACD] hover:opacity-80 transition-opacity">
                  Book Now
                </button>
              </div>
              
              {/* Midsize Jets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 border border-[#E2E8F0] group-hover:border-transparent group-hover:p-0 group-hover:pt-1 dark:border-gray-700 rounded-[10px] group-hover:rounded-none transition-all duration-300">
                <div className="flex flex-col mb-2 sm:mb-0">
                  <div className="text-[13px] text-[#475569] group-hover:text-white font-medium dark:text-gray-400 mb-0.5 transition-colors">Midsize to Heavy Jets</div>
                  <div className="text-[14px]">
                    <span className="font-bold text-[#F5B041]">USD {route.priceMid}</span>
                    <span className="text-[#94A3B8] group-hover:text-gray-300 mx-2 transition-colors">•</span>
                    <span className="text-[#64748B] group-hover:text-white font-medium transition-colors">Up to 16 passengers</span>
                  </div>
                </div>
                <button className="font-bold text-[14px] text-[#13B2A6] dark:text-[#40DACD] hover:opacity-80 transition-opacity">
                  Book Now
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
