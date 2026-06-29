# QA Report — J-TA Platform

**Date:** 2026-06-29  
**Environment:** Windows 11, Node 24, PostgreSQL 16 local, pnpm 11

## Build status

| App | Build | Notes |
|-----|-------|-------|
| API | ✅ | NestJS + Prisma |
| Web | ✅ | Next.js 16, `@j-ta/ui` transpiled |
| Admin | ✅ | Dashboard + CRUD list pages wired |

## API smoke tests

| Endpoint | Status |
|----------|--------|
| `GET /` | ✅ |
| `GET /openapi.json` | ✅ |
| `GET /fixed-price/routes` | ✅ Seed data |
| `GET /empty-legs` | ✅ |
| `GET /content/news` | ✅ |
| `GET /airports/search?q=lon` | ✅ |
| `POST /auth/login` | ✅ Demo user |
| `GET /admin/dashboard/stats` | ✅ |
| `GET /admin/bookings` | ✅ |

## E2E (Playwright)

- Home page branding and fixed-price section
- Admin dashboard overview
- API health + OpenAPI spec
- Fixed-price page shows London routes
- Quote form interaction

## Known limitations

1. **Auth**: Demo tokens only — no JWT guard on admin routes
2. **Passwords**: Not bcrypt-hashed yet
3. **Docker**: Not used locally (WSL2 unavailable); Postgres installed natively
4. **Redis/MinIO**: Not connected in dev
5. **Service pages**: Many routes remain skeleton UI (charter, corporate, etc.)
6. **Admin CRUD**: List views only — no create/edit forms in UI

## Verdict

**Ready for local development review.** Core booking/commercial/CMS APIs persist to PostgreSQL. Web home, fixed-price, empty-leg, news, jet-card, travel-credit, login/register/account are functional. Admin dashboard and list pages show live API data.

Not production-ready until security hardening (JWT, bcrypt, rate limit, admin guard).
