'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Phone, ChevronDown } from 'lucide-react';

const NavDropdown = ({ label, items, active = false, scrolled = false }: { label: string, items: {label: string, href: string}[], active?: boolean, scrolled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative h-full flex items-center px-3"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={`cursor-pointer h-full flex items-center font-medium text-[14px] transition-colors ${active ? (scrolled ? 'text-[#0B1F3A] border-b-2 border-[#40DACD]' : 'text-white border-b-2 border-[#40DACD]') : (scrolled ? 'text-gray-600 hover:text-[#0B1F3A]' : 'text-white/80 hover:text-white')}`}>
        {label}
      </div>
      
      {isOpen && (
        <div className="absolute top-[80px] left-0 w-[240px] bg-white dark:bg-[#0f172a] rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-800 transform transition-all duration-200 origin-top">
          {items.map((item, idx) => (
            <Link key={idx} href={item.href} className="block px-5 py-3 text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1e293b] hover:text-[#40DACD] transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const TopbarFull = ({ lightTheme = false }: { lightTheme?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = lightTheme || scrolled;

  return (
    <header className={`h-[80px] flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300 ${isLight ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-[#1B2F2E]'}`}>
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <div className="w-7 h-7 bg-[#0B1F3A] rounded flex items-center justify-center shadow-sm relative overflow-hidden transform -skew-x-12 mr-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#40DACD] absolute transform skew-x-12">
              <path d="M5 12l5 5l10 -10" />
            </svg>
          </div>
          <span className={`font-extrabold text-[22px] tracking-tight ${isLight ? 'text-[#0B1F3A]' : 'text-white'}`}>Jet<span className="text-[#40DACD]">bay</span></span>
        </Link>
      </div>
      
      <div className="flex items-center h-full ml-auto">
        <nav className="hidden lg:flex items-center h-full mr-6">
          <NavDropdown 
            label="Private Jet Charter" 
            scrolled={isLight}
            items={[
              {label: 'On-Demand Charter', href: '/on-demand-charter'},
              {label: 'Jetbay SOS', href: '/'},
              {label: 'Fixed Price Charter', href: '/fixed-price-charter'},
              {label: 'Empty Legs', href: '/empty-legs'},
              {label: 'Group Charter', href: '/group-charter'}
            ]} 
          />
          <NavDropdown 
            label="Private Jet Getaways" 
            scrolled={isLight}
            items={[
              {label: 'World Cup Flights', href: '/'},
              {label: 'Island Getaways', href: '/island-getaways'},
              {label: 'Golf Getaways', href: '/golf-getaways'},
              {label: 'Ski Getaways', href: '/'}
            ]} 
          />
          <NavDropdown 
            label="Programs & Platform" 
            active={true}
            scrolled={isLight}
            items={[
              {label: 'Memberships', href: '/memberships'},
              {label: 'Jetbay Travel Credit', href: '/'},
              {label: 'Jetbay Jet Card', href: '/jet-card'},
              {label: 'Partnership Program', href: '/partnership-program'},
              {label: 'Jetbay App', href: '/'}
            ]} 
          />
          <div className="h-full flex items-center px-3">
            <a href="#" className={`font-medium text-[14px] transition-colors ${isLight ? 'text-gray-600 hover:text-[#0B1F3A]' : 'text-white/80 hover:text-white'}`}>Services</a>
          </div>
          <div className="h-full flex items-center px-3">
            <a href="#" className={`font-medium text-[14px] transition-colors ${isLight ? 'text-gray-600 hover:text-[#0B1F3A]' : 'text-white/80 hover:text-white'}`}>Plan Your Flight</a>
          </div>
          <div className="h-full flex items-center px-3">
            <a href="#" className={`font-medium text-[14px] transition-colors ${isLight ? 'text-gray-600 hover:text-[#0B1F3A]' : 'text-white/80 hover:text-white'}`}>Company</a>
          </div>
        </nav>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <button className={`hidden sm:flex items-center gap-1.5 text-[14px] font-semibold transition-colors ${isLight ? 'text-gray-700 hover:text-[#0B1F3A]' : 'text-white/80 hover:text-white'}`}>
            <Globe size={18} className={isLight ? 'text-gray-500' : 'text-white/60'} /> USD
          </button>
          <button className={`hidden sm:block text-[14px] font-semibold transition-colors ${isLight ? 'text-gray-700 hover:text-[#0B1F3A]' : 'text-white/80 hover:text-white'}`}>Log In</button>
          <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm ${isLight ? 'bg-[#F4F6FA] hover:bg-[#E8ECF2] text-[#0B1F3A] border border-[#E2E8F0]' : 'bg-[#40DACD] text-[#0B1F3A] hover:bg-[#34C5B9]'}`}>
            <Phone size={16} /> Contact Us
          </button>
        </div>
      </div>
    </header>
  );
};
