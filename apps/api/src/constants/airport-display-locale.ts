import { toDbLocale, type DbLocale } from '@jetbay/i18n';

export function normalizeSearchLocale(locale?: string): DbLocale {
  return toDbLocale(locale);
}

const COUNTRY_LABELS: Record<string, Partial<Record<DbLocale, string>>> = {
  Vietnam: {
    vi: 'Việt Nam',
    'zh-cn': '越南',
    'zh-hk': '越南',
    'zh-tw': '越南',
  },
  UK: { vi: 'Anh', 'zh-cn': '英国', 'zh-hk': '英國', 'zh-tw': '英國' },
  France: { vi: 'Pháp', 'zh-cn': '法国', 'zh-hk': '法國', 'zh-tw': '法國' },
  Switzerland: {
    vi: 'Thụy Sĩ',
    'zh-cn': '瑞士',
    'zh-hk': '瑞士',
    'zh-tw': '瑞士',
  },
  USA: { vi: 'Hoa Kỳ', 'zh-cn': '美国', 'zh-hk': '美國', 'zh-tw': '美國' },
  Germany: { vi: 'Đức', 'zh-cn': '德国', 'zh-hk': '德國', 'zh-tw': '德國' },
  Italy: { vi: 'Ý', 'zh-cn': '意大利', 'zh-hk': '意大利', 'zh-tw': '義大利' },
  Spain: {
    vi: 'Tây Ban Nha',
    'zh-cn': '西班牙',
    'zh-hk': '西班牙',
    'zh-tw': '西班牙',
  },
  Japan: { vi: 'Nhật Bản', 'zh-cn': '日本', 'zh-hk': '日本', 'zh-tw': '日本' },
  China: {
    vi: 'Trung Quốc',
    'zh-cn': '中国',
    'zh-hk': '中國',
    'zh-tw': '中國',
  },
  Singapore: {
    vi: 'Singapore',
    'zh-cn': '新加坡',
    'zh-hk': '新加坡',
    'zh-tw': '新加坡',
  },
  Thailand: {
    vi: 'Thái Lan',
    'zh-cn': '泰国',
    'zh-hk': '泰國',
    'zh-tw': '泰國',
  },
  UAE: { vi: 'UAE', 'zh-cn': '阿联酋', 'zh-hk': '阿聯酋', 'zh-tw': '阿聯酋' },
  'Hong Kong': {
    vi: 'Hồng Kông',
    'zh-cn': '香港',
    'zh-hk': '香港',
    'zh-tw': '香港',
  },
};

/** Per-IATA display overrides (city + airport name) */
const AIRPORT_LABELS: Record<
  string,
  Partial<Record<DbLocale, { city?: string; name?: string }>>
> = {
  SGN: {
    vi: { city: 'Tp. Hồ Chí Minh', name: 'Sân bay Tân Sơn Nhất' },
    'zh-cn': { city: '胡志明市', name: '新山一国际机场' },
    'zh-hk': { city: '胡志明市', name: '新山一國際機場' },
    'zh-tw': { city: '胡志明市', name: '新山一國際機場' },
  },
  HAN: {
    vi: { city: 'Hà Nội', name: 'Sân bay Nội Bài' },
    'zh-cn': { city: '河内', name: '内排国际机场' },
    'zh-hk': { city: '河內', name: '內排國際機場' },
    'zh-tw': { city: '河內', name: '內排國際機場' },
  },
  HUI: {
    vi: { city: 'Huế', name: 'Sân bay Phú Bài' },
    'zh-cn': { city: '顺化', name: '符牌国际机场' },
    'zh-hk': { city: '順化', name: '符牌國際機場' },
    'zh-tw': { city: '順化', name: '符牌國際機場' },
  },
  DAD: {
    vi: { city: 'Đà Nẵng', name: 'Sân bay Đà Nẵng' },
    'zh-cn': { city: '岘港', name: '岘港国际机场' },
    'zh-hk': { city: '峴港', name: '峴港國際機場' },
    'zh-tw': { city: '峴港', name: '峴港國際機場' },
  },
  CXR: {
    vi: { city: 'Nha Trang', name: 'Sân bay Cam Ranh' },
    'zh-cn': { city: '芽庄', name: '金兰国际机场' },
    'zh-hk': { city: '芽莊', name: '金蘭國際機場' },
    'zh-tw': { city: '芽莊', name: '金蘭國際機場' },
  },
  LBG: {
    vi: { city: 'Paris', name: 'Sân bay Le Bourget' },
    'zh-cn': { city: '巴黎', name: '勒布尔歇机场' },
    'zh-hk': { city: '巴黎', name: '勒布爾歇機場' },
    'zh-tw': { city: '巴黎', name: '勒布爾歇機場' },
  },
  LTN: {
    vi: { city: 'London', name: 'Sân bay Luton' },
    'zh-cn': { city: '伦敦', name: '卢顿机场' },
    'zh-hk': { city: '倫敦', name: '盧頓機場' },
    'zh-tw': { city: '倫敦', name: '盧頓機場' },
  },
  NCE: {
    vi: { city: 'Nice', name: "Sân bay Nice Côte d'Azur" },
    'zh-cn': { city: '尼斯', name: '蔚蓝海岸机场' },
    'zh-hk': { city: '尼斯', name: '蔚藍海岸機場' },
    'zh-tw': { city: '尼斯', name: '蔚藍海岸機場' },
  },
  TEB: {
    vi: { city: 'New York', name: 'Sân bay Teterboro' },
    'zh-cn': { city: '纽约', name: '泰特伯勒机场' },
    'zh-hk': { city: '紐約', name: '泰特伯勒機場' },
    'zh-tw': { city: '紐約', name: '泰特伯勒機場' },
  },
  DXB: {
    vi: { city: 'Dubai', name: 'Sân bay Dubai' },
    'zh-cn': { city: '迪拜', name: '迪拜国际机场' },
    'zh-hk': { city: '杜拜', name: '杜拜國際機場' },
    'zh-tw': { city: '杜拜', name: '杜拜國際機場' },
  },
  SIN: {
    vi: { city: 'Singapore', name: 'Sân bay Changi' },
    'zh-cn': { city: '新加坡', name: '樟宜机场' },
    'zh-hk': { city: '新加坡', name: '樟宜機場' },
    'zh-tw': { city: '新加坡', name: '樟宜機場' },
  },
  BKK: {
    vi: { city: 'Bangkok', name: 'Sân bay Suvarnabhumi' },
    'zh-cn': { city: '曼谷', name: '素万那普机场' },
    'zh-hk': { city: '曼谷', name: '素萬那普機場' },
    'zh-tw': { city: '曼谷', name: '素萬那普機場' },
  },
  HKG: {
    vi: { city: 'Hồng Kông', name: 'Sân bay Quốc tế Hồng Kông' },
    'zh-cn': { city: '香港', name: '香港国际机场' },
    'zh-hk': { city: '香港', name: '香港國際機場' },
    'zh-tw': { city: '香港', name: '香港國際機場' },
  },
  NRT: {
    vi: { city: 'Tokyo', name: 'Sân bay Narita' },
    'zh-cn': { city: '东京', name: '成田国际机场' },
    'zh-hk': { city: '東京', name: '成田國際機場' },
    'zh-tw': { city: '東京', name: '成田國際機場' },
  },
  HND: {
    vi: { city: 'Tokyo', name: 'Sân bay Haneda' },
    'zh-cn': { city: '东京', name: '羽田机场' },
    'zh-hk': { city: '東京', name: '羽田機場' },
    'zh-tw': { city: '東京', name: '羽田機場' },
  },
};

export function formatAirportDisplay(
  airport: { iata: string; city: string; country: string; name: string },
  locale?: string,
): { city: string; country: string; name: string; label: string } {
  const dbLocale = normalizeSearchLocale(locale);
  const iata = airport.iata.toUpperCase();
  const overrides = AIRPORT_LABELS[iata]?.[dbLocale];

  const city = overrides?.city ?? airport.city;
  const country =
    COUNTRY_LABELS[airport.country]?.[dbLocale] ?? airport.country;
  const name = overrides?.name ?? airport.name;
  const label = `${city}, ${country} (${iata}) — ${name}`;

  return { city, country, name, label };
}
