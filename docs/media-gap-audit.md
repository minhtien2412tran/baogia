# Media / content-sync gap audit (retest 2026-07-13)

> Supporting gap list. **Canonical status:** [media-content-sync-status.md](./media-content-sync-status.md).

## Retest vừa chạy — PASS

| Suite | Result |
|-------|--------|
| `pnpm test:media` | 17/17 |
| API Jest | **58/58** (includes publish/rollback/import/permissions) |
| `audit:asset-references` | PASS |
| `validate:jetvina-media-manifest` | PASS (42 records, 5 mirrored) |
| `audit:branding` / `audit:debug` | PASS |
| `prisma migrate status` | up to date |
| Playwright staging media | 13/13 |
| Playwright production no-hotlink | 6/6 |
| `media-api-smoke` (ADMIN) | PASS |
| `media.reviewer` list 200 / approve-production **403** | PASS |
| Web `:3000` / API `:4000` / Admin `:3001` | 200 |

## Engineering gaps — updated

| Gap | Status | Notes |
|-----|--------|-------|
| Playwright Admin Media Review | **PASS** | `pnpm test:e2e:admin-media` (2/2); AuthGate client-token fix |
| Content sync publish E2E | DONE | `pnpm test:content-sync-publish` |
| Content sync rollback E2E | DONE | `pnpm test:content-sync-rollback` |
| Manifest → MediaAsset DB | DONE | `POST /admin/media-assets/import-manifest` + `pnpm import:jetvina-media` (flag-gated) |
| Permission matrix | PARTIAL | DB matrix suite PASS; HTTP smoke via reviewer + Admin E2E |
| Physical `/public/assets/jetbay` | inventory written; remove optional | `docs/evidence/jetbay-public-assets-inventory.json` |
| Dedicated DB `jetbay_db` | OPTIONAL / PARTIAL | Local `jta_db` isolated for project — not a full blocker |

## Blocker nghiệp vụ

1. Written media/logo authorization
2. Client-provided production assets
3. Production flags remain off until rights

## Kết luận

```text
PARTIAL — media and content-sync technical workflows are verified, while production publication remains blocked pending written authorization and approved production assets.
```
