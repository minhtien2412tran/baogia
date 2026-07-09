# Jet-Bay API Reference

| | Local | Production |
|--|-------|------------|
| **Base URL** | `http://127.0.0.1:4000` | `https://api.minhtien.online` |
| **Swagger UI** | http://127.0.0.1:4000/swagger | https://docs.minhtien.online/swagger |
| **OpenAPI JSON** | http://127.0.0.1:4000/openapi.json | https://api.minhtien.online/openapi.json |
| **Health** | `GET /health` | same |
| **Integrations** | `GET /integrations/status` | boolean readiness, **no secrets** |
| **Admin UI** | http://127.0.0.1:3001 | https://admin.minhtien.online/login |

OpenAPI title: **Jet-Bay API**. In Swagger Authorize:

1. **X-API-Key** — app key (`API_KEY` / `NEXT_PUBLIC_API_KEY`)
2. **bearer** — JWT from `POST /auth/login`

`GET /health`, `/swagger`, `/openapi.json` không cần API key. Hầu hết route khác bắt buộc `X-API-Key`.

Full page mapping: [API_UI_AUDIT.md](./API_UI_AUDIT.md) · Secrets: [SECURITY_SECRETS.md](./SECURITY_SECRETS.md)

## Auth

| Step | Endpoint |
|------|----------|
| Register | `POST /auth/register` |
| Login | `POST /auth/login` → `{ accessToken, refreshToken }` |
| Me | `GET /me` + `Authorization: Bearer <accessToken>` |
| Refresh | `POST /auth/refresh` (body refresh token) |

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
| Quotes | `POST /quotes/request`, `POST /quotes/search-aircraft` |
| Campaigns | `GET /campaigns/world-cup/matches`, `POST /campaigns/world-cup/quotes` |
| Partners | `GET /partners/programs`, `POST /partners/applications` |

## Admin endpoints

All require `Authorization: Bearer <token>` (ADMIN role).

| Group | Endpoints |
|-------|-----------|
| Dashboard | `GET /admin/dashboard/stats`, `/recent-quotes`, `/recent-bookings`, `/revenue-demo` |
| System | `GET /admin/audit-logs`, `/admin/system-health` |
| CRUD | `/admin/fixed-price/routes`, `/admin/empty-legs`, `/admin/jet-card/plans`, `/admin/content/*`, `/admin/bookings`, `/admin/users`, `/admin/aircraft` |

## Gateway / audit

| Endpoint | Purpose |
|----------|---------|
| `GET /api-gateway` | Route catalog |
| `GET /api-gateway/ui-audit` | Web UI ↔ API coverage matrix |
