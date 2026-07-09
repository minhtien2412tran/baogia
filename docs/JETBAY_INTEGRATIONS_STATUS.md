# Jet-Bay — JWT & công nghệ hỗ trợ

**Kiểm tra live (không lộ secret):**  
https://api.minhtien.online/integrations/status

## Audit VPS (2026-07-09)

| Hạng mục | Trạng thái | Ghi chú |
|----------|------------|---------|
| **JWT_SECRET** | ✅ Đã có (64 chars) | Login trả accessToken 3 phần |
| **REFRESH_TOKEN_SECRET** | ✅ Đã có (64 chars) | Refresh token riêng |
| **DATABASE_URL** | ✅ | `jetbay_db` |
| **Redis** | ✅ `REDIS_URL` + PONG | DB index `/2` |
| **CORS / HOST / PORT** | ✅ | `127.0.0.1:3010` |
| **API_KEY / PAYMENT_SECRET** | ✅ | App-level secrets |
| SMTP | ❌ EMPTY | Cần cấu hình mail |
| MinIO | ❌ EMPTY | Upload local path vẫn dùng được |
| Google / Apple OAuth | ❌ EMPTY | Chờ Client ID KH |
| Stripe / OnePay / 9Pay | ❌ EMPTY | Chờ merchant keys |
| SMS OTP (Twilio/ESMS) | ❌ EMPTY | Dev: OTP log console nếu không prod SMS |

**Kết luận:** JWT **đã cấu hình trên production**. Phần “chưa có” chủ yếu là **tích hợp bên thứ 3 (GĐ4)** — không phải thiếu JWT.

## Local development

Copy `apps/api/.env.example` → `apps/api/.env` và đặt:

```bash
JWT_SECRET=<openssl rand -base64 48>
REFRESH_TOKEN_SECRET=<openssl rand -base64 48>
DATABASE_URL=postgresql://...
REDIS_URL=redis://127.0.0.1:6379/0
```

Production boot **từ chối khởi động** nếu thiếu `JWT_SECRET` / `REFRESH_TOKEN_SECRET` / `DATABASE_URL`.

## Endpoint

| Path | Mục đích |
|------|----------|
| `GET /health` | Liveness đơn giản |
| `GET /integrations/status` | JWT/DB/Redis + cờ G4 (boolean, không in secret) |
| `GET /admin/system-health` | Chi tiết hơn (cần admin JWT) |

## Cấu hình G4 (khi có keys)

Xem [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md).  
Điền vào `/var/www/jetbay-be/.env` rồi:

```bash
node /usr/lib/node_modules/pm2/bin/pm2 restart jetbay-be --update-env
bash /var/www/jetbay-be/deploy/audit-integrations.sh
curl -s https://api.minhtien.online/integrations/status
```
