# PHIẾU BÁO GIÁ DỰ ÁN PHẦN MỀM

| | |
|---|---|
| **Mã tham chiếu** | `PJB-JTA-2026-Q2` |
| **Phiên bản** | 2.0 |
| **Ngày lập** | 30/06/2026 |
| **Hiệu lực** | 30 ngày kể từ ngày lập |
| **Đơn vị báo giá (Bên B)** | **Minh Tiến Solutions** |
| **Dự án** | Hệ thống đặt thuê máy bay tư nhân — **J-TA Platform** (clean-room, tham chiếu jet-bay.com) |

---

## I. Thông tin các bên

### Bên A — Khách hàng nhận báo giá

| Trường | Nội dung |
|--------|----------|
| Đại diện | *(điền theo hợp đồng)* |
| Công ty | *(điền theo hợp đồng)* |
| Email / Điện thoại | *(điền theo hợp đồng)* |
| Tên dự án | Nền tảng Private Jet Charter J-TA |

### Bên B — Minh Tiến Solutions

| Trường | Nội dung |
|--------|----------|
| Đại diện | Ông Nguyễn Minh Tiến — Giám đốc Kỹ thuật |
| Email | minhtiensolutions@gmail.com |
| Website | [m-tien.com/jet-bay](https://m-tien.com/jet-bay/) |

---

## II. Tóm tắt đề xuất

Minh Tiến Solutions đề xuất **triển khai trọn gói** nền tảng số hóa đặt chuyên cơ gồm:

- **Public Web** — Next.js 16, đa ngôn ngữ (6 locale), SEO, responsive
- **CMS Dashboard** — quản trị nội dung, sản phẩm thương mại, leads/báo giá
- **RESTful API** — NestJS 11, Swagger OpenAPI 3.0, JWT, PostgreSQL 16
- **Cơ sở dữ liệu** — 28 bảng Prisma, seed dữ liệu demo, audit log

**Cam kết:** Bàn giao mã nguồn Git 100% · NDA · Báo cáo tiến độ hàng tuần · **4 tháng / 4 giai đoạn**

| KPI cam kết | Mục tiêu |
|-------------|----------|
| API Swagger | 100% endpoint có tài liệu OpenAPI 3.0 |
| Thời gian bàn giao | 4 tháng (16 tuần) |
| Sở hữu trí tuệ | 100% sau thanh toán đợt cuối |

---

## III. Hiện trạng triển khai (codebase `baogia`)

> Đánh giá dựa trên mã nguồn thực tế monorepo — không phải mock UI.

| Hạng mục | Đã xong | Còn lại | % |
|----------|---------|---------|---|
| Monorepo + Docker Compose | ✅ | Wire Redis/MinIO/Mailpit | 85% |
| API lõi (70+ route, 17 controller) | ✅ | OAuth, Stripe, rate limit | 75% |
| Database 28 models + seed | ✅ | Fix quyền DB môi trường KH | 90% |
| Web 29 trang + API client | ✅ | Polish clone 6 service pages | 70% |
| Admin 17 màn hình | ✅ | CRUD form đầy đủ | 55% |
| CMS About Us + Booking Process | ✅ | WYSIWYG articles | 85% |
| Clone UI (home, charter, jet-card…) | 🟡 | Responsive audit toàn site | 65% |
| Production (CI/CD, email, payment) | ⬜ | Toàn bộ phase 4 | 25% |

**Ước lượng tổng thể:** ~**72%** chức năng lõi · ~**58%** UI parity · ~**40%** production-ready.

---

## IV. Phạm vi chức năng — cây nghiệp vụ

```
J-TA Platform
├── 1. Marketing & Khám phá (Web Public)
│   ├── 1.1 Trang chủ (Hero, Promo, Fixed Price, Empty Legs, Destinations, Jet Card, Stats, Media)
│   ├── 1.2 Dịch vụ charter ×6 (private, corporate, group, event, pet, air-ambulance)
│   ├── 1.3 Sản phẩm: Fixed Price · Empty Leg · Jet Card · Travel Credit
│   ├── 1.4 Điểm đến (ISLAND/SKI/GOLF — filter API)
│   ├── 1.5 Nội dung: News · Blogs · Video · Legal/CMS pages
│   ├── 1.6 Thương hiệu: About Us CMS · Booking Process CMS
│   ├── 1.7 Chiến dịch World Cup 2026
│   └── 1.8 Đối tác Global Partnership
├── 2. Đặt chỗ & Báo giá
│   ├── 2.1 Widget tìm chuyến (airport search, aircraft search)
│   ├── 2.2 Quote Request → PostgreSQL
│   ├── 2.3 Form: Fixed Price · Empty Leg · Jet Card · Travel Credit · Partner · World Cup
│   └── 2.4 Booking (tạo / xem / hủy)
├── 3. Tài khoản
│   ├── 3.1 Register / Login JWT
│   ├── 3.2 Portal /account
│   └── 3.3 [Chưa] Sub-pages quotes, jet-card balance, travel credits
├── 4. CMS & Admin
│   ├── 4.1 Articles (NEWS/BLOG/PAGE/LEGAL) + i18n
│   ├── 4.2 Videos · Destinations (14 seed)
│   ├── 4.3 Editors: About Us · Booking Process
│   ├── 4.4 Dashboard stats, audit logs
│   └── 4.5 [Chưa] CRUD form đầy đủ · User mgmt · Media MinIO
└── 5. Hạ tầng & Go-live
    ├── 5.1 PostgreSQL + Prisma migrate/seed
    └── 5.2 [Chưa] Stripe · Email · OAuth · CI/CD · Load test
```

---

## V. Bảng hạng mục báo giá chi tiết

> Đơn giá **VNĐ**, chưa bao gồm **VAT 10%** và **chi phí hạ tầng VPS/Cloud**.

### Gói A — Bắt buộc (Core trọn gói Web + CMS + API)

| STT | Mã | Hạng mục | Mô tả kỹ thuật | Tuần | Đơn giá (VNĐ) | Trạng thái code |
|-----|-----|----------|----------------|------|---------------|-----------------|
| A1 | `FE-CORE` | **Public Web Next.js 16** | 29 route · 6 locale · Home API-driven · Quote widget · SEO/OG J-TA · ~164 asset local | 4 | **32.000.000** | 🟡 ~70% |
| A2 | `ADM-CMS` | **Admin Dashboard + CMS** | 17 trang · JWT gate · editors About/Booking · lists commercial/content | 4 | **22.000.000** | 🟡 ~55% |
| A3 | `API-CORE` | **NestJS API + PostgreSQL** | 70+ endpoint · Swagger · JWT/bcrypt · 28 models · seed | 4 | **20.000.000** | ✅ ~75% |
| | | | *Ghi chú A3: Lõi Backend gốc 40TR, phân bổ 50% vào hợp đồng Web (Mobile App phần còn lại tách riêng nếu có)* | | | |
| | | **Tổng Gói A** | | **12** | **74.000.000** | |

### Gói B — Tùy chọn (Phụ lục hợp đồng)

| STT | Mã | Hạng mục | Mô tả | Tuần | Đơn giá (VNĐ) |
|-----|-----|----------|-------|------|---------------|
| B1 | `PAY-GW` | Cổng thanh toán Stripe/PayPal + QR VN | Webhook, sandbox + live | 2 | **15.000.000** |
| B2 | `LOYALTY` | Jet Card · Travel Credit · Partner portal nâng cao | Account sub-pages, commission | 3 | **18.000.000** |
| B3 | `I18N-CONTENT` | Dịch CMS đa ngôn ngữ (zh-cn, zh-hk, vi) | 6 locale nội dung | 3 | **12.000.000** |
| B4 | `MOBILE-API` | Phần còn lại Backend API (50%) cho Mobile App | REST cho iOS/Android | 4 | **20.000.000** |
| B5 | `INFRA` | CI/CD · Docker prod · Monitoring | GitHub Actions, Cloud Run/ECS | 2 | **10.000.000** |
| B6 | `QA-POLISH` | Responsive audit + clone parity 100% | 10 trang service rich content | 3 | **14.000.000** |

### Gói C — Hoàn thiện phần còn lại (nếu đã có Gói A một phần)

| STT | Hạng mục | Effort | Đơn giá (VNĐ) |
|-----|----------|--------|---------------|
| C1 | Admin CRUD forms (routes, empty legs, airports, articles…) | 12–18 ND | **18.000.000** |
| C2 | 6 service pages rich clone | 8–12 ND | **12.000.000** |
| C3 | Account portal mở rộng | 4–6 ND | **8.000.000** |
| C4 | Email transactional (Mailpit → SMTP) | 4–6 ND | **7.000.000** |
| | **Tổng Gói C (ước lượng)** | | **45.000.000** |

---

## VI. Phương án báo giá đề xuất

| Phương án | Thành phần | Tổng (VNĐ) | Thời gian |
|-----------|------------|------------|-----------|
| **P1 — Trọn gói chuẩn** | Gói A | **74.000.000** | 12 tuần |
| **P2 — Trọn gói + Thanh toán** | A + B1 | **89.000.000** | 14 tuần |
| **P3 — Full parity + Production** | A + B1 + B5 + B6 | **113.000.000** | 16 tuần |
| **P4 — Chỉ hoàn thiện** | Gói C (code ~72% sẵn) | **45.000.000** | 8–10 tuần |

---

## VII. Tiến độ 4 tháng & cột mốc thanh toán

### 7.1. Lịch giai đoạn

| Giai đoạn | Thời gian | % | Nội dung | Bàn giao chính |
|-----------|-----------|---|----------|----------------|
| **1** | Tháng 1 (T1–T4) | 25% | UI/UX · ERD · Prisma schema · Figma/wireframe | ERD · Sitemap · Spec kỹ thuật |
| **2** | Tháng 2 (T5–T8) | 50% | Public Web · Responsive · Quote widget · Home sections | Staging FE · Báo cáo PageSpeed mobile |
| **3** | Tháng 3 (T9–T12) | 75% | NestJS API · CMS Dashboard · Swagger · Admin lists | API live · CMS vận hành · Swagger URL |
| **4** | Tháng 4 (T13–T16) | 100% | Payment · Security · Load test · Go-live | Git repo · Docker · Production URL |

### 7.2. Phân kỳ thanh toán (4 đợt)

| Đợt | % | Số tiền (trên P1 = 74TR) | Điều kiện nghiệm thu |
|-----|---|--------------------------|----------------------|
| 1 | 30% | **22.200.000** | Ký HĐ + khởi động + ERD/UI sign-off |
| 2 | 30% | **22.200.000** | Nghiệm thu Frontend staging (GĐ2) |
| 3 | 30% | **22.200.000** | Nghiệm thu API + CMS (GĐ3) |
| 4 | 10% | **7.400.000** | Go-live + bàn giao source Git |

---

## VIII. Công nghệ áp dụng

| Lớp | Công nghệ | Ghi chú |
|-----|-----------|---------|
| Frontend | Next.js 16 · React 19 · TypeScript | App Router, SSR/SSG |
| Admin | Next.js 16 · @j-ta/ui | Dashboard nội bộ |
| Backend | NestJS 11 · class-validator · Helmet | Module architecture |
| ORM / DB | Prisma 5 · PostgreSQL 16 | 28 models, migrations |
| Auth | JWT · bcryptjs | USER / ADMIN roles |
| API Docs | Swagger UI · OpenAPI 3.0 | `/swagger` |
| DevOps | Docker Compose · pnpm monorepo | Postgres, Redis, MinIO, Mailpit |
| Test | Playwright e2e · Jest/Supertest | Smoke + health |
| Assets | Local `/public/assets/jetbay` | 164+ files mirrored |

---

## IX. Cây thư mục mã nguồn (tóm tắt)

```
baogia/
├── apps/web/          → 29 pages, components/home|layout|forms|pages|charter
├── apps/admin/        → dashboard/* + content/about-us|booking-process
├── apps/api/          → controllers(17) · services(13) · prisma/schema(28 models)
├── packages/ui/       → @j-ta/ui shared components
├── scripts/           → download-jetbay-assets, rebrand-jta
├── docs/              → API, DATABASE, DEPLOYMENT, báo giá
├── tests/             → Playwright + API tests
└── docker-compose.yml
```

**Cổng chạy local:** Web `http://localhost:3000` · Admin `http://localhost:3001` · API `http://localhost:4000/swagger`

---

## X. Ma trận trang Web (29 route)

| # | Route | API / CMS | Form |
|---|-------|-----------|------|
| 1 | `/` | fixed-price, empty-legs, jet-card | Quote widget |
| 2 | `/private-jet-charter` | Static + aircraft carousel | Quote |
| 3–7 | charter service ×5 | Static | Quote |
| 8–9 | `/fixed-price-charter` | API routes | Book form |
| 10–11 | `/empty-leg` | API | Request form |
| 12–13 | `/jet-card`, `/travel-credit` | API | Enquiry |
| 14–15 | `/destination`, `/island-destinations` | API destinations | — |
| 16–19 | news, blogs, video, article | CMS | — |
| 20–21 | `/about-us`, `/booking-process` | CMS JSON | — |
| 22–24 | partner, world-cup ×2 | API / static | Campaign forms |
| 25 | `/jetbay-private-jet-app` | Static | — |
| 26–27 | login, register | Auth API | — |
| 28 | `/account` | /me, bookings | — |

---

## XI. Ma trận API (nhóm)

| Nhóm | Endpoints | Admin CRUD |
|------|-----------|------------|
| Auth | register, login, refresh, /me | — |
| Quotes & Bookings | search-aircraft, request, bookings/* | admin/bookings |
| Commercial | fixed-price, empty-legs, jet-card, travel-credits | admin/* |
| Content | news, blogs, videos, destinations, pages | admin/content/* |
| Partners | programs, applications | admin/partners |
| Campaign | world-cup | — |
| Dashboard | stats, audit, health | — |

---

## XII. Database — 28 bảng

`User` · `Company` · `QuoteRequest` · `QuoteLeg` · `QuoteOffer` · `Booking` · `Payment` · `Document` · `Airport` · `AircraftCategory` · `AircraftModel` · `Operator` · `FixedPriceRoute` · `EmptyLegOffer` · `JetCardPlan` · `JetCardAccount` · `TravelCreditLedger` · `PartnerProgram` · `PartnerApplication` · `ContentArticle` · `ContentTranslation` · `Video` · `Destination` · `WorldCupMatch` · `AuditLog` · *(và 3 bảng phụ)*

---

## XIII. Deliverables bàn giao

1. Mã nguồn monorepo (Git) — web, admin, api, ui  
2. PostgreSQL schema + migrations + seed  
3. Docker Compose + `docs/DEPLOYMENT.md`  
4. Swagger `/swagger` + `docs/API.md`  
5. Tài khoản admin demo + hướng dẫn CMS  
6. Bộ test Playwright + hướng dẫn chạy  
7. Asset J-TA (logo, favicon, OG) + thư viện ảnh marketing  

---

## XIV. Phụ lục tùy chọn — Module AI gán nhãn (NVIDIA TAO 5.5 + GroundingDINO)

*Áp dụng khi khách hàng yêu cầu **công cụ gán nhãn Vision AI** (tách hợp đồng hoặc gói mở rộng). Chi tiết kỹ thuật: [`docs/PHU_LUC_AI_GAN_NHAN_TAO_GROUNDINGDINO.md`](./PHU_LUC_AI_GAN_NHAN_TAO_GROUNDINGDINO.md)*

### Trả lời nhanh cho khách hàng

| Câu hỏi | Trả lời |
|---------|---------|
| TAO có AI gán nhãn — gắn vào công cụ được không? | **Có** — pipeline text prompt → box → mask, gọi qua GPU worker phía sau UI gán nhãn. |
| NVIDIA tính phí /1 lần gán nhãn? | **Không** — TAO miễn phí; chi phí là **GPU** (~$0,5–3/giờ). Minh Tiến có thể đóng gói giá theo ảnh/gói tháng. |
| GroundingDINO khi chốt HĐ? | **Có** — [IDEA-Research/GroundingDINO](https://github.com/IDEA-Research/GroundingDINO) + bản TAO commercial trong [TAO 5.5](https://developer.nvidia.com/blog/new-foundational-models-and-training-capabilities-with-nvidia-tao-5-5/). |

### Bảng giá phụ lục (chưa VAT)

| Mã | Hạng mục | Giá (VNĐ) |
|----|----------|-----------|
| L1 | Web Labeling Studio (project, canvas, export COCO/YOLO) | 28.000.000 |
| L2 | API + Job queue + storage | 18.000.000 |
| L3 | **GroundingDINO worker** (text → auto box) | 22.000.000 |
| L4 | Mask Auto-Label segmentation (TAO MAL) | 15.000.000 |
| L5 | Admin + usage dashboard | 10.000.000 |
| | **Gói AI-LABEL-01 (L1–L5)** | **93.000.000** |
| T1–T3 | TAO Enterprise pipeline + TensorRT (tùy chọn) | +45.000.000 |

**Lợi ích:** giảm 50–80% thời gian gán nhãn; open-vocabulary (đổi class bằng text prompt); segmentation mask ~10× rẻ hơn gán thủ công.

---

## XV. Điều khoản

1. **Quyền sở hữu mã nguồn:** Bàn giao 100% cho Bên A sau thanh toán đợt 4.  
2. **NDA:** Ký trước khi trao đổi dữ liệu kinh doanh nhạy cảm.  
3. **Báo cáo tuần:** Email/portal — done / in-progress / kế hoạch tuần tới.  
4. **Phạm vi giá:** Chưa gồm VAT 10%, VPS/Cloud, domain, SSL (Bên A hoặc phụ lục).  
5. **Phát sinh:** OAuth provider keys, Stripe merchant, dịch thuật chuyên ngành — báo giá riêng.  
6. **Bảo hành:** 60 ngày sửa lỗi nghiêm trọng sau go-live (không gồm tính năng mới).

---

## XVI. Liên hệ & chấp nhận báo giá

| Bên A (Khách hàng) | Bên B (Minh Tiến Solutions) |
|--------------------|----------------------------|
| Họ tên: _______________ | Nguyễn Minh Tiến |
| Chức vụ: _______________ | Giám đốc Kỹ thuật |
| Ngày: _______________ | Ngày: 30/06/2026 |
| Chữ ký: _______________ | Email: minhtiensolutions@gmail.com |

---

*Báo giá tương tác: [https://m-tien.com/jet-bay/](https://m-tien.com/jet-bay/) · Tài liệu kỹ thuật: `docs/DANH_GIA_KY_THUAT_BAO_GIA.md` · Phụ lục AI gán nhãn: `docs/PHU_LUC_AI_GAN_NHAN_TAO_GROUNDINGDINO.md`*
