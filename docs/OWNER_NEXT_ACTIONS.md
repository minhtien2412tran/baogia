# Owner Next Actions — JetBay / JetVina

> **Updated:** 2026-07-15 · **Audience:** Owner (Anh Tuấn Anh / ops)  
> **Dev GĐ2:** complete · **Waiting:** Owner actions below  
> Do **not** send passwords, API keys, or secrets via chat or email to the repo.

---

## P0 — SMTP production

### Required variables (VPS `/var/www/jetbay-be/.env`)

```text
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=          # true | false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=            # e.g. JetVina <noreply@yourdomain>
```

Optional: `SMTP_ENQUIRY_TO=` (sales / enquiry inbox).

### Owner steps

```bash
cd /var/www/jetbay-be
# edit .env safely (nano/vi) — do not echo passwords
pm2 restart jetbay-be --update-env
curl -sS https://api.minhtien.online/integrations/status
```

### Expected JSON (excerpt)

```json
{
  "integrations": {
    "smtp": true,
    "smtpBlockedReason": null
  }
}
```

Today (2026-07-15): Mailpit catcher running on VPS (`127.0.0.1:1025` + UI `:8025` via SSH tunnel).  
Flags: `smtp=false` · `smtpCatcher=true` · `smtpTransportReady=true` — **not** a real customer inbox; T-S4-01 stays blocked until real provider SMTP_*.

### Dev verification after Owner configures

```bash
pnpm smoke:quote-ui
pnpm smoke:newsletter-smtp
# Plus real inbox check with Owner mailbox — only then T-S4-01 = PASS
```

DNS: SPF + DKIM for the From domain.

---

## Phase after Owner unlock

See [GD4_SANDBOX_READINESS.md](./GD4_SANDBOX_READINESS.md) — payment / OAuth / SMS **sandbox** only.

---

## P1 — UAT sign-off

1. Open [UAT_CHECKLIST.md](./UAT_CHECKLIST.md).  
2. Tick Owner acceptance rows on prod https://www.minhtien.online.  
3. Fill **Sign-off** name + date.  
4. Dev must **not** sign for Owner.

---

## P1 — CMS publish

1. Follow [ADMIN_OPS_GUIDE.md](./ADMIN_OPS_GUIDE.md) §3 (news) and §6 (charter pages).  
2. Slugs: [CHARTER_CMS_MAP.md](./CHARTER_CMS_MAP.md).  
3. Publish EN (+ VI if available).  
4. Confirm on `/en-us/news` and charter routes.

---

## P1/P2 — G4 keys

Follow [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md):

- Payment (Stripe / OnePay / 9Pay)  
- OAuth (Google / Apple) if in scope  
- SMS OTP if in scope  

Set on VPS only · never chat · never git.

Verify: `https://api.minhtien.online/integrations/status` flags flip to true for configured providers.

---

## P2 — Media / hotlink decision

Choose one and set a deadline:

1. Allow temporary hotlink `jetvina.com` + mirror deadline.  
2. Mirror assets immediately.  
3. Disable remote sources and accept placeholders.

Related: O5 / O18 in [OWNER_ACTION_ITEMS.md](./OWNER_ACTION_ITEMS.md).

---

## Optional — Report v3.1 wording (O3)

https://www.minhtien.online/baocaotiendo is **already live** at v3.1.  
Status: **DEPLOYED / OPTIONAL_OWNER_REVIEW** — not a technical blocker.

---

## After Owner completes P0

Dev will:

1. Confirm `integrations.smtp=true`.  
2. Send quote + newsletter tests to a real inbox.  
3. Mark T-S4-01 PASS only if inbox receives mail.  
4. Proceed toward GĐ4 integration sandboxes when keys arrive.
