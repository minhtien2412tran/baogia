# Session resume log — 24/07/2026 (Owner inputs)

## Received / claimed

| Task | Owner said | Dev verified |
|------|------------|--------------|
| W4-04 | Option **2** mirror | ✅ Recorded · W4-05 executed |
| W3-06 | “feedback UX: …” | ❌ **Payload empty** — cần paste list |
| W2-05 | “3–5 News đã duyệt: …” | ❌ **Payload empty** — cần paste bài |
| W5-10 | “SMTP đã cấu hình VPS” | ❌ **FALSE** — prod vẫn Mailpit catcher |
| W6-02 | Chuẩn bị pack ký GĐ1 | ✅ [W6_02_GD1_SIGNING_PACK.md](./W6_02_GD1_SIGNING_PACK.md) |

## SMTP probe (VPS meta — no secrets)

```text
SMTP_HOST=LOOPBACK (localhost)
SMTP_PORT=1025
SMTP_ALLOW_CATCHER=true
SMTP_USER=NOT_SET
SMTP_PASSWORD=NOT_SET
integrations.smtp=false · smtpCatcher=true
```

→ **W5-11…14 NOT RUN** (would fail inbox). Owner phải set SMTP thật rồi báo lại W5-10.

## W4-05 done

* Mirror 42/42 local · approve CLIENT_PROVIDED + productionApproved=42  
* `validate-jetvina-media-manifest: PASS`  
* `deploy-web.sh`: `NEXT_PUBLIC_ALLOW_JETVINA_REMOTE=false`  
* Redeploy web after sync
