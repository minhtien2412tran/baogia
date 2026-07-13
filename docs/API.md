# JetVina API — Reference

> Source of truth for **live** operations: Swagger UI (OpenAPI).  
> This file is the human onboarding companion. Security/sync audit: [JETBAY_API_SYNC_SECURITY_PLAN.md](./JETBAY_API_SYNC_SECURITY_PLAN.md).

---

## 1. Environments

| | Local | Production |
|--|-------|------------|
| **API base** | `http://127.0.0.1:4000` | `https://api.minhtien.online` |
| **Swagger UI** | http://127.0.0.1:4000/swagger | https://docs.minhtien.online/swagger |
| **OpenAPI JSON** | http://127.0.0.1:4000/openapi.json | https://api.minhtien.online/openapi.json · https://docs.minhtien.online/openapi.json |
| **OpenAPI YAML** | http://127.0.0.1:4000/openapi.yaml | https://api.minhtien.online/openapi.yaml |
| **Health** | `GET /health` | same |
| **Integrations** | `GET /integrations/status` | flags only — **no secrets** |
| **Web** | http://localhost:3000 | https://www.minhtien.online |
| **Admin** | http://localhost:3001 | https://admin.minhtien.online |
| **TS client** | `packages/api-client` | `pnpm openapi:client:prod` |

**Contract sync check:**

```bash
pnpm smoke:api-sync
# Expect: local ↔ prod ↔ docs paths identical
```

OpenAPI title: **JetVina API** · Version: `APP_VERSION` (default `1.0.0`).  
Every operation has **summary + description**; tags are documented in Swagger.

### Đa ngôn ngữ + UI

| | |
|--|--|
| Ngôn ngữ | `en` · `vi` · `zh-cn` (picker góc trên Swagger) |
| URL | `https://docs.minhtien.online/swagger?lang=vi` |
| OpenAPI | `https://docs.minhtien.online/openapi.json?lang=vi` |
| UI | Theme tối responsive (mobile/tablet/desktop), filter, Try-it-out lớn |

Đổi ngôn ngữ → reload; intro + mô tả tag + hint auth theo locale. Summary kỹ thuật endpoint giữ tiếng Anh để khớp code.

---

## 2. Authentication

In Swagger → **Authorize**:

| Scheme | Header | Purpose |
|--------|--------|---------|
| **X-API-Key** | `X-API-Key: <API_KEY>` | App identification (global `ApiKeyGuard`) |
| **bearer** | `Authorization: Bearer <accessToken>` | User / admin JWT from `POST /auth/login` |

**Public (no API key):** `GET /`, `GET /health`, `/swagger`, `/openapi.json`, `/openapi.yaml`.

Secrets: [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) · never commit `.env`.

### Quick Start (Swagger)

1. Authorize **X-API-Key**.
2. `POST /auth/login` with demo or staff account → copy `accessToken`.
3. Authorize **bearer**.
4. Try `GET /me` or `GET /admin/dashboard/stats` (ADMIN).
5. Quote smoke: `POST /quotes/search-aircraft` with body:

```json
{
  "tripType": "ONE_WAY",
  "legs": [
    {
      "fromAirport": "SGN",
      "toAirport": "DAD",
      "departureDate": "2026-08-01T08:00:00.000Z",
      "passengers": 4
    }
  ]
}
```

---

## 3. Endpoint map (by tag)

> Full parameter schemas live in Swagger. Below is the operational index.

### System

| Method | Path | Auth | Summary |
|--------|------|------|---------|
| GET | `/` | Public | API root index + links |
| GET | `/health` | Public | Liveness probe |
| GET | `/integrations/status` | API key | JWT/DB/Redis + G4 flags |

### Auth

| Method | Path | Notes |
|--------|------|-------|
| POST | `/auth/register` | Throttled |
| POST | `/auth/login` | → access + refresh tokens |
| POST | `/auth/refresh` | Rotate access token |
| GET | `/me` | Bearer |
| POST | `/auth/oauth/google` · `/auth/oauth/apple` | ENV-gated (G4) |
| POST | `/auth/otp/send` · `verify-login` · `verify-register` | SMS when configured |

### Account / Bookings / Quotes

| Method | Path | Auth |
|--------|------|------|
| GET | `/account/dashboard` | Bearer |
| POST | `/quotes/search-aircraft` | API key · throttle 30/min |
| POST | `/quotes/request` | API key · optional JWT · throttle 20/min |
| GET | `/quotes/my` | Bearer |
| POST/GET | `/bookings`, `/bookings/:id`, cancel | Bearer |
| Payment helpers | `/payments/*`, gateway, documents | See Swagger tag **Quotes & Bookings** |

### Airports & Pricing

| Method | Path | Notes |
|--------|------|-------|
| GET | `/airports/search?q=&locale=` | Typeahead |
| GET | `/airports/nearby?lat=&lng=&radiusKm=` | Geo + parking/base |
| GET | `/airports` | List/sample |
| Pricing | `/pricing/*` | Positioning engine helpers |

### Marketing catalogue (public web)

| Tag | Key endpoints |
|-----|----------------|
| Fixed Price | `GET /fixed-price/routes`, `/:slug`, `POST /fixed-price/quote` |
| Empty Legs | `GET /empty-legs`, `/:slug`, alerts, request |
| Jet Card | `GET /jet-card/plans`, `POST /jet-card/enquiries` |
| Travel Credits | `GET /travel-credits/packages`, enquiries |
| Partners | `GET /partners/programs`, `POST /partners/applications` |
| Content (CMS) | news, blogs, videos, destinations, `pages/:slug`, newsletter |
| Campaigns | World Cup matches / quotes (if enabled) |
| i18n | `GET /i18n/config` |
| Media | public `GET /media/*` |

### Admin (Bearer ADMIN + API key)

| Tag | Scope |
|-----|--------|
| Admin Dashboard | stats, recent quotes/bookings, audit, system-health |
| Admin Quotes | queue, status, offers |
| Admin Bookings | manage bookings |
| Admin Content | articles, pages, destinations, videos |
| Admin Fixed Price / Empty Legs / Jet Card / Travel Credits | CRUD |
| Admin Aircraft / Airports | fleet & airport master |
| Admin Operators | hãng + operator users (flight notify) |
| Admin Email Templates | HTML/text templates by key |
| Admin Partners / Users / Permissions | staff access |
| Contracts | create → submit → approve / DocuSign |
| Content Sync | sources, jobs, media-asset review, brand settings, JetBay cleanup |

### Gateway

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api-gateway` | Route catalog |
| GET | `/api-gateway/ui-audit` | Web UI ↔ API coverage |

---

## 4. Rate limits

| Bucket | Limit | Applies to |
|--------|-------|------------|
| `default` | 120 / min | Global |
| `auth` | 5–20 / min | login, register, OTP, refresh |
| `quotes` | search 30 / min · request 20 / min | quote endpoints |

---

## 5. TypeScript client (React Native / Expo)

```powershell
# Local
pnpm openapi:client

# Production
$env:OPENAPI_URL='https://api.minhtien.online/openapi.json'
pnpm openapi:client
# or: pnpm openapi:client:prod
```

```ts
import { OpenAPI, AuthService } from '@jetbay/api-client';

OpenAPI.BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.minhtien.online';
OpenAPI.HEADERS = { 'X-API-Key': process.env.EXPO_PUBLIC_API_KEY! };

const login = await AuthService.authControllerLogin({
  requestBody: { email: 'demo@jetbay.local', password: 'Demo123!' },
});
OpenAPI.TOKEN =
  (login as { tokens?: { accessToken?: string }; accessToken?: string }).tokens
    ?.accessToken ?? (login as { accessToken?: string }).accessToken;
```

Snapshots: `packages/api-client/openapi/`.

---

## 6. Related docs

| Doc | Purpose |
|-----|---------|
| [BE_AUDIT.md](./BE_AUDIT.md) | Domain-by-domain BE status |
| [BE_TEST.md](./BE_TEST.md) | Smoke scripts |
| [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md) | Nest module layout |
| [JETBAY_SECURITY_VS_FEATURES.md](./JETBAY_SECURITY_VS_FEATURES.md) | Security patterns × báo giá features |
| [JETBAY_API_SYNC_SECURITY_PLAN.md](./JETBAY_API_SYNC_SECURITY_PLAN.md) | Local↔prod sync + security roadmap |
| [API_UI_AUDIT.md](./API_UI_AUDIT.md) | Page ↔ API matrix |
| [ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md) | Dev topology (web often → prod API) |

---

## 7. Maintaining Swagger quality

1. Prefer `@ApiOperation({ summary, description })` on new handlers.
2. Boot path runs `enrichOpenApiDocument()` (`apps/api/src/swagger/openapi-enrichment.ts`) so **every** operation still gets summary + description + tag text.
3. After deploy API, verify https://docs.minhtien.online/swagger and `pnpm smoke:api-sync`.
