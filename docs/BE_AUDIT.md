# Backend Audit — JetBay API

**Canonical BE audit.** Cập nhật: **2026-07-10**  
**Code:** `apps/api` · **Prod:** https://api.minhtien.online · **Swagger:** https://docs.minhtien.online/swagger  
**Kiến trúc mục tiêu:** [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md)

Mỗi phần dùng cùng template: Mục tiêu · Routes · Models · Status · Gaps · Smoke.

---

## 0. Tổng quan

| Hạng mục | Giá trị |
|----------|---------|
| Framework | NestJS + Prisma 5/6 + PostgreSQL |
| Local port | `4000` (`.env`) |
| Prod port | `127.0.0.1:3010` (PM2 `jetbay-be`) |
| Global guards | `ThrottlerGuard` → `ApiKeyGuard` |
| Route guards | `JwtAuthGuard`, `AdminGuard`, `OptionalJwtAuthGuard` |
| Validation | `ValidationPipe` whitelist + `forbidNonWhitelisted` |
| Delivery | G1 PASS · G3 PASS · G4 code sẵn, chờ keys KH |

**Seed demo:** `admin@jetbay.local` / `Admin123!` · `demo@jetbay.local` / `Demo123!`  
(Prod có thể còn `@j-ta.local` nếu chưa re-seed.)

---

## 1. Architecture & runtime

| | |
|--|--|
| **Mục tiêu** | Boot an toàn, CORS allowlist, Swagger, health |
| **Routes** | `GET /`, `GET /health`, `GET /integrations/status`, `/swagger`, `/openapi.json`, `/openapi.yaml` (`@Public`) |
| **Models** | — |
| **Status** | **solid** |
| **Gaps** | Prod `.env` còn `APP_ENV=development` (nên `production` khi secrets đủ mạnh). CORS đã gồm `admin` + `www` + `docs.minhtien.online`. `API_PUBLIC_URL=https://api.minhtien.online` ✅. Helmet `crossOriginResourcePolicy: cross-origin`. |
| **Smoke** | `smoke-prod.sh` **16/16** · `smoke-docs.sh` **11/11** · `smoke-admin-crud.mjs` **16/16** · `smoke-web-api.mjs` **8/8** (2026-07-10) |

Guards order: Throttler → ApiKey. JWT/Admin gắn per-controller. Boot `assertProductionSecrets()` khi `APP_ENV=production`.

---

## 2. Auth

| | |
|--|--|
| **Mục tiêu** | Đăng ký / đăng nhập JWT + refresh; OAuth/OTP theo G4 |
| **Routes** | `POST /auth/register\|login\|refresh\|logout` · `POST /auth/oauth/google\|apple` · `POST /auth/otp/send\|verify-*` · `GET /me` (JWT) |
| **Models** | `User`, `UserAuthProvider`, `RefreshToken`, `OtpCode` |
| **Status** | **solid** (OAuth/SMS ENV-gated) |
| **Gaps** | OTP: CSPRNG ✅ · SMS `APP_ENV` ✅ · G4: chờ `GOOGLE_CLIENT_ID` / Apple / SMS provider. |
| **Smoke** | `POST /auth/login` + `X-API-Key` → accessToken |

Throttle: login 10/min · register/OTP/refresh 5/min (tier `auth`).

---

## 3. Quotes & offers

| | |
|--|--|
| **Mục tiêu** | Báo giá charter + admin gửi offer |
| **Routes** | Public: `POST /quotes/search-aircraft`, `POST /quotes/request` (optional JWT → `userId`) · JWT: `GET /quotes/my` · Campaign: `GET/POST /campaigns/world-cup/*` · Admin: `GET /admin/quotes`, `GET /admin/quotes/:id`, `PATCH /admin/quotes/:id/status`, `POST /admin/quotes/:id/offers`, `GET /admin/operators` |
| **Models** | `QuoteRequest`, `QuoteLeg`, `QuoteOffer`, `Operator`, `WorldCupMatch`, `WorldCupItinerary`, `ConsentLog` |
| **Status** | **solid** (offer workflow admin ✅) |
| **Gaps** | `Company` / `SavedSearch` chưa có API. Search aircraft vẫn dùng `BASE_PRICE_BY_CATEGORY` (v1). |
| **Smoke** | `smoke-admin-crud.mjs` (quotes list/detail/offer) · `POST /quotes/request` |

---

## 4. Bookings & documents

| | |
|--|--|
| **Mục tiêu** | Tạo / xem / hủy booking; charter agreement |
| **Routes** | `POST /bookings` (**JWT**, `userId` từ token) · `GET /bookings/my`, `GET /bookings/:id`, `PATCH /bookings/:id/cancel` · Admin bookings CRUD status · `GET /documents/charter-agreements/:id[/export]` |
| **Models** | `Booking`, `BookingPassenger`, `Document` |
| **Status** | **solid** |
| **Gaps** | Document terms còn boilerplate. Guest booking không còn (bắt login). |
| **Smoke** | Login → `POST /bookings` với Bearer |

---

## 5. Payments

| | |
|--|--|
| **Mục tiêu** | Intent / confirm / hold / OnePay / 9Pay / Stripe webhook |
| **Routes** | `POST /payments/intent\|confirm\|hold\|gateway` · `GET /payments/my` (JWT) · `@Public` Stripe webhook + OnePay/9Pay return/IPN |
| **Models** | `Payment` |
| **Status** | **solid** code · **partial** prod (chờ merchant keys) |
| **Gaps** | G4 keys. Fallback amount `12500` khi không có `QuoteOffer`. Order ref prefix `jbay-`. |
| **Smoke** | `GET /integrations/status` · IPN chỉ test khi có sandbox keys |

---

## 6. Commercial

| | |
|--|--|
| **Mục tiêu** | Fixed Price · Empty Leg · Jet Card · Travel Credit |
| **Routes** | Public list/quote/enquiry · Admin CRUD `/admin/fixed-price/routes`, `/admin/empty-legs`, `/admin/jet-card/plans`, `/admin/travel-credits/*` |
| **Models** | `FixedPriceRoute/Option`, `EmptyLegOffer`, `JetCardPlan/Account/Transaction`, `TravelCreditPackage`, `TravelCreditLedger` |
| **Status** | **solid** (DB-backed; DTO validators FP/EL/JetCard ✅ 2026-07-10) |
| **Gaps** | Admin form FP chưa edit `options[]` chi tiết trên UI (API hỗ trợ). |
| **Smoke** | Admin Save Fixed Price → 200 · `smoke-web-api.mjs` public lists |

---

## 7. Content & media

| | |
|--|--|
| **Mục tiêu** | CMS news/blogs/pages/videos/destinations + upload |
| **Routes** | Public `/content/*`, newsletter · Admin `/admin/content/*`, `/admin/media*` · Serve `/media/:key` |
| **Models** | `ContentArticle`, `ContentTranslation`, `ContentCategory`, `Video`, `Destination` |
| **Status** | **solid** |
| **Gaps** | MinIO optional; default bucket `jetbay-uploads`. DTO content cần đủ `class-validator` (sweep). |
| **Smoke** | `GET /content/news` · admin videos/pages list |

---

## 8. Admin ops

| | |
|--|--|
| **Mục tiêu** | Dashboard, users, airports, aircraft, partners, audit |
| **Routes** | `/admin/dashboard/*`, `/admin/users`, `/admin/airports`, `/admin/aircraft/*`, `/admin/partners/*`, `/admin/audit-logs`, `/admin/system-health` |
| **Models** | `Airport`, `AircraftCategory/Model`, `Partner*`, `AuditLog` |
| **Status** | **solid** |
| **Gaps** | — |
| **Smoke** | `smoke-admin-crud.mjs` → pass=16 |

---

## 9. Integrations & ops

| | |
|--|--|
| **Mục tiêu** | Email/SMS/Redis/MinIO/Payment readiness không lộ secret |
| **Routes** | `GET /integrations/status`, `GET /admin/system-health` |
| **Models** | — (env-driven) |
| **Status** | **partial** (code sẵn, keys G4 chờ KH) |
| **Gaps** | SMTP / OAuth / payment / SMS. Redis connect-once ✅. |
| **Smoke** | `GET /integrations/status` |

**Prod env checklist:** `DATABASE_URL=jetbay_db` · `PORT=3010` · `CORS_ORIGIN` gồm admin+www · `MINIO_BUCKET=jetbay-uploads` · không overwrite `.env` khi sync.

---

## 10. Priority backlog

| Pri | Item | Notes |
|-----|------|-------|
| **P1** | Set prod `APP_ENV=production` | Sau khi xác nhận secrets mạnh + SMS không cần `devCode` |
| **P1** | G4 keys từ KH | SMTP, OAuth, Stripe/OnePay/9Pay, SMS |
| **P2** | Nest feature modules | Auth + Quotes (phase 1) → xem BE_ARCHITECTURE |
| **P2** | Split `dto.ts` theo module | Sau khi modules ổn định |
| **P2** | Admin FP options UI | API đã nhận `options[]` |
| **P3** | Company / SavedSearch APIs | Schema sẵn, ngoài DoD G1 |

**Đã đóng (2026-07-10):** booking JWT spoof · OTP CSPRNG · SMS APP_ENV · CORS admin · FP DTO validators · QuoteOffer admin · Redis connect-once.

---

## DTO whitelist compliance

Mọi body DTO dùng với `ValidationPipe` **phải** có decorator `class-validator` trên từng property. Thiếu decorator → `property X should not exist` (400).

| DTO group | Validators |
|-----------|------------|
| Auth, Airport, TC package, Quote status/offer | ✅ |
| Fixed Price / Empty Leg / Jet Card admin | ✅ (2026-07-10) |
| Content article/page/video/destination | ✅ (2026-07-10) |
| Booking create nested + payment intent/confirm | ✅ (2026-07-10) |

---

## Doc map

| Doc | Vai trò |
|-----|---------|
| [BE_TEST.md](./BE_TEST.md) | **Smoke / unit / ma trận test ↔ domain** |
| [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md) | Target modules + phase refactor |
| [API.md](./API.md) | URL / endpoint cheat sheet |
| [DATABASE.md](./DATABASE.md) | Prisma / migrate / seed |
| [JETBAY_SECURITY_VS_FEATURES.md](./JETBAY_SECURITY_VS_FEATURES.md) | Security vs báo giá |
| [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) | Rotate secrets |
| [JETBAY_DELIVERY_CHECKLIST.md](./JETBAY_DELIVERY_CHECKLIST.md) | G0–G4 DoD |
| [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md) | Keys checklist |
| [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) | Progress board |

## Local commands

```powershell
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed
pnpm --filter @jetbay/api start:dev
# smoke
$env:API_URL='http://127.0.0.1:4000'
node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
node scripts/deploy/jetbay-be/smoke-web-api.mjs
```
