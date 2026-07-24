# Báo cáo tiến độ đầy đủ — JetVina (JetBay 74TR)

> **Ngày báo cáo:** 24/07/2026 · **Tuần HĐ:** ~3/16 (bắt đầu 09/07/2026)  
> **Khách hàng:** Anh Tuấn Anh · **Đơn vị thực hiện:** Minh Tiến Solutions  
> **Phạm vi HĐ:** Gói Web Clone **74.000.000 VNĐ** (chưa VAT) · 4 tháng / 16 tuần  
> **Trang rút gọn:** https://www.minhtien.online/baocaotiendo (v3.1 — 14/07)  
> **SoT:** [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) · [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) · [GD2_ROADMAP.md](./GD2_ROADMAP.md) · [UAT_CHECKLIST.md](./UAT_CHECKLIST.md)

---

## 0. Việc cần làm ngay để đóng GĐ1 + mở sạch GĐ2

### Bước A — Đóng Giai đoạn 1 (HĐ / thanh toán đợt 1)

| # | Việc | Ai | Hạng mục / deliverable | Hạn gợi ý | Status |
|---|------|----|------------------------|-----------|--------|
| A1 | Cấu hình **SMTP production** trên VPS (hoặc chấp nhận chuyển SMTP sang GĐ4 trên biên bản) | Owner O4 | `SMTP_*` trên `/var/www/jetbay-be/.env` · `integrations.smtp=true` | **ASAP / trước họp NT** | 🔴 BLOCKED |
| A2 | Dev verify ≥1 mail vào inbox thật (quote hoặc newsletter) | Dev | Log smoke + screenshot inbox | Ngay sau A1 | ⬜ chờ A1 |
| A3 | Chốt lịch họp nghiệm thu GĐ1 + người ký | Owner O17 | Slot 30–45 phút | **Cuối tuần 3–4** (~cuối 07 / đầu 08) | ⬜ OPEN |
| A4 | Họp NT: duyệt DoD kỹ thuật [GD1_SIGNOFF](./GD1_SIGNOFF.md) + residual | Hai bên | Biên bản ký (mục §13) | Trong họp A3 | ⬜ |
| A5 | (Tuỳ chọn) Anh chấp nhận residual SMTP nếu chưa kịp | Owner | Ghi rõ trên biên bản: “SMTP = điều kiện GĐ4 / phụ lục” | Trong họp | ⬜ |
| A6 | Trình ký & thu **đợt 1 ~30%** theo HĐ | Hai bên | Hóa đơn / điều khoản HĐ | Sau A4 | ⬜ |

**GĐ1 còn thiếu thật sự:** chỉ **(1) SMTP hoặc chấp nhận residual**, **(2) họp + ký biên bản**. Phần kỹ thuật Dev đã PASS.

### Bước B — Hoàn tất điều kiện nghiệm thu Giai đoạn 2

| # | Việc | Ai | Hạng mục / trang / deliverable | Hạn gợi ý | Status |
|---|------|----|--------------------------------|-----------|--------|
| B1 | Xác nhận thứ tự polish: Commercial → Home → Charter → Account (hoặc đổi) | Owner O1 | 1 dòng chat/email | Tuần này | ⬜ OPEN |
| B2 | Duyệt UI live + gửi ≤10 điểm feedback | Owner O2 | https://www.minhtien.online/en-us | Tuần này–tuần 4 | ⬜ OPEN |
| B3 | Visual polish theo feedback (parity jetvina.com) | Dev | Groups DoD [JETBAY_WEB_PAGE_DOD](./JETBAY_WEB_PAGE_DOD.md) | Song song B2 → tuần 6–8 | 🟡 ongoing |
| B4 | Publish CMS: ≥3–5 news + copy FP EN+VI | Owner O10 (+ Dev hỗ trợ Admin) | Admin News / Fixed Price | Trước NT GĐ2 | ⬜ OPEN |
| B5 | Quyết định media: hotlink jetvina.com tạm OK? | Owner O5 | Có/không + deadline mirror | Tuần này | ⬜ OPEN |
| B6 | SMTP (cùng A1) — mail quote + newsletter U11 | Owner+Dev | Inbox thật | Trước NT GĐ2 | 🔴 BLOCKED |
| B7 | UAT pack Owner walkthrough U1–U15 | Owner + Dev | [UAT_CHECKLIST.md](./UAT_CHECKLIST.md) · ký cuối file | **Tuần 7–8** | 🟡 Dev pack sẵn · Owner sign ⬜ |
| B8 | Smoke lại trước NT: `smoke-web-api` + `smoke-auth-booking` + quote UI | Dev | Log trong TEST_MATRIX | Tuần 8 | ⬜ |
| B9 | Biên bản NT **Web staging** + đợt thanh toán 2 | Hai bên | Staging Frontend đạt DoD | **Cuối tuần 8** | ⬜ chưa tới hạn |

**GĐ2 Dev sprint S1–S4 (code):** gần xong — còn **SMTP**, **nội dung CMS**, **góp ý visual**, **ký UAT Owner**.

---

## 1. Tóm tắt điều hành

| Giai đoạn | % kỹ thuật (ước lượng) | % đóng HĐ / NT | Còn thiếu cốt lõi |
|-----------|------------------------|----------------|-------------------|
| **GĐ1** | ~95% | ~85% | SMTP (hoặc chấp nhận residual) + **ký biên bản** |
| **GĐ2** | ~70–80% (không kể Owner) | ~20–25% (chưa tới hạn NT) | Polish + CMS copy + SMTP + **UAT ký** |
| **GĐ3** | ~50–60% khung | ~15% | Ops guide walkthrough + CMS thật + RBAC wave còn lại |
| **GĐ4** | ~5–10% | ~0% | Keys Pay/OAuth/SMS + sandbox UAT |
| **Tổng lịch 4 tháng** | ~35–40% dựng sớm | Theo từng đợt NT | — |

**Blocker P0 chung:** SMTP production (`SMTP_HOST` loopback / catcher — không phải inbox khách).

---

## 2. Môi trường prod

| Vai trò | URL |
|---------|-----|
| Web chính thức (tham chiếu) | https://jetvina.com/ |
| Web demo HĐ | https://www.minhtien.online/en-us |
| Báo cáo rút gọn | https://www.minhtien.online/baocaotiendo |
| API | https://api.minhtien.online |
| Swagger (Basic) | https://docs.minhtien.online/swagger |
| Admin | https://admin.minhtien.online/login |
| Báo giá collateral | https://m-tien.com/jet-bay/ |

---

## 3. Giai đoạn 1 — Chi tiết

| Trường | Giá trị |
|--------|---------|
| Tuần | 1–4 · ~09/07 – đầu 08/2026 |
| Đóng kỹ thuật | ✅ **10/07/2026** — [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) |
| Ký KH | ⬜ Chưa |
| Smoke | **55/55** (10/07) |

### 3.1 Đã xong (không làm lại)

Seed · CORS · guards · `APP_ENV=production` · JWT/booking · hạ tầng tách · upload local · Swagger Basic · rotate demo passwords · **backup restore PASS** (14/07).

### 3.2 Checklist còn thiếu — GĐ1

| ID | Hạng mục | Việc cụ thể | Ai | Done khi | Status |
|----|----------|-------------|-----|----------|--------|
| G1-R1 | Vận hành mail | SMTP thật + 1 mail inbox | Owner→Dev verify | `smtp=true`, inbox có thư | 🔴 |
| G1-R2 | Backup | Cron + restore drill | Dev | Airports 120=120 | ✅ PASS |
| G1-R3 | Nghiệm thu HĐ | Họp + ký biên bản | Hai bên | Chữ ký §13 / HĐ | ⬜ |
| G1-R4 | Bảo mật demo | Rotate passwords | Dev | Done 13–16/07 | ✅ |
| G1-R5 | Swagger | HTTP Basic ON | Dev | 401 anonymous | ✅ |

**Hai đường đóng GĐ1:**

1. **Đủ điều kiện:** A1→A2→A3→A4 (SMTP + ký).  
2. **Nhanh hơn:** A3→A4 với ghi chú biên bản “SMTP chuyển GĐ4 / không chặn đợt 1” (Anh đồng ý).

---

## 4. Giai đoạn 2 — Chi tiết + hạng mục còn thiếu

| Trường | Giá trị |
|--------|---------|
| Tuần NT HĐ | **5–8** (tháng 2) — hiện tuần ~3: **chuẩn bị sớm** |
| Tỷ trọng | ~25% · đợt thanh toán 2 |
| Roadmap | [GD2_ROADMAP.md](./GD2_ROADMAP.md) |
| UAT | [UAT_CHECKLIST.md](./UAT_CHECKLIST.md) |

### 4.1 Đã xong (Dev — không tính đã NT HĐ)

| Sprint / mã | Việc | Status |
|-------------|------|--------|
| T-S1-01…04 | Surface map, quote DTO, phone required, api-sync | ✅ |
| T-S2-01…04 | Commercial empty/error, fleet SAMPLE, quote E2E #36, news empty | ✅ |
| T-S3-01…03 | Charter CMS map, account Retry, ADMIN_OPS_GUIDE | ✅ |
| T-S4-02 | Backup restore | ✅ |
| T-S4-03 | baocaotiendo 3.1 | ✅ |
| T-S4-01 | SMTP + inbox | 🔴 BLOCKED_OWNER |
| Sau 14/07 | Account profile/avatar/social, i18n gate, trip bookings, realtime khung… | ✅ code (một phần thuộc mở rộng) |

### 4.2 Hạng mục trang còn thiếu / chưa đạt NT

Theo thứ tự ưu tiên [GD2_ROADMAP](./GD2_ROADMAP.md):

| Nhóm | Hạng mục trang / deliverable | Còn thiếu gì | Ai | Exit NT nhóm |
|------|------------------------------|--------------|-----|--------------|
| **1. Commercial** | `/fixed-price-charter`, empty-leg, jet-card, travel-credits | Copy/tier thật từ CMS; enquiry thấy trên Admin (đã có seed); polish UI theo O2 | Owner nội dung + Dev polish | Listing + 1 enquiry mỗi loại trên prod |
| **2. Home** | `/en-us` quote + news + fleet rail | News ≥3–5 bài; SMTP newsletter; visual polish | Owner O10 + Dev | SSR ổn + quote E2E SGN→HAN (đã có #36) |
| **3. Charter ×6** | 6 URL charter | Body/CMS hoặc chấp nhận static đã map; media rights O5; visual polish | Owner + Dev | 6 route 200 + CTA → quote |
| **4. Account** | `/account`, bookings, profile | UAT Owner login demo; payment vẫn BLOCKED keys (chấp nhận ở GĐ2) | Owner UAT | Thấy quotes/bookings / empty CTA |

### 4.3 Checklist còn thiếu — GĐ2 (toàn giai đoạn)

| ID | Hạng mục | Việc | Ai | Hạn | Status |
|----|----------|------|-----|-----|--------|
| G2-01 | SMTP / mail | Cùng G1-R1; U11 newsletter không PASS nếu chưa SMTP | Owner+Dev | Trước NT | 🔴 |
| G2-02 | Nội dung CMS | ≥3–5 news + FP copy EN+VI | Owner O10 | Trước tuần 8 | ⬜ |
| G2-03 | Feedback UI | ≤10 điểm ưu tiên | Owner O2 | Tuần 3–4 | ⬜ |
| G2-04 | Visual polish | Theo O2 + DoD parity | Dev | Tuần 4–8 | 🟡 |
| G2-05 | Media policy | Hotlink vs mirror CDN | Owner O5 | Tuần 3–4 | ⬜ |
| G2-06 | Thứ tự polish | Chốt O1 | Owner | Tuần này | ⬜ |
| G2-07 | UAT ký | Walkthrough U1–U15 + chữ ký | Owner | Tuần 7–8 | ⬜ |
| G2-08 | Smoke pre-NT | web-api + auth-booking + quote-ui | Dev | Tuần 8 | ⬜ |
| G2-09 | Biên bản NT GĐ2 | Staging Frontend | Hai bên | Cuối tuần 8 | ⬜ |
| G2-10 | i18n residual | Tourism nav WARN (không block NT nếu chấp nhận) | Dev | Tuỳ | 🟡 WARN |

**Không thuộc DoD GĐ2 (để GĐ4):** Stripe/OnePay/9Pay · Google/Apple · SMS OTP · payment trên account.

### 4.4 Điều kiện nghiệm thu GĐ2 (đề xuất — giữ nguyên roadmap)

1. Commercial + Home + Quote: API thật, empty/error rõ.  
2. Charter ×6: live + media brand; CMS hoặc static đã ghi.  
3. Account: login + quotes/bookings (pay BLOCKED OK).  
4. Smoke: `smoke-web-api` + `smoke-auth-booking` + Quote UI.  
5. Owner đã xử lý **O1–O4** (SMTP + ưu tiên + feedback tối thiểu).  
6. [UAT_CHECKLIST](./UAT_CHECKLIST.md) có chữ ký Owner.

---

## 5. Giai đoạn 3 — Còn thiếu (chuẩn bị sớm, NT tuần 9–12)

| ID | Hạng mục | Việc còn thiếu | Ai | Hạn gợi ý | Status |
|----|----------|----------------|-----|-----------|--------|
| G3-01 | CMS nội dung vận hành | News/charter/FP publish quy trình ổn định | Owner+Admin | Tuần 9–11 | 🟡 khung có |
| G3-02 | Tài liệu + đào tạo | Walkthrough ADMIN_OPS với Anh | Dev+Owner | Tuần 10–11 | ⬜ |
| G3-03 | RBAC R4 | CMS/media → PermissionGuard (bỏ AdminGuard còn lại) | Dev | Trong GĐ3 | ⬜ |
| G3-04 | RBAC R5 | Data scope sân bay / sales | Dev | Wave sau R4 | ⬜ |
| G3-05 | Quote→offer→booking ops | UAT quy trình sales trên Admin | Hai bên | Tuần 11–12 | 🟡 code sớm |
| G3-06 | Export / audit / schedule | Đã deploy 21/07 — cần UAT Owner | Owner | Trong GĐ3 | 🟡 |
| G3-07 | Biên bản NT API+CMS | Đợt thanh toán 3 | Hai bên | Cuối tuần 12 | ⬜ |

---

## 6. Giai đoạn 4 — Còn thiếu (tuần 13–16)

| ID | Hạng mục | Việc | Ai | Status |
|----|----------|------|-----|--------|
| G4-01 | Payment sandbox | Stripe và/hoặc OnePay/9Pay keys + webhook | Owner O7 | ⏸ |
| G4-02 | OAuth | Google/Apple Client ID (nếu in-scope) | Owner O8 | ⏸ |
| G4-03 | SMS OTP | Provider + sender | Owner O9 | ⏸ |
| G4-04 | SMTP | Nếu chưa xong từ GĐ1 | Owner O4 | 🔴 |
| G4-05 | Sandbox UAT | Pay/OAuth/OTP E2E | Dev+Owner | ⏸ sau keys |
| G4-06 | DocuSign / PDF live | Phụ lục + keys | Owner | Mock có |
| G4-07 | Go-live + readiness | Cutover domain/DNS nếu cần | Hai bên | ⏸ |
| G4-08 | Biên bản NT cuối | Đợt thanh toán cuối | Hai bên | ⬜ |

Checklist keys: [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md) · readiness: [GD4_SANDBOX_READINESS.md](./GD4_SANDBOX_READINESS.md)

---

## 7. Theo hạng mục hợp đồng 74TR

| Mã | Hạng mục | % KT | Gắn GĐ | Còn thiếu chính |
|----|----------|------|--------|-----------------|
| BE | Backend API & DB | ~75–85% | GĐ1+3+4 | SMTP ops · GĐ4 integrations · depth GĐ3 |
| WEB | Website | ~65–75% | GĐ2 | Polish · CMS copy · mail · UAT ký |
| ADM | Dashboard/CMS | ~50–60% | GĐ3 | Đào tạo · nội dung · R4/R5 RBAC |
| AUTH | Login/RBAC | ~55–65% | GĐ1/4 | OAuth/SMS GĐ4 |
| PAY | Thanh toán | ~5–10% | GĐ4 | Keys + sandbox |
| DOC | PDF/Word/HĐ | ~40–50% | GĐ3–4 | Mẫu cuối + DocuSign live |
| i18n | Đa ngôn ngữ | ~80% core | GĐ2 | Tourism WARN · SMS OTP |

---

## 8. Mốc thanh toán

| Đợt | % | Tuần | Điều kiện | Còn thiếu để thu |
|-----|---|------|-----------|------------------|
| 1 | ~30% | 4 | NT GĐ1 | SMTP (hoặc chấp nhận) + **ký** |
| 2 | ~30% | 8 | NT Web staging | B1–B9 |
| 3 | ~30% | 12 | NT API+CMS | G3-01…07 |
| 4 | ~10% | 16 | Go-live | G4-01…08 |

---

## 9. Việc Owner vs Dev (tóm tắt 1 trang)

### Owner (Anh) — làm trước

1. **P0** SMTP production (O4) — hoặc đồng ý ghi residual trên biên bản GĐ1.  
2. **P0** Lịch họp NT GĐ1 (O17).  
3. **P1** Feedback web ≤10 điểm + thứ tự polish (O1/O2).  
4. **P1** CMS 3–5 news + FP copy (O10).  
5. **P2** Media hotlink (O5) · chuẩn bị keys GĐ4 (O7–O9).  

### Dev (Minh Tiến) — làm tiếp

1. Chuẩn bị biên bản NT GĐ1 (in [GD1_SIGNOFF](./GD1_SIGNOFF.md) + mục ký §13).  
2. Sau SMTP: verify inbox → T-S4-01 PASS.  
3. Polish web theo O2; giữ smoke xanh.  
4. Hỗ trợ Anh publish CMS trên Admin.  
5. GĐ3: R4 PermissionGuard CMS/media · walkthrough ops.  
6. **Không** bật payment/OAuth giả trên prod.  

---

## 10. Ngoài phạm vi 74TR

App RN 248TR · phí merchant/SMS/hosting/domain · VAT 10%.

---

## 11. Phụ lục tài liệu

| Doc | Dùng khi |
|-----|----------|
| [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) | Họp đóng GĐ1 |
| [ACCEPTANCE_CRITERIA_GD1.md](./ACCEPTANCE_CRITERIA_GD1.md) | Residual GĐ1 |
| [GD2_ROADMAP.md](./GD2_ROADMAP.md) | Task GĐ2 |
| [UAT_CHECKLIST.md](./UAT_CHECKLIST.md) | UAT staging |
| [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md) | Hướng dẫn Owner |
| [JETBAY_WEB_PAGE_DOD.md](./JETBAY_WEB_PAGE_DOD.md) | DoD từng nhóm trang |
| [TEST_MATRIX.md](./TEST_MATRIX.md) | Evidence test |

---

## 12. Chỗ ký (họp NT)

| Vai trò | Họ tên | Chữ ký | Ngày |
|---------|--------|--------|------|
| Khách hàng | Anh Tuấn Anh | | |
| Minh Tiến Solutions | | | |

**Nội dung chấp nhận / residual ghi nhận:**  
_………………………………………………………………………………………………_

---

*Cập nhật 24/07/2026 — thêm §0 lộ trình đóng GĐ1→GĐ2 và checklist hạng mục còn thiếu từng giai đoạn. Đồng bộ `/baocaotiendo` khi Owner yêu cầu.*
