# Order receive & auto / semi-auto email

> **Updated:** 2026-07-15 · **Status:** CURRENT (Mailpit catcher OK · real inbox still Owner)

## Templates (HTML)

- Shared chrome: `apps/api/src/services/customer-care/email-layout.ts` — charcoal + gold JETVINA, detail card, CTA.
- Campaign copy: `email-templates.ts` (vi / zh-cn / en + greeting fallthrough).
- Ops / sales + Jet Card / Travel Credit: `ops-email-templates.ts`.
- Locale: UI `locale` trên quote / enquiry DTO; fallback `inferLocaleFromPhone` (`+84` → vi, `+86` → zh-cn…).

## Flow

```text
Customer → POST /quotes/request
  ├── persist QuoteRequest
  ├── AUTO customer: quote_received (+ followup_24h queued)
  └── AUTO sales: [JetVina Quote] → SMTP_ENQUIRY_TO

Admin → POST /admin/quotes/:id/offers   (semi-auto)
  ├── QuoteOffer + status OFFERED
  └── AUTO customer: quote_offered

Customer → POST /bookings
  ├── AUTO customer: booking_created
  └── AUTO operator + admin flight notify

Cancel booking
  ├── AUTO customer: booking_cancelled
  └── AUTO operator/admin notify (event=cancelled)

Jet Card / Travel Credit enquiry
  └── AUTO customer + sales (EnquiryMailService)
```

## Ops checklist

1. Keep Mailpit or real SMTP transport ready (`smtpTransportReady`).
2. Set `SMTP_ENQUIRY_TO` (sales) on VPS `.env`.
3. Admin Creates offer in `/dashboard/quotes` → customer gets `quote_offered`.
4. Do **not** mark T-S4-01 PASS until real inbox provider (catcher ≠ customer inbox).

## Smoke

```bash
node scripts/smoke-quote-order-mail.mjs
# SSH tunnel Mailpit UI → see customer + sales subjects
```
