"use client";
import React from 'react';
import Image from 'next/image';
import { Plane, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const JetCardHero = () => {
  return (
    <div className="w-full bg-[#050608] pt-20 pb-32 relative overflow-hidden flex flex-col items-center min-h-[800px] perspective-1000">
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1B2845]/40 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#40DACD]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#DFE3FF]/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Starfield / Particles */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen"></div>

      <div className="max-w-[1200px] mx-auto px-6 text-center w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-24"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Star size={14} className="text-[#40DACD]" />
            <span className="text-[13px] font-medium text-white/80 tracking-wide uppercase">Elite Membership</span>
          </motion.div>
          
          <h1 className="text-[42px] md:text-[64px] font-extrabold text-white mb-6 tracking-tight max-w-4xl mx-auto leading-[1.1]">
            The Ultimate Private Jet <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#DFE3FF] to-[#8896FF]">
              Membership
            </span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Flexible access to a vast network of private jet aircraft worldwide with guaranteed availability and fixed hourly rates.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center mt-12 gap-12 relative w-full h-[450px]">
          {/* The Planet Curve */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[120%] lg:w-[110%] h-[600px] border-t-[1px] border-white/10 rounded-[100%] shadow-[0_-40px_80px_-20px_rgba(223,227,255,0.08)] pointer-events-none bg-gradient-to-b from-[#0A0B10]/80 to-[#050608] backdrop-blur-sm"
          ></motion.div>
          
          {/* Outer glow for the planet */}
          <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[100%] h-[300px] bg-[#DFE3FF]/5 blur-[80px] rounded-full pointer-events-none"></div>

          {/* Floating Elements on Curve */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[0%] left-[25%] md:left-[28%] -translate-x-1/2 w-14 h-14 rounded-full bg-[#111827] flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] hidden md:flex z-30 backdrop-blur-md"
          >
            <Plane size={20} className="text-white/80 transform -rotate-12" />
          </motion.div>

          {/* Icons/Images */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute top-[-15%] left-[50%] -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-[4px] border-[#0A0B10] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40 group"
          >
            <Image src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=300&auto=format&fit=crop" alt="Champagne" fill className="object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -30, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
            className="absolute top-[15%] left-[12%] md:left-[22%] w-28 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block z-20 cursor-pointer"
          >
            <Image src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=300&auto=format&fit=crop" alt="Eiffel Tower" fill className="object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 8 }}
            transition={{ duration: 1, delay: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
            className="absolute top-[12%] right-[12%] md:right-[22%] w-28 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block z-20 cursor-pointer"
          >
            <Image src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=300&auto=format&fit=crop" alt="Statue" fill className="object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            className="absolute bottom-[25%] left-[15%] md:left-[30%] w-36 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-30 hidden md:block cursor-pointer"
          >
            <Image src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=400&auto=format&fit=crop" alt="Jet interior" fill className="object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            className="absolute bottom-[20%] right-[15%] md:right-[32%] w-40 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-30 hidden md:block cursor-pointer"
          >
            <Image src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=400&auto=format&fit=crop" alt="Golden Gate" fill className="object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[45%] right-[22%] md:right-[25%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#111827] flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] hidden md:flex z-30 backdrop-blur-md"
          >
            <Star size={16} className="text-[#DFE3FF]" />
          </motion.div>

        </div>
      </div>
    </div>
  );
};

