import { JB } from '../config/jetbay-cdn';

export type PageSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type PageFeature = {
  icon: string;
  title: string;
  body?: string;
};

export type PageStep = {
  title: string;
  body: string;
  image?: string;
};

export type PagePromo = {
  image: string;
  title: string;
  href: string;
  cta: string;
};

export type PageContent = {
  title: string;
  description: string;
  hero: string;
  tag?: string;
  heroImage?: string;
  showQuoteWidget?: boolean;
  sections: PageSection[];
  features?: PageFeature[];
  steps?: PageStep[];
  promoBanners?: PagePromo[];
  cta?: { label: string; href: string };
};

export const PAGE_CONTENT: Record<string, PageContent> = {
  'private-jet-charter': {
    title: 'Private Jets for Every Need',
    description: 'On-demand private jet charter with 10,000+ aircraft and 24/7 concierge support.',
    hero: 'J-TA\'s private air charter service combines luxury, efficiency, and safety at the best value.',
    tag: 'Charter',
    heroImage: JB.pages.privateJetCharter.hero,
    showQuoteWidget: true,
    features: JB.pages.privateJetCharter.highlights.map((h) => ({
      icon: h.icon,
      title: h.title,
      body: 'Trusted global network with premium service standards.',
    })),
    promoBanners: [
      { image: JB.pages.privateJetCharter.jetCardPromo, title: 'J-TA Jet Card', href: '/jet-card', cta: 'Explore Jet Card' },
      { image: JB.pages.privateJetCharter.creditPromo, title: 'Travel Credits', href: '/travel-credit', cta: 'Learn More' },
    ],
    sections: [
      {
        heading: 'Private jet services we offer',
        body: 'From single legs to complex multi-city itineraries, our team matches you with the right aircraft category and operator.',
        bullets: [
          'Light, midsize, heavy and ultra-long-range options',
          'Transparent quotes with no hidden fees',
          '24/7 concierge from request to landing',
          'Access to 1,000+ operators worldwide',
        ],
      },
      {
        heading: 'How it works',
        body: 'Search your route, review aircraft options, and receive a tailored quote within hours.',
        bullets: ['Submit your itinerary online', 'Compare aircraft categories & pricing', 'Confirm and fly'],
      },
    ],
    cta: { label: 'Search Available Aircraft', href: '/' },
  },
  'corporate-air-charter': {
    title: 'Corporate Air Charter',
    description: 'Executive private aviation for teams, roadshows, and time-critical business travel.',
    hero: 'Maximize productivity with point-to-point flights tailored to your corporate schedule.',
    tag: 'Charter',
    heroImage: JB.pages.corporate.hero,
    showQuoteWidget: true,
    sections: [
      {
        heading: 'Built for business',
        body: 'Dedicated account support, consolidated billing, and repeat-route efficiency for corporate travel managers.',
        bullets: ['Multi-leg roadshow planning', 'Company accounts & authorized users', 'Priority dispatch and support'],
      },
    ],
    cta: { label: 'Request Corporate Quote', href: '/private-jet-charter' },
  },
  'group-air-charter': {
    title: 'Group Air Charter',
    description: 'Private jets for sports teams, delegations, weddings, and large groups.',
    hero: 'Move your group together with coordinated departures and flexible cabin configurations.',
    tag: 'Charter',
    heroImage: JB.pages.privateJetCharter.hero,
    showQuoteWidget: true,
    sections: [
      {
        heading: 'Group solutions',
        body: 'We coordinate aircraft capacity, ground transport, and catering for groups of all sizes.',
        bullets: ['Sports teams & fan travel', 'Wedding & celebration groups', 'Government & NGO delegations'],
      },
    ],
    cta: { label: 'Plan Group Charter', href: '/private-jet-charter' },
  },
  'event-air-charter': {
    title: 'Event Air Charter',
    description: 'VIP air transport for concerts, festivals, sporting events, and exclusive gatherings.',
    hero: 'Arrive on time and in style — we handle logistics so you can focus on the event.',
    tag: 'Charter',
    heroImage: JB.pages.privateJetCharter.banner,
    showQuoteWidget: true,
    sections: [
      {
        heading: 'Event expertise',
        body: 'From red-carpet arrivals to multi-aircraft coordination, J-TA supports high-profile event travel.',
        bullets: ['Artist & talent transport', 'Corporate hospitality flights', 'Last-minute schedule changes'],
      },
    ],
    cta: { label: 'Charter for Your Event', href: '/private-jet-charter' },
  },
  'pet-travel': {
    title: 'Pet Travel',
    description: 'Safe, comfortable private jet travel for you and your pets.',
    hero: 'Your companions fly in the cabin with you — no cargo hold, no stress.',
    tag: 'Charter',
    heroImage: JB.pages.privateJetCharter.service1,
    showQuoteWidget: true,
    sections: [
      {
        heading: 'Pet-friendly charter',
        body: 'We match you with pet-approved operators and advise on documentation for international routes.',
        bullets: ['In-cabin travel for cats & dogs', 'Custom catering & bedding', 'Cross-border paperwork guidance'],
      },
    ],
    cta: { label: 'Book Pet-Friendly Flight', href: '/private-jet-charter' },
  },
  'about-us': {
    title: 'About J-TA',
    description: 'A leading global private jet charter platform connecting clients to 10,000+ aircraft.',
    hero: 'Seamless, trusted access to private aviation worldwide.',
    tag: 'Company',
    heroImage: JB.pages.about.hero,
    sections: [
      {
        heading: 'Our mission',
        body: 'J-TA democratizes access to private aviation through technology, transparency, and world-class service.',
        bullets: ['10,000+ aircraft network', '190+ countries served', 'WYVERN & industry-certified partners'],
      },
      {
        heading: 'What we believe',
        body: 'Every journey should be safe, discreet, and tailored. We never compromise on operator vetting or client care.',
      },
    ],
    cta: { label: 'Start Your Journey', href: '/private-jet-charter' },
  },
  'global-partnership-program': {
    title: 'Global Partner Program',
    description: "Join J-TA's referral network — no aviation experience required.",
    hero: 'Refer clients, earn commissions, and leverage our global fleet and support infrastructure.',
    tag: 'Partner',
    heroImage: JB.pages.partner.service,
    sections: [
      {
        heading: 'Partner benefits',
        body: 'Choose a partnership tier that fits your business — from referral fees to white-label solutions.',
        bullets: ['Dedicated partner portal', 'Marketing assets & training', 'Global fleet access', '24/7 operations support'],
      },
    ],
    cta: { label: 'Become a Partner', href: '/register' },
  },
  'air-ambulance': {
    title: 'J-TA SOS — Medical Air Assistance',
    description: '24/7 rapid-response medical evacuation and air ambulance services.',
    hero: 'When every minute counts, our SOS team coordinates bed-to-bed medical transfers worldwide.',
    tag: 'Emergency',
    heroImage: JB.pages.airAmbulance.hero,
    showQuoteWidget: true,
    features: JB.pages.airAmbulance.equipment.map((icon, i) => ({
      icon,
      title: ['Certified Pilots', 'Medical Doctors', 'Paramedics', 'Medical Equipment'][i] ?? 'Medical Team',
    })),
    sections: [
      {
        heading: '24/7 emergency response',
        body: 'Medical directors, flight nurses, and aviation specialists work together on every case.',
        bullets: ['ICU-equipped aircraft', 'Global hospital network', 'Insurance & case management support'],
      },
    ],
    cta: { label: 'Request J-TA SOS', href: '/private-jet-charter' },
  },
  'booking-process': {
    title: 'How Booking Works',
    description: 'Your guide to chartering a private jet with J-TA.',
    hero: 'From search to wheels-up in four simple steps.',
    tag: 'Guide',
    heroImage: JB.homeBg,
    steps: [
      { title: 'Search', body: 'Enter your route, dates, and passengers. Our system matches available aircraft categories instantly.', image: JB.pages.bookingProcess.steps[0] },
      { title: 'Quote', body: 'Receive transparent pricing from vetted operators. Our team refines options to your preferences.', image: JB.pages.bookingProcess.steps[1] },
      { title: 'Confirm', body: 'Review itinerary, sign agreement, and arrange payment. Concierge handles catering, ground transport, and permits.', image: JB.pages.bookingProcess.steps[2] },
      { title: 'Fly', body: 'Arrive at the FBO, board your aircraft, and enjoy a seamless private aviation experience.', image: JB.pages.bookingProcess.steps[3] },
    ],
    sections: [],
    cta: { label: 'Start a Search', href: '/private-jet-charter' },
  },
  'jetbay-private-jet-app': {
    title: 'J-TA Private Jet App',
    description: 'Book and manage private jet travel from your mobile device.',
    hero: 'Search routes, track quotes, and manage trips — anywhere in the world.',
    tag: 'App',
    heroImage: JB.pages.app.hero,
    sections: [
      {
        heading: 'Features',
        body: 'The J-TA app puts our full charter platform in your pocket.',
        bullets: ['Instant route search', 'Push notifications for quotes', 'Trip history & documents', '24/7 chat support'],
      },
    ],
    cta: { label: 'Download on App Store', href: '/jetbay-private-jet-app' },
  },
  'world-cup-2026-private-jet-booking': {
    title: 'World Cup 2026 Private Jet Booking',
    description: 'Fly to every FIFA World Cup 2026 match with private jet charter.',
    hero: 'Skip the crowds — direct flights to host cities across North America.',
    tag: 'Campaign',
    heroImage: JB.pages.worldCup.hero,
    showQuoteWidget: true,
    sections: [
      {
        heading: 'Match-day travel',
        body: 'Coordinated charters for groups and individuals attending World Cup fixtures.',
        bullets: ['Multi-match itineraries', 'City-to-city empty leg deals', 'VIP ground handling'],
      },
    ],
    cta: { label: 'Plan World Cup Travel', href: '/private-jet-charter' },
  },
  'world-cup-final-2026-private-jet-charter': {
    title: 'World Cup Final 2026 — Private Jet Charter',
    description: 'Arrive in style for the FIFA World Cup Final 2026.',
    hero: 'Premium private aviation for the biggest match on earth.',
    tag: 'Campaign',
    heroImage: JB.promo.worldCup.desktop,
    showQuoteWidget: true,
    sections: [
      {
        heading: 'Final match packages',
        body: 'Limited availability — secure your aircraft early for the World Cup Final.',
        bullets: ['Same-day return options', 'Helicopter transfers available', 'Dedicated concierge team'],
      },
    ],
    cta: { label: 'Request Final Match Quote', href: '/private-jet-charter' },
  },
};

export function getPageContent(key: string): PageContent | undefined {
  return PAGE_CONTENT[key];
}
