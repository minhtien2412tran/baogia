# SMTP Setup Guide

> **Updated:** 2026-07-15 · **Status:** Dev guard **PASS** · Production delivery **BLOCKED_OWNER_SMTP**  
> **Vars:** `apps/api/.env.example` · Prod: VPS `/var/www/jetbay-be/.env` (never commit)

## Hiện trạng (verified 2026-07-15)

| Check | Result |
|-------|--------|
| Prod `SMTP_HOST` | `localhost` |
| Prod `SMTP_PORT` | `1025` |
| `/integrations/status` → `smtp` | **false** (deliverable) after API deploy |
| `smtpHostSet` | true |
| `smtpBlockedReason` | loopback not valid for production |
| Newsletter API | `201` + `emailDeliverable:false` (subscription saved; mail not claimed) |

Code (`apps/api/src/utils/smtp-config.ts`): production **rejects** localhost / `127.0.0.1` / `*.local` as “configured”. Local/dev may still use MailHog.

## Owner phải set trên VPS (không gửi vào chat/git)

```bash
# /var/www/jetbay-be/.env — edit on VPS only
SMTP_HOST=smtp.your-provider.example
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM="JetVina <noreply@yourdomain>"
SMTP_ENQUIRY_TO=sales@yourdomain
# optional:
# SMTP_TLS_REJECT_UNAUTHORIZED=false
```

DNS: SPF + DKIM for From domain.

Then:

```bash
pm2 restart jetbay-be --update-env
curl -sS https://api.minhtien.online/integrations/status | jq '.integrations.smtp,.integrations.smtpBlockedReason'
# expect smtp=true , smtpBlockedReason=null

# Real inbox proof (Owner):
# 1) newsletter subscribe with real email
# 2) quote request with real email
# Only then mark T-S4-01 PASS
```

## Dev verification (no real inbox)

```bash
pnpm --filter @jetbay/api exec jest --testPathPatterns=smtp-config
```
