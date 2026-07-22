import React from 'react';
import Link from 'next/link';

export const AirportDetailContent = () => {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 lg:px-8 mb-20 font-sans text-gray-800 dark:text-gray-200">
      
      {/* Main Title */}
      <h2 className="text-[32px] md:text-[38px] font-extrabold text-[#0B1F3A] dark:text-white tracking-tight mb-6">
        Experience Private Jet Travel Through Edmonton
      </h2>

      {/* Intro Paragraphs */}
      <div className="space-y-4 text-[14px] leading-relaxed mb-10 text-gray-600 dark:text-gray-400">
        <p>
          Flying private from <strong>Edmonton International Airport (CYEG)</strong> offers discerning travelers unmatched flexibility, privacy, and access across Canada and beyond. Whether attending high-level business meetings in Calgary or escaping to the sun-drenched landscapes of Palm Springs, <strong>private jet charter from Edmonton</strong> provides direct connections that commercial airlines cannot match.
        </p>
        <p>
          Edmonton&apos;s private aviation sector has evolved into a hub for executives, resource industry leaders, and leisure travelers who value time and comfort. From short regional hops to international journeys, CYEG sees a diverse array of charter operations every day, supported by world-class facilities and a seamless private travel experience.
        </p>
      </div>

      {/* Why Choose Section */}
      <div className="mb-10">
        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">Why Choose Private Charter from CYEG?</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Premium Travel Without Compromise</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Fly on your schedule, not an airline&apos;s timetable. Private charter eliminates waiting rooms, crowded terminals, and rigid flight connections, replacing them with exclusivity, privacy, and agility.</p>
          </div>
          
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Strategic Western Canada Location</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Positioned to serve Alberta&apos;s economic heartland and the northern territories, Edmonton&apos;s airport is ideally situated for seamless access to major centres and remote destinations alike.</p>
          </div>

          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Infrastructure Built for Private Aviation</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">With a dedicated private terminal and expert ground handling, every departure and arrival is smooth, secure, and discreet — a standard that aligns with the expectations of elite travellers.</p>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="mb-10">
        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">Popular Charter Destinations from Edmonton</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-[20px] font-bold text-[#0B1F3A] dark:text-gray-200 mb-3">Private Jet from Edmonton to Calgary: The Executive Corridor</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-3">Private flights between Edmonton and Calgary remain among the most frequent. The short flight — often under 45 minutes — transforms business travel, enabling same-day round-trips and maximising productivity.</p>
            <Link href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline text-[13.5px] font-medium">Learn more about private jet charter to Calgary (CYYC) from Edmonton</Link>
          </div>
          
          <div>
            <h4 className="text-[20px] font-bold text-[#0B1F3A] dark:text-gray-200 mb-3">Northern Canada — Access Beyond Commercial Reach</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-3">Destinations such as <strong>Yellowknife</strong> and <strong>Fort McMurray</strong> are served routinely, supporting resource industry operations, government missions, and essential services.</p>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline text-[13.5px] font-medium">Explore private jet services to Yellowknife (CYLW) from Edmonton</Link>
              <Link href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline text-[13.5px] font-medium">Explore private jet flights to Fort McMurray (CYMM) from Edmonton</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[20px] font-bold text-[#0B1F3A] dark:text-gray-200 mb-3">Western Canada & Coastal Cities</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-3">From Kelowna to Vancouver, direct charters open doors to leisure escapes, business hubs, and luxury resort destinations — all without layovers.</p>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline text-[13.5px] font-medium">Explore Kelowna private jet charter services from Edmonton</Link>
              <Link href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline text-[13.5px] font-medium">Discover Vancouver (CYVR) private jet charters from Edmonton</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[20px] font-bold text-[#0B1F3A] dark:text-gray-200 mb-3">Warm Weather Escapes</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Winter traffic grows toward Palm Springs, Scottsdale, and other warm-weather destinations. Midsize and heavy jets provide the range and comfort suited to longer journeys.</p>
          </div>
        </div>
      </div>

      {/* Aircraft Options */}
      <div className="mb-10">
        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">Aircraft Options for Every Mission</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Light Jets – Efficiency Meets Performance</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Ideal for flights within close-to-medium ranges, light jets such as Citation models combine speed with cost-effective charter rates.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Turboprops – Regional & Remote Access</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Turboprops like King Air models excel on shorter runways and are commonly deployed for northern and regional missions.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Midsize Jets – Balanced Luxury</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">With stand-up cabins and extended range, midsize jets like the Challenger series suit cross-border flights without compromising space.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Heavy Jets – Ultimate Comfort</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">For transcontinental journeys or larger parties, heavy jets deliver cabin amenities, including full refreshment centres and quiet cruising environments.</p>
          </div>
        </div>
      </div>

      {/* Seasonal Dynamics */}
      <div className="mb-10">
        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">Seasonal & Operational Dynamics</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Peak Timing Trends</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Early-morning departures support leveraged business itineraries, while late-afternoon departures cater to end-of-day programmes. Weekend leisure travel sees heightened movements to resort and coastal destinations.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Seasonal Flow</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Winter months shift demand southward toward warmer climates, while summer highlights regional travel throughout western Canadian cities and scenic leisure destinations.</p>
          </div>
        </div>
      </div>

      {/* How to Charter */}
      <div className="mb-10">
        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">How To Charter Your Private Flight from Edmonton</h3>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">Booking a private jet with Jetbay is designed to be intuitive and personalised:</p>
        <ol className="list-decimal pl-5 space-y-2 text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          <li><strong>Submit Your Intent:</strong> Provide travel dates, passenger numbers, routes, and any bespoke requirements (catering, ground logistics, pets, etc.).</li>
          <li><strong>Receive Tailored Options:</strong> Leveraging our AI-enhanced platform, Jetbay matches your mission with optimal aircraft and competitive pricing.</li>
          <li><strong>Confirm and Fly:</strong> Once confirmed, your private travel experience is coordinated end-to-end by seasoned professionals.</li>
        </ol>
        <p className="text-[14px] text-gray-600 dark:text-gray-400">Private terminal access allows arrival just minutes before departure, redefining convenience at every step.</p>
      </div>

      {/* Connect */}
      <div className="mb-12">
        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-4">Connect with Jetbay for Bespoke Charter Solutions</h3>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">Ready to elevate your travel standard from Edmonton International Airport?</p>
        <p className="text-[14px] text-gray-600 dark:text-gray-400">
          <Link href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline font-medium">Request a quote</Link> to receive tailored recommendations and bespoke pricing, backed by global reach and decades of aviation expertise.
        </p>
      </div>

      {/* FAQs */}
      <div className="mb-10">
        <h3 className="text-[26px] font-bold text-[#0B1F3A] dark:text-white mb-8">Frequently Asked Questions about Edmonton Private Jet Charter Services</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">1. What influences charter pricing from Edmonton to Calgary?</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Aircraft category, flight duration, and market demand all factor into pricing. Light jets generally represent the most economical option on this short route, while midsize cabin categories yield enhanced comfort.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">2. Which jets are best suited for Edmonton to Saskatoon?</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Aircraft like the Citation CJ3+, Pilatus PC-24, and King Air series balance performance and comfort for this regional flight segment.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">3. Can private flights operate year-round to northern destinations?</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Yes. With robust de-icing systems and aircraft capable of handling diverse weather conditions, private services to northern hubs operate throughout the year.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
