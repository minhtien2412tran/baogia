# Backend Audit — JetBay API

**Canonical BE audit.** Cập nhật: **2026-07-24** (global exception filter + fireAndForget mail; trước: báo giá/hợp đồng 2026-07-20)
**Code:** `apps/api` · **Prod:** https://api.minhtien.online · **Swagger:** https://docs.minhtien.online/swagger  
**Kiến trúc mục tiêu:** [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md)

Mỗi phần dùng cùng template: Mục tiêu · Routes · Models · Status · Gaps · Smoke.

---

## Local run status (2026-07-18, máy Windows nhánh `jetvina`)

| Bước | Kết quả |
|------|---------|
| `pnpm install` (+ prisma/sharp builds) | ✅ |
| `pnpm --filter @jetbay/i18n build` (bắt buộc trước API — API import `@jetbay/i18n`) | ✅ |
| `pnpm --filter @jetbay/api exec tsc --noEmit` | ✅ 0 error (sau khi build i18n) |
| `pnpm --filter @jetbay/api test` (jest) | ⚠️ **52 pass / 18 fail** — 18 fail đều do **thiếu Postgres `127.0.0.1:5432`** (integration spec content-sync/media/permissions), không phải lỗi code |
| `pnpm db:up` (docker) | ❌ Docker Desktop engine trả 500 (WSL2 chưa lên) — chưa migrate/seed/run được API |
| `prisma migrate deploy` / `seed` / API `:4000` | ⛔ blocked bởi Docker |

**Kết luận:** code **build & typecheck chuẩn**; chưa xác nhận runtime `:4000` vì DB local chưa lên. Cần Docker Desktop chạy (hoặc Postgres ngoài) rồi: `pnpm db:up` → `prisma migrate deploy` → `prisma:seed` → `start:dev`.

> ⚠️ **Gap tài liệu:** các domain §11–§15 dưới đây có trong code nhưng **thiếu** ở bản audit 2026-07-10. Ma trận test [BE_TEST.md](./BE_TEST.md) chưa phủ RBAC / Contracts / Content-Sync / Pricing / i18n.

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
| **Gaps** | ~~Prod `APP_ENV=development`~~ → **production** ✅ 2026-07-10. MinIO → `local` (UPLOAD_PATH). |
| **Smoke** | `smoke-prod.sh` **16/16** · `smoke-docs.sh` **11/11** · `smoke-admin-crud.mjs` **16/16** · `smoke-web-api.mjs` **8/8** (2026-07-10) |

Guards order: Throttler → ApiKey. JWT/Admin gắn per-controller. Boot `assertProductionSecrets()` khi `APP_ENV=production`.

**Error control (2026-07-24):**
- Global `AllExceptionsFilter` (`APP_FILTER`) — envelope `{ statusCode, code, message, error, path, timestamp, requestId }` · header `X-Request-Id`
- Prod ẩn message 500 · map Prisma `P2002→409` / `P2025→404` / `P2003→400`
- `fireAndForget()` cho mail/notify (booking/quote/auth/…) — không unhandledRejection
- Storage thiếu config → `503 SERVICE_UNAVAILABLE` · pricing engine miss airport → `400` (không còn 500 generic)
- Unit: `all-exceptions.filter.spec.ts`
- **Deploy prod:** `jetbay-be-20260724-113424` · health `ok` · `integrations.smtp=true` · smoke `smoke-error-envelope.sh` → `VALIDATION_FAILED` + `requestId` **PASS**

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
| **Gaps** | `Company` / `SavedSearch` chưa có API. Search aircraft dùng pricing engine khi có fleet (`POSITIONING`); fallback `CATEGORY_FLAT`. |
| **Smoke** | `smoke-admin-crud.mjs` · `POST /quotes/request` · **`smoke-bao-gia-contracts.mjs`** (locale persist + search) |

---

## 4. Bookings & documents

| | |
|--|--|
| **Mục tiêu** | Tạo / xem / hủy booking; charter agreement |
| **Routes** | `POST /bookings` (**JWT**, `userId` từ token) · `GET /bookings/my`, `GET /bookings/:id`, `PATCH /bookings/:id/cancel` · Admin bookings CRUD status · `GET /documents/charter-agreements/:id[/export]` |
| **Models** | `Booking`, `BookingPassenger`, `Document` |
| **Status** | **solid** |
| **Gaps** | Document terms còn boilerplate. Guest booking không còn (bắt login). Word export ✅ (Word 2003 XML `.doc`). |
| **Smoke** | Login → `POST /bookings` · `smoke-bao-gia-contracts.mjs` PDF/Word export |

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
| **Gaps** | ~~Admin form FP chưa edit `options[]`~~ → đã có UI tier editor (2026-07-10). |
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

## 11. RBAC / Permissions *(mới — chưa có ở audit 2026-07-10)*

| | |
|--|--|
| **Mục tiêu** | Phân quyền chi tiết theo permission thay cho boolean admin |
| **Routes** | `/admin/permissions/*` (`AdminPermissionsController`) · guard `PermissionGuard` + `@RequirePermissions(...)` + `permission.catalog.ts` |
| **Models** | `RolePermission`, `UserPermissionOverride`, `UserAirportScope` |
| **Status** | **partial → ops-core migrated (21/07 local)** — engine + catalog + guard OK; **StaffGuard+PermissionGuard** trên dashboard, quotes (+status), bookings (đã có), users, aircraft, FP/EL/jet-card/travel-credit, partners; export `quote|booking|user|payment|contract.export` |
| **Gaps** | Data scope R5 · orphan content_* catalog keys · deprecate/remove unused `AdminGuard` file. Re-seed SALES `content.*` / `settings.*` nếu staff cần CMS. |
| **Smoke** | `permission.service.spec.ts` · `smoke-admin-crud` 16/16 · `smoke-r4-settings-audit.sh` **PASS** (audit/health/brand) |

---

## 12. Contracts & e-signature *(mới)*

| | |
|--|--|
| **Mục tiêu** | Hợp đồng operator: draft → approve workflow → DocuSign |
| **Routes** | `GET/POST /admin/contracts[/templates][/:id]` · `POST /admin/contracts/:id/{submit,approve,reject,request-changes,send-docusign}` · `@Public POST /webhooks/docusign` (HMAC) — tất cả admin dùng `PermissionGuard` (`contract.*`) |
| **Models** | `ContractTemplate`, `OperatorContract`, `ContractApprovalHistory`, `SignatureWebhookEvent` |
| **Status** | **solid** code · DocuSign **mock** (`SIGNATURE_PROVIDER=mock`) |
| **Gaps** | Live DocuSign chờ keys KH (`DOCUSIGN_*`). |
| **Smoke** | `smoke-bao-gia-contracts.mjs` — create→submit→approve→send-docusign→webhook **PASS** prod 2026-07-20 |

---

## 13. Content-Sync & Media pipeline *(mới)*

| | |
|--|--|
| **Mục tiêu** | Nguồn nội dung → discover → review → publish/rollback + rights + media asset lifecycle |
| **Routes** | `@Public GET /content/brand`, `/content/media-assets` · admin (`PermissionGuard`): `/admin/content-sources/*`, `/admin/content-sync/{discover,jobs,items,publish,rollback}`, `/admin/content-rights/*`, `/admin/media-assets/*` (approve-staging/production/block/import-manifest), `/admin/site-settings/brand`, `/admin/content-cleanup/jetbay` |
| **Models** | `ContentSource`, `ContentSourceRecord`, `ContentProvenance`, `ContentRights`, `ContentSyncJob`, `ContentSyncItem`, `ContentVersion`, `MediaAsset`, `SiteSetting` |
| **Status** | **solid** code (flag-gated: `CONTENT_SYNC_*`, `EXTERNAL_MEDIA_IMPORT_ENABLED`) · **SAFE_REFERENCE_MODE** |
| **Gaps** | Integration spec cần Postgres (18 jest fail hiện tại nằm đây). Production publish chờ rights `OWNED\|LICENSED\|CLIENT_PROVIDED`. |
| **Smoke** | `media-*.integration.spec.ts`, `content-sync-{publish,rollback}.integration.spec.ts` (cần DB) |

---

## 14. Pricing engine *(mới — tách khỏi §3)*

| | |
|--|--|
| **Mục tiêu** | Ước tính giá charter (positioning + round-trip + về base) độc lập `BASE_PRICE_BY_CATEGORY` |
| **Routes** | `@Public POST /pricing/estimate` · JWT: `GET /pricing/bookings/:id/breakdown`, `POST /pricing/bookings/:id/recalculate`, `POST /pricing/bookings/:bookingId/attach/:estimateId` |
| **Models** | `PricingEstimate`, `Aircraft`, `AircraftLocationHistory`, `BookingFlightLeg` |
| **Status** | **solid** — `pricing.engine.spec.ts` pass (unit) |
| **Gaps** | — |
| **Smoke** | `pricing.engine.spec.ts` (unit) · `smoke-bao-gia-contracts.mjs` `POST /pricing/estimate` |

---

## 15. i18n / Account / Ops-mail *(mới)*

| | |
|--|--|
| **Mục tiêu** | Locale API · account dashboard KH · operator users + email templates |
| **Routes** | `/i18n/*` (`I18nController` + `LocaleService`, `@jetbay/i18n`) · JWT `GET /account/dashboard` · admin `/admin/operators`, `/admin/email-templates` |
| **Models** | `OperatorUser`, `EmailTemplate`, `EmailSubscriber`, `EmailCampaignLog` |
| **Status** | **solid** |
| **Gaps** | Email templates gửi thật vẫn chờ SMTP provider (P0 Owner). |
| **Smoke** | `email-template.service.spec.ts`, `flight-notify.service.spec.ts` (unit) |

---

## 10. Priority backlog

| Pri | Item | Notes |
|-----|------|-------|
| **P1** | ~~Set prod `APP_ENV=production`~~ | ✅ 2026-07-10 |
| **P1** | G4 keys từ KH | SMTP, OAuth, Stripe/OnePay/9Pay, SMS |
| **P1** | ~~Đồng nhất guard admin R4~~ | ✅ CMS/media/settings/audit · `AdminGuard` unused · còn R5 scope |
| **P2** | ~~Smoke HTTP domain mới~~ | ✅ 2026-07-20 `smoke-bao-gia-contracts.mjs` (quotes/locale · pricing · PDF/Word · contracts) |
| **P2** | Nest feature modules | Auth + Quotes (phase 1) → xem BE_ARCHITECTURE; Commercial/Bookings/Content/Admin còn phẳng |
| **P2** | Split `dto.ts` theo module | Sau khi modules ổn định |
| **P2** | ~~Global exception filter + safe notify~~ | ✅ 2026-07-24 |
| **P2** | ~~Admin FP options UI~~ | ✅ 2026-07-10 |
| **P3** | Company / SavedSearch APIs | Schema sẵn (`Company`, `SavedSearch`), chưa có API |

**Đã đóng (2026-07-10):** booking JWT spoof · OTP CSPRNG · SMS APP_ENV · CORS admin · FP DTO validators · QuoteOffer admin · Redis connect-once.  
**Đã đóng (2026-07-20):** `QuoteRequest.locale` persist · Word export charter · smoke báo giá/hợp đồng prod PASS.  
**Đã đóng (2026-07-24):** `AllExceptionsFilter` · Prisma map · `fireAndForget` mail · storage/pricing HTTP errors.

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
| [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md) | **Admin/RBAC SoT** — role × permission × UI × API guard |
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
