import React from 'react';
import Image from 'next/image';
import { Gem, Laptop, Globe, Shield } from 'lucide-react';

export const MembershipsIntro = () => {
  return (
    <div className="w-full bg-[#FAFAFA] py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="inline-flex items-center gap-2 mb-6 bg-[#F0FBFA] px-3 py-1.5 rounded-full border border-[#E4F4F1]">
          <Gem size={14} className="text-[#40DACD]" />
          <span className="text-[13px] font-bold text-gray-900">Membership Benefits</span>
        </div>
        
        <h2 className="text-[36px] md:text-[48px] font-bold text-gray-900 mb-6 tracking-tighter">Jetbay Membership</h2>
        <p className="text-[16px] text-gray-600 max-w-2xl mb-12">
          Every eligible charter booking helps you earn Travel Credits and access premium member privileges across flights, hotels, transfers, and concierge services.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop" 
              alt="Jetbay Membership" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#F0FBFA] flex items-center justify-center shrink-0">
                <Laptop size={20} className="text-[#40DACD]" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">Digital charter platform</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">Book and manage private jet charters through a faster, streamlined digital experience.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#F0FBFA] flex items-center justify-center shrink-0">
                <Globe size={20} className="text-[#40DACD]" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">Multi-currency & flexible payments</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">Pay securely with multiple currencies and flexible payment options for international travel.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#F0FBFA] flex items-center justify-center shrink-0">
                <Shield size={20} className="text-[#40DACD]" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">End-to-end travel support</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">Get dedicated support from aircraft sourcing to itinerary coordination and post-flight service.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
