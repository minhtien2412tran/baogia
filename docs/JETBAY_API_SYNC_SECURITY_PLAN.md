# JetBay — API sync audit + Security roadmap

> Date: **2026-07-13** · Branch context: `jetvina` · Auditor: live probe (local + prod)  
> Related: [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) · [JETBAY_SECURITY_VS_FEATURES.md](./JETBAY_SECURITY_VS_FEATURES.md) · [JETBAY_INTEGRATIONS_STATUS.md](./JETBAY_INTEGRATIONS_STATUS.md) · [BE_TEST.md](./BE_TEST.md)

---

## 0. Surfaces under test

| Surface | URL | Role |
|---------|-----|------|
| API local | `http://127.0.0.1:4000` | NestJS `APP_ENV=development` |
| API prod | `https://api.minhtien.online` | NestJS `APP_ENV=production` · PM2 `jetbay-be` `:3010` |
| Swagger / OpenAPI | `https://docs.minhtien.online/swagger` (+ `/openapi.json`) | Same OpenAPI as prod API |
| Web prod | `https://www.minhtien.online` | Next.js → **prod API** |
| Web local | `http://localhost:3000` | Next.js → **`NEXT_PUBLIC_API_URL=https://api.minhtien.online`** (prod) |

---

## 1. Verdict — API đồng bộ?

### 1.1 Contract (OpenAPI) — **ĐỒNG BỘ**

| Check | Local `:4000` | Prod `api.minhtien.online` | Docs `docs.minhtien.online` |
|-------|---------------|----------------------------|-----------------------------|
| OpenAPI path count | **173** | **173** | **173** (byte size = prod) |
| Path set diff | — | **0 only-local / 0 only-prod** | docs size == api size |
| Version | `1.0.0` | `1.0.0` | — |
| `/airports/nearby` | ✅ | ✅ | ✅ |
| `/quotes/search-aircraft` | ✅ | ✅ | ✅ |
| Operator admin paths | 4 matches | 4 matches | — |
| Swagger UI | 200 | 200 | 200 |

**Kết luận contract:** local API ↔ prod API ↔ docs **đi cùng nhau** (cùng route surface sau deploy `jetvina`).

### 1.2 Behaviour smoke — **ĐỒNG BỘ hành vi auth / routing**

| Endpoint | Local | Prod | Notes |
|----------|-------|------|-------|
| `GET /health` | 200 · `development` | 200 · `production` | env khác nhau — đúng |
| `GET /airports` no key | **401** | **401** | ApiKeyGuard OK |
| `GET /airports` bad key | **401** | **401** | timing-safe compare |
| `GET /airports` good key | **200** | **200** | |
| `GET /airports/nearby` | 200 · n=1 (SGN) | 200 · n=1 (SGN) | |
| `POST /quotes/search-aircraft` | 201 · **1** option · POSITIONING | 201 · **3** options · POSITIONING | **data diverge** (seed) |
| `GET /i18n/config` | 200 | 200 | |
| `GET /integrations/status` | 200 | 200 | |
| `GET /admin/operators` (API key, no JWT) | **401** | **401** | AdminGuard OK |

### 1.3 FE ↔ API wiring — **ĐỒNG BỘ với prod API**

| Check | Result |
|-------|--------|
| `apps/web/.env.local` → `NEXT_PUBLIC_API_URL` | `https://api.minhtien.online` |
| Local API key len == web key len | 64 = 64 · **keys_equal=True** |
| Web key works on prod | OK |
| Web key works on local API | OK (local `.env` synced to same key) |
| Local key works on prod | OK (**same key** — see risk S2) |
| Web `/en-us` local + prod | 200 |
| Payment chips `/placeholders/payment/visa.svg` | 200 both |
| HTML leak of API key string | **Not found** in prod home HTML |

**Kết luận FE:** Web local và Web prod đều gọi **cùng prod API** → UI local phản ánh BE prod. Local API (`:4000`) chủ yếu cho admin/e2e/dev; **không** phải backend mặc định của web local.

### 1.4 Gaps đồng bộ (không phải contract)

| Gap | Severity | Detail |
|-----|----------|--------|
| Quote options local 1 vs prod 3 | Low | DB seed / fleet khác nhau — expected |
| OpenAPI JSON bytes local 88072 vs prod 87984 | Info | Cùng 173 paths; khác server list / description (dev vs prod) |
| Web local không trỏ `:4000` | Info by design | Muốn test BE local: đổi `NEXT_PUBLIC_API_URL` + sync key |

---

## 2. Security posture (snapshot 2026-07-13)

### 2.1 Controls đã có (PASS)

| Control | Evidence |
|---------|----------|
| **X-API-Key** global (`ApiKeyGuard`) | 401 without / bad key; timingSafeEqual |
| **JWT + AdminGuard** | `/admin/operators` → 401 without Bearer |
| **Helmet** | `X-Content-Type-Options`, `Referrer-Policy`, `CORP=cross-origin` |
| **HSTS** (edge) | `max-age=31536000; includeSubDomains` |
| **CORS allowlist** | Not `*` — origins from `CORS_ORIGIN` |
| **ValidationPipe** | whitelist + forbidNonWhitelisted |
| **Auth throttle** | login/register/OTP/refresh `@Throttle` |
| **Prod boot guards** | refuses weak JWT / API_KEY / PAYMENT_SECRET |
| **Bind loopback** | prod host `127.0.0.1:3010` behind Nginx |
| **Secrets not in HTML** | no API key literal in `/en-us` |
| **Separate DB** | `jetbay_db` (not HomeFix) |
| **Redis** | `ok` on `/integrations/status` |
| **Media rights gate** | JetBay CDN blocked; JetVina hotlink blocked in prod |

### 2.2 Prod integrations flags (no secrets)

From `GET /integrations/status` (prod):

| Flag | Value | Note |
|------|-------|------|
| jwt / refresh | true | |
| database | up | |
| redis | ok | |
| smtp | **true** | configured (verify deliverability separately) |
| minio | local | upload path fallback |
| googleOAuth / appleOAuth | false | G4 — chờ KH |
| stripe / onepay / ninepay | false | G4 — chờ KH |
| sms | false | G4 — chờ KH |

### 2.3 Findings / risks

| ID | Risk | Severity | Notes |
|----|------|----------|-------|
| **S1** | `NEXT_PUBLIC_API_KEY` is public by design | **Medium** | Bundled into browser JS; ApiKey = app id, not user secret. Still rotate if leaked widely; pair with throttle + WAF. |
| **S2** | Local `.env` API_KEY == prod API_KEY | **Medium** | Convenient DX; laptop compromise ≈ prod app-key. Prefer distinct local key + document “web→prod” vs “admin→local”. |
| **S3** | Swagger / OpenAPI public on prod | **Low–Med** | Aids attackers mapping admin surface. Mitigate: basic-auth / IP allowlist / disable UI in prod (keep JSON internal). |
| **S4** | Duplicate security headers | **Low** | e.g. `X-Frame-Options=SAMEORIGIN,DENY` (Nginx + Helmet). Clean to single source. |
| **S5** | Helmet CSP disabled on API | **Info** | Intentional for API; ensure **web/admin** CSP is strong. |
| **S6** | Seed demo passwords | **High before handover** | `admin@jetbay.local` / `demo@jetbay.local` — rotate before KH go-live ([SECURITY_SECRETS.md](./SECURITY_SECRETS.md)). |
| **S7** | Payment / OAuth / SMS off | **Info** | Code ready; no live payment surface until G4 keys. |
| **S8** | Quote / search abuse | **Medium** | Auth throttled; public quote search may need dedicated throttle + bot protection. |
| **S9** | Media / copyright | **Ongoing** | Prefer placeholders / client-approved assets; footer payment chips fixed 2026-07-13. |
| **S10** | Header stacking / CORP | **Info** | `CORP=cross-origin` needed for browser clients; review if tightening later. |

---

## 3. Proposed security development plan

### Phase A — Stabilize (1–3 days) · **P0**

1. **Document API topology** in onboarding: web local → prod API; local `:4000` for BE/admin e2e.  
2. **Separate local API_KEY** from prod (optional flag `USE_PROD_API=true` for web).  
3. **Fix duplicate headers** on Nginx vs Helmet (one owner per header).  
4. **Throttle** `POST /quotes/search-aircraft` + `POST /quotes/request` (e.g. 30/min/IP).  
5. **Smoke script** `scripts/smoke-api-sync.mjs` — compare OpenAPI path sets local↔prod in CI/manual.

### Phase B — Harden edge & docs (3–7 days) · **P1**

1. Protect Swagger: HTTP basic auth **or** Cloudflare Access **or** `APP_ENV=production` → disable `/swagger` UI (keep internal openapi).  
2. Rate-limit at Nginx / Cloudflare for `/auth/*`, `/quotes/*`, `/newsletter/*`.  
3. Add **security.txt** + contact; ensure TLS grade A (HSTS already on).  
4. Admin: force HTTPS-only cookies if any session cookies; prefer Bearer-only (current).  
5. Audit `@Public()` list — every public route justified.

### Phase C — Identity & G4 (when KH keys) · **P1/P2**

1. Rotate seed admin/demo passwords; enforce password policy.  
2. OAuth (Google/Apple) with state/nonce; no account takeover via email collision.  
3. Payment webhooks: signature verify (`PAYMENT_SECRET` / Stripe signing secret).  
4. SMS OTP: `OTP_COOLDOWN_SECONDS`, `OTP_MAX_ATTEMPTS`, never log OTP in production.  
5. Optional: refresh-token family / reuse detection.

### Phase D — Continuous (ongoing) · **P2**

1. Dependency audit (`pnpm audit`) on release; Dependabot/Renovate.  
2. Quarterly `rotate-secrets.sh` ([SECURITY_SECRETS.md](./SECURITY_SECRETS.md)).  
3. Backup / restore drill for `jetbay_db`.  
4. Media rights workflow — no production publish of UNVERIFIED assets.  
5. Lightweight pen-test checklist before customer handover (auth bypass, IDOR on bookings/quotes, admin permission matrix).

---

## 4. Suggested backlog (tickable)

- [x] Script so sánh OpenAPI paths local vs prod (exit ≠ 0 nếu lệch) — `scripts/smoke-api-sync.mjs` (2026-07-13)
- [x] Throttle quote search / request — `quotes` bucket 30/20 per min (2026-07-13)
- [ ] Split local vs prod `API_KEY`
- [ ] Lock down Swagger UI on prod
- [ ] Deduplicate Nginx/Helmet headers
- [ ] Rotate demo users before handover
- [ ] Cloudflare / Nginx rate limit auth+quote
- [ ] G4: OAuth + payment webhook verify + OTP env
- [ ] Pen-test / IDOR pass on bookings & account
- [x] Document “web local uses prod API” in [ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md)

---

## 5. How to re-run this audit

```powershell
# From repo root — do not print secrets
# 1) Health + ApiKey behaviour
Invoke-WebRequest http://127.0.0.1:4000/health -UseBasicParsing
Invoke-WebRequest https://api.minhtien.online/health -UseBasicParsing

# 2) OpenAPI path parity
# Compare (ConvertFrom-Json).paths keys — expect equal counts and empty set diff

# 3) Integrations (flags only)
# GET https://api.minhtien.online/integrations/status  + X-API-Key

# 4) Web surfaces
Invoke-WebRequest http://localhost:3000/en-us -UseBasicParsing
Invoke-WebRequest https://www.minhtien.online/en-us -UseBasicParsing
```

Live flags (no secrets): https://api.minhtien.online/integrations/status  
Swagger: https://docs.minhtien.online/swagger

---

## 6. Bottom line

| Question | Answer |
|----------|--------|
| Local API ↔ Prod API **contract** sync? | **Yes** — 173/173 paths, zero diff |
| Docs ↔ Prod API sync? | **Yes** — identical OpenAPI byte size |
| Web local ↔ Web prod ↔ API? | **Yes for API target** — both web envs call **prod** API; keys synced |
| Local API **data** == prod data? | **No** — e.g. search options 1 vs 3 (seed); OK for dev |
| Security baseline? | **Solid for GĐ1** (ApiKey + JWT + Helmet + throttle + loopback) |
| Next security focus? | Phase A/B: quote throttle, Swagger lock, key separation, header cleanup; then G4 + handover password rotate |
