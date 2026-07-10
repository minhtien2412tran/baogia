# Jet-Bay API Reference

| | Local | Production |
|--|-------|------------|
| **Base URL** | `http://127.0.0.1:4000` | `https://api.minhtien.online` |
| **Swagger UI** | http://127.0.0.1:4000/swagger | https://docs.minhtien.online/swagger |
| **OpenAPI JSON** | http://127.0.0.1:4000/openapi.json | https://api.minhtien.online/openapi.json · https://docs.minhtien.online/openapi.json |
| **OpenAPI YAML** | http://127.0.0.1:4000/openapi.yaml | https://api.minhtien.online/openapi.yaml · https://docs.minhtien.online/openapi.yaml |
| **Health** | `GET /health` | same |
| **Integrations** | `GET /integrations/status` | boolean readiness, **no secrets** |
| **Admin UI** | http://127.0.0.1:3001 | https://admin.minhtien.online/login |
| **TS client** | `packages/api-client` (`@jetbay/api-client`) | regenerate: `pnpm openapi:client:prod` |

**Audit đầy đủ theo domain:** [BE_AUDIT.md](./BE_AUDIT.md) · **Kiến trúc modules:** [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md)

OpenAPI title: **JetBay API**. In Swagger Authorize:

1. **X-API-Key** — app key (`API_KEY` / `NEXT_PUBLIC_API_KEY` / `EXPO_PUBLIC_API_KEY`)
2. **bearer** — JWT from `POST /auth/login`

`GET /health`, `/swagger`, `/openapi.json`, `/openapi.yaml` không cần API key. Hầu hết route khác bắt buộc `X-API-Key`.

Full page mapping: [API_UI_AUDIT.md](./API_UI_AUDIT.md) · Secrets: [SECURITY_SECRETS.md](./SECURITY_SECRETS.md)

## React Native / Expo (TypeScript client)

1. Export spec (JSON hoặc YAML) từ API đang chạy.
2. Generate client vào monorepo:

```powershell
# Local API
pnpm openapi:client

# Production
$env:OPENAPI_URL='https://api.minhtien.online/openapi.json'
pnpm openapi:client
# hoặc: pnpm openapi:client:prod
```

3. Trong app mobile (workspace hoặc copy `packages/api-client`):

```ts
import { OpenAPI, AuthService } from '@jetbay/api-client';

OpenAPI.BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.minhtien.online';
OpenAPI.HEADERS = {
  'X-API-Key': process.env.EXPO_PUBLIC_API_KEY!,
};

const login = await AuthService.authControllerLogin({
  requestBody: { email: 'demo@jetbay.local', password: 'Demo123!' },
});
// Inspect generated models after generate — token path may be login.tokens.accessToken
OpenAPI.TOKEN = (login as { tokens?: { accessToken?: string }; accessToken?: string }).tokens?.accessToken
  ?? (login as { accessToken?: string }).accessToken;
```

Snapshot files (sau generate): `packages/api-client/openapi/openapi.json` · `openapi.yaml`.  
Generated services: `packages/api-client/src/generated/` (fetch-based, RN-friendly).

## Auth

| Step | Endpoint |
|------|----------|
| Register | `POST /auth/register` |
| Login | `POST /auth/login` → tokens in response body (see Swagger) |
| Me | `GET /me` + `Authorization: Bearer <accessToken>` |
| Refresh | `POST /auth/refresh` (body refresh token) |
| OAuth | `POST /auth/oauth/google`, `POST /auth/oauth/apple` (ENV-gated) |
| OTP | `POST /auth/otp/send`, `verify-login`, `verify-register` |

After production secret rotation, all sessions are invalidated — login again.

## Public endpoints (web)

| Group | Endpoints |
|-------|-----------|
| Airports | `GET /airports/search?q=` |
| Fixed Price | `GET /fixed-price/routes`, `GET /fixed-price/routes/:slug`, `POST /fixed-price/quote` |
| Empty Legs | `GET /empty-legs`, `GET /empty-legs/:slug`, `POST /empty-legs/alerts/subscribe`, `POST /empty-legs/:id/request` |
| Jet Card | `GET /jet-card/plans`, `POST /jet-card/enquiries` |
| Travel Credits | `GET /travel-credits/packages`, `POST /travel-credits/enquiries` |
| Content | `GET /content/news`, `/content/blogs`, `/content/videos`, `/content/destinations`, `/content/pages/:slug`, `POST /newsletter/subscribe` |
| Quotes | `POST /quotes/request` (optional JWT), `POST /quotes/search-aircraft` |
| Campaigns | `GET /campaigns/world-cup/matches`, `POST /campaigns/world-cup/quotes` |
| Partners | `GET /partners/programs`, `POST /partners/applications` |

## Admin endpoints

All require `Authorization: Bearer <token>` (ADMIN role) + `X-API-Key`.

| Group | Endpoints |
|-------|-----------|
| Dashboard | `GET /admin/dashboard/stats`, `/recent-quotes`, `/recent-bookings`, `/revenue-demo` |
| Quotes | `GET /admin/quotes`, `GET /admin/quotes/:id`, `PATCH /admin/quotes/:id/status`, `POST /admin/quotes/:id/offers`, `GET /admin/operators` |
| System | `GET /admin/audit-logs`, `/admin/system-health` |
| CRUD | `/admin/fixed-price/routes`, `/admin/empty-legs`, `/admin/jet-card/plans`, `/admin/travel-credits/*`, `/admin/content/*`, `/admin/bookings`, `/admin/users`, `/admin/aircraft`, `/admin/airports`, `/admin/partners`, `/admin/media` |

## Gateway / audit

| Endpoint | Purpose |
|----------|---------|
| `GET /api-gateway` | Route catalog |
| `GET /api-gateway/ui-audit` | Web UI ↔ API coverage matrix |
