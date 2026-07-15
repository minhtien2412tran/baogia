# Charter CMS map (T-S3-01)

> **Updated:** 2026-07-14 · **Status:** DOCUMENTED  
> Web loads static copy from `apps/web/src/lib/page-content.ts`, then optionally injects CMS body from `GET /content/pages/:slug` when a page is published in Admin.

## How it works

1. Route → `ServicePage` `pageKey` (same as URL segment).  
2. Static: `PAGE_CONTENT[pageKey]` (hero, sections, features — always present).  
3. Optional CMS: `PAGE_CMS_SLUG[pageKey]` → Admin **Content → Pages** slug.  
4. If CMS returns `body`, web renders an extra block (`jb-cms-block`). Missing CMS → static only (not an error).

Code: `apps/web/src/lib/service-page.ts` · `apps/web/src/components/layout/ServicePage.tsx`.

## Charter ×6

| Web route | pageKey / CMS slug | Static source | CMS today | Edit path |
|-----------|--------------------|---------------|-----------|-----------|
| `/[locale]/private-jet-charter` | `private-jet-charter` | `page-content.ts` + JetVina media | create in Admin to override body | Admin → Content → Pages |
| `/[locale]/corporate-air-charter` | `corporate-air-charter` | static | optional | same |
| `/[locale]/group-air-charter` | `group-air-charter` | static | optional | same |
| `/[locale]/event-air-charter` | `event-air-charter` | static | optional | same |
| `/[locale]/air-ambulance` | `air-ambulance` | static | optional | same |
| `/[locale]/pet-travel` | `pet-travel` | static | optional | same |

## Related (non-charter, already mapped)

| Route | CMS slug |
|-------|----------|
| about-us | `about-us` |
| booking-process | `booking-process` |

## Owner steps to replace static body

1. Admin → Content → Pages → Create.  
2. Slug **exactly** as table (e.g. `corporate-air-charter`).  
3. Locale `en` (+ `vi` if available). Status **published**.  
4. Paste HTML/plain body.  
5. Soft-refresh web route; expect CMS block under hero/sections.  
6. Hero title/features still come from `page-content.ts` until a later CMS-full migration (out of GĐ2 scope).

## Acceptance (T-S3-01)

- [x] Slugs mapped in code (`PAGE_CMS_SLUG`).  
- [x] Edit path documented here + [ADMIN_OPS_GUIDE.md](./ADMIN_OPS_GUIDE.md).  
- [ ] Owner publishes ≥1 charter CMS page on prod (content ops — not Dev blocker).
