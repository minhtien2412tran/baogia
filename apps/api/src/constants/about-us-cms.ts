/** Text-only CMS payload for about-us — images resolved on web from layout defaults */
export type AboutUsCmsPayload = {
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  pillarsTitle: string;
  pillars: { title: string; subtitle?: string; body: string }[];
  flyAnywhereTitle: string;
  flyAnywhereBody: string;
  teamTitle: string;
  teamCards: { title: string; body: string }[];
  awardsTitle: string;
  awardsSubtitle: string;
  whyTitle: string;
  whyIntro: string;
  whyItems: { title: string; body: string }[];
  officesTitle: string;
};

export const ABOUT_US_CMS_DEFAULT: AboutUsCmsPayload = {
  heroTitle: 'Your Global Air Charter Partner',
  heroSubtitle:
    'JetVina is a global private jet booking platform headquartered in Singapore with 6 other offices worldwide, providing exceptional service globally.',
  introTitle: 'Powering Global Journeys',
  introBody:
    'We provide fast, competitive, and seamless booking experiences, connecting customers to a fleet of over 10,000 business jets and aircraft worldwide.',
  pillarsTitle: 'Redefining Private Aviation',
  pillars: [
    {
      title: 'Global Charter Platform',
      subtitle: '10,000+ Jets, Seamless Bookings',
      body: 'Our AI team maintains a global jet database, providing cost-effective charter solutions by matching optimal flight resources.',
    },
    {
      title: 'Fly Without Owning',
      body: 'Access a global fleet without capital ownership — flexible charter for business, leisure, and special missions.',
    },
    {
      title: 'Seamless Experience',
      body: 'Fast quotations, transparent pricing, and end-to-end concierge from first enquiry to wheels-down.',
    },
  ],
  flyAnywhereTitle: 'Fly Anywhere with JetVina',
  flyAnywhereBody:
    'JetVina optimises charter flight solutions through our global jet database — reducing empty legs and delivering sustainable, efficient travel.',
  teamTitle: 'Industry Leading Team',
  teamCards: [
    {
      title: 'AI & Technology',
      body: "JetVina's team developed an AI platform integrated with our database, using big data to optimize charter resources for efficient, convenient flights.",
    },
    {
      title: 'Charter Specialists',
      body: 'Seasoned specialists with 20+ years of experience work around the clock to deliver top-tier, cost-effective flight solutions.',
    },
    {
      title: 'Operations Support',
      body: 'Our operations team focuses on every detail with the highest standards, leveraging extensive aviation experience and a vast partner network.',
    },
  ],
  awardsTitle: 'Awards & Recognition',
  awardsSubtitle: 'Celebrating Excellence in Jet Charter',
  whyTitle: 'Why Charter with JetVina?',
  whyIntro:
    'JetVina offers bespoke charter solutions, connecting you to a global fleet.',
  whyItems: [
    {
      title: 'Comprehensive and Competitive Solutions',
      body: 'Transparent pricing across light, midsize, and long-range aircraft.',
    },
    {
      title: '24/7 Fast Quotations',
      body: 'Receive tailored quotes within hours, any time zone.',
    },
    {
      title: 'Seamless Booking Process',
      body: 'From search to contract — one dedicated team handles every step.',
    },
    {
      title: 'Tailored Solutions by Our Specialists',
      body: 'Personalized routing, catering, and ground services for every mission.',
    },
  ],
  officesTitle: 'Contact Us',
};

export function aboutUsCmsJson(): string {
  return JSON.stringify(ABOUT_US_CMS_DEFAULT, null, 2);
}
