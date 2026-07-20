import React from 'react';
import Link from 'next/link';

export const JetCardForm = () => {
  return (
    <div className="w-full bg-[#070B14] py-24 relative overflow-hidden">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight mb-4">Unlock Exclusive Access with Jetbay JET Card</h2>
          <p className="text-[15px] text-white/60">
            Please provide your contact information to enquire about our JET Card Program.
          </p>
        </div>

        <form className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/80">First Name <span className="text-red-500">*</span></label>
              <input type="text" className="w-full bg-[#070B14] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-[14px]" placeholder="Please enter your first name" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/80">Last Name <span className="text-red-500">*</span></label>
              <input type="text" className="w-full bg-[#070B14] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-[14px]" placeholder="Please enter your last name" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/80">Email <span className="text-red-500">*</span></label>
              <input type="email" className="w-full bg-[#070B14] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-[14px]" placeholder="Please enter your email" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/80">Phone Number <span className="text-red-500">*</span></label>
              <div className="flex">
                <button type="button" className="bg-[#070B14] border border-white/20 border-r-0 rounded-l-lg px-3 py-3 text-white flex items-center gap-2 text-[14px]">
                  <span>🇻🇳</span> +84 
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <input type="tel" className="flex-1 bg-[#070B14] border border-white/20 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-[14px]" placeholder="Please enter your phone number" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-white/80">Message</label>
            <textarea rows={4} className="w-full bg-[#111827] border-0 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors text-[14px] resize-none" placeholder="Please leave your message here for any requests or special requirements."></textarea>
          </div>

          <div className="pt-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 bg-[#070B14] border-white/20 rounded text-[#2563EB] focus:ring-0 w-4 h-4" />
                <span className="text-[13px] text-white/80">I hereby consent to be contacted by Jetbay regarding my flight booking.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 bg-[#070B14] border-white/20 rounded text-[#2563EB] focus:ring-0 w-4 h-4" />
                <span className="text-[13px] text-white/80">By using the services, I acknowledge that I have read, understood, and agree to the <Link href="#" className="text-[#3B82F6] hover:underline">Privacy Policy</Link>.</span>
              </label>
            </div>
            
            <button type="button" className="shrink-0 px-8 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg transition-colors text-[14px]">
              Unlock Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
