import React from 'react';
import Image from 'next/image';

export const MembershipsBankPerks = () => {
  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* BCA Perks */}
          <div className="order-2 lg:order-1">
            <div className="flex flex-col gap-6 w-full">
              {/* Feature 1 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center font-bold text-gray-900 text-[14px]">01</div>
                  <h4 className="text-[16px] font-bold text-gray-900">Double membership points</h4>
                </div>
                <p className="text-[14px] text-gray-600 ml-14">Earn 2 points per USD 100 on eligible bookings.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-[#E4F4F1] rounded-full flex items-center justify-center font-bold text-gray-900 text-[14px]">02</div>
                  <h4 className="text-[16px] font-bold text-gray-900">Save 2% off</h4>
                </div>
                <p className="text-[14px] text-gray-600 ml-14">Enjoy 2% off your first Jetbay private jet booking with a Hong Kong-issued HSBC Privé Credit Card.</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <span className="text-[12px] font-bold text-gray-700">Bank Perks</span>
            </div>
            
            <h3 className="text-[28px] font-bold text-gray-900 mb-4"><span className="text-[#0055A5]">BCA</span> Travel Credit rewards</h3>
            <p className="text-[14px] text-gray-500 font-medium mb-4">Valid until 31 Dec 2026</p>
            <p className="text-[15px] text-gray-600 mb-8 leading-relaxed max-w-md">
              Available to active BCA Prioritas and BCA Solitaire customers. Payment must be completed via bank transfer from the customer&apos;s BCA account to PT Jet Bay Indonesia&apos;s BCA account.
            </p>
            
            <div className="h-10">
               {/* BCA Logo placeholder text, normally you'd use Image */}
               <div className="text-[24px] font-extrabold text-[#003399] tracking-tighter italic">BCA</div>
            </div>
          </div>
          
        </div>
        
        <div className="w-full h-px bg-gray-100 my-24"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* HSBC Perks */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <span className="text-[12px] font-bold text-gray-700">Bank Perks</span>
            </div>
            
            <h3 className="text-[28px] font-bold text-gray-900 mb-4"><span className="text-[#DB0011]">HSBC</span> Privé Hong Kong</h3>
            <p className="text-[14px] text-gray-500 font-medium mb-4">Valid until 31 Dec 2026</p>
            <p className="text-[15px] text-gray-600 mb-8 leading-relaxed max-w-md">
              Exclusive to HSBC Privé Credit Cards issued in Hong Kong. Bookings, cancellations, and amendments must be arranged through an HSBC Privé Lifestyle Relationship Manager.
            </p>
            
            <div className="h-10">
               {/* HSBC Logo placeholder text */}
               <div className="text-[24px] font-bold text-gray-900 flex items-center gap-2">
                 <div className="w-8 h-8 bg-[#DB0011] relative overflow-hidden clip-polygon-[50%_0,100%_50%,50%_100%,0_50%]"></div>
                 HSBC
               </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6 w-full">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center font-bold text-gray-900 text-[14px]">01</div>
                <h4 className="text-[16px] font-bold text-gray-900">Double Travel Credits</h4>
              </div>
              <p className="text-[14px] text-gray-600 ml-14">Earn 2 Jetbay Travel Credits for every USD 100 spent on eligible private jet charter bookings.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-[#E4F4F1] rounded-full flex items-center justify-center font-bold text-gray-900 text-[14px]">02</div>
                <h4 className="text-[16px] font-bold text-gray-900">Charter discount privileges</h4>
              </div>
              <p className="text-[14px] text-gray-600 ml-14">Enjoy up to USD 3,000 off eligible private jet charter bookings, based on transaction value and BCA customer tier.</p>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
};
