# Test Matrix — JetBay

> **Updated:** 2026-07-15 · **Status:** CURRENT · GĐ2 Dev complete · Waiting Owner

## Latest evidence (prefer these)

```text
Latest quote-ui request: #42
Latest web-api quote: #41
Latest booking smoke: #7
Production API sync: PASS — 173=173
Remote VPS runner: PASS
Local convenience credential: NEEDS_LOCAL_ENV_REFRESH
```

| Test | Command | Environment | Result | PASS | FAIL | Ghi chú |
|------|---------|-------------|--------|------|------|---------|
| Prod health | `curl https://api.minhtien.online/health` | prod | PASS | 1 | 0 | env=production |
| Prod integrations | `/integrations/status` | prod | PARTIAL | 1 | 0 | smtp LOOPBACK; pay/oauth/sms false |
| Web / Admin / Swagger | curl | prod | PASS / PASS / **401 Basic** | 2 | — | Swagger Basic ON |
| smoke-web-api | `node scripts/deploy/jetbay-be/smoke-web-api.mjs` | prod | **PASS** | 9 | 0 | quote **#41** |
| smoke-auth-booking | `node …/smoke-auth-booking.mjs` | prod | **PASS** | 4 | 0 | booking **#7** |
| smoke:quote-ui | `pnpm smoke:quote-ui` | prod | **PASS** | 2 | 0 | requestId=**#42** (chốt; #40 earlier 15/07) |
| Production API sync | VPS remote runner | prod↔docs | **PASS** | — | 0 | **173=173** |
| Local api-sync | `SYNC_MODE=prod-docs pnpm smoke:api-sync` | laptop | exit 2 if stale | — | — | NEEDS_LOCAL_ENV_REFRESH |
| smtp-config jest | `jest --testPathPatterns=smtp-config` | local | **PASS** | ≥4 | 0 | + host.docker.internal |
| smoke:html-probe | `pnpm smoke:html-probe` (defaults baocaotiendo 3.1 / 14/07) | prod | **PASS** | — | 0 | 30s timeout |
| smoke:newsletter-smtp | `pnpm smoke:newsletter-smtp` | prod | **PASS** | — | 0 | emailDeliverable=false |
| backup-restore-drill | VPS script | VPS | **PASS** | — | 0 | 120=120 · dump `20260714-145739` |
| Mailpit catcher | VPS docker + `SMTP_ALLOW_CATCHER` | prod | **PASS catcher** | — | 0 | smtpCatcher=true · mail in UI · not real inbox |
| T-S4-01 inbox | real mailbox | prod | **BLOCKED_OWNER_SMTP** | — | — | see canonical below |

## History quote IDs (not contradictions)

| ID | Source | Day |
|----|--------|-----|
| #37 | prior smoke:quote-ui | 2026-07-14 |
| #38/#39 | earlier 15/07 | 2026-07-15 |
| #40 / #41 | earlier quote-ui / web-api | 2026-07-15 |
| #42 | latest smoke:quote-ui | 2026-07-15 |

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
Local convenience credential: NEEDS_LOCAL_ENV_REFRESH
```

## HTML probe

```powershell
pnpm smoke:html-probe https://www.minhtien.online/baocaotiendo 3.1 14/07
```
