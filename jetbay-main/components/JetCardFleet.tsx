'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

export const JetCardFleet = () => {
  const [activeTab, setActiveTab] = useState(0);
  const categories = ['Bombardier', 'Gulfstream', 'Dassault', 'Embraer'];

  return (
    <div className="w-full bg-[#050608] py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#40DACD]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[32px] md:text-[42px] font-bold text-white tracking-tight">Available Models for Customers</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-between border-b border-white/10 mb-12 overflow-x-auto hide-scrollbar"
        >
          {categories.map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-8 py-4 border-b-2 whitespace-nowrap transition-colors flex-1 text-center relative ${activeTab === idx ? 'border-[#40DACD] text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
            >
              <span className="text-[14px] font-medium">{tab}</span>
              {activeTab === idx && (
                <motion.div layoutId="activeTabFleet" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-[#40DACD]" />
              )}
            </button>
          ))}
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between mb-8">
                <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-sm z-20 hover:scale-105 active:scale-95">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                
                <div className="flex-1 flex justify-center px-4 relative h-[300px] md:h-[400px] w-full max-w-[800px] mx-auto group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent z-10 rounded-3xl pointer-events-none"></div>
                  <Image 
                    src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop" 
                    alt="Plane" 
                    fill 
                    className="object-cover rounded-3xl filter brightness-[0.85] shadow-[0_30px_60px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Decorative Elements on Image */}
                  <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                     <span className="text-[12px] text-white/90 font-medium tracking-wide uppercase">Ultra-Long Range</span>
                  </div>
                </div>

                <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-sm z-20 hover:scale-105 active:scale-95">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              <div className="text-center mb-12">
                <h3 className="text-[32px] font-bold text-white mb-4">Global 7500</h3>
                <p className="text-[15px] text-white/60 max-w-2xl mx-auto leading-relaxed">
                  The Bombardier Global 7500 is an ultra-long-range business jet offering exceptional range and luxurious accommodations, capable of connecting distant city pairs non-stop.
                </p>
              </div>

              <div className="border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm overflow-hidden p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-[14px] text-white/50">Maximum Range (nm)</span>
                    <span className="text-[16px] font-bold text-white">7,700</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-[14px] text-white/50">Cabin Height (ft)</span>
                    <span className="text-[16px] font-bold text-white">6.2</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-[14px] text-white/50">High-Speed Cruise (Ktas)</span>
                    <span className="text-[16px] font-bold text-white">516</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-[14px] text-white/50">Cabin Width (ft)</span>
                    <span className="text-[16px] font-bold text-white">8</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/10 md:border-0 md:pb-0">
                    <span className="text-[14px] text-white/50">Capacity</span>
                    <span className="text-[16px] font-bold text-white">19</span>
                  </div>
                  <div className="flex justify-between items-center pb-0 border-0">
                    <span className="text-[14px] text-white/50">Cabin Length (ft)</span>
                    <span className="text-[16px] font-bold text-white">54.5</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex items-start gap-3 text-white/40 text-[13px] bg-white/[0.02] p-4 rounded-xl border border-white/5">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-[#40DACD]"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                 <p>The above specifications are based on available data and may vary depending on specific aircraft configurations and operational conditions.</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
