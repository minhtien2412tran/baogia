# Kế hoạch triển khai thực tế — JetBay

**Cập nhật:** 2026-07-10  
**Môi trường prod:** VPS `103.200.20.100` · PM2 `jetbay-be` / `jetbay-admin` / `jetbay-web`  
**Liên quan:** [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) · [BE_AUDIT.md](./BE_AUDIT.md) · [JETBAY_DELIVERY_CHECKLIST.md](./JETBAY_DELIVERY_CHECKLIST.md)

---

## 1. Kết quả test toàn bộ (2026-07-10)

Chạy trên **production** từ VPS (có `API_KEY` từ `/var/www/jetbay-be/.env`).

| Bộ test | Script | Kết quả |
|---------|--------|---------|
| **BE public + auth + quote** | `scripts/deploy/jetbay-be/smoke-prod.sh` | **16/16 PASS** |
| **Docs / OpenAPI / Swagger** | `scripts/deploy/jetbay-be/smoke-docs.sh` | **11/11 PASS** |
| **Admin CRUD** | `scripts/deploy/jetbay-be/smoke-admin-crud.mjs` | **16/16 PASS** |
| **Web contract** | `scripts/deploy/jetbay-be/smoke-web-api.mjs` | **8/8 PASS** |
| **Local unit** | `apps/api` → `tsc` + `jest` | **9/9 PASS** |

### URL smoke thủ công

| URL | HTTP |
|-----|------|
| https://api.minhtien.online/health | 200 |
| https://docs.minhtien.online/swagger | 200 |
| https://docs.minhtien.online/openapi.yaml | 200 |
| https://admin.minhtien.online/login | 200 |
| https://www.minhtien.online/en-us | 200 |
| https://www.minhtien.online/baocaotiendo | 200 |

### Swagger / Docs (đã sửa)

- OpenAPI server mặc định: `https://api.minhtien.online`
- CORS: `https://docs.minhtien.online` → `POST /auth/login` **201**
- Dùng Swagger: chọn server **Production** → **Authorize** `X-API-Key` → Bearer sau login

### Integrations (`GET /integrations/status`)

| Integration | Prod |
|-------------|------|
| SMTP | configured (`true`) |
| MinIO | `error` (chưa cấu hình / không kết nối) |
| Google OAuth | off |
| Apple OAuth | off |
| Stripe / OnePay / 9Pay | off |
| SMS | off |

### Ghi chú vận hành

| Hạng mục | Hiện trạng | Khuyến nghị |
|----------|------------|-------------|
| `APP_ENV` | `development` trên prod | Chuyển `production` sau khi xác nhận secrets đủ mạnh (boot sẽ enforce) |
| Admin login smoke | `admin@j-ta.local` (prod seed cũ) | Vẫn OK; có thể re-seed `admin@jetbay.local` khi bàn giao |
| Upload media | local path; MinIO lỗi | GĐ2: cấu hình MinIO hoặc giữ local + backup |
| PM2 | `jetbay-be` / `admin` / `web` **online** | `pm2 save` sau mỗi deploy |

**Tổng kết:** BE + Docs + Admin + Web contract **sẵn sàng vận hành GĐ1**. GĐ4 (pay/OAuth/SMS) **chờ keys khách hàng**.

---

## 2. Nguyên tắc triển khai

1. **Không đè `.env` prod** khi sync — chỉ patch có script (`fix-prod-swagger-env.sh`, `deploy-*.sh` tạo `.env.local` riêng cho web/admin).
2. **Một concern / một deploy** — API, Admin, Web tách script.
3. **Smoke bắt buộc** trước và sau deploy (mục 4).
4. **Xác nhận deploy:** chỉ chạy `deploy*.sh` khi có `DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'`.
5. **Báo cáo tiến độ KH** (`/baocaotiendo`): không ghi nhận vượt lịch 4 tháng (bắt đầu 09/07/2026).

---

## 3. Lộ trình triển khai theo hợp đồng 4 tháng

Bám [m-tien.com/jet-bay](https://m-tien.com/jet-bay/) · báo cáo tuần 1 tại `/baocaotiendo`.

| Giai đoạn | Tuần (lịch) | Mục tiêu triển khai | Trạng thái |
|-----------|-------------|---------------------|------------|
| **GĐ1** | 1–4 | BE core, auth, quotes, seed, Swagger, Admin CRUD, web wire API | **Đang chạy prod** (~28% GĐ1) |
| **GĐ2** | 5–8 | Clone web polish, CMS vận hành, FP/EL/JetCard/TC parity, media ổn định | Chưa tới hạn nghiệm thu |
| **GĐ3** | 9–12 | Account flows, booking UAT, document export draft | Chưa tới hạn |
| **GĐ4** | 13–16 | Payment sandbox, OAuth/SMS prod, PDF/Word, go-live | Chờ keys KH + UAT |

### Việc BE tiếp theo (code, không block prod hiện tại)

Theo [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md) phase 2–6:

1. **Phase 2** — `CommercialModule` (FP/EL/JetCard/TC)
2. **Phase 3** — `BookingsModule` + payment routes
3. **Phase 4** — `ContentModule` + Media
4. **Phase 5** — `AdminModule` gom dashboard/users/...
5. **Phase 6** — tách `dto.ts`

Mỗi phase: `tsc` + jest + smoke 16+8 → deploy API.

---

## 4. Ma trận smoke (bắt buộc)

### Trước deploy (local)

```powershell
cd apps/api
pnpm exec tsc --noEmit
pnpm test

cd ../admin
pnpm exec tsc --noEmit
pnpm run build

# Nếu API local đang chạy :4000
$env:API_URL='http://127.0.0.1:4000'
node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
node scripts/deploy/jetbay-be/smoke-web-api.mjs
```

### Sau deploy (prod — chạy trên VPS)

```bash
# Upload scripts (Windows dev machine)
# powershell -File scripts/deploy/jetbay-be/sync-be.ps1   # API
# scp scripts/deploy/jetbay-be/smoke-*.sh root@103.200.20.100:/tmp/

ssh root@103.200.20.100 '
  bash /tmp/smoke-prod.sh &&
  bash /tmp/smoke-docs.sh &&
  export API_URL=https://api.minhtien.online
  export API_KEY=$(grep -E "^API_KEY=" /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d "\"")
  node /tmp/smoke-admin-crud.mjs &&
  node /tmp/smoke-web-api.mjs
'
```

**Pass criteria:** `pass=16` (prod) + `pass=11` (docs) + admin `fail=0` + web `RESULT pass`.

---

## 5. Quy trình deploy từng app

### 5.1 API + Docs (`jetbay-be` :3010)

| Bước | Lệnh |
|------|------|
| Sync code | `powershell -File scripts/deploy/jetbay-be/sync-be.ps1` |
| Deploy | `ssh root@103.200.20.100 "export DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'; bash /var/www/jetbay-be/deploy/deploy.sh"` |
| Migrate (nếu có) | `ssh ... "cd /var/www/jetbay-be && npx prisma migrate deploy"` |
| Smoke | `smoke-prod.sh` + `smoke-docs.sh` + node smokes |

**Patch env Swagger (idempotent):** `bash scripts/deploy/jetbay-be/fix-prod-swagger-env.sh`

**Không tự ý sửa:** `DATABASE_URL`, `JWT_SECRET`, `API_KEY` trên prod.

### 5.2 Admin (`jetbay-admin` :3011)

| Bước | Lệnh |
|------|------|
| Sync | `powershell -File scripts/deploy/jetbay-be/sync-admin.ps1` |
| Deploy | `ssh root@103.200.20.100 "export DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'; bash /var/www/jetbay-admin/deploy/deploy-admin.sh"` |
| Smoke | `smoke-admin-crud.mjs` (prod) |

### 5.3 Web clone (`jetbay-web` :3012)

| Bước | Lệnh |
|------|------|
| Sync | `powershell -File scripts/deploy/jetbay-be/sync-web.ps1` |
| Deploy | `ssh root@103.200.20.100 "export DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'; bash /var/www/jetbay-web/deploy/deploy-web.sh"` |
| Smoke | `smoke-web-api.mjs` + curl `/en-us` + `/baocaotiendo` |

`deploy-web.sh` tự ghi `.env.local` (API URL + sync `API_KEY` từ jetbay-be).

---

## 6. Kế hoạch 4 tuần tới (thực tế)

### Tuần 2 (theo lịch HĐ)

| Việc | Owner | Deploy khi |
|------|-------|------------|
| Hoàn thiện BE phase 2 (`CommercialModule`) | Dev API | Smoke 16+8 pass |
| CMS: thêm/sửa 2–3 bài news + 1 destination | Ops/Admin | Sau content OK |
| Web: polish 3 trang ưu tiên (Home, FP, Charter) | Dev Web | Visual review |
| Cập nhật `/baocaotiendo` tuần 2 | Dev Web | Không vượt % lịch |
| `APP_ENV=production` + audit secrets | DevOps | Sau rotate secrets |

### Tuần 3–4 (cuối GĐ1)

| Việc | Ghi chú |
|------|---------|
| Booking flow UAT nội bộ (JWT) | `POST /bookings` đã bảo vệ JWT |
| Document charter agreement preview | Boilerplate → nội dung thật |
| MinIO hoặc backup upload local | Fix `integrations.minio: error` |
| Nghiệm thu GĐ1 nội bộ | Checklist G1 trong delivery doc |

### GĐ2–G4 (chưa mở rộng deploy pay/OAuth)

Chỉ deploy integration khi KH cung cấp keys (xem [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md)):

1. Stripe / OnePay / 9Pay sandbox → 1 giao dịch test
2. Google / Apple OAuth → domain verify
3. SMS OTP → provider keys
4. SMTP production → gửi mail thật
5. PDF/Word export UAT

---

## 7. Rủi ro & xử lý

| Rủi ro | Mức | Hành động |
|--------|-----|-----------|
| Swagger gọi localhost | Đã xử lý | Giữ `API_PUBLIC_URL=https://api.minhtien.online` |
| CORS thiếu docs/admin | Thấp | `fix-prod-swagger-env.sh` / template env |
| `APP_ENV=development` trên prod | Trung bình | Chuyển `production` + verify `assertProductionSecrets` |
| MinIO error | Trung bình | Cấu hình MinIO hoặc tắt path MinIO, dùng local upload |
| Seed email `@j-ta.local` | Thấp | Document cho KH; re-seed khi bàn giao |
| PM2 version drift | Thấp | `pm2 update` khi maintenance window |
| Deploy không smoke | Cao | **Không** coi deploy xong nếu chưa chạy mục 4 |

---

## 8. Rollback nhanh

Mỗi deploy script tạo backup tại `/root/backups/jetbay-{be,admin,web}-YYYYMMDD-HHMMSS/`.

```bash
# Ví dụ rollback nginx + pm2 (thủ công — chỉ khi build lỗi)
node /usr/lib/node_modules/pm2/bin/pm2 restart jetbay-be
# Khôi phục code: git checkout tag/commit trên VPS hoặc re-sync từ máy dev
```

Database: **không** rollback migration tự động — luôn `migrate deploy` một chiều; backup PG trước migration lớn.

---

## 9. Checklist một lần deploy (in/copy)

```
[ ] git pull + branch đúng (feat/api-* | feat/admin-* | feat/web-*)
[ ] tsc + test local
[ ] sync-* .ps1
[ ] DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'
[ ] deploy-*.sh
[ ] smoke-prod 16/16
[ ] smoke-docs 11/11
[ ] smoke-admin-crud fail=0
[ ] smoke-web-api RESULT pass
[ ] curl admin + web + baocaotiendo 200
[ ] cập nhật CONTINUE_AT_HOME.md (nếu milestone)
```

---

## 10. Script mới (repo)

| File | Mục đích |
|------|----------|
| `scripts/deploy/jetbay-be/smoke-docs.sh` | Smoke docs + OpenAPI + CORS Swagger |
| `scripts/deploy/jetbay-be/fix-prod-swagger-env.sh` | Patch `API_PUBLIC_URL` + CORS docs |
| `scripts/deploy/jetbay-be/run-node-smokes.sh` | Chạy admin + web smoke trên VPS |

---

## Log test

| Ngày | Phạm vi | Kết quả |
|------|---------|---------|
| 2026-07-10 | Full prod retest BE + Docs + Admin + Web | **51/51 pass** (16+11+16+8) + jest 9/9 |
| 2026-07-10 | Swagger fix `API_PUBLIC_URL` + CORS docs | Login Swagger 201 |
