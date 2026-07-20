'use client';
import React, { useState } from 'react';
import { ArrowRight, PlaneTakeoff, PlaneLanding, MousePointerClick, CheckSquare, MessageSquareText, ExternalLink, Link } from 'lucide-react';

export const EmptyLegsInfo = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: '1. Uncompromised Private Experience',
      description: 'Use the search bar above or browse by continent to find deals near you.',
      icon: MousePointerClick
    },
    {
      id: 2,
      title: '2. Select your aircraft',
      description: 'Review aircraft type, seat count, date and price — then click Book Now.',
      icon: CheckSquare
    },
    {
      id: 3,
      title: '3. Confirm your booking',
      description: 'Our 24/7 concierge team will confirm details and handle everything from there.',
      icon: MessageSquareText
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-20 flex flex-col items-center">
      
      <div className="text-center max-w-3xl mb-16">
        <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B1F3A] dark:text-white mb-4 tracking-tight">
          What Are Private Jet Empty Leg Flights?
        </h2>
        <p className="text-[15px] text-gray-500 leading-relaxed max-w-3xl mx-auto">
          An empty leg — also known as a repositioning flight or dead-head flight — occurs when a private jet completes a one-way charter and must return to its base empty. Rather than fly with no passengers <span className="font-bold text-[#0B1F3A] dark:text-white cursor-pointer hover:underline">See More...</span>
        </p>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24 mb-16">
        
        {/* Left Side: Steps */}
        <div className="flex-1 w-full pt-4">
          <h3 className="text-[22px] font-bold text-[#0B1F3A] dark:text-white mb-8">
            How to Book an Empty Leg Flight with Jetbay
          </h3>

          <div className="flex flex-col">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div 
                  key={step.id}
                  className={`px-6 py-6 cursor-pointer transition-colors border-l-[4px] ${
                    isActive 
                      ? 'bg-[#E6F7F6]/60 dark:bg-[#13B2A6]/10 border-[#0B1F3A] dark:border-[#13B2A6]' 
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#152033]'
                  } ${step.id !== steps.length ? 'mb-2' : ''}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <h4 className={`text-[16px] font-bold mb-2 flex items-center gap-3 ${isActive ? 'text-[#0B1F3A] dark:text-white' : 'text-[#0B1F3A]/80 dark:text-gray-300'}`}>
                    <step.icon size={18} className={isActive ? 'text-[#0B1F3A] dark:text-white' : 'text-gray-400'} strokeWidth={2.5} /> {step.title}
                  </h4>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400 pl-8 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Mockup */}
        <div className="flex-1 w-full max-w-[500px]">
          <div className="w-full h-full min-h-[400px] bg-[#F4F6F8] dark:bg-[#152033] rounded-[24px] flex items-center justify-center p-8 md:p-12 relative overflow-hidden transition-all duration-300">
            
            {activeStep === 1 && (
              <div className="w-full bg-white dark:bg-[#0B1121] rounded-[24px] p-8 shadow-sm flex flex-col items-center relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white mb-2">Use the search bar</h4>
                <p className="text-[12px] text-gray-400 mb-8 text-center">Please enter your requirements to search for a model</p>

                <div className="w-full relative mb-3">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <PlaneTakeoff size={16} />
                  </div>
                  <div className="w-full h-[48px] pl-11 pr-4 bg-white dark:bg-[#0B1121] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-gray-400 flex items-center">Leaving From</div>
                  
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#22C2AF] rounded-full flex items-center justify-center text-white z-10 border-2 border-white dark:border-[#0B1121]">
                    <ArrowRight size={14} className="rotate-90" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="w-full relative mb-8">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <PlaneLanding size={16} />
                  </div>
                  <div className="w-full h-[48px] pl-11 pr-4 bg-white dark:bg-[#0B1121] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-gray-400 flex items-center">Going to</div>
                </div>

                <div className="w-full h-[120px] bg-gradient-to-br from-[#29B0A5] to-[#40DACD] rounded-[16px] p-4 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                   <span className="text-white text-[15px] font-bold mb-4 z-10">Click to explore</span>
                   <button className="h-[36px] px-6 bg-white text-[#29B0A5] font-bold text-[13px] rounded-full shadow-sm z-10">
                     Search content
                   </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                <div className="absolute w-[80%] h-[120px] bg-white/50 dark:bg-gray-800/50 rounded-[24px] blur-[2px] top-[-10px] left-[10%] z-0"></div>
                <div className="w-full bg-white dark:bg-[#0B1121] rounded-[24px] p-6 shadow-lg relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-[#E6F7F6] dark:bg-[#13B2A6]/10 rounded-lg flex items-center justify-center text-[#0B1F3A] dark:text-white">
                      <CheckSquare size={20} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0B1F3A] dark:text-white">Select your aircraft</h4>
                      <p className="text-[12px] text-gray-400">See also the following information:</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#F8FAFC] dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] text-gray-500 mb-1">Model</span>
                      <span className="text-[13px] font-bold text-[#0B1F3A] dark:text-white">Gulfstream</span>
                    </div>
                    <div className="flex-1 bg-[#F8FAFC] dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] text-gray-500 mb-1">Seats</span>
                      <span className="text-[13px] font-bold text-[#0B1F3A] dark:text-white">10 <span className="text-[10px] font-normal text-gray-400">per seat</span></span>
                    </div>
                    <div className="flex-1 bg-[#F8FAFC] dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] text-gray-500 mb-1">Date</span>
                      <span className="text-[13px] font-bold text-[#0B1F3A] dark:text-white">2026/*/12</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                <div className="bg-[#29B0A5]/20 text-[#29B0A5] text-[12px] font-bold px-3 py-1 rounded-full w-fit mb-4">
                  24-hour service
                </div>
                <h4 className="text-[32px] md:text-[36px] font-bold text-[#0B1F3A] dark:text-white mb-8 tracking-tight">Confirmation</h4>

                <div className="relative mt-auto mb-4 flex items-center justify-center h-[180px]">
                   <div className="absolute text-center text-gray-200 dark:text-gray-700/30 font-mono text-[10px] leading-tight opacity-60 select-none break-all w-full h-full flex items-center justify-center">
                      011010100011111000110001<br/>
                      1111001101010001111100011110<br/>
                      0001111001101010001111100011000<br/>
                      1000111110001100011111<br/>
                      011010100011111000110001
                   </div>

                   <div className="relative z-10 flex items-end gap-4 w-full">
                     <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-gray-200">
                       <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Concierge" className="w-full h-full object-cover" />
                     </div>
                     <div className="bg-white dark:bg-[#0B1121] rounded-[20px] rounded-bl-none p-5 shadow-lg border border-gray-100 dark:border-gray-800 max-w-[280px]">
                       <p className="text-[14px] text-[#0B1F3A] dark:text-gray-200 font-medium leading-relaxed">
                         Our 24/7 concierge team will confirm details and handle everything from there.
                       </p>
                     </div>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl">
        <button className="h-[48px] px-6 rounded-full bg-[#F4F6F8] dark:bg-[#152033] text-[#13B2A6] text-[14px] font-medium flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ExternalLink size={16} /> Browse Private Jet Charter
        </button>
        <button className="h-[48px] px-6 rounded-full bg-[#F4F6F8] dark:bg-[#152033] text-[#13B2A6] text-[14px] font-medium flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ExternalLink size={16} /> Read our Private Aviation Blog
        </button>
        <button className="h-[48px] px-6 rounded-full bg-[#F4F6F8] dark:bg-[#152033] text-[#13B2A6] text-[14px] font-medium flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Link size={16} /> How to Book a Private Jet
        </button>
      </div>

    </div>
  );
};


