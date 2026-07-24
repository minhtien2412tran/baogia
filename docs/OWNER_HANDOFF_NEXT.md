# JETVINA/JETBAY — OWNER HANDOFF VÀ CÔNG VIỆC TIẾP THEO

> **Ngày cập nhật:** 24/07/2026 ~11:20 ICT  
> **GĐ1:** `TECHNICALLY DONE — PENDING SIGN-OFF`  
> **GĐ2:** `DEV BASELINE DONE — PENDING OWNER INPUT (News/UX), POLISH AND UAT`  
> **SMTP W5-10:** `PASS` · **W5-11:** PENDING_OWNER · **datetime mail:** PASS (IANA tz)  
> **Canonical:** file này · snapshot [reviews/SESSION_20260724_MAIL_MEDIA.md](./reviews/SESSION_20260724_MAIL_MEDIA.md)  
> **Rule:** Dev xong code → tự cập nhật markdown; **không** hỏi lại Owner mục đã PASS

## 1. Phần Dev đã hoàn thành

* Wave 0 — Đồng bộ tài liệu và trạng thái: **DONE**
* Wave 1 — Baseline smoke và page walk: **DONE**
* Wave 2 Dev — CMS inventory, audit, template và residual: **DONE**
* W2-09 — CMS publish cycle trên VPS: **PASS** (`id=67`)
* Wave 3a — Contact EN/VI **200 LIVE**
* Wave 4 — Media Option 2 + hotlink scrub: **PASS**
* Bugfix 404 aliases + i18n warn=0: **DONE**
* Wave 5-01…03 SMTP prep: **DONE**
* W5-10 SMTP Gmail prod: **PASS** (`smtp=true` · catcher=false)
* Mail automation SoT (operator fan-out, idempotent SENT, unassigned alert): **DEPLOYED**
* Email datetime rõ (không ISO cắt cụt): **PASS** · `utils/email-datetime.ts` · deploy ~11:20
* W5-11…14 — **chưa đóng** (chờ Owner inbox rồi Dev W5-12…)
* W6-01 nháp biên bản GĐ1: **DONE**
* W6-02 pack phương án A: **READY** (chờ lịch + ký)

## 2. Evidence chính

| Hạng mục | Link / lệnh |
|----------|-------------|
| Contact live | https://www.minhtien.online/en-us/contact |
| CMS publish cycle | `node scripts/smoke-cms-publish-cycle.mjs` → **PASS** |
| Biên bản GĐ1 (nháp) | [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md) |
| Media decision | [OWNER_MEDIA_DECISION.md](./OWNER_MEDIA_DECISION.md) |
| Page walk | [reviews/GD2_PAGE_WALK_20260724.md](./reviews/GD2_PAGE_WALK_20260724.md) |
| CMS inventory | [reviews/CMS_INVENTORY_20260724.md](./reviews/CMS_INVENTORY_20260724.md) |
| Media audit | [reviews/MEDIA_AUDIT_20260724.md](./reviews/MEDIA_AUDIT_20260724.md) |
| Mail automation SoT | [ORDER_EMAIL_AUTOMATION.md](./ORDER_EMAIL_AUTOMATION.md) |
| Session snapshot 24/07 | [reviews/SESSION_20260724_MAIL_MEDIA.md](./reviews/SESSION_20260724_MAIL_MEDIA.md) |
| Test evidence | [TEST_MATRIX.md](./TEST_MATRIX.md) |
| SMTP prep | [SMTP_SETUP_GUIDE.md](./SMTP_SETUP_GUIDE.md) |
| News template | [CMS_NEWS_TEMPLATE.md](./CMS_NEWS_TEMPLATE.md) |
| UAT GĐ2 | [UAT_CHECKLIST.md](./UAT_CHECKLIST.md) |

---

# 3. Task đang chờ Owner

> **SMTP (W5-10) PASS** — W5-11 chờ Owner xác nhận inbox; W5-12…14 chưa DONE.  
> Mail SoT: [ORDER_EMAIL_AUTOMATION.md](./ORDER_EMAIL_AUTOMATION.md) · Form: [OWNER_INPUT_FORMS.md](./OWNER_INPUT_FORMS.md)

## W6-02 — Đặt lịch họp ký GĐ1 (phương án A) — ưu tiên

Pack: [W6_02_GD1_SIGNING_PACK.md](./W6_02_GD1_SIGNING_PACK.md) · Biên bản: [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md) (đã tick A)

Owner gửi block `W6-02 SIGNING` (slot / ngày / giờ / link / inbox SEEN?).

---

## W4-04 — Chọn phương án media

✅ **Đã chọn Option 2** — mirror · hotlink scrub PASS. Không cần chọn lại.

---

## W3-06 — Gửi feedback UX

Owner gửi tối đa 10 điểm, đánh số (hoặc paste form trong [OWNER_INPUT_FORMS.md](./OWNER_INPUT_FORMS.md)):

1. Trang hoặc URL.
2. Vị trí cần sửa.
3. Nội dung hiện tại.
4. Kết quả mong muốn.
5. Ảnh tham chiếu nếu có.
6. Mức ưu tiên nếu cần.

Sau khi nhận, Dev thực hiện:

* W3-07 — Phân loại P0/P1/P2.
* W3-08 — Polish desktop.
* W3-09 — Polish tablet.
* W3-10 — Accessibility cơ bản.
* W3-11 — Chụp ảnh trước/sau gửi Owner.

Tham chiếu xem: https://www.minhtien.online/en-us · https://www.minhtien.online/en-us/contact

---

## W2-05 — Gửi 3–5 bài News thật

Mỗi bài nên cung cấp (xem [CMS_NEWS_TEMPLATE.md](./CMS_NEWS_TEMPLATE.md) · form [OWNER_INPUT_FORMS.md](./OWNER_INPUT_FORMS.md)):

* Locale EN hoặc VI.
* Title · Slug đề xuất · Excerpt · Body.
* Featured image · Alt text.
* SEO title · SEO description.
* Ngày publish · Quyền sử dụng ảnh.

Dev sẽ:

1. Kiểm tra template.
2. Nhập lên Admin.
3. Publish.
4. Kiểm tra list/detail trả `200`.
5. Kiểm tra locale và metadata.
6. Cập nhật evidence.

W2-09 đã PASS nên không còn blocker kỹ thuật cho quy trình publish.

---

## W5-10 — Cấu hình SMTP thật trên VPS

✅ **DONE 24/07** — xem [SMTP_SETUP_GUIDE.md](./SMTP_SETUP_GUIDE.md) · [TEST_MATRIX.md](./TEST_MATRIX.md)

Hiện trạng: **W5-10 PASS** · **W5-11 chờ Owner** xác nhận inbox Quote #61/#62 (Spam?) · W5-12…14 sau đó.  
SoT đầy đủ: [ORDER_EMAIL_AUTOMATION.md](./ORDER_EMAIL_AUTOMATION.md)
---

# 4. Nghiệm thu GĐ1

## Đã sẵn sàng

* W6-01 — Nháp biên bản: [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md) — **tick phương án A**  
* W6-02 pack: [W6_02_GD1_SIGNING_PACK.md](./W6_02_GD1_SIGNING_PACK.md)  
* SMTP: **PASS** — không cần residual B  

## Còn thực hiện

### Phương án A (đủ SMTP) — **đang dùng**

1. Owner xác nhận inbox (SEEN / SPAM).
2. Hai bên họp theo slot Owner chọn.
3. Ký biên bản GĐ1.
4. Chuyển trạng thái GĐ1 → `CLOSED — SIGNED-OFF`.

### Trường hợp chưa cấu hình SMTP

~~Không áp dụng~~ — SMTP đã PASS 24/07.

**Không** tự ghi GĐ1 `CLOSED` nếu chưa có chữ ký.

---

# 5. Nghiệm thu GĐ2

Sau khi News, feedback, media và SMTP (hoặc residual) được xử lý:

1. W6-03 — Freeze scope và version GĐ2.
2. Tạo backup trước UAT.
3. W6-04 — Gửi UAT pack và tài khoản demo qua kênh riêng.
4. W6-05 — Owner chạy checklist U1–U15 ([UAT_CHECKLIST.md](./UAT_CHECKLIST.md)).
5. W6-06 — Dev sửa lỗi chặn nghiệm thu.
6. W6-07 — Chạy regression cuối.
7. W6-08 — Owner ký `UAT_CHECKLIST.md`.
8. W6-09 — Hai bên ký biên bản nghiệm thu staging GĐ2.

Điều kiện ký GĐ2:

* CMS đạt nội dung tối thiểu.
* Không còn lỗi UX P0.
* P1 đã sửa hoặc được ghi residual.
* Có quyết định media.
* Smoke/regression PASS.
* SMTP PASS hoặc residual GĐ2 được hai bên chấp nhận.
* Owner đã ký UAT.

---

# 6. Bảng trạng thái task

| Task ID | Người thực hiện | Trạng thái |
|---------|-----------------|------------|
| W2-09 | Dev | ✅ PASS trên VPS |
| W6-01 | Dev | ✅ Nháp sẵn |
| W4-04 / W4-05 | Owner → Dev | ✅ **Option 2** · mirror+approve · hotlink scrub PASS (audit 0) |
| W2-05 | Owner → Dev | ⏳ Payload News **trống** — paste lại nội dung bài |
| W5-10…14 | Owner → Dev | W5-10 ✅ · W5-11 ⏳ Owner inbox · W5-12…14 ⏳ · [ORDER_EMAIL_AUTOMATION](./ORDER_EMAIL_AUTOMATION.md) |
| W3-06…11 | Owner → Dev | ⏳ Payload UX **trống** — paste lại list feedback |
| W6-02 | Hai bên | ⏳ **A sẵn sàng** — chờ Owner chọn slot + ký · [OWNER_INPUT_FORMS](./OWNER_INPUT_FORMS.md) |
| W6-03…09 | Hai bên | ⏳ Chờ hoàn thiện đầu vào GĐ2 |

---

# 7. Hành động Owner cần làm ngay

Có thể mở song song (form: [OWNER_INPUT_FORMS.md](./OWNER_INPUT_FORMS.md)):

1. **W6-02:** Chọn slot họp + xác nhận inbox #61/#62 → ký GĐ1 **A**.
2. **W3-06:** Gửi tối đa 10 feedback UX.
3. **W2-05:** Gửi 3–5 bài News.

Khi cung cấp đầu vào, ghi đúng **task ID** để Dev thực thi ngay.
