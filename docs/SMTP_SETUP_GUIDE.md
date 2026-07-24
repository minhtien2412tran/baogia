# SMTP Setup Guide

> **Updated:** 2026-07-24 · **Status:** Mailpit catcher ON VPS · Real inbox **BLOCKED_OWNER_SMTP**  
> **Vars:** `apps/api/.env.example` · Prod: VPS `/var/www/jetbay-be/.env` (never commit)  
> **Wave 5a:** chuẩn bị xong — **không** gửi mail thật cho đến khi Owner set SMTP_* (W5-10+)

## Modes

| Mode | When | `smtp` (deliverable) | `smtpCatcher` | `smtpTransportReady` | T-S4-01 |
|------|------|----------------------|---------------|----------------------|---------|
| Real SMTP | Owner provider | true | false | true | PASS after inbox |
| Mailpit catcher | `SMTP_ALLOW_CATCHER=true` + loopback | **false** | **true** | **true** | stays BLOCKED |
| Broken loopback | localhost, no catcher flag | false | false | false | BLOCKED |

## Wave 5a — Checklist Owner (điền trên VPS · không commit)

Bắt buộc:

```text
SMTP_HOST=
SMTP_PORT=          # thường 587 (STARTTLS) hoặc 465 (TLS)
SMTP_SECURE=        # true nếu port 465; false nếu 587
SMTP_USER=
SMTP_PASSWORD=      # chỉ trên VPS / secret manager — không chat / không Git
SMTP_FROM=          # ví dụ: JetVina <noreply@yourdomain>
```

Tuỳ chọn:

```text
SMTP_FROM_NAME=     # nếu app hỗ trợ tách tên (thường gộp trong SMTP_FROM)
SMTP_ENQUIRY_TO=    # inbox sales nhận enquiry
SMTP_ALLOW_CATCHER=false   # tắt khi dùng SMTP thật
```

### Cách đặt + restart + verify

```bash
cd /var/www/jetbay-be
nano .env
pm2 restart jetbay-be --update-env
curl -sS https://api.minhtien.online/integrations/status
# expect: integrations.smtp=true · smtpCatcher=false · smtpBlockedReason=null
```

### Lệnh smoke sau khi cấu hình (W5b — AFTER_SMTP)

```bash
pnpm smoke:newsletter-smtp
pnpm smoke:quote-ui
# optional on VPS:
# node scripts/smoke-quote-order-mail.mjs
# Mailpit UI (catcher only): ssh -L 8025:127.0.0.1:8025 … → http://127.0.0.1:8025
```

- Status: `GET https://api.minhtien.online/integrations/status`  
- Logs: `pm2 logs jetbay-be --lines 100`  
- **Dừng trước W5-10** nếu chưa có credentials Owner.

## Mailpit on VPS (ops catcher)

```bash
bash /var/www/jetbay-be/deploy/install-mailpit.sh
python3 /var/www/jetbay-be/deploy/ensure-smtp-catcher-env.py
pm2 restart jetbay-be --update-env
```

```bash
ssh -L 8025:127.0.0.1:8025 root@VPS
# http://127.0.0.1:8025
```

## Local laptop

```bash
docker compose up -d mailpit
# UI http://localhost:8025
```

## Dev tests

```bash
pnpm --filter @jetbay/api exec jest --testPathPatterns=smtp-config
pnpm smoke:newsletter-smtp
```

## Email templates (W5-02 — review only, no send)

- Layout: `apps/api/src/services/customer-care/email-layout.ts` — JetVina chrome · links `www.minhtien.online` / admin quotes.  
- Welcome subject: `Welcome to JetVina` (`email-templates.ts`).  
- Quote/booking ACK qua CustomerCare — phụ thuộc SMTP deliverable.  
- Contact page lưu QuoteRequest prefix `[Website Contact]` — mail ACK khi SMTP thật.  
- Không lộ password/API key trong template.  

Không gửi email thật trong Wave 5a.
