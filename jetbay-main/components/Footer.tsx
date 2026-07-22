import React from 'react';
import Link from 'next/link';
import { Mail, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full">
      {/* Top Newsletter Section with #f4fbfb background */}
      <div className="w-full bg-[#f4fbfb] dark:bg-[#0F162A] border-t border-gray-100 dark:border-gray-800/50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
               <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-[15px]">Subscribe to our newsletter</h4>
               <p className="text-[13px] text-[#4A4A4A] dark:text-gray-400">Get exclusive deals and updates on private jet travel</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <input type="email" placeholder="Enter your email" className="w-full md:w-72 outline-none border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-[14px] bg-white dark:bg-[#152033] shadow-sm focus:border-[#40DACD] transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white" />
               <button className="bg-[#40DACD] hover:bg-[#34C4B8] text-[#050505] px-6 py-2.5 rounded-lg text-[14px] font-bold shadow-sm transition-colors flex items-center gap-2">
                 <Mail size={16} /> Subscribe
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links and Copyright Section with bg-[#f4fbfb] / dark:bg-[#0F162A] */}
      <div className="w-full bg-[#f4fbfb] dark:bg-[#0F162A] py-12 transition-colors">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-100 dark:border-gray-800 pb-12 mb-8">
             <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-[14px] mb-5">Charter Services</h4>
                <ul className="space-y-4 text-[13px] text-gray-500 dark:text-gray-400">
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">On-Demand Charter</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Jetbay SOS</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Fixed Price Charter</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Empty Legs</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Group Charter</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Corporate Charter</a></li>
                   <li><Link href="/air-ambulance" className="hover:text-gray-900 dark:hover:text-white transition-colors">Air Ambulance</Link></li>
                   <li><Link href="/pet-travel" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pet Travel</Link></li>
                   <li><Link href="/event-charter" className="hover:text-gray-900 dark:hover:text-white transition-colors">Event Charter</Link></li>
                </ul>
             </div>
             
             <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-[14px] mb-5">Private Jet Getaways</h4>
                <ul className="space-y-4 text-[13px] text-gray-500 dark:text-gray-400">
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">World Cup Flights</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Island Getaways</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Golf Getaways</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Ski Getaways</a></li>
                </ul>
                <h4 className="font-bold text-gray-900 dark:text-white text-[14px] mb-5 mt-8">Plan Your Flight</h4>
                <ul className="space-y-4 text-[13px] text-gray-500 dark:text-gray-400">
                   <li><Link href="/how-to-book" className="hover:text-gray-900 dark:hover:text-white transition-colors">How to Book</Link></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Empty Leg Recommendation</a></li>
                   <li><Link href="/destinations" className="hover:text-gray-900 dark:hover:text-white transition-colors">Destinations</Link></li>
                   <li><Link href="/airports" className="hover:text-gray-900 dark:hover:text-white transition-colors">Airports</Link></li>
                </ul>
             </div>
             
             <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-[14px] mb-5">Programs & Platform</h4>
                <ul className="space-y-4 text-[13px] text-gray-500 dark:text-gray-400">
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">JETBAY Travel Credit</a></li>
                   <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">JETBAY Jet Card</a></li>
                   <li><Link href="/partnership-program" className="hover:text-gray-900 dark:hover:text-white transition-colors">Partnership Program</Link></li>
                   <li><Link href="/jetbay-app" className="hover:text-gray-900 dark:hover:text-white transition-colors">JETBAY App</Link></li>
                </ul>
                <h4 className="font-bold text-gray-900 dark:text-white text-[14px] mb-5 mt-8">Company</h4>
                <ul className="space-y-4 text-[13px] text-gray-500 dark:text-gray-400">
                   <li><Link href="/about-us" className="hover:text-gray-900 dark:hover:text-white transition-colors">About Us</Link></li>
                   <li><Link href="/blogs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blogs</Link></li>
                   <li><Link href="/news" className="hover:text-gray-900 dark:hover:text-white transition-colors">News</Link></li>
                   <li><Link href="/video-centre" className="hover:text-gray-900 dark:hover:text-white transition-colors">Video Centre</Link></li>
                </ul>
             </div>

             <div className="col-span-2 md:pl-10">
                <h4 className="font-bold text-gray-900 dark:text-white text-[13px] mb-4">We Accept</h4>
                <div className="flex flex-wrap gap-2 mb-8">
                   {/* Logos placeholder */}
                   <div className="w-10 h-6 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] font-bold text-[#1434CB] dark:text-[#4B6BF5]">VISA</div>
                   <div className="w-10 h-6 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] font-bold text-[#EB001B] dark:text-[#FF4D61]">MC</div>
                   <div className="w-10 h-6 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] font-bold text-[#0070CE] dark:text-[#339BFF]">AMEX</div>
                   <div className="w-10 h-6 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] font-bold text-[#00A29A] dark:text-[#33C4BD]">UP</div>
                </div>

                <h4 className="font-bold text-gray-900 dark:text-white text-[13px] mb-4">Our Memberships</h4>
                <div className="grid grid-cols-4 gap-2">
                   <div className="w-14 h-10 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] text-gray-500 dark:text-gray-400">WYVERN</div>
                   <div className="w-14 h-10 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] text-gray-500 dark:text-gray-400">ACA</div>
                   <div className="w-14 h-10 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] text-gray-500 dark:text-gray-400">NBAA</div>
                   <div className="w-14 h-10 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] text-gray-500 dark:text-gray-400">EBAA</div>
                   <div className="w-14 h-10 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] text-gray-500 dark:text-gray-400">AsBAA</div>
                   <div className="w-14 h-10 bg-gray-100 dark:bg-[#152033] rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px] text-gray-500 dark:text-gray-400">BBGA</div>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between text-[12px] font-medium text-gray-900 dark:text-gray-400">
             <p>© 2026 JETBAY Inc. All rights reserved. Trademarks are the property of their respective owners. <span className="underline cursor-pointer ml-2 hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</span> · <span className="underline cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">Cookie Consent</span></p>
             <div className="flex items-center gap-4 mt-4 md:mt-0 text-gray-700 dark:text-gray-400">
                <Instagram size={18} className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" />
                <Linkedin size={18} className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" />
                <Youtube size={18} className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" />
                <Facebook size={18} className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" />
             </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

