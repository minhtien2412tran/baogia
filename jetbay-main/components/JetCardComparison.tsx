"use client";

import React from 'react';
import { Check, DollarSign, RotateCcw, AlertCircle, Gem } from 'lucide-react';
import { motion } from 'motion/react';

export const JetCardComparison = () => {
  const rows = [
    {
      feature: 'Booking',
      onDemand: 'Request-based, subject to availability',
      onDemandIcon: null,
      jetCard: 'Instant booking',
      jetCardIcon: <Check size={14} className="text-[#0B1120]" />,
      jetCardIconBg: 'bg-[#DFE3FF]',
    },
    {
      feature: 'Pricing',
      onDemand: 'Varies by route & demand',
      onDemandIcon: <DollarSign size={14} className="text-[#A0A0A0]" />,
      onDemandIconBg: 'bg-[#2A2A2A]',
      jetCard: 'Fixed hourly rate — no surprises',
      jetCardIcon: null,
    },
    {
      feature: 'Flexibility',
      onDemand: 'Depends on operator',
      onDemandIcon: null,
      jetCard: 'Easy change / cancel',
      jetCardIcon: <RotateCcw size={14} className="text-[#0B1120]" />,
      jetCardIconBg: 'bg-[#DFE3FF]',
    },
    {
      feature: 'Peak Seasons',
      onDemand: 'May have surcharges or limits',
      onDemandIcon: <AlertCircle size={14} className="text-[#A0A0A0]" />,
      onDemandIconBg: 'bg-[#2A2A2A]',
      jetCard: 'No blackout dates',
      jetCardIcon: null,
    },
    {
      feature: 'Payment',
      onDemand: 'Pay per trip',
      onDemandIcon: null,
      jetCard: 'Prepaid flight hours',
      jetCardIcon: null,
    },
    {
      feature: 'Service',
      onDemand: 'Standard service',
      onDemandIcon: null,
      jetCard: 'Dedicated manager & 24/7 support',
      jetCardIcon: <Gem size={14} className="text-[#0B1120]" />,
      jetCardIconBg: 'bg-[#DFE3FF]',
    },
    {
      feature: 'Experience',
      onDemand: 'Varies by operator',
      onDemandIcon: null,
      jetCard: 'Consistent aircraft & quality',
      jetCardIcon: null,
    },
    {
      feature: 'Ideal For',
      onDemand: 'Occasional or one-off trips',
      onDemandIcon: null,
      jetCard: 'Frequent flyers (25+ hrs/year)',
      jetCardIcon: null,
    },
  ];

  return (
    <div className="w-full bg-[#050608] py-24 relative overflow-hidden">
      {/* Background Glows */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#DFE3FF]/[0.02] blur-[100px] rounded-full pointer-events-none"
      ></motion.div>

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#F8FAFC] tracking-tight">Jetbay Jet Card vs On-Demand Charter</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#0A0A0C] shadow-2xl"
        >
          
          {/* Abstract curve graphic intersecting the table */}
          <div className="absolute top-[10%] right-[-10%] w-[80%] h-[120%] border-t-[80px] border-l-[80px] border-white/[0.015] rounded-tl-[200px] transform rotate-12 pointer-events-none"></div>
          
          {/* Third Column Highlight Overlay */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>

          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10 relative z-10">
            <div className="hidden md:flex p-6 md:p-8 items-center">
              <h3 className="text-[18px] font-bold text-white">Compare Plans</h3>
            </div>
            <div className="p-6 md:p-8 border-l border-white/5 flex flex-col justify-end">
              <button className="px-6 py-3.5 bg-[#1F1F21] hover:bg-[#2A2A2C] text-white/90 text-[15px] font-bold rounded-xl transition-colors w-full border border-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
                Book Now
              </button>
            </div>
            <div className="p-6 md:p-8 border-l border-white/5 relative flex flex-col justify-end">
              <button className="px-6 py-3.5 bg-gradient-to-r from-[#DFE3FF] to-[#D4D9FF] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] text-[#0B1120] text-[15px] font-bold rounded-xl transition-all w-full shadow-[0_4px_20px_rgba(223,227,255,0.15)]">
                Unlock Now
              </button>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5 relative z-10">
            {rows.map((row, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 hover:bg-white/[0.02] transition-colors group cursor-default"
              >
                <div className="p-5 md:p-6 flex items-center bg-black/20 group-hover:bg-transparent transition-colors">
                  <span className="text-[15px] font-bold text-white group-hover:text-[#DFE3FF] transition-colors">{row.feature}</span>
                </div>
                <div className="p-5 md:p-6 md:border-l border-white/5 flex items-center justify-between">
                  <span className="text-[14px] text-white/50">{row.onDemand}</span>
                  {row.onDemandIcon && (
                    <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ml-4 ${row.onDemandIconBg}`}>
                      {row.onDemandIcon}
                    </div>
                  )}
                </div>
                <div className="p-5 md:p-6 md:border-l border-white/5 flex items-center justify-between bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors">
                  <span className="text-[14px] text-white font-medium">{row.jetCard}</span>
                  {row.jetCardIcon && (
                    <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ml-4 ${row.jetCardIconBg} shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300`}>
                      {row.jetCardIcon}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
