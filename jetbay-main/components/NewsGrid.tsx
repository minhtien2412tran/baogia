'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NEWS_DATA } from '@/lib/newsData';
import { Clock, ChevronDown } from 'lucide-react';

export const NewsGrid = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-20 font-sans">
      
      <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white mb-8">
        Recent Posts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        
        {NEWS_DATA.map((item) => (
          <div key={item.slug} className="flex flex-col group">
            
            {/* Image Container with Overlay */}
            <Link href={`/news/${item.slug}`} className="relative w-full aspect-square md:aspect-[4/5] lg:aspect-square rounded-[16px] overflow-hidden block mb-5">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <span className="inline-block bg-[#13B2A6] text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 tracking-wide">
                  {item.badge}
                </span>
                <h3 className="text-white text-[18px] sm:text-[20px] font-bold leading-tight mb-2 drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-[10px] font-bold tracking-wider">
                  BY: {item.author}
                </p>
              </div>
            </Link>

            {/* Bottom Content */}
            <div className="flex flex-col flex-1 px-1">
              <h4 className="text-[17px] font-bold text-[#0B1F3A] dark:text-white mb-2 leading-snug">
                <Link href={`/news/${item.slug}`} className="hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors">
                  {item.title}
                </Link>
              </h4>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mt-auto">
                <Clock size={14} />
                <span className="text-[12px] font-medium">{item.date}</span>
              </div>
            </div>

          </div>
        ))}

      </div>

      {/* View More Button */}
      <div className="mt-16 text-center">
        <button className="text-[14px] font-bold text-[#0B1F3A] dark:text-white hover:text-[#13B2A6] dark:hover:text-[#40DACD] transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto">
          <span>View More</span>
          <ChevronDown size={16} />
        </button>
      </div>

    </div>
  );
};
