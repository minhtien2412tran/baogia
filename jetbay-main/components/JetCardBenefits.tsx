'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

export const JetCardBenefits = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: 'Benefit 1:', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
    { title: 'Benefit 2:', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { title: 'Benefit 3:', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4h20v16H2z"/><path d="M12 4v16"/></svg> },
  ];

  return (
    <div className="w-full bg-[#070B14] py-24 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">Exclusive Benefits of the Jetbay Jet Card</h2>
        </div>

        <div className="flex border-b border-white/10 mb-10 w-fit mx-auto md:mx-0">
          {tabs.map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-8 py-4 border-b-2 transition-colors ${activeTab === idx ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
            >
              <span>{tab.icon}</span>
              <span className="text-[14px] font-bold">{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="bg-[#111827] rounded-3xl overflow-hidden border border-white/5 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
            <Image src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop" alt="Luxury" fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-white/80 text-[13px] font-bold border border-white/10 rounded-full px-4 py-2 mb-6 w-fit bg-white/5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Unlock
            </div>
            <h3 className="text-[28px] font-bold text-white mb-6">Luxury Travel Experience</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#40DACD]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-[#40DACD]" />
                </div>
                <span className="text-white/80 text-[14px]">VIP lounge access & exclusive check-in</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#40DACD]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-[#40DACD]" />
                </div>
                <span className="text-white/80 text-[14px]">No peak-season access or usage restrictions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#40DACD]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-[#40DACD]" />
                </div>
                <span className="text-white/80 text-[14px]">Personalised flight experience tailored to you</span>
              </li>
            </ul>
            <button className="px-8 py-3 bg-white text-[#0B1120] font-bold rounded-lg hover:bg-gray-100 transition-colors w-fit text-[14px]">
              Unlock Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
