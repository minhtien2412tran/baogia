export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavGroup = {
  title: string;
  links: NavLink[];
};

/** Mega menu structure — mirrors jet-bay.com navigation groups */
export const MEGA_MENU: NavGroup[] = [
  {
    title: 'Charter',
    links: [
      { href: '/private-jet-charter', label: 'Private Jet Charter', description: 'On-demand flights worldwide' },
      { href: '/corporate-air-charter', label: 'Corporate Air Charter', description: 'Business travel solutions' },
      { href: '/group-air-charter', label: 'Group Air Charter', description: 'Teams, events & delegations' },
      { href: '/event-air-charter', label: 'Event Air Charter', description: 'Concerts, sports & VIP events' },
      { href: '/pet-travel', label: 'Pet Travel', description: 'Safe private travel for pets' },
    ],
  },
  {
    title: 'Deals',
    links: [
      { href: '/empty-leg', label: 'Empty Legs', description: 'Discounted one-way flights' },
      { href: '/fixed-price-charter', label: 'Fixed Price Charter', description: 'Transparent route pricing' },
      { href: '/world-cup-2026-private-jet-booking', label: 'World Cup 2026', description: 'Match-day private jet travel' },
    ],
  },
  {
    title: 'Membership',
    links: [
      { href: '/jet-card', label: 'Jet Card', description: 'Prepaid flight hours' },
      { href: '/travel-credit', label: 'Travel Credits', description: 'Flexible prepaid credits' },
    ],
  },
  {
    title: 'Destinations',
    links: [
      { href: '/island-destinations', label: 'Island Escapes', description: 'Caribbean & island retreats' },
      { href: '/destination', label: 'All Destinations', description: 'Curated global getaways' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/air-ambulance', label: 'Air Ambulance / SOS', description: '24/7 medical evacuation' },
      { href: '/booking-process', label: 'How Booking Works', description: 'Step-by-step guide' },
      { href: '/jetbay-private-jet-app', label: 'Mobile App', description: 'Book jets on the go' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about-us', label: 'About J-TA', description: 'Our story & standards' },
      { href: '/global-partnership-program', label: 'Partner Program', description: 'Refer & earn globally' },
      { href: '/news', label: 'News', description: 'Latest updates' },
      { href: '/blogs', label: 'Blogs', description: 'Insights & guides' },
      { href: '/video-centre', label: 'Video Centre', description: 'Aircraft & destination videos' },
    ],
  },
];

export const QUICK_LINKS: NavLink[] = [
  { href: '/login', label: 'Log In' },
  { href: '/register', label: 'Register' },
  { href: '/account', label: 'My Account' },
];

export function navHref(locale: string, href: string) {
  return `/${locale}${href}`;
}
