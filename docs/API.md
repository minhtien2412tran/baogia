# API Reference

Base URL: `http://localhost:4000`

| Portal | URL |
|--------|-----|
| Swagger UI | http://localhost:4000/swagger |
| OpenAPI JSON | http://localhost:4000/openapi.json |
| API Gateway catalog | http://localhost:4000/api-gateway |
| **Web UI audit matrix** | http://localhost:4000/api-gateway/ui-audit |

Full page-by-page mapping: [API_UI_AUDIT.md](./API_UI_AUDIT.md)

## Public endpoints (web sample)

| Group | Endpoints | Web client method |
|-------|-----------|-------------------|
| Airports | `GET /airports/search?q=` | `searchAirports` |
| Fixed Price | `GET /fixed-price/routes`, `GET /fixed-price/routes/:slug`, `POST /fixed-price/quote` | `getFixedPriceRoutes`, `getFixedPriceRoute`, `requestFixedPriceQuote` |
| Empty Legs | `GET /empty-legs`, `GET /empty-legs/:slug`, `POST /empty-legs/alerts/subscribe`, `POST /empty-legs/:id/request` | `getEmptyLegs`, `getEmptyLeg`, `subscribeEmptyLegAlerts`, `requestEmptyLeg` |
| Jet Card | `GET /jet-card/plans`, `POST /jet-card/enquiries` | `getJetCardPlans`, `submitJetCardEnquiry` |
| Travel Credits | `GET /travel-credits/packages`, `POST /travel-credits/enquiries` | `getTravelCreditPackages`, `submitTravelCreditEnquiry` |
| Content | `GET /content/news`, `/content/blogs`, `/content/videos`, `/content/destinations`, `/content/pages/:slug`, `POST /newsletter/subscribe` | `getNews`, `getBlogs`, `getVideos`, `getDestinations`, `getContentPage`, `subscribeNewsletter` |
| Quotes | `POST /quotes/request`, `POST /quotes/search-aircraft` | `requestQuote`, `searchAircraft` |
| Campaigns | `GET /campaigns/world-cup/matches`, `POST /campaigns/world-cup/quotes` | `getWorldCupMatches`, `requestWorldCupQuote` |
| Partners | `GET /partners/programs`, `POST /partners/applications` | `getPartnerPrograms`, `submitPartnerApplication` |
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /me` | `login`, `register`, `getMe` |
| Bookings | `POST /bookings`, `GET /bookings/my` | `getMyBookings` |

## Admin endpoints

All require `Authorization: Bearer <token>` header.

| Group | Endpoints |
|-------|-----------|
| Dashboard | `GET /admin/dashboard/stats`, `/recent-quotes`, `/recent-bookings`, `/revenue-demo` |
| System | `GET /admin/audit-logs`, `/admin/system-health` |
| CRUD | `/admin/fixed-price/routes`, `/admin/empty-legs`, `/admin/jet-card/plans`, `/admin/content/*`, `/admin/bookings` |
