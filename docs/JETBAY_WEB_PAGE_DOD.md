# Web page groups — Definition of Done (G2)

API base: `https://api.minhtien.online`  
Public web: `https://www.minhtien.online/en-us` (PM2 `jetbay-web` `:3012`)  
Web env: `apps/web/.env.local` → `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_API_KEY`

## Group 1 — Home + Quote (priority)

| Check | Status |
|-------|--------|
| Home SSR loads FP/EL/JetCard from API | ✅ contract smoke |
| Airport search `GET /airports/search` | ✅ |
| Quote submit `POST /quotes/request` | ✅ |
| Hero + QuoteSearchWidget wired | ✅ code |
| Build `pnpm --filter @jetbay/web build` | (run in CI/local) |

## Group 2 — Commercial

| Page | API | Status |
|------|-----|--------|
| `/fixed-price-charter` | `/fixed-price/routes` | ✅ data seed (12) |
| `/empty-leg` | `/empty-legs` | ✅ data seed (2) |
| `/jet-card` | `/jet-card/plans` | ✅ data seed (3) |
| `/travel-credit` | `/travel-credits/packages` | ✅ data seed (3) |

## Group 3 — Charter services (6)

| Page | Status |
|------|--------|
| private-jet-charter | ✅ route + ServicePage |
| corporate-air-charter | ✅ |
| group-air-charter | ✅ |
| event-air-charter | ✅ |
| pet-travel | ✅ |
| air-ambulance | ✅ |

Parity visual vs scratch HTML: ongoing polish (không block API DoD).

## Group 4 — Content

| Page | API | Status |
|------|-----|--------|
| news / blogs / video | content APIs | ✅ seeded |
| destinations island/ski/golf | destinations | ✅ seeded |
| about-us / booking-process | CMS pages | ✅ |

## Group 5 — Account

| Page | Status |
|------|--------|
| login / register | ✅ OAuth/OTP UI |
| account quotes/bookings/payments/documents | ✅ routes |

## Smoke command

```bash
node scripts/deploy/jetbay-be/smoke-web-api.mjs
```
