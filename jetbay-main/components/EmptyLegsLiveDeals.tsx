'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowDownUp, Bell, ChevronDown, Send, PlaneTakeoff, PlaneLanding, ArrowRightLeft } from 'lucide-react';

const regions = [
  "All", "North America", "Central America", "South America", "Europe", "Eastern Europe", 
  "East Asia", "Southeast Asia", "West Asia", "South Asia", "Central Asia", "Africa", "Oceania"
];

const mockDeals = [
  {
    id: 1,
    from: { city: "Cape Town", detail: "South Africa (FACT)" },
    to: { city: "Bulawayo", detail: "Zimbabwe (FVBU)" },
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    from: { city: "Nelspruit", detail: "South Africa (FAKN)" },
    to: { city: "Johannesburg", detail: "South Africa (FALA)" },
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    from: { city: "Johannesburg", detail: "South Africa (FALA)" },
    to: { city: "Skukuza", detail: "South Africa (FASZ)" },
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    from: { city: "George", detail: "South Africa (FAGG)" },
    to: { city: "Cape Town", detail: "South Africa (FACT)" },
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    from: { city: "Johannesburg", detail: "South Africa (FALA)" },
    to: { city: "Tuli Block", detail: "Botswana (FBLV)" },
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    from: { city: "Bulawayo", detail: "Zimbabwe (FVBU)" },
    to: { city: "Kilimanjaro Region", detail: "Tanzania (HTKJ)" },
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    from: { city: "Cape Town", detail: "South Africa (FACT)" },
    to: { city: "Malelane", detail: "South Africa (FAMN)" },
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    from: { city: "Nelspruit", detail: "South Africa (FAKN)" },
    to: { city: "Cape Town", detail: "South Africa (FACT)" },
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 9,
    from: { city: "Lusaka", detail: "Zambia (FLLK)" },
    to: { city: "Johannesburg", detail: "South Africa (FALA)" },
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop"
  }
];

export const EmptyLegsLiveDeals = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
      
      <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white mb-6">
        Live Empty Leg Deals
      </h2>

      {/* Tabs */}
      <div className="w-full overflow-x-auto no-scrollbar mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center min-w-max">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveTab(region)}
              className={`px-4 py-3 text-[14px] font-medium transition-colors relative ${
                activeTab === region 
                  ? 'text-[#13B2A6]' 
                  : 'text-gray-500 hover:text-[#0B1F3A] dark:hover:text-gray-300'
              }`}
            >
              {region}
              {activeTab === region && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#13B2A6]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Count & Sort */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
          <span className="text-[#13B2A6] font-bold">1995</span> aircraft
        </div>
        <button className="flex items-center gap-1.5 text-[14px] font-medium text-gray-500 hover:text-[#0B1F3A] dark:hover:text-white transition-colors">
          <ArrowDownUp size={16} /> Sort by Price
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mockDeals.map((deal) => (
          <div key={deal.id} className="bg-white dark:bg-[#152033] rounded-[16px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
            
            <div className="relative w-full h-[200px] overflow-hidden">
              <Image 
                src={deal.image} 
                alt="Aircraft" 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6 relative">
                <div className="flex flex-col w-[45%] text-left">
                  <span className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-1 truncate">{deal.from.city}</span>
                  <span className="text-[12px] text-gray-400 truncate">{deal.from.detail}</span>
                </div>
                
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#E6F7F6] dark:bg-[#13B2A6]/10 flex items-center justify-center text-[#13B2A6]">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </div>

                <div className="flex flex-col w-[45%] text-right">
                  <span className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-1 truncate">{deal.to.city}</span>
                  <span className="text-[12px] text-gray-400 truncate">{deal.to.detail}</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-5"></div>

              <div className="flex items-center justify-between">
                <span className="text-[#F5B041] text-[15px] font-bold">Enquire for Price</span>
                <button className="h-[36px] px-6 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 text-[#0B1F3A] dark:text-white text-[13px] font-bold rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Book Now
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mb-16">
        <button className="h-[44px] px-8 bg-white dark:bg-[#152033] border border-gray-300 dark:border-gray-700 text-[#0B1F3A] dark:text-white text-[14px] font-semibold rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
          View More <ChevronDown size={16} />
        </button>
      </div>

      {/* Alerts Box */}
      <div className="w-full bg-[#F8FAFC] dark:bg-[#0B1121] rounded-[24px] border border-gray-100 dark:border-gray-800 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#152033] flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <Bell size={20} className="text-[#13B2A6]" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white">New Deals Disappear Fast</h3>
            <p className="text-[14px] text-gray-500">(Get empty leg alerts for your region the moment they go live.)</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-[#0B1F3A] transition-colors">
            <ChevronDown size={24} className="rotate-180" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <PlaneTakeoff size={18} />
              </div>
              <input type="text" placeholder="Departure city or airport" className="w-full h-[52px] pl-11 pr-4 bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 text-[#0B1F3A] dark:text-white" />
            </div>
            
            <div className="hidden md:flex text-[#13B2A6]">
              <ArrowRightLeft size={20} strokeWidth={2.5} />
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <PlaneLanding size={18} />
              </div>
              <input type="text" placeholder="Destination city or airport" className="w-full h-[52px] pl-11 pr-4 bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 text-[#0B1F3A] dark:text-white" />
            </div>

            <button className="text-[#13B2A6] font-bold text-[14px] whitespace-nowrap hidden md:block">
              + Add Preferred
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <input type="email" placeholder="Enter your email to receive alerts" className="w-full h-[52px] px-4 bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 text-[#0B1F3A] dark:text-white" />
            </div>
            <button className="w-full md:w-auto h-[52px] px-8 bg-[#13B2A6] hover:bg-[#10998f] text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Send size={18} />
              Get Alerts
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};
