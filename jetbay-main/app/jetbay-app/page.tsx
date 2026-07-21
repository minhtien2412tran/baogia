'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { 
  Check, 
  ArrowRight, 
  Smartphone, 
  MapPin, 
  Calendar, 
  Users, 
  Globe, 
  DollarSign, 
  ShieldCheck, 
  MessageSquare, 
  TrendingUp, 
  Compass,
  ArrowUpRight,
  Sparkles,
  Plane,
  Coins,
  Send,
  Sliders,
  Phone,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  Coffee,
  ShieldAlert,
  SlidersHorizontal,
  Info
} from 'lucide-react';

// Import generated images
import heroHandImage from '@/src/assets/images/jetbay_app_hero_hand_1784623191032.jpg';
import botImage from '@/src/assets/images/jetbay_app_bot_1784623210566.jpg';

type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'AUD';

interface RouteOption {
  from: string;
  to: string;
  distance: string;
  duration: string;
  basePriceUSD: number;
  seats: number;
  jetModel: string;
  jetClass: 'HEAVY' | 'MID-SIZE' | 'LIGHT';
  departureTime: string;
}

const ROUTE_OPTIONS: RouteOption[] = [
  {
    from: 'Shanghai (PVG)',
    to: 'Beijing (PEK)',
    distance: '1,080 km',
    duration: '2h 10m',
    basePriceUSD: 22556,
    seats: 8,
    jetModel: 'Global 7500',
    jetClass: 'HEAVY',
    departureTime: '14:30 UTC'
  },
  {
    from: 'Tokyo (HND)',
    to: 'Singapore (SIN)',
    distance: '5,300 km',
    duration: '6h 45m',
    basePriceUSD: 64900,
    seats: 12,
    jetModel: 'Gulfstream G650',
    jetClass: 'HEAVY',
    departureTime: '09:15 UTC'
  },
  {
    from: 'London (LTN)',
    to: 'Paris (LBG)',
    distance: '340 km',
    duration: '0h 50m',
    basePriceUSD: 12400,
    seats: 6,
    jetModel: 'Phenom 300E',
    jetClass: 'LIGHT',
    departureTime: '18:00 UTC'
  },
  {
    from: 'New York (TEB)',
    to: 'Miami (OPF)',
    distance: '1,750 km',
    duration: '2h 30m',
    basePriceUSD: 18800,
    seats: 8,
    jetModel: 'Challenger 350',
    jetClass: 'MID-SIZE',
    departureTime: '11:45 UTC'
  }
];

const CURRENCY_CONVERSIONS: Record<CurrencyType, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.77 },
  AUD: { symbol: 'A$', rate: 1.48 }
};

export default function JetbayAppPage() {
  // Navigation states inside the simulated app mockup
  const [phoneTab, setPhoneTab] = useState<'search' | 'trips' | 'chat'>('search');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('USD');
  const [activeFeatureTab, setActiveFeatureTab] = useState<'seamless' | 'convenient'>('seamless');
  
  // Custom Dynamic Calculator states
  const [calcDistance, setCalcDistance] = useState<number>(1200);
  const [calcPassengers, setCalcPassengers] = useState<number>(4);
  const [loungeService, setLoungeService] = useState<boolean>(true);
  const [cateringTier, setCateringTier] = useState<'standard' | 'premium' | 'caviar'>('premium');
  const [heliTransfer, setHeliTransfer] = useState<boolean>(false);
  
  // High-conversion form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Interactive Custom chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    { sender: 'bot', text: "Welcome to Jetbay Private Jet Concierge! How can I assist with your charter flight today?", time: "Just now" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [botIsTyping, setBotIsTyping] = useState<boolean>(false);

  const activeRoute = ROUTE_OPTIONS[selectedRouteIndex];
  const currencyInfo = CURRENCY_CONVERSIONS[selectedCurrency];
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(activeRoute.basePriceUSD * currencyInfo.rate);

  // Dynamic Quote Estimation logic
  const calculateDynamicQuote = () => {
    let baseRatePerKm = 15.5; // USD
    if (calcPassengers > 8) baseRatePerKm = 24.0;
    else if (calcPassengers > 4) baseRatePerKm = 19.5;
    
    let baseFlightPrice = calcDistance * baseRatePerKm;
    let passengerFee = calcPassengers * 350;
    
    let addonPrice = 0;
    if (loungeService) addonPrice += 1200;
    if (heliTransfer) addonPrice += 2800;
    
    if (cateringTier === 'premium') addonPrice += calcPassengers * 180;
    else if (cateringTier === 'caviar') addonPrice += calcPassengers * 450;
    
    const totalUSD = baseFlightPrice + passengerFee + addonPrice;
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(totalUSD * currencyInfo.rate);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://jetbay.com/download');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
      setPhoneNumber('');
    }, 4000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    const newMsgs = [...chatMessages, { sender: 'user' as const, text: userMsg, time: "Just now" }];
    setChatMessages(newMsgs);
    setChatInput('');
    setBotIsTyping(true);

    // Simulate bot reply
    setTimeout(() => {
      let reply = "I've passed your interest in custom charters to our global operations team. A representative will contact you in under 15 minutes.";
      if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost')) {
        reply = `Prices start from approximately ${currencyInfo.symbol}${formattedPrice} for the ${activeRoute.jetModel} on the ${activeRoute.from} to ${activeRoute.to} route. Would you like a precise quote?`;
      } else if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('hi')) {
        reply = "Hello there! How can I configure your custom flight options?";
      }
      setChatMessages(prev => [...prev, { sender: 'bot' as const, text: reply, time: "Just now" }]);
      setBotIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFDFE] dark:bg-[#0B1121] transition-colors text-slate-800 dark:text-slate-100 font-sans">
      <Topbar />
      
      <div className="flex flex-1 max-w-full">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          
          {/* ================= SECTION 1: HERO BANNER ================= */}
          <section className="relative px-6 py-20 md:py-24 lg:py-28 bg-gradient-to-b from-[#F3F8FC] via-[#EAF3FA] to-white dark:from-[#0E172B] dark:via-[#0F1C3A] dark:to-[#0B1121] overflow-hidden border-b border-gray-100 dark:border-gray-800/50">
            {/* Soft Ambient Radial Lights */}
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[90%] rounded-full bg-blue-400/10 dark:bg-blue-900/15 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full bg-[#40DACD]/10 dark:bg-teal-950/15 blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              {/* Left Column: Premium Title, Info & SMS Link Sender */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-6 flex flex-col justify-center"
              >
                <div className="inline-flex items-center gap-2 bg-[#E0F2FE] dark:bg-[#1E293B] text-[#0369A1] dark:text-[#38BDF8] px-3.5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-6 w-max shadow-sm border border-blue-100/30">
                  <Sparkles size={13} className="text-[#0284C7] dark:text-[#38BDF8] animate-spin-slow" /> Jetbay Flight Suite 2.0
                </div>
                
                <h1 className="text-[40px] md:text-[50px] lg:text-[58px] font-extrabold text-[#0B1F3A] dark:text-white leading-[1.05] tracking-tight mb-6">
                  Jetbay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-[#40DACD] dark:from-blue-400 dark:via-[#38BDF8] dark:to-[#40DACD]">Private Jet App</span>
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-[16px] md:text-[18px] leading-relaxed mb-8 max-w-lg font-medium">
                  Experience seamless bespoke private aviation instantly. Browse live market prices, customize routes, and coordinate aircraft with one simple tap on your phone.
                </p>

                {/* HIGH CONVERSION: SMS link tool & App Store Button */}
                <div className="bg-white/80 dark:bg-[#152033]/90 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 w-full max-w-lg shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)] space-y-4">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Get the instant app download link</span>
                  
                  <form onSubmit={handleSendSMS} className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                      <input 
                        type="tel" 
                        placeholder="Enter phone number..." 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[14px] bg-gray-50 dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 dark:text-white"
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="bg-[#0B1F3A] dark:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-[13px] hover:bg-black dark:hover:bg-blue-500 transition-all flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
                    >
                      <Send size={14} /> Send Link
                    </motion.button>
                  </form>

                  {smsSent && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1.5 bg-green-500/10 dark:bg-green-500/5 p-2 rounded-lg"
                    >
                      <Check size={14} strokeWidth={3} /> A download link has been simulated to your device.
                    </motion.div>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <hr className="flex-1 border-gray-100 dark:border-gray-800/80" />
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Or Scan QR Code</span>
                    <hr className="flex-1 border-gray-100 dark:border-gray-800/80" />
                  </div>

                  <div className="flex items-center gap-5 pt-1">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center shadow-sm">
                      {/* Styled barcode SVG representing premium digital ticket system instead of standard LCP-blocking image */}
                      <svg className="w-16 h-16 text-slate-900" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="none" />
                        {/* Simulated premium digital code pattern */}
                        <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                        <rect x="30" y="10" width="20" height="10" fill="currentColor" />
                        <rect x="60" y="10" width="10" height="10" fill="currentColor" />
                        <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                        <rect x="10" y="30" width="10" height="20" fill="currentColor" />
                        <rect x="40" y="30" width="20" height="10" fill="currentColor" />
                        <rect x="70" y="30" width="20" height="20" fill="currentColor" />
                        <rect x="20" y="60" width="30" height="10" fill="currentColor" />
                        <rect x="60" y="60" width="10" height="10" fill="currentColor" />
                        <rect x="80" y="60" width="10" height="30" fill="currentColor" />
                        <rect x="10" y="80" width="20" height="10" fill="currentColor" />
                        <rect x="40" y="80" width="30" height="10" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">
                        Instant App Store Access
                      </p>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 block leading-tight">
                        Compatible with iOS 15.0+ and Android Oreo+
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>

              {/* Right Column: Hero Visual Image with premium hover cards */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-6 relative flex justify-center"
              >
                <div className="relative w-full max-w-[440px] lg:max-w-[480px]">
                  
                  {/* Main premium phone-holding image */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(3,105,161,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white dark:border-gray-800 bg-white dark:bg-[#1E293B]"
                  >
                    <Image 
                      src={heroHandImage} 
                      alt="Jetbay App on Mobile" 
                      className="w-full object-cover aspect-[4/3] transform transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  </motion.div>

                  {/* Floating Tooltip 1: 10,000+ Global Aircraft */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[8%] left-[-10%] bg-white dark:bg-[#152033] rounded-2xl py-3.5 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800/80 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                      <Compass size={18} className="animate-spin-slow" />
                    </div>
                    <div>
                      <div className="text-[13px] font-extrabold text-[#0B1F3A] dark:text-white">10,000+</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Verified Aircraft</div>
                    </div>
                  </motion.div>

                  {/* Floating Tooltip 2: Charter App */}
                  <div className="absolute bottom-[28%] right-[-5%] bg-[#0B1F3A] dark:bg-blue-600 rounded-2xl py-2 px-3.5 shadow-xl border border-blue-900/20 dark:border-blue-500/30 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase">Charter App Live</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#40DACD] animate-pulse" />
                  </div>

                  {/* Chatbot Bubble Tooltip */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="absolute bottom-[-15px] left-[5%] right-[5%] bg-amber-400 dark:bg-amber-500 rounded-2xl py-3.5 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-amber-300 dark:border-amber-400 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                      <MessageSquare size={15} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-extrabold text-black/50 uppercase tracking-widest">Jetbay Concierge Bot</div>
                      <p className="text-[13px] font-bold text-gray-950 leading-snug">
                        Book flights with our custom AI bot! Chat with an operator.
                      </p>
                    </div>
                  </motion.div>

                </div>
              </motion.div>

            </div>
          </section>


          {/* ================= SECTION 2: INTRODUCING THE JETBAY APP (WITH DYNAMIC GRAPHICS) ================= */}
          <section className="px-6 py-24 bg-white dark:bg-[#0B1121] border-b border-gray-100 dark:border-gray-800/30">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Left Side: Premium Interactive Mockup Dashboard */}
              <div className="md:col-span-5 flex justify-center">
                <div className="w-full max-w-[340px] bg-gradient-to-b from-gray-50 to-white dark:from-[#0F162A] dark:to-[#0B1121] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800/80 shadow-md relative">
                  
                  {/* Decorative Dial */}
                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800/40 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-sm" />
                      <div className="w-14 h-2 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-md">
                      AI MATCH ENGINE
                    </div>
                  </div>

                  {/* Flight Icon with customized dotted arc */}
                  <div className="relative h-36 bg-gray-900 rounded-2xl border border-gray-800 p-4 mb-4 flex items-center justify-center overflow-hidden">
                    {/* Dark grid background */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <path d="M 10 40 Q 50 12, 90 40" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
                      <g transform="translate(46, 17) rotate(15)">
                        <path d="M0 -3 L12 0 L0 3 L2 0 Z" fill="#40DACD" />
                      </g>
                    </svg>
                    
                    <div className="absolute bottom-2 left-4 text-[9px] font-extrabold text-gray-500 uppercase">PVG / SHA</div>
                    <div className="absolute bottom-2 right-4 text-[9px] font-extrabold text-gray-500 uppercase">PEK / BJS</div>
                    
                    {/* Pulsing beacon */}
                    <div className="absolute top-[32%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </div>
                  </div>

                  {/* Dynamic Graphic Columns */}
                  <div className="grid grid-cols-5 gap-2.5 items-end h-20 px-1 mb-4 border-b border-gray-100 dark:border-gray-800/50 pb-4">
                    <div className="bg-blue-200 dark:bg-blue-900/30 h-[30%] rounded-md transition-all duration-500" />
                    <div className="bg-blue-400 dark:bg-blue-800/40 h-[55%] rounded-md transition-all duration-500" />
                    <div className="bg-[#40DACD] h-[95%] rounded-md shadow-[0_0_12px_rgba(64,218,205,0.4)]" />
                    <div className="bg-blue-300 dark:bg-blue-900/20 h-[45%] rounded-md transition-all duration-500" />
                    <div className="bg-blue-600 dark:bg-blue-600/60 h-[75%] rounded-md transition-all duration-500" />
                  </div>

                  {/* Bottom Tooltip with Real-time GPS Tag */}
                  <div className="bg-white dark:bg-[#152033] rounded-2xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <MapPin size={16} />
                    </div>
                    <div className="text-left">
                      <span className="text-[12px] font-bold text-gray-900 dark:text-white block">Real-time GPS Tracking</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">Live Aircraft Sync</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Side: Editorial Style Copy */}
              <div className="md:col-span-7 space-y-6">
                <div className="h-1 w-12 bg-blue-600 rounded-full" />
                <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B1F3A] dark:text-white tracking-tight leading-snug">
                  Introducing <span className="text-gray-400 dark:text-gray-500 font-medium">The Jetbay App</span>
                </h2>
                
                <p className="text-slate-600 dark:text-gray-300 text-[16px] md:text-[17px] leading-relaxed max-w-xl font-medium">
                  Jetbay translates custom private aviation management to a powerful mobile experience. Tap into a curated grid of over 10,000 jets with AI-powered aircraft match pairing and automated ground support workflows.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 dark:bg-[#152033] border border-slate-100 dark:border-gray-800 text-[12.5px] font-bold text-[#0B1F3A] dark:text-gray-200">
                    <Smartphone size={14} className="text-blue-500" /> Private Jet App
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 dark:bg-[#152033] border border-slate-100 dark:border-gray-800 text-[12.5px] font-bold text-[#0B1F3A] dark:text-gray-200">
                    <Clock size={14} className="text-[#40DACD]" /> 24/7 Global Support
                  </div>

                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 dark:bg-[#152033] border border-slate-100 dark:border-gray-800 text-[12.5px] font-bold text-[#0B1F3A] dark:text-gray-200">
                    <Globe size={14} className="text-amber-500" /> Multi-Currency Booking
                  </div>
                </div>
              </div>

            </div>
          </section>


          {/* ================= NEW UX INTERACTIVE COMPONENT: FLIGHT COST ESTIMATOR ================= */}
          <section className="px-6 py-20 bg-gradient-to-b from-white to-[#F8FAFC] dark:from-[#0B1121] dark:to-[#090E1A] border-b border-gray-100 dark:border-gray-800/30">
            <div className="max-w-5xl mx-auto">
              
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3.5 py-1 rounded-full text-[11.5px] font-extrabold uppercase tracking-widest border border-blue-100/30">
                  <SlidersHorizontal size={12} /> Interactive Travel Planner
                </div>
                <h2 className="text-[32px] md:text-[40px] font-black text-[#0B1F3A] dark:text-white tracking-tight leading-none">
                  Instant Flight Quote Estimator
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-[15px] font-medium">
                  Adjust distance, passengers, and bespoke options to calculate real-time charter estimates.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Parameters Slider Panel */}
                <div className="lg:col-span-7 bg-white dark:bg-[#121B2E] p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] space-y-6">
                  
                  {/* Distance Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Estimated Flight Distance</span>
                      <span className="text-sm font-extrabold text-blue-500">{calcDistance.toLocaleString()} km</span>
                    </div>
                    <input 
                      type="range" 
                      min="300" 
                      max="10000" 
                      step="100"
                      value={calcDistance} 
                      onChange={(e) => setCalcDistance(Number(e.target.value))}
                      className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>300 km (Short Haul)</span>
                      <span>5,000 km</span>
                      <span>10,000 km (Transcontinental)</span>
                    </div>
                  </div>

                  {/* Passengers Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Passenger Count</span>
                      <span className="text-sm font-extrabold text-blue-500">{calcPassengers} Guests</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="16" 
                      value={calcPassengers} 
                      onChange={(e) => setCalcPassengers(Number(e.target.value))}
                      className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>1 Guest</span>
                      <span>8 Guests (Mid-size)</span>
                      <span>16 Guests (Heavy Jet)</span>
                    </div>
                  </div>

                  {/* Custom Catering options */}
                  <div className="space-y-3 pt-2">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Premium Catering Tier</span>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'standard', name: 'Executive Refreshments', desc: 'Complimentary' },
                        { id: 'premium', name: 'Fine Dining Hot Meals', desc: `+${currencyInfo.symbol}${Math.round(180 * currencyInfo.rate)} / guest` },
                        { id: 'caviar', name: 'Caviar & Dom Pérignon', desc: `+${currencyInfo.symbol}${Math.round(450 * currencyInfo.rate)} / guest` }
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => setCateringTier(tier.id as any)}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${cateringTier === tier.id ? 'bg-[#0B1F3A]/5 dark:bg-blue-950/20 border-blue-400 dark:border-blue-400/60 shadow-sm' : 'bg-transparent border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                        >
                          <span className={`text-[12.5px] font-bold leading-tight ${cateringTier === tier.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {tier.name}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">{tier.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Bespoke Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => setLoungeService(!loungeService)}
                      className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${loungeService ? 'bg-blue-500/5 border-blue-400 dark:border-blue-400/50' : 'bg-transparent border-slate-100 dark:border-slate-800/80'}`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${loungeService ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                        {loungeService && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <span className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 block leading-tight">Private VIP Lounge</span>
                        <span className="text-[10.5px] text-gray-400 font-semibold uppercase">+{currencyInfo.symbol}{Math.round(1200 * currencyInfo.rate)} Flat fee</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setHeliTransfer(!heliTransfer)}
                      className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${heliTransfer ? 'bg-blue-500/5 border-blue-400 dark:border-blue-400/50' : 'bg-transparent border-slate-100 dark:border-slate-800/80'}`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${heliTransfer ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                        {heliTransfer && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <span className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 block leading-tight">Helicopter Airfield Transfer</span>
                        <span className="text-[10.5px] text-gray-400 font-semibold uppercase">+{currencyInfo.symbol}{Math.round(2800 * currencyInfo.rate)} Flat fee</span>
                      </div>
                    </button>
                  </div>

                </div>

                {/* Right Side: Estimated Receipt Ticket display */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Digital Premium Boarding Pass representation */}
                  <motion.div 
                    layout
                    className="bg-[#0B1F3A] dark:bg-[#121B2E] text-white rounded-3xl overflow-hidden shadow-xl border border-blue-900/40 relative"
                  >
                    {/* Glowing Accent Arc */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Flight Ticket Header */}
                    <div className="p-6 border-b border-dashed border-blue-900 dark:border-slate-800 flex justify-between items-center bg-[#07162B] dark:bg-[#0E1524]">
                      <div>
                        <span className="text-[9px] text-[#40DACD] font-extrabold uppercase tracking-widest block">JETBAY PRESTIGE FLIGHT</span>
                        <h4 className="text-[14px] font-black text-white">ESTIMATED MANIFEST</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 font-bold block uppercase">Aircraft Class</span>
                        <span className="text-[11px] font-extrabold bg-blue-900/60 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-800">
                          {calcPassengers > 8 ? 'HEAVY JET' : calcPassengers > 4 ? 'MID-SIZE' : 'LIGHT JET'}
                        </span>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="p-6 space-y-4">
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">ROUTE SEGMENT</span>
                          <span className="text-[15px] font-bold text-white">Custom Flight Profile</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">AIR distance</span>
                          <span className="text-[15px] font-extrabold text-[#40DACD]">{calcDistance} km</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">GUESTS MANIFEST</span>
                          <span className="text-[14px] font-semibold text-white">{calcPassengers} Passengers</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">CATERING SELECTION</span>
                          <span className="text-[14px] font-semibold text-white capitalize">{cateringTier}</span>
                        </div>
                      </div>

                      {/* Line Separator with punchouts representing real airport ticket */}
                      <div className="relative my-4 flex items-center">
                        <div className="absolute left-[-24px] w-6 h-6 rounded-full bg-gradient-to-b from-white to-[#F8FAFC] dark:from-[#0B1121] dark:to-[#090E1A] border-r border-slate-100 dark:border-slate-800" />
                        <hr className="w-full border-dashed border-blue-900/60 dark:border-slate-800" />
                        <div className="absolute right-[-24px] w-6 h-6 rounded-full bg-gradient-to-b from-white to-[#F8FAFC] dark:from-[#0B1121] dark:to-[#090E1A] border-l border-slate-100 dark:border-slate-800" />
                      </div>

                      {/* Real-time Dynamic Pricing */}
                      <div className="flex justify-between items-end pt-2">
                        <div>
                          <span className="text-[10px] text-[#40DACD] font-extrabold uppercase tracking-widest block">GUARANTEED ESTIMATE</span>
                          <span className="text-[11px] text-gray-400 font-bold block">Including VAT and airport taxes</span>
                        </div>
                        <div className="text-right">
                          <motion.span 
                            key={calculateDynamicQuote()}
                            initial={{ scale: 1.1, color: '#40DACD' }}
                            animate={{ scale: 1, color: '#FFFFFF' }}
                            transition={{ duration: 0.3 }}
                            className="text-[28px] font-black text-white block leading-none"
                          >
                            {currencyInfo.symbol}{calculateDynamicQuote()}
                          </motion.span>
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{selectedCurrency} Currency</span>
                        </div>
                      </div>

                    </div>

                    {/* Flight Action Button */}
                    <div className="p-6 bg-[#07162B] dark:bg-[#0E1524] border-t border-blue-950 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck size={14} />
                        <span className="text-[10.5px] font-extrabold uppercase tracking-widest">ARGUS audited</span>
                      </div>
                      
                      <button className="bg-gradient-to-r from-blue-500 to-[#40DACD] hover:from-blue-600 hover:to-[#3ec0b5] text-[#07162B] font-black uppercase text-[11px] tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer">
                        Instant Charter <ChevronRight size={13} strokeWidth={3} />
                      </button>
                    </div>

                  </motion.div>

                  {/* Info notice */}
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-3 items-start">
                    <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                      This quote calculates live marketplace indexes based on present fleet locations. Lock in the rate by starting a direct charter request inside the app chat.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </section>


          {/* ================= SECTION 3: SIMULATE PRIVATE JET BOOKING WITH FULLY INTERACTIVE APP SIMULATOR ================= */}
          <section className="px-6 py-20 bg-gray-50 dark:bg-[#090E1A] border-b border-gray-100 dark:border-gray-800/30">
            <div className="max-w-5xl mx-auto bg-white dark:bg-[#0F162A] p-8 md:p-14 rounded-[40px] border border-slate-100 dark:border-slate-800/80 shadow-md">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Interactive Simulated App Inside Phone Frame */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  
                  <div className="text-center mb-4">
                    <span className="text-[11px] font-extrabold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-100/30">
                      Interactive Live Demo
                    </span>
                    <p className="text-[12px] text-gray-400 font-bold mt-1.5">Click phone tabs or routes below to test</p>
                  </div>

                  <div className="relative w-full max-w-[290px] aspect-[9/18.5] rounded-[42px] border-[8px] border-slate-900 bg-white dark:bg-[#0B1121] shadow-2xl overflow-hidden flex flex-col ring-4 ring-white/40">
                    
                    {/* Speaker and Camera notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5.5 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
                      <div className="w-14 h-1 bg-slate-800 rounded-full" />
                    </div>

                    {/* App Header inside Mockup */}
                    <div className="pt-8 pb-3 px-4 bg-gradient-to-r from-[#0B1F3A] to-blue-900 dark:from-[#0B1121] dark:to-[#152033] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between z-20">
                      <span className="text-[12px] font-black text-white">JETBAY</span>
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#40DACD] animate-ping" />
                        <span className="text-[9px] text-[#40DACD] font-extrabold uppercase tracking-widest">Active</span>
                      </div>
                    </div>

                    {/* INTERACTIVE APPSIMULATOR VIEWS */}
                    <div className="flex-1 p-3 overflow-y-auto bg-slate-50 dark:bg-[#0B1121] relative min-h-[260px]">
                      
                      <AnimatePresence mode="wait">
                        {phoneTab === 'search' && (
                          <motion.div 
                            key="search"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-3"
                          >
                            {/* Route selector display */}
                            <div className="bg-white dark:bg-[#152033] rounded-xl p-3 border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-2">
                              <span className="text-[8px] font-extrabold text-blue-500 uppercase tracking-widest block">Selected Charter Route</span>
                              
                              <div className="flex justify-between items-center bg-gray-50 dark:bg-[#0B1121] p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div>
                                  <span className="text-[9px] text-gray-400 font-bold block uppercase">FROM</span>
                                  <span className="text-[12px] font-extrabold text-gray-900 dark:text-white leading-tight">
                                    {activeRoute.from.split(' ')[0]}
                                  </span>
                                </div>
                                <ArrowRight size={12} className="text-blue-500" />
                                <div>
                                  <span className="text-[9px] text-gray-400 font-bold block uppercase">TO</span>
                                  <span className="text-[12px] font-extrabold text-gray-900 dark:text-white leading-tight text-right block">
                                    {activeRoute.to.split(' ')[0]}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Jet Class Feature Card */}
                            <div className="bg-white dark:bg-[#152033] rounded-xl p-3 border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-2.5">
                              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800/50 pb-2">
                                <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase">
                                  {activeRoute.jetModel}
                                </span>
                                <span className="text-[8px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded uppercase">
                                  {activeRoute.jetClass}
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-1 text-center">
                                <div className="bg-slate-50 dark:bg-[#0B1121] p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="text-[8px] text-gray-400 block uppercase font-semibold">Duration</span>
                                  <span className="text-[10px] font-bold text-slate-800 dark:text-white">{activeRoute.duration}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-[#0B1121] p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="text-[8px] text-gray-400 block uppercase font-semibold">Distance</span>
                                  <span className="text-[10px] font-bold text-slate-800 dark:text-white">{activeRoute.distance}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-[#0B1121] p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="text-[8px] text-gray-400 block uppercase font-semibold">Capacity</span>
                                  <span className="text-[10px] font-bold text-slate-800 dark:text-white">{activeRoute.seats} Seats</span>
                                </div>
                              </div>
                            </div>

                            {/* Animated Price Match Section */}
                            <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center shadow-inner">
                              <div>
                                <span className="text-[8px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">AI Guarantee Rate</span>
                                <span className="text-[15px] font-black text-slate-900 dark:text-white">
                                  {currencyInfo.symbol}{formattedPrice} <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">{selectedCurrency}</span>
                                </span>
                              </div>
                              <button className="bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-[10px] font-black uppercase hover:bg-emerald-500 cursor-pointer">
                                Book
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {phoneTab === 'trips' && (
                          <motion.div 
                            key="trips"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-3"
                          >
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pl-1 block">My Active Charters</span>
                            
                            <div className="bg-white dark:bg-[#152033] rounded-xl p-3.5 border border-gray-100 dark:border-gray-800/80 shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 dark:bg-blue-500/5 rounded-bl-[100px] flex items-center justify-end p-2 text-blue-500">
                                <Plane size={12} />
                              </div>

                              <span className="text-[8px] font-extrabold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded w-max block mb-2">
                                Flight Confirmed
                              </span>
                              <div className="text-[13px] font-bold text-gray-950 dark:text-white">SHANGHAI ➔ TOKYO</div>
                              <span className="text-[10px] text-gray-400 font-medium block mt-1">Scheduled for August 15, 2026</span>
                              
                              <div className="mt-4 border-t border-gray-50 dark:border-gray-800 pt-3 flex items-center justify-between text-[10px] text-gray-400">
                                <span>AIRCRAFT: Gulfstream G650</span>
                                <span className="font-bold text-emerald-500">PAID</span>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-[#152033] rounded-xl p-3 border border-gray-100 dark:border-gray-800/80 shadow-sm flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-[#0B1121] flex items-center justify-center text-slate-500">
                                <Clock size={14} />
                              </div>
                              <div className="text-left">
                                <span className="text-[11px] font-bold text-gray-900 dark:text-white block">Past Flights</span>
                                <span className="text-[9px] text-gray-400 font-semibold uppercase">3 Flights archived</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {phoneTab === 'chat' && (
                          <motion.div 
                            key="chat"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col h-[230px] bg-white dark:bg-[#152033] rounded-xl p-2.5 border border-gray-100 dark:border-gray-800/60 shadow-inner overflow-hidden"
                          >
                            <div className="flex-1 overflow-y-auto space-y-2 pb-2 scrollbar-none">
                              {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                  <div className={`text-[10px] max-w-[85%] rounded-xl px-2.5 py-1.5 font-medium leading-tight ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                                    {msg.text}
                                  </div>
                                  <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">{msg.time}</span>
                                </div>
                              ))}
                              
                              {botIsTyping && (
                                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 w-max rounded-bl-none animate-pulse">
                                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              )}
                            </div>
                            <form onSubmit={handleSendChatMessage} className="flex gap-1 border-t border-gray-50 dark:border-gray-800 pt-1.5 mt-auto">
                              <input 
                                type="text" 
                                placeholder="Message bot..." 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 bg-gray-50 dark:bg-[#0B1121] border border-gray-100 dark:border-gray-800 text-[10px] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-white"
                              />
                              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-lg cursor-pointer">
                                <Send size={10} />
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>

                    {/* App Bottom Navigation inside Mockup */}
                    <div className="py-3 px-4 bg-white dark:bg-[#152033] border-t border-gray-100 dark:border-gray-800/60 flex justify-around items-center text-[10px] font-bold z-20 shadow-lg">
                      <button 
                        onClick={() => setPhoneTab('search')}
                        className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${phoneTab === 'search' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                      >
                        <Compass size={14} />
                        <span>Search</span>
                      </button>
                      
                      <button 
                        onClick={() => setPhoneTab('trips')}
                        className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${phoneTab === 'trips' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                      >
                        <Briefcase size={14} />
                        <span>Trips</span>
                      </button>

                      <button 
                        onClick={() => setPhoneTab('chat')}
                        className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${phoneTab === 'chat' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                      >
                        <MessageSquare size={14} />
                        <span>Chat</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* Right Column: Premium Selector Panel */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-[30px] md:text-[36px] font-bold text-[#0B1F3A] dark:text-white tracking-tight leading-snug">
                      Simplify Private Jet Booking
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-[16px] leading-relaxed font-medium">
                      Control flight configurations, coordinates, and market estimates dynamically. Click on any route profile below to see the simulated App Mockup calculate rates immediately.
                    </p>
                  </div>

                  {/* ROUTE TOGGLE PANELS */}
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1 block">SELECT TEST FLIGHT PATH</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ROUTE_OPTIONS.map((route, idx) => (
                        <motion.button
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          key={idx}
                          onClick={() => {
                            setSelectedRouteIndex(idx);
                            setPhoneTab('search');
                          }}
                          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${selectedRouteIndex === idx ? 'bg-gradient-to-r from-[#F0F7FF] to-white dark:from-blue-950/20 dark:to-[#152033] border-blue-200 dark:border-blue-800 shadow-sm' : 'bg-white dark:bg-[#152033]/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-[#152033] hover:border-gray-200 dark:hover:border-gray-800'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-bold text-gray-900 dark:text-white uppercase">
                              {route.from.split(' ')[0]} ➔ {route.to.split(' ')[0]}
                            </span>
                            <span className="text-[9px] font-extrabold text-blue-500 uppercase tracking-wider">
                              {route.jetClass}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">{route.jetModel} · {route.seats} Seats</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* CURRENCY PANEL FOR CALCULATIONS */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1 block">Toggle Currency conversion</span>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(CURRENCY_CONVERSIONS) as CurrencyType[]).map((cur) => (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          key={cur}
                          onClick={() => setSelectedCurrency(cur)}
                          className={`px-4 py-2.5 rounded-xl text-[12.5px] font-extrabold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${selectedCurrency === cur ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white border-[#0B1F3A] dark:border-blue-600' : 'bg-white dark:bg-[#152033] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        >
                          <Coins size={14} className="opacity-80" />
                          <span>{cur} ({CURRENCY_CONVERSIONS[cur].symbol})</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>


          {/* ================= SECTION 4: CALL TO ACTION COMPARING BENEFIT LISTS ================= */}
          <section className="px-6 py-20 bg-white dark:bg-[#0B1121] text-center max-w-5xl mx-auto border-b border-gray-100 dark:border-gray-800/30">
            <h2 className="text-[26px] md:text-[32px] font-black text-[#0B1F3A] dark:text-white tracking-tight leading-snug mb-8 max-w-2xl mx-auto">
              Compare prices and configure your custom private flight with just one tap.
            </h2>
            
            {/* Visual Selector Switches */}
            <div className="flex justify-center gap-3 mb-12">
              <button 
                onClick={() => setActiveFeatureTab('seamless')}
                className={`px-6 py-3 rounded-full text-[13.5px] font-bold border transition-all flex items-center gap-2 cursor-pointer ${activeFeatureTab === 'seamless' ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white border-[#0B1F3A] dark:border-blue-600 shadow-md' : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#152033]'}`}
              >
                <Sliders size={15} /> Seamless Controls
              </button>
              
              <button 
                onClick={() => setActiveFeatureTab('convenient')}
                className={`px-6 py-3 rounded-full text-[13.5px] font-bold border transition-all flex items-center gap-2 cursor-pointer ${activeFeatureTab === 'convenient' ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white border-[#0B1F3A] dark:border-blue-600 shadow-md' : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#152033]'}`}
              >
                <Layers size={15} /> Convenient Perks
              </button>
            </div>

            {/* List of custom luxury benefits depending on tab */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeFeatureTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto"
              >
                {activeFeatureTab === 'seamless' ? (
                  <>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#152033]/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 mb-4 shadow-inner">
                        <Sparkles size={18} />
                      </div>
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">Instant Pricing Matching</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">Get dynamic quotes instantly across our premium network of over 10,000 corporate aviation options.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#152033]/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-[#40DACD] mb-4 shadow-inner">
                        <ShieldCheck size={18} />
                      </div>
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">Verified Air Operators</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">We pair you exclusively with ARGUS Platinum and Wyvern Wingman audited air operators.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#152033]/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                        <Compass size={18} />
                      </div>
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">AI Flight Matching</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">Automatic empty-leg alignment to discover best value custom rates on return routes.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#152033]/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 mb-4 shadow-inner">
                        <MessageSquare size={18} />
                      </div>
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">24/7 Priority Support</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">Direct line of contact with a dedicated Jetbay expert ready to manage your charter schedule.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#152033]/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-[#40DACD] mb-4 shadow-inner">
                        <Globe size={18} />
                      </div>
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">Bespoke Ground Transfer</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">Integrated executive ground transport coordination to make airfield transitions completely effortless.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#152033]/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                        <Plane size={18} />
                      </div>
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">Flexible Rescheduling</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">We understand that timelines change. Easily reschedule or adapt active charters through the mobile app.</p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </section>


          {/* ================= SECTION 5: DOWNLOAD APP & MANAGE TRIPS (PREMIUM CARD) ================= */}
          <section className="px-6 py-12 bg-white dark:bg-[#0B1121] border-b border-gray-100 dark:border-gray-800/30">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0B1F3A] via-[#102D54] to-slate-900 dark:from-[#0E1B35] dark:via-[#14264A] dark:to-[#0B1121] p-8 md:p-14 rounded-[36px] border border-blue-950/20 dark:border-gray-800 shadow-xl text-center relative overflow-hidden">
              {/* Decorative light reflection */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                <span className="text-xs font-extrabold text-[#40DACD] uppercase tracking-widest">JETBAY ON-THE-GO</span>
                
                <h3 className="text-[28px] md:text-[34px] font-black text-white tracking-tight">
                  Download the App & Manage Trips on the Go
                </h3>
                
                <p className="text-gray-300 text-[15px] md:text-[16px] leading-relaxed font-medium">
                  Instantly synchronize over 10,000 corporate jets, organize personalized flight tracks, and secure live empty leg deals—all from your mobile interface.
                </p>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/15 border border-white/20 font-bold px-6 py-3.5 rounded-xl transition-all text-[13.5px] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-[#40DACD]" /> Link Copied!
                      </>
                    ) : (
                      <>
                        <Compass size={16} className="text-[#40DACD]" /> Share App Link
                      </>
                    )}
                  </motion.button>

                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://apps.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto bg-[#40DACD] text-[#0B1F3A] hover:opacity-90 font-black px-6 py-3.5 rounded-xl transition-all text-[13.5px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>Download App Store</span>
                    <ArrowUpRight size={16} />
                  </motion.a>
                </div>

              </div>
            </div>
          </section>


          {/* ================= SECTION 6: BOT MASCOT CARD ================= */}
          <section className="px-6 py-20 bg-white dark:bg-[#0B1121] mb-20">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center bg-[#F8FAFC] dark:bg-[#0F162A] p-8 md:p-14 rounded-[36px] border border-slate-100 dark:border-slate-800/80 shadow-sm">
              
              {/* Left side: Dialogue bubble */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-5">
                <span className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-widest pl-1">REAL-TIME CONCIERGE</span>
                
                <div className="bg-white dark:bg-[#152033] rounded-[24px] rounded-tl-none p-6 shadow-md border border-gray-100 dark:border-gray-800/60 relative max-w-lg">
                  {/* Speech bubble pointer */}
                  <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[8px] border-t-white dark:border-t-[#152033] border-l-[8px] border-l-transparent" />
                  
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#40DACD] animate-pulse" />
                    <span className="text-[11.5px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Jetbay Expert Bot</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto font-bold">Online</span>
                  </div>

                  <p className="text-slate-800 dark:text-slate-200 text-[15px] font-bold leading-relaxed italic">
                    &quot;Hi there! Let us know if you need help with custom travel plans, private lounge access or helicopter airfield transfers. Simply start typing in the live phone demo chat!&quot;
                  </p>
                </div>

                <div className="flex items-center gap-2 pl-1 text-slate-500 dark:text-slate-400">
                  <div className="w-5.5 h-5.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-wider">Prestige Ground Matching Guaranteed</span>
                </div>
              </div>

              {/* Right side: Bot holding phone image */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[290px]">
                  {/* Decorative glowing backplate */}
                  <div className="absolute inset-0 bg-[#40DACD]/10 dark:bg-cyan-500/15 rounded-[32px] blur-xl transform scale-105 pointer-events-none" />
                  
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    className="rounded-[32px] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#1E293B] relative z-10"
                  >
                    <Image 
                      src={botImage} 
                      alt="Jetbay Chatbot mascot" 
                      className="w-full object-cover aspect-square transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </div>
              </div>

            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
