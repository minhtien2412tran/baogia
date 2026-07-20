"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { TopbarFull } from '@/components/TopbarFull';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  ArrowRight, 
  Globe, 
  Shield, 
  Sparkles, 
  Briefcase, 
  Award, 
  Target, 
  Users, 
  BookOpen, 
  Percent, 
  UserCheck, 
  ChevronRight, 
  ChevronDown,
  Info
} from 'lucide-react';

export default function PartnershipProgramPage() {
  const [activePartnerType, setActivePartnerType] = useState<'service' | 'referral' | 'official'>('service');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    countryCode: '+84',
    whatsapp: '',
    wechat: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.phone) return;
    setFormSubmitted(true);
  };

  // Features list for comparison
  const comparisonRows = [
    { name: '24/7 Customer & Flight Support', service: true, referral: true, official: true },
    { name: 'Real-time Flight Operations Updates', service: true, referral: true, official: true },
    { name: 'Smart Ordering & Multi-language Quotation', service: true, referral: true, official: true },
    { name: 'Online Training', service: 'Optional', referral: 'Optional', official: true },
    { name: 'Back-end Account', service: 'Optional', referral: 'Optional', official: true },
    { name: 'Brand Asset Library', service: false, referral: 'Optional', official: true },
    { name: 'End-to-End Visualized Process', service: false, referral: false, official: true },
    { name: 'Post-flight Supplier Contract', service: false, referral: false, official: true },
    { name: 'Client Management & Signing System', service: false, referral: false, official: true },
  ];

  // Dark benefits section
  const benefitCards = [
    {
      id: 'benefit-1',
      title: 'Global Brand Advantage',
      desc: 'Leverage Jetbay\'s industry-leading luxury aviation presence and global network of audited safety flight carriers.',
      icon: <Award className="text-[#40DACD]" size={24} />,
    },
    {
      id: 'benefit-2',
      title: 'Diversified Earning Opportunities',
      desc: 'Unlock commission payouts, override models, and special VIP rewards based on flight hours and tier achievement.',
      icon: <Percent className="text-[#40DACD]" size={24} />,
    },
    {
      id: 'benefit-3',
      title: 'Access to Premium Clients',
      desc: 'Connect your business to UHNWIs, corporate executives, and private leisure travelers looking for ultimate reliability.',
      icon: <Users className="text-[#40DACD]" size={24} />,
    },
    {
      id: 'benefit-4',
      title: 'Operational Support',
      desc: 'Get full access to our 24/7 flight operations center, ensuring smooth trip coordination from booking to landing.',
      icon: <Briefcase className="text-[#40DACD]" size={24} />,
    },
    {
      id: 'benefit-5',
      title: 'Training & Development',
      desc: 'Acquire deep private aviation mastery via expert-led webinars, physical workshops, and detailed sales support assets.',
      icon: <BookOpen className="text-[#40DACD]" size={24} />,
    },
    {
      id: 'benefit-6',
      title: 'Guaranteed Benefits',
      desc: 'Secure fixed contract rates, high priority slot reservation during peak travel, and customized flight amenities.',
      icon: <Shield className="text-[#40DACD]" size={24} />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1121] transition-colors font-sans">
      <TopbarFull lightTheme={true} />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-16 pb-20 md:py-24 bg-[#F4F6FA] dark:bg-[#070A13] transition-colors">
        {/* Subtle background glow */}
        <div className="absolute -top-[10%] -right-[5%] w-[45%] h-[55%] rounded-full bg-[#1e68f0]/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-[38px] md:text-[54px] font-black text-[#0B1F3A] dark:text-white leading-[1.1] tracking-tight">
                Join the Jetbay <br />
                Global Partner Program
              </h1>

              <p className="text-[15px] md:text-[16px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join our Global Partner Program — no aviation experience required. Refer clients, choose the partnership model that suits you, and earn consistent payouts with global support.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a 
                  href="#register-form"
                  className="w-full sm:w-auto text-center bg-[#1e68f0] hover:bg-[#1550c7] text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all hover:scale-[1.02] shadow-[0_4px_14px_rgba(30,104,240,0.4)] active:scale-95"
                >
                  Join Us Today
                </a>
              </div>

              {/* Partners avatars overlay */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 justify-center lg:justify-start">
                <div className="flex -space-x-3 overflow-hidden items-center">
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#0B1121] relative overflow-hidden bg-gray-200">
                    <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80" alt="Partner" fill className="object-cover" />
                  </div>
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#0B1121] relative overflow-hidden bg-gray-200">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80" alt="Partner" fill className="object-cover" />
                  </div>
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#0B1121] relative overflow-hidden bg-gray-200">
                    <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" alt="Partner" fill className="object-cover" />
                  </div>
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#0B1121] bg-[#1e68f0] flex items-center justify-center relative overflow-hidden z-10 shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  500+ Jetbay Global Partners
                </div>
              </div>
            </motion.div>

            {/* Right Column: Premium World Flight Map Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center min-h-[300px] md:min-h-[450px]"
            >
              {/* Complex SVG World Map Overlay */}
              <div className="w-full h-full max-w-[550px] aspect-video relative flex items-center justify-center bg-white/40 dark:bg-[#0F162A]/40 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/50 dark:border-gray-800/50 backdrop-blur-sm">
                <svg viewBox="0 0 850 450" className="w-full h-full text-gray-300 dark:text-[#1e293b]" fill="none">
                  {/* Pattern definition for dot matrix/hexagon matrix */}
                  <defs>
                    <pattern id="dotGrid" width="9" height="9" patternUnits="userSpaceOnUse">
                      <circle cx="4.5" cy="4.5" r="1.6" className="fill-gray-300/75 dark:fill-gray-800/80" />
                    </pattern>
                  </defs>

                  {/* Stylized world continents filled with precise high-density dot pattern */}
                  <g fill="url(#dotGrid)">
                    {/* North America */}
                    <path d="M 110,65 L 120,55 L 145,55 L 155,40 L 165,55 L 180,50 L 185,60 L 225,50 L 235,55 L 240,75 L 230,85 L 235,95 L 225,100 L 220,115 L 205,120 L 200,135 L 195,135 L 180,165 L 185,185 L 175,200 L 165,225 L 160,225 L 162,210 L 165,200 L 158,190 L 160,175 L 140,150 L 142,130 L 135,125 L 138,110 L 122,110 L 115,120 L 115,110 L 110,105 L 112,95 L 100,105 L 95,95 L 105,80 Z" />
                    
                    {/* South America */}
                    <path d="M 165,225 L 175,230 L 185,240 L 195,255 L 200,270 L 205,290 L 195,315 L 190,335 L 180,360 L 172,380 L 168,390 L 164,385 L 166,365 L 162,350 L 155,335 L 158,320 L 150,300 L 146,280 L 148,260 L 152,245 L 160,235 Z" />
                    
                    {/* Greenland */}
                    <path d="M 215,35 L 235,30 L 245,45 L 230,55 L 220,50 Z" />
                    
                    {/* Africa */}
                    <path d="M 390,190 L 405,185 L 425,185 L 440,195 L 455,200 L 470,205 L 480,215 L 485,230 L 475,250 L 465,270 L 460,290 L 455,310 L 442,330 L 438,340 L 434,335 L 435,315 L 425,300 L 420,285 L 415,265 L 405,255 L 392,245 L 382,230 L 380,215 L 385,200 Z" />
                    
                    {/* Eurasia (Europe + Asia) */}
                    <path d="M 340,75 L 350,65 L 370,60 L 390,65 L 415,55 L 430,60 L 450,55 L 470,65 L 490,60 L 520,65 L 550,60 L 580,65 L 610,60 L 640,65 L 670,60 L 700,65 L 720,75 L 740,90 L 755,105 L 765,120 L 760,135 L 745,145 L 730,150 L 715,145 L 710,160 L 715,175 L 705,185 L 690,180 L 685,195 L 675,190 L 665,200 L 650,195 L 640,185 L 635,200 L 620,205 L 610,195 L 600,205 L 590,200 L 575,210 L 565,200 L 550,210 L 540,205 L 530,195 L 520,205 L 510,195 L 500,205 L 485,195 L 475,185 L 460,190 L 445,180 L 430,185 L 415,180 L 400,185 L 390,175 L 375,180 L 365,170 L 355,175 L 345,160 L 340,145 L 332,130 L 335,115 L 330,100 L 335,85 Z" />
                    
                    {/* Australia */}
                    <path d="M 680,270 L 700,265 L 720,275 L 730,290 L 725,305 L 710,315 L 690,310 L 675,295 Z" />
                  </g>

                  {/* High Tech Flight Route Paths (Dashed curves) */}
                  <path d="M 160,110 Q 300,50 430,100 T 650,110" stroke="#1e68f0" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                  <path d="M 175,280 Q 310,240 440,240 T 710,290" stroke="#1e68f0" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

                  {/* Scattered Orange / Yellow Active Nodes */}
                  <circle cx="120" cy="160" r="3.5" className="fill-[#F59E0B]" />
                  <circle cx="220" cy="180" r="3" className="fill-[#F59E0B]" />
                  <circle cx="190" cy="340" r="3.5" className="fill-[#F59E0B]" />
                  <circle cx="400" cy="130" r="3" className="fill-[#F59E0B]" />
                  <circle cx="490" cy="150" r="3.5" className="fill-[#F59E0B]" />
                  <circle cx="580" cy="150" r="3" className="fill-[#F59E0B]" />
                  <circle cx="670" cy="180" r="3.5" className="fill-[#F59E0B]" />
                  <circle cx="740" cy="330" r="3" className="fill-[#F59E0B]" />

                  {/* Scattered Small Dark Blue Nodes */}
                  <circle cx="140" cy="90" r="2.5" className="fill-[#0B1F3A]" opacity="0.6" />
                  <circle cx="420" cy="80" r="2.5" className="fill-[#0B1F3A]" opacity="0.6" />
                  <circle cx="600" cy="110" r="2.5" className="fill-[#0B1F3A]" opacity="0.6" />
                  <circle cx="700" cy="130" r="2.5" className="fill-[#0B1F3A]" opacity="0.6" />

                  {/* Pulsing Locator Pins / Flight nodes with custom Jetbay shield icon */}
                  {/* North America Node */}
                  <g>
                    <circle cx="160" cy="110" r="16" className="stroke-[#1e68f0] stroke-[1.5] fill-none opacity-40 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <g transform="translate(160, 110)">
                      <path d="M-10,-12 L10,-12 L14,-2 L0,14 L-14,-2 Z" className="fill-[#1e68f0] stroke-white stroke-[1]" />
                      <path d="M-4,0 L-1,3 L5,-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </g>

                  {/* Europe Node */}
                  <g>
                    <circle cx="430" cy="100" r="16" className="stroke-[#1e68f0] stroke-[1.5] fill-none opacity-40 animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <g transform="translate(430, 100)">
                      <path d="M-10,-12 L10,-12 L14,-2 L0,14 L-14,-2 Z" className="fill-[#1e68f0] stroke-white stroke-[1]" />
                      <path d="M-4,0 L-1,3 L5,-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </g>

                  {/* Asia Node */}
                  <g>
                    <circle cx="650" cy="110" r="16" className="stroke-[#1e68f0] stroke-[1.5] fill-none opacity-40 animate-[ping_3.1s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <g transform="translate(650, 110)">
                      <path d="M-10,-12 L10,-12 L14,-2 L0,14 L-14,-2 Z" className="fill-[#1e68f0] stroke-white stroke-[1]" />
                      <path d="M-4,0 L-1,3 L5,-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </g>

                  {/* South America Node */}
                  <g>
                    <circle cx="175" cy="280" r="16" className="stroke-[#1e68f0] stroke-[1.5] fill-none opacity-40 animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <g transform="translate(175, 280)">
                      <path d="M-10,-12 L10,-12 L14,-2 L0,14 L-14,-2 Z" className="fill-[#1e68f0] stroke-white stroke-[1]" />
                      <path d="M-4,0 L-1,3 L5,-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </g>

                  {/* Africa Node */}
                  <g>
                    <circle cx="440" cy="240" r="16" className="stroke-[#1e68f0] stroke-[1.5] fill-none opacity-40 animate-[ping_2.7s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <g transform="translate(440, 240)">
                      <path d="M-10,-12 L10,-12 L14,-2 L0,14 L-14,-2 Z" className="fill-[#1e68f0] stroke-white stroke-[1]" />
                      <path d="M-4,0 L-1,3 L5,-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </g>

                  {/* Australia Node */}
                  <g>
                    <circle cx="710" cy="290" r="16" className="stroke-[#1e68f0] stroke-[1.5] fill-none opacity-40 animate-[ping_3.3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <g transform="translate(710, 290)">
                      <path d="M-10,-12 L10,-12 L14,-2 L0,14 L-14,-2 Z" className="fill-[#1e68f0] stroke-white stroke-[1]" />
                      <path d="M-4,0 L-1,3 L5,-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </g>

                  {/* Animated Flying Jet Icon traversing along path */}
                  <g transform="translate(560, 85) rotate(15)">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e68f0] fill-current animate-pulse">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z" />
                    </svg>
                  </g>
                </svg>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2: JETBAY PARTNER DESCRIPTION */}
      <section className="py-20 bg-white dark:bg-[#0B1121] transition-colors">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-16">
            
            {/* Left Column: Overlapping Luxury Jet Images */}
            <div className="w-full lg:w-[50%] relative flex items-center justify-center min-h-[360px] md:min-h-[460px]">
              {/* Primary Background Card Image */}
              <div className="w-[85%] aspect-[4/3] rounded-[24px] overflow-hidden relative shadow-2xl border border-gray-100 dark:border-gray-800 z-10">
                <Image 
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop" 
                  alt="Jetbay Luxury Jet Cabin" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlapping Floating Secondary Image */}
              <div className="absolute bottom-[-10px] right-0 w-[42%] aspect-[4/3] rounded-[18px] overflow-hidden shadow-2xl border-4 border-white dark:border-[#0B1121] z-20">
                <Image 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" 
                  alt="Business Traveler inside private jet" 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Column: Descriptions */}
            <div className="w-full lg:w-[50%] space-y-6">
              <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B1F3A] dark:text-white leading-tight">
                Jetbay Partner
              </h2>
              <div className="h-[3px] w-14 bg-gradient-to-r from-[#1e68f0] to-[#40DACD]"></div>
              
              <p className="text-[15.5px] text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                The Jetbay Partner Program makes it easy for anyone, from individuals to businesses, to take part in private jet travel with zero entry barriers.
              </p>

              <p className="text-[14.5px] text-gray-500 dark:text-gray-400 leading-relaxed space-y-3">
                Choose from three flexible partnership options to refer clients or collaborate under the Jetbay brand. With ready-to-use business tools, marketing support, and regular payouts, you can start earning and growing with Jetbay&apos;s global network — no aviation experience required.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a 
                  href="#register-form"
                  className="inline-flex items-center gap-2 text-[#1e68f0] dark:text-[#40DACD] font-bold hover:underline group underline-offset-[5px]"
                >
                  Join Us Today 
                  <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: WHICH PARTNER PROGRAM IS RIGHT FOR YOU */}
      <section id="programs-overview" className="py-20 md:py-28 relative bg-[#F4F6FA] dark:bg-[#070A13] overflow-hidden border-b border-gray-100 dark:border-gray-900 transition-colors">
        {/* Subtle Background Image of Luxury Aviation / Global Network */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=2000&auto=format&fit=crop"
            alt="Global Aviation Network Background"
            fill
            className="object-cover opacity-[0.03] dark:opacity-[0.06] pointer-events-none filter grayscale"
            referrerPolicy="no-referrer"
          />
          {/* World map network overlay or subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.3] dark:opacity-[0.15] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] rounded-full bg-[#1e68f0]/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          
          <div className="max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
              Which Partner Program is Right for You
            </h2>
            <div className="text-gray-500 dark:text-gray-400 text-[14px]">
              Shared Vision · Empowered Growth · Partnering for Tomorrow
            </div>
          </div>

          {/* Three Partners Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Card 1: Service Partner */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#0F162A] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col relative group text-left min-h-[420px]"
            >
              <div className="absolute left-0 right-0 bottom-0 h-[220px] z-0 overflow-hidden pointer-events-none">
                <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full stroke-gray-200/50 dark:stroke-gray-700/50" fill="none" strokeWidth="0.5">
                  {Array.from({length: 25}).map((_, i) => (
                    <path key={i} d={`M-50 ${180 - i*6} C 150 ${120 - i*9}, 350 ${220 - i*4}, 550 ${120 + i*11}`} />
                  ))}
                </svg>
              </div>

              <div className="p-8 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[22px] font-medium text-[#0B1F3A] dark:text-white tracking-tight">
                    Service Partner
                  </h3>
                  <div className="w-10 h-10 flex items-center justify-end">
                    <svg width="28" height="28" viewBox="0 0 24 24" className="text-gray-500 dark:text-gray-400 transform -rotate-12 drop-shadow-sm">
                      <polygon points="12,2 22,7 12,12 2,7" fill="currentColor" opacity="0.8" />
                      <polygon points="2,7 12,12 12,22 2,17" fill="currentColor" opacity="0.5" />
                      <polygon points="22,7 12,12 12,22 22,17" fill="currentColor" opacity="0.3" />
                    </svg>
                  </div>
                </div>

                <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed pr-4">
                  Travel agencies, brokers, or service providers who want to expand offerings.
                </p>

                <div className="mt-auto pt-10 flex justify-between items-end">
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 pb-1.5">
                    A flexible entry point.
                  </p>
                  <a 
                    href="#register-form" 
                    onClick={() => setActivePartnerType('service')}
                    className="px-5 py-2 rounded-[6px] border border-[#1e68f0] text-[#1e68f0] font-medium text-[14px] hover:bg-[#1e68f0] hover:text-white transition-colors bg-white dark:bg-transparent"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Referral Partner */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#0F162A] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col relative group text-left min-h-[420px]"
            >
              <div className="absolute left-0 right-0 bottom-0 h-[220px] z-0 overflow-hidden pointer-events-none">
                <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full stroke-gray-200/50 dark:stroke-gray-700/50" fill="none" strokeWidth="0.5">
                  {Array.from({length: 25}).map((_, i) => (
                    <path key={i} d={`M-50 ${180 - i*6} C 150 ${120 - i*9}, 350 ${220 - i*4}, 550 ${120 + i*11}`} />
                  ))}
                </svg>
              </div>

              <div className="p-8 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[22px] font-medium text-[#0B1F3A] dark:text-white tracking-tight">
                    Referral Partner
                  </h3>
                  <div className="w-10 h-10 flex items-center justify-end">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500 dark:text-gray-400 transform -rotate-12 drop-shadow-sm">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
                    </svg>
                  </div>
                </div>

                <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed pr-4">
                  Entrepreneurs, consultants, or individuals with strong networks.
                </p>

                <div className="mt-auto pt-10 flex justify-between items-end">
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 pb-1.5">
                    A smarter way to earn.
                  </p>
                  <a 
                    href="#register-form" 
                    onClick={() => setActivePartnerType('referral')}
                    className="px-5 py-2 rounded-[6px] border border-[#1e68f0] text-[#1e68f0] font-medium text-[14px] hover:bg-[#1e68f0] hover:text-white transition-colors bg-white dark:bg-transparent"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Official Partner */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#0F162A] rounded-xl overflow-hidden border border-[#1e68f0]/20 shadow-sm flex flex-col relative group text-left min-h-[420px]"
            >
              <div className="absolute left-0 right-0 bottom-0 h-[220px] z-0 overflow-hidden pointer-events-none">
                <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full stroke-gray-200/50 dark:stroke-gray-700/50" fill="none" strokeWidth="0.5">
                  {Array.from({length: 25}).map((_, i) => (
                    <path key={i} d={`M-50 ${180 - i*6} C 150 ${120 - i*9}, 350 ${220 - i*4}, 550 ${120 + i*11}`} />
                  ))}
                </svg>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e68f0]/5 rounded-bl-full pointer-events-none"></div>

              <div className="p-8 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[22px] font-medium text-[#1e68f0] tracking-tight">
                    Official Partner
                  </h3>
                  <div className="w-10 h-10 flex items-center justify-end">
                    <svg width="28" height="28" viewBox="0 0 24 24" className="text-[#1e68f0] drop-shadow-md transform -rotate-12">
                      <polygon points="12,2 20,10 12,22 4,10" fill="currentColor" opacity="0.9" />
                      <polygon points="12,2 12,22 4,10" opacity="0.4" fill="#ffffff" />
                    </svg>
                  </div>
                </div>

                <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed pr-4">
                  Established businesses or professionals in travel, luxury, or aviation services.
                </p>

                <div className="mt-auto pt-10 flex justify-between items-end">
                  <p className="text-[13px] text-[#1e68f0] pb-1.5">
                    The highest tier of benefits.
                  </p>
                  <a 
                    href="#register-form" 
                    onClick={() => setActivePartnerType('official')}
                    className="px-5 py-2 rounded-[6px] border border-[#1e68f0] text-[#1e68f0] font-medium text-[14px] hover:bg-[#1e68f0] hover:text-white transition-colors bg-white dark:bg-transparent"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 4: PARTNERSHIP COMPARISON TABLE */}
      <section className="py-20 bg-white dark:bg-[#0B1121] transition-colors">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#0B1F3A] dark:text-white">
              Compare Our Partnership Programs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyze side-by-side features of each partnership layer to find your ideal fit.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-[#0F162A]">
            <table className="w-full min-w-[700px] text-left border-collapse font-mono text-[13px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]/30">
                  <th className="py-5 px-6 font-bold text-gray-900 dark:text-white flex items-center gap-1.5 font-sans text-sm">
                    Role
                  </th>
                  <th className="py-5 px-6 font-black text-gray-700 dark:text-gray-300 text-center font-sans text-sm w-[20%]">
                    Service Partner
                  </th>
                  <th className="py-5 px-6 font-black text-gray-700 dark:text-gray-300 text-center font-sans text-sm w-[20%]">
                    Referral Partner
                  </th>
                  <th className="py-5 px-6 font-black text-[#1e68f0] dark:text-[#40DACD] text-center font-sans text-sm w-[20%]">
                    Official Partner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-[#1E293B]/20 transition-colors">
                    <td className="py-4.5 px-6 font-semibold text-gray-800 dark:text-gray-300 font-sans text-[13.5px]">
                      {row.name}
                    </td>
                    
                    {/* Service Column */}
                    <td className="py-4.5 px-6 text-center">
                      {row.service === true ? (
                        <Check className="text-sky-500 mx-auto" size={18} />
                      ) : row.service === 'Optional' ? (
                        <span className="text-gray-400 dark:text-gray-500 font-medium font-sans">Optional</span>
                      ) : (
                        <X className="text-red-400 mx-auto" size={18} />
                      )}
                    </td>

                    {/* Referral Column */}
                    <td className="py-4.5 px-6 text-center">
                      {row.referral === true ? (
                        <Check className="text-sky-500 mx-auto" size={18} />
                      ) : row.referral === 'Optional' ? (
                        <span className="text-gray-400 dark:text-gray-500 font-medium font-sans">Optional</span>
                      ) : (
                        <X className="text-red-400 mx-auto" size={18} />
                      )}
                    </td>

                    {/* Official Column */}
                    <td className="py-4.5 px-6 text-center bg-[#1e68f0]/[0.01] dark:bg-[#40DACD]/[0.01]">
                      {row.official === true ? (
                        <Check className="text-emerald-500 mx-auto font-black" size={18} />
                      ) : (
                        <X className="text-red-400 mx-auto" size={18} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY JOIN OUR PARTNERSHIP PROGRAMS */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        {/* Blue glow at the bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[200px] bg-[#1e68f0] opacity-30 blur-[120px] pointer-events-none rounded-t-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="text-[#1e68f0] font-medium text-[15px] tracking-wide">
              Partner Privileges
            </div>
            <h2 className="text-[32px] md:text-[38px] font-bold tracking-tight text-white leading-tight">
              Why Join Our Partnership Programs
            </h2>
          </div>

          {/* Grid Layout of Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-[1000px] mx-auto pb-8 relative z-10">
            {benefitCards.map((benefit, idx) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex items-center justify-center p-8 text-center rounded-[12px] bg-gradient-to-br from-[#1A2030] to-[#0A0D14] border border-white/5 border-t-white/20 border-r-white/20 md:h-[280px] transition-transform hover:-translate-y-1 ${
                  idx % 3 !== 1 ? 'md:mt-10' : ''
                }`}
              >
                <h3 className="text-[16px] md:text-[17px] font-bold text-white tracking-wide relative z-10">
                  {benefit.title}
                </h3>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: JETBAY PARTNER APPLICATION PROCESS */}
      <section className="py-20 bg-white dark:bg-[#0B1121] transition-colors">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Process steps */}
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-[32px] md:text-[42px] font-black text-[#0B1F3A] dark:text-white leading-tight">
                  Jetbay Partner Application Process
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-gray-400">
                  Designed for individuals and businesses ready to collaborate and grow with Jetbay.
                </p>
              </div>

              {/* Step items */}
              <div className="space-y-6">
                
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1e68f0]/10 text-[#1e68f0] flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-[16px] mb-1">Create a Jetbay Account</h4>
                    <p className="text-[14.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      Sign up for your Jetbay account to access the partner application form securely.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1e68f0]/10 text-[#1e68f0] flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-[16px] mb-1">Submit Your Partner Application</h4>
                    <p className="text-[14.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      Complete the application form with your core business detail profile or personal networks.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1e68f0]/10 text-[#1e68f0] flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-[16px] mb-1">Review & Verification</h4>
                    <p className="text-[14.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      Our team will review your submission and provide the verified outcome within 3 working days.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1e68f0]/10 text-[#1e68f0] flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-[16px] mb-1">Approval & Start Partnering</h4>
                    <p className="text-[14.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      Once approved, you can begin accessing exclusive partnership commissions and flight assets.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Exhibition booth image matching mockup */}
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-gray-50">
              <Image 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop" 
                alt="Corporate aviation networking and partnership booth" 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: REGISTRATION FORM */}
      <section id="register-form" className="py-24 bg-white dark:bg-[#0B1121] transition-colors">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
              <h2 className="text-[32px] md:text-[38px] font-bold text-[#0B1F3A] dark:text-white leading-tight tracking-tight">
                Welcome to the Jetbay Partner Program
              </h2>
              <p className="text-[15px] text-gray-500 dark:text-gray-400">
                Choose your partnership path and start growing with us.
              </p>
            </div>

            {/* Tab Selector representing Service, Referral, Official */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
              <button
                type="button"
                onClick={() => setActivePartnerType('service')}
                className={`px-8 py-2.5 rounded-[4px] font-medium text-[14px] transition-colors ${activePartnerType === 'service' ? 'border border-[#1e68f0] text-[#1e68f0] bg-white dark:bg-transparent' : 'bg-[#F8F9FA] dark:bg-[#1E293B]/40 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-transparent'}`}
              >
                Service Partner
              </button>
              <button
                type="button"
                onClick={() => setActivePartnerType('referral')}
                className={`px-8 py-2.5 rounded-[4px] font-medium text-[14px] transition-colors ${activePartnerType === 'referral' ? 'border border-[#1e68f0] text-[#1e68f0] bg-white dark:bg-transparent' : 'bg-[#F8F9FA] dark:bg-[#1E293B]/40 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-transparent'}`}
              >
                Referral Partner
              </button>
              <button
                type="button"
                onClick={() => setActivePartnerType('official')}
                className={`px-8 py-2.5 rounded-[4px] font-medium text-[14px] transition-colors ${activePartnerType === 'official' ? 'border border-[#1e68f0] text-[#1e68f0] bg-white dark:bg-transparent' : 'bg-[#F8F9FA] dark:bg-[#1E293B]/40 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-transparent'}`}
              >
                Official Partner
              </button>
            </div>

            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-8 rounded-2xl text-center space-y-4 max-w-2xl mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-[#40DACD] flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Application Received!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                  Thank you for applying for the Jetbay <span className="capitalize font-semibold text-[#1e68f0] dark:text-[#40DACD]">{activePartnerType} Partner</span> Program. Our global partner onboarding managers will review your profile and reach out within 3 business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ email: '', phone: '', countryCode: '+84', whatsapp: '', wechat: '' });
                  }}
                  className="mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Grid of core details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-gray-800 dark:text-gray-200">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address" 
                      className="w-full border border-gray-200/80 dark:border-gray-800 rounded-[6px] px-4 py-3 text-[14px] bg-white dark:bg-[#1E293B]/30 outline-none focus:border-[#1e68f0] dark:focus:border-[#1e68f0] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-gray-800 dark:text-gray-200">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <div className="flex border border-gray-200/80 dark:border-gray-800 rounded-[6px] bg-white dark:bg-[#1E293B]/30 overflow-hidden focus-within:border-[#1e68f0] transition-colors">
                      <div className="relative shrink-0 flex items-center border-r border-gray-200/80 dark:border-gray-800">
                        <select 
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                          className="appearance-none bg-transparent pl-4 pr-7 py-3 text-[14px] outline-none cursor-pointer"
                        >
                          <option value="+84">🇻🇳 +84</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+65">🇸🇬 +65</option>
                          <option value="+81">🇯🇵 +81</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Please enter your phone number" 
                        className="w-full px-4 py-3 text-[14px] bg-transparent outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-gray-800 dark:text-gray-200">
                      WhatsApp
                    </label>
                    <input 
                      type="text" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Enter your WhatsApp (optional)" 
                      className="w-full border border-gray-200/80 dark:border-gray-800 rounded-[6px] px-4 py-3 text-[14px] bg-white dark:bg-[#1E293B]/30 outline-none focus:border-[#1e68f0] dark:focus:border-[#1e68f0] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  {/* WeChat */}
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-gray-800 dark:text-gray-200">
                      WeChat
                    </label>
                    <input 
                      type="text" 
                      name="wechat"
                      value={formData.wechat}
                      onChange={handleInputChange}
                      placeholder="Enter your WeChat (optional)" 
                      className="w-full border border-gray-200/80 dark:border-gray-800 rounded-[6px] px-4 py-3 text-[14px] bg-white dark:bg-[#1E293B]/30 outline-none focus:border-[#1e68f0] dark:focus:border-[#1e68f0] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto bg-[#1e68f0] hover:bg-[#1550c7] text-white px-8 py-2.5 rounded-[4px] font-medium text-[15px] transition-colors"
                  >
                    Join Us Today
                  </button>
                </div>

              </form>
            )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
