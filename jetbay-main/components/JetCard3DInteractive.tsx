"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Shield, Sparkles, Navigation2, Compass, AlertCircle } from 'lucide-react';

export const JetCard3DInteractive = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinates relative to card
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // Smooth springs for high-end heavy-metal/carbon-fiber feel
  const rotateX = useSpring(rotateXVal, { damping: 25, stiffness: 150 });
  const rotateY = useSpring(rotateYVal, { damping: 25, stiffness: 150 });

  // For shimmering glare reflection
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacityVal = useMotionValue(0);
  const glareOpacity = useSpring(glareOpacityVal, { damping: 20, stiffness: 150 });

  // Map mouse positions to rotation degrees (tilt effect)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (-15 to 15 degrees)
    const rY = ((mouseX / width) - 0.5) * 30;
    const rX = (((mouseY / height) - 0.5) * -30);

    rotateXVal.set(rX);
    rotateYVal.set(rY);

    // Dynamic glare coordinates (percentage 0 to 100)
    glareX.set((mouseX / width) * 100);
    glareY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    glareOpacityVal.set(0.6);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateXVal.set(0);
    rotateYVal.set(0);
    glareOpacityVal.set(0);
  };

  // Convert X and Y rotations to visual gradients
  const bgGradient = useTransform(
    [rotateX, rotateY],
    ([rx, ry]) => {
      // Create a subtle metallic shifting gradient based on tilt
      return `linear-gradient(${135 + (rx as number) * 2}deg, #0f172a 0%, #1e293b 40%, #0f172a 70%, #1e1b4b 100%)`;
    }
  );

  return (
    <div className="w-full bg-[#050608] py-20 relative overflow-hidden flex flex-col items-center">
      {/* Decorative Flight Instruments Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-[radial-gradient(#40DACD_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Flight HUD Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/[0.03] rounded-full pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] border border-[#40DACD]/5 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '60s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#40DACD]/30 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#40DACD]/30 rounded-full"></div>
        </div>
        <div className="w-[300px] h-[300px] border border-white/[0.02] rounded-full"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full flex flex-col items-center">
        <div className="text-center max-w-2xl mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#40DACD]/10 border border-[#40DACD]/20 mb-4"
          >
            <Compass size={14} className="text-[#40DACD] animate-pulse" />
            <span className="text-[12px] font-bold text-[#40DACD] tracking-wider uppercase">Interactive Aviation Tech</span>
          </motion.div>
          <h2 className="text-[32px] md:text-[45px] font-bold text-white tracking-tight leading-tight mb-4">
            The Carbon-Platinum Card
          </h2>
          <p className="text-[15px] md:text-[16px] text-white/50 leading-relaxed">
            Move your cursor over the Jet Card to test-fly its high-definition metallic and holographic response, built using aviation carbon-composites.
          </p>
        </div>

        {/* Outer 3D Perspective Stage */}
        <div className="relative w-full max-w-[900px] flex flex-col lg:flex-row items-center justify-center gap-16 perspective-2000 py-6">
          
          {/* LEFT: Dynamic Flight Instruments Dashboard */}
          <div className="w-full max-w-[280px] space-y-4 text-left border-l border-white/5 pl-6 hidden lg:block">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#40DACD]/70 font-semibold font-mono">Flight Horizon</span>
              <div className="h-[2px] w-12 bg-gradient-to-r from-[#40DACD] to-transparent"></div>
            </div>
            
            {/* Artificial Horizon Gyroscope widget */}
            <div className="bg-[#0b0c10] border border-white/10 rounded-xl p-4 font-mono text-[11px] text-white/60 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-white/80">
                <span>PITCH / ROLL</span>
                <span className="text-[#40DACD] font-bold animate-pulse">ACTIVE</span>
              </div>
              
              {/* Gyro Scope visualizer */}
              <div className="h-28 bg-[#07080a] rounded-lg relative overflow-hidden flex items-center justify-center border border-white/5">
                <motion.div 
                  style={{ rotate: rotateY, y: useTransform(rotateX, (val) => (val as number) * -1.5) }}
                  className="w-40 h-40 border-t-2 border-b-2 border-dashed border-[#40DACD]/30 flex items-center justify-center"
                >
                  <div className="w-24 h-[1px] bg-white/25 absolute"></div>
                  <div className="w-[1px] h-24 bg-white/25 absolute"></div>
                  <div className="w-12 h-12 rounded-full border border-white/10 absolute flex items-center justify-center">
                    <Navigation2 size={12} className="text-[#40DACD] transform rotate-45" />
                  </div>
                </motion.div>
                {/* Horizontal reference bars */}
                <div className="absolute inset-x-2 h-[1px] bg-red-500/40 z-20 flex justify-between items-center">
                  <div className="w-4 h-1 bg-red-500"></div>
                  <div className="w-4 h-1 bg-red-500"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                  <div className="text-white/30">ROLL DEGS</div>
                  <motion.div className="text-white font-bold">{useTransform(rotateY, (v) => `${(v as number).toFixed(1)}°`)}</motion.div>
                </div>
                <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                  <div className="text-white/30">PITCH DEGS</div>
                  <motion.div className="text-white font-bold">{useTransform(rotateX, (v) => `${(v as number).toFixed(1)}°`)}</motion.div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 items-center text-xs text-white/40">
              <Shield size={14} className="text-[#40DACD]" />
              <span>RFID Secured / Global Network</span>
            </div>
          </div>

          {/* MIDDLE: THE 3D INTERACTIVE CARD */}
          <div className="relative z-20">
            {/* Card Shadows & Glowing Rings */}
            <motion.div 
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 bg-gradient-to-tr from-[#40DACD]/10 to-[#8896FF]/10 rounded-3xl blur-2xl opacity-60 pointer-events-none"
            />

            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                background: bgGradient,
                transformStyle: "preserve-3d",
              }}
              className="w-[340px] md:w-[420px] h-[220px] md:h-[260px] rounded-3xl p-6 md:p-8 cursor-grab relative overflow-hidden border border-white/15 shadow-[0_40px_80px_rgba(0,0,0,0.8)] select-none group"
            >
              {/* Inner Card Content Wrapper with 3D Translation */}
              <div className="w-full h-full flex flex-col justify-between relative z-10" style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>
                
                {/* Top Row: Brand & Holographic Chip */}
                <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#40DACD] to-[#1e3a8a] rounded flex items-center justify-center transform -skew-x-12 relative overflow-hidden">
                      <Navigation2 size={12} className="text-white absolute transform rotate-45" />
                    </div>
                    <span className="font-extrabold text-[16px] md:text-[18px] tracking-tight text-white">
                      Jet<span className="text-[#40DACD]">bay</span>
                    </span>
                  </div>

                  {/* Holographic Smart Chip */}
                  <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] via-[#fcd34d] to-[#d97706] relative overflow-hidden border border-white/10 flex items-center justify-center shadow-inner">
                    <div className="absolute inset-1 border border-black/10 rounded flex grid grid-cols-3 gap-0.5 opacity-60">
                      <div className="border-r border-b border-black/10"></div>
                      <div className="border-r border-b border-black/10"></div>
                      <div className="border-b border-black/10"></div>
                      <div className="border-r border-black/10"></div>
                      <div className="border-r border-black/10"></div>
                      <div></div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Gold-Embossed World Map & Flight Path */}
                <div className="absolute inset-x-0 top-[25%] bottom-[25%] opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity duration-500" style={{ transform: "translateZ(10px)" }}>
                  <svg className="w-full h-full text-white" viewBox="0 0 400 150" fill="none" stroke="currentColor" strokeWidth="1">
                    {/* Abstract Continents / Flight Paths */}
                    <path d="M50,80 Q150,20 250,90 T350,40" strokeDasharray="4 4" className="animate-pulse" />
                    <circle cx="50" cy="80" r="3" fill="#40DACD" />
                    <circle cx="250" cy="90" r="3" fill="#40DACD" />
                    <circle cx="350" cy="40" r="3" fill="#40DACD" />
                    
                    {/* Curved route */}
                    <path d="M100,110 Q200,40 300,100" stroke="#40DACD" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Bottom Row: Elite Name & Fleet Grade */}
                <div className="flex justify-between items-end" style={{ transform: "translateZ(30px)" }}>
                  <div className="space-y-0.5">
                    <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-mono">Cardmember</div>
                    <div className="text-[13px] md:text-[15px] font-bold text-white tracking-wide font-mono uppercase">
                      Alex Thorne
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#40DACD] font-mono font-bold flex items-center justify-end gap-1">
                      <Sparkles size={8} className="animate-spin-slow" />
                      <span>Carbon Elite</span>
                    </div>
                    <div className="text-[10px] md:text-[11px] font-semibold text-white/70 font-mono">
                      ID: JB-987-00X
                    </div>
                  </div>
                </div>

              </div>

              {/* Holographic Specular Glare Layer (Shifts with Mouse) */}
              <motion.div
                style={{
                  background: useTransform(
                    [glareX, glareY],
                    ([gx, gy]) =>
                      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 70%)`
                  ),
                  opacity: glareOpacity,
                }}
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay transition-opacity duration-300"
              />

              {/* Premium Fine Lines Overlay */}
              <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none z-30"></div>
            </motion.div>
          </div>

          {/* RIGHT: Flight Specs Status Bar */}
          <div className="w-full max-w-[280px] space-y-4 text-left border-l border-white/5 pl-6 hidden lg:block">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#40DACD]/70 font-semibold font-mono">Aircraft Specs</span>
              <div className="h-[2px] w-12 bg-gradient-to-r from-[#40DACD] to-transparent"></div>
            </div>

            <div className="bg-[#0b0c10] border border-white/10 rounded-xl p-4 font-mono text-[11px] text-white/60 space-y-3.5 shadow-inner">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>DISPATCH TIME</span>
                  <span className="text-white font-bold">&lt; 2.5 HRS</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                  <div className="bg-[#40DACD] h-full w-[90%]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>ALTITUDE CEILING</span>
                  <span className="text-white font-bold">51,000 FT</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                  <div className="bg-[#40DACD] h-full w-[95%]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>SAFETY RATING</span>
                  <span className="text-white font-bold">ARGUS GOLD+</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                  <div className="bg-[#40DACD] h-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 items-center text-xs text-white/40">
              <AlertCircle size={14} className="text-[#40DACD]" />
              <span>Fixed Flight Rates Guaranteed</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
