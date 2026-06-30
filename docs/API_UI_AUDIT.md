# Web UI ↔ API Wiring Audit

Last updated: 2026-06-30

## Coverage: 100% public endpoints wired

All 30 public API methods in `apps/web/src/lib/api.ts` are consumed by at least one page or component.

## Page status

| Route | Data source | Forms / actions |
|-------|-------------|-----------------|
| `/{locale}` | fixed-price, empty-legs, destinations, jet-card, news | Quote widget, newsletter (footer) |
| `/news`, `/news/[slug]` | content/news | — |
| `/blogs`, `/blogs/[slug]` | content/blogs | — |
| `/video-centre` | content/videos | — |
| `/fixed-price-charter` | fixed-price/routes | — |
| `/fixed-price-charter/[slug]` | fixed-price/routes/:slug | **FixedPriceBookForm** → POST /fixed-price/quote |
| `/empty-leg` | empty-legs | EmptyLegAlertsForm |
| `/empty-leg-recommendation/[slug]` | empty-legs/:slug | **EmptyLegRequestForm** → POST /empty-legs/:id/request |
| `/destination`, `/island-destinations` | content/destinations | CDN thumbnails + API metadata |
| `/jet-card` | jet-card/plans | **JetCardEnquiryForm** → POST /jet-card/enquiries |
| `/travel-credit` | travel-credits/packages | **TravelCreditEnquiryForm** → POST /travel-credits/enquiries |
| `/global-partnership-program` | partners/programs | PartnerApplicationForm |
| `/world-cup-*` | campaigns/world-cup/matches | **WorldCupQuoteForm** → POST /campaigns/world-cup/quotes |
| `/article/[slug]` | content/pages/:slug | — |
| `/login`, `/register` | auth | — |
| `/account` | /me, bookings/my | — |
| Service pages (charter, pet, etc.) | Static + optional CMS | Quote widget when enabled |
| `/about-us`, `/booking-process` | Static + **CMS** (`PAGE_CMS_SLUG`) | — |

## New components (this sprint)

| Component | API |
|-----------|-----|
| `JetCardEnquiryForm` | POST /jet-card/enquiries |
| `TravelCreditEnquiryForm` | POST /travel-credits/enquiries |
| `EmptyLegRequestForm` | POST /empty-legs/:id/request |
| `FixedPriceBookForm` | POST /fixed-price/quote |
| `WorldCupQuoteForm` | POST /campaigns/world-cup/quotes |
| `NewsHomeSection` | GET /content/news |
| `PartnerProgramsStrip` | GET /partners/programs |
| `ServicePage` (async) | GET /content/pages/:slug when `PAGE_CMS_SLUG` set |

## Static-only pages (by design)

These use `page-content.ts` + CDN; quote widget on hero where `showQuoteWidget: true`:

- private-jet-charter, corporate/group/event charter
- pet-travel, air-ambulance
- jetbay-private-jet-app

## Verify locally

```powershell
pnpm dev
# With API + DB seeded:
# http://localhost:3000/en-us/jet-card
# http://localhost:3000/en-us/travel-credit
# http://localhost:3000/en-us/empty-leg-recommendation/{slug}
```
