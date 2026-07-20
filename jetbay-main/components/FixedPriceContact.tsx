"use client";
import React, { useState } from 'react';
import { PlaneTakeoff, PlaneLanding, Calendar, User, Minus, Plus, ChevronDown, Check } from 'lucide-react';

export const FixedPriceContact = () => {
  const [tab, setTab] = useState('One-way');
  const [pax, setPax] = useState(2);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  return (
    <div className="relative w-full overflow-hidden py-24 flex justify-center">
      
      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-full flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[18vw] font-black text-gray-50/80 dark:text-gray-800/20 tracking-tighter whitespace-nowrap leading-none">
          ON DEMAND
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="px-4 py-1.5 bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 rounded-full flex items-center gap-2 mb-6 shadow-sm">
            <Calendar size={14} className="text-[#13B2A6]" />
            <span className="text-[12px] font-bold text-[#0B1F3A] dark:text-gray-300 tracking-wide uppercase">Plan Your Flight</span>
          </div>
          <h2 className="text-[32px] md:text-[38px] font-bold text-[#0B1F3A] dark:text-white mb-4 tracking-[-0.02em]">Looking for a Specific Route?</h2>
          <p className="text-[16px] text-gray-500 max-w-2xl">
            Tell us your preferred departure and destination — our charter experts will build a custom solution for you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#152033] rounded-[32px] p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 bg-gray-50 dark:bg-[#0B1121] p-1.5 rounded-xl w-fit">
            {['One-way', 'Round-trip', 'Multi-city'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${
                  tab === t 
                    ? 'bg-[#E6F7F6] text-[#13B2A6] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <form className="flex flex-col gap-6">
            
            {/* Row 1: Flight Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <PlaneTakeoff size={18} />
                  </div>
                  <input type="text" placeholder="From" className="w-full h-[52px] pl-11 pr-4 bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow text-[#0B1F3A] dark:text-white" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <PlaneLanding size={18} />
                  </div>
                  <input type="text" placeholder="To" className="w-full h-[52px] pl-11 pr-4 bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow text-[#0B1F3A] dark:text-white" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-2">Departure (Local)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input type="text" placeholder="17 / Jul / 2026" className="w-full h-[52px] pl-11 pr-4 bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow text-[#0B1F3A] dark:text-white shadow-sm" defaultValue="17 / Jul / 2026" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-2">Passengers</label>
                <div className="relative flex items-center h-[52px] bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-700 rounded-xl px-2 shadow-sm">
                  <div className="px-2 text-gray-400">
                    <User size={18} />
                  </div>
                  <div className="flex-1 text-center font-medium text-[15px] text-[#0B1F3A] dark:text-white border-x border-gray-100 dark:border-gray-800 h-full flex items-center justify-center">
                    {pax}
                  </div>
                  <div className="flex items-center">
                    <button type="button" onClick={() => setPax(Math.max(1, pax - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                      <Minus size={16} />
                    </button>
                    <button type="button" onClick={() => setPax(pax + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 & 3: Contact Info */}
            <div className="flex flex-col gap-4">
              <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Contact Info <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Please enter your first name" className="w-full h-[52px] px-4 bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow text-[#0B1F3A] dark:text-white" />
                <input type="text" placeholder="Please enter your last name" className="w-full h-[52px] px-4 bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow text-[#0B1F3A] dark:text-white" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="email" placeholder="Please enter your email" className="w-full h-[52px] px-4 bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow text-[#0B1F3A] dark:text-white" />
                
                <div className="relative flex">
                  <div className="flex-shrink-0 flex items-center justify-between w-[90px] h-[52px] bg-gray-50 dark:bg-[#0B1121] border border-r-0 border-gray-200 dark:border-gray-800 rounded-l-xl px-3 cursor-pointer text-[14px] text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5"><span className="text-red-500 leading-none mt-1">v</span> +84</span>
                    <ChevronDown size={14} />
                  </div>
                  <input type="tel" placeholder="Please enter your phone number" className="flex-1 h-[52px] px-4 bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-r-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow text-[#0B1F3A] dark:text-white" />
                </div>
              </div>
            </div>

            {/* Row 4: Message */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea placeholder="Please leave your message here for any requests or special requirements." className="w-full h-[100px] p-4 bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 transition-shadow resize-none text-[#0B1F3A] dark:text-white"></textarea>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-3 mt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B1121] group-hover:border-[#13B2A6] transition-colors">
                  <input type="checkbox" className="absolute opacity-0 cursor-pointer w-0 h-0" checked={consent1} onChange={(e) => setConsent1(e.target.checked)} />
                  {consent1 && <Check size={14} strokeWidth={3} className="text-[#13B2A6]" />}
                </div>
                <span className="text-[13px] text-gray-600 dark:text-gray-400 leading-tight">
                  I hereby consent to be contacted by Jetbay regarding my flight booking.
                </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B1121] group-hover:border-[#13B2A6] transition-colors">
                  <input type="checkbox" className="absolute opacity-0 cursor-pointer w-0 h-0" checked={consent2} onChange={(e) => setConsent2(e.target.checked)} />
                  {consent2 && <Check size={14} strokeWidth={3} className="text-[#13B2A6]" />}
                </div>
                <span className="text-[13px] text-gray-600 dark:text-gray-400 leading-tight">
                  By using the services, I acknowledge that I have read, understood, and agree to the <a href="#" className="text-[#13B2A6] underline hover:no-underline underline-offset-2">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="button" className="w-full h-[56px] bg-[#13B2A6] hover:bg-[#10998f] text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-colors mt-2 shadow-[0_8px_20px_-8px_rgba(19,178,166,0.5)]">
              <PlaneTakeoff size={18} />
              Submit
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};
