# JetVina media pass — final report (2026-07-13)

Branch: `feat/api-content-sync` · **No production deploy**

## 1. Trạng thái

**PARTIAL** — JetVina media is prioritized for local/staging review and mirrored safely; production publication remains blocked pending written media authorization.

## 2. Media strategy

| Env | Behavior |
|-----|----------|
| Dev | Remote JetVina review when flags on; local mirror when checksum present; else demo SVG |
| Staging | Same as dev |
| Production | No JetVina hotlink; only checksummed local mirror with OWNED/LICENSED/CLIENT_PROVIDED + `approvedForProduction` + `JETVINA_MEDIA_PRODUCTION_ENABLED=true`; else placeholder |
| Remote | `REMOTE_JETVINA_REVIEW` only non-prod |
| Local mirror | `/assets/jetvina/mirror/` via `pnpm sync:jetvina-media` (gitignored binaries) |
| Fallback | `/placeholders/demo/*.svg` — never JetBay |

## 3. Rights

| Item | Value |
|------|--------|
| Status | UNVERIFIED (CLIENT_DIRECTED ≠ CLIENT_PROVIDED) |
| Evidence | None in repo |
| Staging-approved | 42 (manifest `approvedForStaging=true`) |
| Production-approved | **0** |
| Blocked | 0 this sync |

## 4. Sync (sample `--limit=5`)

| Downloaded | Updated | Unchanged | Duplicate | Blocked | Failed |
|------------|---------|-----------|-----------|---------|--------|
| 5 (first) | 0 | 5 (rerun) | 0 | 0 | 0 |

## 5. Manifest

- File: `apps/web/public/brand/jetvina/jetvina-media-manifest.json`
- Records: **42**
- Checksummed mirrors: **5** (partial sync)
- Missing: wordpressMediaId / real width-height for unsynced; all `approvedForProduction=false`

## 6. Mapping

| Context | JetBay cũ | JetVina mới | Local/Remote | Fallback |
|---------|-----------|-------------|--------------|----------|
| HERO / fleet | `/assets/jetbay/**` | curated exterior URLs | remote staging / local if checksum | hero/aircraft SVG |
| Cabin | cabin banners | interior URLs | remote | cabin SVG |
| Destination | destination webp | Phu Quoc etc. | remote | destination SVG |
| Empty leg | aircraft webp | exterior pool | remote | aircraft SVG |
| News / service | jetbay paths | news/service pools | remote | news/service SVG |

Resolver: `apps/web/src/lib/resolve-media-asset.ts` · wire: `sanitizePublicMediaSrc`

## 7. Image quality

Browser smoke (manual this pass): `/en-us` 200 · manifest 200 · sample mirror 200. Full viewport matrix + Playwright production-mode media: **deferred** (partial).

## 8. Performance

Local/staging may hotlink JetVina (review). Production `images.remotePatterns` empty when `APP_ENV=production`. Prefer local mirror for Next optimizer after sync.

## 9. Server process

| Step | Result |
|------|--------|
| PID cũ | 25144 (`next/.../start-server.js` under baogia) |
| Confirm | cmdline path contains `baogia` + `start-server` |
| Graceful | `pnpm restart:web` SIGTERM then force after timeout |
| PID mới | listen ~52472 (Next start-server); wrapper PID file may be pnpm |
| Health | `GET /en-us` → 200 |

## 10. Tests

| Suite | Passed | Failed | Total |
|-------|--------|--------|-------|
| media-policy + resolve-media-asset | 11 | 0 | 11 |
| sync-jetvina-media-safety | 6 | 0 | 6 |
| audit:branding | PASS (after allowlist media modules) | | |

## 11. Build

| App | Status |
|-----|--------|
| Web `tsc` | PASS |
| API permission catalog | updated (media perms) |
| Admin content-rights copy | updated |
| Full web/admin/api production build + Playwright | not re-run end-to-end this pass |

## 12. Blockers

1. **Media authorization** — written CLIENT_PROVIDED / OWNED / LICENSED
2. Client-provided asset pack for production
3. PostgreSQL local — MediaAsset DB review UI incomplete until migrate
4. Full Playwright viewport + production-mode remote-request assertion
5. Do not delete `/assets/jetbay` tree until import count = 0 and smoke PASS

## Commands

```bash
pnpm manifest:jetvina-media
pnpm sync:jetvina-media --dry-run --limit=5
pnpm sync:jetvina-media --limit=20 --report=tmp/media-sync-report.json
pnpm test:media
pnpm restart:web
```
