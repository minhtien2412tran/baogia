# Jet-Bay — Bảo mật (tham khảo HomeFix) × Chức năng (theo báo giá)

**Nguyên tắc chốt:**

| Nguồn | Dùng để làm gì | Không dùng để |
|-------|----------------|---------------|
| **BE `api.homefix.asia`** (Baotienweb) | Tham khảo **cách bảo mật / vận hành API** | Copy nghiệp vụ CRM, marketplace, chat, AI moderation, LiveKit… |
| **`docs/PHIEU_BAO_GIA_J_TA.md`** + **`docs/DANH_GIA_KY_THUAT_BAO_GIA.md`** | Phạm vi **chức năng & tính năng** Jet-Bay / J-TA | Bổ sung feature HomeFix ngoài báo giá |

Hai BE cùng VPS nhưng **tách domain / port / DB / env / secret** — xem [SECURITY_SECRETS.md](./SECURITY_SECRETS.md).

---

## 1. Bảo mật tham khảo từ HomeFix (`api.homefix.asia`)

Nguồn quan sát: Swagger `Bearer` + `X-API-Key`, `AUTH_CONVENTION.md`, `ApiKeyGuard`, Helmet, Throttle trên auth, env tách secret.

### 1.1 Checklist áp dụng cho Jet-Bay

| # | Pattern HomeFix | Jet-Bay hiện tại | Hành động |
|---|-----------------|------------------|-----------|
| 1 | **JWT Bearer** + refresh secret riêng | ✅ JWT + `REFRESH_TOKEN_SECRET` | Giữ; rotate định kỳ (`rotate-secrets.sh`) |
| 2 | **`X-API-Key` header** (`ApiKeyGuard`) cho app/client | ✅ Global `ApiKeyGuard` + `@Public()` health/webhooks/swagger | Web/Admin: `NEXT_PUBLIC_API_KEY` |
| 3 | Swagger auth khớp runtime (`bearer` named + `X-API-Key`) | ✅ `bearer` + `X-API-Key` schemes | Authorize cả hai trong Swagger UI |
| 4 | **Helmet** | ✅ | Giữ |
| 5 | **ValidationPipe** whitelist / forbid | ✅ | Giữ |
| 6 | **CORS allowlist** (`ALLOWED_ORIGINS` / `CORS_ORIGIN`) | ✅ `CORS_ORIGIN` | Không dùng `*` trên prod |
| 7 | **Rate limit / `@Throttle`** (login/register/refresh chặt) | ✅ `@Throttle` auth: login 10, register/OTP/refresh 5/min | Giữ |
| 8 | Guard class-level + `@Public()` | 🟡 Guard theo method/controller | Chuẩn hoá convention (không bắt buộc copy RBAC 50+ permission) |
| 9 | Role tách quyền admin | ✅ `AdminGuard` (USER/ADMIN) | Đủ theo báo giá; **không** port RBAC SUPER_ADMIN/STAFF/… của HomeFix |
| 10 | Secret riêng, không share BE khác | ✅ `jetbay_db` + `.env` riêng đã rotate | Tiếp tục; không copy `.env` HomeFix |
| 11 | Bind nội bộ + Nginx HTTPS | ✅ `127.0.0.1:3010` | Giữ; không public port app |
| 12 | OTP cooldown / max attempts (env) | 🟡 OTP service có; env chưa chuẩn hoá như HomeFix | Khi G4 SMS: `OTP_*` + throttle |
| 13 | Webhook secret (payment) | 🟡 `PAYMENT_SECRET` / Stripe webhook | Bật khi có merchant keys (báo giá Gói B1) |
| 14 | Audit / auth matrix docs | 🟡 Audit log admin | Giữ nhẹ; không copy moderation pipeline |

### 1.2 Không mang sang Jet-Bay (ngoài phạm vi báo giá)

- Marketplace, MoMo/VNPay/ACB CRM payments (trừ khi KH mua gói payment Jet-Bay riêng)
- Chat / LiveKit / AI moderation / AI memory
- RBAC đa role xây dựng (ENGINEER, CONTRACTOR…)
- Account deletion / KYC admin HomeFix
- Reels / Pexels / Cloudinary stack HomeFix

### 1.3 Thứ tự ưu tiên port bảo mật

1. ~~**P0** — `ApiKeyGuard` + Swagger `X-API-Key`~~ ✅
2. ~~**P0** — `@Throttle` chặt auth~~ ✅
3. ~~**P1** — Named scheme `'bearer'`~~ ✅
4. **P1** — OTP env (`OTP_COOLDOWN_SECONDS`, `OTP_MAX_ATTEMPTS`) khi bật SMS
5. **P2** — Auth convention doc nội bộ Jet-Bay (rút gọn từ HomeFix, không copy RBAC)

---

## 2. Chức năng / tính năng — chỉ theo 2 file báo giá

### Nguồn chính thức

1. [PHIEU_BAO_GIA_J_TA.md](./PHIEU_BAO_GIA_J_TA.md) — phạm vi hợp đồng, gói A/B/C, cây nghiệp vụ §IV  
2. [DANH_GIA_KY_THUAT_BAO_GIA.md](./DANH_GIA_KY_THUAT_BAO_GIA.md) — feature tree §4, ma trận trang/API, WP

Demo tham chiếu UI: [m-tien.com/jet-bay](https://m-tien.com/jet-bay/) · App: [m-tien.com/app-jetbay](https://m-tien.com/app-jetbay/)

### Cây chức năng (rút gọn từ báo giá — không thêm từ HomeFix)

```
J-TA / Jet-Bay
├── A. Marketing & Discovery (Web)
│   Home · Charter×6 · Fixed Price · Empty Leg · Jet Card · Travel Credit
│   Destinations · News/Blogs/Video · About/Booking CMS · World Cup · Partners
├── B. Đặt chỗ & Báo giá
│   Airport/aircraft search · Quote request · Forms thương mại · Booking lifecycle
├── C. Tài khoản
│   Register/Login JWT · /account · (OAuth/OTP theo G4) · sub-pages quotes/jet-card/TC
├── D. CMS & Admin
│   Articles · Videos · Destinations · Editors · Dashboard · Audit · CRUD · Users · Media
└── E. Hạ tầng (trong phạm vi go-live báo giá)
    Postgres · Redis · MinIO · SMTP · Payment (Gói B) · Rate limit · CI/CD
```

### Map gói tiền ↔ module

| Báo giá | Module chức năng |
|---------|------------------|
| Gói A 74TR (`FE-CORE` + `ADM-CMS` + `API-CORE`) | Web public + Admin CMS + API JWT/Swagger/DB |
| Gói B1 `PAY-GW` | Stripe / cổng VN (OnePay/9Pay) — không copy MoMo HomeFix trừ khi KH chọn |
| Gói B2 `LOYALTY` | Jet Card / Travel Credit / Partner nâng cao |
| Gói B4 `MOBILE-API` | REST cho App — **bảo mật** theo mục 1 (API Key + JWT) |
| App 248TR (landing riêng) | Kick-off khi API: login · tìm chuyến · lưu quote |

Chi tiết trạng thái code: [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) · [JETBAY_DELIVERY_CHECKLIST.md](./JETBAY_DELIVERY_CHECKLIST.md).

---

## 3. Quy tắc khi implement

1. **Feature mới** → phải map được sang mục trong 2 file báo giá (hoặc phụ lục hợp đồng đã ký).  
2. **Security mới** → được phép lấy ý tưởng/pattern từ HomeFix; **secret/config/DB phải riêng** Jet-Bay.  
3. **Swagger Jet-Bay** mô tả nghiệp vụ private jet — không dán mô tả “Tính năng chính” của HomeFix (Projects, Marketplace, CRM…).  
4. Mọi endpoint admin: JWT + role ADMIN; client app (khi bật): thêm `X-API-Key` như HomeFix.

---

## 4. Liên kết

| Doc | Vai trò |
|-----|---------|
| [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) | Rotate env, không share secret |
| [API.md](./API.md) | URL Swagger / OpenAPI Jet-Bay |
| [JETBAY_VPS_DEPLOY.md](./JETBAY_VPS_DEPLOY.md) | Tách BE trên cùng VPS |
| HomeFix live | https://api.homefix.asia/api/docs (tham khảo auth UI only) |
| Jet-Bay live | https://docs.minhtien.online/swagger |
