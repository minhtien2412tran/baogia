import React from 'react';
import Image from 'next/image';

export const MembershipsHero = () => {
  return (
    <div className="w-full bg-gradient-to-b from-[#1B2F2E] to-[#254240] pt-12 pb-32 relative">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 mb-8 inline-flex items-center gap-2">
          <span className="text-white text-[13px] font-medium">Members</span>
          <span className="text-white/60 text-[13px]">|</span>
          <span className="text-white/90 text-[13px]">Unlock private jet rewards & privileges</span>
        </div>
        
        <h1 className="text-[48px] md:text-[56px] lg:text-[64px] font-bold text-white leading-[1.1] tracking-[-0.04em] mb-6">
          Jetbay Membership Benefits
        </h1>
        
        <p className="text-[18px] text-white/80 max-w-2xl font-medium mb-16">
          Earn travel rewards and enjoy exclusive partner benefits.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10 items-center relative">
          {/* Card 1 */}
          <div className="flex flex-col gap-6 justify-center">
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 transform -rotate-3 hover:rotate-0 transition-transform cursor-default ml-auto w-[90%] lg:w-[280px]">
              <div className="w-12 h-12 bg-[#8FE2D0] rounded-full flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="10" rx="2"/><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/></svg>
              </div>
              <div className="text-left">
                <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-0.5">Earn 2x Travel Credits</h3>
                <p className="text-[13px] text-gray-500">with selected bank cards</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 flex items-start justify-between relative overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform cursor-default ml-auto w-[95%] lg:w-[300px]">
              <div className="text-left relative z-10">
                <h3 className="text-[18px] font-bold text-gray-900 leading-tight mb-1">Earn 1% back</h3>
                <p className="text-[13px] text-gray-500">in Travel Credits</p>
              </div>
              <div className="bg-[#8FE2D0] text-[#0B1F3A] text-[11px] font-bold px-3 py-1.5 rounded-full relative z-10 mt-1">
                Travel Credits
              </div>
            </div>
          </div>
          
          {/* Main Card (Form) */}
          <div className="bg-white rounded-[24px] p-8 text-left z-20 w-full relative">
            <div className="text-center mb-6">
              <h3 className="text-[20px] font-bold text-gray-900 mb-1">Book Your Next Private Jet Journey</h3>
              <p className="text-[14px] text-gray-500">Complete your booking and unlock your Jetbay Membership.</p>
            </div>
            
            <div className="space-y-4 relative">
              <div className="border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input type="text" placeholder="Leaving From" className="bg-transparent border-none outline-none w-full text-[15px] text-gray-900 placeholder:text-gray-400 font-medium" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-[52px] z-10 bg-[#8FE2D0] rounded-full w-8 h-8 flex items-center justify-center border-[3px] border-white shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/></svg>
              </div>
              <div className="border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input type="text" placeholder="Going To" className="bg-transparent border-none outline-none w-full text-[15px] text-gray-900 placeholder:text-gray-400 font-medium" />
              </div>
              
              <button className="w-full bg-[#1B2F2E] text-white rounded-xl py-4 font-bold text-[15px] hover:bg-[#152423] transition-colors mt-4">
                Book & Unlock Membership
              </button>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="flex flex-col gap-6 justify-center">
            <div className="bg-white rounded-[20px] p-4 pr-6 flex items-center gap-4 transform rotate-3 hover:rotate-0 transition-transform cursor-default mr-auto w-[90%] lg:w-[280px]">
              <div className="flex -space-x-2 shrink-0">
                {[1,2].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-[12px] text-gray-500 mb-0.5">Trusted worldwide by</p>
                <h3 className="text-[16px] font-bold text-gray-900 leading-tight">10,000+ Clients</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-[20px] p-4 pr-6 flex items-center gap-4 transform rotate-2 hover:rotate-0 transition-transform cursor-default mr-auto w-[95%] lg:w-[300px]">
              <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center">
                <Image src="https://flagcdn.com/us.svg" alt="Global" width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div className="text-left">
                <p className="text-[12px] text-gray-500 mb-0.5">Global flight access to</p>
                <h3 className="text-[16px] font-bold text-gray-900 leading-tight">190+ Countries</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
