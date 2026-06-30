import { JB } from '../config/jetbay-cdn';

export type AboutUsOffice = {
  city: string;
  label: string;
  mapImage: string;
};

export type AboutUsAward = {
  alt: string;
  image: string;
};

export type AboutUsTeamCard = {
  title: string;
  body: string;
  image: string;
};

export type AboutUsPillar = {
  title: string;
  subtitle?: string;
  body: string;
  image: string;
};

export type AboutUsWhyItem = {
  title: string;
  body: string;
};

export type AboutUsPageData = {
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  pillarsTitle: string;
  pillars: AboutUsPillar[];
  flyAnywhereTitle: string;
  flyAnywhereBody: string;
  flyAnywhereImage: string;
  teamTitle: string;
  teamCards: AboutUsTeamCard[];
  awardsTitle: string;
  awardsSubtitle: string;
  awards: AboutUsAward[];
  whyTitle: string;
  whyIntro: string;
  whyItems: AboutUsWhyItem[];
  officesTitle: string;
  offices: AboutUsOffice[];
};

/** Default layout cloned from scratch/pages/about-us.html — editable via CMS JSON body */
export const DEFAULT_ABOUT_US: AboutUsPageData = {
  heroTitle: 'Your Global Air Charter Partner',
  heroSubtitle:
    'J-TA is a global private jet booking platform headquartered in Singapore with 6 other offices worldwide, providing exceptional service globally.',
  introTitle: 'Powering Global Journeys',
  introBody:
    'We provide fast, competitive, and seamless booking experiences, connecting customers to a fleet of over 10,000 business jets and aircraft worldwide.',
  pillarsTitle: 'Redefining Private Aviation',
  pillars: [
    {
      title: 'Global Charter Platform',
      subtitle: '10,000+ Jets, Seamless Bookings',
      body: 'Our AI team maintains a global jet database, providing cost-effective charter solutions by matching optimal flight resources.',
      image: JB.pages.about.pillars.globalPlatform,
    },
    {
      title: 'Fly Without Owning',
      body: 'Access a global fleet without capital ownership — flexible charter for business, leisure, and special missions.',
      image: JB.pages.about.pillars.owning,
    },
    {
      title: 'Seamless Experience',
      body: 'Fast quotations, transparent pricing, and end-to-end concierge from first enquiry to wheels-down.',
      image: JB.pages.about.pillars.seamless,
    },
  ],
  flyAnywhereTitle: 'Fly Anywhere with J-TA',
  flyAnywhereBody:
    'J-TA optimises charter flight solutions through our global jet database — reducing empty legs and delivering sustainable, efficient travel.',
  flyAnywhereImage: JB.pages.about.flyAnywhere,
  teamTitle: 'Industry Leading Team',
  teamCards: [
    {
      title: 'AI & Technology',
      body: "J-TA's team developed an AI platform integrated with our database, using big data to optimize charter resources for efficient, convenient flights.",
      image: JB.pages.about.team.ai,
    },
    {
      title: 'Charter Specialists',
      body: 'Seasoned specialists with 20+ years of experience work around the clock to deliver top-tier, cost-effective flight solutions.',
      image: JB.pages.about.team.expert,
    },
    {
      title: 'Operations Support',
      body: 'Our operations team focuses on every detail with the highest standards, leveraging extensive aviation experience and a vast partner network.',
      image: JB.pages.about.team.support,
    },
  ],
  awardsTitle: 'Awards & Recognition',
  awardsSubtitle: 'Celebrating Excellence in Jet Charter',
  awards: JB.pages.about.awards,
  whyTitle: 'Why Charter with J-TA?',
  whyIntro: 'J-TA offers bespoke charter solutions, connecting you to a global fleet.',
  whyItems: [
    { title: 'Comprehensive and Competitive Solutions', body: 'Transparent pricing across light, midsize, and long-range aircraft.' },
    { title: '24/7 Fast Quotations', body: 'Receive tailored quotes within hours, any time zone.' },
    { title: 'Seamless Booking Process', body: 'From search to contract — one dedicated team handles every step.' },
    { title: 'Tailored Solutions by Our Specialists', body: 'Personalized routing, catering, and ground services for every mission.' },
  ],
  officesTitle: 'Contact Us',
  offices: JB.pages.about.offices,
};

export function parseAboutUsBody(body: string | undefined | null): AboutUsPageData {
  if (!body?.trim()) return DEFAULT_ABOUT_US;
  try {
    const parsed = JSON.parse(body) as Partial<AboutUsPageData>;
    return mergeAboutUs(parsed);
  } catch {
    return { ...DEFAULT_ABOUT_US, introBody: body };
  }
}

function mergeRecords<T extends Record<string, unknown>>(defaults: T[], overrides?: Partial<T>[]): T[] {
  if (!overrides?.length) return defaults;
  return defaults.map((item, i) => ({ ...item, ...(overrides[i] ?? {}) }));
}

function mergeAboutUs(parsed: Partial<AboutUsPageData>): AboutUsPageData {
  return {
    ...DEFAULT_ABOUT_US,
    ...parsed,
    pillars: mergeRecords(DEFAULT_ABOUT_US.pillars, parsed.pillars),
    teamCards: mergeRecords(DEFAULT_ABOUT_US.teamCards, parsed.teamCards),
    whyItems: mergeRecords(DEFAULT_ABOUT_US.whyItems, parsed.whyItems),
    awards: parsed.awards?.length
      ? DEFAULT_ABOUT_US.awards.map((a, i) => ({ ...a, ...(parsed.awards?.[i] ?? {}) }))
      : DEFAULT_ABOUT_US.awards,
    offices: parsed.offices?.length
      ? DEFAULT_ABOUT_US.offices.map((o, i) => ({ ...o, ...(parsed.offices?.[i] ?? {}) }))
      : DEFAULT_ABOUT_US.offices,
  };
}
