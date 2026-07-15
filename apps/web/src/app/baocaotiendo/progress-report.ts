/**
 * Báo cáo tiến độ JetBay — trang /baocaotiendo (gửi khách hàng)
 *
 * Quy tắc báo cáo:
 * - Ngày bắt đầu HĐ: 09/07/2026 · thời hạn ~4 tháng / 16 tuần
 * - Chỉ báo đúng phần đã tới hạn theo lộ trình; không “làm xong sớm” trên giấy
 * - GĐ1 có biên bản nội bộ (GD1_SIGNOFF) — ghi nhận cao; GĐ2–GĐ4 chưa tới hạn nghiệm thu HĐ
 */

export type WorkStatus = 'done' | 'partial' | 'blocked' | 'not_started';

export type WorkItem = {
  title: string;
  status: WorkStatus;
  note?: string;
};

export type PhaseReport = {
  id: string;
  name: string;
  contractPct: number;
  weeks: string;
  calendar: string;
  summary: string;
  status: WorkStatus;
  completionPct: number;
  done: WorkItem[];
  inProgress: WorkItem[];
  backlog: WorkItem[];
  deliverables: { label: string; href: string }[];
};

export type LinkRef = {
  label: string;
  href: string;
  kind: 'live' | 'docs' | 'collateral';
};

export const REPORT_META = {
  project: 'JetVina Website (hợp đồng/mã nội bộ: JetBay) — Website, API và bảng quản trị',
  client: 'Anh Tuấn Anh',
  vendor: 'Minh Tiến Solutions',
  contractScope:
    'Gói Web Clone Jet-Bay 74.000.000 VNĐ (chưa VAT) — Backend, Web, Dashboard, xác thực và tích hợp thanh toán/tài liệu theo lộ trình 4 tháng',
  quoteUrl: 'https://m-tien.com/jet-bay/',
  startDate: '09/07/2026',
  startDateIso: '2026-07-09',
  reportDate: '14/07/2026',
  reportVersion: '3.1',
  plannedMonths: 4,
  plannedWeeks: 16,
  /** Tuần hiện tại kể từ ngày bắt đầu (tuần 1 = 09–15/07) */
  currentWeek: 1,
  currentPhaseLabel: 'Giai đoạn 1 — khởi động & dựng nền (+ chuẩn bị GĐ2)',
  overallNote:
    'Cập nhật 14/07 (v3.1): GĐ1 nền tảng ổn định; smoke commercial/auth/quote PASS. Web staging GĐ2: empty/error, fleet sample label, account polish, charter CMS map — chờ deploy web và SMTP Owner. Mail deliver và thanh toán vẫn BLOCKED.',
};

/**
 * % tổng thể theo lịch 4 tháng (tuần 1/16).
 * Phản ánh GĐ1 gần xong + chuẩn bị sớm GĐ2 — cố ý không vượt mốc nghiệm thu GĐ2–GĐ4.
 */
export const OVERALL_PROGRESS_PCT = 24;

export type ContractModule = {
  code: string;
  name: string;
  in74tr: boolean;
  status: WorkStatus;
  progressPct: number;
  quoteLine: string;
  doneHighlights: string[];
  why: string;
  benefit: string;
  pending?: string;
};

export const CONTRACT_MODULES: ContractModule[] = [
  {
    code: 'BE',
    name: 'Backend API & cơ sở dữ liệu',
    in74tr: true,
    status: 'partial',
    progressPct: 70,
    quoteLine: 'Theo hợp đồng: làm Backend trước để Web, Dashboard và app sau này dùng chung một API.',
    doneHighlights: [
      'Máy chủ API riêng trên VPS: https://api.minhtien.online — health/docs ổn định',
      'Database riêng jetbay_db + migrate/seed; mẫu: ~120 sân bay, 14 operator, 32 máy bay',
      'JWT + phân quyền USER/ADMIN; Swagger đã khóa HTTP Basic (không còn mở công khai)',
      'API cốt lõi GĐ1: quote, fleet/airport, Fixed Price, empty-leg, news, CMS, bookings, payments stub, media, email template',
      'Biên bản nghiệm thu nội bộ GĐ1 (10/07/2026)',
    ],
    why: 'Nếu làm giao diện trước khi có API ổn định, sau này phải nối lại và dễ lệch nghiệp vụ. Hợp đồng cũng xếp Backend ở bước đầu.',
    benefit:
      'Anh có thể xem sớm “xương sống” hệ thống; web/admin gắn API thật. Tài liệu Swagger đã khóa Basic để bảo vệ môi trường đang phát triển.',
    pending:
      'Siết vận hành production (backup định kỳ, SMTP thật); chờ khóa tích hợp thanh toán / SMS / email ở GĐ4.',
  },
  {
    code: 'WEB',
    name: 'Website công khai (clone Jet-Bay / JetVina)',
    in74tr: true,
    status: 'partial',
    progressPct: 36,
    quoteLine:
      'Website nhiều trang, form báo giá, sản phẩm Fixed Price / Empty Leg / Jet Card… — thuộc các tuần giữa lộ trình.',
    doneHighlights: [
      'Bản xem trước https://www.minhtien.online — nhiều trang nối API thật (quote, fleet, FP, news…)',
      'i18n EN/VI cho product UI (quote widget, airport search, hero…)',
      'Hình ảnh / media mẫu theo hướng JetVina trên môi trường xem trước',
      'Loader chuyển trang và icon chuyển động nhẹ theo phong cách hàng không',
      'GĐ2 staging (14/07): empty/error minh bạch, quote phone bắt buộc, fleet mẫu có nhãn, account Retry',
    ],
    why: 'Cần có bản xem sớm để Anh góp ý hướng giao diện, nhưng chưa phải bản nghiệm thu tháng 2.',
    benefit:
      'Anh theo dõi được hình hài sản phẩm song song với Backend; góp ý sớm giảm chỉnh lớn ở tháng 2.',
    pending:
      'SMTP thật để mail quote; CMS thêm tin; polish visual DoD; payment GĐ4.',
  },
  {
    code: 'ADM',
    name: 'Bảng quản trị & CMS',
    in74tr: true,
    status: 'partial',
    progressPct: 22,
    quoteLine: 'Dashboard quản lý nội dung, giá, báo giá — theo hợp đồng nằm ở giai đoạn giữa–cuối.',
    doneHighlights: [
      'Cổng admin https://admin.minhtien.online — đăng nhập JWT nối API production',
      'Màn hình quản lý đang dựng dần (bài viết, chuyến, báo giá, Fixed Price theo tier…)',
      'Đã siết bảo mật demo: mật khẩu tài khoản xem thử đã đổi (13/07/2026)',
    ],
    why: 'Cần khung admin sớm để kiểm tra quyền USER/ADMIN và luồng dữ liệu, nhưng chưa đến hạn “CMS vận hành đầy đủ”.',
    benefit: 'Khi tới giai đoạn nghiệm thu CMS, Anh sẽ có sẵn đường vào và tài khoản demo để xem thực tế.',
    pending: 'Bổ sung form, quy trình duyệt, hướng dẫn vận hành — tiếp tục trong các tuần tới / GĐ3.',
  },
  {
    code: 'AUTH',
    name: 'Đăng nhập & phân quyền',
    in74tr: true,
    status: 'partial',
    progressPct: 45,
    quoteLine: 'JWT dùng chung Web/Admin; Google / Apple / SMS OTP thuộc phần tích hợp giai đoạn sau.',
    doneHighlights: [
      'Đăng ký / đăng nhập email–mật khẩu trên môi trường thử',
      'Tách quyền USER / ADMIN (admin không mở cho tài khoản thường)',
      'Đã rotate mật khẩu demo admin & user (13/07/2026)',
    ],
    why: 'Mọi client sau này (web, admin, app) cần cùng một cách đăng nhập — làm sớm phần lõi sẽ đỡ sửa lại.',
    benefit:
      'An toàn hơn khi đặt chỗ/báo giá; sẵn sàng gắn thêm Google/Apple/SMS khi Anh cung cấp thông tin nhà cung cấp.',
    pending: 'Google, Apple, SMS OTP — chờ cấu hình phía Anh và nằm ở Giai đoạn 4.',
  },
  {
    code: 'PAY',
    name: 'Thanh toán online (Stripe · OnePay · 9Pay)',
    in74tr: true,
    status: 'not_started',
    progressPct: 5,
    quoteLine: 'Tích hợp kỹ thuật trong gói 74TR; phí merchant do Bên A — theo lịch khoảng tháng 4.',
    doneHighlights: [
      'Đã có khung API/webhook stub (chưa bật thanh toán thật, chưa có giao dịch thử)',
    ],
    why: 'Phần này phụ thuộc khóa merchant và UAT — chưa đến hạn trong tuần đầu.',
    benefit: 'Khi tới giai đoạn thanh toán, đội sẽ cấu hình và chạy thử sandbox thay vì viết lại từ đầu.',
    pending: 'Chờ khóa sandbox/live từ Anh và lịch nghiệm thu Giai đoạn 4.',
  },
  {
    code: 'DOC',
    name: 'Xuất tài liệu Word / PDF',
    in74tr: true,
    status: 'not_started',
    progressPct: 5,
    quoteLine: 'Xuất hồ sơ chuyến gắn booking — bổ sung trong lộ trình giai đoạn sau.',
    doneHighlights: ['Mới có khung kỹ thuật sơ bộ, chưa có bản mẫu cuối và chưa UAT với Anh.'],
    why: 'Cần thống nhất nội dung điều khoản / mẫu giấy tờ trước khi coi là hoàn thành.',
    benefit: 'Giảm việc soạn tay khi vận hành; đồng bộ với dữ liệu đặt chỗ trên hệ thống.',
    pending: 'Chỉnh mẫu theo yêu cầu Anh và chạy thử trên booking thật ở giai đoạn sau.',
  },
];

export type ValuePoint = {
  title: string;
  detail: string;
};

export const VALUE_POINTS: ValuePoint[] = [
  {
    title: 'Làm đúng thứ tự hợp đồng',
    detail:
      'Tuần đầu ưu tiên Backend và môi trường riêng trên VPS. Web và admin chỉ dựng ở mức “nhìn được, thử được”, chưa phải bản bàn giao tháng 2–3.',
  },
  {
    title: 'Tách hệ thống mới khỏi hệ thống cũ',
    detail:
      'API, database và cấu hình JetBay chạy riêng, không đụng phần đang phục vụ khách khác trên cùng máy chủ — giảm rủi ro khi triển khai song song.',
  },
  {
    title: 'Có địa chỉ xem sớm để Anh theo dõi',
    detail:
      'API, web và admin đã có đường dẫn HTTPS. Anh có thể vào xem định kỳ; đội sẽ cập nhật báo cáo theo tuần thay vì dồn một lần cuối.',
  },
  {
    title: 'Không báo vượt tiến độ',
    detail:
      'Dù khung kỹ thuật dựng nhanh và GĐ1 đã có biên bản nội bộ, các mốc nghiệm thu GĐ2–GĐ4 vẫn giữ đúng lịch 4 tháng. Phần chưa tới hạn ghi nhận tỷ lệ thấp.',
  },
];

export type TechBenefit = {
  tech: string;
  role: string;
  helps: string;
};

export const TECH_BENEFITS: TechBenefit[] = [
  {
    tech: 'NestJS + PostgreSQL (Prisma)',
    role: 'API và lưu trữ nghiệp vụ',
    helps: 'Dễ mở rộng theo module, có lịch sử thay đổi schema, phù hợp làm nền cho web và app sau này.',
  },
  {
    tech: 'JWT & phân quyền',
    role: 'Đăng nhập, tách USER / ADMIN',
    helps: 'Bảo vệ khu vực quản trị và dữ liệu đặt chỗ; cùng chuẩn cho nhiều ứng dụng.',
  },
  {
    tech: 'Swagger (OpenAPI) + HTTP Basic',
    role: 'Tài liệu API đang phát triển',
    helps:
      'Anh hoặc đối tác kỹ thuật xem được danh sách API; đã khóa Basic để tránh lộ tài liệu công khai.',
  },
  {
    tech: 'Next.js (Web & Admin)',
    role: 'Giao diện người dùng và bảng quản trị',
    helps: 'Cùng ngôn ngữ TypeScript với Backend, bàn giao một bộ mã nguồn thống nhất.',
  },
];

export const PHASES: PhaseReport[] = [
  {
    id: 'g1',
    name: 'Giai đoạn 1 — Khởi động & dựng nền tảng',
    contractPct: 25,
    weeks: 'Tuần 1–4',
    calendar: '09/07 – đầu tháng 08/2026',
    summary:
      'Đúng lịch tuần 1: môi trường, DB, khung API và đường dẫn kiểm thử đã sẵn. Biên bản nghiệm thu nội bộ GĐ1 đã có (10/07) — còn siết vận hành trước khi đóng HĐ GĐ1 với Anh.',
    status: 'partial',
    completionPct: 85,
    done: [
      { title: 'Chốt phạm vi theo báo giá 74TR và tách hạ tầng JetBay trên VPS', status: 'done' },
      { title: 'Tạo database riêng, chạy migrate/seed dữ liệu mẫu để kiểm thử', status: 'done' },
      { title: 'Mở API HTTPS + trang tài liệu Swagger (đã bật HTTP Basic)', status: 'done' },
      { title: 'Khung đăng nhập JWT và tài khoản demo (mật khẩu đã rotate 13/07)', status: 'done' },
      {
        title: 'Nhóm API cốt lõi GĐ1 (quote, fleet, FP, CMS, bookings…) — checklist nội bộ',
        status: 'done',
      },
    ],
    inProgress: [
      {
        title: 'Siết cấu hình vận hành (SMTP production, sao lưu định kỳ, checklist an toàn)',
        status: 'partial',
        note: 'Tuần 2–4',
      },
    ],
    backlog: [
      {
        title: 'Nghiệm thu kết thúc Giai đoạn 1 với Anh (biên bản HĐ)',
        status: 'not_started',
        note: 'Dự kiến cuối tuần 4',
      },
    ],
    deliverables: [
      { label: 'API (đang phát triển)', href: 'https://api.minhtien.online' },
      { label: 'Swagger (cần Basic)', href: 'https://docs.minhtien.online/swagger' },
    ],
  },
  {
    id: 'g2',
    name: 'Giai đoạn 2 — Website công khai',
    contractPct: 25,
    weeks: 'Tuần 5–8',
    calendar: 'Tháng 2 theo lộ trình HĐ',
    summary:
      'Chưa tới hạn nghiệm thu. Đã có bản web xem trước + i18n + media mẫu — chưa tính nghiệm thu Frontend staging.',
    status: 'partial',
    completionPct: 18,
    done: [],
    inProgress: [
      {
        title: 'Dựng khung trang, nối API, i18n, media theo hướng JetVina (bản nội bộ)',
        status: 'partial',
        note: 'Chuẩn bị trước, nghiệm thu vẫn theo tháng 2',
      },
    ],
    backlog: [
      {
        title: 'Hoàn thiện giao diện theo mẫu, responsive, quote widget ổn định',
        status: 'not_started',
      },
      { title: 'Nghiệm thu staging Frontend (mốc thanh toán đợt 2 theo HĐ)', status: 'not_started' },
    ],
    deliverables: [{ label: 'Web xem trước', href: 'https://www.minhtien.online/en-us' }],
  },
  {
    id: 'g3',
    name: 'Giai đoạn 3 — API hoàn thiện & CMS vận hành',
    contractPct: 25,
    weeks: 'Tuần 9–12',
    calendar: 'Tháng 3 theo lộ trình HĐ',
    summary:
      'Chưa tới hạn. Admin mới ở mức khung kiểm thử nội bộ — chưa bàn giao “CMS vận hành”.',
    status: 'not_started',
    completionPct: 12,
    done: [],
    inProgress: [
      {
        title: 'Khung admin + quyền đăng nhập (phục vụ kiểm thử sớm)',
        status: 'partial',
        note: 'Không thay cho nghiệm thu tháng 3',
      },
    ],
    backlog: [
      {
        title: 'Hoàn thiện CRUD/CMS, quy trình báo giá–offer, tài liệu vận hành',
        status: 'not_started',
      },
      { title: 'Nghiệm thu API + CMS (mốc thanh toán đợt 3)', status: 'not_started' },
    ],
    deliverables: [{ label: 'Admin xem trước', href: 'https://admin.minhtien.online/login' }],
  },
  {
    id: 'g4',
    name: 'Giai đoạn 4 — Thanh toán, xác thực bổ sung & go-live',
    contractPct: 25,
    weeks: 'Tuần 13–16',
    calendar: 'Tháng 4 theo lộ trình HĐ',
    summary:
      'Chưa mở triển khai chính thức. Phụ thuộc khóa merchant / SMS / email từ phía Anh và lịch UAT cuối.',
    status: 'not_started',
    completionPct: 3,
    done: [],
    inProgress: [],
    backlog: [
      {
        title: 'Cấu hình Stripe / OnePay / 9Pay và giao dịch sandbox',
        status: 'blocked',
        note: 'Chờ khóa từ Anh',
      },
      { title: 'Google / Apple / SMS OTP', status: 'blocked', note: 'Chờ cấu hình từ Anh' },
      { title: 'Email SMTP production', status: 'blocked', note: 'Chờ thông tin máy chủ thư' },
      { title: 'UAT xuất PDF/Word + go-live cứng', status: 'not_started' },
    ],
    deliverables: [
      {
        label: 'Trạng thái tích hợp (sơ bộ)',
        href: 'https://api.minhtien.online/v1/integrations/status',
      },
    ],
  },
];

export const OUT_OF_SCOPE_NOW: WorkItem[] = [
  {
    title: 'Ứng dụng React Native (gói riêng)',
    status: 'not_started',
    note: 'Ngoài gói Web 74TR — chỉ khởi động khi hai bên thống nhất riêng',
  },
];

export const DEMO_ACCOUNTS = [
  {
    role: 'Quản trị (xem thử)',
    email: 'admin@jetbay.local',
    password: 'WTtymX89cEWUwgJBzqAa1!',
    url: 'https://admin.minhtien.online/login',
  },
  {
    role: 'Người dùng (xem thử)',
    email: 'demo@jetbay.local',
    password: 'J9q9snOLWiMcmTYHFIAa1!',
    url: 'https://www.minhtien.online/en-us/login',
  },
] as const;

/** Swagger / docs — HTTP Basic (cửa sổ trình duyệt, không phải form JWT). */
export const SWAGGER_ACCESS = {
  url: 'https://docs.minhtien.online/swagger',
  username: 'docs',
  password: 'UNURseKKFiiWGp0bHtr4GWqEG9Gk',
  note: 'Cửa sổ “Sign in to access this site” = HTTP Basic bảo vệ tài liệu API, không phải tài khoản đăng nhập JetVina.',
} as const;

export const REFERENCE_LINKS: LinkRef[] = [
  { label: 'Website xem trước', href: 'https://www.minhtien.online/en-us', kind: 'live' },
  { label: 'API đang phát triển', href: 'https://api.minhtien.online', kind: 'live' },
  {
    label: 'Tài liệu API (Swagger · Basic)',
    href: 'https://docs.minhtien.online/swagger',
    kind: 'live',
  },
  { label: 'Bảng quản trị xem trước', href: 'https://admin.minhtien.online/login', kind: 'live' },
  {
    label: 'Hợp đồng & báo giá 74TR',
    href: 'https://m-tien.com/jet-bay/',
    kind: 'collateral',
  },
  {
    label: 'Báo giá App (gói riêng)',
    href: 'https://m-tien.com/app-jetbay/',
    kind: 'collateral',
  },
];

export const OUTSIDE_74TR: { title: string; note: string }[] = [
  {
    title: 'Phí cổng thanh toán, SMS, hosting, tên miền',
    note: 'Theo phụ lục báo giá — Bên A chi trả nhà cung cấp; bên triển khai chỉ làm phần kỹ thuật trong gói 74TR.',
  },
  {
    title: 'Ứng dụng điện thoại (React Native)',
    note: 'Gói riêng, chưa nằm trong tiến độ Web 4 tháng hiện tại.',
  },
  {
    title: 'VAT 10%',
    note: 'Chưa gồm trong số 74.000.000 VNĐ.',
  },
];

export const NEXT_ACTIONS = [
  {
    owner: 'Phía Anh Tuấn Anh',
    items: [
      'Xem qua các đường dẫn web/API/admin và góp ý hướng giao diện ưu tiên',
      'Chuẩn bị dần thông tin GĐ4 (không cần gửi hết ngay): email SMTP, ý định dùng Stripe/OnePay/9Pay, Google/Apple nếu cần',
      'Phản hồi nếu muốn điều chỉnh thứ tự ưu tiên trang web trong tháng 2',
    ],
  },
  {
    owner: 'Phía Minh Tiến Solutions',
    items: [
      'Tiếp tục đóng GĐ1 theo lịch tuần 2–4 (SMTP, backup, biên bản với Anh)',
      'Đẩy sớm màn web (tin tức, newsletter, FP, fleet) — nội bộ, chưa nghiệm thu GĐ2',
      'Cập nhật báo cáo tiến độ định kỳ trên cùng địa chỉ này',
      'Chỉ mở nghiệm thu từng giai đoạn khi đủ điều kiện theo hợp đồng',
    ],
  },
];

export function statusLabel(s: WorkStatus): string {
  switch (s) {
    case 'done':
      return 'Đã xong phần này';
    case 'partial':
      return 'Đang phát triển';
    case 'blocked':
      return 'Chờ phía Anh';
    case 'not_started':
      return 'Chưa tới hạn';
  }
}
