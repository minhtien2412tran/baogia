'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Globe, Phone, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Topbar = () => {
  const pathname = usePathname();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);

  const services = [
    { label: 'On-Demand Charter', href: '/on-demand-charter' },
    { label: 'Group Charter', href: '/group-charter' },
    { label: 'Corporate Charter', href: '/corporate-charter' },
    { label: 'Air Ambulance', href: '/air-ambulance' },
    { label: 'Pet Travel', href: '/pet-travel' },
    { label: 'Event Charter', href: '/event-charter' },
  ];

  return (
    <header className="h-[80px] bg-white dark:bg-[#0B1121] flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors">
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#152033] transition-colors rounded-lg">
          <Menu size={24} strokeWidth={2} />
        </button>
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <div className="w-7 h-7 bg-[#0B1F3A] rounded flex items-center justify-center shadow-sm relative overflow-hidden transform -skew-x-12 mr-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#40DACD] absolute transform skew-x-12">
              <path d="M5 12l5 5l10 -10" />
            </svg>
          </div>
          <span className="font-extrabold text-[22px] tracking-tight text-[#0B1F3A] dark:text-white">
            Jet<span className="text-[#40DACD]">bay</span>
          </span>
        </Link>
      </div>
      
      <div className="hidden lg:flex flex-1" />

      <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-gray-600 dark:text-gray-300 h-full relative">
        {/* Services Dropdown */}
        <div 
          className="h-full flex items-center relative cursor-pointer group"
          onMouseEnter={() => setIsServicesOpen(true)}
          onMouseLeave={() => setIsServicesOpen(false)}
        >
          <div className={`flex items-center gap-1 transition-colors py-3 h-full px-1 border-b-2 ${
            pathname === '/corporate-charter' || pathname === '/on-demand-charter' || pathname === '/group-charter'
              ? 'text-[#13B2A6] dark:text-[#40DACD] border-[#40DACD]'
              : 'text-gray-900 dark:text-white border-transparent hover:text-gray-900 dark:hover:text-white'
          }`}>
            <span className="font-semibold text-[14px]">Services</span>
            <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
          </div>

          {/* Dropdown Menu block */}
          {isServicesOpen && (
            <div className="absolute top-[75px] left-[-30px] w-[220px] bg-white dark:bg-[#152033] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2.5 z-50 border border-gray-100 dark:border-gray-800 animate-fadeIn">
              {services.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={idx} 
                    href={item.href} 
                    className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                      isActive 
                        ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                        : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Plan Your Flight Dropdown */}
        <div 
          className="h-full flex items-center relative cursor-pointer group"
          onMouseEnter={() => setIsPlanOpen(true)}
          onMouseLeave={() => setIsPlanOpen(false)}
        >
          <div className={`flex items-center gap-1 transition-colors py-3 h-full px-1 border-b-2 ${
            pathname === '/how-to-book' || pathname === '/destinations' || pathname === '/airports'
              ? 'text-[#13B2A6] dark:text-[#40DACD] border-[#40DACD]'
              : 'text-gray-900 dark:text-white border-transparent hover:text-gray-900 dark:hover:text-white'
          }`}>
            <span className="font-semibold text-[14px]">Plan Your Flight</span>
            <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
          </div>

          {isPlanOpen && (
            <div className="absolute top-[75px] left-[0px] w-[200px] bg-white dark:bg-[#152033] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2.5 z-50 border border-gray-100 dark:border-gray-800 animate-fadeIn">
              <Link 
                href="/how-to-book" 
                className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                  pathname === '/how-to-book' 
                    ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                    : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                }`}
              >
                How to Book
              </Link>
              <Link 
                href="/destinations" 
                className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                  pathname === '/destinations' 
                    ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                    : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                }`}
              >
                Destinations
              </Link>
              <Link 
                href="/airports" 
                className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                  pathname === '/airports' 
                    ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                    : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                }`}
              >
                Airports
              </Link>
            </div>
          )}
        </div>
        {/* Company Dropdown */}
        <div 
          className="h-full flex items-center relative cursor-pointer group"
          onMouseEnter={() => setIsCompanyOpen(true)}
          onMouseLeave={() => setIsCompanyOpen(false)}
        >
          <div className={`flex items-center gap-1 transition-colors py-3 h-full px-1 border-b-2 ${
            pathname.startsWith('/about-us')
              ? 'text-[#13B2A6] dark:text-[#40DACD] border-[#40DACD]'
              : 'text-gray-900 dark:text-white border-transparent hover:text-gray-900 dark:hover:text-white'
          }`}>
            <span className="font-semibold text-[14px]">Company</span>
            <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
          </div>

          {isCompanyOpen && (
            <div className="absolute top-full left-0 w-[180px] bg-white dark:bg-[#152033] shadow-lg rounded-b-xl border border-gray-100 dark:border-gray-800 overflow-hidden py-2 animate-in slide-in-from-top-2">
              <Link 
                href="/about-us" 
                className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                  pathname === '/about-us' 
                    ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                    : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                }`}
              >
                About Us
              </Link>
              <Link 
                href="/blogs" 
                className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                  pathname === '/blogs' 
                    ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                    : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                }`}
              >
                Blogs
              </Link>
              <Link 
                href="/news" 
                className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                  pathname === '/news' 
                    ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                    : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                }`}
              >
                News
              </Link>
              <Link 
                href="/video-centre" 
                className={`block px-5 py-3 text-[14px] font-medium transition-colors ${
                  pathname === '/video-centre' 
                    ? 'bg-[#EBF7F6] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD]' 
                    : 'text-[#0B1F3A] dark:text-gray-200 hover:bg-[#F4F9F9] dark:hover:bg-[#1C2A44] hover:text-[#13B2A6] dark:hover:text-[#40DACD]'
                }`}
              >
                Video Centre
              </Link>
            </div>
          )}
        </div>
      </nav>
      
      <div className="flex items-center gap-4 sm:gap-6 ml-10">
        <ThemeToggle />
        <button className="hidden sm:flex items-center gap-1.5 text-[14px] font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Globe size={18} className="text-gray-400 dark:text-gray-500" /> USD
        </button>
        <button className="hidden sm:block text-[14px] font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Log In</button>
        <button className="flex items-center gap-2 bg-[#F1F5F9] dark:bg-[#152033] text-gray-800 dark:text-white px-5 py-2.5 rounded-xl text-[14px] font-bold hover:bg-gray-200 dark:hover:bg-[#1A263D] transition-colors border border-gray-200 dark:border-gray-800 shadow-sm">
          <Phone size={16} className="text-gray-600 dark:text-gray-400" /> Contact Us
        </button>
      </div>
    </header>
  );
};
