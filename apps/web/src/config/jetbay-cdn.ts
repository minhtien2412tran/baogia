/** Historical media seeds — remapped by sanitize; never emit /assets/jetbay to the DOM. */
import { sanitizePublicMediaSrc, type PlaceholderKind } from '../lib/media-policy';
import { JETVINA_MEDIA, type JetvinaMediaKind } from '../lib/jetvina-media-catalog';
import { ALLOW_JETVINA_REMOTE } from '../lib/media-env';

export const LOCAL_ASSET_ROOT = '/media-seed';
/** @deprecated Use BrandLogo /brand/jetvina — JetVina SVG removed from public brand path */
export const JTA_LOGO = '/brand/jetvina/logo-fallback.svg';
/** @deprecated Prefer BrandLogo */
export const JETBAY_LOGO = JTA_LOGO;

export function localAsset(path: string): string {
  if (path.startsWith('/placeholders/') || path.startsWith('/brand/')) return path;
  if (path.startsWith('/assets/jetvina/')) return path;
  if (path.startsWith('https://jetvina.com/') || path.startsWith('https://www.jetvina.com/')) {
    return sanitizePublicMediaSrc(path);
  }
  if (path.startsWith('/media-seed/') || path.startsWith('/assets/jetbay/')) {
    return sanitizePublicMediaSrc(path);
  }
  if (path.startsWith('/assets/')) {
    return sanitizePublicMediaSrc(path);
  }
  if (path.startsWith('http')) {
    try {
      const u = new URL(path.split('?')[0]);
      if (u.hostname === 'jetvina.com' || u.hostname === 'www.jetvina.com') {
        return sanitizePublicMediaSrc(path);
      }
      return localAsset(decodeURIComponent(u.pathname));
    } catch {
      return sanitizePublicMediaSrc(path);
    }
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const encoded = normalized
    .split('/')
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return sanitizePublicMediaSrc(`${LOCAL_ASSET_ROOT}/${encoded}`);
}

/** @deprecated Alias — width resize not used for local files */
export function cdnUrl(path: string, _width?: 750 | 1200 | 1920): string {
  void _width;
  return localAsset(path);
}

const L = localAsset;

const KIND_AS_PLACEHOLDER: Record<JetvinaMediaKind, PlaceholderKind> = {
  aircraft: 'aircraft',
  cabin: 'cabin',
  destination: 'destination',
  hero: 'hero',
  news: 'news',
  service: 'service',
  membership: 'membership',
  map: 'map',
};

/**
 * Shared JetVina media (https://jetvina.com WP uploads).
 * Prefer explicit catalog picks over hash-remapped JetBay seeds.
 */
export function jv(kind: JetvinaMediaKind, index = 0): string {
  const pool = JETVINA_MEDIA[kind];
  const url = pool[Math.abs(index) % pool.length]!;
  if (ALLOW_JETVINA_REMOTE) return url;
  return sanitizePublicMediaSrc(url, KIND_AS_PLACEHOLDER[kind]);
}

export const JB = {
  logo: JETBAY_LOGO,
  logoDefault: JETBAY_LOGO,
  homeBg: jv('hero', 0),
  callIcon: L('/v4/default/call-910545791444205568.webp'),
  globalIcon: L('/jetbayImg/common/global_b.png'),
  subscribeIcon: L('/v4/default/subscribe-icon-910621258612318208.webp'),

  icons: {
    calendar: L('/v4/batch/mdi_calendar-outline-904847559380520960.webp'),
    swap: L('/v4/default/la_exchange-alt-903025118920974336.webp'),
    plus: L('/v4/batch/plus-910318187433082880.webp'),
    minus: L('/v4/batch/del-910318183654014976.webp'),
    addLeg: L('/v4/default/plus_icon-912093689080209408.webp'),
    submit: L('/v4/default/submit_form-912045967636500480.webp'),
    filter: L('/v4/default/Filter-917489268698636288.webp'),
  },

  menu: {
    privateJet: jv('aircraft', 0),
    groupCharter: jv('aircraft', 10),
    medevac: jv('service', 0),
    pet: jv('cabin', 3),
    event: jv('news', 0),
  },

  videoThumbs: [
    jv('news', 0),
    jv('news', 1),
    jv('aircraft', 1),
    jv('aircraft', 0),
    jv('cabin', 0),
    jv('destination', 0),
    jv('service', 1),
    jv('news', 2),
  ],

  trust: {
    shield: L('/v4/batch/Shield Yes-904819778668023808.webp'),
    support: L('/v4/batch/Icon Frame-904819776243716096.webp'),
    star: L('/v4/batch/Star-904819780521906176.webp'),
  },

  promo: {
    worldCup: {
      desktop: jv('news', 0),
      mobile: jv('news', 1),
    },
    fixedPrice: {
      desktop: jv('aircraft', 1),
      mobile: jv('aircraft', 2),
    },
    cabin: {
      desktop: jv('cabin', 0),
      mobile: jv('cabin', 1),
    },
  },

  sections: {
    aboutJet: jv('hero', 1),
    whyCharter: jv('cabin', 2),
    sos: jv('service', 0),
    app: jv('membership', 0),
    partner: jv('service', 1),
    partnerMobile: jv('service', 2),
    islandBg: jv('destination', 0),
  },

  destinations: {
    nassau: jv('destination', 0),
    providenciales: jv('destination', 1),
    stBarts: jv('destination', 2),
    grandCayman: jv('destination', 3),
    anguilla: jv('destination', 4),
    sanJuan: jv('destination', 5),
  },

  jetCard: {
    h10: L('/jetbayImg/jetcard/10.webp'),
    h25: L('/jetbayImg/jetcard/25.webp'),
    h50: L('/jetbayImg/jetcard/50.webp'),
    noBlackout: L('/jetbayImg/jetcard/Noblackoutdates.webp'),
    priority: L('/jetbayImg/jetcard/Priorityaccess.webp'),
    seamless: L('/jetbayImg/jetcard/Seamlessbooking.webp'),
    luxury: L('/jetbayImg/jetcard/Luxuryexperience.webp'),
  },

  features: {
    time: L('/v4/default/Time-904444395364016128.webp'),
    safe: L('/v4/batch/Safe-904443819918090240.webp'),
    luxury: L('/v4/batch/Luxury-904443818336837632.webp'),
    dedicated: L('/v4/batch/Dedicated-904443813110734848.webp'),
    global: L('/v4/batch/Global-904443816763973632.webp'),
    flexible: L('/v4/batch/Flexible-904443815107223552.webp'),
  },

  stats: {
    rank: L('/jetbayImg/home/globalTrust/rand.png'),
    rankBg: L('/jetbayImg/home/globalTrust/rank_bg.png'),
    fly: L('/jetbayImg/home/globalTrust/fly.png'),
    countryBg: L('/jetbayImg/home/globalTrust/country_bg.png'),
    business: L('/jetbayImg/home/globalTrust/business.png'),
    annualBg: L('/jetbayImg/home/globalTrust/annual_bg.png'),
    annual: L('/jetbayImg/home/globalTrust/annual.png'),
    servedBg: L('/jetbayImg/home/globalTrust/served_bg.png'),
    globalBgM: L('/v4/batch/globalBgM-917148107853574144.webp'),
    bigArrow: L('/v4/batch/bigArrow-917148103411806208.webp'),
    plane: L('/v4/batch/plane-917148110772809728.webp'),
    tab: L('/v4/batch/tab-917148112383422464.webp'),
  },

  /** Original chip SVGs under /placeholders — never JetBay CDN or JetVina promo art. */
  payment: [
    { alt: 'Visa', src: '/placeholders/payment/visa.svg' },
    { alt: 'Mastercard', src: '/placeholders/payment/mastercard.svg' },
    { alt: 'Amex', src: '/placeholders/payment/amex.svg' },
    { alt: 'UnionPay', src: '/placeholders/payment/unionpay.svg' },
    { alt: 'Discover', src: '/placeholders/payment/discover.svg' },
  ],

  media: [
    { alt: 'The Business Times', src: L('/v4/alt/media/the-business-times-logo.webp') },
    { alt: 'Markets Insider', src: L('/v4/alt/media/markets-insider-business-insider-logo.webp') },
    { alt: 'Supercar Blondie', src: L('/v4/alt/media/supercar-blondie-logo.webp') },
    { alt: 'EIN Presswire', src: L('/v4/alt/media/ein-presswire-white-logo.webp') },
    { alt: 'Business Air News', src: L('/v4/alt/media/business-air-news-logo.webp') },
  ],

  membership: [
    { alt: 'WYVERN', src: L('/v4/alt/media/wyvern-aviation-safety-logo.webp') },
    { alt: 'AsBAA', src: L('/v4/alt/media/asbaa-asian-business-aviation-logo.webp') },
    { alt: 'NBAA', src: L('/v4/alt/media/nbaa-national-business-aviation-logo.webp') },
    { alt: 'BBGA', src: L('/v4/alt/media/bbga-business-general-aviation-logo.webp') },
    { alt: 'EBAA', src: L('/v4/alt/media/ebaa-european-business-aviation-logo.webp') },
    { alt: 'ACA', src: L('/v4/alt/media/aca-aircraft-charter-association-logo.webp') },
  ],

  social: [
    { alt: 'Instagram', href: 'https://www.instagram.com/jetbayglobal/', src: L('/v4/alt/media/jetbay-instagram-logo.webp') },
    { alt: 'YouTube', href: 'https://www.youtube.com/@jetbayglobal', src: L('/v4/alt/media/jetbay-youtube-logo.webp') },
    { alt: 'TikTok', href: 'https://www.tiktok.com/@jetbayglobal', src: L('/v4/alt/media/tiktok-logo.webp') },
  ],

  pages: {
    privateJetCharter: {
      hero: jv('hero', 0),
      banner: jv('hero', 1),
      jetCardPromo: jv('cabin', 0),
      creditPromo: jv('membership', 0),
      service1: jv('aircraft', 0),
      services: [jv('aircraft', 1), jv('destination', 0), jv('service', 0), jv('news', 0)],
      highlights: [
        { icon: '/placeholders/demo/service-01.svg', title: 'Global Coverage' },
        { icon: '/placeholders/demo/service-02.svg', title: 'AI-Powered Efficiency' },
        { icon: '/placeholders/demo/aircraft-01.svg', title: 'Uncompromised Safety' },
        { icon: '/placeholders/demo/aircraft-02.svg', title: 'Industry Leader' },
      ],
      aircraft: jv('aircraft', 2),
      aircraftFleet: [
        jv('aircraft', 2),
        jv('aircraft', 6),
        jv('aircraft', 7),
        jv('aircraft', 3),
        jv('aircraft', 8),
        jv('aircraft', 0),
        jv('aircraft', 4),
      ],
      serviceBlocks: [
        {
          title: 'Private Jet Charter for Business Travel',
          body: 'Optimise your business travel with our efficient and flexible private air charter services. We offer tailored solutions for executives and corporate teams, ensuring seamless and productive journeys.',
          image: jv('aircraft', 1),
        },
        {
          title: 'Private Jet Charter for Leisure Travel',
          body: 'Embark on unforgettable adventures with our private aircraft charters for leisure travel. Explore exotic destinations, escape to secluded retreats, or enjoy a luxurious getaway with family and friends.',
          image: jv('destination', 0),
        },
        {
          title: 'Private Jet Charter for Medical Transport',
          body: 'In times of medical urgency, our private jets provide swift and secure transportation for patients requiring critical care with experienced medical professionals onboard.',
          image: jv('service', 0),
        },
        {
          title: 'Private Jet Charter for Pet Travel',
          body: 'Bring your beloved companions along on your journeys with our pet-friendly private jets. We prioritise the comfort and safety of your pets throughout their journey.',
          image: jv('cabin', 3),
        },
        {
          title: 'Private Jet Charter for Events',
          body: 'Elevate your next event with specialised private jet charters for corporate gatherings, weddings, music festivals, and VIP groups of all sizes.',
          image: jv('news', 0),
        },
      ],
      processSteps: [
        { title: 'Share Your Itinerary', body: 'Share your travel requirements online.' },
        { title: 'Select Your Aircraft', body: 'Choose the ideal aircraft for your mission.' },
        { title: 'Quotation', body: 'Receive your tailored quotation.' },
        { title: 'Contract & Payment', body: 'Endorse & make payment.' },
        { title: 'Enjoy Your Trip', body: 'Relax and enjoy your journey.' },
      ],
      faqs: [
        {
          q: 'What is the cost of air charter services?',
          a: 'The cost ranges from 5,000–18,000 USD per hour depending on aircraft type, trip duration, and destination. Request a quote for a competitive price.',
        },
        {
          q: 'Are charter flights safe for travel?',
          a: 'Absolutely. Safety is our top priority. We partner with experienced pilots and operators who adhere to strict regulations.',
        },
        {
          q: 'What is the maximum passenger capacity?',
          a: 'Capacity varies by aircraft — from intimate groups to jets accommodating up to 19 passengers.',
        },
        {
          q: 'How much luggage can I bring?',
          a: 'Private jets generally offer more generous baggage allowances than commercial airlines. We guide you on capacity for your chosen aircraft.',
        },
        {
          q: 'What in-flight amenities are provided?',
          a: 'Spacious cabins, comfortable seating, Wi-Fi, in-flight entertainment, and tailored catering options.',
        },
      ],
    },
    jetCard: {
      hero: jv('cabin', 0),
      heroMobile: jv('cabin', 1),
      evaluateBg: jv('cabin', 2),
      benefits: [
        { icon: '/placeholders/demo/service-01.svg', title: 'No Blackout Dates' },
        { icon: '/placeholders/demo/service-02.svg', title: 'Priority Access' },
        { icon: '/placeholders/demo/aircraft-01.svg', title: 'Seamless Booking' },
        { icon: '/placeholders/demo/aircraft-02.svg', title: 'Luxury Experience' },
      ],
      comparison: {
        rows: [
          ['Booking', 'Instant booking', 'Request-based, subject to availability'],
          ['Pricing', 'Fixed hourly rate — no surprises', 'Varies by route & demand'],
          ['Flexibility', 'Easy change / cancel', 'Depends on operator'],
          ['Peak Seasons', 'No blackout dates', 'May have surcharges or limits'],
          ['Payment', 'Prepaid flight hours', 'Pay per trip'],
          ['Service', 'Dedicated manager & 24/7 support', 'Standard service'],
          ['Experience', 'Consistent aircraft & quality', 'Varies by operator'],
          ['Ideal For', 'Frequent flyers (25+ hrs/year)', 'Occasional or one-off trips'],
        ],
      },
      joinSteps: [
        { title: 'Select Jet Card', body: 'Hourly cards (10/25/50+ hours) meet diverse needs, with low entry & discount by hours purchased.' },
        { title: 'Submit Membership Request', body: 'Submit your membership request through our team.' },
        { title: 'Access Private Jet', body: 'Enjoy exclusive, hassle-free private jet access.' },
      ],
      faqs: [
        { q: 'What is Private Jet Membership, and how does it work?', a: 'A prepaid membership giving flexible access to a global private jet network with fixed hourly rates and priority booking.' },
        { q: 'What aircraft can I fly with the Jet Card?', a: 'Light, midsize, super-midsize, and long-range jets across our vetted operator network.' },
        { q: 'Can I use the Jet Card for international flights?', a: 'Yes — subject to aircraft availability and applicable regulations for your route.' },
        { q: 'What are the benefits over on-demand charter?', a: 'Fixed pricing, no blackout dates, instant booking, and dedicated account management.' },
        { q: 'How do I become a member?', a: 'Select a plan, submit the enquiry form, and our team will onboard you within one business day.' },
      ],
    },
    emptyLeg: {
      hero: jv('aircraft', 5),
      steps: [jv('aircraft', 0), jv('aircraft', 2), jv('aircraft', 4), jv('aircraft', 6)],
    },
    fixedPrice: {
      hero: jv('hero', 2),
      heroMobile: jv('hero', 3),
      routeIcon: '/placeholders/demo/map-01.svg',
      hotRoutes: [
        jv('destination', 0),
        jv('destination', 1),
        jv('destination', 2),
        jv('destination', 3),
      ],
    },
    airAmbulance: {
      hero: jv('service', 0),
      medevac: jv('service', 1),
      equipment: [
        jv('service', 2),
        jv('cabin', 4),
        jv('aircraft', 9),
        jv('service', 3),
      ],
    },
    travelCredit: {
      hero: jv('membership', 0),
      picture2: jv('cabin', 5),
    },
    partner: {
      service: jv('service', 1),
      referral: jv('service', 2),
      official: jv('service', 3),
      icons: {
        service: jv('service', 1),
        referral: jv('service', 2),
        official: jv('service', 3),
      },
    },
    bookingProcess: {
      hero: jv('hero', 1),
      heroMobile: jv('hero', 2),
      steps: [jv('aircraft', 0), jv('cabin', 0), jv('map', 0), jv('aircraft', 1)],
    },
    about: {
      hero: jv('hero', 3),
      heroMobile: jv('aircraft', 0),
      flyAnywhere: jv('aircraft', 10),
      pillars: {
        globalPlatform: jv('map', 0),
        seamless: jv('cabin', 0),
        owning: jv('aircraft', 1),
      },
      team: {
        ai: jv('service', 2),
        dev: jv('service', 3),
        expert: jv('cabin', 6),
        support: jv('service', 4),
      },
      awards: [
        { alt: 'CFS 2023', image: jv('news', 0) },
        { alt: 'PF 2023', image: jv('news', 1) },
        { alt: 'IIMP 2023', image: jv('news', 2) },
        { alt: 'Hurun 2025', image: jv('news', 3) },
        { alt: 'ESG 2024', image: jv('news', 4) },
        { alt: 'Hurun 2024', image: jv('destination', 0) },
        { alt: 'STIF 2024', image: jv('destination', 1) },
        { alt: 'ESG 2023', image: jv('destination', 2) },
      ],
      offices: [
        { city: 'Singapore', label: 'SINGAPORE', mapImage: jv('map', 0) },
        { city: 'Hong Kong', label: 'HONG KONG', mapImage: jv('map', 1) },
        { city: 'Jakarta', label: 'JAKARTA', mapImage: jv('map', 2) },
        { city: 'New York', label: 'NEW YORK', mapImage: jv('destination', 4) },
        { city: 'London', label: 'LONDON', mapImage: jv('destination', 5) },
        { city: 'Dubai', label: 'DUBAI', mapImage: jv('destination', 6) },
        { city: 'Shanghai', label: 'SHANGHAI', mapImage: jv('destination', 7) },
      ],
    },
    corporate: {
      hero: jv('hero', 1),
    },
    app: {
      hero: jv('membership', 0),
      float: jv('aircraft', 0),
    },
    island: {
      hero: jv('destination', 0),
    },
    worldCup: {
      hero: jv('news', 0),
    },
    newsDefault: jv('news', 3),
  },
} as const;

export function destinationThumb(slug: string): string | undefined {
  const map: Record<string, string> = {
    nassau: JB.destinations.nassau,
    providenciales: JB.destinations.providenciales,
    'st-barts': JB.destinations.stBarts,
    'grand-cayman': JB.destinations.grandCayman,
    anguilla: JB.destinations.anguilla,
    'san-juan': JB.destinations.sanJuan,
  };
  const key = Object.keys(map).find((k) => slug.toLowerCase().includes(k));
  return key ? map[key] : JB.sections.islandBg;
}

export function videoThumb(index: number, apiThumb?: string | null): string {
  if (apiThumb) return localAsset(apiThumb);
  return JB.videoThumbs[index % JB.videoThumbs.length];
}

export function fixedPriceRouteHero(slug: string, apiThumb?: string | null): string {
  if (apiThumb) return localAsset(apiThumb);
  const routes = JB.pages.fixedPrice.hotRoutes;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i)) % routes.length;
  return routes[hash] ?? JB.pages.fixedPrice.hero;
}

export function jetCardArt(hours: number): string {
  if (hours >= 50) return JB.jetCard.h50;
  if (hours >= 25) return JB.jetCard.h25;
  return JB.jetCard.h10;
}

/** Fixed-price region for locale — matches jet-bay.com en-us US routes */
export function fixedPriceRegion(locale: string): string | undefined {
  if (locale.startsWith('en-us') || locale === 'en') return 'US';
  if (locale.startsWith('zh')) return 'Asia';
  return 'Europe';
}
