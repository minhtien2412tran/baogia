# Media & content-sync — current status (SOURCE OF TRUTH)

> **Current source of truth** for media / content-sync status.  
> Other docs must link here for counts and overall status — do not fork numbers.

| Field | Value |
|-------|--------|
| Overall | **PARTIAL** — technical workflows verified; production publication blocked pending written authorization |
| Branch | `feat/api-content-sync` |
| Retest date | 2026-07-13 |
| Production deploy | **Not deployed** · **Not pushed** (local commits ahead of origin) |
| Status canonical | this file |

## 1. Verified results (retest)

| Suite | Result |
|-------|--------|
| `pnpm test:media` | **17/17** |
| API Jest | **58/58** |
| `audit:asset-references` | PASS (0 public `/assets/jetbay`) |
| `validate:jetvina-media-manifest` | PASS — **42** records, **5** local mirrored |
| `audit:branding` | PASS |
| `audit:debug` | PASS |
| Prisma migrate status | Up to date (10 migrations) |
| Playwright staging media | **13/13** |
| Playwright production no-hotlink | **6/6** (0 requests to jetvina.com) |
| Admin media API smoke | PASS |
| Reviewer list | **200** |
| Reviewer approve production | **403** |
| Web `:3000` / API `:4000` / Admin `:3001` | **200** |

## 2. Completed capabilities

- Media resolver (`resolveMediaAsset`) + rights gating
- Manifest + staging remote review / local mirror
- Production no-hotlink
- MediaAsset DB fields + admin Media Review API/UI
- Permission reject UNVERIFIED → production
- Asset reference audit + branding/debug audits
- Prisma content-sync + media review migrations
- Content source seed / test-connection / discover dry-run

## 3. Remaining engineering gaps

| Gap | Status |
|-----|--------|
| Admin Playwright Media Review browser E2E | **PASS** (`test:e2e:admin-media` 2/2) |
| Content sync publish E2E | implemented (`test:content-sync-publish`) |
| Content sync rollback E2E | implemented (`test:content-sync-rollback`) |
| `sync:jetvina-media` → MediaAsset DB import | implemented (`import:jetvina-media` + API; flag-gated) |
| Full HTTP permission matrix (all roles) | PARTIAL — DB permission matrix suite PASS; HTTP smoke via Admin E2E + reviewer API |
| Physical `/public/assets/jetbay` cleanup | **PASS** — 171 files inventoried + removed from public root (archive gitignored) |
| Dedicated DB name `jetbay_db` | OPTIONAL — local uses `jta_db` (**PARTIAL** isolation, PASS for local/test) |

## 4. Business blockers

1. Written media / logo authorization  
2. Client-provided production assets  
3. Production flags (`JETVINA_MEDIA_PRODUCTION_ENABLED`, `CONTENT_SYNC_PUBLISH_ENABLED`) remain **false** until rights  

## 5. Environment

| Item | Value |
|------|--------|
| Web | `http://127.0.0.1:3000` |
| API | `http://127.0.0.1:4000` |
| Admin | `http://127.0.0.1:3001` |
| PostgreSQL | `127.0.0.1:5432` · database **`jta_db`** (local/test; CREATE `jetbay_db` denied for current user) |
| Schema | `public` |

### Feature flags (defaults)

| Flag | Dev/Staging | Production |
|------|-------------|------------|
| `NEXT_PUBLIC_PREFER_JETVINA_MEDIA` | true | prefer off / ignored for remote |
| `JETVINA_MEDIA_REMOTE_REVIEW_ENABLED` | true | **false** |
| `JETVINA_MEDIA_LOCAL_MIRROR_ENABLED` | true | true (only approved) |
| `JETVINA_MEDIA_PRODUCTION_ENABLED` | **false** | **false** until rights |
| `CONTENT_SYNC_ENABLED` | true | true |
| `CONTENT_SYNC_PUBLISH_ENABLED` | **false** | **false** until rights |
| `EXTERNAL_MEDIA_IMPORT_ENABLED` | false | false |
| `JETVINA_OFFICIAL_LOGO_ENABLED` | false | false |

`NEXT_PUBLIC_*` is **not** a security boundary alone — API/DB rights gates apply.

## 6. Commands (root)

```bash
pnpm test:media
pnpm audit:asset-references
pnpm validate:jetvina-media-manifest
pnpm audit:branding
pnpm audit:debug
pnpm audit:docs
pnpm sync:jetvina-media --dry-run --limit=5
pnpm import:jetvina-media --dry-run
pnpm restart:web --dry-run
pnpm test:e2e:media-staging
pnpm test:e2e:media-production
pnpm test:e2e:admin-media
pnpm test:content-sync-publish
pnpm test:content-sync-rollback
pnpm test:media-import-db
pnpm test:media-permissions
pnpm --filter @jetbay/api exec prisma migrate status
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed
```

### Database isolation

| Check | Result |
|-------|--------|
| Host | `127.0.0.1:5432` |
| Database | `jta_db` (local/test) |
| Expected name `jetbay_db` | Not created (no CREATE privilege) — **not a full blocker** |
| Isolation | **PARTIAL** — project-owned schemas/tables; do not treat as shared production DB |
| Migration | Up to date |
| Seed | Idempotent |
## 7. Evidence

- [media-gap-audit.md](./media-gap-audit.md)
- [jetvina-media-pass-report.md](./jetvina-media-pass-report.md) *(supporting detail; numbers must match this file)*
- [content-rights-policy.md](./content-rights-policy.md)
- [content-sync-runbook.md](./content-sync-runbook.md)
- [documentation-coverage-matrix.md](./documentation-coverage-matrix.md)

## 8. Overall status sentence

```text
PARTIAL — media and content-sync technical workflows are verified, while production publication remains blocked pending written authorization and approved production assets.
```
