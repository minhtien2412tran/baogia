/** Swagger docs locales — UI chrome + OpenAPI intro/tags */

export type SwaggerLang = 'en' | 'vi' | 'zh-cn';

export const SWAGGER_LANGS: Array<{ code: SwaggerLang; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'zh-cn', label: '简体中文' },
];

export function normalizeSwaggerLang(raw?: string | null): SwaggerLang {
  const v = (raw || '').toLowerCase().trim();
  if (v === 'vi' || v.startsWith('vi-')) return 'vi';
  if (v === 'zh' || v === 'zh-cn' || v === 'zh-hans' || v.startsWith('zh')) return 'zh-cn';
  return 'en';
}

type UiPack = Record<string, string>;

const UI: Record<SwaggerLang, UiPack> = {
  en: {
    authorize: 'Authorize',
    authorized: 'Authorized',
    logout: 'Logout',
    close: 'Close',
    tryItOut: 'Try it out',
    cancel: 'Cancel',
    execute: 'Execute',
    clear: 'Clear',
    responses: 'Responses',
    parameters: 'Parameters',
    requestBody: 'Request body',
    noParameters: 'No parameters',
    schemas: 'Schemas',
    filterPlaceholder: 'Filter endpoints…',
    server: 'Servers',
    download: 'Download',
    availableAuth: 'Available authorizations',
    langLabel: 'Language',
    tipMobile: 'Tip: use Filter + collapse tags on mobile. Rotate for wider Try-it-out.',
  },
  vi: {
    authorize: 'Ủy quyền',
    authorized: 'Đã ủy quyền',
    logout: 'Đăng xuất',
    close: 'Đóng',
    tryItOut: 'Thử gọi API',
    cancel: 'Hủy',
    execute: 'Gửi request',
    clear: 'Xóa',
    responses: 'Phản hồi',
    parameters: 'Tham số',
    requestBody: 'Body request',
    noParameters: 'Không có tham số',
    schemas: 'Schemas',
    filterPlaceholder: 'Lọc endpoint…',
    server: 'Máy chủ',
    download: 'Tải xuống',
    availableAuth: 'Phương thức xác thực',
    langLabel: 'Ngôn ngữ',
    tipMobile: 'Mẹo: dùng Filter và thu gọn tag trên mobile. Xoay ngang để Try-it-out rộng hơn.',
  },
  'zh-cn': {
    authorize: '授权',
    authorized: '已授权',
    logout: '退出',
    close: '关闭',
    tryItOut: '试一下',
    cancel: '取消',
    execute: '执行',
    clear: '清除',
    responses: '响应',
    parameters: '参数',
    requestBody: '请求体',
    noParameters: '无参数',
    schemas: '数据模型',
    filterPlaceholder: '筛选接口…',
    server: '服务器',
    download: '下载',
    availableAuth: '可用授权',
    langLabel: '语言',
    tipMobile: '提示：手机请用筛选并折叠标签；横屏更方便调试。',
  },
};

const INTRO: Record<SwaggerLang, string> = {
  en: [
    '# JetVina API',
    '',
    'Private jet charter platform backend (NestJS). Product: `www.minhtien.online` · Admin: `admin.minhtien.online`.',
    '',
    '## Authentication',
    '',
    '| Scheme | Header | When |',
    '|--------|--------|------|',
    '| **X-API-Key** | `X-API-Key: <API_KEY>` | Almost all routes |',
    '| **bearer** | `Authorization: Bearer <accessToken>` | After `POST /auth/login` |',
    '',
    'Use **Authorize** (top) and set both schemes for admin flows.',
    '',
    '**Public (no API key):** `GET /`, `GET /health`, Swagger, OpenAPI.',
    '',
    '## Quick start',
    '',
    '1. Authorize with `X-API-Key`.',
    '2. `POST /auth/login` → copy `accessToken`.',
    '3. Authorize `bearer` → call `/me` or `/admin/*`.',
    '4. Quote demo: `POST /quotes/search-aircraft` (SGN→DAD).',
    '',
    '## Rate limits',
    '',
    '- Default 120/min · Auth tighter · Quotes search 30/min · request 20/min',
    '',
    'Switch language with the control at the top-right. Works on phone, tablet, and desktop.',
  ].join('\n'),
  vi: [
    '# JetVina API',
    '',
    'Backend đặt charter máy bay riêng (NestJS). Web: `www.minhtien.online` · Admin: `admin.minhtien.online`.',
    '',
    '## Xác thực',
    '',
    '| Scheme | Header | Khi nào |',
    '|--------|--------|---------|',
    '| **X-API-Key** | `X-API-Key: <API_KEY>` | Hầu hết route |',
    '| **bearer** | `Authorization: Bearer <accessToken>` | Sau `POST /auth/login` |',
    '',
    'Bấm **Ủy quyền** (góc trên) và điền cả hai scheme khi test admin.',
    '',
    '**Công khai (không cần API key):** `GET /`, `GET /health`, Swagger, OpenAPI.',
    '',
    '## Bắt đầu nhanh',
    '',
    '1. Ủy quyền bằng `X-API-Key`.',
    '2. `POST /auth/login` → copy `accessToken`.',
    '3. Ủy quyền `bearer` → gọi `/me` hoặc `/admin/*`.',
    '4. Demo báo giá: `POST /quotes/search-aircraft` (SGN→DAD).',
    '',
    '## Giới hạn tần suất',
    '',
    '- Mặc định 120/phút · Auth chặt hơn · Search quote 30/phút · request 20/phút',
    '',
    'Đổi ngôn ngữ ở góc trên bên phải. Giao diện tối ưu điện thoại, tablet và máy tính.',
  ].join('\n'),
  'zh-cn': [
    '# JetVina API',
    '',
    '私人包机平台后端（NestJS）。网站：`www.minhtien.online` · 管理端：`admin.minhtien.online`。',
    '',
    '## 鉴权',
    '',
    '| 方式 | Header | 使用场景 |',
    '|------|--------|----------|',
    '| **X-API-Key** | `X-API-Key: <API_KEY>` | 几乎全部接口 |',
    '| **bearer** | `Authorization: Bearer <accessToken>` | `POST /auth/login` 之后 |',
    '',
    '点击右上角 **授权**，管理端流程请同时填写两种方式。',
    '',
    '**公开（无需 API key）：** `GET /`、`GET /health`、Swagger、OpenAPI。',
    '',
    '## 快速开始',
    '',
    '1. 使用 `X-API-Key` 授权。',
    '2. `POST /auth/login` → 复制 `accessToken`。',
    '3. 授权 `bearer` → 调用 `/me` 或 `/admin/*`。',
    '4. 报价演示：`POST /quotes/search-aircraft`（SGN→DAD）。',
    '',
    '## 限流',
    '',
    '- 默认 120/分钟 · 登录更严 · 报价搜索 30/分钟 · 提交 20/分钟',
    '',
    '右上角可切换语言。适配手机、平板与桌面。',
  ].join('\n'),
};

/** Tag descriptions per language (English name keys stay stable for OpenAPI tags). */
const TAGS: Record<SwaggerLang, Record<string, string>> = {
  en: {},
  vi: {
    System: 'Liveness/readiness và cờ tích hợp. `/health` công khai (không cần API key).',
    Auth: 'Đăng ký, đăng nhập, refresh, OTP, OAuth. Có rate-limit. Trả JWT access + refresh.',
    Account: 'Dashboard khách đã đăng nhập (quotes, bookings, payments).',
    Airports: 'Tìm sân bay, nearby geo, cờ parking/base cho báo giá/positioning.',
    'Quotes & Bookings': 'Search máy bay + pricing positioning, gửi quote, thanh toán, tài liệu.',
    Bookings: 'Vòng đời booking khách (tạo, list, chi tiết, hủy) — cần JWT.',
    'Fixed Price': 'Tuyến fixed-price công khai và helper báo giá.',
    'Empty Legs': 'Empty-leg, đăng ký alert, form request.',
    'Jet Card': 'Gói Jet Card và form tư vấn.',
    'Travel Credits': 'Gói travel credit, số dư, enquiry.',
    Partners: 'Chương trình đối tác và đơn đăng ký.',
    'Content (CMS)': 'CMS công khai: news, blogs, videos, destinations, pages, newsletter.',
    Media: 'Upload/list media và URL công khai.',
    Pricing: 'Ước tính giá / positioning engine.',
    Contracts: 'Hợp đồng charter với hãng, phê duyệt, DocuSign (theo permission).',
    'Content Sync': 'Nguồn nội dung, job sync, review media, brand settings.',
    Enquiries: 'Form enquiry thương mại chung.',
    i18n: 'Cấu hình locale cho UI đa ngôn ngữ.',
    'API Gateway': 'Catalog route và ma trận UI↔API.',
    'Admin Dashboard': 'KPI admin, quote/booking gần đây, audit, system health.',
    'Admin Quotes': 'Hàng đợi quote, đổi status, offers.',
    'Admin Bookings': 'Quản lý booking phía admin.',
    'Admin Content': 'CRUD CMS: articles, pages, destinations, videos.',
    'Admin Fixed Price': 'CRUD tuyến fixed-price.',
    'Admin Empty Legs': 'CRUD empty-leg.',
    'Admin Jet Card': 'Plans và enquiry Jet Card.',
    'Admin Travel Credits': 'Packages và sổ cái travel credit.',
    'Admin Aircraft': 'Danh mục fleet/aircraft.',
    'Admin Airports': 'Master data sân bay (tọa độ, parking, base).',
    'Admin Operators': 'Hãng (operator) và user nhận mail notify.',
    'Admin Email Templates': 'Template email HTML/text.',
    'Admin Partners': 'Đối tác và đơn đăng ký.',
    'Admin Users': 'User và role.',
    'Admin Permissions': 'Ma trận permission nhân viên.',
  },
  'zh-cn': {
    System: '存活/就绪检查与集成开关。`/health` 公开（无需 API key）。',
    Auth: '注册、登录、刷新、OTP、OAuth。有限流。返回 JWT。',
    Account: '登录客户仪表盘（报价、订单、支付）。',
    Airports: '机场搜索、附近地理、停机/基地标记。',
    'Quotes & Bookings': '机型搜索与定位计价、提交报价、支付与文档。',
    Bookings: '客户订单生命周期 — 需要 JWT。',
    'Fixed Price': '固定价格航线与报价助手。',
    'Empty Legs': '空余航段、提醒订阅与申请。',
    'Jet Card': 'Jet Card 套餐与咨询。',
    'Travel Credits': '旅行积分套餐与咨询。',
    Partners: '合作伙伴计划与申请。',
    'Content (CMS)': '公开 CMS：新闻、博客、视频、目的地、页面、订阅。',
    Media: '媒体上传/列表与公开 URL。',
    Pricing: '定价估算 / 定位引擎。',
    Contracts: '运营商合同、审批、DocuSign。',
    'Content Sync': '内容源、同步任务、媒体审核、品牌设置。',
    Enquiries: '通用商务咨询表单。',
    i18n: '多语言 UI 的 locale 配置。',
    'API Gateway': '路由目录与 UI↔API 对照。',
    'Admin Dashboard': '管理端 KPI、近期报价/订单、审计、健康检查。',
    'Admin Quotes': '报价队列、状态、报价单。',
    'Admin Bookings': '管理端订单。',
    'Admin Content': 'CMS CRUD。',
    'Admin Fixed Price': '固定价格 CRUD。',
    'Admin Empty Legs': '空余航段 CRUD。',
    'Admin Jet Card': 'Jet Card 管理。',
    'Admin Travel Credits': '旅行积分管理。',
    'Admin Aircraft': '机队目录。',
    'Admin Airports': '机场主数据。',
    'Admin Operators': '运营商与通知用户。',
    'Admin Email Templates': '邮件模板。',
    'Admin Partners': '合作伙伴管理。',
    'Admin Users': '用户与角色。',
    'Admin Permissions': '权限矩阵。',
  },
};

export function getSwaggerUiPack(lang: SwaggerLang): UiPack {
  return UI[lang] ?? UI.en;
}

export function getSwaggerIntro(lang: SwaggerLang): string {
  return INTRO[lang] ?? INTRO.en;
}

export function getSwaggerTagDescription(
  lang: SwaggerLang,
  tagName: string,
  fallbackEn: string,
): string {
  if (lang === 'en') return fallbackEn;
  return TAGS[lang]?.[tagName] || fallbackEn;
}

/** Operation helper lines appended in non-English docs */
export function getAuthHintLocalized(lang: SwaggerLang, isPublicLike: boolean): string {
  if (lang === 'vi') {
    return isPublicLike
      ? 'Endpoint công khai (không cần API key).'
      : 'Cần header `X-API-Key`. Route admin cần thêm Bearer JWT.';
  }
  if (lang === 'zh-cn') {
    return isPublicLike
      ? '公开接口（无需 API key）。'
      : '需要 `X-API-Key`。管理端接口还需要 Bearer JWT。';
  }
  return isPublicLike
    ? 'Public endpoint (no API key).'
    : 'Requires header `X-API-Key`. Admin routes also need Bearer JWT.';
}

export function getSwaggerSiteTitle(lang: SwaggerLang): string {
  if (lang === 'vi') return 'JetVina API — Tài liệu';
  if (lang === 'zh-cn') return 'JetVina API — 文档';
  return 'JetVina API Docs';
}
