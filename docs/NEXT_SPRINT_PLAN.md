# Kế hoạch tiếp theo — Web gắn API · đồng bộ · tài liệu

> **Ngày:** 2026-07-14 · **Tuần HĐ:** 1→2/16 (bắt đầu 09/07/2026)  
> **Nguồn:** [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) · [JETVINA_GAP_REPORT.md](./JETVINA_GAP_REPORT.md) · [JETBAY_API_SYNC_SECURITY_PLAN.md](./JETBAY_API_SYNC_SECURITY_PLAN.md) · [JETBAY_WEB_PAGE_DOD.md](./JETBAY_WEB_PAGE_DOD.md)  
> **Không làm trên critical path:** Nest module refactor sâu, React Native 248TR.

---

## 0. Hiện trạng (15/07)

```text
Current phase: GĐ2 Dev complete
Current mode: Waiting for Owner
Next technical phase after Owner unlock:
1. SMTP inbox verification
2. Payment sandbox
3. OAuth sandbox
4. SMS sandbox
5. Integration health checks
6. End-to-end UAT
7. Production readiness review
```

**GĐ4 not started** — no sandbox keys yet. Checklist: [GD4_SANDBOX_READINESS.md](./GD4_SANDBOX_READINESS.md)

**Pack tài liệu:** [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md) · [COMMIT_PLAN_GD2.md](./COMMIT_PLAN_GD2.md) · [TEST_MATRIX.md](./TEST_MATRIX.md) · [GD2_ROADMAP.md](./GD2_ROADMAP.md)

**GĐ4 keys checklist:** dùng [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md) (không tạo file trùng).

### Bốn sprint (chi tiết task → GD2_ROADMAP)

| Sprint | Mục tiêu | Exit |
|--------|----------|------|
| **S1** Audit + khóa contract | Surface map · Quote DTO · sync tooling | Map + smoke-web-api PASS · api-sync khi local lên |
| **S2** Luồng kinh doanh | Commercial + Home + Quote UI | Empty/error · enquiry PASS · UAT U1–U11 |
| **S3** Account + Admin ops | Account polish · CMS path · ADMIN_OPS | Demo UAT account · Owner publish news |
| **S4** Prod readiness | SMTP · backup · UAT pack · 3.1 | ACCEPTANCE residual · handoff |

---

## 1. Lộ trình theo giai đoạn HĐ (nhắc lại)

| GĐ | Tuần | Mục tiêu nghiệm thu | Trạng thái 14/07 |
|----|------|---------------------|------------------|
| **GĐ1** | 1–4 | Nền API/DB/Swagger | ✅ Nội bộ đóng · còn SMTP/backup + biên bản với Anh |
| **GĐ2** | 5–8 | Frontend staging (tháng 2) | 🟡 Chuẩn bị sớm mạnh · **chưa tới hạn NT** |
| **GĐ3** | 9–12 | API hoàn thiện + CMS vận hành | 🟡 Khung admin có · chưa bàn giao |
| **GĐ4** | 13–16 | Pay / OAuth / OTP / PDF / go-live | ⏸ Chờ keys KH |

---

## 2. Wave A — Web hoàn thiện gắn API (ưu tiên 2–3 tuần)

Mục tiêu: mỗi trang chính **đọc/ghi API thật**, DoD group trong [JETBAY_WEB_PAGE_DOD.md](./JETBAY_WEB_PAGE_DOD.md), parity hướng [jetvina.com](https://jetvina.com/) (không invent feature ngoài báo giá).

| # | Việc | App/branch | API liên quan | Done khi |
|---|------|------------|---------------|----------|
| A1 | Charter ×6 polish (layout, media `jv()`, CTA → quote) | `feat/web-charter-polish` | `/quotes/*`, content | Visual + CTA ổn trên 6 URL |
| A2 | Commercial depth: FP detail tiers, EL list/request, JetCard/TC từ API | `feat/web-commercial` | `/fixed-price/*`, `/empty-legs`, `/jet-card/*`, `/travel-credits/*` | Listing + detail không mock |
| A3 | Home: news/newsletter/fleet rail — lỗi empty-state + i18n | `feat/web-home` | `/news`, `/newsletter`, aircraft | Smoke `smoke-web-api.mjs` pass |
| A4 | Account flows: quotes/bookings/payments/docs gắn `/account/*` | `feat/web-account` | `/account/dashboard`, bookings | Demo user UAT được |
| A5 | Quote widget E2E: search → request → confirmation UI | `feat/web-quote` | `search-aircraft`, `request` | 1 flow SGN→HAN screenshot + log |
| A6 | Media policy: catalog JetVina ổn định, không regress placeholder | với A1 | — | Charter/home không SVG demo fleet |

**Gate hàng ngày:** web local & prod cùng trỏ `https://api.minhtien.online` (+ key sync).

---

## 3. Wave B — Đồng bộ API (giữ parity, không lệch seed)

Contract đã **đồng bộ** (local/prod/docs = 173). Việc tiếp theo là **giữ** đồng bộ + behaviour.

| # | Việc | Done khi |
|---|------|----------|
| B1 | Mỗi PR API: chạy `pnpm smoke:api-sync` trước merge | 0 path diff |
| B2 | Sau deploy BE: `smoke-all.sh` trên VPS (hoặc tối thiểu health + quotes + airports) | Pass |
| B3 | Seed parity: document lệch số option quote (local 1 vs prod 3) — **không “fix” bằng cách xóa prod** | Ghi chú trong BE_TEST |
| B4 | OpenAPI/Swagger: mỗi endpoint mới có summary + tag; redeploy docs | Swagger UI phản ánh đúng |
| B5 | Admin client luôn bake `NEXT_PUBLIC_API_URL=https://api.minhtien.online` (đã có script — kiểm tra sau mỗi deploy) | Login HTML chứa prod URL |
| B6 | Security residual: pen-test nhẹ / IDOR spot-check (Phase D) | Checklist ngắn trong SECURITY |

**Không mở:** Nest module phase 2–6 trên critical path (xem [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md)).

---

## 4. Wave C — Bộ tài liệu (tạo mới + cập nhật)

### 4.1 Cập nhật ngay (tuần này)

| Doc | Việc |
|-----|------|
| [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) | Trỏ plan này; “việc tiếp theo” = Wave A–D |
| [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md) | Đổi ngày 14/07; tick lại trạng thái GĐ2/GĐ3 thật |
| [JETBAY_DELIVERY_CHECKLIST.md](./JETBAY_DELIVERY_CHECKLIST.md) | G2 visual parity vẫn ⬜; ghi media JetVina done |
| [JETBAY_WEB_PAGE_DOD.md](./JETBAY_WEB_PAGE_DOD.md) | Đánh dấu group nào đang polish |
| [baocaotiendo](https://www.minhtien.online/baocaotiendo) | Bản 3.1: ngày 14/07 + media JetVina + WEB ~32% (tuỳ chọn) |
| [API.md](./API.md) | Diff endpoint mới (ops/mail/nearby) nếu thiếu |
| [JETVINA_GAP_REPORT.md](./JETVINA_GAP_REPORT.md) | Refresh số seed + SMTP status mỗi tuần |

### 4.2 Bộ tài liệu cần có (deliverable cho team / KH)

| Bộ | File đích | Mục đích | Ai dùng |
|----|-----------|----------|---------|
| **Ops onboarding** | Đã có [ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md) — **review + bổ sung topology API** | Dev mới | Team |
| **API handbook** | [API.md](./API.md) + Swagger Basic note | Đối tác kỹ thuật | KH / team |
| **Admin vận hành** | **Tạo mới** `docs/ADMIN_OPS_GUIDE.md` | CMS: đăng nhập, FP, news, quotes, operators | KH (GĐ3) |
| **Web↔API map** | **Tạo mới** `docs/WEB_API_SURFACE_MAP.md` | Trang FE → endpoint | Dev |
| **Smoke runbook** | Rút gọn từ [BE_TEST.md](./BE_TEST.md) → `docs/SMOKE_RUNBOOK.md` | 1 lệnh verify sau deploy | Dev / ops |
| **KH G4 keys** | [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md) — **gửi Anh sớm** | Keys tích hợp | KH |
| **Báo cáo KH** | `/baocaotiendo` cập nhật định kỳ | Tiến độ HĐ | Anh Tuấn Anh |

---

## 5. Wave D — Vận hành / blocker (song song)

| # | Việc | Blocker? | Owner |
|---|------|----------|-------|
| D1 | SMTP production thật + test newsletter/quote mail | **Có** (mail chưa deliver) | Dev config + **Anh cung cấp** |
| D2 | Backup DB định kỳ (cron + restore drill) | GĐ1 đóng HĐ | Ops |
| D3 | CMS nội dung thật (tin, FP copy, ảnh quyền) | GĐ2/GĐ3 NT | **Anh** + admin |
| D4 | Chuẩn bị keys GĐ4 (không cần đủ ngay) | GĐ4 | **Anh** |
| D5 | Nghiệm thu GĐ1 với Anh (biên bản HĐ) | Cuối tuần 4 | Hai bên |

---

## 6. Việc **Anh / bạn** cần làm (action list)

### Ngay (tuần 2)

1. Xem [https://www.minhtien.online/en-us](https://www.minhtien.online/en-us) + [private-jet-charter](https://www.minhtien.online/en-us/private-jet-charter) — góp ý **ưu tiên trang** tháng 2.  
2. Xem [baocaotiendo](https://www.minhtien.online/baocaotiendo) — xác nhận % / wording OK hay cần bản 3.1.  
3. **SMTP:** host/port/user/pass/`From` (hoặc bảo dùng SendGrid/SES…) → bật mail form + customer care.  
4. Quyết định thứ tự polish: Home → Charter → Commercial → Account.

### Tuần 3–6 (chuẩn bị GĐ4, không trễ)

5. Điền dần [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md): Stripe/OnePay/9Pay (ưu tiên 1–2), Google/Apple/SMS nếu cần.  
6. Nội dung CMS: 3–5 bài news + copy Fixed Price ưu tiên (EN + VI).  
7. Phản hồi brand: ảnh hotlink jetvina.com tạm ổn đến khi có media OWNED?

### Cuối GĐ1 (trước ~tuần 4)

8. Lịch họp ngắn nghiệm thu GĐ1 (biên bản) khi SMTP + backup đủ.

---

## 7. Việc **team Dev** làm tuần này (concrete)

| Ngày | Focus |
|------|--------|
| **T2** | `WEB_API_SURFACE_MAP` + cập nhật WORK_PLAN/CHECKLIST · A5 quote E2E verify prod |
| **T3–T4** | A1 charter polish + A2 FP/EL depth · smoke sync mỗi PR |
| **T5** | D1 SMTP (khi có keys) · draft `ADMIN_OPS_GUIDE` |
| **T6–T7** | A3/A4 · baocaotiendo 3.1 · gửi KH checklist G4 |

Lệnh chuẩn trước deploy:

```powershell
pnpm smoke:api-sync
# sau deploy VPS:
# bash /var/www/jetbay-be/deploy/smoke-all.sh
powershell -File scripts/deploy/jetbay-be/sync-web.ps1
# ssh … DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' bash …/deploy-web.sh
```

---

## 8. Ngoài phạm vi (nhắc để không lệch)

- React Native / App 248TR  
- Invent feature kiểu HomeFix CRM  
- Nest refactor module sâu trước go-live  
- Commit `.env` / mật khẩu demo vào git  

---

**Đọc tiếp:** [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md) · [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) · [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md)
