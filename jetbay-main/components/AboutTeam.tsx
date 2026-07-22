'use client';

import React from 'react';
import Image from 'next/image';

export const AboutTeam = () => {
  const teams = [
    {
      title: 'Data & AI Team',
      desc: 'Our AI team maintains a global jet database, providing cost-effective charter solutions by matching optimal flight resources and reducing empty leg flights for a sustainable experience.',
      features: ['Accurate Match', 'Sustainable Flying'],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800'
    },
    {
      title: 'Development Team',
      desc: 'Jetbay\'s team developed an AI platform that integrates with our database, it uses big data to optimize charter resources, ensuring efficient, convenient, and sustainable flights.',
      features: ['Comprehensive Solutions', 'Cost Effective'],
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800'
    },
    {
      title: 'Charter Experts',
      desc: 'Our seasoned charter specialists, boasting over 20 years of experience, work around the clock to deliver top-tier, cost-effective flight solutions, ensuring clients receive a seamless and personalized experience.',
      features: ['Professional', 'Available 24/7'],
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800'
    },
    {
      title: 'Operation Support Team',
      desc: 'Our operation support team focuses on every detail with the highest standards. Leveraging extensive aviation experience and a vast partner network, we ensure a smooth and seamless private flying experience.',
      features: ['Flight Assurance', 'Industry Expertise'],
      image: 'https://images.unsplash.com/photo-1579737039537-b4d2bd50d03b?q=80&w=800'
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-20 font-sans">
      
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {teams.map((team, idx) => (
          <div key={idx} className="bg-white dark:bg-[#152033] rounded-[16px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
            <div className="relative w-full h-[180px]">
              <Image 
                src={team.image} 
                alt={team.title} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-2">
                {team.title}
              </h3>
              <p className="text-[12.5px] text-gray-600 dark:text-gray-400 mb-6 flex-1">
                {team.desc}
              </p>
              
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                {team.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span className="text-[12px] font-semibold text-[#0B1F3A] dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};
