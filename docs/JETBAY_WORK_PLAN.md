# Kế hoạch công việc JetBay — 74TR · 16 tuần

**Bắt đầu HĐ:** 09/07/2026 · **Cập nhật:** 2026-07-14  
**Sprint hiện tại:** [NEXT_SPRINT_PLAN.md](./NEXT_SPRINT_PLAN.md) (Web↔API · sync · docs · việc KH)  
**Liên quan:** [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md) · [JETBAY_DELIVERY_CHECKLIST.md](./JETBAY_DELIVERY_CHECKLIST.md) · [BE_TEST.md](./BE_TEST.md)

---

## Tổng quan effort còn lại

| Khối | Còn lại | Critical path? |
|------|---------|----------------|
| Web polish (GĐ2) | ~35% | **Có** |
| Admin vận hành (GĐ3) | ~20% | Một phần |
| GĐ4 integrations | ~25% + keys KH | Cuối dự án |
| BE refactor modules | ~15% | **Không** — sau go-live |

**Không làm trên critical path:** Nest module phase 2–6, React Native 248TR, Company/SavedSearch API.

---

## GĐ1 — Tuần 1–4 — **ĐÓNG ✅ 2026-07-10**

- [x] API + seed + smoke prod **55/55**
- [x] Swagger/CORS docs
- [x] `APP_ENV=production` + secrets audit
- [x] MinIO → local upload (`integrations.minio: local`)
- [x] Biên bản nghiệm thu → [GD1_SIGNOFF.md](./GD1_SIGNOFF.md)

**Mở GĐ2** — web polish theo bảng dưới.

## GĐ2 — Tuần 5–8 (Web staging · đợt 2)

| Việc | Group DoD | Status |
|------|-----------|--------|
| Home sections + news + newsletter | 1 | 🟡 đang polish (API wired) |
| FP / EL / JetCard / TC pages | 2 | 🟡 API seed OK · depth UI tiếp |
| Charter ×6 | 3 | 🟡 route + JetVina media · visual polish tiếp |
| Content pages | 4 | 🟡 có khung · CMS copy thật chờ KH |
| Account flows | 5 | 🟡 dashboard API · flow đầy đủ tiếp |

Chi tiết tuần 2+: [NEXT_SPRINT_PLAN.md](./NEXT_SPRINT_PLAN.md) Wave A.

## GĐ3 — Tuần 9–12 (CMS · đợt 3)

- [x] Admin CRUD lõi
- [x] Admin FP **options[]** UI (2026-07-10)
- [x] Booking UAT JWT end-to-end — `smoke-auth-booking.mjs` 4/4 prod
- [ ] Tài liệu vận hành admin cho KH
- [ ] Nội dung CMS thật từ KH

## GĐ4 — Tuần 13–16 (Go-live · đợt 4)

Xem [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md) — **chờ keys KH từ tuần 6**.

---

## Tuần 2 — việc đang làm (14/07)

| # | Việc | Trạng thái |
|---|------|------------|
| 1 | Admin FP price tiers editor | ✅ |
| 2 | Home: News + Newsletter sections | ✅ |
| 3 | FP listing: tier labels + filtered terms | ✅ |
| 4 | API sync 173 paths + security Phase B | ✅ |
| 5 | JetVina media trên web (jv) | ✅ |
| 6 | `NEXT_SPRINT_PLAN.md` (Web↔API · docs · KH actions) | ✅ |
| 7 | Charter ×6 polish + quote E2E | ⬜ Wave A |
| 8 | `WEB_API_SURFACE_MAP` + `ADMIN_OPS_GUIDE` | ⬜ Wave C |
| 9 | SMTP prod + gửi KH checklist G4 | ⬜ Wave D · chờ Anh |

---

## Song song 2 dev (gợi ý)

```
Dev A: Web polish (home → commercial → charter)
Dev B: Admin ops + booking UAT + deploy smoke
KH:    Nội dung CMS + keys G4 từ tuần 6
```

---

## Mốc thanh toán

| Đợt | % | Tuần mục tiêu | Điều kiện |
|-----|---|---------------|-----------|
| 1 | 30% | 4 | GĐ1 sign-off ✅ [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) |
| 2 | 30% | 8 | Web staging |
| 3 | 30% | 12 | API + CMS |
| 4 | 10% | 16 | Go-live |
