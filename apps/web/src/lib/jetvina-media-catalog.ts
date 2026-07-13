/**
 * Curated JetVina media from https://jetvina.com/ (WP media library).
 * Prefer these over blocked legacy CDN mirrors / SVG demos when PREFER_JETVINA_MEDIA is on.
 * Rights: CLIENT_DIRECTED staging — see public/assets/jetvina/RIGHTS.md
 */

export const JETVINA_MEDIA = {
  aircraft: [
    'https://jetvina.com/wp-content/uploads/2024/08/flyprivatejet-flugzeuge-global60001.jpg',
    'https://jetvina.com/wp-content/uploads/2025/11/Bombardier-Global-7500.jpg',
    'https://jetvina.com/wp-content/uploads/2025/10/Phenom-300-Ext-JS.jpg',
    'https://jetvina.com/wp-content/uploads/2025/09/embraer-legacy-450web.jpg',
    'https://jetvina.com/wp-content/uploads/2025/07/praetor-300.jpg',
    'https://jetvina.com/wp-content/uploads/2024/09/Embraer_Legacy_650_exterior2.jpg',
    'https://jetvina.com/wp-content/uploads/2024/10/single-charter-main-image-11.jpg',
    'https://jetvina.com/wp-content/uploads/2026/05/Challenger-300-2021-exterior.jpeg',
    'https://jetvina.com/wp-content/uploads/2024/10/gulfstream-v-7.jpg',
    'https://jetvina.com/wp-content/uploads/2025/01/Global-5000-Phu-Quoc-1.jpg',
    'https://jetvina.com/wp-content/uploads/2025/08/Boeing-Business-Jet-Charter.jpg',
    'https://jetvina.com/wp-content/uploads/2024/08/challenger-650-oh-wiw-plane-heroimage-jetflite-1920x1067-1.jpg',
  ],
  cabin: [
    'https://jetvina.com/wp-content/uploads/2024/08/Global-6000-Interior-1024x576-1.jpeg',
    'https://jetvina.com/wp-content/uploads/2024/08/02-BOMBARDIER-GLOBAL-6000.jpg',
    'https://jetvina.com/wp-content/uploads/2024/08/9_799.jpg',
    'https://jetvina.com/wp-content/uploads/2026/05/cabin-rear-view-of-challenger-300.webp',
    'https://jetvina.com/wp-content/uploads/2025/05/Embraer-Lineage-1000-Cabin-2.jpg',
    'https://jetvina.com/wp-content/uploads/2024/10/c605interior2.jpg',
    'https://jetvina.com/wp-content/uploads/2024/08/N3MR-Global-5000-5.jpg',
    'https://jetvina.com/wp-content/uploads/2024/09/interior-one.jpg',
  ],
  destination: [
    'https://jetvina.com/wp-content/uploads/2026/02/Phu-quoc-1.jpg',
    'https://jetvina.com/wp-content/uploads/2026/03/Park-Hyatt-Phu-Quoc.jpg',
    'https://jetvina.com/wp-content/uploads/2026/05/thi-tran-hoang-hon-sunset-town-08-1734320364.jpg',
    'https://jetvina.com/wp-content/uploads/2026/06/royal-muang-samui-villas.jpg',
    'https://jetvina.com/wp-content/uploads/2026/02/Thuong-Hai.jpg',
    'https://jetvina.com/wp-content/uploads/2026/07/du-lich-dai-bac-4.jpg',
    'https://jetvina.com/wp-content/uploads/2025/05/san-bay-phu-quoc.webp',
    'https://jetvina.com/wp-content/uploads/2026/06/yllas-chatles2-1-1422x800-1.jpg',
  ],
  hero: [
    'https://jetvina.com/wp-content/uploads/2024/08/flyprivatejet-flugzeuge-global60001.jpg',
    'https://jetvina.com/wp-content/uploads/2024/08/DDBA1287_Factsheets2024_7500_S6A0583_V1-web-new-hero-banner-2700x1203-1.jpg',
    'https://jetvina.com/wp-content/uploads/2024/08/N3MR-Global-5000-6.jpg',
    'https://jetvina.com/wp-content/uploads/2025/11/Bombardier-Global-7500.jpg',
  ],
  news: [
    'https://jetvina.com/wp-content/uploads/2025/05/Wajer-Yachts-Private-JEt.jpg',
    'https://jetvina.com/wp-content/uploads/2026/06/maxresdefault.jpg',
    'https://jetvina.com/wp-content/uploads/2025/11/hq720.jpg',
    'https://jetvina.com/wp-content/uploads/2026/02/Phu-quoc-1.jpg',
    'https://jetvina.com/wp-content/uploads/2025/07/vistajet-x-wimbledon-2025.jpg',
  ],
  service: [
    'https://jetvina.com/wp-content/uploads/2025/11/aircargo-16486959481991179773647.jpg',
    'https://jetvina.com/wp-content/uploads/2025/11/khai-thac-hang-khong-1.jpg',
    'https://jetvina.com/wp-content/uploads/2025/06/Thien-Xuan-Airport-Fast-Track-Services-2024-03-scaled-1.jpg',
    'https://jetvina.com/wp-content/uploads/2025/06/Dich-vu-Don-khach-tai-Ga-Quoc-te-San-bay-Quoc-te-Tan-Son-Nhat-hoac-Noi-Bai-Goi-thuong-gia-7_17052024101834.jpg',
    'https://jetvina.com/wp-content/uploads/2024/08/Global6000_Time_specious.jpg',
  ],
  membership: ['https://jetvina.com/wp-content/uploads/2024/08/1.png'],
  map: [
    'https://jetvina.com/wp-content/uploads/2026/03/sanh-di-nha-ga-t2-cang-hkqt-phu-quoc.jpg',
    'https://jetvina.com/wp-content/uploads/2025/05/san-bay-phu-quoc.webp',
    'https://jetvina.com/wp-content/uploads/2026/05/Mount-Airy-Airport-2.jpg',
  ],
} as const;

export type JetvinaMediaKind = keyof typeof JETVINA_MEDIA;
