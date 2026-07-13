/** Navigation structure — labels resolved via nav catalog per locale */

export type NavLinkDef = {
  href: string;
  labelKey: string;
  descKey?: string;
};

export type NavGroupDef = {
  titleKey: string;
  links: NavLinkDef[];
};

export const MEGA_MENU_DEF: NavGroupDef[] = [
  {
    titleKey: 'navCharter',
    links: [
      { href: '/private-jet-charter', labelKey: 'privateJetCharter', descKey: 'privateJetCharterDesc' },
      { href: '/corporate-air-charter', labelKey: 'corporateAirCharter', descKey: 'corporateAirCharterDesc' },
      { href: '/group-air-charter', labelKey: 'groupAirCharter', descKey: 'groupAirCharterDesc' },
      { href: '/event-air-charter', labelKey: 'eventAirCharter', descKey: 'eventAirCharterDesc' },
      { href: '/pet-travel', labelKey: 'petTravel', descKey: 'petTravelDesc' },
    ],
  },
  {
    titleKey: 'navDeals',
    links: [
      { href: '/empty-leg', labelKey: 'emptyLegs', descKey: 'emptyLegsDesc' },
      { href: '/fixed-price-charter', labelKey: 'fixedPriceCharter', descKey: 'fixedPriceCharterDesc' },
      { href: '/world-cup-2026-private-jet-booking', labelKey: 'worldCup2026', descKey: 'worldCup2026Desc' },
      { href: '/world-cup-final-2026-private-jet-charter', labelKey: 'worldCupFinal2026', descKey: 'worldCupFinal2026Desc' },
    ],
  },
  {
    titleKey: 'navMembership',
    links: [
      { href: '/jet-card', labelKey: 'jetCard', descKey: 'jetCardDesc' },
      { href: '/travel-credit', labelKey: 'travelCredits', descKey: 'travelCreditsDesc' },
    ],
  },
  {
    titleKey: 'navDestinations',
    links: [
      { href: '/island-destinations', labelKey: 'islandEscapes', descKey: 'islandEscapesDesc' },
      { href: '/ski-destinations', labelKey: 'skiResorts', descKey: 'skiResortsDesc' },
      { href: '/golf-destinations', labelKey: 'golfGetaways', descKey: 'golfGetawaysDesc' },
      { href: '/destination', labelKey: 'allDestinations', descKey: 'allDestinationsDesc' },
    ],
  },
  {
    titleKey: 'navServices',
    links: [
      { href: '/air-ambulance', labelKey: 'airAmbulance', descKey: 'airAmbulanceDesc' },
      { href: '/booking-process', labelKey: 'bookingProcess', descKey: 'bookingProcessDesc' },
      { href: '/jetbay-private-jet-app', labelKey: 'mobileApp', descKey: 'mobileAppDesc' },
    ],
  },
  {
    titleKey: 'navCompany',
    links: [
      { href: '/about-us', labelKey: 'aboutJetVina', descKey: 'aboutJetVinaDesc' },
      { href: '/global-partnership-program', labelKey: 'globalPartnership', descKey: 'globalPartnershipDesc' },
      { href: '/news', labelKey: 'news', descKey: 'newsDesc' },
      { href: '/blogs', labelKey: 'blogs', descKey: 'blogsDesc' },
      { href: '/video-centre', labelKey: 'videoCentre', descKey: 'videoCentreDesc' },
    ],
  },
];

export const FOOTER_SERVICES_DEF: NavLinkDef[] = [
  { href: '/private-jet-charter', labelKey: 'privateJetCharter' },
  { href: '/corporate-air-charter', labelKey: 'corporateAirCharter' },
  { href: '/group-air-charter', labelKey: 'groupAirCharter' },
  { href: '/fixed-price-charter', labelKey: 'fixedPriceCharter' },
  { href: '/empty-leg', labelKey: 'emptyLegs' },
  { href: '/jet-card', labelKey: 'jetCard' },
  { href: '/travel-credit', labelKey: 'travelCredits' },
  { href: '/air-ambulance', labelKey: 'airAmbulance' },
  { href: '/global-partnership-program', labelKey: 'partnerProgram' },
];

export const FOOTER_COMPANY_DEF: NavLinkDef[] = [
  { href: '/about-us', labelKey: 'aboutUs' },
  { href: '/booking-process', labelKey: 'bookingProcess' },
  { href: '/news', labelKey: 'news' },
  { href: '/blogs', labelKey: 'blogs' },
  { href: '/article/privacy-policy', labelKey: 'privacyPolicy' },
  { href: '/article/terms-of-service', labelKey: 'termsOfService' },
];

export const QUICK_LINKS_DEF: NavLinkDef[] = [
  { href: '/login', labelKey: 'logIn' },
  { href: '/register', labelKey: 'register' },
  { href: '/account', labelKey: 'myAccount' },
];
