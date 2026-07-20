import React from 'react';
import { PercentCircle, Crown, Globe, CheckSquare, Clock, ShieldCheck } from 'lucide-react';

export const EmptyLegsWhyChoose = () => {
  const reasons = [
    {
      icon: <PercentCircle size={20} className="text-[#0B1F3A] dark:text-white" strokeWidth={2} />,
      title: "Up to 75% Savings",
      desc: "Access the same aircraft, crew, and luxury amenities as a full charter at a fraction of the cost."
    },
    {
      icon: <Crown size={20} className="text-[#0B1F3A] dark:text-white" strokeWidth={2} />,
      title: "Uncompromised Private Experience",
      desc: "Enjoy the same comfort, service, and amenities as a full charter."
    },
    {
      icon: <Globe size={20} className="text-[#0B1F3A] dark:text-white" strokeWidth={2} />,
      title: "Global Empty Leg Private Jet Routes",
      desc: "Search real-time empty leg private jet flights departing across and internationally."
    },
    {
      icon: <CheckSquare size={20} className="text-[#0B1F3A] dark:text-white" strokeWidth={2} />,
      title: "Seamless Booking Process",
      desc: "Browse available flights and request your booking with ease through Jetbay's AI-powered platform."
    },
    {
      icon: <Clock size={20} className="text-[#0B1F3A] dark:text-white" strokeWidth={2} />,
      title: "Ideal for Flexible Travel",
      desc: "Perfect for individuals, couples, or small groups with spontaneous and flexible schedules."
    },
    {
      icon: <ShieldCheck size={20} className="text-[#0B1F3A] dark:text-white" strokeWidth={2} />,
      title: "Verified Private Jet Empty Leg Listings",
      desc: "Every empty leg private jet on Jetbay is operator-verified, so you can book with confidence and fly worry-free."
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0B1121]/50 py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col items-center">
        
        <h2 className="text-[32px] md:text-[38px] font-bold text-[#0B1F3A] dark:text-white mb-3 text-center tracking-[-0.02em]">
          Why Choose Empty Leg Flights with Jetbay
        </h2>
        <p className="text-[15px] text-gray-500 mb-16 text-center">
          Book empty leg private jet flights worldwide
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white dark:bg-[#152033] rounded-[16px] border border-gray-100 dark:border-gray-800 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] transition-shadow">
              <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6">
                {r.icon}
              </div>
              <h3 className="text-[16px] font-bold text-[#0B1F3A] dark:text-white mb-3">{r.title}</h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
