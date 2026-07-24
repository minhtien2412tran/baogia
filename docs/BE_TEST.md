# Backend Test — JetBay API

**Canonical tài liệu test BE.** Cập nhật: **2026-07-21**  
**Audit domain:** [BE_AUDIT.md](./BE_AUDIT.md) · **Triển khai:** [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md)

---

## 1. Tổng quan

| Môi trường | API | Docs | Port bind |
|------------|-----|------|-----------|
| **Local** | `http://127.0.0.1:4000` | `http://127.0.0.1:4000/swagger` | `apps/api/.env` |
| **Production** | `https://api.minhtien.online` | `https://docs.minhtien.online/swagger` | `127.0.0.1:3010` PM2 `jetbay-be` |

**Kết quả mới nhất (prod — 2026-07-20 báo giá/hợp đồng):**

| Bộ | Script | Pass |
|----|--------|------|
| Báo giá + HĐ | `smoke-bao-gia-contracts.mjs` | **PASS** (locale · pricing · PDF/Word · DocuSign mock) |
| Admin CRUD | `smoke-admin-crud.mjs` | **16/16** |
| Web contract | `smoke-web-api.mjs` | **pass** |
| Auth + booking | `smoke-auth-booking.mjs` | fallback admin · tránh chạy sát login throttle |
| BE smoke | `smoke-prod.sh` | partial nếu openapi/login 429 — chạy riêng sau cooldown |

**Local 21/07 (Admin ops waves):** API + Admin `tsc --noEmit` **PASS**. Chưa deploy — sau deploy cần smoke: `GET /admin/payments`, `GET /admin/export/quotes?format=csv`, `PATCH /admin/quotes/:id/status` với SALES JWT.

---

## 2. Ma trận test ↔ domain BE

| BE_AUDIT § | Domain | Script chính | Case |
|------------|--------|--------------|------|
| §1 | Architecture & runtime | `smoke-prod.sh`, `smoke-docs.sh` | health, root, openapi, integrations |
| §2 | Auth | `smoke-prod.sh`, `smoke-docs.sh` | login, CORS docs, ApiKey 401 |
| §3 | Quotes & offers | `smoke-prod.sh`, `smoke-admin-crud.mjs`, **`smoke-bao-gia-contracts.mjs`** | request + locale persist + search |
| §4 | Bookings | `smoke-auth-booking.mjs`, **`smoke-bao-gia-contracts.mjs`** | JWT → `POST /bookings` · PDF/Word export |
| §5 | Payments | `smoke-docs.sh` | `GET /integrations/status` |
| §6 | Commercial | `smoke-prod.sh`, `smoke-web-api.mjs` | FP, EL, JetCard, TC |
| §7 | Content & media | `smoke-prod.sh`, `smoke-admin-crud.mjs` | news, destinations, videos, pages |
| §8 | Admin ops | `smoke-prod.sh`, `smoke-admin-crud.mjs` | dashboard stats, airports CRUD |
| §8b | Admin payments/export | *(sau deploy)* curl JWT | `GET /admin/payments` · `/admin/export/*` |
| §9 | Integrations | `smoke-docs.sh` | integrations status, MinIO/pay flags |
| §11 | RBAC / Permissions | `permission.service.spec.ts` (unit) | ADMIN bypass; StaffGuard ops controllers (21/07 local) |
| §12 | Contracts / e-sign | **`smoke-bao-gia-contracts.mjs`** | draft→approve→mock DocuSign→webhook |
| §13 | Content-Sync / Media | `media-*.integration.spec.ts`, `content-sync-*.spec.ts` | ⚠️ **cần Postgres** |
| §14 | Pricing engine | `pricing.engine.spec.ts` + **`smoke-bao-gia-contracts.mjs`** | `POST /pricing/estimate` |
| §15 | i18n / Account / Ops-mail | unit specs + quote locale smoke | `/i18n`, locale on QuoteRequest |

> **Cập nhật 2026-07-20:** `smoke-bao-gia-contracts.mjs` phủ §3/§4/§12/§14 (prod PASS). G4 keys (SMTP/OAuth/Stripe live) vẫn Owner-blocked.

---

## 3. `smoke-prod.sh` — 16 case

**Script:** `scripts/deploy/jetbay-be/smoke-prod.sh`  
**Env:** `BASE_URL` (default `https://api.minhtien.online`), `API_KEY` hoặc đọc `/var/www/jetbay-be/.env`

| # | Case | Method / path | Expect | BE § |
|---|------|---------------|--------|------|
| 1 | health public | `GET /health` | 200, không cần key | §1 |
| 2 | root | `GET /` | 200 | §1 |
| 3 | openapi | `GET /openapi.json` + key | 200 | §1 |
| 4 | openapi no key | `GET /openapi.json` | 200 | §1 |
| 5 | fixed-price | `GET /fixed-price/routes` | 200 | §6 |
| 6 | empty-legs | `GET /empty-legs` | 200 | §6 |
| 7 | jet-card | `GET /jet-card/plans` | 200 | §6 |
| 8 | travel-credits | `GET /travel-credits/packages` | 200 | §6 |
| 9 | news | `GET /content/news` | 200 | §7 |
| 10 | destinations | `GET /content/destinations?limit=5` | 200 | §7 |
| 11 | airports | `GET /airports/search?q=SGN` | 200 | §8 |
| 12 | partners | `GET /partners/programs` | 200 | §8 |
| 13 | ApiKey guard | `GET /fixed-price/routes` **không** key | **401** | §2 |
| 14 | auth login | `POST /auth/login` admin | 200/201 | §2 |
| 15 | admin stats | `GET /admin/dashboard/stats` Bearer | 200 | §8 |
| 16 | quote request | `POST /quotes/request` | 200/201 | §3 |

```bash
# Prod (trên VPS)
bash /tmp/smoke-prod.sh

# Local
BASE_URL=http://127.0.0.1:4000 API_KEY=<from apps/api/.env> bash scripts/deploy/jetbay-be/smoke-prod.sh
```

**Lưu ý prod:** login thử `admin@jetbay.local`; prod seed có thể dùng `admin@j-ta.local` — `smoke-admin-crud.mjs` thử cả hai.

---

## 4. `smoke-docs.sh` — 11 case

**Script:** `scripts/deploy/jetbay-be/smoke-docs.sh`

| # | Case | URL | Expect | BE § |
|---|------|-----|--------|------|
| 1 | docs health | `https://docs.minhtien.online/health` | 200 | §1 |
| 2 | swagger UI | `https://docs.minhtien.online/swagger` | 200 | §1 |
| 3 | openapi.json (docs) | proxy → BE | 200 | §1 |
| 4 | openapi.yaml (docs) | proxy → BE | 200 | §1 |
| 5 | swagger (api) | `https://api.minhtien.online/swagger` | 200 | §1 |
| 6 | openapi.json (api) | direct | 200 | §1 |
| 7 | openapi.yaml (api) | direct | 200 | §1 |
| 8 | server default | `servers[0].url` | `https://api.minhtien.online` | §1 |
| 9 | CORS preflight | OPTIONS login, Origin docs | `Access-Control-Allow-Origin: https://docs.minhtien.online` | §2 |
| 10 | login docs origin | `POST /auth/login` + Origin docs | 200/201 | §2 |
| 11 | integrations | `GET /integrations/status` | 200 | §9 |

**Swagger UI thủ công:**
1. Hard refresh `https://docs.minhtien.online/swagger`
2. Server = **Production** (`https://api.minhtien.online`)
3. **Authorize** → `X-API-Key`
4. `POST /auth/login` → copy `accessToken` → **Authorize** Bearer
5. Gọi endpoint cần test

**Patch env (idempotent):** `scripts/deploy/jetbay-be/fix-prod-swagger-env.sh`

---

## 5. `smoke-admin-crud.mjs` — 16 case

**Script:** `scripts/deploy/jetbay-be/smoke-admin-crud.mjs`  
**Env:** `API_URL`, `API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

| # | Case | Route | Ghi chú |
|---|------|-------|---------|
| 1 | health | `GET /health` | |
| 2 | admin login | `POST /auth/login` | thử `admin@jetbay.local` rồi `admin@j-ta.local` |
| 3 | quotes list | `GET /admin/quotes?limit=5` | §3 |
| 4 | quotes status patch | `PATCH /admin/quotes/:id/status` | idempotent, restore status |
| 5 | quotes detail | `GET /admin/quotes/:id` | §3 |
| 6 | operators list | `GET /admin/operators` | §3 |
| 7 | quotes create offer | `POST /admin/quotes/:id/offers` | skip nếu thiếu data |
| 8 | airports list | `GET /admin/airports?limit=5` | §8 |
| 9 | airports create | `POST /admin/airports` | IATA test `T**` |
| 10 | airports update | `PATCH /admin/airports/:id` | |
| 11 | airports delete | `DELETE /admin/airports/:id` | cleanup |
| 12 | videos list | `GET /admin/content/videos` | §7 |
| 13 | cms pages list | `GET /admin/content/pages` | §7 |
| 14 | cms page get | `GET /admin/content/pages/:id` | |
| 15 | partners list | `GET /admin/partners/applications` | §8 |
| 16 | travel-credit packages | `GET /admin/travel-credits/packages` | §6 |

```powershell
$env:API_URL='https://api.minhtien.online'
$env:API_KEY='<from env>'
node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
```

---

## 6. `smoke-web-api.mjs` — 8 case

**Script:** `scripts/deploy/jetbay-be/smoke-web-api.mjs`  
Kiểm tra contract mà `apps/web` gọi (public + quote).

| # | Case | Path | Assert |
|---|------|------|--------|
| 1 | fixed-price | `GET /fixed-price/routes` | `routes.length > 0` |
| 2 | empty-legs | `GET /empty-legs` | `emptyLegs.length > 0` |
| 3 | jet-card | `GET /jet-card/plans` | `plans.length > 0` |
| 4 | travel-credits | `GET /travel-credits/packages` | `packages.length > 0` |
| 5 | news | `GET /content/news?locale=en` | `news.length >= 1` |
| 6 | destinations | `GET /content/destinations?limit=5` | `destinations.length > 0` |
| 7 | airports | `GET /airports/search?q=SGN` | `airports.length > 0` |
| 8 | quote | `POST /quotes/request` | 200/201 |

---

## 6b. `smoke-auth-booking.mjs` — 4 case

**Script:** `scripts/deploy/jetbay-be/smoke-auth-booking.mjs`  
Gọi từ `run-node-smokes.sh` / `smoke-all.sh`. Fallback admin nếu thiếu `demo@jetbay.local`; retry khi login 429.

| # | Case | Expect |
|---|------|--------|
| 1 | demo/admin login | 200/201 + accessToken |
| 2 | refresh token | 200/201 + accessToken |
| 3 | booking create | 201 + id |
| 4 | bookings my | 200 + count >= 1 |

## 6c. `smoke-bao-gia-contracts.mjs` — báo giá + hợp đồng (74TR)

**Script:** `scripts/deploy/jetbay-be/smoke-bao-gia-contracts.mjs`  
Scope tham chiếu [m-tien.com/jet-bay](https://m-tien.com/jet-bay/) / [JETBAY_BAO_GIA.md](./JETBAY_BAO_GIA.md).

| # | Case | Expect |
|---|------|--------|
| 1 | admin + user JWT | login OK (demo fallback admin) |
| 2 | `POST /quotes/request` locale=vi | 201 + admin detail `locale=vi` |
| 3 | `POST /quotes/search-aircraft` | options + pricingMode |
| 4 | `POST /pricing/estimate` | estimatedTotal |
| 5 | `POST /bookings` + PDF/Word export | application/pdf + msword |
| 6 | contracts create→submit→approve→DocuSign mock→webhook | SENT_FOR_SIGNATURE + 201 |

**Prod 2026-07-20:** `RESULT pass` (sau deploy API).

## 7. Unit test (`jest`)

```powershell
cd apps/api
pnpm exec tsc --noEmit
pnpm test
```

| Suite | Tests | Phạm vi |
|-------|-------|---------|
| `app.controller.spec.ts` | root/health metadata | §1 |
| `services.spec.ts` | URL builder, helpers | util |
| `auth` / guards | (nếu có) | §2 |

**Hiện tại:** 3 suites · **9 tests** pass.

---

## 8. Test thủ công (chưa automation)

| Case | Cách test | BE § | Ghi chú |
|------|-----------|------|---------|
| ~~`POST /bookings`~~ | `smoke-auth-booking.mjs` | §4 | ✅ auto 2026-07-10 |
| Payment intent/confirm | JWT + quote/booking id | §5 | Cần sandbox keys G4 |
| Stripe/OnePay/9Pay webhook | POST signed payload | §5 | Chỉ khi có merchant |
| OAuth Google/Apple | `POST /auth/oauth/*` | §2 | Cần client IDs |
| SMS OTP | `POST /auth/otp/send` | §2 | Cần SMS provider |
| Document PDF export | `GET /documents/.../export` | §4 | UAT GĐ4 |
| Media upload | `POST /admin/media` multipart | §7 | MinIO hiện `error` trên prod |

---

## 9. Integrations status (prod 2026-07-10)

`GET https://api.minhtien.online/integrations/status`

| Key | Prod | Block deploy GĐ1? |
|-----|------|-------------------|
| `smtp` | `true` | Không |
| `minio` | `local` | Không (GĐ1 dùng UPLOAD_PATH) |
| `googleOAuth` | `false` | Không (G4) |
| `appleOAuth` | `false` | Không (G4) |
| `stripe` / `onepay` / `ninepay` | `false` | Không (G4) |
| `sms` | `false` | Không (G4) |

---

## 10. Chạy full suite (prod)

```bash
# Windows: upload scripts
scp scripts/deploy/jetbay-be/smoke-*.sh scripts/deploy/jetbay-be/smoke-*.mjs \
  scripts/deploy/jetbay-be/run-node-smokes.sh root@103.200.20.100:/tmp/

ssh root@103.200.20.100 'bash /tmp/smoke-all.sh'
```

`smoke-all.sh` gọi lần lượt: `smoke-prod` · `smoke-docs` · `run-node-smokes`.

---

## 11. Khi nào chạy test nào

| Sự kiện | Bắt buộc |
|---------|----------|
| PR / merge `feat/api-*` | `tsc` + `jest` + smoke local |
| Deploy API prod | full suite §10 |
| Deploy admin only | `smoke-admin-crud.mjs` |
| Deploy web only | `smoke-web-api.mjs` + curl pages |
| Sửa Swagger/CORS/env | `smoke-docs.sh` |
| Rotate secrets | `smoke-prod.sh` + login + admin stats |

---

## 12. Log kết quả

| Ngày | Môi trường | Kết quả |
|------|------------|---------|
| 2026-07-10 | prod full retest | 16+11+16+8 pass, jest 9/9 |
| 2026-07-10 | **GĐ1 đóng prod** | 55/55 pass · `APP_ENV=production` · [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) |
| 2026-07-24 | prod BE harden | health OK · smtp deliverable · `smoke-error-envelope.sh` → `VALIDATION_FAILED`+`requestId` PASS · backup `jetbay-be-20260724-113424` |

---

## Liên kết

[BE_AUDIT.md](./BE_AUDIT.md) · [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md) · [API.md](./API.md) · [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md) · [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md)
