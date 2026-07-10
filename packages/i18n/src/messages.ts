import { toDbLocale } from './registry';

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
  | 'availableAircraft'
  | 'bookRoute'
  | 'loading'
  | 'readMore'
  | 'viewAll';

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
  availableAircraft: 'Available Aircraft',
  bookRoute: 'Book this route',
  loading: 'Loading…',
  readMore: 'Read more',
  viewAll: 'View all',
};

const vi: Catalog = {
  ...en,
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
  availableAircraft: 'Máy bay khả dụng',
  bookRoute: 'Đặt tuyến này',
  loading: 'Đang xử lý…',
  readMore: 'Xem thêm',
  viewAll: 'Xem tất cả',
};

const zh: Catalog = {
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
  availableAircraft: '可用飞机',
  bookRoute: '预订此航线',
  loading: '处理中…',
  readMore: '阅读更多',
  viewAll: '查看全部',
};

const CATALOG_BY_DB: Record<string, Catalog> = {
  en,
  vi,
  'zh-cn': zh,
  'zh-hk': zh,
  'zh-tw': zh,
};

export function t(webLocale: string, key: MessageKey): string {
  const db = toDbLocale(webLocale);
  const catalog = CATALOG_BY_DB[db] ?? en;
  return catalog[key] ?? en[key] ?? key;
}
