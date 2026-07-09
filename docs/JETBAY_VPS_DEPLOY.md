# Jet-Bay Backend — VPS Deployment Runbook

**Target:** `https://api.minhtien.online` on VPS `103.200.20.100`  
**Isolation:** Không đụng Backend cũ (`api.baotienweb.cloud`, port `3000`, DB `baotienweb`)

> **Chỉ triển khai khi bạn nhắn đúng:** `ĐỒNG Ý TRIỂN KHAI`

---

## Kiến trúc

```
Internet → Nginx :443 (api.minhtien.online) → 127.0.0.1:3010 (jetbay-be / PM2)
                                              → PostgreSQL jetbay_db (riêng)
```

| Thành phần | Giá trị |
|------------|---------|
| API domain | `api.minhtien.online` |
| Source | `/var/www/jetbay-be` |
| Runtime | PM2 `jetbay-be` |
| Bind | `127.0.0.1:3010` |
| Database | `jetbay_db` / `jetbay_user` |
| Uploads | `/var/www/jetbay-be/uploads` |
| Logs | `/var/www/jetbay-be/logs` |
| Nginx | `/etc/nginx/sites-available/api.minhtien.online` |

---

## Trạng thái chuẩn bị (preflight read-only)

| Kiểm tra | Kết quả |
|----------|---------|
| Port `3010` | Trống |
| DNS `api.minhtien.online` | → `103.200.20.100` |
| Nginx config `minhtien` | Chưa có (sẽ tạo mới) |
| `/var/www/jetbay-be` | Chưa có (sẽ tạo mới) |
| Code `GET /health` | Đã thêm trong `apps/api` |
| Bind `HOST=127.0.0.1` | Đã hỗ trợ trong `main.ts` |

---

## Artifacts trong repo

```
scripts/deploy/jetbay-be/
├── preflight.sh              # Kiểm tra read-only trên VPS
├── sync-source.sh            # Upload source từ máy dev lên VPS
├── deploy.sh                 # Triển khai đầy đủ (cần DEPLOY_CONFIRM)
├── rollback.sh               # Gỡ Jet-Bay, không đụng BE cũ
├── rotate-secrets.sh         # Random lại JWT/DB/API secrets (không in ra)
├── ecosystem.config.js       # PM2
├── api.minhtien.online.nginx.conf
└── env.production.template
```

Secrets runbook: [SECURITY_SECRETS.md](./SECURITY_SECRETS.md)

---

## Quy trình triển khai (3 bước)

### Bước A — Upload source (máy dev)

```bash
# Từ root repo baogia
bash scripts/deploy/jetbay-be/sync-source.sh
```

Script sẽ:
1. Build API local (`pnpm --filter @jetbay/api build`)
2. Rsync `apps/api/` → `root@103.200.20.100:/var/www/jetbay-be/`
3. Copy deploy scripts → `/var/www/jetbay-be/deploy/`

### Bước B — Preflight trên VPS (read-only)

```bash
ssh root@103.200.20.100
bash /var/www/jetbay-be/deploy/preflight.sh
```

### Bước C — Triển khai (chỉ sau khi bạn xác nhận)

```bash
ssh root@103.200.20.100
DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' bash /var/www/jetbay-be/deploy/deploy.sh
```

Script tự động:
1. Backup `/etc/nginx/sites-available` + `sites-enabled`
2. Preflight
3. Tạo thư mục `uploads/`, `logs/`
4. Tạo `jetbay_db` + `jetbay_user` (password random, không in ra)
5. Tạo `.env` riêng (secrets mới, không copy BE cũ)
6. `npm install` + `prisma generate` + `build`
7. `prisma migrate deploy`
8. PM2 start `jetbay-be`
9. `curl http://127.0.0.1:3010/health`
10. Cài Nginx site mới (không sửa `api.baotienweb.cloud`)
11. `nginx -t` → reload (chỉ khi pass)
12. `certbot --nginx -d api.minhtien.online`
13. Test `https://api.minhtien.online/health`
14. Test lại `https://api.baotienweb.cloud/api/v1/health`

---

## Endpoint bắt buộc

```
GET /health
```

```json
{
  "status": "ok",
  "service": "jetbay-be",
  "env": "production",
  "version": "1.0.0"
}
```

---

## ENV production

Template: `scripts/deploy/jetbay-be/env.production.template`

Biến bắt buộc theo spec deploy + mapping Prisma:

| Spec deploy | Trong app |
|-------------|-----------|
| `DB_*` | Dùng build `DATABASE_URL` |
| `JWT_SECRET` | Auth access token |
| `REFRESH_TOKEN_SECRET` | Auth refresh token |
| `HOST` + `PORT` | `main.ts` listen |
| `CORS_ORIGIN` | CORS middleware |
| `API_PUBLIC_URL` | URL tài liệu/upload |
| `UPLOAD_PATH` / `LOG_PATH` | Thư mục riêng |

**Không** copy secret từ `/var/www/baotienweb-api/.env`.

### Xoay secrets (định kỳ / sau lộ)

```bash
bash /var/www/jetbay-be/deploy/rotate-secrets.sh
```

Script random `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `API_KEY`, `PAYMENT_SECRET`, password `jetbay_user` + `DATABASE_URL`; backup `.env` vào `/root/backups/jetbay-secrets-*`; **không in secret**; restart PM2; truncate refresh tokens (user phải login lại).

---

## Vận hành sau deploy

| Thao tác | Lệnh |
|----------|------|
| Xem status | `node /usr/lib/node_modules/pm2/bin/pm2 status` |
| Restart | `node /usr/lib/node_modules/pm2/bin/pm2 restart jetbay-be --update-env` |
| Logs | `node /usr/lib/node_modules/pm2/bin/pm2 logs jetbay-be --lines 100` |
| Health local | `curl http://127.0.0.1:3010/health` |
| Health public | `curl https://api.minhtien.online/health` |
| Rotate secrets | `bash /var/www/jetbay-be/deploy/rotate-secrets.sh` |

---

## Rollback

```bash
# BACKUP_DIR = thư mục backup nginx in ra sau deploy
DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' bash /var/www/jetbay-be/deploy/rollback.sh /root/backups/jetbay-be-YYYYMMDD-HHMMSS
```

Rollback sẽ:
- Dừng PM2 `jetbay-be`
- Xóa site `api.minhtien.online`
- Khôi phục Nginx từ backup (nếu có)
- **Không** restart/sửa Backend cũ

---

## Rủi ro đã ghi nhận từ audit

1. **Disk 82%** — nên dọn log/backup trước deploy
2. **Docker CLI hỏng** — Jet-Bay dùng PM2, không phụ thuộc Docker
3. **Port 3010** — chỉ bind `127.0.0.1`, không mở UFW
4. **Nginx warnings `homefix.asia`** — không chặn deploy; không sửa file backup

---

## Bàn giao (sau deploy thành công)

| Mục | Giá trị |
|-----|---------|
| API domain | `https://api.minhtien.online` |
| Port nội bộ | `127.0.0.1:3010` |
| Source | `/var/www/jetbay-be` |
| PM2 | `jetbay-be` |
| Nginx | `/etc/nginx/sites-available/api.minhtien.online` |
| Database | `jetbay_db` |
| DB user | `jetbay_user` |
| Health | `GET /health` |
| SSL | Let's Encrypt via certbot |

---

## Docs / Swagger / DKIM

Chi tiết: [API.md](./API.md) · [JETBAY_VPS_AUDIT_RESTRUCTURE.md](./JETBAY_VPS_AUDIT_RESTRUCTURE.md)

| URL | Ghi chú |
|-----|---------|
| https://docs.minhtien.online/swagger | Swagger UI (Jet-Bay API) |
| https://api.minhtien.online/swagger | Cùng document qua API host |
| https://api.minhtien.online/openapi.json | OpenAPI 3 JSON |
| https://api.minhtien.online/integrations/status | Readiness flags, không lộ secret |
| DKIM `default._domainkey` | Đã cấu hình DNS `minhtien.online` |
