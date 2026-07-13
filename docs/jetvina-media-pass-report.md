# JetVina media + DB workflow report (2026-07-13)

Branch: `feat/api-content-sync` · **No production deploy** · **No push**

## 1. Trạng thái tổng thể

**PARTIAL** — technical media pipeline, staging review, production no-hotlink and database workflows are verified; production media publication remains blocked pending written authorization.

| Phần | Status |
|------|--------|
| PostgreSQL local | PASS (service `postgresql-x64-16`; DB `jta_db` — cannot CREATE `jetbay_db` without superuser) |
| Prisma migrate deploy | PASS (incl. `20260713140000_media_asset_review_fields`) |
| Seed (×2 idempotent) | PASS |
| Admin Media Review API/UI | PASS (fixtures + `/dashboard/media-review`) |
| Permission DB integration | PASS (service + HTTP smoke; ADMIN; UNVERIFIED reject) |
| Media sync file script | PASS dry-run |
| Content sync discover dry-run | PASS |
| Media resolver / staging / prod Playwright | PASS (prior + unchanged) |
| Production rights publish | BLOCKED |

## 2. PostgreSQL

- Docker: **not installed**
- Local service: Running
- Connected DB: `jta_db` @ 127.0.0.1:5432 (existing project DB; create `jetbay_db` denied)
- Health: migrate status up to date after deploy

## 3. Prisma

| Action | Result |
|--------|--------|
| format | skipped commit noise |
| validate | PASS |
| generate | PASS |
| migrate status | up to date |
| migrate deploy | PASS (4 migrations this session incl. media fields) |
| reset | not used |

## 4. Seed

- Idempotent second run: PASS
- Fixtures: `fixtures/media/unverified-staging.jpg`, `fixtures/media/client-provided-plane.jpg`
- Test users: `admin@jetbay.local`, `media.reviewer@jetbay.local` (password in seed only, not logged here)
- No production JetVina rights escalation

## 5. Admin Media Review

| Flow | UI | API | DB | Audit | Result |
|------|----|-----|----|-------|--------|
| List / filter UNVERIFIED | page | GET /admin/media-assets | MediaAsset | — | PASS |
| Save alt/focal | page | POST upsert | updated | media_asset.update | PASS (API) |
| Approve staging | page | POST approve-staging | flag | media_asset.approve_staging | PASS |
| Approve production UNVERIFIED | expects fail | 403 | unchanged | — | PASS |
| Approve production CLIENT_PROVIDED | API smoke | 200 then reset flag | temp | media_asset.approve_production | PASS |
| Public list | — | GET /content/media-assets | approved only | — | PASS |

Playwright Admin browser E2E: **DEFERRED** (API/service/HTTP smoke covered; full browser login suite not expanded this pass).

## 6. Permissions

| User type | Expected | Actual |
|-----------|----------|--------|
| ADMIN | full media actions | PASS (smoke) |
| Unauthenticated | 401 on admin media | PASS |
| media.reviewer overrides | view/review/staging only | seeded |
| UNVERIFIED → production | reject | PASS |

## 7. Content sync

| Step | Result | Records |
|------|--------|---------|
| seed JetVina source | 201 | source created |
| test-connection | 201 ok | — |
| discover dry-run | 201 job 1 | metadata only |

## 8. Media sync (file)

| Downloaded | Unchanged | Duplicate | Failed |
|------------|-----------|-----------|--------|
| 5 (dry-run counted) | — | 0 | 0 |

## 9. Audit Log

| Action | Logged | Sensitive |
|--------|--------|-----------|
| media_asset.* | yes via AuditService | no secrets in payload |

## 10. Security

| Test | Result |
|------|--------|
| API jest (41) | PASS |
| api-key / brand / url-safety / media-asset | PASS |
| Guards | unchanged, no bypass |

## 11. Playwright

| Suite | Passed | Failed |
|-------|--------|--------|
| media staging (prior) | 13 | 0 |
| media production (prior) | 6 | 0 |

## 12. Build

- API nest build PASS
- Admin build PASS (media-review route)
- Web typecheck PASS
- lint web+admin PASS

## 13. Working tree / commit

See git log after commit. Untracked media scripts/tests included. `tmp/*` ignored except `.gitkeep`. Mirror binaries gitignored.

## 14. Blocker

1. Written media authorization
2. Client production assets
3. Dedicated `jetbay_db` CREATE privilege (optional hardening)
4. Full Playwright Admin browser E2E

## 15. Files

- migration `20260713140000_media_asset_review_fields`
- MediaAsset API + admin Media Review page
- seed fixtures
- media-asset.integration.spec.ts
- docs updates + prior media pass files
