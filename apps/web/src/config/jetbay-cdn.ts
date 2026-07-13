/** Local mirror of historical JetVina assets — do not use for brand logo UI. */
export const LOCAL_ASSET_ROOT = '/assets/jetbay';
/** @deprecated Use BrandLogo /brand/jetvina — JetVina SVG removed from public brand path */
export const JTA_LOGO = '/brand/jetvina/logo-fallback.svg';
/** @deprecated Prefer BrandLogo */
export const JETBAY_LOGO = JTA_LOGO;

export function localAsset(path: string): string {
  if (path.startsWith('/assets/')) return path;
  if (path.startsWith('http')) {
    try {
      const u = new URL(path.split('?')[0]);
      return localAsset(decodeURIComponent(u.pathname));
    } catch {
      return path;
    }
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const encoded = normalized
    .split('/')
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `${LOCAL_ASSET_ROOT}/${encoded}`;
}

/** @deprecated Alias — width resize not used for local files */
export function cdnUrl(path: string, _width?: 750 | 1200 | 1920): string {
  void _width;
  return localAsset(path);
}

const L = localAsset;

export const JB = {
  logo: JETBAY_LOGO,
  logoDefault: JETBAY_LOGO,
  homeBg: L('/v4/default/homeBg-904817913171628032.webp'),
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
    privateJet: L('/jetbayImg/menu/privet jet2.png'),
    groupCharter: L('/jetbayImg/menu/group charter2.png'),
    medevac: L('/jetbayImg/menu/medevac2.png'),
    pet: L('/jetbayImg/menu/pet2.png'),
    event: L('/jetbayImg/menu/event charter.png'),
  },

  videoThumbs: [
    L('/videoImg/EBACE.jpg'),
    L('/videoImg/5th_anniversary.jpg'),
    L('/videoImg/Jetbay_VIP_networking.jpg'),
    L('/videoImg/Bombardier_tour.jpg'),
    L('/videoImg/Bombardier_interview.jpg'),
    L('/videoImg/Bali_highlight.jpg'),
    L('/videoImg/company_profile.jpg'),
    L('/videoImg/CNY_Greetings.jpg'),
  ],

  trust: {
    shield: L('/v4/batch/Shield Yes-904819778668023808.webp'),
    support: L('/v4/batch/Icon Frame-904819776243716096.webp'),
    star: L('/v4/batch/Star-904819780521906176.webp'),
  },

  promo: {
    worldCup: {
      desktop: L('/v4/home/banner/fifa2/jetbay-connexus-world-cup-2026-full-schedule-private-jet-travel-banner.webp'),
      mobile: L('/v4/home/banner/fifa2/jetbay-connexus-world-cup-2026-full-schedule-private-jet-travel-banner-mobile.webp'),
    },
    fixedPrice: {
      desktop: L('/v4/alt/banner/home/fixed-price-private-jet-charter-banner-en-pc.webp'),
      mobile: L('/v4/alt/banner/home/fixed-price-private-jet-charter-banner-en-m.webp'),
    },
    cabin: {
      desktop: L('/v4/alt/banner/home/private-jet-cabin-banner-en-pc.webp'),
      mobile: L('/v4/alt/banner/home/private-jet-cabin-banner-en-m.webp'),
    },
  },

  sections: {
    aboutJet: L('/v4/default/privateBg-917782047634976768.webp'),
    whyCharter: L('/jetbayImg/home/knowledges/know1.png'),
    sos: L('/v4/default/sos-904477163624214528.webp'),
    app: L('/jetbayImg/app/app_download_new.png'),
    partner: L('/jetbayImg/partner/service_partner.png'),
    partnerMobile: L('/jetbayImg/partner/service_partner_m.png'),
    islandBg: L('/v4/alt/scenario/type/island-turquoise-coastline-bg.webp'),
  },

  destinations: {
    nassau: L('/v4/alt/scenario/destination/nassau-beach-home.webp'),
    providenciales: L('/v4/alt/scenario/destination/providenciales-beach-home.webp'),
    stBarts: L('/v4/alt/scenario/destination/st-barts-harbor-home.webp'),
    grandCayman: L('/v4/alt/scenario/destination/grand-cayman-beach-home.webp'),
    anguilla: L('/v4/alt/scenario/destination/anguilla-beach-home.webp'),
    sanJuan: L('/v4/alt/scenario/destination/san-juan-beach-home.webp'),
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

  payment: [
    { alt: 'Visa', src: L('/v4/batch/visa-907283502671294464.webp') },
    { alt: 'Mastercard', src: L('/v4/batch/master_card-907283499261325312.webp') },
    { alt: 'Amex', src: L('/v4/batch/amex-907283493871644672.webp') },
    { alt: 'UnionPay', src: L('/v4/batch/union_pay-907283500712554496.webp') },
    { alt: 'Discover', src: L('/v4/batch/discover-907283497763958784.webp') },
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
      hero: L('/v4/default/privateBg-917782047634976768.webp'),
      banner: L('/v4/default/banner-917829613705719808.webp'),
      jetCardPromo: L('/v4/batch/jetCardBg-917835541003857920.webp'),
      creditPromo: L('/v4/batch/creditCardBg-917835537140903936.webp'),
      service1: L('/v4/default/Private-Jet-Services1-930164880043810816.webp'),
      services: [
        L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_2.png'),
        L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_4.png'),
        L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_5.png'),
        L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_6.png'),
      ],
      highlights: [
        { icon: L('/v4/batch/Global-Coverage-918237629413027840.webp'), title: 'Global Coverage' },
        { icon: L('/v4/batch/AI-Powered-Efficiency-918237626535735296.webp'), title: 'AI-Powered Efficiency' },
        { icon: L('/v4/batch/Uncompromised-Safety-918237635805147136.webp'), title: 'Uncompromised Safety' },
        { icon: L('/v4/batch/Industry-Leader-918237632806219776.webp'), title: 'Industry Leader' },
      ],
      aircraft: L('/v4/alt/aircraft/phenom-300-light-jet.webp'),
      aircraftFleet: [
        L('/v4/alt/aircraft/phenom-300-light-jet.webp'),
        L('/v4/alt/aircraft/citation-xls-midsize-business-jet.webp'),
        L('/v4/alt/aircraft/challenger-350-midsize-business-jet.webp'),
        L('/v4/alt/aircraft/citation-latitude-midsize-business-jet.webp'),
        L('/v4/alt/aircraft/gulfstream-g650er-luxury-jet.webp'),
        L('/v4/alt/aircraft/global-6000-luxury-jet.webp'),
        L('/v4/alt/aircraft/praetor-600-midsize-business-jet.webp'),
      ],
      serviceBlocks: [
        {
          title: 'Private Jet Charter for Business Travel',
          body: 'Optimise your business travel with our efficient and flexible private air charter services. We offer tailored solutions for executives and corporate teams, ensuring seamless and productive journeys.',
          image: L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_2.png'),
        },
        {
          title: 'Private Jet Charter for Leisure Travel',
          body: 'Embark on unforgettable adventures with our private aircraft charters for leisure travel. Explore exotic destinations, escape to secluded retreats, or enjoy a luxurious getaway with family and friends.',
          image: L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_4.png'),
        },
        {
          title: 'Private Jet Charter for Medical Transport',
          body: 'In times of medical urgency, our private jets provide swift and secure transportation for patients requiring critical care with experienced medical professionals onboard.',
          image: L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_5.png'),
        },
        {
          title: 'Private Jet Charter for Pet Travel',
          body: 'Bring your beloved companions along on your journeys with our pet-friendly private jets. We prioritise the comfort and safety of your pets throughout their journey.',
          image: L('/v4/default/Private-Jet-Services1-930164880043810816.webp'),
        },
        {
          title: 'Private Jet Charter for Events',
          body: 'Elevate your next event with specialised private jet charters for corporate gatherings, weddings, music festivals, and VIP groups of all sizes.',
          image: L('/jetbayImg/service/privatejetcharter/privatejetservices/PrivateJetServiceWeOffer_6.png'),
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
      hero: L('/jetbayImg/jetcard/header/bg.webp'),
      heroMobile: L('/jetbayImg/jetcard/header/bgM.webp'),
      evaluateBg: L('/jetbayImg/jetcard/evaluateBg.webp'),
      benefits: [
        { icon: L('/jetbayImg/jetcard/Noblackoutdates.webp'), title: 'No Blackout Dates' },
        { icon: L('/jetbayImg/jetcard/Priorityaccess.webp'), title: 'Priority Access' },
        { icon: L('/jetbayImg/jetcard/Seamlessbooking.webp'), title: 'Seamless Booking' },
        { icon: L('/jetbayImg/jetcard/Luxuryexperience.webp'), title: 'Luxury Experience' },
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
      hero: L('/v4/default/emptyLegBg-916809761448710144.webp'),
      steps: [
        L('/v4/batch/1-917495760386514944.webp'),
        L('/v4/batch/2-917495762458501120.webp'),
        L('/v4/batch/3-917495763976839168.webp'),
        L('/v4/batch/4-917495765616812032.webp'),
      ],
    },
    fixedPrice: {
      hero: L('/v4/batch/PC_副本-906558134271881216.webp'),
      heroMobile: L('/v4/batch/H5-906558131340062720.webp'),
      routeIcon: L('/v4/default/road-911707614550241280.webp'),
      hotRoutes: [
        L('/v4/alt/hot-route/list/new-york-miami-miami-waterfront-list.webp'),
        L('/v4/alt/hot-route/list/london-paris-woman-red-list.webp'),
        L('/v4/alt/hot-route/list/los-angeles-las-vegas-gondolier-striped-list.webp'),
        L('/v4/alt/hot-route/list/new-york-washington-snowcapped-mountain-list.webp'),
      ],
    },
    airAmbulance: {
      hero: L('/jetbayImg/service/airambulance/bgM.png'),
      medevac: L('/jetbayImg/service/airambulance/medevac_info.png'),
      equipment: [
        L('/jetbayImg/service/airambulance/equipped/pilots.png'),
        L('/jetbayImg/service/airambulance/equipped/doctors.png'),
        L('/jetbayImg/service/airambulance/equipped/paramedics.png'),
        L('/jetbayImg/service/airambulance/equipped/medical.png'),
      ],
    },
    travelCredit: {
      hero: L('/jetbayImg/travelcredit/picture_1.png'),
      picture2: L('/jetbayImg/travelcredit/picture_1.png'),
    },
    partner: {
      service: L('/jetbayImg/partner/service_partner.png'),
      referral: L('/jetbayImg/partner/referral_partner.png'),
      official: L('/jetbayImg/partner/official_partner.png'),
      icons: {
        service: L('/jetbayImg/partner/service_partner.png'),
        referral: L('/jetbayImg/partner/referral_partner.png'),
        official: L('/jetbayImg/partner/official_partner.png'),
      },
    },
    bookingProcess: {
      hero: L('/v4/default/52bc72c4add2f8bf497e801e26ba4a568a48a10f-918214737245728768.webp'),
      heroMobile: L('/v4/default/52bc72c4add2f8bf497e801e26ba4a568a48a10f-918214737245728768.webp'),
      steps: [
        L('/jetbayImg/charter/booking/process/process_step_1.png'),
        L('/jetbayImg/charter/booking/process/process_step_2.png'),
        L('/jetbayImg/charter/booking/process/process_step_3.png'),
        L('/jetbayImg/charter/booking/process/process_step_4.png'),
      ],
    },
    about: {
      hero: L('/jetbayImg/about/bg_about.png'),
      heroMobile: L('/jetbayImg/about/bg_aboutM.png'),
      flyAnywhere: L('/jetbayImg/about/fly_anywhere_jetbay.png'),
      pillars: {
        globalPlatform: L('/jetbayImg/about/GlobalCharterPlatform.png'),
        seamless: L('/jetbayImg/about/Seamless.png'),
        owning: L('/jetbayImg/about/owning.png'),
      },
      team: {
        ai: L('/jetbayImg/about/team_ai.png'),
        dev: L('/jetbayImg/about/dev_team.png'),
        expert: L('/jetbayImg/about/expert.png'),
        support: L('/jetbayImg/about/support_team.png'),
      },
      awards: [
        { alt: 'CFS 2023', image: L('/jetbayImg/about/awards/2023_cfs.png') },
        { alt: 'PF 2023', image: L('/jetbayImg/about/awards/2023_pf.png') },
        { alt: 'IIMP 2023', image: L('/jetbayImg/about/awards/2023_iimp.png') },
        { alt: 'Hurun 2025', image: L('/jetbayImg/about/awards/2025_hurun.png') },
        { alt: 'ESG 2024', image: L('/jetbayImg/about/awards/2024_esg.png') },
        { alt: 'Hurun 2024', image: L('/jetbayImg/about/awards/2024_hurun.png') },
        { alt: 'STIF 2024', image: L('/jetbayImg/about/awards/2024_stif.png') },
        { alt: 'ESG 2023', image: L('/jetbayImg/about/awards/2023_esg.png') },
      ],
      offices: [
        { city: 'Singapore', label: 'SINGAPORE', mapImage: L('/jetbayImg/about/map/sg.png') },
        { city: 'Hong Kong', label: 'HONG KONG', mapImage: L('/jetbayImg/about/map/hk.png') },
        { city: 'Jakarta', label: 'JAKARTA', mapImage: L('/jetbayImg/about/map/jakarta.png') },
        { city: 'New York', label: 'NEW YORK', mapImage: L('/jetbayImg/about/map/newyork.png') },
        { city: 'London', label: 'LONDON', mapImage: L('/jetbayImg/about/map/london.png') },
        { city: 'Dubai', label: 'DUBAI', mapImage: L('/jetbayImg/about/map/dubai.png') },
        { city: 'Shanghai', label: 'SHANGHAI', mapImage: L('/jetbayImg/about/map/cn.png') },
      ],
    },
    corporate: {
      hero: L('/v4/default/homeBg-904817913171628032.webp'),
    },
    app: {
      hero: L('/jetbayImg/app/app_download_new.png'),
      float: L('/jetbayImg/app/app_float_bg.png'),
    },
    island: {
      hero: L('/v4/alt/scenario/type/island-turquoise-coastline-bg.webp'),
    },
    worldCup: {
      hero: L('/v4/home/banner/fifa2/jetbay-connexus-world-cup-2026-full-schedule-private-jet-travel-banner.webp'),
    },
    newsDefault: L('/v4/default/banner-917829613705719808.webp'),
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
