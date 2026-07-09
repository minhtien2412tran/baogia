/** Lightweight UI strings — expand per locale as needed */

type MessageKey =
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
  | 'company';

const en: Record<MessageKey, string> = {
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
};

const vi: Record<MessageKey, string> = {
  menu: 'Menu',
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
  jetCard: 'Jet Card',
  travelCredits: 'Travel Credits',
  payments: 'Thanh toán',
  documents: 'Tài liệu',
  newsletter: 'Đăng ký nhận bản tin',
  services: 'Dịch vụ',
  company: 'Công ty',
};

const zh: Record<MessageKey, string> = {
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
};

const catalogs: Record<string, Partial<Record<MessageKey, string>>> = {
  'en-us': en,
  en: en,
  vi,
  'zh-cn': zh,
  'zh-hk': zh,
  'zh-tw': zh,
};

export function t(locale: string, key: MessageKey): string {
  const base = locale.split('-')[0] ?? 'en';
  return catalogs[locale]?.[key] ?? catalogs[base]?.[key] ?? en[key] ?? key;
}
