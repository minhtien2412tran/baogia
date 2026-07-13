import { toDbLocale } from './registry';
import { TOURISM_MESSAGE_OVERRIDES } from './tourism-locales';
import { PRODUCT_UI_BY_LANG } from './product-ui-locales';

/** UI shell messages — expand per product need; CMS body stays in API translations */

export type MessageKey =
  | 'menu'
  | 'login'
  | 'register'
  | 'account'
  | 'logout'
  | 'getQuote'
  | 'bookNow'
  | 'searchFlights'
  | 'contactUs'
  | 'myAccount'
  | 'overview'
  | 'myQuotes'
  | 'jetCard'
  | 'travelCredits'
  | 'payments'
  | 'documents'
  | 'newsletter'
  | 'services'
  | 'company'
  | 'from'
  | 'to'
  | 'departure'
  | 'passengers'
  | 'searchAircraft'
  | 'searching'
  | 'requestQuoteBtn'
  | 'quoteConsentLabel'
  | 'quoteEmailRequired'
  | 'quoteSearchFirst'
  | 'noAircraftFound'
  | 'emptyLegDepartLabel'
  | 'availableAircraft'
  | 'bookRoute'
  | 'loading'
  | 'readMore'
  | 'latestNews'
  | 'noNewsTitle'
  | 'noNewsDesc'
  | 'noNewsCta'
  | 'viewAll'
  | 'skipToContent'
  | 'heroTitle'
  | 'heroSubtitle'
  | 'securePayment'
  | 'concierge24'
  | 'premiumAircraft'
  | 'oneWay'
  | 'roundTrip'
  | 'multiCity'
  | 'leg'
  | 'returnDate'
  | 'addLeg'
  | 'emailOptional'
  | 'phoneOptional'
  | 'departurePlaceholder'
  | 'destinationPlaceholder'
  | 'upToPax'
  | 'swapAirports'
  | 'decreasePax'
  | 'increasePax'
  | 'emailPlaceholder'
  | 'subscribe'
  | 'subscribing'
  | 'subscriptionFailed'
  | 'emailAriaLabel'
  | 'popularRoutes'
  | 'allFixedPriceRoutes'
  | 'fixedPricePageTitle'
  | 'fixedPricePageDesc'
  | 'fixedPriceMetaDesc'
  | 'pricingOnRequest'
  | 'categoryJets'
  | 'upToPassengers'
  | 'fixedPriceRouteAlt'
  | 'viewAllFixedPriceRoutes'
  | 'routeNotFound'
  | 'allRoutes'
  | 'routeUnavailable'
  | 'fixedPriceLabel'
  | 'fixedPriceExcerpt'
  | 'pricingTiers'
  | 'pricingTiersSubtitle'
  | 'pricingOnRequestDetail'
  | 'whatsIncluded'
  | 'whatsNotIncluded'
  | 'fpIncluded1'
  | 'fpIncluded2'
  | 'fpIncluded3'
  | 'fpNotIncluded1'
  | 'fpNotIncluded2'
  | 'fpNotIncluded3'
  | 'howBookingWorks'
  | 'searchThisRoute'
  | 'searchThisRouteSubtitle'
  | 'fixedPriceRouteMetaDesc'
  | 'allFixedPriceRoutesBack'
  | 'getFixedPriceQuote'
  | 'quoteError'
  | 'aircraftCategory'
  | 'emailAddress'
  | 'airportSelectRequired'
  | 'airportSearching'
  | 'airportNoResults'
  | 'airportPickHint'
  | 'nearMe'
  | 'nearMeLocating'
  | 'nearMeDenied'
  | 'nearMeNone'
  | 'pricedWithOperator'
  | 'pricingBreakdown'
  | 'processing'
  | 'emptyLegsNearYou'
  | 'emptyLegsSectionDesc'
  | 'viewMoreEmptyLeg'
  | 'emptyLegsEmptyDesc'
  | 'emptyLegSubscribeTitle'
  | 'getAlerts'
  | 'saving'
  | 'subscribeFailed'
  | 'discountOff'
  | 'tierOption'
  | 'deals'
  | 'emptyLegPageTitle'
  | 'emptyLegPageDesc'
  | 'emptyLegMetaDesc'
  | 'availableEmptyLegs'
  | 'howEmptyLegsWork'
  | 'elStepBrowseTitle'
  | 'elStepBrowseBody'
  | 'elStepSelectTitle'
  | 'elStepSelectBody'
  | 'elStepBookTitle'
  | 'elStepBookBody'
  | 'elStepFlyTitle'
  | 'elStepFlyBody'
  | 'blogsHeroDesc'
  | 'newsHeroDesc'
  | 'blogsMetaDesc'
  | 'newsMetaDesc'
  | 'videoMetaDesc'
  | 'destinationsMetaDesc'
  | 'postNotFound'
  | 'articleNotFound'
  | 'postUnavailable'
  | 'articleUnavailable'
  | 'allBlogs'
  | 'allNews'
  | 'blogTag'
  | 'newsTag'
  | 'legalTag'
  | 'mediaTag'
  | 'destinationTag'
  | 'planNextFlight'
  | 'planNextFlightSubtitle'
  | 'readyToFly'
  | 'readyToFlySubtitle'
  | 'notFoundShort'
  | 'videoHeroDesc'
  | 'featuredVideos'
  | 'featuredVideosSubtitle'
  | 'watchVideo'
  | 'videoViews'
  | 'destinationsHubDesc'
  | 'searchFlightsTo'
  | 'offerNotFound'
  | 'allEmptyLegsBack'
  | 'emptyLegOfferTag'
  | 'labelAircraft'
  | 'labelDeparture'
  | 'labelPrice'
  | 'labelDiscount';

type Catalog = Record<MessageKey, string>;

const en: Catalog = {
  menu: 'Menu',
  login: 'Sign in',
  register: 'Register',
  account: 'My account',
  logout: 'Log out',
  getQuote: 'Get a quote',
  bookNow: 'Book now',
  searchFlights: 'Search flights',
  contactUs: 'Contact Us',
  myAccount: 'My Account',
  overview: 'Overview',
  myQuotes: 'My Quotes',
  jetCard: 'Jet Card',
  travelCredits: 'Travel Credits',
  payments: 'Payments',
  documents: 'Documents',
  newsletter: 'Subscribe to our newsletter',
  services: 'Services',
  company: 'Company',
  from: 'From',
  to: 'To',
  departure: 'Departure (Local)',
  passengers: 'Passengers',
  searchAircraft: 'Search Available Aircraft',
  searching: 'Searching aircraft…',
  requestQuoteBtn: 'Request Quote',
  quoteConsentLabel: 'I agree to be contacted about this charter request.',
  quoteEmailRequired: 'Email is required to request a quote.',
  quoteSearchFirst: 'Search for aircraft first, then request a quote.',
  noAircraftFound: 'No aircraft match your passenger count for this route.',
  emptyLegDepartLabel: 'Departure',
  availableAircraft: 'Available Aircraft',
  bookRoute: 'Book this route',
  loading: 'Loading…',
  readMore: 'Read more',
  latestNews: 'Latest news',
  noNewsTitle: 'No news yet',
  noNewsDesc: 'Check back soon for updates on private aviation, fleet expansions, and exclusive offers.',
  noNewsCta: 'Get a charter quote',
  viewAll: 'View all',
  skipToContent: 'Skip to content',
  heroTitle: 'Global Private Jet Charter: Global Private Aviation Access',
  heroSubtitle: 'Seamless, trusted access to private aviation worldwide.',
  securePayment: 'Secure Payment',
  concierge24: '24/7 Global Concierge Support',
  premiumAircraft: 'Premium Aircraft',
  oneWay: 'One-way',
  roundTrip: 'Round-Trip',
  multiCity: 'Multi-City',
  leg: 'Leg',
  returnDate: 'Return (Local)',
  addLeg: 'Add another flight leg',
  emailOptional: 'Email (optional)',
  phoneOptional: 'Phone (optional)',
  departurePlaceholder: 'Departure city or airport',
  destinationPlaceholder: 'Destination city or airport',
  upToPax: 'up to {n} pax',
  swapAirports: 'Swap airports',
  decreasePax: 'Decrease passengers',
  increasePax: 'Increase passengers',
  emailPlaceholder: 'Your email',
  subscribe: 'Subscribe',
  subscribing: '…',
  subscriptionFailed: 'Subscription failed',
  emailAriaLabel: 'Email address',
  popularRoutes: 'Popular routes',
  allFixedPriceRoutes: 'All fixed-price routes',
  fixedPricePageTitle: 'Fixed-Price Charter Routes',
  fixedPricePageDesc: 'Experience price certainty on our most requested global routes.',
  fixedPriceMetaDesc: 'Transparent fixed-price private jet routes.',
  pricingOnRequest: 'Pricing on request',
  categoryJets: '{category} Jets',
  upToPassengers: 'Up to {n} passengers',
  fixedPriceRouteAlt: 'Fixed price route',
  viewAllFixedPriceRoutes: 'View All Fixed-Price Routes →',
  routeNotFound: 'Route not found',
  allRoutes: 'All routes',
  routeUnavailable: 'This route is no longer available.',
  fixedPriceLabel: 'Fixed Price',
  fixedPriceExcerpt: 'Transparent fixed pricing from {from} to {to}. Price certainty on this popular route.',
  pricingTiers: 'Pricing tiers',
  pricingTiersSubtitle: 'Choose the aircraft category that fits your party size.',
  pricingOnRequestDetail: 'Pricing on request — contact concierge for a quote.',
  whatsIncluded: "What's included",
  whatsNotIncluded: "What's not included",
  fpIncluded1: 'Aircraft, crew, and standard handling fees',
  fpIncluded2: 'Departure and arrival at private terminals (FBO)',
  fpIncluded3: '24/7 JetVina concierge support',
  fpNotIncluded1: 'Catering upgrades and ground transportation',
  fpNotIncluded2: 'International handling and overflight permits where applicable',
  fpNotIncluded3: 'De-icing, hangar, or overnight fees if required',
  howBookingWorks: 'How Booking Works',
  searchThisRoute: 'Search this route',
  searchThisRouteSubtitle: 'Get a tailored quote in minutes.',
  fixedPriceRouteMetaDesc: 'Fixed-price private jet charter route.',
  allFixedPriceRoutesBack: 'All Fixed-Price Routes',
  getFixedPriceQuote: 'Get fixed-price quote',
  quoteError: 'Unable to generate quote. Please try again.',
  aircraftCategory: 'Aircraft category',
  emailAddress: 'Email address',
  airportSelectRequired: 'Please pick a departure and destination airport from the suggestions list.',
  airportSearching: 'Searching airports…',
  airportNoResults: 'No airports found — try a city, country, or IATA code (e.g. LBG, Paris).',
  airportPickHint: 'Select an airport from the list below.',
  nearMe: 'Near me',
  nearMeLocating: 'Finding airports near you…',
  nearMeDenied: 'Location permission denied — search by city instead.',
  nearMeNone: 'No airports found nearby. Try a wider search.',
  pricedWithOperator: '{operator} · {tail} · base {base}',
  pricingBreakdown: '{summary}',
  processing: 'Processing…',
  emptyLegsNearYou: 'Empty Legs Near You',
  emptyLegsSectionDesc: 'Last-minute private jet deals at reduced rates',
  viewMoreEmptyLeg: 'View More Empty Leg →',
  emptyLegsEmptyDesc: 'No empty legs available right now. Subscribe below for alerts.',
  emptyLegSubscribeTitle: 'Not seeing your route? Subscribe for matching empty legs',
  getAlerts: 'Get Alerts',
  saving: 'Saving…',
  subscribeFailed: 'Failed to subscribe',
  discountOff: '{n}% off',
  tierOption: '{category} — USD {price} ({pax})',
  deals: 'Deals',
  emptyLegPageTitle: 'Empty Legs',
  emptyLegPageDesc: 'Last-minute private jet deals at reduced rates — fly private for less.',
  emptyLegMetaDesc: 'Last-minute private jet deals at reduced rates.',
  availableEmptyLegs: 'Available empty legs',
  howEmptyLegsWork: 'How empty legs work',
  elStepBrowseTitle: 'Browse deals',
  elStepBrowseBody: 'Explore discounted one-way empty leg flights updated in real time.',
  elStepSelectTitle: 'Select your route',
  elStepSelectBody: 'Filter by departure city, destination, and travel dates.',
  elStepBookTitle: 'Book instantly',
  elStepBookBody: 'Confirm your empty leg at a fraction of standard charter cost.',
  elStepFlyTitle: 'Fly private',
  elStepFlyBody: 'Enjoy the same premium experience at a reduced rate.',
  blogsHeroDesc: 'Insights, guides, and stories from the world of private aviation.',
  newsHeroDesc: 'Latest updates and announcements from JetVina.',
  blogsMetaDesc: 'Private aviation insights and travel guides.',
  newsMetaDesc: 'Latest news from JetVina private aviation.',
  videoMetaDesc: 'Aircraft tours and destination videos.',
  destinationsMetaDesc: 'Curated private jet destinations worldwide.',
  postNotFound: 'Post not found',
  articleNotFound: 'Article not found',
  postUnavailable: 'This post is no longer available.',
  articleUnavailable: 'This article is no longer available.',
  allBlogs: 'All Blogs',
  allNews: 'All News',
  blogTag: 'Blog',
  newsTag: 'News',
  legalTag: 'Legal',
  mediaTag: 'Media',
  destinationTag: 'Destination',
  planNextFlight: 'Plan your next flight',
  planNextFlightSubtitle: 'Search available aircraft worldwide.',
  readyToFly: 'Ready to fly?',
  readyToFlySubtitle: 'Search available aircraft for your next journey.',
  notFoundShort: 'Not found',
  videoHeroDesc: 'Explore our fleet, destinations, and events on video.',
  featuredVideos: 'Featured videos',
  featuredVideosSubtitle: 'Highlights from JetVina events and aircraft tours.',
  watchVideo: 'Watch video →',
  videoViews: '{n} views',
  destinationsHubDesc: 'Explore curated getaways by private jet.',
  searchFlightsTo: 'Search flights to {city}',
  offerNotFound: 'Offer not found',
  allEmptyLegsBack: 'All empty legs',
  emptyLegOfferTag: 'Empty Leg',
  labelAircraft: 'Aircraft',
  labelDeparture: 'Departure',
  labelPrice: 'Price',
  labelDiscount: 'discount',
};

const vi: Catalog = {
  ...en,
  menu: 'Danh mục',
  login: 'Đăng nhập',
  register: 'Đăng ký',
  account: 'Tài khoản',
  logout: 'Đăng xuất',
  getQuote: 'Nhận báo giá',
  bookNow: 'Đặt ngay',
  searchFlights: 'Tìm chuyến bay',
  contactUs: 'Liên hệ',
  myAccount: 'Tài khoản của tôi',
  overview: 'Tổng quan',
  myQuotes: 'Báo giá của tôi',
  payments: 'Thanh toán',
  documents: 'Tài liệu',
  newsletter: 'Đăng ký nhận bản tin',
  services: 'Dịch vụ',
  company: 'Công ty',
  from: 'Điểm đi',
  to: 'Điểm đến',
  departure: 'Ngày khởi hành',
  passengers: 'Hành khách',
  searchAircraft: 'Tìm máy bay khả dụng',
  searching: 'Đang tìm máy bay…',
  requestQuoteBtn: 'Yêu cầu báo giá',
  quoteConsentLabel: 'Tôi đồng ý được liên hệ về yêu cầu charter này.',
  quoteEmailRequired: 'Cần email để gửi yêu cầu báo giá.',
  quoteSearchFirst: 'Hãy tìm máy bay trước, sau đó yêu cầu báo giá.',
  noAircraftFound: 'Không có máy bay phù hợp số hành khách cho tuyến này.',
  emptyLegDepartLabel: 'Khởi hành',
  availableAircraft: 'Máy bay khả dụng',
  bookRoute: 'Đặt tuyến này',
  loading: 'Đang xử lý…',
  readMore: 'Xem thêm',
  latestNews: 'Tin mới nhất',
  noNewsTitle: 'Chưa có tin tức',
  noNewsDesc: 'Quay lại sau để cập nhật hàng không tư nhân, mở rộng đội bay và ưu đãi độc quyền.',
  noNewsCta: 'Nhận báo giá charter',
  viewAll: 'Xem tất cả',
  skipToContent: 'Chuyển tới nội dung',
  heroTitle: 'Thuê máy bay riêng toàn cầu: Truy cập 10.000+ máy bay',
  heroSubtitle: 'Truy cập liền mạch, đáng tin cậy vào hàng không tư nhân trên toàn thế giới.',
  securePayment: 'Thanh toán an toàn',
  concierge24: 'Hỗ trợ concierge 24/7 toàn cầu',
  premiumAircraft: 'Máy bay cao cấp',
  oneWay: 'Một chiều',
  roundTrip: 'Khứ hồi',
  multiCity: 'Nhiều thành phố',
  leg: 'Chặng',
  returnDate: 'Ngày về',
  addLeg: 'Thêm chặng bay',
  emailOptional: 'Email (tùy chọn)',
  phoneOptional: 'Điện thoại (tùy chọn)',
  departurePlaceholder: 'Thành phố hoặc sân bay đi',
  destinationPlaceholder: 'Thành phố hoặc sân bay đến',
  upToPax: 'tối đa {n} hành khách',
  swapAirports: 'Đổi sân bay',
  decreasePax: 'Giảm hành khách',
  increasePax: 'Tăng hành khách',
  emailPlaceholder: 'Email của bạn',
  subscribe: 'Đăng ký',
  subscribing: '…',
  subscriptionFailed: 'Đăng ký thất bại',
  emailAriaLabel: 'Địa chỉ email',
  popularRoutes: 'Tuyến phổ biến',
  allFixedPriceRoutes: 'Tất cả tuyến giá cố định',
  fixedPricePageTitle: 'Tuyến charter giá cố định',
  fixedPricePageDesc: 'Giá minh bạch trên các tuyến toàn cầu được yêu cầu nhiều nhất.',
  fixedPriceMetaDesc: 'Tuyến máy bay riêng giá cố định minh bạch.',
  pricingOnRequest: 'Giá theo yêu cầu',
  categoryJets: 'Máy bay {category}',
  upToPassengers: 'Tối đa {n} hành khách',
  fixedPriceRouteAlt: 'Tuyến giá cố định',
  viewAllFixedPriceRoutes: 'Xem tất cả tuyến giá cố định →',
  routeNotFound: 'Không tìm thấy tuyến',
  allRoutes: 'Tất cả tuyến',
  routeUnavailable: 'Tuyến này không còn khả dụng.',
  fixedPriceLabel: 'Giá cố định',
  fixedPriceExcerpt: 'Giá cố định minh bạch từ {from} đến {to}. Cam kết giá trên tuyến phổ biến này.',
  pricingTiers: 'Bậc giá',
  pricingTiersSubtitle: 'Chọn loại máy bay phù hợp quy mô nhóm của bạn.',
  pricingOnRequestDetail: 'Giá theo yêu cầu — liên hệ concierge để báo giá.',
  whatsIncluded: 'Bao gồm',
  whatsNotIncluded: 'Không bao gồm',
  fpIncluded1: 'Máy bay, phi hành đoàn và phí xử lý tiêu chuẩn',
  fpIncluded2: 'Khởi hành và đến tại nhà ga riêng (FBO)',
  fpIncluded3: 'Hỗ trợ concierge JetVina 24/7',
  fpNotIncluded1: 'Nâng cấp catering và vận chuyển mặt đất',
  fpNotIncluded2: 'Xử lý quốc tế và giấy phép bay qua lãnh thổ (nếu có)',
  fpNotIncluded3: 'Phí chống băng, hangar hoặc qua đêm nếu phát sinh',
  howBookingWorks: 'Quy trình đặt chỗ',
  searchThisRoute: 'Tìm tuyến này',
  searchThisRouteSubtitle: 'Nhận báo giá tùy chỉnh trong vài phút.',
  fixedPriceRouteMetaDesc: 'Tuyến charter máy bay riêng giá cố định.',
  allFixedPriceRoutesBack: 'Tất cả tuyến giá cố định',
  getFixedPriceQuote: 'Nhận báo giá cố định',
  quoteError: 'Không thể tạo báo giá. Vui lòng thử lại.',
  aircraftCategory: 'Loại máy bay',
  emailAddress: 'Địa chỉ email',
  airportSelectRequired: 'Vui lòng chọn sân bay đi và đến từ danh sách gợi ý.',
  airportSearching: 'Đang tìm sân bay…',
  airportNoResults: 'Không tìm thấy sân bay — thử tên thành phố, quốc gia hoặc mã IATA (vd. LBG, Paris).',
  airportPickHint: 'Chọn một sân bay trong danh sách gợi ý.',
  nearMe: 'Gần tôi',
  nearMeLocating: 'Đang tìm sân bay gần bạn…',
  nearMeDenied: 'Không có quyền vị trí — hãy tìm theo thành phố.',
  nearMeNone: 'Không có sân bay gần đây. Thử tìm theo tên.',
  pricedWithOperator: '{operator} · {tail} · base {base}',
  pricingBreakdown: '{summary}',
  processing: 'Đang xử lý…',
  emptyLegsNearYou: 'Empty leg gần bạn',
  emptyLegsSectionDesc: 'Ưu đãi máy bay riêng phút chót với giá giảm',
  viewMoreEmptyLeg: 'Xem thêm empty leg →',
  emptyLegsEmptyDesc: 'Hiện không có empty leg. Đăng ký bên dưới để nhận thông báo.',
  emptyLegSubscribeTitle: 'Không thấy tuyến của bạn? Đăng ký nhận empty leg phù hợp',
  getAlerts: 'Nhận thông báo',
  saving: 'Đang lưu…',
  subscribeFailed: 'Đăng ký thất bại',
  discountOff: 'Giảm {n}%',
  tierOption: '{category} — USD {price} ({pax})',
  deals: 'Ưu đãi',
  emptyLegPageTitle: 'Empty leg',
  emptyLegPageDesc: 'Ưu đãi máy bay riêng phút chót — bay riêng với chi phí thấp hơn.',
  emptyLegMetaDesc: 'Ưu đãi máy bay riêng phút chót với giá giảm.',
  availableEmptyLegs: 'Empty leg đang có',
  howEmptyLegsWork: 'Empty leg hoạt động thế nào',
  elStepBrowseTitle: 'Xem ưu đãi',
  elStepBrowseBody: 'Khám phá chuyến empty leg một chiều giảm giá, cập nhật theo thời gian thực.',
  elStepSelectTitle: 'Chọn tuyến',
  elStepSelectBody: 'Lọc theo thành phố đi, đến và ngày bay.',
  elStepBookTitle: 'Đặt ngay',
  elStepBookBody: 'Xác nhận empty leg với chi phí thấp hơn nhiều so với charter thông thường.',
  elStepFlyTitle: 'Bay riêng',
  elStepFlyBody: 'Trải nghiệm cao cấp tương tự với mức giá ưu đãi.',
  blogsHeroDesc: 'Bài viết, hướng dẫn và câu chuyện về hàng không tư nhân.',
  newsHeroDesc: 'Tin tức và thông báo mới nhất từ JetVina.',
  blogsMetaDesc: 'Kiến thức và hướng dẫn du lịch hàng không tư nhân.',
  newsMetaDesc: 'Tin tức mới nhất từ JetVina.',
  videoMetaDesc: 'Video tour máy bay và điểm đến.',
  destinationsMetaDesc: 'Điểm đến máy bay riêng được tuyển chọn.',
  postNotFound: 'Không tìm thấy bài viết',
  articleNotFound: 'Không tìm thấy bài',
  postUnavailable: 'Bài viết này không còn khả dụng.',
  articleUnavailable: 'Bài này không còn khả dụng.',
  allBlogs: 'Tất cả blog',
  allNews: 'Tất cả tin',
  blogTag: 'Blog',
  newsTag: 'Tin tức',
  legalTag: 'Pháp lý',
  mediaTag: 'Media',
  destinationTag: 'Điểm đến',
  planNextFlight: 'Lên kế hoạch chuyến bay tiếp theo',
  planNextFlightSubtitle: 'Tìm máy bay khả dụng trên toàn cầu.',
  readyToFly: 'Sẵn sàng bay?',
  readyToFlySubtitle: 'Tìm máy bay cho hành trình sắp tới.',
  notFoundShort: 'Không tìm thấy',
  videoHeroDesc: 'Khám phá đội bay, điểm đến và sự kiện qua video.',
  featuredVideos: 'Video nổi bật',
  featuredVideosSubtitle: 'Điểm nhấn từ sự kiện và tour máy bay JetVina.',
  watchVideo: 'Xem video →',
  videoViews: '{n} lượt xem',
  destinationsHubDesc: 'Khám phá hành trình được tuyển chọn bằng máy bay riêng.',
  searchFlightsTo: 'Tìm chuyến bay đến {city}',
  offerNotFound: 'Không tìm thấy ưu đãi',
  allEmptyLegsBack: 'Tất cả empty leg',
  emptyLegOfferTag: 'Empty leg',
  labelAircraft: 'Máy bay',
  labelDeparture: 'Khởi hành',
  labelPrice: 'Giá',
  labelDiscount: 'giảm giá',
};

const zhCn: Catalog = {
  ...en,
  menu: '菜单',
  login: '登录',
  register: '注册',
  account: '我的账户',
  logout: '退出',
  getQuote: '获取报价',
  bookNow: '立即预订',
  searchFlights: '搜索航班',
  contactUs: '联系我们',
  myAccount: '我的账户',
  overview: '概览',
  myQuotes: '我的报价',
  jetCard: '喷气机卡',
  travelCredits: '旅行积分',
  payments: '付款',
  documents: '文件',
  newsletter: '订阅新闻通讯',
  services: '服务',
  company: '公司',
  from: '出发',
  to: '到达',
  departure: '出发日期',
  passengers: '乘客',
  searchAircraft: '搜索可用飞机',
  searching: '正在搜索飞机…',
  requestQuoteBtn: '请求报价',
  quoteConsentLabel: '我同意就此次包机请求与我联系。',
  quoteEmailRequired: '请求报价需要填写邮箱。',
  quoteSearchFirst: '请先搜索飞机，再请求报价。',
  noAircraftFound: '没有符合乘客人数的飞机适用于此航线。',
  emptyLegDepartLabel: '出发',
  availableAircraft: '可用飞机',
  bookRoute: '预订此航线',
  loading: '处理中…',
  readMore: '阅读更多',
  latestNews: '最新资讯',
  noNewsTitle: '暂无新闻',
  noNewsDesc: '请稍后查看私人航空、机队扩展和独家优惠的最新动态。',
  noNewsCta: '获取包机报价',
  viewAll: '查看全部',
  skipToContent: '跳到主要内容',
  heroTitle: '全球私人飞机包机：全球私人航空服务',
  heroSubtitle: '无缝、可信赖的全球私人航空接入。',
  securePayment: '安全支付',
  concierge24: '24/7全球礼宾支持',
  premiumAircraft: '高端飞机',
  oneWay: '单程',
  roundTrip: '往返',
  multiCity: '多城',
  leg: '航段',
  returnDate: '返程日期',
  addLeg: '添加航段',
  emailOptional: '邮箱（可选）',
  phoneOptional: '电话（可选）',
  departurePlaceholder: '出发城市或机场',
  destinationPlaceholder: '目的地城市或机场',
  upToPax: '最多 {n} 人',
  swapAirports: '交换机场',
  decreasePax: '减少乘客',
  increasePax: '增加乘客',
  emailPlaceholder: '您的邮箱',
  subscribe: '订阅',
  subscribing: '…',
  subscriptionFailed: '订阅失败',
  emailAriaLabel: '电子邮箱',
  popularRoutes: '热门航线',
  allFixedPriceRoutes: '全部固定价格航线',
  fixedPricePageTitle: '固定价格包机航线',
  fixedPricePageDesc: '在全球热门航线上享受价格确定性。',
  fixedPriceMetaDesc: '透明固定价格私人飞机航线。',
  pricingOnRequest: '价格面议',
  categoryJets: '{category} 型喷气机',
  upToPassengers: '最多 {n} 位乘客',
  fixedPriceRouteAlt: '固定价格航线',
  viewAllFixedPriceRoutes: '查看全部固定价格航线 →',
  routeNotFound: '未找到航线',
  allRoutes: '全部航线',
  routeUnavailable: '该航线已不再提供。',
  fixedPriceLabel: '固定价格',
  fixedPriceExcerpt: '从 {from} 至 {to} 的透明固定价格。热门航线价格有保障。',
  pricingTiers: '价格档位',
  pricingTiersSubtitle: '选择适合您团队规模的机型类别。',
  pricingOnRequestDetail: '价格面议 — 请联系礼宾获取报价。',
  whatsIncluded: '包含内容',
  whatsNotIncluded: '不包含内容',
  fpIncluded1: '飞机、机组及标准地面处理费用',
  fpIncluded2: '在私人航站楼（FBO）起降',
  fpIncluded3: 'JetVina 24/7 礼宾支持',
  fpNotIncluded1: '餐饮升级及地面交通',
  fpNotIncluded2: '国际处理及飞越许可（如适用）',
  fpNotIncluded3: '除冰、机库或过夜费用（如需要）',
  howBookingWorks: '预订流程',
  searchThisRoute: '搜索此航线',
  searchThisRouteSubtitle: '数分钟内获得定制报价。',
  fixedPriceRouteMetaDesc: '固定价格私人飞机包机航线。',
  allFixedPriceRoutesBack: '全部固定价格航线',
  getFixedPriceQuote: '获取固定价格报价',
  quoteError: '无法生成报价，请重试。',
  aircraftCategory: '机型',
  emailAddress: '电子邮箱',
  airportSelectRequired: '请从建议列表中选择出发和到达机场。',
  airportSearching: '正在搜索机场…',
  airportNoResults: '未找到机场 — 请尝试城市、国家或 IATA 代码（如 LBG、Paris）。',
  airportPickHint: '请从下方列表中选择机场。',
  nearMe: '附近机场',
  nearMeLocating: '正在定位附近机场…',
  nearMeDenied: '未获位置权限 — 请改用城市搜索。',
  nearMeNone: '附近没有机场，请扩大搜索范围。',
  pricedWithOperator: '{operator} · {tail} · 基地 {base}',
  pricingBreakdown: '{summary}',
  processing: '处理中…',
  emptyLegsNearYou: '附近的空腿航班',
  emptyLegsSectionDesc: '限时私人飞机优惠特价',
  viewMoreEmptyLeg: '查看更多空腿航班 →',
  emptyLegsEmptyDesc: '目前没有空腿航班。请在下方订阅提醒。',
  emptyLegSubscribeTitle: '没有找到您的航线？订阅匹配的空腿提醒',
  getAlerts: '获取提醒',
  saving: '保存中…',
  subscribeFailed: '订阅失败',
  discountOff: '减 {n}%',
  tierOption: '{category} — USD {price}（{pax}）',
  deals: '优惠',
  emptyLegPageTitle: '空腿航班',
  emptyLegPageDesc: '限时私人飞机优惠——以更低价享受私人飞行。',
  emptyLegMetaDesc: '限时私人飞机优惠特价。',
  availableEmptyLegs: '可用空腿航班',
  howEmptyLegsWork: '空腿航班如何运作',
  elStepBrowseTitle: '浏览优惠',
  elStepBrowseBody: '实时浏览折扣单程空腿航班。',
  elStepSelectTitle: '选择航线',
  elStepSelectBody: '按出发城市、目的地和日期筛选。',
  elStepBookTitle: '即时预订',
  elStepBookBody: '以远低于标准包机的价格确认空腿航班。',
  elStepFlyTitle: '私人飞行',
  elStepFlyBody: '以优惠价格享受同样高端的飞行体验。',
  blogsHeroDesc: '私人航空领域的见解、指南与故事。',
  newsHeroDesc: 'JetVina 最新动态与公告。',
  blogsMetaDesc: '私人航空见解与旅行指南。',
  newsMetaDesc: 'JetVina 私人航空最新新闻。',
  videoMetaDesc: '飞机巡览与目的地视频。',
  destinationsMetaDesc: '精选全球私人飞机目的地。',
  postNotFound: '未找到文章',
  articleNotFound: '未找到新闻',
  postUnavailable: '该文章已不再提供。',
  articleUnavailable: '该新闻已不再提供。',
  allBlogs: '全部博客',
  allNews: '全部新闻',
  blogTag: '博客',
  newsTag: '新闻',
  legalTag: '法律',
  mediaTag: '媒体',
  destinationTag: '目的地',
  planNextFlight: '规划您的下一趟飞行',
  planNextFlightSubtitle: '搜索全球可用飞机。',
  readyToFly: '准备起飞？',
  readyToFlySubtitle: '为您的下一趟旅程搜索可用飞机。',
  notFoundShort: '未找到',
  videoHeroDesc: '通过视频探索机队、目的地与活动。',
  featuredVideos: '精选视频',
  featuredVideosSubtitle: 'JetVina 活动与飞机巡览精彩集锦。',
  watchVideo: '观看视频 →',
  videoViews: '{n} 次观看',
  destinationsHubDesc: '探索私人飞机精选行程。',
  searchFlightsTo: '搜索飞往 {city} 的航班',
  offerNotFound: '未找到优惠',
  allEmptyLegsBack: '全部空腿航班',
  emptyLegOfferTag: '空腿航班',
  labelAircraft: '飞机',
  labelDeparture: '出发',
  labelPrice: '价格',
  labelDiscount: '折扣',
};

const zhHk: Catalog = {
  ...zhCn,
  menu: '選單',
  account: '我的賬戶',
  myAccount: '我的賬戶',
  travelCredits: '旅行積分',
  documents: '文件',
  newsletter: '訂閱通訊',
  searchAircraft: '搜尋可用飛機',
  searching: '正在搜尋飛機…',
  requestQuoteBtn: '請求報價',
  quoteConsentLabel: '我同意就此次包機請求與我聯絡。',
  quoteEmailRequired: '請求報價需要填寫電郵。',
  quoteSearchFirst: '請先搜尋飛機，再請求報價。',
  noAircraftFound: '沒有符合乘客人數的飛機適用於此航線。',
  emptyLegDepartLabel: '出發',
  availableAircraft: '可用飛機',
  readMore: '閱讀更多',
  latestNews: '最新資訊',
  noNewsTitle: '暫無新聞',
  noNewsDesc: '請稍後查看私人航空、機隊擴展和獨家優惠的最新動態。',
  noNewsCta: '獲取包機報價',
  viewAll: '查看全部',
  skipToContent: '跳到主要內容',
  heroTitle: '全球私人飛機包機：全球私人航空服務',
  heroSubtitle: '無縫、可信賴的全球私人航空接入。',
  concierge24: '24/7全球禮賓支援',
  premiumAircraft: '高端飛機',
  roundTrip: '來回',
  multiCity: '多城',
  addLeg: '新增航段',
  departurePlaceholder: '出發城市或機場',
  destinationPlaceholder: '目的地城市或機場',
  swapAirports: '交換機場',
  emailPlaceholder: '您的電郵',
  subscribe: '訂閱',
  subscriptionFailed: '訂閱失敗',
  popularRoutes: '熱門航線',
  allFixedPriceRoutes: '全部固定價格航線',
  fixedPricePageTitle: '固定價格包機航線',
  fixedPricePageDesc: '在全球熱門航線上享受價格確定性。',
  viewAllFixedPriceRoutes: '查看全部固定價格航線 →',
  pricingOnRequest: '價格面議',
  categoryJets: '{category} 型噴氣機',
  upToPassengers: '最多 {n} 位乘客',
  whatsIncluded: '包含內容',
  whatsNotIncluded: '不包含內容',
  howBookingWorks: '預訂流程',
  emptyLegsNearYou: '附近的空腿航班',
  emptyLegsSectionDesc: '限時私人飛機優惠特價',
  viewMoreEmptyLeg: '查看更多空腿航班 →',
  getAlerts: '獲取提醒',
  deals: '優惠',
  emptyLegPageTitle: '空腿航班',
  availableEmptyLegs: '可用空腿航班',
  allEmptyLegsBack: '全部空腿航班',
  planNextFlight: '規劃您的下一趟飛行',
  readyToFly: '準備起飛？',
};

const zhTw: Catalog = {
  ...zhHk,
  account: '我的帳戶',
  myAccount: '我的帳戶',
  documents: '文件',
  newsletter: '訂閱電子報',
  searchAircraft: '搜尋可用飛機',
  emailPlaceholder: '您的電子郵件',
  subscribe: '訂閱',
  popularRoutes: '熱門航線',
  allFixedPriceRoutes: '全部固定價格航線',
};

function withEn(overrides: Record<string, string>): Catalog {
  return { ...en, ...overrides } as Catalog;
}

function tourismCatalog(code: string): Catalog {
  return withEn({
    ...(TOURISM_MESSAGE_OVERRIDES[code] ?? {}),
    ...(PRODUCT_UI_BY_LANG[code] ?? {}),
  });
}

const CATALOG_BY_DB: Record<string, Catalog> = {
  en,
  vi,
  'zh-cn': zhCn,
  'zh-hk': zhHk,
  'zh-tw': zhTw,
  ja: tourismCatalog('ja'),
  ko: tourismCatalog('ko'),
  th: tourismCatalog('th'),
  id: tourismCatalog('id'),
  fr: tourismCatalog('fr'),
  de: tourismCatalog('de'),
  es: tourismCatalog('es'),
  it: tourismCatalog('it'),
  ru: tourismCatalog('ru'),
  ar: tourismCatalog('ar'),
};

export function t(webLocale: string, key: MessageKey, vars?: Record<string, string | number>): string {
  const db = toDbLocale(webLocale);
  const catalog = CATALOG_BY_DB[db] ?? en;
  let text = catalog[key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
