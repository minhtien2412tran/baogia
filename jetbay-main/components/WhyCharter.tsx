import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

export const WhyCharter = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
        
        {/* Left Content Card */}
        <div className="w-full lg:w-1/2 bg-white border border-[#EAEAEA] rounded-[24px] p-8 lg:p-12 xl:p-16 flex flex-col justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#F5F7FA] border border-[#E9EDF2] text-[#0B1F3A] px-4 py-1.5 rounded-full text-[13px] font-medium w-max mb-8">
            <User size={15} strokeWidth={1.5} />
            About Us
          </div>
          
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] mb-5 leading-[1.15] tracking-[-0.02em]">
            Why Charter with Jetbay?
          </h2>
          
          <p className="text-[16.5px] text-[#4A4A4A] mb-8 leading-relaxed">
            Jetbay offers bespoke charter solutions, connecting you to a global fleet.
          </p>
          
          <ul className="space-y-4 mb-10">
            {[
              'Access 10,000+ aircraft across 1,000+ operators',
              '24/7 global concierge support',
              'AI-driven aircraft matching',
              'Transparent end-to-end booking support'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3.5 text-[15.5px] text-[#333333]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#050505] mt-[9px] shrink-0"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-2">
            <button className="bg-[#40DACD] hover:bg-[#34C4B8] text-[#050505] px-7 py-3 rounded-[8px] font-bold text-[14.5px] transition-colors w-max shadow-sm">
              Learn More About Jetbay
            </button>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto rounded-[24px] overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop" 
            alt="Private Jet on Tarmac" 
            fill 
            className="object-cover" 
            unoptimized
          />
        </div>
      </div>
    </div>
  )
}
