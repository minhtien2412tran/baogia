# Jet-Bay Delivery Checklist

**Sản phẩm chính:** clone jetbay.com → `apps/web` (prod https://www.minhtien.online/en-us · local `:3000`)  
**Bản đồ:** [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md)  
**Báo giá (chỉ collateral):** [Web 74TR](https://m-tien.com/jet-bay/) · [App 248TR](https://m-tien.com/app-jetbay/) · [JETBAY_BAO_GIA.md](./JETBAY_BAO_GIA.md)  
**Cập nhật:** 2026-07-09  
**API:** https://api.minhtien.online · **Swagger:** https://docs.minhtien.online/swagger · **Admin:** https://admin.minhtien.online/login

Quy tắc: mỗi giai đoạn phải đạt DoD trước khi mở giai đoạn tiếp theo. Không kick-off React Native cho đến khi cổng App xanh.

---

## Ma trận nhánh A–F

| Nhánh | Phạm vi | Code | Prod | DoD |
|-------|---------|------|------|-----|
| A — Backend API + DB | NestJS + Prisma + Swagger | ✅ | ✅ seed + smoke 14/14 | **G1 PASS** |
| B — Web Public | Next.js clone | ✅ | 🟡 local → prod API | **G2 wire PASS** |
| C — Admin Dashboard | CRUD + CMS | ✅ | ✅ `admin.minhtien.online` :3011 | **G3 PASS** |
| D — Auth JWT | Login/register/refresh | ✅ | ✅ admin+demo seed | **G1 PASS** |
| E — Commercial | FP / EL / JetCard / TC | ✅ | ✅ seeded | **G1 PASS** |
| F — GĐ4 Pay/OAuth/OTP/PDF | Keys + UAT | ✅ code | 🟡 chờ keys KH (JWT/Redis đã có) | **G4 checklist sẵn** |
| App Mobile 248TR | RN/Expo | ⬜ | ⬜ | Cổng gần xanh |

---

## G0 — Baseline — PASS

- [x] API health HTTPS
- [x] Docs/Swagger HTTPS
- [x] Tách BE cũ (port/DB/env/Nginx)
- [x] DKIM DNS
- [x] `docs/JETBAY_DELIVERY_CHECKLIST.md`
- [x] Seed `jetbay_db` production
- [x] Admin user hoạt động trên prod

---

## G1 — Backend DoD — PASS

- [x] Seed data (airports, aircraft, FP×12, EL×2, content)
- [x] CORS production (`m-tien.com` + localhost)
- [x] `dotenv` load `.env` trong `main.ts`
- [x] Smoke `scripts/deploy/jetbay-be/smoke-prod.sh` → **14/14**
- [x] Không đụng `api.baotienweb.cloud`

**Smoke log (2026-07-09):** pass=14 fail=0 (health, openapi, FP, EL, jet-card, TC, news, destinations, airports, partners, admin login, dashboard stats, quotes/request).

---

## G2 — Web Public — wire PASS / pages tracked

- [x] `apps/web/.env.local` → `NEXT_PUBLIC_API_URL=https://api.minhtien.online`
- [x] `smoke-web-api.mjs` → RESULT pass
- [x] Local pages 200: home, FP, EL, jet-card, TC, charter, news, destination, login, account
- [x] Quote widget không gửi `tripType` thừa (DTO fix)
- [x] DoD groups: [JETBAY_WEB_PAGE_DOD.md](./JETBAY_WEB_PAGE_DOD.md)
- [x] Deploy public web clone — `www.minhtien.online` → PM2 `jetbay-web` `:3012` + SSL
- [ ] Visual parity polish vs `scratch/` / jet-bay.com (ongoing)

---

## G3 — Admin — PASS

- [x] Port `127.0.0.1:3011` (không public UFW)
- [x] PM2 `jetbay-admin`
- [x] Nginx + SSL `admin.minhtien.online`
- [x] `/login` HTTPS 200
- [x] AdminGuard: USER → 403 trên `/admin/dashboard/stats`
- [x] Scripts: `deploy-admin.sh`, `start-admin-vps.sh`, nginx confs

---

## G4 — Integrations — checklist sẵn

Xem [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md) · [JETBAY_INTEGRATIONS_STATUS.md](./JETBAY_INTEGRATIONS_STATUS.md).

- [x] JWT + refresh secret production
- [x] Redis configured
- [x] `GET /integrations/status` (public readiness, no secrets)
- [x] Checklist UAT OAuth / OTP / Payment / PDF
- [ ] Merchant keys (Stripe/OnePay/9Pay) — phía KH
- [ ] SMS provider keys — phía KH
- [ ] Google/Apple client IDs domain verify
- [ ] SMTP production
- [ ] 1 giao dịch sandbox thành công
- [ ] 1 PDF/Word gắn booking

---

## Cổng kick-off App (248TR)

| Điều kiện | Trạng thái |
|-----------|------------|
| `POST /auth/login` + refresh prod | ✅ |
| Airport search + quote search | ✅ |
| `POST /quotes/request` → Admin | ✅ |
| Swagger prod đủ mobile | ✅ |
| 5–10 aircraft + 3–5 empty-leg | ✅ (seed) |
| Merchant/SMS/OAuth (KH) | ⬜ |

**Không code React Native** cho đến khi merchant/SMS/OAuth (hoặc chấp nhận kick-off với email-auth only theo thỏa thuận KH).

API tối thiểu theo báo giá App (*đăng nhập, tìm chuyến, lưu yêu cầu báo giá*) — **đã đạt**.

---

## Tài khoản demo (sau seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@jetbay.local` | `Admin123!` |
| User | `demo@jetbay.local` | `Demo123!` |

Đổi mật khẩu ngay khi bàn giao khách hàng. Env secrets: [SECURITY_SECRETS.md](./SECURITY_SECRETS.md).  
Bảo mật tham khảo HomeFix / chức năng theo báo giá: [JETBAY_SECURITY_VS_FEATURES.md](./JETBAY_SECURITY_VS_FEATURES.md).

---

## Vận hành nhanh

```bash
# API
node /usr/lib/node_modules/pm2/bin/pm2 restart jetbay-be --update-env
bash /var/www/jetbay-be/deploy/smoke-prod.sh

# Rotate JWT / DB / API secrets (không in ra)
bash /var/www/jetbay-be/deploy/rotate-secrets.sh

# Admin
node /usr/lib/node_modules/pm2/bin/pm2 restart jetbay-admin

# Web API contract
node scripts/deploy/jetbay-be/smoke-web-api.mjs
```

| Service | Bind | Public |
|---------|------|--------|
| jetbay-be | 127.0.0.1:3010 | api.minhtien.online |
| jetbay-admin | 127.0.0.1:3011 | admin.minhtien.online |
| docs | proxy → 3010 | docs.minhtien.online |

---

## Log tiến độ

| Ngày | Việc | Kết quả |
|------|------|---------|
| 2026-07-09 | Deploy API + docs + DKIM | OK |
| 2026-07-09 | G0 seed + checklist | PASS |
| 2026-07-09 | G1 CORS + dotenv + smoke 14/14 | PASS |
| 2026-07-09 | G2 web env + smoke-web-api | PASS |
| 2026-07-09 | G3 admin HTTPS + AdminGuard | PASS |
| 2026-07-09 | G4 checklist + App gate doc | READY / gate API xanh |
| 2026-07-09 | Rotate prod secrets + chuẩn hoá Swagger/docs | DONE |
| 2026-07-09 | ApiKeyGuard + X-API-Key smoke 16/16 | DONE |
| 2026-07-09 | AGENTS + CONTINUE_AT_HOME + git FE/BE/admin | DONE |
| 2026-07-09 | Rebrand monorepo → JETBAY (`@jetbay/*`, docs) | DONE |
