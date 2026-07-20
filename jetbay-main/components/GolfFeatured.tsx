import React from 'react';
import Image from 'next/image';
import { Plane } from 'lucide-react';

const destinations = [
  {
    badge: "Desert Golf Capital",
    title: "Scottsdale",
    desc: "One of the most popular U.S. golf leisure hubs, especially in peak season—ideal for 2–4 day private jet golf weekends with strong resort density and smooth airport access.",
    bgImage: "https://images.unsplash.com/photo-1593111774240-d529f12cb416?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Las Vegas", to: "Scottsdale", oneWay: "USD 6,000 - USD 14,000", roundTrip: "USD 16,000 - USD 40,000", image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400&auto=format&fit=crop" },
      { from: "Santa Ana", to: "Scottsdale", oneWay: "USD 8,000 - USD 18,000", roundTrip: "USD 18,000 - USD 45,000", image: "https://images.unsplash.com/photo-1593111774640-275d2753a804?q=80&w=400&auto=format&fit=crop" },
      { from: "Los Angeles", to: "Scottsdale", oneWay: "USD 8,000 - USD 18,000", roundTrip: "USD 18,000 - USD 45,000", image: "https://images.unsplash.com/photo-1629851724286-9a295c55fc5e?q=80&w=400&auto=format&fit=crop" }
    ]
  },
  {
    badge: "Resort Golf Weekends",
    title: "Palm Springs",
    desc: "A classic warm-weather golf escape with \"stay and play\" appeal—perfect for relaxed private jet itineraries built around resort tee times and downtime.",
    bgImage: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Los Angeles", to: "Palm Springs", oneWay: "USD 7,000 - USD 16,000", roundTrip: "USD 16,000 - USD 42,000", image: "https://images.unsplash.com/photo-1613917415444-a169b61d2d3a?q=80&w=400&auto=format&fit=crop" },
      { from: "Las Vegas", to: "Palm Springs", oneWay: "USD 7,000 - USD 16,000", roundTrip: "USD 16,000 - USD 42,000", image: "https://images.unsplash.com/photo-1535124406821-d2848dfbb25c?q=80&w=400&auto=format&fit=crop" },
      { from: "Santa Ana", to: "Palm Springs", oneWay: "USD 6,500 - USD 15,000", roundTrip: "USD 15,000 - USD 40,000", image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=400&auto=format&fit=crop" }
    ]
  },
  {
    badge: "Iconic Coastal Golf",
    title: "Pebble Beach",
    desc: "A bucket-list coastal destination known for heritage golf and polished hospitality—ideal for premium travellers arriving by private jet for an elevated golf experience.",
    bgImage: "https://images.unsplash.com/photo-1593111774640-275d2753a804?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Los Angeles", to: "Monterey", oneWay: "USD 9,000 - USD 20,000", roundTrip: "USD 20,000 - USD 55,000", image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400&auto=format&fit=crop" },
      { from: "Santa Ana", to: "Monterey", oneWay: "USD 9,500 - USD 22,000", roundTrip: "USD 22,000 - USD 60,000", image: "https://images.unsplash.com/photo-1629851724286-9a295c55fc5e?q=80&w=400&auto=format&fit=crop" },
      { from: "Las Vegas", to: "Monterey", oneWay: "USD 10,000 - USD 24,000", roundTrip: "USD 24,000 - USD 65,000", image: "https://images.unsplash.com/photo-1613917415444-a169b61d2d3a?q=80&w=400&auto=format&fit=crop" }
    ]
  },
  {
    badge: "Fly-in Links Golf",
    title: "Bandon Dunes",
    desc: "One of the most golf-specific fly-in destinations in the U.S.—built for multi-round itineraries and groups who want a true golf-first private aviation trip.",
    bgImage: "https://images.unsplash.com/photo-1613917415444-a169b61d2d3a?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "Los Angeles", to: "Monterey", oneWay: "USD 9,000 - USD 20,000", roundTrip: "USD 20,000 - USD 55,000", image: "https://images.unsplash.com/photo-1593111774640-275d2753a804?q=80&w=400&auto=format&fit=crop" },
      { from: "Santa Ana", to: "Monterey", oneWay: "USD 9,500 - USD 22,000", roundTrip: "USD 22,000 - USD 60,000", image: "https://images.unsplash.com/photo-1535124406821-d2848dfbb25c?q=80&w=400&auto=format&fit=crop" },
      { from: "Las Vegas", to: "Monterey", oneWay: "USD 10,000 - USD 24,000", roundTrip: "USD 24,000 - USD 65,000", image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=400&auto=format&fit=crop" }
    ]
  },
  {
    badge: "America's Historic Golf Hub",
    title: "Pinehurst",
    desc: "Top-tier and consistently in demand. Airport selection matters for private jet travel here—choose the closest feasible option for the smoothest transfer, especially on short stays.",
    bgImage: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "New York", to: "Raleigh", oneWay: "USD 12,000 - USD 26,000", roundTrip: "USD 28,000 - USD 70,000", image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400&auto=format&fit=crop" },
      { from: "Washington", to: "Raleigh", oneWay: "USD 8,000 - USD 18,000", roundTrip: "USD 18,000 - USD 50,000", image: "https://images.unsplash.com/photo-1629851724286-9a295c55fc5e?q=80&w=400&auto=format&fit=crop" },
      { from: "Atlanta", to: "Raleigh", oneWay: "USD 9,000 - USD 20,000", roundTrip: "USD 20,000 - USD 55,000", image: "https://images.unsplash.com/photo-1613917415444-a169b61d2d3a?q=80&w=400&auto=format&fit=crop" }
    ]
  },
  {
    badge: "South Florida Golf & Luxury",
    title: "Palm Beach",
    desc: "A leading luxury leisure market with strong golf communities and premium hospitality—ideal for peak-season private jet escapes and mixed-interest groups.",
    bgImage: "https://images.unsplash.com/photo-1535124406821-d2848dfbb25c?q=80&w=1920&auto=format&fit=crop",
    routes: [
      { from: "New York", to: "West Palm Beach", oneWay: "USD 18,000 - USD 40,000", roundTrip: "USD 45,000 - USD 110,000", image: "https://images.unsplash.com/photo-1593111774640-275d2753a804?q=80&w=400&auto=format&fit=crop" },
      { from: "Westchester", to: "West Palm Beach", oneWay: "USD 18,000 - USD 40,000", roundTrip: "USD 45,000 - USD 110,000", image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400&auto=format&fit=crop" },
      { from: "Miami", to: "West Palm Beach", oneWay: "USD 6,000 - USD 14,000", roundTrip: "USD 15,000 - USD 38,000", image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=400&auto=format&fit=crop" }
    ]
  }
];

export const GolfFeatured = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white tracking-tight leading-tight mb-4">
          Featured U.S. Golf Destinations to Fly to by Private Jet
        </h2>
        <p className="text-[16px] text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Each destination below includes recommended airports that support efficient access to the main golf corridor.
        </p>
      </div>

      <div className="space-y-16">
        {destinations.map((dest, i) => (
          <div key={i} className="w-full">
            
            {/* Header / Banner Area */}
            <div className="relative h-[220px] w-full rounded-[16px] overflow-hidden mb-6 p-8 flex flex-col justify-between">
              <Image 
                src={dest.bgImage} 
                alt={dest.title} 
                fill 
                className="object-cover z-0" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0"></div>
              
              {/* Top bar with badge and button */}
              <div className="relative z-10 flex justify-between items-start w-full">
                <span className="bg-white text-[#D946EF] text-[13px] font-bold px-4 py-1.5 rounded-full shadow-sm">
                  {dest.badge}
                </span>
                <button className="bg-[#45BDB5] hover:bg-[#35B5AA] text-white font-semibold px-6 py-2.5 rounded-lg text-[14px] transition-colors shadow-sm">
                  Explore More
                </button>
              </div>

              {/* Title and Desc */}
              <div className="relative z-10 text-white max-w-2xl mt-auto">
                <h3 className="text-[36px] font-bold mb-3 tracking-tight">{dest.title}</h3>
                <p className="text-[15px] text-white/90 leading-relaxed">
                  {dest.desc}
                </p>
              </div>
            </div>

            {/* Routes List Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 dark:border-gray-800 text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              <div className="col-span-4">Route</div>
              <div className="col-span-3">One Way</div>
              <div className="col-span-3">Round Trip (3 days)</div>
              <div className="col-span-2"></div>
            </div>

            {/* Routes List */}
            <div className="space-y-3">
              {dest.routes.map((route, j) => (
                <div key={j} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-gray-50/50 dark:bg-[#111A2E]/50 rounded-[12px] hover:bg-gray-100 dark:hover:bg-[#152033] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  
                  {/* Image & Route */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="relative w-[100px] h-[60px] rounded-[8px] overflow-hidden shrink-0">
                      <Image 
                        src={route.image} 
                        alt="Route destination" 
                        fill 
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-[#0B1F3A] dark:text-white">
                      <span>{route.from}</span>
                      <Plane size={14} className="text-[#45BDB5] shrink-0" />
                      <span>{route.to}</span>
                    </div>
                  </div>

                  {/* One Way */}
                  <div className="col-span-3">
                    <div className="md:hidden text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">One Way</div>
                    <div className="text-[15px] text-[#45BDB5] font-medium">{route.oneWay}</div>
                  </div>

                  {/* Round Trip */}
                  <div className="col-span-3">
                    <div className="md:hidden text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Round Trip</div>
                    <div className="text-[15px] text-[#45BDB5] font-medium">{route.roundTrip}</div>
                  </div>

                  {/* Book Button */}
                  <div className="col-span-2 flex justify-end">
                    <button className="w-full md:w-auto bg-[#F4F6F8] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] text-[#0B1F3A] dark:text-white font-semibold px-6 py-2.5 rounded-lg text-[13px] transition-colors">
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
