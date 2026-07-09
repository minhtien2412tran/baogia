# G4 — Auth / Payment / PDF UAT checklist

**API:** https://api.minhtien.online  
**Live status (no secrets):** https://api.minhtien.online/integrations/status  
**JWT / Redis / DB:** đã cấu hình production — xem [JETBAY_INTEGRATIONS_STATUS.md](./JETBAY_INTEGRATIONS_STATUS.md)  
**Code:** đã có OAuth, OTP, Stripe, OnePay, 9Pay, DocumentService  
**Blocker G4:** keys phía khách hàng / merchant (không phải JWT)

## Core đã có trên VPS

| Biến | Trạng thái |
|------|------------|
| `JWT_SECRET` | ✅ |
| `REFRESH_TOKEN_SECRET` | ✅ |
| `DATABASE_URL` | ✅ |
| `REDIS_URL` | ✅ |
| `API_KEY` / `PAYMENT_SECRET` | ✅ |

## Secrets G4 cần cấu hình (`/var/www/jetbay-be/.env`)

Không commit giá trị thật. Điền rồi `pm2 restart jetbay-be --update-env`.

| Biến | Mục đích | Trạng thái |
|------|----------|------------|
| `GOOGLE_CLIENT_ID` | Google Sign-In | ⬜ chờ KH |
| `APPLE_CLIENT_ID` | Apple Sign-In | ⬜ chờ KH |
| `TWILIO_*` hoặc `ESMS_*` / `SMS_API_*` | SMS OTP | ⬜ chờ KH |
| `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` | Stripe | ⬜ chờ KH |
| `ONEPAY_*` | OnePay VN | ⬜ chờ KH |
| `NINEPAY_*` | 9Pay VN | ⬜ chờ KH |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` | Email | ⬜ chờ KH |
| `MINIO_*` | Object storage (tuỳ chọn) | ⬜ |

Web/Admin cũng cần:

| Biến | App |
|------|-----|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | web |
| `NEXT_PUBLIC_APPLE_CLIENT_ID` | web |

## UAT steps (khi có keys)

1. **Email login** — `demo@jetbay.local` / `Demo123!` → ✅ đã smoke
2. **OTP** — `POST /auth/otp/send` → nhận SMS hoặc devCode
3. **Google/Apple** — login UI trên web domain đã verify
4. **Payment sandbox** — tạo booking → OnePay/9Pay/Stripe redirect → webhook cập nhật `Payment`
5. **PDF** — `GET` document export trên booking đã thanh toán / confirmed
6. **Webhook host** — khi cần: Nginx `webhook.minhtien.online` → `127.0.0.1:3010` (DNS đã có)

## DoD G4

- [ ] 1 giao dịch sandbox thành công
- [ ] 1 PDF/Word gắn booking
- [ ] Login ≥ 2 phương thức trên staging (email + OAuth hoặc OTP)

## Ngoài phạm vi cho đến khi có keys

Không mock merchant production. Giữ stub nội bộ khi env trống (hành vi hiện tại của PaymentService).
