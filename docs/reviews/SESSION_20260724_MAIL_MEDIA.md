# Session log — 24/07/2026 (mail + media + Contact)

> Agent phải đọc file này / CONTINUE — **không** hỏi lại Owner những gì đã PASS bên dưới.

## Snapshot cuối (~11:20 ICT)

| Hạng mục | Status | Evidence |
|----------|--------|----------|
| Contact EN/VI | **LIVE 200** | `/en-us/contact` · `/vi/contact` |
| Media Option 2 + hotlink scrub | **PASS** | jetvina.com HTML = 0 · mirror local |
| i18n audit | **PASS** | fail=0 warn=0 |
| Alias 404 redirects | **PASS** | 308 travel-credits → travel-credit, etc. |
| SMTP W5-10 | **PASS** | `smtp=true` · `catcher=false` · Gmail 465 |
| Quote mail API send #61/#62 | **PASS** (logs) | W5-11 Owner inbox còn **PENDING** |
| Mail SoT (quote/booking/operator) | **CODE+DEPLOY** | [ORDER_EMAIL_AUTOMATION.md](../ORDER_EMAIL_AUTOMATION.md) |
| Email datetime rõ (tz IANA) | **PASS** | `utils/email-datetime.ts` · deploy ~11:20 |
| Idempotent mail SENT skip | **PASS** | unit + code |
| operator_unassigned alert | **PASS** | code |
| W5-11 Owner inbox confirm | **PENDING_OWNER** | form `W5-11 INBOX` |
| W5-12 fan-out / 12B/C / W5-13 E2E | **PENDING** | sau W5-11 |
| W5-14 | **BLOCKED** | cần 11–13 |
| News / UX / ký GĐ1 | **PENDING_OWNER** | [OWNER_INPUT_FORMS.md](../OWNER_INPUT_FORMS.md) |
| Admin Mail Ops UI / Operator Portal | **NOT STARTED** | epic riêng — không ghi DONE |

## Deploy refs (VPS)

- Web hotlink/Contact/i18n: backups `jetbay-web-20260724-10*`
- API SMTP sourced + mail SoT + datetime: `jetbay-be-20260724-112005` (và trước đó `111559`, `110205`)

## Quy tắc agent (Owner yêu cầu 24/07)

**Xong code → tự cập nhật markdown SoT trong cùng turn.** Không để trạng thái chỉ trong chat; lần sau không hỏi lại / mò lại.
