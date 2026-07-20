import React from 'react';
import Image from 'next/image';
import { Plane, ArrowLeftRight } from 'lucide-react';

const destinations = [
  {
    badge: "Bahamas Classic",
    title: "Nassau",
    desc: "A top Caribbean \"greatest hits\" destination for U.S.-departing private jet leisure—ideal for quick beach weekends and easy arrivals.",
    bgImage: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Miami", to: "Nassau", oneWay: "USD 8,000 - USD 18,000", roundTrip: "USD 20,000 - USD 48,000" },
      { from: "Fort Lauderdale", to: "Nassau", oneWay: "USD 8,000 - USD 18,000", roundTrip: "USD 20,000 - USD 48,000" },
      { from: "West Palm Beach", to: "Nassau", oneWay: "USD 9,000 - USD 20,000", roundTrip: "USD 22,000 - USD 55,000" }
    ]
  },
  {
    badge: "Resort Island Escape",
    title: "Providenciales",
    desc: "One of the most requested island getaways for premium leisure travel—known for high-end resorts and smooth airport access.",
    bgImage: "https://images.unsplash.com/photo-1571401835393-8b43bd1df5ec?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Miami", to: "Providenciales", oneWay: "USD 14,000 - USD 30,000", roundTrip: "USD 40,000 - USD 95,000" },
      { from: "Fort Lauderdale", to: "Providenciales", oneWay: "USD 14,000 - USD 30,000", roundTrip: "USD 40,000 - USD 95,000" },
      { from: "West Palm Beach", to: "Providenciales", oneWay: "USD 15,000 - USD 32,000", roundTrip: "USD 42,000 - USD 100,000" }
    ]
  },
  {
    badge: "Iconic Boutique Island",
    title: "St. Barts",
    desc: "A bucket-list arrival with strong demand, but aircraft and runway constraints can apply. Many itineraries route via St. Maarten depending on lift and conditions.",
    bgImage: "https://images.unsplash.com/photo-1563804860017-dccf80dc7f20?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Miami", to: "Sint Maarten", oneWay: "USD 20,000 - USD 45,000", roundTrip: "USD 65,000 - USD 150,000" },
      { from: "Fort Lauderdale", to: "Sint Maarten", oneWay: "USD 20,000 - USD 45,000", roundTrip: "USD 65,000 - USD 150,000" },
      { from: "New York", to: "Sint Maarten", oneWay: "USD 40,000 - USD 95,000", roundTrip: "USD 130,000 - USD 300,000" }
    ]
  },
  {
    badge: "Luxury Beach & Privacy",
    title: "Grand Cayman",
    desc: "A consistent private jet leisure market with premium villas and straightforward access for relaxed island stays.",
    bgImage: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Miami", to: "Grand Cayman", oneWay: "USD 12,000 - USD 26,000", roundTrip: "USD 35,000 - USD 85,000" },
      { from: "Fort Lauderdale", to: "Grand Cayman", oneWay: "USD 12,000 - USD 26,000", roundTrip: "USD 35,000 - USD 85,000" },
      { from: "West Palm Beach", to: "Grand Cayman", oneWay: "USD 13,000 - USD 28,000", roundTrip: "USD 38,000 - USD 90,000" }
    ]
  },
  {
    badge: "Discreet Ultra-Relaxed Escape",
    title: "Anguilla",
    desc: "An iconic island favored for privacy and quiet luxury. Depending on aircraft and routing, some itineraries connect via St. Maarten.",
    bgImage: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Miami", to: "Sint Maarten", oneWay: "USD 20,000 - USD 45,000", roundTrip: "USD 65,000 - USD 150,000" },
      { from: "Fort Lauderdale", to: "Sint Maarten", oneWay: "USD 20,000 - USD 45,000", roundTrip: "USD 65,000 - USD 150,000" },
      { from: "New York", to: "Sint Maarten", oneWay: "USD 40,000 - USD 95,000", roundTrip: "USD 130,000 - USD 300,000" }
    ]
  },
  {
    badge: "Caribbean Gateway with Flexibility",
    title: "San Juan",
    desc: "A high-demand leisure hub and a convenient gateway for wider Caribbean itineraries, with strong routing flexibility and infrastructure.",
    bgImage: "https://images.unsplash.com/photo-1583037189850-1921be518873?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Miami", to: "San Juan", oneWay: "USD 18,000 - USD 40,000", roundTrip: "USD 60,000 - USD 140,000" },
      { from: "Fort Lauderdale", to: "San Juan", oneWay: "USD 18,000 - USD 40,000", roundTrip: "USD 60,000 - USD 140,000" },
      { from: "West Palm Beach", to: "San Juan", oneWay: "USD 20,000 - USD 45,000", roundTrip: "USD 65,000 - USD 155,000" }
    ]
  }
];

export const IslandFeatured = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-[-0.02em] leading-[1.15] mb-4">
          Featured Island Destinations to Fly to by Private Jet
        </h2>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          Each destination below features incredible beaches, turquoise waters, and world-class resorts. Book a private jet and arrive in style.
        </p>
      </div>

      <div className="space-y-16">
        {destinations.map((dest, i) => (
          <div key={i} className="w-full rounded-[24px] overflow-hidden bg-gray-50 dark:bg-[#111A2E] border border-gray-100 dark:border-gray-800 relative">
            
            {/* Header / Banner Area */}
            <div className="relative h-[240px] w-full p-6 md:p-10 flex flex-col justify-between">
              <Image 
                src={dest.bgImage} 
                alt={dest.title} 
                fill 
                className="object-cover z-0" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 z-0"></div>
              
              {/* Top bar with badge and button */}
              <div className="relative z-10 flex justify-between items-start">
                <span className="bg-[#FFF5D1] text-[#A67C00] text-[12px] font-bold px-4 py-1.5 rounded-full">
                  {dest.badge}
                </span>
                <button className="bg-[#40DACD] hover:bg-[#35B5AA] text-[#0B1F3A] font-semibold px-5 py-2 rounded-lg text-[13px] transition-colors shadow-sm">
                  Explore More
                </button>
              </div>

              {/* Title and Desc */}
              <div className="relative z-10 text-white max-w-2xl mt-4">
                <h3 className="text-[36px] font-bold mb-2">{dest.title}</h3>
                <p className="text-[14px] text-white/90 leading-relaxed">
                  {dest.desc}
                </p>
              </div>
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {dest.routes.map((route, j) => (
                <div key={j} className="bg-white dark:bg-[#152033] rounded-[16px] p-6 lg:p-7 border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-8">
                      <span className="text-[18px] lg:text-[20px] font-bold text-[#0B1F3A] dark:text-white tracking-tight leading-tight flex-1">{route.from}</span>
                      <div className="w-7 h-7 rounded-full bg-[#E8F6F5] dark:bg-[#1A3B37] flex items-center justify-center shrink-0 mx-1">
                        <ArrowLeftRight size={14} className="text-[#45BDB5]" />
                      </div>
                      <span className="text-[18px] lg:text-[20px] font-bold text-[#0B1F3A] dark:text-white tracking-tight leading-tight flex-1 text-right">{route.to}</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div>
                        <div className="text-[14px] font-semibold text-[#0B1F3A] dark:text-white mb-1">One Way</div>
                        <div className="text-[16px] text-[#45BDB5] font-medium tracking-tight">{route.oneWay}</div>
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-[#0B1F3A] dark:text-white mb-1">Round Trip (4 days)</div>
                        <div className="text-[16px] text-[#45BDB5] font-medium tracking-tight">{route.roundTrip}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-auto">
                    <div className="relative w-full h-[90px] mb-6">
                      <Image 
                        src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop" 
                        alt="Private Jet" 
                        fill 
                        className="object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <button className="w-full bg-[#F4F6F8] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] text-[#0B1F3A] dark:text-white font-semibold py-3 rounded-xl text-[14px] transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
