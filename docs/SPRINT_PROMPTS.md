# Sprint Prompts — J-TA Platform

> Tài liệu ghi nhớ tiến trình phát triển và audit code theo [`deep-research-report (2).md`](../deep-research-report%20(2).md).
>
> **Quy tắc:** Chạy từng prompt một. Không gộp nhiều sprint trong một lần — dễ bỏ sót, code lỗi hoặc dựng nửa vời.
>
> **Sau mỗi sprint:** Dùng [Prompt kiểm tra sau mỗi bước](#prompt-kiểm-tra-sau-mỗi-bước) để audit trước khi chuyển sprint tiếp theo.

---

## Bảng tiến độ

Cập nhật cột **Trạng thái** sau mỗi sprint: `⬜ Chưa làm` · `🟡 Đang làm` · `✅ Xong` · `🔍 Đã audit`

| # | Sprint | Trạng thái | Ghi chú audit (cập nhật 2026-06-29) |
|---|--------|------------|-------------------------------------|
| 00 | Quy tắc tổng | 🟡 | Monorepo clean-room, không copy asset gốc JETBAY |
| 01 | Monorepo | ✅ | `pnpm-workspace.yaml`, `apps/web`, `apps/admin`, `apps/api` |
| 02 | Web app | 🟡 | Next.js scaffold + 25+ route `[locale]` |
| 03 | Admin app | 🟡 | Dashboard skeleton pages, chưa kết nối API |
| 04 | API base | 🟡 | NestJS + Swagger `/swagger`, `/openapi.json` |
| 05 | Docker | ✅ | `docker-compose.yml`: Postgres, Redis, MinIO, Mailpit |
| 06 | UI package | ✅ | `packages/ui` — PageShell, Card, DataTable, Button, Input |
| 07 | Design tokens | ✅ | `packages/ui/src/tokens.ts` shared colors/spacing |
| 08 | Home page | ✅ | API-driven home with quote widget, routes, empty legs |
| 09 | Header/menu | 🟡 | `SiteHeader` in UI package, basic nav links |
| 10 | Service pages | 🟡 | charter, corporate, event… skeleton routes |
| 11 | Fixed Price | ✅ | Web + API DB-backed routes |
| 12 | Empty Leg | ✅ | Web + API DB-backed listings |
| 13 | Jet Card / Travel Credit | ✅ | Web pages + API packages/plans |
| 14 | Partner | 🟡 | Web route + API mock |
| 15 | Content pages | ✅ | news wired; blogs/video/destination routes exist |
| 16 | Legal/cookie | 🟡 | `/article/[slug]` route |
| 17 | Prisma schema | ✅ | Schema đầy đủ User, Quote, Booking, CMS… |
| 18 | Auth API | ✅ | JWT, bcrypt, OAuth Google/Apple, SMS OTP, refresh revoke |
| 19 | Airports/Aircraft API | ✅ | Search + admin aircraft CRUD |
| 20 | Quote API | ✅ | `POST /quotes/request` persists to DB |
| 21 | Booking API | ✅ | Prisma persist, audit log, admin status/cancel |
| 22 | Commercial API | ✅ | Fixed Price, Empty Leg, Jet Card, Travel Credits + admin CRUD |
| 23 | Content CMS API | ✅ | News/blogs/videos/destinations + admin CRUD, i18n translations |
| 24 | Admin API overview | ✅ | `/admin/dashboard/*`, audit-logs, system-health |
| 25 | Kết nối web ↔ API | ✅ | `apps/web/src/lib/api.ts`, key pages wired |
| 26 | Kết nối admin ↔ API | ✅ | `apps/admin/src/lib/api.ts`, dashboard + lists |
| 27 | Admin CRUD hoàn chỉnh | ✅ | Fixed/empty/jet-card/users/destinations/media/aircraft/articles |
| 28 | User account portal | ✅ | login/register/OAuth/OTP, quotes, jet-card, payments, documents |
| 29 | Form UX và validation | 🟡 | Quote widget + login forms; not all pages |
| 30 | Responsive audit | 🟡 | CSS grid auto-fill; full audit pending |
| 31 | SEO metadata | ✅ | `buildMetadata` + `generateMetadata` on key pages |
| 32 | Testing setup | ✅ | Playwright e2e + API health tests |
| 33 | Security audit | ✅ | Helmet, Throttler, JWT+AdminGuard, refresh revoke, CORS |
| 34 | Performance audit | 🟡 | Redis service, pagination; Lighthouse chưa chạy |
| 35 | Final QA và bàn giao | ✅ | E2E 9/9 pass, QA_REPORT 2026-07-09 |

**Sprint tiếp theo đề xuất:** Production deploy (Docker stack, env secrets, OnePay/9Pay sandbox, i18n full site)

---

## Thứ tự chạy

```
00 Quy tắc tổng
01 Monorepo
02 Web app
03 Admin app
04 API base
05 Docker
06 UI package
07 Design tokens
08 Home page
09 Header/menu
10 Service pages
11 Fixed Price
12 Empty Leg
13 Jet Card/Travel Credit
14 Partner
15 Content pages
16 Legal/cookie
17 Prisma schema
18 Auth API
19 Airports/Aircraft API
20 Quote API
21 Booking API          ← TIẾP THEO
22 Commercial API
23 Content API
24 Admin API
25 Connect web API
26 Connect admin API
27 Admin CRUD
28 Account portal
29 Form UX
30 Responsive audit
31 SEO metadata
32 Testing
33 Security
34 Performance
35 Final QA
```

---

## Prompt kiểm tra sau mỗi bước

Dùng prompt này sau khi AI làm xong từng sprint:

```
Hãy kiểm tra lại toàn bộ phần vừa làm.

Yêu cầu:
1. Chạy lint/build/test nếu có.
2. Kiểm tra route có lỗi 404 không.
3. Kiểm tra console error.
4. Kiểm tra TypeScript error.
5. Kiểm tra import path sai.
6. Kiểm tra file nào bị thiếu.
7. Không sửa lan man ngoài phạm vi.
8. Nếu có lỗi, sửa triệt để rồi báo cáo.

Báo cáo theo format:
- Kết quả kiểm tra:
- Lỗi đã phát hiện:
- Lỗi đã sửa:
- File đã sửa:
- Lệnh đã chạy:
- Còn tồn tại:
```

---

## PROMPT 21 — Booking API

**Sprint:** 3.5

Triển khai Sprint 3.5: Code Booking module.

**Yêu cầu endpoint:**
- `POST /bookings`
- `GET /bookings/my`
- `GET /bookings/:id`
- `PATCH /bookings/:id/cancel`
- `GET /admin/bookings`
- `GET /admin/bookings/:id`
- `PATCH /admin/bookings/:id/status`

**Booking gồm:**
- `quoteId` optional
- `userId` optional
- `itinerary`
- `passengers`
- `contact`
- `status`
- `paymentStatus`
- `documents` placeholder

**Status:**
- `draft`
- `pending`
- `confirmed`
- `in_progress`
- `completed`
- `cancelled`

Có Swagger, DTO, validation, audit log.

---

## PROMPT 22 — Commercial API

**Sprint:** 3.6

Triển khai Sprint 3.6: Code commercial modules.

**Modules:**
1. Fixed Price
2. Empty Legs
3. Jet Card
4. Travel Credits

**Endpoint cần có:**

**Fixed Price:**
- `GET /fixed-price/routes`
- `GET /fixed-price/routes/:slug`
- `POST /admin/fixed-price/routes`
- `PATCH /admin/fixed-price/routes/:id`
- `DELETE /admin/fixed-price/routes/:id`

**Empty Legs:**
- `GET /empty-legs`
- `GET /empty-legs/:slug`
- `POST /empty-legs/:id/request`
- CRUD admin

**Jet Card:**
- `GET /jet-card/plans`
- `POST /jet-card/enquiries`
- CRUD admin plans

**Travel Credits:**
- `GET /travel-credits/packages`
- `POST /travel-credits/enquiries`
- `GET /admin/travel-credits/transactions`

Có DTO, Swagger, seed data.

---

## PROMPT 23 — Content CMS API

**Sprint:** 3.7

Triển khai Sprint 3.7: Code Content CMS API.

**Yêu cầu endpoint public:**
- `GET /content/pages/:slug`
- `GET /content/news`
- `GET /content/news/:slug`
- `GET /content/blogs`
- `GET /content/blogs/:slug`
- `GET /content/videos`
- `GET /content/destinations`

**Yêu cầu endpoint admin:**
- CRUD `/admin/content/pages`
- CRUD `/admin/content/articles`
- CRUD `/admin/content/videos`
- CRUD `/admin/content/destinations`

**Article fields:**
- `title`
- `slug`
- `excerpt`
- `content`
- `category`
- `type`: `news` / `blog`
- `thumbnail`
- `seoTitle`
- `seoDescription`
- `status`
- `publishedAt`

Có pagination, filter, search.  
Có Swagger đầy đủ.

---

## PROMPT 24 — Admin API overview

**Sprint:** 3.8

Triển khai Sprint 3.8: Code Admin Dashboard API overview.

**Endpoint:**
- `GET /admin/dashboard/stats`
- `GET /admin/dashboard/recent-quotes`
- `GET /admin/dashboard/recent-bookings`
- `GET /admin/dashboard/revenue-demo`
- `GET /admin/audit-logs`
- `GET /admin/system-health`

**Yêu cầu:**
1. Dữ liệu lấy từ database.
2. Nếu chưa có payment thật thì revenue dùng demo calculation.
3. API phải có JWT guard + role admin.
4. Swagger rõ ràng.
5. Admin dashboard frontend sẽ dùng endpoint này.

---

## PROMPT 25 — Kết nối web với API

**Sprint:** 4.1

Triển khai Sprint 4.1: Kết nối public website Next.js với API.

**Yêu cầu:**
1. Tạo API client trong `apps/web/lib/api`.
2. Dùng env:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
3. Kết nối:
   - Airport autocomplete với `/airports/search`
   - Fixed Price listing/detail với API
   - Empty Leg listing/detail với API
   - News/Blogs/Video với API
   - Quote request form submit vào `/quotes/request`
4. Giữ fallback mock data nếu API lỗi, nhưng phải log warning rõ ràng.
5. Form phải có loading, success, error state.
6. Không hardcode API URL trực tiếp trong component.

---

## PROMPT 26 — Kết nối admin với API

**Sprint:** 4.2

Triển khai Sprint 4.2: Kết nối admin dashboard với API.

**Yêu cầu:**
1. Tạo API client trong `apps/admin/lib/api`.
2. Tạo auth store đơn giản:
   - login
   - logout
   - save token
   - attach Bearer token
3. Kết nối:
   - `/dashboard` với `/admin/dashboard/stats`
   - `/quotes` với `/admin/quotes`
   - `/bookings` với `/admin/bookings`
   - `/fixed-price` với admin CRUD
   - `/empty-legs` với admin CRUD
   - `/content` với CMS API
   - `/partners` với Partner API nếu có
4. Table có loading, empty, error state.
5. Form edit/create dùng modal hoặc page riêng.
6. Không cần phân quyền phức tạp, nhưng route admin phải check token.

---

## PROMPT 27 — Admin CRUD hoàn chỉnh

**Sprint:** 4.3

Triển khai Sprint 4.3: Hoàn thiện CRUD admin cho các module chính.

**Module cần CRUD:**
1. Airports
2. Aircraft Models
3. Fixed Price Routes
4. Empty Leg Offers
5. Jet Card Plans
6. Content Articles
7. Content Pages
8. Videos
9. Partner Applications status

**Yêu cầu UI:**
- Data table
- Search
- Filter status nếu có
- Create button
- Edit action
- Delete confirm
- Status badge
- Pagination

**Yêu cầu code:**
- Form validation client-side
- API error message rõ ràng
- Không reload toàn trang nếu không cần

---

## PROMPT 28 — User account portal

**Sprint:** 4.4

Triển khai Sprint 4.4: Tạo user account portal public.

**Route:**
- `/login`
- `/register`
- `/account`
- `/account/profile`
- `/account/quotes`
- `/account/bookings`
- `/account/jet-card`
- `/account/travel-credits`

**Yêu cầu:**
1. Login/register kết nối Auth API.
2. Account layout riêng.
3. Hiển thị quotes/bookings của user.
4. Jet Card và Travel Credit hiển thị demo balance nếu chưa có account thật.
5. Route account phải yêu cầu login.
6. UI đồng bộ với public website.

---

## PROMPT 29 — Form UX và validation

**Sprint:** 5.1

Triển khai Sprint 5.1: Chuẩn hóa toàn bộ form UX.

**Form cần kiểm tra:**
- Search widget
- Quote request
- Partner application
- Jet Card enquiry
- Travel Credit enquiry
- Login/register
- Admin create/edit forms

**Yêu cầu:**
1. Có validation rõ ràng.
2. Có loading state.
3. Có success message.
4. Có error message từ API.
5. Có disabled state.
6. Có consent checkbox nơi cần.
7. Không submit trùng nhiều lần.
8. Mobile dễ bấm, field đủ cao.

---

## PROMPT 30 — Responsive audit

**Sprint:** 5.2

Triển khai Sprint 5.2: Audit responsive toàn bộ giao diện.

**Breakpoint cần test:**
- 390px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

**Kiểm tra:**
1. Header mobile menu
2. Hero section
3. Search widget
4. Cards grid
5. Detail pages
6. Forms
7. Tables admin
8. Sidebar admin
9. Legal pages
10. Article detail

Sửa toàn bộ lỗi tràn ngang, chữ quá nhỏ, nút khó bấm, spacing không đều.

---

## PROMPT 31 — SEO metadata

**Sprint:** 5.3

Triển khai Sprint 5.3: Bổ sung SEO metadata cho public website.

**Yêu cầu:**
1. Mỗi page có:
   - `title`
   - `description`
   - canonical placeholder
   - Open Graph
   - Twitter card
2. Content lấy từ mock JSON hoặc API content.
3. Article detail dùng metadata theo bài viết.
4. Fixed Price detail dùng metadata theo route.
5. Empty Leg detail dùng metadata theo offer.
6. Không dùng keyword spam.
7. Tạo helper `generateMetadata` dùng chung.

---

## PROMPT 32 — Testing setup

**Sprint:** 6.1

Triển khai Sprint 6.1: Cài đặt test.

**Yêu cầu:**

**Backend:**
- Jest
- Supertest
- Test health endpoint
- Test auth login/register basic
- Test quote request validation

**Frontend:**
- Playwright
- Test home page load
- Test mobile menu open
- Test quote form required validation
- Test fixed price listing page
- Test admin login page

**Root scripts:**
- `test`
- `test:api`
- `test:e2e`

CI chưa cần, chỉ cần local chạy được.

---

## PROMPT 33 — Security audit cơ bản

**Sprint:** 6.2

Triển khai Sprint 6.2: Security hardening cơ bản.

**Yêu cầu backend:**
1. Helmet
2. CORS config từ env
3. Rate limit
4. ValidationPipe whitelist
5. Sanitize input nếu cần
6. JWT secret từ env
7. Không log password/token
8. Guard admin routes
9. Error response không lộ stack production

**Yêu cầu frontend:**
1. Không lưu thông tin nhạy cảm ngoài token demo.
2. Không `dangerouslySetInnerHTML` nếu chưa sanitize.
3. Form có CSRF note nếu cần production.

Cập nhật `SECURITY.md`.

---

## PROMPT 34 — Performance audit

**Sprint:** 6.3

Triển khai Sprint 6.3: Performance audit.

**Yêu cầu:**
1. Next.js image optimization placeholder.
2. Lazy load section nặng.
3. Split component nếu page quá lớn.
4. API pagination cho listing.
5. Database index cho:
   - `slug`
   - `status`
   - `createdAt`
   - `email`
   - `airport code`
6. Admin table không render quá nhiều item cùng lúc.
7. Chạy Lighthouse hoặc ghi checklist performance nếu không chạy được.

Cập nhật `docs/performance-checklist.md`.

---

## PROMPT 35 — Final QA và bàn giao

**Sprint:** 7.1

Triển khai Sprint 7.1: Final QA và handover.

**Yêu cầu:**

**1. Kiểm tra chạy local:**
- `docker compose up -d`
- `pnpm install`
- `pnpm dev`
- web `localhost:3000`
- admin `localhost:3001`
- api `localhost:4000`
- swagger `localhost:4000/swagger`

**2. Kiểm tra flow:**
- Home search
- Quote request
- Fixed Price detail
- Empty Leg request
- Login/register
- Admin dashboard
- Admin quote status update
- Content CRUD

**3. Tạo tài liệu:**
- `README.md` hoàn chỉnh
- `docs/API.md`
- `docs/DATABASE.md`
- `docs/DEPLOYMENT.md`
- `docs/FEATURE_MATRIX.md`
- `docs/QA_REPORT.md`

**4. Báo cáo cuối gồm:**
- Đã hoàn thành gì
- Module nào còn mock
- Module nào đã dùng database thật
- Lỗi còn lại
- Cách chạy dự án
- Bước tiếp theo để production

---

## Audit snapshot — đối chiếu `deep-research-report`

Báo cáo nghiên cứu yêu cầu clone clean-room với đủ lớp: **marketing đa locale**, **quote/booking**, **account/auth**, **partner/loyalty**. Trạng thái hiện tại:

| Nhóm chức năng (báo cáo) | Route web | API | DB schema | Ghi chú |
|--------------------------|-----------|-----|-----------|---------|
| Home + search widget | 🟡 skeleton | ⬜ | ✅ QuoteRequest | Chưa autocomplete airport |
| Fixed Price | 🟡 | ✅ DB | ✅ persist | Web chưa wire |
| Empty Leg | 🟡 | ✅ DB | ✅ persist | Web chưa wire |
| Jet Card | 🟡 | ✅ DB | ✅ persist | Web chưa wire |
| Travel Credits | 🟡 | ✅ DB | ✅ persist | Web chưa wire |
| Partner program | 🟡 | 🟡 mock | ✅ PartnerApplication | Chưa admin review |
| News/Blogs/Video | 🟡 | ✅ DB | ✅ ContentArticle | Web chưa wire |
| Booking flow | ⬜ | ✅ DB | ✅ Booking | Sprint 21 done; web chưa wire |
| Account portal | ⬜ | 🟡 mock auth | ✅ User | Sprint 28 |
| Admin dashboard | 🟡 skeleton | ⬜ | ✅ AuditLog | Sprint 24–27 |
| World Cup campaign | 🟡 route | ⬜ | — | Form chưa wire API |
| Legal pages | 🟡 | ✅ DB | ✅ PAGE/LEGAL | Cookie banner chưa có |

**Kết luận audit:** Scaffold monorepo + schema DB đã sẵn sàng. Phần lớn API đang mock in-memory. Sprint tiếp theo hợp lý là **21 Booking API** rồi **22 Commercial API** để khớp schema Prisma đã có.

---

## Nhật ký thay đổi

| Ngày | Sprint | Ghi chú |
|------|--------|---------|
| 2026-06-29 | 23 | Content CMS API: translations, Destination model, admin CRUD |
| 2026-07-09 | 35 | Final QA: GĐ4 auth/payments, MinIO, E2E 9/9, DEPLOYMENT, FEATURE_MATRIX |
