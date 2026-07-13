# Brand logo / icon / image audit (2026-07-13)

Branch: `feat/api-content-sync` · Mode: SAFE_REFERENCE · Logo rights: **UNVERIFIED**

## Logo

| Location | Before | After | Status |
|----------|--------|-------|--------|
| Header / sticky | JetBayLogo → placeholder SVG | `BrandLogo` → `/brand/jetvina/*` (flag) or fallback wordmark | DONE |
| Mobile mega menu | same | `BrandLogo` context=mobile | DONE |
| Footer | same | `BrandLogo` context=footer | DONE |
| Favicon / apple | logo-placeholder.svg | favicon-32 / apple-touch (flag) or fallback | DONE |
| OG | `/assets/jta/og-default.svg` | `/brand/jetvina/og-default.png` (flag) | DONE |
| `jetbay-logo.svg` | public JetBay SVG | **deleted** | DONE |
| Hotlink jetvina.com | n/a | never used in UI | DONE |

## Icon audit (sample — system standardized via AppIcon)

| Component/Route | Icon hiện tại | Nguồn | Vấn đề | Icon mới | Trạng thái |
|---|---|---|---|---|---|
| Header menu | CdnImage PNG | JetBay CDN mirror | mixed stroke | keep PNG short-term; AppIcon `menu` available | PARTIAL |
| Header close | ✕ text | unicode | inconsistent | AppIcon `close` available | PARTIAL |
| Quote swap | existing CSS/SVG | local | OK semantics | AppIcon `arrowLeftRight` | READY |
| Booking pax/date | existing | local | OK | AppIcon `users`/`calendar` | READY |
| Forms validation | mixed | CSS | — | AppIcon `alert`/`check` | READY |
| Social / payment | brand PNGs | JetBay assets | brand assets OK if payment live | KEEP payment row | KEEP |

Full AppIcon catalog: `apps/web/src/components/ui/AppIcon.tsx` (single stroke set, sizes xs–xl).

## Image audit

| Route | Image | Nguồn | Rights | Kích thước | Hành động |
|---|---|---|---|---|---|
| Home MediaSection | Featured / membership / social | JetBay mirror | UNVERIFIED | various | **BLOCK_FROM_PUBLISH** (section hidden) |
| Home hero / fleet | jetbayImg/* | historical clone | UNVERIFIED | mixed | KEEP layout, CLIENT_REQUIRED for JetVina replace |
| About fly_anywhere_jetbay.png | JetBay branded | local | JetBay | — | REPLACE later; filename flagged |
| App / Jet Card / SOS | JetBay marketing | local + copy | JetBay text | — | content cleanup ongoing; not logo path |
| Brand logo PNG | jetvina.com download | local storage | UNVERIFIED | 800×510 | KEEP staging + flag |
| OG / favicon | derived from logo | local | UNVERIFIED | — | KEEP under flag |

## Feature flags

| Flag | Default | Effect |
|------|---------|--------|
| `JETVINA_OFFICIAL_LOGO_ENABLED` (API) | false | Expose official paths on `GET /content/brand` |
| `NEXT_PUBLIC_JETVINA_OFFICIAL_LOGO_ENABLED` (web) | unset → on in non-production | Show official PNG in BrandLogo |
| `NEW_BRAND_CONTENT_ENABLED` | false | existing |
| `EXTERNAL_MEDIA_IMPORT_ENABLED` | false | existing |

Production: do **not** set logo flags until `rightsStatus` ∈ OWNED | LICENSED | CLIENT_PROVIDED.
