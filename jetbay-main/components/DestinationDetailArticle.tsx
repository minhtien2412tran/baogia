'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Destination } from '@/lib/destinationsData';

interface Props {
  destination: Destination;
}

export const DestinationDetailArticle = ({ destination }: Props) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 my-12 font-sans">
      
      {/* Outer Card */}
      <div className="bg-slate-50/60 dark:bg-[#152033] rounded-[28px] p-6 sm:p-10 lg:p-14 border border-slate-200/70 dark:border-gray-800 shadow-2xs max-w-5xl mx-auto">
        
        {/* Main Title */}
        <h2 className="text-[24px] sm:text-[30px] font-bold text-[#0B1F3A] dark:text-white text-center mb-10 tracking-tight">
          About Private Jet Travel in {destination.name}
        </h2>

        {/* Sections Content Stream */}
        <div className="space-y-8">
          {destination.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              
              {/* Section Heading */}
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
                {section.title}
              </h3>

              {/* Section Paragraph */}
              <p className="text-[13.5px] sm:text-[14px] text-slate-600 dark:text-gray-300 leading-relaxed font-normal">
                {section.content.includes('private jet charter flights') ? (
                  <>
                    Experience the luxury and convenience of Jetbay&apos;s{' '}
                    <Link href="/how-to-book" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline font-semibold">
                      private jet charter flights
                    </Link>{' '}
                    tailored to your needs. Discover our range of airplanes and transparent private jet prices today. Book with Jetbay and elevate your travel to new heights!
                  </>
                ) : (
                  section.content
                )}
              </p>

              {/* Section Image if exists */}
              {section.image && (
                <div className="relative w-full h-[260px] sm:h-[340px] rounded-[18px] overflow-hidden my-6 border border-slate-200/80 dark:border-gray-700 shadow-xs">
                  <Image 
                    src={section.image} 
                    alt={section.title} 
                    fill 
                    className="object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
