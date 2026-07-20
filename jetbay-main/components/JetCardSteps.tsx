import React from 'react';
import Image from 'next/image';

export const JetCardSteps = () => {
  return (
    <div className="w-full bg-[#070B14] py-24 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">How to Join the Jetbay Jet Card Programme?</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 space-y-12 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-px before:bg-white/10">
            
            <div className="relative pl-14">
              <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white text-[#0B1120] font-bold flex items-center justify-center text-[16px]">
                1
              </div>
              <h3 className="text-[20px] font-bold text-white mb-2">Select Jet Card</h3>
              <p className="text-[14px] text-white/60 leading-relaxed">
                Hourly cards (10/25/50+ hours) meet diverse needs, with low entry & discount by hours purchased.
              </p>
            </div>

            <div className="relative pl-14">
              <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white text-[#0B1120] font-bold flex items-center justify-center text-[16px]">
                2
              </div>
              <h3 className="text-[20px] font-bold text-white mb-2">Submit Membership Request</h3>
              <p className="text-[14px] text-white/60 leading-relaxed">
                Submit your membership request through our team
              </p>
            </div>

            <div className="relative pl-14">
              <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white text-[#0B1120] font-bold flex items-center justify-center text-[16px]">
                3
              </div>
              <h3 className="text-[20px] font-bold text-white mb-2">Access Private Jet</h3>
              <p className="text-[14px] text-white/60 leading-relaxed">
                Enjoy exclusive, hassle-free private jet access
              </p>
            </div>

          </div>

          <div className="w-full md:w-1/2 relative min-h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <Image src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop" alt="Join" fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </div>
  );
};
