# JETVINA/JETBAY — OWNER HANDOFF VÀ CÔNG VIỆC TIẾP THEO

> **Ngày cập nhật:** 24/07/2026  
> **GĐ1:** `TECHNICALLY DONE — PENDING SIGN-OFF`  
> **GĐ2:** `DEV BASELINE DONE — PENDING OWNER INPUT, SMTP, POLISH AND UAT`  
> **Canonical:** file này · liên kết từ [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) · [PLAN_GD1_GD2_EXECUTION.md](./PLAN_GD1_GD2_EXECUTION.md)

## 1. Phần Dev đã hoàn thành

* Wave 0 — Đồng bộ tài liệu và trạng thái: **DONE**
* Wave 1 — Baseline smoke và page walk: **DONE**
* Wave 2 Dev — CMS inventory, audit, template và residual: **DONE**
* W2-09 — CMS publish cycle trên VPS: **PASS**
  * Draft → Publish → Unpublish → Delete · Record test: `id=67`
* Wave 3a — Trang Contact EN/VI: **DONE**
* `/en-us/contact`: **200 — LIVE**
* `/vi/contact`: **200 — LIVE**
* Wave 4-01…03 — Media audit và fallback: **DONE**
* W4-04 / W4-05 — Option 2 mirror + approve + remote OFF: **DONE**
* Hotlink scrub — `media-env` decouple + redeploy (~10:03 ICT): **PASS** (`jetvina.com` = 0 trên 8 trang ưu tiên)
* Wave 5-01…03 — Chuẩn bị SMTP: **DONE**
* W6-01 — Nháp biên bản nghiệm thu GĐ1: **DONE**

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
| Test evidence | [TEST_MATRIX.md](./TEST_MATRIX.md) |
| SMTP prep | [SMTP_SETUP_GUIDE.md](./SMTP_SETUP_GUIDE.md) |
| News template | [CMS_NEWS_TEMPLATE.md](./CMS_NEWS_TEMPLATE.md) |
| UAT GĐ2 | [UAT_CHECKLIST.md](./UAT_CHECKLIST.md) |

---

# 3. Task đang chờ Owner

## W4-04 — Chọn phương án media

Owner chọn và ký đúng một phương án trên [OWNER_MEDIA_DECISION.md](./OWNER_MEDIA_DECISION.md):

### Phương án 1 — Tiếp tục hotlink Jetvina

* Xác nhận có quyền sử dụng.
* Chấp nhận phụ thuộc nguồn Jetvina.
* Dev giữ audit và fallback hiện tại.

### Phương án 2 — Mirror về hạ tầng riêng

* Xác nhận có quyền sao chép và lưu trữ.
* Dev triển khai W4-05.
* Media chuyển về storage/CDN riêng.

### Phương án 3 — Thay bằng media sở hữu riêng

* Owner cung cấp bộ ảnh hợp lệ.
* Dev thay mapping và chạy lại media audit.

---

## W3-06 — Gửi feedback UX

Owner gửi tối đa 10 điểm, đánh số:

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

Mỗi bài nên cung cấp (xem [CMS_NEWS_TEMPLATE.md](./CMS_NEWS_TEMPLATE.md)):

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

Owner thiết lập trên `/var/www/jetbay-be/.env` (không gửi / không commit password):

```text
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
SMTP_FROM_NAME=
SMTP_ENQUIRY_TO=
SMTP_ALLOW_CATCHER=false
```

```bash
pm2 restart jetbay-be --update-env
curl -sS https://api.minhtien.online/integrations/status
# expect: smtp=true · smtpCatcher=false
```

Chi tiết: [SMTP_SETUP_GUIDE.md](./SMTP_SETUP_GUIDE.md) · [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)

Sau W5-10, Dev chạy:

* W5-11 — Quote mail → inbox thật.
* W5-12 — Newsletter / contact / booking mail.
* W5-13 — Retry và log lỗi.
* W5-14 — Cập nhật `GD1_SIGNOFF`, `TEST_MATRIX`, báo cáo tiến độ.

Hiện trạng: deliverable inbox thật **chưa** · `BLOCKED_OWNER_SMTP`.

---

# 4. Nghiệm thu GĐ1

## Đã sẵn sàng

* W6-01 — Nháp biên bản: [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md)  
* Residual SMTP (phương án B): phụ lục trong [GD1_SIGNOFF.md](./GD1_SIGNOFF.md)

## Còn thực hiện

### Trường hợp SMTP PASS

1. Ghi bằng chứng email đến inbox.
2. Cập nhật sign-off.
3. Hai bên họp.
4. Ký biên bản GĐ1.
5. Chuyển trạng thái GĐ1 → `CLOSED — SIGNED-OFF`.

### Trường hợp chưa cấu hình SMTP

Hai bên ký residual ghi rõ:

* SMTP chưa được Owner cung cấp.
* Không phải lỗi triển khai của Dev.
* Người chịu trách nhiệm cung cấp.
* Hạn hoàn thành.
* Giai đoạn tiếp nhận.
* Có hay không chặn nghiệm thu GĐ2.

**Không** tự ghi GĐ1 `CLOSED` nếu chưa có SMTP PASS hoặc residual được ký.

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
| W5-10…14 | Owner → Dev | ⏳ VPS vẫn **Mailpit catcher** — W5-10 chưa thật |
| W3-06…11 | Owner → Dev | ⏳ Payload UX **trống** — paste lại list feedback |
| W6-02 | Hai bên | ✅ Pack — [W6_02_GD1_SIGNING_PACK.md](./W6_02_GD1_SIGNING_PACK.md) · chờ lịch + ký |
| W6-03…09 | Hai bên | ⏳ Chờ hoàn thiện đầu vào GĐ2 |

---

# 7. Hành động Owner cần làm ngay

Có thể mở song song:

1. **W3-06:** Gửi tối đa 10 feedback UX.
2. **W2-05:** Gửi 3–5 bài News.
3. **W5-10:** Cấu hình SMTP thật trên VPS (hiện vẫn Mailpit).
4. Đề xuất ngày họp ký GĐ1 sau khi SMTP PASS hoặc residual được thống nhất.

Khi cung cấp đầu vào, ghi đúng **task ID** để Dev thực thi ngay.
