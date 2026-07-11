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
| **Báo cáo tiến độ KH** | https://www.minhtien.online/baocaotiendo | ✅ trang nội bộ gửi Anh Tuấn Anh |
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

1. **Polish clone** (ongoing) — so `scratch/` vs live · Home news/newsletter · FP tier labels  
2. **G4 keys** — SMTP / OAuth / payment / SMS **chờ KH** → [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md)  
3. (Optional) set prod `APP_ENV=production` khi secrets đã đủ mạnh  
4. **BE modules** — tiếp phase 2+ theo [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md)  

**Kế hoạch:** [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md) · **BE docs:** [BE_AUDIT.md](./BE_AUDIT.md) · [BE_TEST.md](./BE_TEST.md) · [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md) · [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md)

### Đã merge + deploy (2026-07-10)

- [x] **GĐ1 ĐÓNG** — `fix-gd1-prod.sh` · smoke **55/55** · `APP_ENV=production` · FP×12 · news×1 · [GD1_SIGNOFF.md](./GD1_SIGNOFF.md)
- [x] **Deploy web + admin** (2026-07-10) — Home news/newsletter · FP tiers · admin FP options · smoke 55/55 · pages 200
- [x] **CSS polish web** (2026-07-10) — logo JetBay · header desktop · airport dropdown · hero overflow · redeploy `jetbay-web`
- [x] **Motion effects web** (2026-07-10) — scroll reveal · hero flight path · parallax · stat progress
- [x] **Motion v2** (2026-07-10) — counter 10K+/190+ · 3D tilt cards · page transition · booking flow FX
- [x] **i18n GĐ1** (2026-07-10) — `@jetbay/i18n` · reverse locale DB `en` · `/i18n/config` · FE middleware cookie · [I18N_ROADMAP.md](./I18N_ROADMAP.md)
- [x] **Deploy i18n GĐ1 prod** (2026-07-10) — API `jetbay-be` + web `jetbay-web` · `/i18n/config` public · vendor i18n `dist/`
- [x] **i18n review fixes** (2026-07-11) — `isValidDbLocale` · article metadata locale · canonical stub · deploy-web npm install · `/en`→`/en-us` redirect
- [x] **i18n đa ngôn ngữ UI** (2026-07-11) — LanguagePicker tìm kiếm · nav/footer dịch 6 locale · page content overlay · booking widget `t()`
- [x] **Auth header + account UI** (2026-07-11) — HeaderUserMenu khi đăng nhập · sidebar account dashboard · deploy prod
- [x] **Account dashboard v2** (2026-07-11) — `GET /account/dashboard` · fetch 1 lần · UI hiện đại + motion · stats/quotes/bookings/payments/docs
- [x] **Customer care email** (2026-07-11) — `EmailSubscriber` + `EmailCampaignLog` · `CustomerCareService` cron · templates HTML · hooks register/quote/newsletter/booking/payment · fix 429 account (`SkipThrottle` + layout provider)
- [x] **i18n dịch sạch FP + newsletter** (2026-07-11) — Fixed Price / Empty Leg / footer newsletter · ~50 key mới trong `@jetbay/i18n` · wire `t()` toàn trang listing
- [x] **Service page CSS heritage** (2026-07-11) — `jetbay-service.css` · Playfair/Cormorant fonts · fix contrast light bands · neo-classical gold/cream
- [x] **Home stats + logo polish** (2026-07-11) — fix invisible counter gradient on light band · uniform stat cards · retina logo · news grid width cap · footer newsletter placeholder contrast
- [x] **Modern UI audit** (2026-07-11) — news card thumbnail + read more · footer 4-col + fix newsletter title wrap · media logo grid · payment/social chips · `jetbay-modern.css`
- [x] **UI polish v2** (2026-07-11) — SVG logo Retina · newsletter band · empty states · skeleton loading · focus rings + skip link
- [x] **Quote widget FE↔BE** (2026-07-11) — tách search vs request quote · tripType · consent + email bắt buộc · typed API · empty leg departAt · JetCard plan.name từ API
- [x] **FlightScrollRail** (2026-07-11) — bỏ scrollbar ngang · nút máy bay + đường bay progress · Fixed Price · Empty Legs · Stats mobile · Aircraft · Media · trip tabs
- [x] **Light cards + MediaHero** (2026-07-11) — fix chữ trắng trên card trắng (StepsTimeline/FeatureGrid) · ảnh destination/article 16:9 cover · Empty Leg steps → LightSection

- [x] `feat/api-security-hardening` (+ admin screens / partner-TC) → **`main`** (`9893789`)  
- [x] VPS API `jetbay-be` + Admin `jetbay-admin` redeployed  
- [x] Prod smoke admin **16/16** · web **8/8**  
- [x] Redeploy (Content DTO validators + article `#NaN` fix + Settings UI) — `ARTICLE_PATCH 200` · smoke **16/16** + **8/8**  
- [x] OpenAPI YAML (`/openapi.yaml`) + `@jetbay/api-client` (`pnpm openapi:client`) · docs RN section in API.md · prod YAML **200**  
- [x] **Báo cáo tiến độ KH** (`/baocaotiendo`) — UI aviation + JS effects · redeploy web **200**
- [x] **Retest full prod** — smoke BE 16/16 · docs 11/11 · admin 16/16 · web 8/8 · [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md)

### Đang làm / vừa xong (tuần 1 — 10/07)

- [x] Admin FP **price tiers** editor (`options[]` category, price, pax, terms)
- [x] Web Home: News + Newsletter sections wired
- [x] FP listing: `categoryLabel`, `includedTerms`, empty state
- [x] `docs/JETBAY_WORK_PLAN.md` + `docs/KH_G4_KEYS_CHECKLIST.md`
- [ ] Charter ×6 polish vs scratch (tuần 2–3)
- [x] Deploy admin/web lên prod (2026-07-10)

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
# Full suite prod: bash scripts/deploy/jetbay-be/smoke-all.sh (trên VPS)
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

[ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md) · [AGENTS.md](../AGENTS.md) · [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md) · [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md) · [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) · [JETBAY_BAO_GIA.md](./JETBAY_BAO_GIA.md) · [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
