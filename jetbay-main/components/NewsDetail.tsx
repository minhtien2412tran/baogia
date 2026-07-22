'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsItem } from '@/lib/newsData';

interface Props {
  news: NewsItem;
}

export const NewsDetail = ({ news }: Props) => {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 lg:px-8 py-12 md:py-16 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] md:text-[42px] font-bold text-[#0B1F3A] dark:text-white leading-tight mb-6">
          {news.title}
        </h1>
        
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
            By: <span className="font-semibold text-gray-700 dark:text-gray-300">{news.author}</span> <span className="mx-2">|</span> {news.date}
          </div>
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#13B2A6] dark:text-gray-400 dark:hover:text-[#40DACD] transition-colors">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        
        <h2 className="text-[26px] font-bold text-[#0B1F3A] dark:text-white mb-6">Private Jet vs Commercial Travel</h2>
        
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
          <Image 
            src={news.image} 
            alt="Winter storm at airport" 
            fill 
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <p className="text-[15px] leading-relaxed mb-6">
          Winter weather remains one of the most disruptive forces in global aviation. Each year, snowstorms across North America and Europe bring widespread flight delays, cancellations, and missed connections, often during the busiest travel periods of the calendar.
        </p>

        <p className="text-[15px] leading-relaxed mb-10">
          While commercial airlines operate within tightly interconnected networks that are vulnerable to weather-related congestion, private aviation offers a different operating model. For time-sensitive travellers, understanding the difference can be the key to maintaining control when winter conditions deteriorate.
        </p>

        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">Why Winter Storms Disrupt Commercial Flights at Major Airports</h3>
        
        <p className="text-[15px] leading-relaxed mb-4">
          Snowstorms affect far more than runway conditions. At large commercial hubs, even moderate winter weather can trigger a chain reaction across the entire air traffic system.
        </p>

        <p className="text-[15px] leading-relaxed mb-4">Common causes of winter delays include:</p>
        
        <ul className="list-disc pl-5 space-y-2 text-[15px] mb-8">
          <li><strong>Ground delay programs</strong> imposed by air traffic control</li>
          <li><strong>Limited de-icing capacity</strong> shared across hundreds of aircraft</li>
          <li><strong>Crew duty time restrictions</strong>, leading to cancellations</li>
          <li><strong>Gate congestion</strong>, especially during peak holiday travel</li>
          <li><strong>Network ripple effects</strong>, where delays at one hub impact flights nationwide</li>
        </ul>

        <p className="text-[15px] leading-relaxed mb-10">
          Because commercial airlines rely on fixed schedules and dense airport infrastructure, recovery from winter disruptions can take days (not hours).
        </p>

        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">Private Jet vs Commercial Flights During Winter Storms</h3>

        <p className="text-[15px] leading-relaxed mb-8">
          Private aviation operates under a fundamentally different model. While no aircraft is immune to severe weather, private jet charter offers significantly more flexibility and operational control.
        </p>

        {/* Comparison Infographic / Table Substitute */}
        <div className="bg-[#8B2332] text-white rounded-xl p-8 mb-4 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
           <div className="bg-white text-gray-900 rounded-lg p-6 relative z-10 shadow-lg border border-gray-100">
             <h4 className="text-center text-[22px] text-[#8B2332] mb-6 font-medium">Commercial</h4>
             <div className="relative h-20 mb-6">
                <Image src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400" alt="Commercial plane" fill className="object-contain" />
             </div>
             <div className="space-y-4 text-center">
               <div className="border-b border-gray-200 pb-3 text-[15px]">High Airport Congestion</div>
               <div className="border-b border-gray-200 pb-3 text-[15px]">Fixed Timetables</div>
               <div className="pb-2 text-[15px]">Limited rerouting & de-icing access</div>
             </div>
           </div>

           <div className="bg-transparent border border-white/20 rounded-lg p-6 relative z-10 flex flex-col justify-between">
             <h4 className="text-center text-[22px] text-white mb-6 font-medium">Private Jet</h4>
             <div className="relative h-20 mb-6">
                <Image src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=400" alt="Private jet" fill className="object-contain" />
             </div>
             <div className="space-y-4 text-center">
               <div className="border-b border-white/20 pb-3 text-[15px]">Low Airport Congestion</div>
               <div className="border-b border-white/20 pb-3 text-[15px]">Adjustable Departures</div>
               <div className="pb-2 text-[15px]">Dedicated & highly flexible services</div>
             </div>
           </div>
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center text-gray-900 font-bold z-20 shadow-md">
             VS
           </div>
        </div>
        
        <p className="text-center text-[13px] italic text-gray-500 mb-10">
          Private jet vs commercial flights during winter storms – comparison of delays, flexibility, and airport access
        </p>

        <p className="text-[15px] leading-relaxed mb-10">
          Private aircraft can often depart from or arrive at secondary airports with less congestion, adjust departure windows to avoid peak disruption periods, and reposition more efficiently once weather conditions improve.
        </p>

        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">How Jetbay Helps Travellers Navigate Weather-Related Disruptions</h3>

        <p className="text-[15px] leading-relaxed mb-4">
          As a global jet charter broker, Jetbay works with a network of vetted aircraft operators to provide flexible solutions when commercial aviation faces operational strain.
        </p>
        
        <p className="text-[15px] leading-relaxed mb-4">Key considerations during winter travel include:</p>

        <ul className="list-disc pl-5 space-y-2 text-[15px] mb-8">
          <li><strong>Aircraft suitability:</strong> Selecting aircraft types appropriate for winter operations and shorter runways</li>
          <li><strong>Airport strategy:</strong> Identifying alternative airports to reduce congestion risk</li>
          <li><strong>Operational monitoring:</strong> Real-time weather and airport condition tracking</li>
          <li><strong>Transparent charter pricing:</strong> Clear cost visibility, even during high-demand periods</li>
        </ul>

        <p className="text-[15px] leading-relaxed mb-10">
          Rather than relying on a single fleet or fixed route structure, Jetbay matches each flight with the most suitable aircraft and routing based on real-world conditions.
        </p>

        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">When Does Flying Private Make Sense During Winter Travel?</h3>

        <p className="text-[15px] leading-relaxed mb-4">
          Private jet charter is not about avoiding weather altogether; it is about <strong>reducing exposure to systemic delays</strong>.
        </p>
        
        <p className="text-[15px] leading-relaxed mb-4">Flying private during winter storms may be particularly valuable for:</p>

        <ul className="list-disc pl-5 space-y-2 text-[15px] mb-8">
          <li><strong>Time-critical business travel</strong> with immovable commitments</li>
          <li><strong>Holiday journeys</strong> where missed connections impact family schedules</li>
          <li><strong>International travel</strong> requiring precise coordination</li>
          <li><strong>Group or pet travel</strong>, where rebooking commercial flights is complex</li>
          <li><strong>Travellers seeking predictability</strong> during peak winter periods</li>
        </ul>

        <p className="text-[15px] leading-relaxed mb-10">
          For these travellers, flexibility often outweighs the inconvenience and uncertainty of large-scale commercial disruptions.
        </p>

        <h3 className="text-[24px] font-bold text-[#0B1F3A] dark:text-white mb-6">Planning Smarter Winter Travels in 2026</h3>

        <p className="text-[15px] leading-relaxed mb-4">
          Winter storms are an unavoidable part of aviation, but prolonged delays do not have to be. For travellers who value reliability, flexibility, and informed decision-making, private jet charter offers a viable alternative when commercial systems are under strain.
        </p>

        <p className="text-[15px] leading-relaxed mb-4">
          By learning how different aviation models handle winter disruptions, clients gain clarity and confidence. This helps them travel smoothly, even in the most unpredictable season of the year.
        </p>

        <p className="text-[15px] leading-relaxed mb-12 italic text-gray-500">
          <a href="#" className="text-[#13B2A6] hover:underline not-italic font-medium">Explore flexible charter options with Jetbay today</a> and plan your winter travel with clarity and control.
        </p>

        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-8">Frequently Asked Questions About Winter Flying</h3>

        <div className="space-y-8 mb-16">
          <div>
            <h4 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">1. Are private jets affected by snowstorms?</h4>
            <p className="text-[15px]">Yes. Severe weather can impact all aviation. However, private flights often experience fewer cascading delays due to flexible scheduling and access to less congested airports.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">2. Do private jets receive faster de-icing?</h4>
            <p className="text-[15px]">Private aircraft typically use dedicated fixed-base operators (FBOs), allowing for more efficient de-icing coordination compared to shared commercial terminals.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">3. Can private jets fly to alternative airports during winter weather?</h4>
            <p className="text-[15px]">Yes. One main advantage of private aviation is access to smaller airports. These airports often stay open when big hubs are crowded.</p>
          </div>
        </div>

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-6 border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
        <Link href="#" className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#0B1F3A] dark:hover:text-white transition-colors">
          <ChevronLeft size={16} />
          <span>Previous</span>
        </Link>
        <span className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700"></span>
        <Link href="#" className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#0B1F3A] dark:hover:text-white transition-colors">
          <span>Next</span>
          <ChevronRight size={16} />
        </Link>
      </div>

    </div>
  );
};
