# API Reference

Base URL: `http://localhost:4000`

Swagger UI: http://localhost:4000/swagger  
OpenAPI JSON: http://localhost:4000/openapi.json

## Public endpoints

| Group | Endpoints |
|-------|-----------|
| Airports | `GET /airports/search?q=` |
| Fixed Price | `GET /fixed-price/routes`, `GET /fixed-price/routes/:slug` |
| Empty Legs | `GET /empty-legs`, `GET /empty-legs/:slug`, `POST /empty-legs/:id/request` |
| Jet Card | `GET /jet-card/plans`, `POST /jet-card/enquiries` |
| Travel Credits | `GET /travel-credits/packages`, `GET /travel-credits/balance` |
| Content | `GET /content/news`, `/content/blogs`, `/content/videos`, `/content/destinations`, `/content/pages/:slug` |
| Quotes | `POST /quotes/request`, `POST /quotes/search-aircraft` |
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /me` |
| Bookings | `POST /bookings`, `GET /bookings/my` |

## Admin endpoints

All require `Authorization: Bearer <token>` header.

| Group | Endpoints |
|-------|-----------|
| Dashboard | `GET /admin/dashboard/stats`, `/recent-quotes`, `/recent-bookings`, `/revenue-demo` |
| System | `GET /admin/audit-logs`, `/admin/system-health` |
| CRUD | `/admin/fixed-price/routes`, `/admin/empty-legs`, `/admin/jet-card/plans`, `/admin/content/*`, `/admin/bookings` |
