# JetVina — Báo cáo khoảng trống (gap report)

> Ngày: **2026-07-13** · Prod: `api/admin/www/docs.minhtien.online`  
> Liên quan: [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) · [JETBAY_API_SYNC_SECURITY_PLAN.md](./JETBAY_API_SYNC_SECURITY_PLAN.md) · [I18N_ROADMAP.md](./I18N_ROADMAP.md) · [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md)

---

## 1. Tóm tắt điều hành

| Hạng mục | Trạng thái | Ghi chú |
|----------|------------|---------|
| Web clone (FE) | ✅ Prod | `:3012` · product i18n 10 locale du lịch |
| API Nest | ✅ Prod | 173 paths · seed airport/fleet |
| Admin CMS | ✅ **Đã sửa** | Login trỏ `https://api.minhtien.online` (không còn `127.0.0.1:4000`) |
| Swagger docs | ✅ | i18n tag/summary · theme |
| Mail form / auto / admin notify | ❌ **Chưa gửi được** | Code + scheduler OK; SMTP prod = `localhost:1025` (MailHog) — **không có daemon** → `ECONNREFUSED` |
| CMS đa ngôn ngữ (bài viết/sản phẩm) | ❌ Thiếu | Master EN; locale khác fallback EN |
| G4 OAuth / Payment / SMS | ⏸ Chờ KH | |

---

## 2. Lỗi vừa phát hiện & xử lý

### 2.1 Admin không login (`Cannot reach API at http://127.0.0.1:4000`)

**Nguyên nhân:** `NEXT_PUBLIC_API_URL` bake lúc build; `.env.local` VPS cũ giữ URL local.

**Đã sửa & verify (2026-07-13):**
- `apps/admin/src/lib/api.ts` — fallback prod
- `deploy-admin.sh` — luôn ghi `.env.local` với `NEXT_PUBLIC_API_URL=https://api.minhtien.online`
- Redeploy admin OK · HTML login chứa `api.minhtien.online` · HTTP 200

### 2.2 Chuỗi “Không tìm thấy sân bay…” lẫn ngôn ngữ

**Đã sửa & deploy web:** `packages/i18n/src/product-ui-locales.ts` — `airportNoResults` (+ quote/FP/EL/news keys) cho `ja/ko/th/id/fr/de/es/it/ru/ar`. Giữ danh từ riêng: IATA, Paris, JetVina…

Ví dụ JA: `空港が見つかりません — 都市名、国名、または IATA コード（例: LBG、Paris）でお試しください。`

### 2.3 Mail tự động / form / admin — test live

| Kiểm tra | Kết quả |
|-----------|---------|
| `integrations.status.integrations.smtp` | `true` (chỉ = có biến `SMTP_HOST`) |
| `SMTP_HOST` / `SMTP_PORT` thực tế | `localhost` / `1025` |
| Process lắng nghe `:1025` | **Không** |
| `SMTP_USER` / `SMTP_PASSWORD` | **Không có** |
| Customer care scheduler | ✅ chạy mỗi 120s |
| POST `/newsletter/subscribe` | ✅ API 201 |
| Gửi mail thật | ❌ `Email failed: connect ECONNREFUSED …:1025` (log gần nhất 16:23 hôm nay) |

**Kết luận:** Pipeline mail (form enquiry, customer care queue, flight notify admin/operator) **đã code và chạy**, nhưng **chưa deliver** vì SMTP vẫn là stub local. Cần SMTP thật (Gmail/SendGrid/SES…) + `SMTP_FROM` domain hợp lệ + `SMTP_ENQUIRY_TO` đã có `sales@minhtien.online`.

---

## 3. Dữ liệu master (prod)

| Bảng | Số lượng |
|------|----------|
| Airport | **115** |
| Operator | **8** |
| AircraftModel | **10** |
| Aircraft | **15** |

---

## 4. i18n — đã có / còn thiếu

### Nguyên tắc dịch (theo yêu cầu)

- Dịch **hết** UI chrome / form / empty state / mail template khi có bản.
- **Giữ** danh từ riêng: IATA, Paris, tên sân bay DB, brand JetVina, model máy bay…
- Bài viết / sản phẩm / chuyến bay / nội dung CMS: phải theo ngôn ngữ user → cần **bản dịch trong DB** (hiện thiếu).

### Đã có

| Nhóm | Nav/footer | Booking/airport/FP/EL | Email template body | CMS body |
|------|------------|----------------------|---------------------|----------|
| `en`, `vi` | ✅ | ✅ | ✅ en/vi | ⚠️ chủ yếu EN |
| `zh-cn` | ✅ | ✅ | ✅ zh-cn | ⚠️ EN fallback |
| `ja/ko/th/id/fr/de/es/it/ru/ar` | ✅ shell | ✅ product overlay chính | ⚠️ body EN + URL đúng locale | ❌ EN |

### Còn thiếu

1. **CMS `ContentTranslation`** — news / blogs / destinations / pages / sản phẩm theo locale  
2. Audit ~170 `MessageKey` còn sót EN trên tourism locales  
3. `pages-i18n` overlays chỉ vi/zh — chưa ja/fr/…  
4. Admin UI vẫn EN cứng  
5. Email template đầy đủ cho ja/fr/… (hiện EN body)

---

## 5. Mail — kiến trúc

| Luồng | Trigger | Trạng thái code | Deliver prod |
|-------|---------|-----------------|--------------|
| Newsletter welcome | Subscribe | ✅ | ❌ SMTP stub |
| Quote + follow-up 24h | Quote | ✅ | ❌ |
| Welcome register | Register | ✅ | ❌ |
| Booking / payment | Events | ✅ | ❌ |
| Nurture day 3 | Cron | ✅ scheduler | ❌ |
| Enquiry Jet Card / Travel Credit | Form | ✅ + admin CC | ❌ |
| Operator + admin flight notify | Booking | ✅ templates DB | ❌ |

---

## 6. Việc còn lại (ưu tiên)

### P0

- [x] Fix admin API URL + redeploy  
- [x] Dịch airport empty + product keys tourism locales + redeploy web  
- [x] Test mail pipeline live → **phát hiện SMTP stub**  
- [ ] **Cấu hình SMTP prod thật** (KH cung cấp) rồi smoke 1 newsletter + 1 enquiry admin

### P1

- [ ] CMS dịch bài viết / destination / legal / sản phẩm  
- [ ] `pages-i18n` + MessageKey audit cho tourism locales  
- [ ] Email templates đa ngôn ngữ đầy đủ  
- [ ] Admin UI i18n (tuỳ chọn)

### P2 — G4 / bảo mật

- [ ] OAuth / Payment / SMS  
- [ ] Rotate demo passwords  
- [ ] Optional `SWAGGER_BASIC_*`

---

## 7. Smoke checklist

| Check | Expect | Live 2026-07-13 |
|-------|--------|-----------------|
| Admin login API | `api.minhtien.online` | ✅ |
| Web JA airport empty | Chuỗi JA | ✅ (deployed i18n) |
| `/integrations/status` smtp flag | true nếu có HOST | ✅ true nhưng **không = deliverable** |
| Customer care log | scheduler started | ✅ |
| Email sent | `Email sent:` trong pm2 | ❌ chỉ `ECONNREFUSED :1025` |

---

## 8. Bottom line

1. **Admin** — đã hết lỗi localhost; đăng nhập lại với API prod.  
2. **Dịch UI** — airport/quote/product keys tourism locales đã lên prod; **nội dung CMS vẫn EN**.  
3. **Mail** — form + auto + admin notify **đã chạy trong code**, **chưa gửi được hộp thư** vì SMTP = MailHog local không tồn tại. Cần key SMTP thật từ KH.  
4. **Backlog lớn:** CMS đa ngôn ngữ + SMTP thật + G4.
