# Jet-Bay VPS — Audit tái cấu trúc (tránh va chạm)

**VPS:** `103.200.20.100`  
**Ngày:** 2026-07-09  
**Mục tiêu:** Tài liệu/Swagger + DKIM `minhtien.online` mà không đụng Backend cũ / port đang chạy

---

## 1. Bản đồ port đang dùng (không chiếm thêm)

| Port | Bind | Service | Ghi chú Jet-Bay |
|------|------|---------|-----------------|
| 80/443 | `0.0.0.0` | Nginx | Chỉ thêm vhost mới |
| **3010** | **`127.0.0.1`** | **jetbay-be (PM2)** | **Đã dùng — không public UFW** |
| 3000 | `0.0.0.0` | Backend cũ baotienweb | **Không đụng** |
| 3001 | `0.0.0.0` | Docker | Không dùng |
| 3005 | `0.0.0.0` | homefix-admin Next | Không đụng |
| 4000 | `0.0.0.0` | Docker proxy | Không dùng cho Jet-Bay |
| 5432 | `127.0.0.1` | PostgreSQL | DB riêng `jetbay_db` |
| 6379 | `127.0.0.1` | Redis | Jet-Bay dùng DB index `/2` |
| 25/465/587 | `0.0.0.0` | Postfix | Mail server sẵn có |
| 993/995/110/143 | `0.0.0.0` | Dovecot | Mail |
| 11332 | `127.0.0.1` | rspamd milter | DKIM signing |

**Quy tắc:** Jet-Bay không mở port mới ra internet. Chỉ Nginx 80/443.

---

## 2. Phân tách domain (DNS đã có trên P.A Vietnam)

| Subdomain DNS | Trỏ IP | Vai trò đề xuất Jet-Bay | Trạng thái |
|---------------|--------|-------------------------|------------|
| `api.minhtien.online` | 103.200.20.100 | API production | **Đang chạy** HTTPS |
| `docs.minhtien.online` | 103.200.20.100 (wildcard `*`) | Swagger / OpenAPI | **Đã cấu hình** HTTPS |
| `admin.minhtien.online` | DNS sẵn | Admin Next (sau) | Chưa deploy — giữ trống |
| `upload.minhtien.online` | DNS sẵn | CDN/upload (sau) | Chưa deploy |
| `webhook.minhtien.online` | DNS sẵn | Payment webhooks (sau) | Chưa deploy |
| `ws.minhtien.online` | DNS sẵn | WebSocket (sau) | Chưa deploy |
| `cdn.minhtien.online` | DNS sẵn | Static assets (sau) | Chưa deploy |
| `@` / `www` | 103.200.20.100 | Landing (tuỳ chọn) | Không đụng BE cũ |

**Không dùng domain cũ** (`api.baotienweb.cloud`, `homefix.asia`, …).

---

## 3. Tài liệu / Swagger (đã public)

| URL | Mục đích |
|-----|----------|
| https://api.minhtien.online/swagger | Swagger UI (cùng API) |
| https://api.minhtien.online/openapi.json | OpenAPI JSON |
| https://docs.minhtien.online/swagger | Docs subdomain (chỉ docs) |
| https://docs.minhtien.online/openapi.json | OpenAPI JSON |
| https://docs.minhtien.online/health | Health check |
| https://api.minhtien.online/health | Health check |

`docs.minhtien.online` **chỉ** proxy `/swagger`, `/openapi.json`, `/health` → `127.0.0.1:3010`. Các path khác trả 404.

Nginx file: `/etc/nginx/sites-available/docs.minhtien.online`  
Không sửa: `api.baotienweb.cloud`.

---

## 4. DKIM `minhtien.online`

### Trạng thái server

| Mục | Trước | Sau |
|-----|-------|-----|
| Mail domain trong PostfixAdmin | Chỉ `baotienweb.cloud`, `appdesignbuild.com` | **Chưa** thêm mailbox domain (cần aaPanel nếu gửi mail) |
| DKIM key | Không có | **Đã tạo** `/www/server/dkim/minhtien.online/` |
| rspamd signing | Không có minhtien | **Đã thêm** selector `default` |
| DNS TXT DKIM | Thiếu trên P.A Vietnam | **Bạn cần paste** (xem dưới) |

### Bản ghi DNS cần thêm (P.A Vietnam)

| Field | Value |
|-------|-------|
| **Host** | `default._domainkey` |
| **Type** | `TXT` |
| **TTL** | `3600` |
| **Value** | (xem file bàn giao / output script — một dòng `v=DKIM1; k=rsa;p=...`) |

Private key **không** đưa ra ngoài. Chỉ public key vào DNS.

### SPF / DMARC (đã có trên DNS)

- SPF: `v=spf1 ip4:103.200.20.100 ~all` ✅  
- DMARC: `v=DMARC1; p=none; rua=mailto:admin@minhtien.online` ✅  
- DKIM: **cần thêm** `default._domainkey` (bước còn lại của bạn)

### Gửi mail thật từ `@minhtien.online`

DKIM signing đã gắn rspamd, nhưng **mailbox domain chưa có** trong PostfixAdmin.  
Nếu cần gửi mail production:

1. Thêm domain `minhtien.online` trong aaPanel Mail  
2. Tạo mailbox (vd `noreply@minhtien.online`)  
3. Cập nhật `SMTP_*` trong `/var/www/jetbay-be/.env`  
4. Không đụng cấu hình mail của `baotienweb.cloud`

---

## 5. Kiến trúc tách biệt (không va chạm)

```
Internet
   │
   ├─ api.baotienweb.cloud ──► 127.0.0.1:3000  (BE cũ — giữ nguyên)
   │
   ├─ api.minhtien.online  ──► 127.0.0.1:3010  (Jet-Bay API)
   │
   └─ docs.minhtien.online ──► 127.0.0.1:3010  (chỉ /swagger|/openapi.json|/health)

PostgreSQL
   ├─ baotienweb / baotienweb_db   (cũ)
   └─ jetbay_db / jetbay_user      (mới)

DKIM (rspamd)
   ├─ baotienweb.cloud     (cũ — không sửa)
   ├─ appdesignbuild.com   (cũ — không sửa)
   └─ minhtien.online      (mới)
```

---

## 6. Rủi ro còn lại / khuyến nghị

| # | Rủi ro | Mức | Hành động |
|---|--------|-----|-----------|
| 1 | Disk 82% | Trung bình | Dọn backup/log |
| 2 | Nhiều file `homefix.asia.bak*` trong sites-enabled | Thấp | Dọn sau (không bắt buộc) |
| 3 | Port 3000/4000/5432 public UFW | Trung bình | Không mở thêm 3010; cân nhắc siết sau |
| 4 | `/usr/local/bin/pm2` hỏng | Thấp | Dùng `node /usr/lib/node_modules/pm2/bin/pm2` |
| 5 | Wildcard `*` DNS | Thấp | Mọi subdomain trỏ VPS — chỉ enable Nginx khi cần |
| 6 | Mail domain chưa tạo | Trung bình | Thêm trong aaPanel trước khi gửi mail |

---

## 7. Port dành riêng cho giai đoạn sau (chưa dùng)

| Mục đích | Port đề xuất | Bind |
|----------|--------------|------|
| Admin Next (sau) | `3011` | `127.0.0.1` |
| Web Next (sau) | `3012` | `127.0.0.1` |

Không chiếm 3000–3005, 4000, 3099, 3456.

---

## 8. Checklist vận hành nhanh

```bash
# Health
curl https://api.minhtien.online/health
curl https://docs.minhtien.online/health

# Swagger
# https://docs.minhtien.online/swagger
# https://api.minhtien.online/swagger

# PM2
node /usr/lib/node_modules/pm2/bin/pm2 status
node /usr/lib/node_modules/pm2/bin/pm2 logs jetbay-be --lines 50

# BE cũ vẫn OK
curl -sk --resolve api.baotienweb.cloud:443:127.0.0.1 https://api.baotienweb.cloud/api/v1/health
```
