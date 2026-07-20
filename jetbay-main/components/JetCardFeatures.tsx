"use client";
import React from 'react';
import { CalendarOff, Zap, LayoutGrid, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const JetCardFeatures = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="w-full bg-[#050608] py-24 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-[32px] md:text-[42px] font-bold text-white mb-6 tracking-tight">Elevate Your Travel with The Jetbay Jet Card</h2>
          <p className="text-[16px] text-white/60">
            The Jetbay Jet Card is a private jet membership programme designed for frequent flyers, business executives, and luxury travellers who require on-demand private aviation with guaranteed availability.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors pointer-events-none"></div>
            <div className="p-8 flex flex-col items-center md:items-start relative z-10 h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F]/40 to-[#0A0A0B] flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(30,58,95,0.5)]">
                 <CalendarOff size={24} className="text-[#40DACD]" />
              </div>
              <h3 className="text-[20px] font-bold text-white mb-3 md:text-left text-center">No blackout dates</h3>
              <p className="text-[14px] text-white/50 md:text-left text-center leading-relaxed">Book anytime, anywhere—just a tap away, ensuring you never miss a critical trip.</p>
            </div>
          </motion.div>
            
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors pointer-events-none"></div>
            <div className="p-8 flex flex-col items-center md:items-start relative z-10 h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F]/40 to-[#0A0A0B] flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(30,58,95,0.5)]">
                 <Zap size={24} className="text-[#40DACD]" />
              </div>
              <h3 className="text-[20px] font-bold text-white mb-3 md:text-left text-center">Priority access</h3>
              <p className="text-[14px] text-white/50 md:text-left text-center leading-relaxed">Secure your flight instantly, even during peak seasons when others cannot.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors pointer-events-none"></div>
            <div className="p-8 flex flex-col items-center md:items-start relative z-10 h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F]/40 to-[#0A0A0B] flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(30,58,95,0.5)]">
                 <LayoutGrid size={24} className="text-[#40DACD]" />
              </div>
              <h3 className="text-[20px] font-bold text-white mb-3 md:text-left text-center">Seamless booking</h3>
              <p className="text-[14px] text-white/50 md:text-left text-center leading-relaxed">No negotiations, instant access to a premium fleet without the usual hassle.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors pointer-events-none"></div>
            <div className="p-8 flex flex-col items-center md:items-start relative z-10 h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F]/40 to-[#0A0A0B] flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(30,58,95,0.5)]">
                 <Award size={24} className="text-[#40DACD]" />
              </div>
              <h3 className="text-[20px] font-bold text-white mb-3 md:text-left text-center">Luxury experience</h3>
              <p className="text-[14px] text-white/50 md:text-left text-center leading-relaxed">VIP lounges, personalised service, and world-class aircraft on every trip.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
