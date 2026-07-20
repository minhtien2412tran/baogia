import React from 'react';
import { Clock, Shield, Award, Headphones, Globe, Star } from 'lucide-react';

export const WhyChoose = () => {
  const reasons = [
    {
      icon: <Clock className="text-[#0B1F3A] dark:text-white" size={24} strokeWidth={1.5} />,
      title: "24/7 Availability",
      desc: "Support is available whenever you need to fly."
    },
    {
      icon: <Shield className="text-[#0B1F3A] dark:text-white" size={24} strokeWidth={1.5} />,
      title: "Trusted Safety",
      desc: "Flights arranged with vetted operators and high standards."
    },
    {
      icon: <Award className="text-[#0B1F3A] dark:text-white" size={24} strokeWidth={1.5} />,
      title: "Luxury Experience",
      desc: "Enjoy premium comfort, privacy, and flexibility onboard."
    },
    {
      icon: <Headphones className="text-[#0B1F3A] dark:text-white" size={24} strokeWidth={1.5} />,
      title: "Dedicated Service",
      desc: "Receive attentive support throughout your journey."
    },
    {
      icon: <Globe className="text-[#0B1F3A] dark:text-white" size={24} strokeWidth={1.5} />,
      title: "Global Network",
      desc: "Fly across major cities and destinations worldwide."
    },
    {
      icon: <Star className="text-[#0B1F3A] dark:text-white" size={24} strokeWidth={1.5} />,
      title: "Flexible & Tailored",
      desc: "Choose flight solutions built around your travel plans."
    }
  ];

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0d1526] py-24 mb-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-[#152033] text-[#0B1F3A] dark:text-gray-200 px-4 py-2 rounded-full text-[13px] font-semibold mb-6 border border-gray-200 dark:border-gray-800">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#13B2A6] dark:text-[#40DACD]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          What Sets Us Apart
        </div>
        
        <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-4 leading-[1.1] tracking-[-0.02em]">
          Why Choose Jetbay?
        </h2>
        
        <p className="text-[#4A4A4A] dark:text-gray-400 text-[16.5px] leading-relaxed mb-16">
          Excellence in Every Detail
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {reasons.map((reason, i) => (
            <div key={i} className="bg-white dark:bg-[#152033] rounded-[24px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="mb-6">
                {reason.icon}
              </div>
              <h3 className="text-[#0B1F3A] dark:text-white font-bold text-[18px] mb-3">{reason.title}</h3>
              <p className="text-[#4A4A4A] dark:text-gray-400 text-[15px] leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
