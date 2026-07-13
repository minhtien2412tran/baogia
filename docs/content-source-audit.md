# Content source audit

## Repository inventory (Phase 0)

| Layer | Tech |
|-------|------|
| Web | Next.js 16 · `apps/web` |
| Admin | Next.js 16 · `apps/admin` |
| API | NestJS 11 · Prisma 5 · Postgres |
| Packages | `@jetbay/ui`, `@jetbay/i18n`, `@jetbay/api-client` |
| CMS today | ContentArticle + ContentTranslation; About/Booking JSON-in-body |
| Media | MinIO/local `StorageService`; FE static `/assets/jetbay` |
| Auth | API key + JWT; AdminGuard; PermissionGuard |
| Audit | AuditLog + AuditService.logEntity |
| Missing before this work | SiteSetting, ContentSource/Sync/Rights/Version, MediaAsset rights |

## JetVina public source (2026-07-13)

| Check | Result |
|-------|--------|
| robots.txt | Allow all · sitemap `sitemap_index.xml` (Yoast) |
| Homepage | HTTP 200 |
| `/wp-json/` | HTTP 200 (WordPress) |
| Types | post, page, empty_legs, fleet, memberships, experience, careers, events, flight |
| Auth evidence in repo | **None** → **SAFE_REFERENCE_MODE** |

## Access method selected

1. WordPress REST **metadata** discovery (`_fields=id,slug,link,modified,title`) — allowlisted `jetvina.com`, no redirect follow, SSRF DNS check.
2. No HTML body storage, no media download, no logo hotlink.
