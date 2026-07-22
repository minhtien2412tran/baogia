'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const AboutContact = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'marketing'>('sales');

  const locations = [
    { city: 'SINGAPORE', phone: '+65 6562 2988', email: 'sales.sg@jet-bay.com' },
    { city: 'HONG KONG', phone: '+852 3153 2522', email: 'sales.hk@jet-bay.com' },
    { city: 'JAKARTA', phone: '+62 21 2359 9501', email: 'sales.id@jet-bay.com' },
    { city: 'NEW YORK', phone: '+1 212 618 1298', email: 'sales.us@jet-bay.com' },
    { city: 'LONDON', phone: '+44 20 4534 7681', email: 'sales.uk@jet-bay.com' },
    { city: 'DUBAI', phone: '+971 04 291 2331', email: 'sales.ae@jet-bay.com' },
    { city: 'SHANGHAI', phone: '+86 400 877 0833', email: 'sales.sh@jet-bay.com' },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-20 font-sans">
      
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <button 
          onClick={() => setActiveTab('sales')}
          className={`px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors cursor-pointer ${
            activeTab === 'sales'
              ? 'bg-[#3B5998] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Sales-Related Enquiries
        </button>
        <button 
          onClick={() => setActiveTab('marketing')}
          className={`px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors cursor-pointer ${
            activeTab === 'marketing'
              ? 'bg-[#3B5998] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Marketing-Related Enquiries
        </button>
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6 mb-12">
        {locations.map((loc, idx) => (
          <div key={idx} className="flex flex-col">
            <h4 className="text-[13px] font-bold text-[#0B1F3A] dark:text-white mb-2">{loc.city}</h4>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-1">{loc.phone}</p>
            <a href={`mailto:${loc.email}`} className="text-[13px] text-[#808080] hover:text-[#13B2A6] underline transition-colors">
              {loc.email}
            </a>
          </div>
        ))}
      </div>

      {/* Map Section */}
      <div className="w-full h-[300px] md:h-[400px] bg-gray-100 dark:bg-gray-800 rounded-[20px] overflow-hidden relative shadow-sm border border-gray-200 dark:border-gray-700">
        
        {/* Simplified Map Background Image placeholder */}
        <div className="absolute inset-0 opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-lighten">
           <Image 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600" 
              alt="Map background" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
           />
        </div>

        {/* Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center shadow-lg border-2 border-white">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
          <span className="mt-1 text-[13px] font-bold text-gray-900 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm shadow-xs">Singapore</span>
        </div>

        {/* Address Card Overlay */}
        <div className="absolute bottom-6 left-6 bg-white dark:bg-[#152033] p-5 rounded-[12px] shadow-md border border-gray-100 dark:border-gray-700 max-w-sm">
          <h4 className="text-[13px] font-bold text-[#0B1F3A] dark:text-white mb-2">SINGAPORE</h4>
          <a href="#" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline leading-relaxed block">
            180 Cecil St, #16-01 Bangkok Bank Building,<br/>
            Singapore, 069546
          </a>
        </div>

      </div>

    </div>
  );
};
