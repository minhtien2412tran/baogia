# JetBay cleanup audit

**Mode:** SAFE_REFERENCE_MODE · Branch: `feat/api-content-sync`

| Vị trí | Route/File/Record | Nội dung hiện tại | Loại | Rủi ro | Hành động |
|--------|-------------------|-------------------|------|--------|-----------|
| Brand constants | `apps/web/src/lib/brand.ts` | Was JetBay | Brand | High | REPLACE → JetVina placeholders |
| Logo component | `JetBayLogo.tsx` | JetBay alt/CDN | Logo | High | REPLACE → placeholder SVG |
| Footer copyright | `JetBayFooter.tsx` | JetBay Inc. + social | Brand | High | REPLACE; social removed |
| Stats claims | `StatsSection.tsx` | No.1 / 10K+ | Claim | High | BLOCK_FROM_PUBLISH (hidden) |
| CDN registry | `jetbay-cdn.ts` | Local `/assets/jetbay` | Asset path | Med | VERIFY — keep paths; stop JetBay social |
| Email templates | `email-templates.ts` | JetBay subjects | Brand | High | REPLACE → JetVina |
| i18n packages | `packages/i18n/*` | JetBay strings | Copy | Med | REWRITE (partial pending) |
| page-content.ts | hard-coded pages | JetBay marketing | Copy | High | REWRITE pending |
| Package names | `@jetbay/*` | npm scope | Code | Low | KEEP (break risk) |
| PM2 / deploy | `jetbay-web` etc. | Infra names | Ops | Low | KEEP |
| Scratch/CDN scripts | `scratch/*` | scrape helpers | Tooling | Med | BLOCK — do not use for JetVina media |
| Legal | CMS LEGAL | JetBay policies | Legal | High | VERIFY — client legal rewrite |
| Association logos | footer membership | WYVERN/NBAA etc. | Trademark | High | VERIFY / hide pending license |

## Counts (approx)

| Nhóm | Phát hiện | Đã thay | Đã gỡ | Chờ duyệt |
|------|----------:|--------:|------:|----------:|
| Brand UI | 12 | 6 | 2 | 4 |
| Claims/stats | 4 | 0 | 4 (hidden) | 4 |
| i18n/copy | 50+ | 0 | 0 | 50+ |
| Email | 8 | 8 | 0 | 0 |
| Packages/infra | 10 | 0 | 0 | 10 |
| Legal | 5 | 0 | 0 | 5 |
