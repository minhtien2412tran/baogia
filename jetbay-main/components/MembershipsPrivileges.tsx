import React from 'react';
import Image from 'next/image';
import { Building2, Car, CheckCircle2 } from 'lucide-react';

export const MembershipsPrivileges = () => {
  return (
    <div className="w-full bg-[#FAFAFA] py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 mb-4">1% Travel Credits & travel privileges</h2>
          <p className="text-[16px] text-gray-600">Earn Travel Credits from eligible Jetbay bookings and redeem them toward selected premium travel services.</p>
        </div>
        
        {/* Hotel Concierge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative">
            <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative">
              <Image 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop" 
                alt="Luxury Hotel" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Overlay Card */}
            <div className="absolute -bottom-10 -right-4 lg:-right-10 bg-white rounded-2xl p-6 shadow-xl w-[90%] max-w-[340px]">
              <h4 className="text-[16px] font-bold text-gray-900 mb-4">Exclusive hotel perks</h4>
              <div className="space-y-4">
                <div className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-10 h-10 bg-[#F0FBFA] rounded-full flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#40DACD" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-gray-900">Priority check-in</h5>
                    <p className="text-[12px] text-gray-500">Available for Jetbay members</p>
                  </div>
                </div>
                <div className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-10 h-10 bg-[#F0FBFA] rounded-full flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#40DACD" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-gray-900">Preferred stays at</h5>
                    <p className="text-[12px] text-gray-500">Selected luxury hotels worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:pl-10 mt-16 lg:mt-0">
            <div className="w-14 h-14 bg-[#1B2F2E] rounded-full flex items-center justify-center mb-6">
              <Building2 size={24} className="text-white" />
            </div>
            <h3 className="text-[32px] font-bold text-gray-900 mb-4">Luxury hotel concierge</h3>
            <p className="text-[16px] text-gray-600 mb-8 leading-relaxed">
              Access exclusive arrangements at leading luxury hotels, including Aman, Mandarin Oriental, Rosewood, and more.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#1B2F2E] shrink-0 mt-0.5" />
                <span className="text-[15px] text-gray-700">Expert sourcing for luxury hotels and resorts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#1B2F2E] shrink-0 mt-0.5" />
                <span className="text-[15px] text-gray-700">On-request booking coordination and management</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#1B2F2E] shrink-0 mt-0.5" />
                <span className="text-[15px] text-gray-700">Custom stay arrangements tailored to your itinerary</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Transfer Concierge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 lg:pr-10 mt-16 lg:mt-0">
            <div className="w-14 h-14 bg-[#1B2F2E] rounded-full flex items-center justify-center mb-6">
              <Car size={24} className="text-white" />
            </div>
            <h3 className="text-[32px] font-bold text-gray-900 mb-4">Luxury transfer concierge</h3>
            <p className="text-[16px] text-gray-600 mb-8 leading-relaxed">
              Travel seamlessly with preferred access to business class fleets including Toyota Alphard and Mercedes-Benz V-Class or luxury class fleets such as Maybach, Rolls-Royce, and Cadillac.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#1B2F2E] shrink-0 mt-0.5" />
                <span className="text-[15px] text-gray-700">On-demand coordination for airport, hotel, and city transfers</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#1B2F2E] shrink-0 mt-0.5" />
                <span className="text-[15px] text-gray-700">Global sourcing of certified, professional chauffeur options</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#1B2F2E] shrink-0 mt-0.5" />
                <span className="text-[15px] text-gray-700">Tailored vehicle selection matched to your destination and group size</span>
              </li>
            </ul>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative">
              <Image 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop" 
                alt="Luxury Transfer" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Overlay Card */}
            <div className="absolute -bottom-10 -left-4 lg:-left-10 bg-white rounded-2xl p-6 shadow-xl w-[90%] max-w-[340px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#F0FBFA] rounded-full flex items-center justify-center shrink-0">
                  <Car size={20} className="text-[#40DACD]" />
                </div>
                <div>
                  <h5 className="text-[14px] font-bold text-gray-900">Chauffeur service</h5>
                  <p className="text-[12px] text-gray-500">Professional transfer coordination</p>
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 flex items-center justify-between">
                <span className="text-[12px] font-bold text-gray-900">Flexible city transfers</span>
                <span className="text-[12px] text-gray-500">Seamless arrival service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
