import { JB } from './jetbay-cdn';

export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavGroup = {
  title: string;
  links: NavLink[];
};

/** Mega menu — mirrors jet-bay.com navigation */
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
      { href: '/world-cup-final-2026-private-jet-charter', label: 'World Cup Final 2026', description: 'Final match packages' },
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
      { href: '/air-ambulance', label: 'Air Ambulance / J-TA SOS', description: '24/7 medical evacuation' },
      { href: '/booking-process', label: 'How Booking Works', description: 'Step-by-step guide' },
      { href: '/jetbay-private-jet-app', label: 'Mobile App', description: 'Book jets on the go' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about-us', label: 'About J-TA', description: 'Our story & standards' },
      { href: '/global-partnership-program', label: 'Global Partnership Program', description: 'Refer & earn globally' },
      { href: '/news', label: 'News', description: 'Latest updates' },
      { href: '/blogs', label: 'Blogs', description: 'Insights & guides' },
      { href: '/video-centre', label: 'Video Centre', description: 'Aircraft & destination videos' },
    ],
  },
];

export const FOOTER_SERVICES: NavLink[] = [
  { href: '/private-jet-charter', label: 'Private Jet Charter' },
  { href: '/fixed-price-charter', label: 'Fixed Price Charter' },
  { href: '/empty-leg', label: 'Empty Legs' },
  { href: '/jet-card', label: 'Jet Card' },
  { href: '/travel-credit', label: 'Travel Credits' },
  { href: '/air-ambulance', label: 'Air Ambulance' },
  { href: '/global-partnership-program', label: 'Partner Program' },
];

export const FOOTER_COMPANY: NavLink[] = [
  { href: '/about-us', label: 'About Us' },
  { href: '/booking-process', label: 'Booking Process' },
  { href: '/news', label: 'News' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/article/privacy-policy', label: 'Privacy Policy' },
  { href: '/article/terms-of-service', label: 'Terms of Service' },
];

export const QUICK_LINKS: NavLink[] = [
  { href: '/login', label: 'Log In' },
  { href: '/register', label: 'Register' },
  { href: '/account', label: 'My Account' },
];

export function navHref(locale: string, href: string) {
  return `/${locale}${href}`;
}

/** Menu link icon from J-TA CDN */
export function navLinkIcon(href: string): string | undefined {
  const map: Record<string, string> = {
    '/private-jet-charter': JB.menu.privateJet,
    '/corporate-air-charter': JB.menu.privateJet,
    '/group-air-charter': JB.menu.groupCharter,
    '/event-air-charter': JB.menu.event,
    '/pet-travel': JB.menu.pet,
    '/air-ambulance': JB.menu.medevac,
  };
  return map[href];
}
