/**
 * Báo cáo tiến độ JetBay — trang /baocaotiendo (gửi khách hàng)
 *
 * Quy tắc báo cáo:
 * - Ngày bắt đầu HĐ: 09/07/2026 · thời hạn ~4 tháng / 16 tuần
 * - Chỉ báo đúng phần đã tới hạn theo lộ trình; không “làm xong sớm” trên giấy
 * - Việc dựng sẵn môi trường / khung kỹ thuật = khởi động GĐ1, không tính nghiệm thu GĐ2–GĐ4
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
  project: 'JetBay — Website, API và bảng quản trị',
  client: 'Anh Tuấn Anh',
  vendor: 'Minh Tiến Solutions',
  contractScope:
    'Gói Web Clone Jet-Bay 74.000.000 VNĐ (chưa VAT) — Backend, Web, Dashboard, xác thực và tích hợp thanh toán/tài liệu theo lộ trình 4 tháng',
  quoteUrl: 'https://m-tien.com/jet-bay/',
  startDate: '09/07/2026',
  startDateIso: '2026-07-09',
  reportDate: '10/07/2026',
  reportVersion: '2.0',
  plannedMonths: 4,
  plannedWeeks: 16,
  /** Tuần hiện tại kể từ ngày bắt đầu (tuần 1 = 09–15/07) */
  currentWeek: 1,
  currentPhaseLabel: 'Giai đoạn 1 — khởi động & dựng nền',
  overallNote:
    'Dự án mới bắt đầu từ ngày 09/07/2026. Báo cáo này phản ánh tuần đầu tiên: tập trung dựng môi trường, khung Backend và các đường dẫn kiểm thử nội bộ. Các giai đoạn Web hoàn thiện, vận hành CMS đầy đủ và thanh toán online vẫn nằm ở các tháng sau theo hợp đồng — chưa đến hạn nghiệm thu.',
};

/**
 * % tổng thể theo lịch 4 tháng (tuần 1/16).
 * Cố ý giữ thấp: tránh tạo cảm giác “đã xong phần lớn” khi mới khởi động.
 */
export const OVERALL_PROGRESS_PCT = 8;

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
    progressPct: 22,
    quoteLine: 'Theo hợp đồng: làm Backend trước để Web, Dashboard và app sau này dùng chung một API.',
    doneHighlights: [
      'Đã dựng máy chủ API riêng trên VPS, có địa chỉ https://api.minhtien.online để đội kỹ thuật kiểm thử',
      'Đã tạo cơ sở dữ liệu riêng (jetbay_db), tách biệt hệ thống đang chạy sẵn trên máy chủ',
      'Đã có khung đăng nhập JWT và tài liệu Swagger để đối chiếu endpoint trong quá trình phát triển',
    ],
    why: 'Nếu làm giao diện trước khi có API ổn định, sau này phải nối lại và dễ lệch nghiệp vụ. Hợp đồng cũng xếp Backend ở bước đầu.',
    benefit:
      'Anh có thể xem sớm “xương sống” hệ thống; khi sang tháng Web/Dashboard, các màn hình sẽ gắn vào API thật thay vì dữ liệu giả.',
    pending:
      'Còn hoàn thiện nghiệp vụ theo từng giai đoạn, siết cấu hình production và chờ khóa tích hợp (thanh toán, SMS, email) ở GĐ4.',
  },
  {
    code: 'WEB',
    name: 'Website công khai (clone Jet-Bay)',
    in74tr: true,
    status: 'partial',
    progressPct: 12,
    quoteLine: 'Website nhiều trang, form báo giá, sản phẩm Fixed Price / Empty Leg / Jet Card… — thuộc các tuần giữa lộ trình.',
    doneHighlights: [
      'Đã dựng bản web trên https://www.minhtien.online để xem khung giao diện và nối thử API',
      'Một số trang chính đã hiện dữ liệu từ API (đang ở mức kiểm thử nội bộ)',
    ],
    why: 'Cần có bản xem sớm để Anh góp ý hướng giao diện, nhưng chưa phải bản nghiệm thu tháng 2.',
    benefit:
      'Anh theo dõi được hình hài sản phẩm song song với Backend, thay vì chờ đến cuối mới nhìn thấy web.',
    pending:
      'Chỉnh giao diện sát mẫu, hoàn thiện toàn bộ trang và trải nghiệm người dùng — sẽ đẩy mạnh trong Giai đoạn 2 theo lịch.',
  },
  {
    code: 'ADM',
    name: 'Bảng quản trị & CMS',
    in74tr: true,
    status: 'partial',
    progressPct: 10,
    quoteLine: 'Dashboard quản lý nội dung, giá, báo giá — theo hợp đồng nằm ở giai đoạn giữa–cuối.',
    doneHighlights: [
      'Đã mở cổng admin thử nghiệm tại https://admin.minhtien.online để đội nội bộ kiểm tra quyền đăng nhập',
      'Đang dựng dần các màn hình quản lý (bài viết, chuyến, báo giá…) — chưa bàn giao vận hành',
    ],
    why: 'Cần khung admin sớm để kiểm tra quyền USER/ADMIN và luồng dữ liệu, nhưng chưa đến hạn “CMS vận hành đầy đủ”.',
    benefit: 'Khi tới giai đoạn nghiệm thu CMS, Anh sẽ có sẵn đường vào và tài khoản demo để xem thực tế.',
    pending: 'Bổ sung form, quy trình duyệt, hướng dẫn vận hành — tiếp tục trong các tuần tới.',
  },
  {
    code: 'AUTH',
    name: 'Đăng nhập & phân quyền',
    in74tr: true,
    status: 'partial',
    progressPct: 18,
    quoteLine: 'JWT dùng chung Web/Admin; Google / Apple / SMS OTP thuộc phần tích hợp giai đoạn sau.',
    doneHighlights: [
      'Đã có đăng ký / đăng nhập bằng email–mật khẩu trên môi trường thử',
      'Đã tách quyền người dùng thường và quản trị (admin không mở cho tài khoản thường)',
    ],
    why: 'Mọi client sau này (web, admin, app) cần cùng một cách đăng nhập — làm sớm phần lõi sẽ đỡ sửa lại.',
    benefit: 'An toàn hơn khi đặt chỗ/báo giá; sẵn sàng gắn thêm Google/Apple/SMS khi Anh cung cấp thông tin nhà cung cấp.',
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
      'Mới chuẩn bị khung mã nguồn (chưa bật thanh toán thật, chưa có giao dịch thử)',
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
      'Dù khung kỹ thuật dựng nhanh trong tuần đầu, các mốc nghiệm thu GĐ2–GĐ4 vẫn giữ đúng lịch 4 tháng. Phần chưa tới hạn ghi nhận là đang phát triển hoặc tỷ lệ thấp.',
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
    tech: 'Swagger (OpenAPI)',
    role: 'Tài liệu API đang phát triển',
    helps: 'Anh hoặc đối tác kỹ thuật xem được danh sách API trong lúc làm, giảm hiểu nhầm khi nối hệ thống.',
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
      'Đúng lịch tuần 1: dựng môi trường, database, khung API và đường dẫn kiểm thử. Đây là giai đoạn đang triển khai — chưa kết thúc GĐ1.',
    status: 'partial',
    completionPct: 28,
    done: [
      { title: 'Chốt phạm vi theo báo giá 74TR và tách hạ tầng JetBay trên VPS', status: 'done' },
      { title: 'Tạo database riêng, chạy migrate/seed dữ liệu mẫu để kiểm thử', status: 'done' },
      { title: 'Mở API HTTPS + trang tài liệu Swagger nội bộ', status: 'done' },
      { title: 'Khung đăng nhập JWT và tài khoản demo để Anh xem thử', status: 'done' },
    ],
    inProgress: [
      {
        title: 'Hoàn thiện các nhóm API cốt lõi (báo giá, sản phẩm, nội dung) theo checklist GĐ1',
        status: 'partial',
        note: 'Đang làm dở trong tháng 1',
      },
      {
        title: 'Siết cấu hình vận hành (môi trường, sao lưu, checklist an toàn cơ bản)',
        status: 'partial',
      },
    ],
    backlog: [
      {
        title: 'Nghiệm thu kết thúc Giai đoạn 1 (ERD/spec/môi trường ổn định theo biên bản)',
        status: 'not_started',
        note: 'Dự kiến cuối tuần 4',
      },
    ],
    deliverables: [
      { label: 'API (đang phát triển)', href: 'https://api.minhtien.online/health' },
      { label: 'Swagger', href: 'https://docs.minhtien.online/swagger' },
    ],
  },
  {
    id: 'g2',
    name: 'Giai đoạn 2 — Website công khai',
    contractPct: 25,
    weeks: 'Tuần 5–8',
    calendar: 'Tháng 2 theo lộ trình HĐ',
    summary:
      'Chưa tới hạn. Hiện chỉ có bản web dựng sớm để xem khung — chưa tính nghiệm thu Frontend staging.',
    status: 'partial',
    completionPct: 8,
    done: [],
    inProgress: [
      {
        title: 'Dựng khung trang và nối thử API (bản nội bộ)',
        status: 'partial',
        note: 'Chuẩn bị trước, nghiệm thu vẫn theo tháng 2',
      },
    ],
    backlog: [
      { title: 'Hoàn thiện giao diện theo mẫu, responsive, quote widget ổn định', status: 'not_started' },
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
    completionPct: 6,
    done: [],
    inProgress: [
      {
        title: 'Khung admin + quyền đăng nhập (phục vụ kiểm thử sớm)',
        status: 'partial',
        note: 'Không thay cho nghiệm thu tháng 3',
      },
    ],
    backlog: [
      { title: 'Hoàn thiện CRUD/CMS, quy trình báo giá–offer, tài liệu vận hành', status: 'not_started' },
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
      { title: 'Cấu hình Stripe / OnePay / 9Pay và giao dịch sandbox', status: 'blocked', note: 'Chờ khóa từ Anh' },
      { title: 'Google / Apple / SMS OTP', status: 'blocked', note: 'Chờ cấu hình từ Anh' },
      { title: 'Email SMTP production', status: 'blocked', note: 'Chờ thông tin máy chủ thư' },
      { title: 'UAT xuất PDF/Word + go-live cứng', status: 'not_started' },
    ],
    deliverables: [
      { label: 'Trạng thái tích hợp (sơ bộ)', href: 'https://api.minhtien.online/integrations/status' },
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
    password: 'Admin123!',
    url: 'https://admin.minhtien.online/login',
  },
  {
    role: 'Người dùng (xem thử)',
    email: 'demo@jetbay.local',
    password: 'Demo123!',
    url: 'https://www.minhtien.online/en-us/login',
  },
];

export const REFERENCE_LINKS: LinkRef[] = [
  { label: 'Website xem trước', href: 'https://www.minhtien.online/en-us', kind: 'live' },
  { label: 'API đang phát triển', href: 'https://api.minhtien.online', kind: 'live' },
  { label: 'Tài liệu API (Swagger)', href: 'https://docs.minhtien.online/swagger', kind: 'live' },
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
      'Tiếp tục hoàn thiện Giai đoạn 1 đúng lịch tuần 2–4',
      'Cập nhật báo cáo tiến độ định kỳ (không dồn một lần cuối)',
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
