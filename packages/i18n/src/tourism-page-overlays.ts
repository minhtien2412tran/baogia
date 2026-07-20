import type { DbLocale } from './registry';

export type PageTextOverlay = {
  title?: string;
  description?: string;
  hero?: string;
  tag?: string;
  cta?: { label?: string };
  sections?: Array<{ heading?: string; body?: string; bullets?: string[] }>;
  features?: Array<{ title?: string; body?: string }>;
  steps?: Array<{ title?: string; body?: string }>;
};

type TourMap = Partial<Record<DbLocale, PageTextOverlay>>;

/** Compact tourism title packs — hero/tag/cta only (bodies stay EN until CMS). */
function tour(
  rows: Record<
    string,
    [title: string, description: string, hero: string, tag: string, cta: string]
  >,
): TourMap {
  const out: TourMap = {};
  for (const [lang, [title, description, hero, tag, cta]] of Object.entries(rows)) {
    out[lang as DbLocale] = {
      title,
      description,
      hero,
      tag,
      cta: { label: cta },
    };
  }
  return out;
}

/** Tourism overlays for service pages (excl. private-jet-charter — already in pages-i18n). */
export const TOURISM_PAGE_OVERLAYS: Record<string, TourMap> = {
  'corporate-air-charter': tour({
    ja: ['コーポレートチャーター', 'チーム・ロードショー・緊急出張向けプライベート航空。', '企業スケジュールに合わせたポイント・ツー・ポイント飛行。', 'チャーター', 'コーポレート見積もり'],
    ko: ['기업 전세기', '팀·로드쇼·긴급 출장을 위한 이그제큐티브 항공.', '기업 일정에 맞춘 포인트 투 포인트 비행.', '전세기', '기업 견적 요청'],
    th: ['เช่าเหมาลำองค์กร', 'การบินส่วนตัวสำหรับทีม โรดโชว์ และงานด่วน', 'เที่ยวบินจุดต่อจุดตามตารางองค์กร', 'เช่าเหมาลำ', 'ขอใบเสนอราคาองค์กร'],
    id: ['Charter korporat', 'Penerbangan eksekutif untuk tim, roadshow, dan perjalanan mendesak.', 'Penerbangan point-to-point sesuai jadwal bisnis.', 'Charter', 'Minta penawaran korporat'],
    fr: ['Charter d’entreprise', 'Aviation privée pour équipes, roadshows et déplacements urgents.', 'Vols point à point selon l’agenda corporate.', 'Charter', 'Demander un devis corporate'],
    de: ['Corporate Charter', 'Privatflug für Teams, Roadshows und dringende Geschäftsreisen.', 'Punkt-zu-Punkt-Flüge nach Unternehmensplan.', 'Charter', 'Corporate-Angebot anfordern'],
    es: ['Chárter corporativo', 'Aviación privada para equipos, roadshows y viajes urgentes.', 'Vuelos punto a punto según agenda empresarial.', 'Chárter', 'Solicitar cotización corporativa'],
    it: ['Charter aziendale', 'Aviazione privata per team, roadshow e viaggi urgenti.', 'Voli point-to-point secondo l’agenda corporate.', 'Charter', 'Richiedi preventivo corporate'],
    ru: ['Корпоративный чартер', 'Частная авиация для команд, роудшоу и срочных поездок.', 'Рейсы точка–точка по корпоративному графику.', 'Чартер', 'Запросить корпоративное предложение'],
    ar: ['تأجير الشركات', 'طيران خاص للفرق والجولات والرحلات العاجلة.', 'رحلات نقطة إلى نقطة وفق جدول الأعمال.', 'تأجير', 'طلب عرض أسعار للشركات'],
  }),
  'group-air-charter': tour({
    ja: ['グループチャーター', 'スポーツチーム・代表団・結婚式・大人数向け。', 'グループ全員が同じ便で移動。', 'チャーター', 'グループチャーターを計画'],
    ko: ['그룹 전세기', '스포츠 팀·대표단·결혼식·대규모 그룹용.', '그룹 전체가 함께 이동.', '전세기', '그룹 전세기 계획'],
    th: ['เช่าเหมาลำกลุ่ม', 'ทีมกีฬา คณะผู้แทน งานแต่ง และกลุ่มใหญ่', 'ทั้งกลุ่มเดินทางพร้อมกัน', 'เช่าเหมาลำ', 'วางแผนเช่ากลุ่ม'],
    id: ['Charter grup', 'Untuk tim olahraga, delegasi, pernikahan, dan grup besar.', 'Seluruh grup berangkat bersama.', 'Charter', 'Rencanakan charter grup'],
    fr: ['Charter de groupe', 'Équipes sportives, délégations, mariages et grands groupes.', 'Tout le groupe voyage ensemble.', 'Charter', 'Planifier un charter groupe'],
    de: ['Gruppencharter', 'Sportteams, Delegationen, Hochzeiten und große Gruppen.', 'Die ganze Gruppe reist gemeinsam.', 'Charter', 'Gruppencharter planen'],
    es: ['Chárter de grupo', 'Equipos, delegaciones, bodas y grupos grandes.', 'Todo el grupo viaja junto.', 'Chárter', 'Planificar chárter de grupo'],
    it: ['Charter di gruppo', 'Squadre, delegazioni, matrimoni e grandi gruppi.', 'Tutto il gruppo viaggia insieme.', 'Charter', 'Pianifica charter di gruppo'],
    ru: ['Групповой чартер', 'Спорткоманды, делегации, свадьбы и большие группы.', 'Вся группа летит вместе.', 'Чартер', 'Спланировать групповой чартер'],
    ar: ['تأجير جماعي', 'للفرق والوفود والأعراس والمجموعات الكبيرة.', 'المجموعة بأكملها تسافر معًا.', 'تأجير', 'تخطيط تأجير جماعي'],
  }),
  'event-air-charter': tour({
    ja: ['イベントチャーター', 'コンサート・フェス・スポーツ・VIPイベント向け。', '時間どおり、スタイルよく到着。', 'チャーター', 'イベント用にチャーター'],
    ko: ['이벤트 전세기', '콘서트·페스티벌·스포츠·VIP 행사.', '정시에 스타일 있게 도착.', '전세기', '이벤트용 전세기'],
    th: ['เช่าเหมาลำอีเวนต์', 'คอนเสิร์ต เทศกาล กีฬา และอีเวนต์ VIP', 'ถึงตรงเวลาอย่างมีสไตล์', 'เช่าเหมาลำ', 'เช่าสำหรับอีเวนต์'],
    id: ['Charter acara', 'Konser, festival, olahraga, dan acara VIP.', 'Tiba tepat waktu dengan gaya.', 'Charter', 'Charter untuk acara Anda'],
    fr: ['Charter événementiel', 'Concerts, festivals, sport et événements VIP.', 'Arrivez à l’heure, avec style.', 'Charter', 'Charter pour votre événement'],
    de: ['Event-Charter', 'Konzerte, Festivals, Sport und VIP-Events.', 'Pünktlich und stilvoll ankommen.', 'Charter', 'Für Ihr Event chartern'],
    es: ['Chárter para eventos', 'Conciertos, festivales, deporte y eventos VIP.', 'Llegue a tiempo y con estilo.', 'Chárter', 'Chárter para su evento'],
    it: ['Charter per eventi', 'Concerti, festival, sport ed eventi VIP.', 'Arrivo puntuale e con stile.', 'Charter', 'Charter per il tuo evento'],
    ru: ['Чартер на мероприятия', 'Концерты, фестивали, спорт и VIP-события.', 'Прибытие вовремя и со стилем.', 'Чартер', 'Чартер на ваше мероприятие'],
    ar: ['تأجير للفعاليات', 'حفلات ومهرجانات ورياضة وفعاليات VIP.', 'وصول في الموعد وبأسلوب راقٍ.', 'تأجير', 'تأجير لفعاليتك'],
  }),
  'pet-travel': tour({
    ja: ['ペット同伴フライト', 'あなたとペットのための安全で快適なプライベート飛行。', 'ペットは客室であなたと一緒に。', 'チャーター', 'ペット対応フライトを予約'],
    ko: ['반려동물 동반 비행', '당신과 반려동물을 위한 안전하고 편안한 전용 비행.', '반려동물이 객실에서 함께 탑승.', '전세기', '반려동물 친화 항공편 예약'],
    th: ['เดินทางกับสัตว์เลี้ยง', 'บินส่วนตัวปลอดภัย สบายสำหรับคุณและสัตว์เลี้ยง', 'สัตว์เลี้ยงบินในห้องโดยสารกับคุณ', 'เช่าเหมาลำ', 'จองเที่ยวบินที่เป็นมิตรกับสัตว์'],
    id: ['Perjalanan hewan peliharaan', 'Penerbangan pribadi aman dan nyaman untuk Anda dan hewan.', 'Hewan terbang di kabin bersama Anda.', 'Charter', 'Pesan penerbangan ramah hewan'],
    fr: ['Voyage avec animaux', 'Vol privé sûr et confortable pour vous et votre animal.', 'Votre animal voyage en cabine avec vous.', 'Charter', 'Réserver un vol pet-friendly'],
    de: ['Reisen mit Haustieren', 'Sicherer, komfortabler Privatflug für Sie und Ihr Tier.', 'Ihr Haustier fliegt mit Ihnen in der Kabine.', 'Charter', 'Haustierfreundlichen Flug buchen'],
    es: ['Viaje con mascotas', 'Vuelo privado seguro y cómodo para usted y su mascota.', 'Su mascota vuela en cabina con usted.', 'Chárter', 'Reservar vuelo pet-friendly'],
    it: ['Viaggio con animali', 'Volo privato sicuro e confortevole per te e il tuo animale.', 'Il tuo animale vola in cabina con te.', 'Charter', 'Prenota volo pet-friendly'],
    ru: ['Путешествие с питомцами', 'Безопасный комфортный частный рейс для вас и питомца.', 'Питомец летит с вами в салоне.', 'Чартер', 'Забронировать pet-friendly рейс'],
    ar: ['السفر مع الحيوانات', 'رحلة خاصة آمنة ومريحة لك ولحيوانك.', 'حيوانك يسافر معك في المقصورة.', 'تأجير', 'حجز رحلة صديقة للحيوانات'],
  }),
  'air-ambulance': tour({
    ja: ['エアアンビュランス — 医療航空支援', '24時間対応の医療搬送・救急航空。', '1分が重要なとき、SOSチームが世界の転院を調整。', '緊急', 'エアアンビュランスを依頼'],
    ko: ['에어 앰뷸런스 — 의료 항공 지원', '24시간 의료 이송·응급 항공.', '매분이 중요할 때 SOS팀이 전 세계 이송을 조율.', '긴급', '에어 앰뷸런스 요청'],
    th: ['แอร์แอมบูแลนซ์ — สนับสนุนการแพทย์ทางอากาศ', 'อพยพทางการแพทย์และฉุกเฉิน 24/7', 'เมื่อทุกนาทีสำคัญ ทีม SOS ประสานการส่งต่อทั่วโลก', 'ฉุกเฉิน', 'ขอแอร์แอมบูแลนซ์'],
    id: ['Air Ambulance — dukungan medis udara', 'Evakuasi medis dan darurat udara 24/7.', 'Saat setiap menit berarti, tim SOS mengoordinasikan transfer global.', 'Darurat', 'Minta Air Ambulance'],
    fr: ['Air Ambulance — soutien médical aérien', 'Évacuation médicale et urgences aériennes 24h/24.', 'Quand chaque minute compte, l’équipe SOS coordonne les transferts mondiaux.', 'Urgence', 'Demander Air Ambulance'],
    de: ['Air Ambulance — medizinische Luftunterstützung', 'Medizinische Evakuierung und Luftnotfall 24/7.', 'Wenn jede Minute zählt, koordiniert das SOS-Team globale Verlegungen.', 'Notfall', 'Air Ambulance anfordern'],
    es: ['Air Ambulance — apoyo médico aéreo', 'Evacuación médica y emergencias aéreas 24/7.', 'Cuando cada minuto cuenta, el equipo SOS coordina traslados globales.', 'Emergencia', 'Solicitar Air Ambulance'],
    it: ['Air Ambulance — supporto medico aereo', 'Evacuazione medica e emergenze aeree 24/7.', 'Quando ogni minuto conta, il team SOS coordina i trasferimenti globali.', 'Emergenza', 'Richiedi Air Ambulance'],
    ru: ['Air Ambulance — медицинская авиаподдержка', 'Медэвакуация и авиаэкстренная помощь 24/7.', 'Когда каждая минута важна, команда SOS координирует глобальные переводы.', 'Срочно', 'Запросить Air Ambulance'],
    ar: ['الإسعاف الجوي — دعم طبي جوي', 'إخلاء طبي وطوارئ جوية على مدار الساعة.', 'عندما تهم كل دقيقة ينسق فريق SOS النقل العالمي.', 'طارئ', 'طلب الإسعاف الجوي'],
  }),
  'booking-process': tour({
    ja: ['予約プロセス', 'JetVinaプライベートジェットチャーターガイド。', '検索から離陸まで、4つのシンプルなステップ。', 'ガイド', '検索を開始'],
    ko: ['예약 절차', 'JetVina 프라이빗 제트 전세기 가이드.', '검색부터 이륙까지 네 단계.', '가이드', '검색 시작'],
    th: ['ขั้นตอนการจอง', 'คู่มือเช่าเหมาลำเจ็ตส่วนตัวกับ JetVina', 'จากค้นหาถึงขึ้นบินในสี่ขั้นตอน', 'คู่มือ', 'เริ่มค้นหา'],
    id: ['Proses pemesanan', 'Panduan charter jet pribadi JetVina.', 'Dari pencarian hingga lepas landas dalam empat langkah.', 'Panduan', 'Mulai pencarian'],
    fr: ['Processus de réservation', 'Guide du charter jet privé JetVina.', 'De la recherche au décollage en quatre étapes.', 'Guide', 'Commencer la recherche'],
    de: ['Buchungsprozess', 'Leitfaden für JetVina Privatjet-Charter.', 'Von der Suche zum Abflug in vier Schritten.', 'Leitfaden', 'Suche starten'],
    es: ['Proceso de reserva', 'Guía de chárter de jet privado JetVina.', 'De la búsqueda al despegue en cuatro pasos.', 'Guía', 'Empezar búsqueda'],
    it: ['Processo di prenotazione', 'Guida al charter jet privato JetVina.', 'Dalla ricerca al decollo in quattro passi.', 'Guida', 'Inizia la ricerca'],
    ru: ['Процесс бронирования', 'Гид по частному джет-чартеру JetVina.', 'От поиска до взлёта за четыре шага.', 'Гид', 'Начать поиск'],
    ar: ['عملية الحجز', 'دليل تأجير الطائرات الخاصة من JetVina.', 'من البحث إلى الإقلاع في أربع خطوات.', 'دليل', 'ابدأ البحث'],
  }),
  'global-partnership-program': tour({
    ja: ['グローバルパートナープログラム', 'JetVina紹介ネットワークに参加 — 航空経験不要。', '顧客を紹介し、コミッションを獲得。', 'パートナー', 'パートナーになる'],
    ko: ['글로벌 파트너 프로그램', 'JetVina 추천 네트워크 참여 — 항공 경험 불필요.', '고객을 추천하고 수수료를 받으세요.', '파트너', '파트너 되기'],
    th: ['โปรแกรมพาร์ทเนอร์ระดับโลก', 'เข้าร่วมเครือข่ายแนะนำ JetVina — ไม่ต้องมีประสบการณ์การบิน', 'แนะนำลูกค้า รับค่าคอมมิชชัน', 'พาร์ทเนอร์', 'เป็นพาร์ทเนอร์'],
    id: ['Program mitra global', 'Bergabung dengan jaringan rujukan JetVina — tanpa pengalaman aviasi.', 'Rujuk klien, dapatkan komisi.', 'Mitra', 'Menjadi mitra'],
    fr: ['Programme partenaires mondial', 'Rejoignez le réseau de parrainage JetVina — aucune expérience aviation requise.', 'Parrainez des clients, gagnez des commissions.', 'Partenaire', 'Devenir partenaire'],
    de: ['Globales Partnerprogramm', 'Treten Sie dem JetVina-Empfehlungsnetzwerk bei — keine Luftfahrterfahrung nötig.', 'Kunden empfehlen, Provision verdienen.', 'Partner', 'Partner werden'],
    es: ['Programa de socios globales', 'Únase a la red de referidos JetVina — sin experiencia aeronáutica.', 'Refiera clientes y gane comisiones.', 'Socio', 'Convertirse en socio'],
    it: ['Programma partner globale', 'Unisciti alla rete referral JetVina — nessuna esperienza aviation richiesta.', 'Segnala clienti e guadagna commissioni.', 'Partner', 'Diventa partner'],
    ru: ['Глобальная партнёрская программа', 'Присоединяйтесь к реферальной сети JetVina — опыт в авиации не нужен.', 'Приводите клиентов, получайте комиссию.', 'Партнёр', 'Стать партнёром'],
    ar: ['برنامج الشراكة العالمية', 'انضم إلى شبكة إحالة JetVina — دون خبرة طيران.', 'أحِل العملاء واحصل على عمولات.', 'شريك', 'كن شريكًا'],
  }),
  'jetbay-private-jet-app': tour({
    ja: ['プライベートジェットアプリ', 'モバイルでプライベートフライトを予約・管理。', 'ルート検索、見積もり追跡、旅程管理。', 'アプリ', 'App Storeでダウンロード'],
    ko: ['프라이빗 제트 앱', '모바일에서 전용 항공편 예약·관리.', '노선 검색, 견적 추적, 일정 관리.', '앱', 'App Store에서 다운로드'],
    th: ['แอปเจ็ตส่วนตัว', 'จองและจัดการเที่ยวบินส่วนตัวบนมือถือ', 'ค้นหาเส้นทาง ติดตามใบเสนอราคา จัดการทริป', 'แอป', 'ดาวน์โหลดบน App Store'],
    id: ['Aplikasi jet pribadi', 'Pesan dan kelola penerbangan pribadi di ponsel.', 'Cari rute, lacak penawaran, kelola perjalanan.', 'Aplikasi', 'Unduh di App Store'],
    fr: ['Application jet privé', 'Réservez et gérez vos vols privés sur mobile.', 'Recherchez des routes, suivez les devis, gérez les voyages.', 'App', 'Télécharger sur l’App Store'],
    de: ['Privatjet-App', 'Privatflüge mobil buchen und verwalten.', 'Routen suchen, Angebote verfolgen, Reisen verwalten.', 'App', 'Im App Store laden'],
    es: ['App de jet privado', 'Reserve y gestione vuelos privados en el móvil.', 'Busque rutas, siga cotizaciones y gestione viajes.', 'App', 'Descargar en App Store'],
    it: ['App jet privato', 'Prenota e gestisci voli privati sul mobile.', 'Cerca rotte, segui preventivi, gestisci i viaggi.', 'App', 'Scarica sull’App Store'],
    ru: ['Приложение частного джета', 'Бронируйте и управляйте частными рейсами на мобильном.', 'Ищите маршруты, отслеживайте предложения, управляйте поездками.', 'Приложение', 'Скачать в App Store'],
    ar: ['تطبيق الطائرة الخاصة', 'احجز وأدر الرحلات الخاصة على الجوال.', 'ابحث عن المسارات وتتبع العروض وأدر الرحلات.', 'تطبيق', 'حمّل من App Store'],
  }),
  'world-cup-2026-private-jet-booking': tour({
    ja: ['ワールドカップ2026プライベートジェット予約', 'FIFAワールドカップ2026の全試合へプライベートジェットで。', '混雑を避け、北米開催都市へ直行。', 'キャンペーン', 'ワールドカップを計画'],
    ko: ['월드컵 2026 프라이빗 제트 예약', 'FIFA 월드컵 2026 모든 경기로 프라이빗 제트.', '혼잡을 피해 북미 개최 도시로 직항.', '캠페인', '월드컵 일정 계획'],
    th: ['จองเจ็ตส่วนตัว World Cup 2026', 'บินเจ็ตส่วนตัวไปทุกแมตช์ FIFA World Cup 2026', 'เลี่ยงฝูงชน — บินตรงสู่เมืองเจ้าภาพอเมริกาเหนือ', 'แคมเปญ', 'วางแผน World Cup'],
    id: ['Pemesanan jet pribadi Piala Dunia 2026', 'Terbang jet pribadi ke setiap pertandingan FIFA World Cup 2026.', 'Hindari kerumunan — terbang langsung ke kota tuan rumah NA.', 'Kampanye', 'Rencanakan Piala Dunia'],
    fr: ['Réservation jet privé Coupe du Monde 2026', 'Volez en jet privé vers chaque match de la FIFA World Cup 2026.', 'Évitez la foule — volez direct vers les villes hôtes d’Amérique du Nord.', 'Campagne', 'Planifier la Coupe du Monde'],
    de: ['WM 2026 Privatjet-Buchung', 'Mit dem Privatjet zu jedem FIFA-WM-2026-Spiel.', 'Menschenmassen meiden — Direktflug zu nordamerikanischen Gastgeberstädten.', 'Kampagne', 'WM planen'],
    es: ['Reserva jet privado Mundial 2026', 'Vuele en jet privado a cada partido del FIFA World Cup 2026.', 'Evite multitudes — vuele directo a ciudades anfitrionas de NA.', 'Campaña', 'Planificar el Mundial'],
    it: ['Prenotazione jet privato Mondiali 2026', 'Vola in jet privato a ogni partita della FIFA World Cup 2026.', 'Evita la folla — volo diretto alle città ospiti nordamericane.', 'Campagna', 'Pianifica i Mondiali'],
    ru: ['Бронирование джета на ЧМ-2026', 'Частный джет на каждый матч FIFA World Cup 2026.', 'Избегайте толпы — прямые рейсы в города-хозяева Северной Америки.', 'Кампания', 'Спланировать ЧМ'],
    ar: ['حجز طائرة خاصة لكأس العالم 2026', 'حلّ بطائرة خاصة إلى كل مباراة في كأس العالم 2026.', 'تجنّب الزحام — حلّ مباشرة إلى مدن الاستضافة في أمريكا الشمالية.', 'حملة', 'خطّط لكأس العالم'],
  }),
  'world-cup-final-2026-private-jet-charter': tour({
    ja: ['ワールドカップ2026決勝 — プライベートジェットチャーター', 'FIFAワールドカップ2026決勝へスタイルよく到着。', '世界最大の試合のためのプレミアムプライベート航空。', 'キャンペーン', '決勝の見積もりを依頼'],
    ko: ['월드컵 2026 결승 — 프라이빗 제트 전세기', 'FIFA 월드컵 2026 결승에 스타일 있게 도착.', '지구 최대 경기를 위한 프리미엄 전용 항공.', '캠페인', '결승 견적 요청'],
    th: ['ชิงชนะเลิศ World Cup 2026 — เช่าเจ็ตส่วนตัว', 'ถึงชิงชนะเลิศ FIFA World Cup 2026 อย่างมีสไตล์', 'การบินส่วนตัวระดับพรีเมียมสำหรับแมตช์ที่ยิ่งใหญ่ที่สุด', 'แคมเปญ', 'ขอใบเสนอราคาชิงชนะเลิศ'],
    id: ['Final Piala Dunia 2026 — charter jet pribadi', 'Tiba di final FIFA World Cup 2026 dengan gaya.', 'Penerbangan pribadi premium untuk pertandingan terbesar di dunia.', 'Kampanye', 'Minta penawaran final'],
    fr: ['Finale Coupe du Monde 2026 — charter jet privé', 'Arrivez à la finale FIFA World Cup 2026 avec style.', 'Aviation privée premium pour le plus grand match de la planète.', 'Campagne', 'Demander un devis finale'],
    de: ['WM-Finale 2026 — Privatjet-Charter', 'Stilvoll zum FIFA-WM-Finale 2026 ankommen.', 'Premium-Privatflug für das größte Spiel der Welt.', 'Kampagne', 'Finale-Angebot anfordern'],
    es: ['Final Mundial 2026 — chárter jet privado', 'Llegue con estilo a la final del FIFA World Cup 2026.', 'Aviación privada premium para el mayor partido del planeta.', 'Campaña', 'Solicitar cotización de la final'],
    it: ['Finale Mondiali 2026 — charter jet privato', 'Arriva con stile alla finale FIFA World Cup 2026.', 'Aviazione privata premium per la partita più grande del pianeta.', 'Campagna', 'Richiedi preventivo finale'],
    ru: ['Финал ЧМ-2026 — чартер частного джета', 'Прибудьте на финал FIFA World Cup 2026 со стилем.', 'Премиальная частная авиация для главного матча планеты.', 'Кампания', 'Запросить предложение на финал'],
    ar: ['نهائي كأس العالم 2026 — تأجير طائرة خاصة', 'صِل بأناقة إلى نهائي كأس العالم 2026.', 'طيران خاص فاخر لأعظم مباراة على الكوكب.', 'حملة', 'طلب عرض أسعار للنهائي'],
  }),
};

export function mergeTourismOverlays(
  pageKey: string,
  base: TourMap,
): TourMap {
  return { ...base, ...(TOURISM_PAGE_OVERLAYS[pageKey] ?? {}) };
}
