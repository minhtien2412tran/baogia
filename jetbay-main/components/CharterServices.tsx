import React from 'react';
import { Plane, Briefcase, Calendar, Stethoscope, Package, Users } from 'lucide-react';

export const CharterServices = () => {
  const services = [
    { 
      title: "On-Demand Charter", 
      desc: "Instant access to a global fleet of private jets. Fly on your schedule with seamless booking and ultimate flexibility.",
      icon: <Plane className="text-[#40DACD]" size={24} strokeWidth={1.5} />
    },
    { 
      title: "Corporate Travel", 
      desc: "Optimise your team's travel with tailored corporate aviation solutions designed for efficiency and productivity.",
      icon: <Briefcase className="text-[#40DACD]" size={24} strokeWidth={1.5} />
    },
    { 
      title: "Empty Legs", 
      desc: "Take advantage of repositioning flights to enjoy private jet travel at significantly reduced rates.",
      icon: <Calendar className="text-[#40DACD]" size={24} strokeWidth={1.5} />
    },
    { 
      title: "Medical Flights", 
      desc: "Rapid response and specialised air ambulance services for urgent medical transportation needs globally.",
      icon: <Stethoscope className="text-[#40DACD]" size={24} strokeWidth={1.5} />
    },
    { 
      title: "Cargo Charter", 
      desc: "Secure and timely transport for critical freight, oversized cargo, or sensitive materials worldwide.",
      icon: <Package className="text-[#40DACD]" size={24} strokeWidth={1.5} />
    },
    { 
      title: "Group Charter", 
      desc: "Coordinate travel for large groups, sports teams, or events with dedicated large-capacity aircraft.",
      icon: <Users className="text-[#40DACD]" size={24} strokeWidth={1.5} />
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 text-center">
      <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] mb-4 leading-[1.15]">Beyond Ordinary Travel</h2>
      <p className="text-[#4A4A4A] dark:text-gray-400 text-[16.5px] max-w-2xl mx-auto mb-16 leading-relaxed">
        Experience the ultimate in flexibility, luxury, and efficiency with our comprehensive range of private aviation services.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {services.map((svc, i) => (
          <div key={i} className="bg-white dark:bg-[#152033] rounded-[24px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7]/50 dark:bg-yellow-900/20 flex items-center justify-center mb-6">
              {svc.icon}
            </div>
            <h3 className="text-[#0B1F3A] dark:text-white font-bold text-[18px] mb-3">{svc.title}</h3>
            <p className="text-[#4A4A4A] dark:text-gray-400 text-[14px] leading-relaxed">
              {svc.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}


