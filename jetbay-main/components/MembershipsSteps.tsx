'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const MembershipsSteps = () => {
  const steps = [
    { 
      num: '01', 
      title: 'Earn &\nRedeem\nCredits',
      activeTitle: 'Earn & Redeem Credits',
      details: [
        'Earn credits on every flight',
        'Redeem for flights or perks',
        'No expiration date'
      ],
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop'
    },
    { 
      num: '02', 
      title: 'Secure &\nTrusted\nBookings',
      activeTitle: 'Secure & Trusted Bookings',
      details: [
        'Clear quotes and trackable requests',
        'Global access to vetted aircraft',
        'Membership in globally recognised associations and rigorously vetted operators'
      ],
      image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop',
      actionIcon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
    { 
      num: '03', 
      title: 'Premium\nMember\nPrivileges',
      activeTitle: 'Premium Member Privileges',
      details: [
        'Exclusive partner benefits',
        'Priority boarding and handling',
        'Complimentary upgrades'
      ],
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop',
      actionIcon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    },
    { 
      num: '04', 
      title: 'Jetbay Jet\nCard',
      activeTitle: 'Jetbay Jet Card',
      details: [
        'Built for frequent flyers seeking consistency',
        'Flexible flight planning with locked-in rates',
        'Long-term cost savings on every hour flown'
      ],
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800&auto=format&fit=crop',
      actionText: 'Apply for Jet Card'
    },
    { 
      num: '05', 
      title: 'Fixed-Price\nRoutes',
      activeTitle: 'Fixed-Price Routes',
      details: [
        'Fixed fares on selected popular routes',
        'Instant confirmation to skip the wait',
        'No hidden fees or time wasted comparing options'
      ],
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop',
      actionIcon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    },
    { 
      num: '06', 
      title: 'Curated Jet\nGetaways',
      activeTitle: 'Curated Jet Getaways',
      details: [
        'Bespoke travel experiences',
        'VIP access to global events',
        'Handpicked luxury accommodations'
      ],
      image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=800&auto=format&fit=crop'
    },
  ];

  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 mb-4 tracking-tight">Book your flight, unlock instant benefits</h2>
          <p className="text-[16px] text-gray-600">Every Jetbay booking includes automatic membership. Start earning credits and accessing exclusive travel perks today.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 h-[450px]">
          {steps.map((step, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div 
                key={idx} 
                onMouseEnter={() => setActiveIndex(idx)}
                className={`relative rounded-[24px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer flex flex-col justify-end ${isActive ? 'flex-[3.5] md:flex-[3.5]' : 'flex-1 bg-[#F8F9FA] hover:bg-[#F1F3F5]'}`}
              >
                {isActive && (
                  <>
                    <Image 
                      src={step.image} 
                      alt={step.activeTitle} 
                      fill 
                      className="object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  </>
                )}
                
                {!isActive && (
                  <div className="absolute top-6 -left-3 text-[110px] font-bold text-[#E9F3F2] leading-none tracking-[-0.05em] pointer-events-none opacity-70 z-0 select-none">
                    {step.num}
                  </div>
                )}
                
                <div className={`p-6 relative z-10 w-full ${isActive ? 'text-white flex flex-col justify-end h-full' : 'text-[#0B1F3A] h-full flex flex-col justify-end'}`}>
                  {isActive ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="text-[22px] font-bold mb-3 leading-tight text-white shadow-sm">
                        {step.activeTitle}
                      </h3>
                      <ul className="space-y-2 mb-2 max-w-sm">
                        {step.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-white/95 text-[13px] flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-white rounded-full shrink-0 mt-1.5 shadow-sm"></span>
                            <span className="drop-shadow-md">{detail}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {step.actionText ? (
                        <div className="flex items-center gap-4 mt-6">
                          <button className="bg-white text-[#0B1F3A] font-bold px-6 py-3 rounded-full text-[14px] hover:bg-gray-50 transition-colors shadow-sm flex-1 text-center">
                            {step.actionText}
                          </button>
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                          {step.actionIcon || <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <h3 className="text-[14px] font-bold whitespace-pre-line leading-snug">
                      {step.title}
                    </h3>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
