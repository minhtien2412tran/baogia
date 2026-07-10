# Continue at home — JETBAY

> Chat Cursor không nhớ — mở file này sau `git pull`.  
> Bản đồ đầy đủ: [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md)

**Dự án:** JETBAY — **sản phẩm chính = clone jetbay.com** (`apps/web`)  
**Báo giá** (`m-tien.com/jet-bay`) chỉ là mô tả bán hàng — không phải trang chính.  
**Repo:** https://github.com/minhtien2412tran/baogia.git  
**Nhánh:** `main` · `feat/web-*` | `feat/api-*` | `feat/admin-*`

---

## URL nhanh

| Vai trò | URL | Ghi chú |
|---------|-----|---------|
| **Web clone (chính)** | https://www.minhtien.online/en-us | ✅ PM2 `jetbay-web` `:3012` · local vẫn `:3000` |
| API | https://api.minhtien.online | ✅ |
| Admin | https://admin.minhtien.online/login | ✅ |
| Swagger | https://docs.minhtien.online/swagger | ✅ |
| Báo giá Web (collateral) | https://m-tien.com/jet-bay/ | Chỉ pitch / giá — không sửa như product |
| Báo giá App (collateral) | https://m-tien.com/app-jetbay/ | Scope App 248TR — chưa code RN |

---

## Đã xong

- [x] API + Admin + Docs Swagger (prod)
- [x] Web nối API prod (local → `api.minhtien.online`)
- [x] ApiKeyGuard / secrets / rebrand JETBAY
- [x] Quy hoạch: product = clone · báo giá = collateral ([JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md))
- [x] **Deploy public web** — `www.minhtien.online` (+ apex → www) · SSL · CORS

## Việc tiếp theo (ưu tiên sản phẩm)

1. **Polish clone** (ongoing) — so `scratch/` vs live  
2. **G4 keys** — SMTP / OAuth / payment / SMS **chờ KH** (code sẵn, ENV-gated)  
3. (Optional) set prod `APP_ENV=production` khi secrets đã đủ mạnh  

### Đã merge + deploy (2026-07-10)

- [x] `feat/api-security-hardening` (+ admin screens / partner-TC) → **`main`** (`9893789`)  
- [x] VPS API `jetbay-be` + Admin `jetbay-admin` redeployed  
- [x] Prod smoke admin **16/16** · web **8/8**  

### Đang làm / vừa xong (admin)

- [x] Partner applications: Approve / Reject (+ tạo `PartnerAccount` khi approve)  
- [x] Travel Credit packages: CRUD DB (thay hardcode) + admin form  
- [x] Prod: migrate `TravelCreditPackage` · API `:3010` · admin redeployed  
- [!] Prod `.env` từng lệch `jta_db` / `PORT=4000` — đã sửa → `jetbay_db` + `PORT=3010` (backup `.env.bak-*`)  
- [x] Nav: Aircraft · Media · Videos · CMS Pages  
- [x] Quotes status workflow (`PATCH /admin/quotes/:id/status`)  
- [x] Videos CMS UI  
- [x] Airport admin CRUD  
- [x] CMS Pages editor (`/dashboard/content/pages/[id]`)  
- [x] **API security hardening** (`feat/api-security-hardening`): JWT on `POST /bookings`, OTP CSPRNG, SMS `APP_ENV`, QuoteOffer admin API, optional JWT on quote request 

### Test trước khi deploy (bắt buộc)

```powershell
# Local
cd apps/api; npx tsc --noEmit; npm test; cd ../..
cd apps/admin; npx tsc --noEmit; npm run build; cd ../..
$env:API_URL='http://127.0.0.1:4000'
node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
node scripts/deploy/jetbay-be/smoke-web-api.mjs

# Chỉ deploy khi RESULT pass
# Sau deploy: smoke lại với API_URL=https://api.minhtien.online
```

### Redeploy web (Windows)

```powershell
powershell -File scripts/deploy/jetbay-be/sync-web.ps1
ssh root@103.200.20.100 "export DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'; bash /var/www/jetbay-web/deploy/deploy-web.sh"
```

---

## Code trang chính (clone)

```
apps/web/src/app/[locale]/page.tsx     ← Home
apps/web/src/components/home/          ← Hero, FP, EL, JetCard…
apps/web/src/app/[locale]/*            ← Các trang con
scratch/                               ← HTML mẫu jet-bay.com
```

```bash
pnpm --filter @jetbay/web dev
# mở http://localhost:3000/en-us
```

---

## Về nhà / máy mới / nhân viên khác

**Hướng dẫn đầy đủ (clone + env + DB + chạy app):**  
→ [ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md)

```bash
git clone https://github.com/minhtien2412tran/baogia.git
cd baogia
git pull origin main
pnpm install
node scripts/generate-local-env.mjs
node scripts/sync-frontend-api-key.mjs
pnpm db:up
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed
# đọc ONBOARDING_NHAN_VIEN.md + JETBAY_PRODUCT_MAP.md + file này
```

Demo seed: `admin@jetbay.local` / `Admin123!` · `demo@jetbay.local` / `Demo123!`  
(Prod có thể còn `@j-ta.local` nếu chưa re-seed.)

## Liên kết

[ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md) · [AGENTS.md](../AGENTS.md) · [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md) · [JETBAY_BAO_GIA.md](./JETBAY_BAO_GIA.md) · [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
