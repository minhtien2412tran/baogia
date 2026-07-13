import { toDbLocale, type DbLocale } from './registry';

/** Text overlay for static service pages — merged onto English base in apps/web */
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

type PageOverlayMap = Partial<Record<DbLocale, PageTextOverlay>>;

const privateJetCharter: PageOverlayMap = {
  vi: {
    title: 'Máy bay riêng cho mọi nhu cầu',
    description: 'Thuê máy bay riêng theo yêu cầu với hơn 10.000 máy bay và hỗ trợ 24/7.',
    hero: 'Dịch vụ thuê máy bay riêng của JetVina kết hợp sang trọng, hiệu quả và an toàn với giá trị tốt nhất.',
    tag: 'Thuê chuyến',
    cta: { label: 'Tìm máy bay khả dụng' },
    sections: [
      {
        heading: 'Dịch vụ máy bay riêng chúng tôi cung cấp',
        body: 'Từ một chặng đến hành trình đa thành phố, đội ngũ chúng tôi tìm đúng loại máy bay và nhà vận hành cho bạn.',
        bullets: [
          'Light, midsize, heavy và ultra-long-range',
          'Báo giá minh bạch, không phí ẩn',
          'Concierge 24/7 từ yêu cầu đến hạ cánh',
          'Truy cập hơn 1.000 nhà vận hành toàn cầu',
        ],
      },
      {
        heading: 'Cách thức hoạt động',
        body: 'Tìm tuyến bay, xem lựa chọn máy bay và nhận báo giá trong vài giờ.',
        bullets: ['Gửi hành trình trực tuyến', 'So sánh loại máy bay & giá', 'Xác nhận và bay'],
      },
    ],
  },
  'zh-cn': {
    title: '满足各种需求的私人飞机',
    description: '按需私人飞机包机，飞机资源，24/7礼宾服务。',
    hero: 'JetVina私人包机服务以最优价值融合奢华、效率与安全。',
    tag: '包机',
    cta: { label: '搜索可用飞机' },
    sections: [
      {
        heading: '我们提供的私人飞机服务',
        body: '从单段行程到复杂多城航线，我们为您匹配合适的机型与运营商。',
        bullets: ['轻型、中型、重型及超远程机型', '透明报价，无隐藏费用', '24/7全程礼宾', '接入全球1000+运营商'],
      },
      {
        heading: '如何运作',
        body: '搜索航线、查看机型选项，数小时内获得定制报价。',
        bullets: ['在线提交行程', '对比机型与价格', '确认并起飞'],
      },
    ],
  },
  'zh-hk': {
    title: '滿足各種需求的私人飛機',
    description: '按需私人飛機包機，飛機資源，24/7禮賓服務。',
    hero: 'JetVina私人包機服務以最優價值融合奢華、效率與安全。',
    tag: '包機',
    cta: { label: '搜尋可用飛機' },
    sections: [
      {
        heading: '我們提供的私人飛機服務',
        body: '從單段行程到複雜多城航線，我們為您匹配合適的機型與營運商。',
        bullets: ['輕型、中型、重型及超長程機型', '透明報價，無隱藏費用', '24/7全程禮賓', '接入全球1000+營運商'],
      },
      {
        heading: '如何運作',
        body: '搜尋航線、查看機型選項，數小時內獲得定制報價。',
        bullets: ['在線提交行程', '對比機型與價格', '確認並起飛'],
      },
    ],
  },
  'zh-tw': {
    title: '滿足各種需求的私人飛機',
    description: '按需私人飛機包機，飛機資源，24/7禮賓服務。',
    hero: 'JetVina私人包機服務以最優價值融合奢華、效率與安全。',
    tag: '包機',
    cta: { label: '搜尋可用飛機' },
    sections: [
      {
        heading: '我們提供的私人飛機服務',
        body: '從單段行程到複雜多城航線，我們為您匹配合適的機型與營運商。',
        bullets: ['輕型、中型、重型及超長程機型', '透明報價，無隱藏費用', '24/7全程禮賓', '接入全球1000+營運商'],
      },
      {
        heading: '如何運作',
        body: '搜尋航線、查看機型選項，數小時內獲得客製報價。',
        bullets: ['線上提交行程', '比較機型與價格', '確認並起飛'],
      },
    ],
  },
};

function simpleOverlay(
  vi: PageTextOverlay,
  cn: PageTextOverlay,
  hk?: PageTextOverlay,
  tw?: PageTextOverlay,
): PageOverlayMap {
  return { vi, 'zh-cn': cn, 'zh-hk': hk ?? cn, 'zh-tw': tw ?? hk ?? cn };
}

const PAGE_OVERLAYS: Record<string, PageOverlayMap> = {
  'private-jet-charter': privateJetCharter,
  'corporate-air-charter': simpleOverlay(
    {
      title: 'Thuê chuyến bay doanh nghiệp',
      description: 'Hàng không tư nhân cho đội ngũ, roadshow và công tác khẩn.',
      hero: 'Tối đa hóa năng suất với chuyến bay point-to-point theo lịch doanh nghiệp.',
      tag: 'Thuê chuyến',
      cta: { label: 'Yêu cầu báo giá doanh nghiệp' },
    },
    {
      title: '企业包机',
      description: '团队、路演和紧急商务出行的行政私人航空。',
      hero: '根据企业日程定制点对点航班，最大化生产力。',
      tag: '包机',
      cta: { label: '申请企业报价' },
    },
  ),
  'group-air-charter': simpleOverlay(
    {
      title: 'Thuê chuyến bay nhóm',
      description: 'Máy bay riêng cho đội thể thao, đoàn, đám cưới và nhóm lớn.',
      hero: 'Di chuyển cả nhóm cùng lúc với khởi hành phối hợp và cabin linh hoạt.',
      tag: 'Thuê chuyến',
      cta: { label: 'Lên kế hoạch thuê nhóm' },
    },
    {
      title: '团体包机',
      description: '体育团队、代表团、婚礼及大型团体的私人飞机。',
      hero: '整团协调出发，灵活客舱配置。',
      tag: '包机',
      cta: { label: '规划团体包机' },
    },
  ),
  'event-air-charter': simpleOverlay(
    {
      title: 'Thuê chuyến bay sự kiện',
      description: 'Vận chuyển VIP cho concert, lễ hội, thể thao và sự kiện độc quyền.',
      hero: 'Đến đúng giờ, đúng phong cách — chúng tôi lo logistics để bạn tập trung sự kiện.',
      tag: 'Thuê chuyến',
      cta: { label: 'Thuê cho sự kiện của bạn' },
    },
    {
      title: '活动包机',
      description: '演唱会、节日、体育赛事及专属活动的VIP空运。',
      hero: '准时优雅抵达——我们处理后勤，您专注活动。',
      tag: '包机',
      cta: { label: '为您的活动包机' },
    },
  ),
  'pet-travel': simpleOverlay(
    {
      title: 'Du lịch cùng thú cưng',
      description: 'Bay riêng an toàn, thoải mái cho bạn và thú cưng.',
      hero: 'Bạn đồng hành bay cùng bạn trong cabin — không kho hàng, không căng thẳng.',
      tag: 'Thuê chuyến',
      cta: { label: 'Đặt chuyến thân thiện thú cưng' },
    },
    {
      title: '宠物出行',
      description: '与您和宠物安全舒适的私人飞行。',
      hero: '宠物与您同舱飞行——无货舱，无压力。',
      tag: '包机',
      cta: { label: '预订宠物友好航班' },
    },
  ),
  'air-ambulance': simpleOverlay(
    {
      title: 'Air Ambulance — Hỗ trợ y tế hàng không',
      description: 'Sơ tán y tế và cấp cứu hàng không phản ứng 24/7.',
      hero: 'Khi từng phút quan trọng, đội SOS điều phối chuyển viện toàn cầu.',
      tag: 'Khẩn cấp',
      cta: { label: 'Yêu cầu Air Ambulance' },
    },
    {
      title: 'Air Ambulance — 医疗空运',
      description: '24/7快速响应医疗转运与空中救护。',
      hero: '分秒必争，SOS团队协调全球床对床医疗转运。',
      tag: '紧急',
      cta: { label: '请求Air Ambulance' },
    },
  ),
  'booking-process': simpleOverlay(
    {
      title: 'Quy trình đặt chuyến',
      description: 'Hướng dẫn thuê máy bay riêng với JetVina.',
      hero: 'Từ tìm kiếm đến cất cánh chỉ với bốn bước đơn giản.',
      tag: 'Hướng dẫn',
      cta: { label: 'Bắt đầu tìm kiếm' },
      steps: [
        { title: 'Tìm kiếm', body: 'Nhập tuyến, ngày và số hành khách.' },
        { title: 'Báo giá', body: 'Nhận giá minh bạch từ nhà vận hành đã kiểm duyệt.' },
        { title: 'Xác nhận', body: 'Xem lịch trình, ký thỏa thuận và thanh toán.' },
        { title: 'Bay', body: 'Đến FBO, lên máy bay và tận hưởng trải nghiệm riêng tư.' },
      ],
    },
    {
      title: '预订流程',
      description: 'JetVina私人飞机包机指南。',
      hero: '四步简单流程，从搜索到起飞。',
      tag: '指南',
      cta: { label: '开始搜索' },
      steps: [
        { title: '搜索', body: '输入航线、日期和乘客人数。' },
        { title: '报价', body: '获得经审核运营商的透明价格。' },
        { title: '确认', body: '审阅行程、签署协议并安排付款。' },
        { title: '飞行', body: '抵达FBO，登机，享受无缝私人航空体验。' },
      ],
    },
  ),
  'global-partnership-program': simpleOverlay(
    {
      title: 'Chương trình đối tác toàn cầu',
      description: 'Tham gia mạng giới thiệu JetVina — không cần kinh nghiệm hàng không.',
      hero: 'Giới thiệu khách hàng, nhận hoa hồng và tận dụng đội bay & hỗ trợ toàn cầu.',
      tag: 'Đối tác',
      cta: { label: 'Trở thành đối tác' },
    },
    {
      title: '全球合作伙伴计划',
      description: '加入JetVina推荐网络——无需航空经验。',
      hero: '推荐客户、赚取佣金，利用全球机队与支持基础设施。',
      tag: '合作伙伴',
      cta: { label: '成为合作伙伴' },
    },
  ),
  'jetbay-private-jet-app': simpleOverlay(
    {
      title: 'Ứng dụng Private Jet',
      description: 'Đặt và quản lý chuyến bay riêng trên di động.',
      hero: 'Tìm tuyến, theo dõi báo giá và quản lý chuyến đi — mọi nơi trên thế giới.',
      tag: 'Ứng dụng',
      cta: { label: 'Tải trên App Store' },
    },
    {
      title: 'JetVina私人飞机应用',
      description: '在移动设备上预订和管理私人飞机旅行。',
      hero: '搜索航线、跟踪报价、管理行程——随时随地。',
      tag: '应用',
      cta: { label: '在App Store下载' },
    },
  ),
  'world-cup-2026-private-jet-booking': simpleOverlay(
    {
      title: 'Đặt máy bay riêng World Cup 2026',
      description: 'Bay đến mọi trận FIFA World Cup 2026 bằng máy bay riêng.',
      hero: 'Tránh đám đông — bay thẳng đến các thành phố đăng cai Bắc Mỹ.',
      tag: 'Chiến dịch',
      cta: { label: 'Lên kế hoạch World Cup' },
    },
    {
      title: '2026世界杯私人飞机预订',
      description: '私人飞机飞往每一场FIFA世界杯2026比赛。',
      hero: '避开人群——直飞北美主办城市。',
      tag: '活动',
      cta: { label: '规划世界杯出行' },
    },
  ),
  'world-cup-final-2026-private-jet-charter': simpleOverlay(
    {
      title: 'Chung kết World Cup 2026 — Thuê máy bay riêng',
      description: 'Đến chung kết FIFA World Cup 2026 đầy phong cách.',
      hero: 'Hàng không tư nhân cao cấp cho trận đấu lớn nhất hành tinh.',
      tag: 'Chiến dịch',
      cta: { label: 'Yêu cầu báo giá chung kết' },
    },
    {
      title: '2026世界杯决赛私人包机',
      description: '优雅抵达FIFA世界杯2026决赛。',
      hero: '为地球上最盛大的比赛提供高端私人航空。',
      tag: '活动',
      cta: { label: '申请决赛报价' },
    },
  ),
};

/** Home hero & trust strip */
const HOME_OVERLAYS: PageOverlayMap = {
  vi: {
    title: 'Thuê máy bay riêng toàn cầu: Truy cập 10.000+ máy bay',
    hero: 'Truy cập liền mạch, đáng tin cậy vào hàng không tư nhân trên toàn thế giới.',
  },
  'zh-cn': {
    title: '全球私人飞机包机：全球私人航空服务',
    hero: '无缝、可信赖的全球私人航空接入。',
  },
  'zh-hk': {
    title: '全球私人飛機包機：全球私人航空服務',
    hero: '無縫、可信賴的全球私人航空接入。',
  },
  'zh-tw': {
    title: '全球私人飛機包機：全球私人航空服務',
    hero: '無縫、可信賴的全球私人航空接入。',
  },
};

export function getPageOverlay(pageKey: string, webLocale: string): PageTextOverlay | undefined {
  const db = toDbLocale(webLocale);
  if (db === 'en') return undefined;
  return PAGE_OVERLAYS[pageKey]?.[db];
}

export function getHomeOverlay(webLocale: string): PageTextOverlay | undefined {
  const db = toDbLocale(webLocale);
  if (db === 'en') return undefined;
  return HOME_OVERLAYS[db];
}

export function mergePageOverlay<T extends PageTextOverlay>(base: T, overlay?: PageTextOverlay): T {
  if (!overlay) return base;
  const merged = { ...base, ...overlay };
  if (overlay.sections && base.sections) {
    merged.sections = base.sections.map((s, i) => ({
      ...s,
      ...(overlay.sections?.[i] ?? {}),
    }));
  }
  if (overlay.features && base.features) {
    merged.features = base.features.map((f, i) => ({
      ...f,
      ...(overlay.features?.[i] ?? {}),
    }));
  }
  if (overlay.steps && base.steps) {
    merged.steps = base.steps.map((s, i) => ({
      ...s,
      ...(overlay.steps?.[i] ?? {}),
    }));
  }
  if (overlay.cta && base.cta) {
    merged.cta = { ...base.cta, ...overlay.cta };
  }
  return merged as T;
}
