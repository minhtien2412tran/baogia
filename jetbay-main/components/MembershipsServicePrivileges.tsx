import React from 'react';

export const MembershipsServicePrivileges = () => {
  return (
    <div className="w-full bg-[#1F2C33] py-24 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-white mb-4">Travel Credits & service privileges</h2>
          <p className="text-[16px] text-gray-400">A more rewarding charter experience with Jetbay Travel Credits, dedicated support, secure payments, and flexible service options.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#2A373E] border border-white/10 rounded-[20px] p-8 flex flex-col justify-between h-[360px] lg:h-[420px]">
            <div>
              <h3 className="text-[20px] font-bold text-white mb-4">Earn & redeem Travel Credits</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#40DACD] shrink-0 mt-2"></span>
                  <span className="text-[14px] text-gray-300">Earn credits from eligible bookings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#40DACD] shrink-0 mt-2"></span>
                  <span className="text-[14px] text-gray-300">Earn double credits with selected bank partners</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#40DACD] shrink-0 mt-2"></span>
                  <span className="text-[14px] text-gray-300">Redeem toward selected travel services</span>
                </li>
              </ul>
            </div>
            
            <div className="w-full bg-[#1F2C33] rounded-xl p-4 mt-8 border border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#40DACD]/20 flex items-center justify-center">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#40DACD" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                 </div>
                 <div>
                   <p className="text-[11px] text-gray-400 uppercase tracking-wider">Points accumulated</p>
                   <p className="text-[14px] font-bold text-white">100 points...</p>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Middle Column */}
          <div className="flex flex-col gap-6">
            {/* Card 2 */}
            <div className="bg-[#2A373E] border border-white/10 rounded-[20px] p-8 flex-1">
              <h3 className="text-[18px] font-bold text-white mb-4">Dedicated travel support</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0 mt-2"></span>
                  <span className="text-[13px] text-gray-300">Get fast response for flight requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0 mt-2"></span>
                  <span className="text-[13px] text-gray-300">Speak with a dedicated advisor</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0 mt-2"></span>
                  <span className="text-[13px] text-gray-300">Stay updated with real-time itinerary updates</span>
                </li>
              </ul>
              <div className="mt-6 flex justify-center">
                 <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-[#1F2C33]">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                 </div>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-[#2A373E] border border-white/10 rounded-[20px] p-8 flex-1">
              <h3 className="text-[18px] font-bold text-white mb-4">Preferred plans & experiences</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0 mt-2"></span>
                  <span className="text-[13px] text-gray-300">Compare competitive charter options</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0 mt-2"></span>
                  <span className="text-[13px] text-gray-300">Get the perfect aircraft with flexible aircraft matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0 mt-2"></span>
                  <span className="text-[13px] text-gray-300">Tailor your journey with personalized cabin and travel support</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-[#2A373E] border border-white/10 rounded-[20px] p-8 flex flex-col justify-between h-[360px] lg:h-[420px]">
            <div>
              <h3 className="text-[20px] font-bold text-white mb-4">Safety & payment assurance</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#40DACD] shrink-0 mt-2"></span>
                  <span className="text-[14px] text-gray-300">Fly with certified operator partners</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#40DACD] shrink-0 mt-2"></span>
                  <span className="text-[14px] text-gray-300">Enjoy peace of mind with standardized service process</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#40DACD] shrink-0 mt-2"></span>
                  <span className="text-[14px] text-gray-300">Pay your way with secure, flexible payment options</span>
                </li>
              </ul>
            </div>
            
            <div className="w-full mt-8 flex flex-col items-center">
               <div className="w-20 h-24 mb-4 relative flex items-center justify-center">
                 <svg viewBox="0 0 100 120" fill="none" className="w-full h-full text-[#1F2C33]">
                    <path d="M50 0L100 20V60C100 90 50 120 50 120C50 120 0 90 0 60V20L50 0Z" fill="currentColor" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                 </svg>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="absolute"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
               </div>
               <div className="flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-[#1F2C33] border border-white/10 text-[11px] text-white">Quality</span>
                 <span className="px-3 py-1 rounded-full bg-[#1F2C33] border border-white/10 text-[11px] text-white">Flexible payment</span>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
