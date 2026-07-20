import React from 'react';
import { Plane, Search } from 'lucide-react';

export const MembershipsCTA = () => {
  return (
    <div className="w-full bg-white py-24 relative overflow-hidden">
      {/* Background text ON DEMAND */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[180px] font-bold text-gray-50/80 whitespace-nowrap pointer-events-none select-none z-0">
        ON DEMAND
      </div>
      
      <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F0FBFA] px-4 py-1.5 rounded-full mb-6">
          <Plane size={14} className="text-[#40DACD]" />
          <span className="text-[13px] font-bold text-[#40DACD]">Plan Your Flight</span>
        </div>
        
        <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 mb-4">Book now to unlock your Jetbay membership</h2>
        <p className="text-[16px] text-gray-600 mb-12">Share your itinerary, and our charter team will prepare a tailored private jet solution for your trip.</p>
        
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 text-left">
          <div className="flex items-center gap-2 mb-6">
            <button className="bg-[#E4F4F1] text-[#0B1F3A] px-4 py-1.5 rounded-full text-[13px] font-bold">One-way</button>
            <button className="text-gray-500 hover:text-gray-900 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors">Round-trip</button>
            <button className="text-gray-500 hover:text-gray-900 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors">Multi-city</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">From</label>
              <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Plane size={16} className="text-gray-400 -rotate-45" />
                <input type="text" placeholder="From" className="bg-transparent border-none outline-none w-full text-[14px] text-gray-900" />
              </div>
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">To</label>
              <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Plane size={16} className="text-gray-400 rotate-45" />
                <input type="text" placeholder="To" className="bg-transparent border-none outline-none w-full text-[14px] text-gray-900" />
              </div>
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Departure (Local)</label>
              <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="text" defaultValue="16 Jul / 2026" className="bg-transparent border-none outline-none w-full text-[14px] text-gray-900" />
              </div>
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Passengers</label>
              <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <button className="text-gray-400 hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                <span className="text-[14px] text-gray-900 font-medium">2</span>
                <button className="text-gray-400 hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-[#40DACD] hover:bg-[#34C5B9] transition-colors text-[#0B1F3A] font-bold text-[15px] py-4 rounded-xl mt-4 flex items-center justify-center gap-2">
            <Search size={18} /> Search Available Aircraft
          </button>
        </div>
      </div>
    </div>
  );
};
