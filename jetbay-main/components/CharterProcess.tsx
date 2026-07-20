import React from 'react';

export const CharterProcess = () => {
  const steps = [
    { num: 1, title: "Share Your Itinerary", desc: "Share your travel requirements online." },
    { num: 2, title: "Select Your Aircraft", desc: "Choose the ideal aircraft for your mission." },
    { num: 3, title: "Quotation", desc: "Receive Your Tailored Quotation." },
    { num: 4, title: "Contract & Payment", desc: "Endorse & Make Payment." },
    { num: 5, title: "Enjoy Your Trip", desc: "Relax and Enjoy Your Journey." },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] mb-2 leading-[1.15]">The JETBAY Charter Process</h2>
      <p className="text-[#4A4A4A] dark:text-gray-300 text-[16.5px] mb-12">Your Journey, Effortlessly Arranged.</p>
      
      <div className="bg-[#F8FAFC] dark:bg-[#152033]/40 rounded-[32px] p-8 md:p-12 relative border border-gray-100/90 dark:border-gray-800 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.02)]">
        <div className="hidden md:block absolute top-[88px] left-[10%] right-[10%] h-[1px] bg-gray-150 dark:bg-gray-800/80"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center md:items-start">
              <div className="w-16 h-16 bg-white dark:bg-[#1C293E] rounded-2xl flex items-center justify-center text-[#0B1F3A] dark:text-white text-2xl font-semibold shadow-[0_6px_16px_rgba(0,0,0,0.02)] mb-6 border border-gray-100 dark:border-gray-800">
                {step.num}
              </div>
              <div className="text-center md:text-left px-2 md:px-0">
                <h3 className="text-[#0B1F3A] dark:text-white font-bold text-[16px] mb-2">{step.title}</h3>
                <p className="text-[#4A4A4A] dark:text-gray-400 text-[14px] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

