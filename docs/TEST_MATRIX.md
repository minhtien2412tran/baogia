# Test Matrix — JetBay

> **Updated:** 2026-07-24 · **Status:** Wave 0–1 + Wave 2 Dev/3a/4/5a session DONE · Contact **200** · Owner SMTP/CMS/O5 still blocked · [reviews/GD2_PAGE_WALK_20260724.md](./reviews/GD2_PAGE_WALK_20260724.md)

## Latest evidence (prefer these)

```text
Session 24/07 afternoon:
Contact EN/VI: 200 (deployed)
smoke-web-api: PASS quote #60
smoke-auth-booking: PASS booking #13
audit:i18n: fail=0 warn=10 (unchanged)
CMS inventory: docs/reviews/CMS_INVENTORY_20260724.md
Media audit: docs/reviews/MEDIA_AUDIT_20260724.md (jetvina hotlink 44)
SMTP: catcher — T-S4-01 BLOCKED_OWNER
```

| Test | Command | Environment | Result | PASS | FAIL | Ghi chú |
|------|---------|-------------|--------|------|------|---------|
| Prod health | `curl …/health` | prod | PASS | 1 | 0 | production |
| Contact pages | curl `/en-us/contact` `/vi/contact` | prod | **PASS** | 2 | 0 | was 404 |
| smoke-web-api | `node …/smoke-web-api.mjs` | prod | **PASS** | 9 | 0 | quote **#60** |
| smoke-auth-booking | `API_URL=https://api.minhtien.online …` | prod | **PASS** | 4 | 0 | booking **#13** |
| audit:i18n | `pnpm audit:i18n` | local | PARTIAL | 35 | 0 | warn=10 |
| CMS inventory | `node scripts/cms-inventory-audit.mjs` | prod API | DONE | — | — | News n=1 |
| Media audit | `node scripts/media-domain-audit.mjs` | prod HTML | DONE | — | 0 broken sample | O5 pending |
| Page walk | [GD2_PAGE_WALK_20260724](./reviews/GD2_PAGE_WALK_20260724.md) | prod | PARTIAL | — | — | Contact fixed |
| smoke:newsletter-smtp | `pnpm smoke:newsletter-smtp` | prod | PASS flag | — | — | deliverable=false |
| CMS publish-cycle W2-09 | `node scripts/smoke-cms-publish-cycle.mjs` (VPS) | prod | **PASS** | — | 0 | draft→publish→unpublish→delete id=67 · 24/07 |

## History quote IDs (not contradictions)

| ID | Source | Day |
|----|--------|-----|
| #37 | prior smoke:quote-ui | 2026-07-14 |
| #38/#39 | earlier 15/07 | 2026-07-15 |
| #40 / #41 | earlier quote-ui / web-api | 2026-07-15 |
| #42 | latest smoke:quote-ui | 2026-07-15 |
| #58 / #59 | Wave 1 smoke-web-api VPS / local | 2026-07-24 |

## T-S4-01 SMTP status (canonical)

```text
Dev implementation: PASS
Production SMTP configuration: BLOCKED_OWNER_SMTP
Real inbox delivery verification: NOT RUN
Overall task: BLOCKED_OWNER
```

## API sync (canonical)

```text
Production API sync: PASS — 173=173
Remote VPS runner: PASS
Local convenience credential: SYNCED 2026-07-24 via pull-prod-api-key.mjs
```

## HTML probe

```powershell
pnpm smoke:html-probe https://www.minhtien.online/baocaotiendo 3.1 14/07
```
