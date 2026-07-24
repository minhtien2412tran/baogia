# Session resume log — 24/07/2026 (Owner inputs)

## Received / claimed

| Task | Owner said | Dev verified |
|------|------------|--------------|
| W4-04 | Option **2** mirror | ✅ Recorded · W4-05 executed |
| W3-06 | “feedback UX: …” | ❌ **Payload empty** — cần paste list |
| W2-05 | “3–5 News đã duyệt: …” | ❌ **Payload empty** — cần paste bài |
| W5-10 | Local `apps/api/.env` SMTP Gmail (24/07 ~10:48) | ✅ Pushed to VPS · PM2 sourced · **PASS** |
| W6-02 | Chuẩn bị pack ký GĐ1 | ✅ [W6_02_GD1_SIGNING_PACK.md](./W6_02_GD1_SIGNING_PACK.md) |

## SMTP probe (VPS meta — no secrets) — after W5-10

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_ALLOW_CATCHER=false
SMTP_USER=SET
SMTP_PASSWORD=SET
integrations.smtp=true · smtpCatcher=false · smtpDeliverable=true
```

## W5-11…14 evidence

| Step | Result |
|------|--------|
| W5-11 quote | **#61** · EmailService sent customer ACK + sales alert |
| W5-12 contact | **#62** · Email sent · newsletter `emailDeliverable=true` |
| W5-13 retry | Code path `EmailCampaignLog` attempts &lt; 3 |
| W5-14 docs | TEST_MATRIX · GD1_SIGNOFF · OWNER_HANDOFF · SMTP_SETUP_GUIDE |

**Ops note:** PM2 dump had stale Mailpit env; fixed by `source .env` before `pm2 restart --update-env`.

## W4-05 done

* Mirror 42/42 local · approve CLIENT_PROVIDED + productionApproved=42  
* `validate-jetvina-media-manifest: PASS`  
* `deploy-web.sh`: `NEXT_PUBLIC_ALLOW_JETVINA_REMOTE=false`  
* Redeploy web after sync
* Hotlink scrub PASS (jetvina.com = 0)
