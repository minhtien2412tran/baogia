# Web ↔ API Surface Map

> **Updated:** 2026-07-14 · **Status:** CURRENT · **Evidence:** code audit + prod smoke  
> **Verify:** `node scripts/deploy/jetbay-be/smoke-web-api.mjs` · `pnpm smoke:api-sync` (needs local API)  
> **Owner:** Dev · **Reviewer:** Project owner (priorities only)

Legend — Data status: `DONE` | `PARTIAL` | `MOCK` | `BLOCKED` | `NOT_STARTED` | `NEEDS_VERIFY` | `PROD_ONLY_ISSUE`

---

## Public Web (apps/web)

| Module | Web route | Admin route | API endpoint | Method | Auth | API client | Data status | Loading | Error | Empty | Test | Production status | Ghi chú |
|--------|-----------|-------------|--------------|--------|------|------------|-------------|---------|-------|-------|------|-------------------|---------|
| Home commercial | `/{locale}` | — | `/fixed-price/routes` | GET | API key | `getFixedPriceRoutes` | DONE | layout | `loadApi` + notice | ApiLoadNotice | smoke-web-api | PROD OK n=12 | T-S2-01 |
| Home EL | `/{locale}` | — | `/empty-legs` | GET | API key | `getEmptyLegs` | DONE | layout | `loadApi` + notice | ApiLoadNotice / emptyLegsEmptyDesc | smoke-web-api | PROD OK n=2 | T-S2-01 |
| Home JetCard | `/{locale}` | — | `/jet-card/plans` | GET | API key | `getJetCardPlans` | DONE | layout | `loadApi` + notice | ApiLoadNotice | smoke-web-api | PROD OK n=3 | T-S2-01 |
| Home news | `/{locale}` | content/articles | `/content/news` | GET | API key | `getNews` | PARTIAL | — | `loadApi` + EmptyState / notice | CTA noNews* | smoke-web-api | PROD OK n=1 | T-S2-04 |
| Fleet showcase | charter ServicePage | — | — (admin fleet only) | — | — | `AIRCRAFT_FLEET` + sample label | SAMPLE | — | labelled | “Sample fleet” note | visual | local | T-S2-02 — not live inventory |
| Home marketing sections | `/{locale}` | — | mixed | — | — | brand flags | PARTIAL | — | — | hidden | — | Often hidden | `SHOW_UNVERIFIED_*` default false |
| Charter ×6 | `/{locale}/private-jet-charter`(+5) | content/pages | `/content/pages/:slug` optional | GET | API key | `PAGE_CONTENT` + cms | PARTIAL | — | optional CMS | static + CMS body | route 200 | PROD live | [CHARTER_CMS_MAP.md](./CHARTER_CMS_MAP.md) T-S3-01 |
| Fixed-price list | `/fixed-price-charter` | fixed-price | `/fixed-price/routes` | GET | API key | `getFixedPriceRoutes` | DONE | — | `loadApi` + notice | ApiLoadNotice | smoke-web-api | PROD | T-S2-01 |
| Fixed-price detail | `/fixed-price-charter/[slug]` | fixed-price | `/fixed-price/routes/:slug` | GET | API key | `getFixedPriceRoute` | DONE | — | not-found UI | ok | NEEDS_VERIFY | PROD | |
| Fixed-price book | detail form | quotes | `/fixed-price/quote` | POST | API key | `requestFixedPriceQuote` | DONE | form | form msg | — | NEEDS_VERIFY | PROD | Email optional phone gap |
| Empty Legs list | `/empty-leg` | empty-legs | `/empty-legs` | GET | API key | page uses browse | PARTIAL | — | client error → ApiLoadNotice | empty + error | smoke-web-api | PROD | T-S2-01 |
| Empty Leg detail | `/empty-leg-recommendation/[slug]` | empty-legs | `/empty-legs/:slug` | GET | API key | `getEmptyLeg` | DONE | — | not-found | ok | NEEDS_VERIFY | PROD | |
| Empty Leg request | detail form | quotes | `/empty-legs/:id/request` | POST | API key | `requestEmptyLeg` | DONE | form | form | — | NEEDS_VERIFY | PROD | |
| Empty Leg alerts | forms | — | `/empty-legs/alerts/subscribe` | POST | API key | `subscribeEmptyLegAlerts` | DONE | form | form | — | NEEDS_VERIFY | PROD | |
| Jet Card | `/jet-card` | jet-card | `/jet-card/plans` + `/jet-card/enquiries` | GET/POST | API key | plans + enquiry | DONE | form | `loadApi` + notice | ApiLoadNotice | smoke-web-api | PROD | T-S2-01 |
| Travel Credit | `/travel-credit` | travel-credits | `/travel-credits/packages` + enquiries | GET/POST | API key | packages + enquiry | DONE | form | `loadApi` + notice | ApiLoadNotice | smoke-web-api | PROD enquiry id OK | T-S2-01 |
| Destinations | `/destination` (+golf/ski/island) | destinations | `/content/destinations` | GET | API key | `getDestinations` | DONE | — | silent | blank | smoke-web-api | PROD n≥5 | |
| Airports search | Quote / EL widgets | airports | `/airports/search` `/nearby` | GET | API key | `AirportInput` | DONE | dropdown | msg | no-results i18n | smoke-web-api | PROD | |
| Quote search | hero widget | quotes | `/quotes/search-aircraft` | POST | API key | `searchAircraft` | DONE | skeleton | form | empty results | **PASS 2026-07-14** legs DTO | PROD | Body must use `legs[]` |
| Quote request | hero widget | quotes | `/quotes/request` | POST | API key | `requestQuote` | DONE | form | form | — | smoke-web-api + E2E | PROD creates quote | Phone **required** (T-S1-03); no `+10000000000` fake |
| Quote email notify | — | email-templates | SMTP | — | — | EmailService | BLOCKED | — | — | — | NOT_RUN prod mail | SMTP stub | Code OK, deliver FAIL |
| Newsletter | footer | — | `/newsletter/subscribe` | POST | API key | `NewsletterForm` | DONE | form | form | — | 201 prod | PARTIAL | Mail deliver blocked |
| Contact | (no dedicated page) | — | enquiries variants | — | — | forms | PARTIAL | — | — | — | — | — | Contact = quote/enquiry forms |
| Auth login/register | `/login` `/register` | — | `/auth/*` | POST | public+key | pages | DONE | form | form | — | smoke-auth-booking | PROD | OTP/OAuth env-gated |
| OAuth Google/Apple | login buttons | — | `/auth/oauth/*` | POST | — | buttons | BLOCKED | — | NOT_CONFIGURED | — | — | integrations false | Need client IDs |
| OTP SMS | login/register | — | `/auth/otp/*` | POST | — | pages | BLOCKED | — | — | — | — | sms=false | Dev logs code |
| Account dashboard/profile/trips | `/account/*` `/account/bookings` | users | `/account/dashboard`, `/me`, `/me/avatar` | GET/PATCH/POST multipart | JWT | `AccountContext` + sectioned profile editor + client avatar resize + trip dashboard | DONE | skeleton/upload busy | retry + 401→login + network/413 errors | stable `User.publicId`; avatar JPEG/PNG/WebP → max 5 MB shared storage; contact/social fields sync through shared DB | auth-booking/avatar multipart | migration `20260721005500_user_public_id` · PROD UAT | T-S3-02 |
| Account payments | `/account/payments` | — | `/payments/gateway` | POST | JWT + booking ownership | pay button | BLOCKED | — | not configured | — | — | pay keys missing | OnePay/9Pay/Stripe; ownership guard added 20/07 |
| News/Blogs/Videos | `/news` `/blogs` `/video-centre` | content/* | `/content/*` | GET | API key | list/detail | PARTIAL | — | silent empty | blank | smoke news | PROD thin content | |
| World Cup | WC pages | — | `/campaigns/world-cup/*` | GET/POST | API key | forms | PARTIAL | — | — | hide empty | NEEDS_VERIFY | — | IATA raw inputs |
| Partners | partnership page | partners | `/partners/*` | GET/POST | API key | forms | PARTIAL | — | hide empty | — | NEEDS_VERIFY | — | |
| Pricing estimate | — | bookings | `/pricing/estimate` | POST | API key | **none in web** | NOT_STARTED | — | — | — | — | API exists | Dead FE client `estimatePricing` |
| Progress report | `/baocaotiendo` | — | — | — | — | static TS | DONE | — | — | — | visual | PROD v3.1 | Live `3.1` / `14/07` |

---

## Admin (apps/admin)

| Module | Web route | Admin route | API endpoint | Method | Auth | API client | Data status | Loading | Error | Empty | Test | Production status | Ghi chú |
|--------|-----------|-------------|--------------|--------|------|------------|-------------|---------|-------|-------|------|-------------------|---------|
| Login | — | `/login` | `/auth/login` | POST | — | adminApi | DONE | form | form | — | manual | PROD → api.minhtien.online | Fixed bake URL |
| Dashboard | — | `/dashboard` | `/admin/dashboard/*` | GET | Staff + `dashboard.view` | adminApi | DONE | — | — | — | smoke-admin (hist) | PROD · guard local 21/07 | |
| Quotes | — | `/dashboard/quotes` `[id]` | `/admin/quotes*` · export | GET/PATCH/POST | Staff + `quote.*` | adminApi | DONE | — | — | — | NEEDS_VERIFY | PROD · detail+export local | status moved off dashboard |
| Bookings | — | `/dashboard/bookings` `[id]` | `/admin/bookings*` · export PDF | GET/PATCH | Staff + `booking.*` | adminApi | DONE | — | — | — | auth-booking | PROD · structured detail local | |
| Payments | — | `/dashboard/payments` | `/admin/payments` · export | GET | Staff + `payment.view` | adminApi | DONE | — | — | — | NEEDS_DEPLOY | local 21/07 | no refunds |
| Users 360 | — | `/dashboard/users` `[id]` | `/admin/users*` | GET/PATCH | Staff + `user.manage` | adminApi | DONE | — | — | — | NEEDS_VERIFY | PROD · structured edit local | |
| Airports/Aircraft | — | airports/aircraft | `/admin/airports` `/admin/aircraft/*` | CRUD | Staff + `aircraft.*` / `airport.*` | adminApi | DONE | — | — | — | smoke-admin-crud | PROD · fleet create/location UI | |
| FP / EL / JC / TC | — | commercial pages | `/admin/fixed-price|empty-legs|jet-card|travel-credits` | CRUD | Staff + `*.view/manage` | adminApi | DONE | — | — | — | smoke-admin-crud | PROD · guards local 21/07 | |
| Content CMS | — | content/* | `/admin/content/*` | CRUD | Admin | adminApi | PARTIAL | — | — | — | NEEDS_VERIFY | PROD | Locale body thiếu · R4 |
| Media | — | media / media-review | `/admin/media*` `/admin/media-assets*` | CRUD | Admin | adminApi | PARTIAL | — | — | — | media tests | PROD | Hotlink JetVina staging · R4 |
| Operators / Templates | — | operators / email-templates | `/admin/operators` `/admin/email-templates` | CRUD | Admin | adminApi | DONE | — | — | — | hist 200 | PROD | Samples seeded · R3 lag |
| Audit | — | audit-logs | `/admin/audit-logs` | GET | Staff + `audit.view` | adminApi | DONE | — | — | — | NEEDS_VERIFY | PROD | dashboard controller |
| Permissions | — | permissions | `/admin/permissions*` | GET/PUT | Staff JWT + `permission.manage` where required | adminApi | PARTIAL | — | 403 stays in-session | — | NEEDS_VERIFY | PROD | PermissionContext + AuthGate 21/07 |
| Contracts | — | contracts `[id]` | `/admin/contracts*` · export | workflow | PermissionGuard `contract.*` | adminApi | DONE | — | — | — | bao-gia-contracts | DocuSign mock | create/detail UI local |
| Export | — | (buttons on lists) | `/admin/export/*` | GET file | Staff + `*.export` | downloadExport | DONE | — | — | — | NEEDS_DEPLOY | local 21/07 | PDF + CSV |
| Settings / brand | — | settings | `/admin/site-settings/brand` | GET/PATCH | Admin | adminApi | PARTIAL | — | — | — | — | PROD | |
| Revenue demo | — | dashboard | `/admin/dashboard/revenue-demo` | GET | Staff + `dashboard.view` | adminApi | MOCK | — | — | — | — | Demo metric | Labelled demo |

---

## System / contract

| Check | Status | Evidence 2026-07-14 |
|-------|--------|---------------------|
| Prod health | DONE | `GET /health` → `ok` `production` |
| Integrations | PARTIAL | `smtp=false` · catcher Mailpit · pay/oauth/sms=false · **T-S4-01 BLOCKED_OWNER_SMTP** |
| OpenAPI public | PROD_ONLY_ISSUE | `/openapi.json` → **401** (Swagger Basic on) — sync via Basic or VPS |
| Local↔prod path sync | PASS remote | Remote VPS `prod-docs` **173=173** · Local convenience: NEEDS_LOCAL_ENV_REFRESH |
| Web↔API commercial smoke | DONE | `smoke-web-api.mjs` **RESULT pass** (quote #41) |
| Auth+booking smoke | DONE | `smoke-auth-booking.mjs` **RESULT pass** (booking #7) |
| Media unit | DONE | `pnpm test:media` pass |

---

## Priority findings (surface)

1. **P2** — remaining `safeApi` call sites (blogs/destinations/CMS detail) still swallow errors; news + commercial/home fixed.
2. **P2** — Fleet showcase is labelled SAMPLE (T-S2-02); public live fleet GET still optional later.
3. **P0** — SMTP deliver still blocked (Owner O4).
4. **P2** — Charter copy still primarily static; CMS slugs mapped — Owner publish optional (T-S3-01).
5. **P1** — Pay/OAuth/SMS keys false on `/integrations/status` (G4).
6. **P2** — OpenAPI/docs anonymous 401 — sync scripts need `SWAGGER_BASIC_*` (T-S1-04 supports this).

Next map updates: after Owner CMS charter pages and public fleet API (if product requires live inventory).
