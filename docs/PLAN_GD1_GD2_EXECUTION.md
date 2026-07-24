# Plan thực thi — đóng GĐ1 & hoàn tất GĐ2

> **Nguồn phân tích:** [`note.md`](../note.md) (Owner viết cho AI) · **Ngày plan:** 24/07/2026  
> **Nguyên tắc:** SMTP / keys = **Owner unlock sau** → Dev làm trước mọi việc **không phụ thuộc secret**.  
> **Thứ tự:** cơ bản → chi tiết → nâng cao · mỗi task vừa khối lượng (ước S ≤2h · M ≤1 ngày · L ≤2 ngày).  
> **Báo cáo SoT:** [BAO_CAO_TIEN_DO_DAY_DU.md](./BAO_CAO_TIEN_DO_DAY_DU.md) · backlog rút: [GAP_GD1_GD2_BACKLOG.md](./GAP_GD1_GD2_BACKLOG.md)

---

## 0. Cách dùng plan này

| Cột | Ý nghĩa |
|-----|---------|
| **Wave** | Gói làm tuần tự; không nhảy Wave N+1 nếu exit Wave N chưa đạt (trừ Owner-blocked) |
| **Unlock** | `DEV` = làm ngay · `OWNER` = chờ Anh · `AFTER_SMTP` = sau khi có SMTP_* |
| **DoD** | Điều kiện đánh dấu DONE |
| **Evidence** | File/log/URL ghi vào [TEST_MATRIX.md](./TEST_MATRIX.md) hoặc checklist |

**Không làm trong plan này:** Pay / OAuth / SMS live (→ GĐ4) · Nest refactor sâu · App RN.

---

## 1. Bản đồ phụ thuộc (tóm tắt)

```text
[Wave 0 Docs sync] ──► [Wave 1 Baseline QA]
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        [Wave 2 CMS]   [Wave 3 UX]    [Wave 4 Media]
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    [Wave 5 SMTP] ←── OWNER thêm host/pass
                              ▼
                    [Wave 6 UAT + ký GĐ1/GĐ2]
                              ▼
                    [Wave 7 Prep GĐ3] (song song nhẹ sau GĐ2 freeze)
```

---

## Wave 0 — Đồng bộ tài liệu & trạng thái (cơ bản · DEV) · **DONE 24/07**

| ID | Task | Size | Unlock | DoD | Status |
|----|------|------|--------|-----|--------|
| W0-01 | Đồng bộ mã task `note.md` ↔ `GAP_GD1_GD2_BACKLOG` ↔ `BAO_CAO` | S | DEV | 3 file cùng ID/status | ✅ |
| W0-02 | Ghi rõ GĐ1 = `TECHNICALLY DONE — PENDING SIGN-OFF` trên CONTINUE | S | DEV | 1 đoạn trạng thái | ✅ |
| W0-03 | Checklist O1–O4: OPEN/DONE từng dòng (không mâu thuẫn) | S | DEV | [OWNER_ACTION_ITEMS](./OWNER_ACTION_ITEMS.md) khớp note | ✅ |
| W0-04 | UAT_CHECKLIST: ghi “PACK READY — Owner sign ⬜” (chưa ký) | S | DEV | Không ghi đã ký nếu chưa | ✅ |
| W0-05 | Draft residual SMTP template (phương án B) sẵn trong GD1_SIGNOFF phụ lục | S | DEV | Đoạn copy-paste cho họp | ✅ |

**Exit Wave 0:** AI/Dev đọc bất kỳ file nào cũng thấy cùng 1 sự thật về SMTP/UAT/GĐ1. ✅

---

## Wave 1 — Baseline test & review (cơ bản · DEV · không cần SMTP) · **DONE 24/07**

Làm **trước** polish lớn — biết hệ còn xanh đến đâu.

| ID | Task | Size | Unlock | DoD / Evidence | Status |
|----|------|------|--------|----------------|--------|
| W1-01 | `curl` health API + admin login 200 + web `/en-us` 200 | S | DEV | Log ngày trong TEST_MATRIX | ✅ |
| W1-02 | Chạy `smoke-web-api` (prod hoặc script VPS) | M | DEV | PASS / ghi fail | ✅ PASS #59 |
| W1-03 | Chạy `smoke-auth-booking` | M | DEV | PASS | ✅ PASS booking #12 |
| W1-04 | Manual quote SGN→HAN → thấy reference # trên Admin | M | DEV | quote id smoke | ✅ #58/#59 |
| W1-05 | Page walk 14 URL note §3.2.C — ghi PASS/FAIL/BUG | M | DEV | [reviews/GD2_PAGE_WALK_20260724.md](./reviews/GD2_PAGE_WALK_20260724.md) | ✅ |
| W1-06 | Phân loại bug walk → P0/P1/P2 backlog | S | DEV | List trong sheet trên | ✅ |
| W1-07 | Admin: login staff · tạo/sửa 1 news draft (không bắt buộc publish) | S | DEV | `/dashboard/content` 200 · CRUD JWT manual | 🟡 shell OK |
| W1-08 | `pnpm audit:i18n` — ghi fail/warn còn lại | S | DEV | fail=0 warn=10 | ✅ |

**Exit Wave 1:** Có regression baseline + danh sách bug thật (không đoán). ✅  
**P1 mở:** Contact 404 · News n=1 · SMTP catcher  
**Ops:** `scripts/pull-prod-api-key.mjs` — sync local key từ VPS (không in secret)

---

## Wave 2 — CMS & nội dung (cơ bản → chi tiết · DEV + OWNER nội dung)

SMTP **không** chặn nhập CMS.

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W2-01 | Inventory CMS hiện tại: đếm News / FP / Destination / JC / TC (EN+VI) | S | DEV | Bảng số trong sheet | ✅ 24/07 walk |
| W2-02 | List slug thiếu bản dịch / placeholder / lorem | S | DEV | Checklist GD2-CMS-05 | ⬜ next |
| W2-03 | Template bài News (title, slug, excerpt, body, ảnh, locale) gửi Owner | S | DEV | [CMS_NEWS_TEMPLATE.md](./CMS_NEWS_TEMPLATE.md) | ✅ |
| W2-04 | **OWNER:** cung cấp hoặc duyệt 3–5 bài News thật | M | OWNER | Nội dung sẵn |
| W2-05 | Publish ≥3 News (EN; VI nếu có) từ Admin | M | DEV+OWNER | Web list + detail 200 |
| W2-06 | Fixed Price: rà EN/VI tier copy · sửa hoặc đánh dấu SAMPLE rõ | M | DEV | Không lorem trên prod |
| W2-07 | Destination: title/desc/ảnh/SEO tối thiểu EN+VI (trang ưu tiên) | M | DEV | Top N routes OK |
| W2-08 | Jet Card / Travel Credit: copy khớp API · không demo text | M | DEV | Pages OK |
| W2-09 | Publish/unpublish 1 vòng UAT nội bộ | S | DEV | Workflow GD2-CMS-06 |
| W2-10 | SEO metadata home + 3 commercial pages (title/desc/OG) | M | DEV | View-source OK |

**Exit Wave 2:** Đạt điều kiện CMS tối thiểu note §3.2.B (hoặc ghi residual nội dung Owner chậm).

---

## Wave 3 — UX/UI polish (cơ bản → nâng cao · DEV · chờ feedback Owner song song)

### 3a — Cơ bản (làm ngay từ W1 bugs)

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W3-01 | Fix toàn bộ bug **P0** từ page walk | M–L | DEV | 0 P0 mở |
| W3-02 | Empty/error/loading đồng nhất 4 nhóm: Home, Commercial, Account, Quote | M | DEV | GD2-UX-05 |
| W3-03 | CTA chết / link sai — quét & sửa | S | DEV | GD2-UX-06 |
| W3-04 | i18n EN/VI hard-code lộ — fix trang ưu tiên | M | DEV | audit:i18n không tăng fail |
| W3-05 | Responsive: home + FP + quote + account (mobile 375) | M | DEV | Không tràn/vỡ |

### 3b — Chi tiết (sau hoặc song song Owner feedback)

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W3-06 | **OWNER:** gửi ≤10 điểm feedback (O2) | S | OWNER | List đánh số |
| W3-07 | Phân loại feedback P0/P1/P2 + estimate | S | DEV | Backlog gắn issue/note |
| W3-08 | Polish desktop spacing/typography theo brand JetVina | L | DEV | Trước/sau ảnh |
| W3-09 | Polish tablet | M | DEV | 768 OK |
| W3-10 | a11y cơ bản: label form, focus ring, contrast CTA | M | DEV | GD2-UX-08 |
| W3-11 | Chụp trước/sau gửi Owner | S | DEV | GD2-UX-09 |

**Exit Wave 3:** P0 UX = 0 · P1 đã xong hoặc Owner chấp nhận ghi residual.

---

## Wave 4 — Media (cơ bản audit → quyết định Owner → mirror nếu cần)

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W4-01 | Audit hotlink: liệt kê domain ảnh đang dùng | M | DEV | Manifest / script output |
| W4-02 | Kiểm tra 404 ảnh trên trang ưu tiên | M | DEV | List URL hỏng |
| W4-03 | Fallback image khi src lỗi (ít nhất home/commercial) | M | DEV | Không vỡ layout |
| W4-04 | **OWNER:** quyết định hotlink / mirror / thay OWNED (O5) | S | OWNER | ✅ Option 2 |
| W4-05 | Nếu mirror: pipeline copy → CDN/upload JetBay | L | AFTER_O5 | ✅ local mirror + approve · hotlink HTML = 0 (24/07) |
| W4-06 | Performance: resize/WebP trang nặng (nếu cần) | M | DEV | GD2-MEDIA-07 — optional |

**Exit Wave 4:** Có quyết định Owner + không 404 P0 trên staging.

---

## Wave 5 — SMTP (OWNER setup · DEV verify) — **để sau khi Anh thêm host/pass**

> Dev **không** bịa SMTP. Chỉ chuẩn bị sẵn; khi Owner set `.env` trên VPS → chạy verify.

### 5a — Chuẩn bị trước (DEV · làm ngay được)

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W5-01 | Xác nhận script/smoke mail đã có (`smoke:newsletter-smtp`, quote mail…) | S | DEV | Lệnh ghi trong SMTP_SETUP_GUIDE |
| W5-02 | Review template email EN/VI (nội dung brand) — không gửi | M | DEV | Template OK trên Admin/DB |
| W5-03 | Checklist biến `SMTP_*` + `SMTP_ENQUIRY_TO` gửi Owner (không điền pass vào Git) | S | DEV | OWNER_NEXT_ACTIONS |

### 5b — Sau khi Owner cấu hình (AFTER_SMTP)

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W5-10 | Owner set SMTP trên VPS + `pm2 restart --update-env` | S | OWNER | `/integrations/status` → smtp true |
| W5-11 | Gửi 1 mail test quote → inbox | M | DEV | Screenshot inbox |
| W5-12 | Newsletter / contact / booking mail spot-check | M | DEV | GD2-MAIL-02 |
| W5-13 | Retry/log khi SMTP tạm lỗi | M | DEV | GD2-MAIL-04 |
| W5-14 | Ghi PASS vào GD1_SIGNOFF + TEST_MATRIX + baocaotiendo note | S | DEV | Đồng bộ docs |

**Nếu Owner chọn residual:** bỏ qua W5-10…14 · dùng W0-05 trên biên bản GĐ1 · SMTP vẫn bắt buộc trước **NT GĐ2** trừ khi residual GĐ2 cũng được ký.

**Exit Wave 5:** Phương án A (mail PASS) hoặc B (residual đã ký).

---

## Wave 6 — UAT + đóng GĐ1/GĐ2 (nghiệm thu)

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W6-01 | Hoàn thiện biên bản NT GĐ1 (từ GD1_SIGNOFF + residual) | S | DEV | PDF/MD sẵn |
| W6-02 | Họp + ký GĐ1 | M | OWNER+DEV | Chữ ký |
| W6-03 | Freeze scope GĐ2 · tag/version deploy | S | DEV | Backup VPS ghi nhận |
| W6-04 | UAT pack: URL + tài khoản demo (creds qua kênh private) | S | DEV | GD2-UAT-02 |
| W6-05 | Owner chạy U1–U15 | L | OWNER | Checklist điền |
| W6-06 | Fix bug chặn NT từ UAT | L | DEV | P0=0 |
| W6-07 | Regression cuối (W1 smokes + mail nếu có) | M | DEV | Report |
| W6-08 | Owner ký UAT_CHECKLIST | S | OWNER | Chữ ký |
| W6-09 | Biên bản NT staging GĐ2 | S | Hai bên | Ký |
| W6-10 | Cập nhật baocaotiendo %/wording sau ký | M | DEV | Deploy web |

**Exit Wave 6:** GĐ1 CLOSED/SIGNED · GĐ2 staging NT PASS (hoặc residual ghi rõ).

---

## Wave 7 — Chuẩn bị GĐ3 (nhẹ · sau freeze GĐ2)

Không chặn đóng GĐ2. Chỉ mở khi Wave 6 xong hoặc song song P2.

| ID | Task | Size | Unlock | DoD |
|----|------|------|--------|-----|
| W7-01 | Duyệt ADMIN_OPS_GUIDE + 1 buổi walkthrough ngắn | M | DEV+OWNER | Ghi note |
| W7-02 | Liệt kê endpoint CMS còn AdminGuard → plan R4 | S | DEV | Issue list |
| W7-03 | Draft ma trận role vận hành (ai publish news) | S | OWNER+DEV | Phê duyệt |
| W7-04 | SOP backup/deploy 1 trang (link scripts có sẵn) | S | DEV | Doc ngắn |

GĐ4: **không** mở task code cho đến khi có keys — chỉ giữ [KH_G4_KEYS_CHECKLIST](./KH_G4_KEYS_CHECKLIST.md).

---

## 2. Lịch gợi ý theo tuần (linh hoạt SMTP)

| Tuần | Focus Dev | Focus Owner |
|------|-----------|-------------|
| **W-now** | Wave 0 + Wave 1 | Chốt SMTP **hoặc** residual; O1/O2/O5 |
| **+1** | Wave 2 (CMS) + W3a (P0 UX) | Cung cấp news/FP copy |
| **+2** | Wave 3b + Wave 4 | Feedback UX · quyết định media |
| **+SMTP** | Wave 5b | Điền SMTP_* trên VPS |
| **NT** | Wave 6 | Họp ký GĐ1 → UAT GĐ2 |

---

## 3. Việc AI/Dev làm **ngay trong session tiếp theo** (không chờ SMTP)

> **Session 24/07:** Wave 0–5a + W2-09 + W6-01 DONE · Contact live · **Waiting Owner** per [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md)

**Owner-gated (song song):**

1. **W4-04** — media 1/2/3  
2. **W3-06** — ≤10 UX feedback  
3. **W2-05** — 3–5 News  
4. **W5-10** — SMTP VPS  
5. **W6-02** — họp ký GĐ1 (SMTP PASS hoặc residual)  

**Dev resume khi có task ID + đầu vào.**

---

## 4. Definition of Done từng giai đoạn (nhắc nhanh)

| GĐ | DONE khi |
|----|----------|
| **GĐ1** | Kỹ thuật đã có + (SMTP PASS **hoặc** residual ký) + biên bản hai bên |
| **GĐ2** | CMS tối thiểu + UX P0=0 + media quyết định + smoke PASS + UAT ký + biên bản staging |
| **GĐ3** | Vận hành CMS/RBAC/đào tạo + NT tuần 12 |
| **GĐ4** | Keys + sandbox E2E + go-live |

---

## 5. Tracking

Sau mỗi wave xong: tick trong file này + cập nhật:

- [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md)  
- [GAP_GD1_GD2_BACKLOG.md](./GAP_GD1_GD2_BACKLOG.md)  
- [note.md](../note.md) (status dòng tương ứng)  
- [TEST_MATRIX.md](./TEST_MATRIX.md) (evidence)

---

*Plan sinh từ phân tích `note.md` — SMTP Owner bổ sung sau; Dev bám Wave 0→4 (+5a) trước.*
