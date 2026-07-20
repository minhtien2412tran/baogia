import React from 'react';
import Link from 'next/link';
import { Menu, Globe, Phone } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Topbar = () => (
  <header className="h-[80px] bg-white dark:bg-[#0B1121] flex items-center justify-between px-6 sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors">
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
          <span className="font-extrabold text-[22px] tracking-tight text-[#0B1F3A] dark:text-white">Jet<span className="text-[#40DACD]">bay</span></span>
        </Link>
    </div>
    
    <div className="hidden lg:flex flex-1" />

    
    <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-gray-600 dark:text-gray-300 h-full">
      <div className="h-full flex items-center px-1 text-gray-900 dark:text-white">
        <a href="#" className="transition-colors">Services</a>
      </div>
      <div className="h-full flex items-center px-1 hover:text-gray-900 dark:hover:text-white transition-colors">
        <a href="#">Plan Your Flight</a>
      </div>
      <div className="h-full flex items-center px-1 hover:text-gray-900 dark:hover:text-white transition-colors">
        <a href="#">Company</a>
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
