# SMTP Setup Guide

> **Updated:** 2026-07-15 · **Status:** Mailpit catcher ON VPS · Real inbox **BLOCKED_OWNER_SMTP**  
> **Vars:** `apps/api/.env.example` · Prod: VPS `/var/www/jetbay-be/.env` (never commit)

## Modes

| Mode | When | `smtp` (deliverable) | `smtpCatcher` | `smtpTransportReady` | T-S4-01 |
|------|------|----------------------|---------------|----------------------|---------|
| Real SMTP | Owner provider | true | false | true | PASS after inbox |
| Mailpit catcher | `SMTP_ALLOW_CATCHER=true` + loopback | **false** | **true** | **true** | stays BLOCKED |
| Broken loopback | localhost, no catcher flag | false | false | false | BLOCKED |

## Mailpit on VPS (ops catcher)

```bash
# on VPS
bash /var/www/jetbay-be/deploy/install-mailpit.sh
# ensures container jetbay-mailpit — 127.0.0.1:1025 + :8025 only
python3 /var/www/jetbay-be/deploy/ensure-smtp-catcher-env.py
pm2 restart jetbay-be --update-env
```

UI only via SSH tunnel (not public):

```bash
ssh -L 8025:127.0.0.1:8025 root@VPS
# open http://127.0.0.1:8025
```

`.env` (already typical for catcher):

```text
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_ALLOW_CATCHER=true
SMTP_FROM=...
```

Newsletter still returns `emailDeliverable=false` under catcher (không hứa inbox khách).

## Owner — real production SMTP (đóng T-S4-01)

```bash
# /var/www/jetbay-be/.env
SMTP_HOST=smtp.your-provider.example
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM="JetVina <noreply@yourdomain>"
SMTP_ENQUIRY_TO=sales@yourdomain
# remove or set SMTP_ALLOW_CATCHER=false
```

```bash
pm2 restart jetbay-be --update-env
curl -sS https://api.minhtien.online/integrations/status
# expect smtp=true , smtpCatcher=false , smtpBlockedReason=null
# + real inbox proof → T-S4-01 PASS
```

## Local laptop

```bash
docker compose up -d mailpit
# UI http://localhost:8025 — APP_ENV=development uses localhost without catcher flag
```

## Dev tests

```bash
pnpm --filter @jetbay/api exec jest --testPathPatterns=smtp-config
```
