# Test Matrix — JetBay

> **Updated:** 2026-07-24 ~14:50 · Snapshot [reviews/SESSION_20260724_MAIL_MEDIA.md](./reviews/SESSION_20260724_MAIL_MEDIA.md)

## Latest evidence (prefer these)

```text
Session 24/07 ~14:50 ICT:
W5-12/12B DEV_API PASS — smoke-w5-12-booking-fanout.mjs
BK-000014/015: booking_created + :operator (+fan-out) + :sales SENT; cancel SENT
Operator Portal: NOT STARTED — OPERATOR_PORTAL_EPIC.md
W5-11 PENDING_OWNER · W5-14 BLOCKED
R5 scope DEPLOYED · R4 DONE
```

| Test | Command | Environment | Result | PASS | FAIL | Ghi chú |
|------|---------|-------------|--------|------|------|---------|
| Prod health | `curl …/health` | prod | PASS | 1 | 0 | production |
| Contact pages | curl `/en-us/contact` `/vi/contact` | prod | **PASS** | 2 | 0 | was 404 |
| smoke-web-api | `node …/smoke-web-api.mjs` | prod | **PASS** | 9 | 0 | quote **#60** |
| smoke-auth-booking | `API_URL=https://api.minhtien.online …` | prod | **PASS** | 4 | 0 | booking **#13** |
| audit:i18n | `pnpm audit:i18n` | local | **PASS** | 45 | 0 | warn=0 |
| CMS inventory | `node scripts/cms-inventory-audit.mjs` | prod API | DONE | — | — | News n=1 |
| Media audit | `node scripts/media-domain-audit.mjs` | prod HTML | DONE | — | 0 hotlink | Option 2 |
| Page walk | [GD2_PAGE_WALK_20260724](./reviews/GD2_PAGE_WALK_20260724.md) | prod | PASS+aliases | — | — | 308 redirects |
| smoke:newsletter-smtp | `pnpm smoke:newsletter-smtp` | prod | **PASS** | — | 0 | deliverable=**true** |
| smoke-quote-real-smtp | `node scripts/smoke-quote-real-smtp.mjs` | prod | **PASS** | — | 0 | quote **#61** sent |
| smoke-contact-real-smtp | `node scripts/smoke-contact-real-smtp.mjs` | prod | **PASS** | — | 0 | quote **#62** sent |
| CMS publish-cycle W2-09 | `node scripts/smoke-cms-publish-cycle.mjs` (VPS) | prod | **PASS** | — | 0 | id=67 · 24/07 |

## History quote IDs (not contradictions)

| ID | Source | Day |
|----|--------|-----|
| #37 | prior smoke:quote-ui | 2026-07-14 |
| #38/#39 | earlier 15/07 | 2026-07-15 |
| #40 / #41 | earlier quote-ui / web-api | 2026-07-15 |
| #42 | latest smoke:quote-ui | 2026-07-15 |
| #58 / #59 | Wave 1 smoke-web-api VPS / local | 2026-07-24 |
| #61 / #62 | W5 real SMTP quote + contact | 2026-07-24 |

## T-S4-01 SMTP status (canonical)

```text
Dev implementation: PASS
Production SMTP configuration: PASS (Gmail 465 · catcher OFF · 24/07 ~10:51)
API send logs quote #61/#62: PASS (EmailService sent)
Owner inbox verification (W5-11): PENDING_OWNER — confirm Inbox/Spam + screenshot
W5-12 booking fan-out / W5-13 retry E2E: PENDING (after W5-11)
W5-14 docs close: BLOCKED until 11–13 evidence
Overall T-S4-01 config: PASS · full mail UAT: IN_PROGRESS
Retry path (W5-13): code present — EmailCampaignLog attempts < 3 · idempotent skip SENT
```

Mail SoT: [ORDER_EMAIL_AUTOMATION.md](./ORDER_EMAIL_AUTOMATION.md)

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
