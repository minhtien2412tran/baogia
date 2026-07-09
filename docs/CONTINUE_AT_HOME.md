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
2. Admin còn thiếu: Quotes status · Video CMS UI · Airport CRUD  
3. G4 keys KH (SMTP / OAuth / payment) khi có  
4. Merge `feat/admin-partner-tc-crud` → `main` khi ổn  

### Đang làm / vừa xong (admin)

- [x] Partner applications: Approve / Reject (+ tạo `PartnerAccount` khi approve)  
- [x] Travel Credit packages: CRUD DB (thay hardcode) + admin form  
- [x] Prod: migrate `TravelCreditPackage` · API `:3010` · admin redeployed  
- [!] Prod `.env` từng lệch `jta_db` / `PORT=4000` — đã sửa → `jetbay_db` + `PORT=3010` (backup `.env.bak-*`)  

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

## Về nhà

```bash
git pull origin main
pnpm install
# đọc JETBAY_PRODUCT_MAP.md + file này
```

Demo seed: `admin@jetbay.local` / `Admin123!` · `demo@jetbay.local` / `Demo123!`  
(Prod có thể còn `@j-ta.local` nếu chưa re-seed.)

## Liên kết

[AGENTS.md](../AGENTS.md) · [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md) · [JETBAY_BAO_GIA.md](./JETBAY_BAO_GIA.md) · [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
