"use client";

import React from 'react';
import { motion } from 'motion/react';

const CardIcon = ({ className }: { className?: string }) => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4.6 15L10.6 3H16.6L10.6 15H4.6Z" fill="currentColor" opacity="0.6"/>
    <path d="M12.6 17L18.6 5H24.6L18.6 17H12.6Z" fill="currentColor"/>
  </svg>
);

export const JetCardTiers = () => {
  return (
    <div className="w-full bg-[#050608] py-24 relative overflow-hidden">
      {/* Top radial gradient behind title */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131936]/40 via-transparent to-transparent pointer-events-none"
      ></motion.div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#F8FAFC] tracking-tight">Choose Your Preferred Jetbay Jet Card Option</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 10 Hour Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="rounded-2xl p-[1px] relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] group cursor-pointer" 
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <div className="bg-gradient-to-b from-[#18191B] to-[#0A0A0B] rounded-2xl p-8 relative overflow-hidden flex flex-col min-h-[460px] h-full w-full">
              {/* Glow */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/[0.03] blur-[60px] rounded-full pointer-events-none group-hover:bg-white/[0.05] transition-colors duration-500"></div>
              
              {/* Abstract curve */}
              <div className="absolute -bottom-[15%] -right-[15%] w-[90%] h-[70%] border-t-[60px] border-l-[60px] border-white/[0.015] rounded-tl-[120px] transform rotate-12 pointer-events-none group-hover:border-white/[0.03] transition-colors duration-500"></div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-10 text-white transform group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 origin-left">
                  <CardIcon className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                </div>
                <h3 className="text-[26px] font-bold text-white mb-8">10 Hour Jet Card</h3>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] rounded-full border border-white/50 flex items-center justify-center shrink-0">
                      <div className="w-[6px] h-[6px] bg-white/90 rounded-full"></div>
                    </div>
                    <span className="text-[#8B8D91] text-[15px]">Occasional private flyers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] rounded-full border border-white/50 flex items-center justify-center shrink-0">
                      <div className="w-[6px] h-[6px] bg-white/90 rounded-full"></div>
                    </div>
                    <span className="text-[#8B8D91] text-[15px]">Flexibility without long-term commitment</span>
                  </li>
                </ul>
              </div>
              
              <button className="w-full py-4 bg-[#E2E6FF] hover:bg-white text-[#0B1120] font-bold rounded-xl transition-colors relative z-10 mt-auto text-[15px] shadow-[0_4px_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)]">
                Unlock Now
              </button>
            </div>
          </motion.div>

          {/* 25 Hour Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="rounded-2xl p-[1px] relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] group cursor-pointer" 
            style={{ background: 'linear-gradient(135deg, rgba(232,221,149,0.18) 0%, rgba(232,221,149,0.02) 100%)' }}
          >
            <div className="bg-gradient-to-b from-[#1C1A12] to-[#0A0A0B] rounded-2xl p-8 relative overflow-hidden flex flex-col min-h-[460px] h-full w-full">
              {/* Glow */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#E8DD95]/[0.05] blur-[60px] rounded-full pointer-events-none group-hover:bg-[#E8DD95]/[0.08] transition-colors duration-500"></div>
              
              {/* Abstract curve */}
              <div className="absolute -bottom-[15%] -right-[15%] w-[90%] h-[70%] border-t-[60px] border-l-[60px] border-[#E8DD95]/[0.015] rounded-tl-[120px] transform rotate-12 pointer-events-none group-hover:border-[#E8DD95]/[0.03] transition-colors duration-500"></div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-10 text-[#E8DD95] transform group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 origin-left">
                  <CardIcon className="text-[#E8DD95] drop-shadow-[0_0_15px_rgba(232,221,149,0.3)]" />
                </div>
                <h3 className="text-[26px] font-bold text-white mb-8">25 Hour Jet Card</h3>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] rounded-full border border-[#E8DD95]/60 flex items-center justify-center shrink-0">
                      <div className="w-[6px] h-[6px] bg-[#E8DD95]/90 rounded-full"></div>
                    </div>
                    <span className="text-[#8B8D91] text-[15px]">Business travellers & executives</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] rounded-full border border-[#E8DD95]/60 flex items-center justify-center shrink-0">
                      <div className="w-[6px] h-[6px] bg-[#E8DD95]/90 rounded-full"></div>
                    </div>
                    <span className="text-[#8B8D91] text-[15px]">Lower hourly rates, priority booking</span>
                  </li>
                </ul>
              </div>
              
              <button className="w-full py-4 bg-[#E2E6FF] hover:bg-white text-[#0B1120] font-bold rounded-xl transition-colors relative z-10 mt-auto text-[15px] shadow-[0_4px_20px_rgba(232,221,149,0.1)] group-hover:shadow-[0_4px_25px_rgba(232,221,149,0.2)]">
                Unlock Now
              </button>
            </div>
          </motion.div>

          {/* 50 Hour Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="rounded-2xl p-[1px] relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] group cursor-pointer" 
            style={{ background: 'linear-gradient(135deg, rgba(194,201,250,0.18) 0%, rgba(194,201,250,0.02) 100%)' }}
          >
            <div className="bg-gradient-to-b from-[#161720] to-[#0A0A0B] rounded-2xl p-8 relative overflow-hidden flex flex-col min-h-[460px] h-full w-full">
              {/* Stars background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#C2C9FA_0.5px,_transparent_0.5px)] bg-[size:30px_30px] opacity-[0.2] pointer-events-none group-hover:opacity-[0.3] transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#FFFFFF_1px,_transparent_1px)] bg-[size:80px_80px] opacity-[0.1] pointer-events-none translate-x-6 translate-y-6 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-1000"></div>
              
              {/* Glow */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#C2C9FA]/[0.05] blur-[60px] rounded-full pointer-events-none group-hover:bg-[#C2C9FA]/[0.08] transition-colors duration-500"></div>
              
              {/* Abstract curve */}
              <div className="absolute -bottom-[15%] -right-[15%] w-[90%] h-[70%] border-t-[60px] border-l-[60px] border-[#C2C9FA]/[0.015] rounded-tl-[120px] transform rotate-12 pointer-events-none group-hover:border-[#C2C9FA]/[0.03] transition-colors duration-500"></div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-10 text-[#C2C9FA] transform group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 origin-left">
                  <CardIcon className="text-[#C2C9FA] drop-shadow-[0_0_15px_rgba(194,201,250,0.3)]" />
                </div>
                <h3 className="text-[26px] font-bold text-white mb-8">50 Hour Jet Card</h3>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] rounded-full border border-[#C2C9FA]/60 flex items-center justify-center shrink-0">
                      <div className="w-[6px] h-[6px] bg-[#C2C9FA]/90 rounded-full"></div>
                    </div>
                    <span className="text-[#8B8D91] text-[15px]">Frequent global travellers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] rounded-full border border-[#C2C9FA]/60 flex items-center justify-center shrink-0">
                      <div className="w-[6px] h-[6px] bg-[#C2C9FA]/90 rounded-full"></div>
                    </div>
                    <span className="text-[#8B8D91] text-[15px]">Best value, ultimate convenience</span>
                  </li>
                </ul>
              </div>
              
              <button className="w-full py-4 bg-[#E2E6FF] hover:bg-white text-[#0B1120] font-bold rounded-xl transition-colors relative z-10 mt-auto text-[15px] shadow-[0_4px_20px_rgba(194,201,250,0.1)] group-hover:shadow-[0_4px_25px_rgba(194,201,250,0.2)]">
                Unlock Now
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
