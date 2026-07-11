# Kịch bản họp khách — JetBay 74TR

**Dùng cho:** Buổi trao đổi tiến độ với Anh Tuấn Anh  
**Tham chiếu báo cáo công khai:** [https://www.minhtien.online/baocaotiendo](https://www.minhtien.online/baocaotiendo)  
**Hợp đồng / báo giá:** [https://m-tien.com/jet-bay/](https://m-tien.com/jet-bay/)  
**Ngày soạn:** 12/07/2026 · **Tuần dự án:** 2/16 · **Giai đoạn đang mở:** GĐ1 (tuần 1–4)

> **Nguyên tắc nói chuyện:** Bám đúng số liệu trên trang báo cáo. Phần “xem trước” trên web/admin **không** đồng nghĩa nghiệm thu GĐ2/GĐ3. Không dùng từ “gần xong”, “80%”, “sắp bàn giao” trừ khi đúng mốc HĐ.

---

## 1. Một câu mở đầu (30 giây)

> “Kính gửi Anh Tuấn Anh, dự án JetBay chính thức khởi động từ **09/07/2026**, thực hiện trong **4 tháng / 16 tuần** theo gói **74 triệu (chưa VAT)**. Tuần đầu chúng tôi tập trung **dựng nền Backend và môi trường kiểm thử riêng** trên VPS. Tiến độ tổng thể trên báo cáo là **khoảng 8%** — cố ý giữ đúng nhịp hợp đồng, chưa tính nghiệm thu các giai đoạn Web hoàn thiện, CMS vận hành hay thanh toán online. Anh có thể xem báo cáo chi tiết tại **minhtien.online/baocaotiendo**.”

---

## 2. Con số cần nhớ (đúng báo cáo — không vượt)

| Chỉ số | Giá trị nói với khách | Ghi chú nội bộ |
|--------|----------------------|----------------|
| Tiến độ tổng thể | **~8%** / 4 tháng | Theo lịch HĐ, không phải % code |
| Tuần hiện tại | **Tuần 1–2 / 16** | Báo cáo web ghi tuần 1; họp có thể nói “đang vào tuần 2” |
| Giai đoạn đang làm | **GĐ1** — Khởi động & dựng nền | GĐ2–GĐ4: **chưa tới hạn nghiệm thu** |
| GĐ1 hoàn thành (trong báo cáo) | **~28%** của giai đoạn 1 | Chưa kết thúc GĐ1 — dự kiến cuối tuần 4 |
| Backend (BE) | **~22%** / cả lộ trình | Đang phát triển |
| Website (WEB) | **~12%** / cả lộ trình | Bản xem trước, chưa nghiệm thu GĐ2 |
| Admin/CMS (ADM) | **~10%** / cả lộ trình | Khung thử nghiệm nội bộ |
| Auth | **~18%** / cả lộ trình | Email/password; OAuth/SMS = GĐ4 |
| Thanh toán / PDF | **~5%** — chưa tới hạn | Chờ keys & UAT cuối dự án |

---

## 3. Kịch bản theo từng phần (10–15 phút)

### 3.1 Vì sao làm Backend trước?

**Nói:**

> “Theo hợp đồng, Backend là bước đầu để Web, Dashboard và app sau này dùng **một API chung**. Nếu làm giao diện trước khi API ổn định, sau này phải nối lại và dễ lệch nghiệp vụ. Tuần đầu Anh đã có thể xem **xương sống** hệ thống thay vì chờ đến cuối mới thấy sản phẩm.”

**Chỉ demo / nhắc URL (không claim nghiệm thu):**

- API health: https://api.minhtien.online/health  
- Swagger: https://docs.minhtien.online/swagger  

**Đã làm (tuần đầu — đúng báo cáo):**

- Máy chủ API riêng HTTPS  
- Database riêng `jetbay_db`, tách hệ thống cũ trên VPS  
- Khung JWT + tài liệu Swagger  

**Còn lại / chưa tới hạn:**

- Hoàn thiện nghiệp vụ theo từng giai đoạn  
- Siết cấu hình vận hành (backup, checklist an toàn)  
- Tích hợp thanh toán / SMS / email → **GĐ4, chờ thông tin phía Anh**

---

### 3.2 Website — “xem trước”, chưa phải bàn giao GĐ2

**Nói:**

> “Chúng tôi đã dựng **bản web xem trước** tại minhtien.online để Anh góp ý hướng giao diện sớm. Một số trang đã nối thử API — đây là **mức kiểm thử nội bộ**, **chưa phải** bản nghiệm thu Giai đoạn 2 (mốc tháng 2 theo lộ trình HĐ và thanh toán đợt 2).”

**URL demo:** https://www.minhtien.online/en-us  

**Gợi ý demo ngắn (2–3 phút):**

1. Trang chủ — Hero, khu vực sản phẩm (Fixed Price, Empty Leg…)  
2. Một trang commercial — ví dụ Fixed Price  
3. (Tuỳ chọn) Đổi ngôn ngữ — giải thích: *“đang chuẩn bị đa ngôn ngữ, nghiệm thu khi GĐ2”*

**Không nói:**

- “Web gần xong” / “clone xong 70%”  
- “Đủ điều kiện nghiệm thu đợt 2”

**Nói đúng:**

> “Phần còn lại của Web — chỉnh sát mẫu jet-bay.com, responsive toàn site, quote widget ổn định — sẽ **đẩy mạnh trong GĐ2**, tuần 5–8.”

---

### 3.3 Admin / CMS — khung thử, chưa vận hành

**Nói:**

> “Cổng admin tại admin.minhtien.online phục vụ **đội nội bộ kiểm tra** quyền USER/ADMIN và luồng dữ liệu. Đã có form chỉnh giá Fixed Price theo tier — **phục vụ thử nghiệm**, **chưa** bàn giao CMS vận hành (GĐ3, tháng 3 theo lịch HĐ).”

**URL:** https://admin.minhtien.online/login  
**Tài khoản demo:** `admin@jetbay.local` / `Admin123!`

---

### 3.4 Đăng nhập & phân quyền

**Nói:**

> “Đã có đăng ký / đăng nhập email–mật khẩu và tách quyền user thường vs quản trị. Google, Apple, SMS OTP nằm ở **Giai đoạn 4** — cần Anh cung cấp thông tin nhà cung cấp khi tới lịch; nếu chưa có vẫn go-live được với email/password theo hợp đồng.”

**Demo user:** https://www.minhtien.online/en-us/login — `demo@jetbay.local` / `Demo123!`

---

### 3.5 Thanh toán & xuất tài liệu — chưa mở

**Nói:**

> “Khung mã nguồn thanh toán (Stripe / OnePay / 9Pay) và xuất PDF/Word đã **chuẩn bị sơ bộ** nhưng **chưa bật** giao dịch thật, **chưa UAT**. Phần này theo lịch **tháng 4 / GĐ4**, phụ thuộc khóa merchant và mẫu giấy tờ Anh xác nhận. Phí cổng thanh toán do Bên A chi trả nhà cung cấp — ngoài 74 triệu triển khai.”

**URL trạng thái (nếu Anh hỏi kỹ thuật):** https://api.minhtien.online/integrations/status  

---

## 4. Bốn giai đoạn hợp đồng — cách trình bày

| GĐ | Tuần | % HĐ | Trạng thái nói với KH | Mốc thanh toán |
|----|------|------|----------------------|----------------|
| **GĐ1** | 1–4 | 25% | **Đang triển khai** (~28% trong giai đoạn) | **Đợt 1: 30%** — cuối tuần 4, khi nghiệm thu GĐ1 |
| **GĐ2** | 5–8 | 25% | Chuẩn bị sớm web xem trước; **nghiệm thu tháng 2** | **Đợt 2: 30%** |
| **GĐ3** | 9–12 | 25% | Admin khung thử; **CMS vận hành tháng 3** | **Đợt 3: 30%** |
| **GĐ4** | 13–16 | 25% | Chưa mở; chờ keys KH | **Đợt 4: 10%** — go-live |

**Câu chốt:**

> “Mỗi giai đoạn ~25% giá trị HĐ. Hiện chỉ **GĐ1 đang mở**. Dù Anh thấy web/admin live sớm, **nghiệm thu và thanh toán** vẫn theo đúng mốc từng giai đoạn — tránh hiểu nhầm tiến độ.”

---

## 5. Việc không nằm trong 74TR (tránh tranh luận scope)

Nói rõ nếu Anh hỏi App mobile / hosting / VAT:

| Hạng mục | Trả lời ngắn |
|----------|--------------|
| App React Native 248TR | Gói **riêng**, chưa trong tiến độ Web 4 tháng |
| Phí VPS, tên miền, SMS, merchant | **Bên A** chi nhà cung cấp; bên em làm phần kỹ thuật trong 74TR |
| VAT 10% | **Chưa** gồm trong 74.000.000 VNĐ |

---

## 6. Câu hỏi khách hay hỏi — gợi ý trả lời

### “Sao web nhìn đã có nhiều trang rồi mà báo cáo chỉ 8%?”

> “8% là **theo lịch 4 tháng và mốc nghiệm thu**, không phải số trang đã dựng. Web live là **xem trước** để Anh góp ý sớm; phần hoàn thiện sát mẫu, responsive và nghiệm thu staging thuộc **GĐ2**.”

### “Backend xong chưa?”

> “Tuần đầu đã có API, database, JWT và Swagger — **đúng hướng GĐ1**. GĐ1 **chưa kết thúc**; còn hoàn thiện checklist, siết vận hành và **nghiệm thu cuối tuần 4** trước khi coi là đóng giai đoạn 1.”

### “Khi nào thanh toán online chạy được?”

> “Theo HĐ khoảng **tháng 4 / GĐ4**. Cần Anh chọn cổng ưu tiên (Stripe / OnePay / 9Pay) và cung cấp khóa sandbox. Em sẽ gửi checklist từ **tuần 6** để không trễ go-live.”

### “App điện thoại khi nào?”

> “App 248TR là **gói riêng**. API hiện tại đã có Swagger/OpenAPI để sau này app nối vào — nhưng **chưa kick-off app** trong phạm vi 74TR.”

### “Hệ thống cũ trên VPS có bị ảnh hưởng không?”

> “JetBay chạy **tách biệt**: API, DB `jetbay_db`, port và cấu hình riêng — **không đụng** hệ thống đang phục vụ khách khác.”

---

## 7. Việc cần Anh phối hợp (tuần 2 → tuần 6)

**Tuần 2–4 (ưu tiên góp ý, không bắt buộc keys):**

1. Xem web/API/admin và **góp ý hướng giao diện** trang ưu tiên tháng 2  
2. Phản hồi nếu muốn **điều chỉnh thứ tự** trang (Home → Commercial → Charter ×6…)  
3. Chuẩn bị dần **nội dung thật** (ảnh, copy About Us, charter…) — dùng cho GĐ2–GĐ3  

**Từ tuần 6 (chuẩn bị GĐ4 — chưa cần gấp tuần 2):**

- Checklist SMTP, cổng thanh toán, OAuth/SMS — xem [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md)  
- Xác nhận mẫu điều khoản / logo cho xuất PDF booking  

---

## 8. Kịch bản phát triển tiếp theo (nội bộ — khớp báo cáo & HĐ)

> Phần này dùng khi Anh hỏi *“tuần tới em làm gì?”* — nói theo **lịch HĐ**, không hứa giao sớm nghiệm thu.

### Tuần 2–3 (vẫn trong GĐ1 + chuẩn bị GĐ2)

| Việc | Mục tiêu với KH | Ghi chú nghiệm thu |
|------|-----------------|-------------------|
| Hoàn thiện nhóm API cốt lõi (quote, sản phẩm, nội dung) | “Siết checklist GĐ1” | Thuộc GĐ1, không tính GĐ2 |
| Siết vận hành prod (env, backup, an toàn cơ bản) | “Ổn định môi trường trước nghiệm thu” | GĐ1 |
| Chuẩn bị web: tin tức, newsletter, hiển thị giá FP | “Anh xem và góp ý sớm” | **Nội bộ** — chưa nghiệm thu GĐ2 |
| Polish charter ×6 vs mẫu | “Cải thiện dần giao diện dịch vụ” | GĐ2 prep |
| Cập nhật báo cáo `/baocaotiendo` hàng tuần | Minh bạch tiến độ | — |

### Tuần 4 — đóng GĐ1 (mốc đợt thanh toán 1)

| Việc | Deliverable với KH |
|------|-------------------|
| Nghiệm thu kết thúc GĐ1 | Biên bản: ERD/spec, môi trường ổn định, API + seed + smoke |
| Trình ký & thu **30% đợt 1** | Theo điều kiện HĐ — sau nghiệm thu GĐ1 |

*(Nội bộ: tham chiếu [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) — **chỉ trình ký khi hai bên thống nhất mở nghiệm thu**, không ép sớm trên giấy.)*

### Tuần 5–8 — GĐ2 Website công khai (mốc đợt 2)

| Việc | Mục tiêu nghiệm thu |
|------|---------------------|
| Hoàn thiện giao diện theo mẫu jet-bay.com | Visual parity + responsive |
| Quote widget ổn định end-to-end | Form → API → admin nhận lead |
| Home + commercial + content + account flows | Staging Frontend |
| **Nghiệm thu GĐ2** | Mốc **30% đợt 2** |

### Tuần 9–12 — GĐ3 API hoàn thiện & CMS vận hành

| Việc | Mục tiêu nghiệm thu |
|------|---------------------|
| CRUD/CMS đầy đủ, quy trình báo giá → offer | Vận hành thật |
| Tài liệu hướng dẫn admin cho Anh | Bàn giao vận hành |
| Nội dung CMS từ phía Anh | Thay seed demo |
| **Nghiệm thu GĐ3** | Mốc **30% đợt 3** |

### Tuần 13–16 — GĐ4 Go-live

| Việc | Phụ thuộc |
|------|-----------|
| Stripe / OnePay / 9Pay sandbox → live | Keys KH |
| Google / Apple / SMS OTP (tuỳ chọn) | Config KH |
| SMTP production + email transaction | DNS / SMTP KH |
| UAT PDF/Word + go-live cứng | Mẫu + 1 booking thử |
| **Nghiệm thu GĐ4** | Mốc **10% đợt 4** |

---

## 9. Checklist trước / trong / sau buổi họp

### Trước họp

- [ ] Mở sẵn tab: [báo cáo](https://www.minhtien.online/baocaotiendo) · [web](https://www.minhtien.online/en-us) · [admin](https://admin.minhtien.online/login) · [Swagger](https://docs.minhtien.online/swagger)  
- [ ] Kiểm tra demo login admin + user  
- [ ] In hoặc share link báo cáo — **không** gửi slide % code nội bộ  

### Trong họp (thứ tự gợi ý ~20 phút)

1. Mở đầu + con số **8%** / GĐ1 (2 phút)  
2. Chia sẻ màn hình báo cáo `/baocaotiendo` (3 phút)  
3. Demo API Swagger + web xem trước (5 phút)  
4. Demo admin (tuỳ chọn, 3 phút)  
5. Giải thích 4 giai đoạn + mốc thanh toán (3 phút)  
6. Việc cần Anh phối hợp + Q&A (5 phút)  

### Sau họp

- [ ] Ghi nhận góp ý giao diện / ưu tiên trang  
- [ ] Email tóm tắt + link báo cáo  
- [ ] Lên lịch cập nhật báo cáo tuần 3  
- [ ] (Tuần 6) Gửi [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md)  

---

## 10. Câu kết (15 giây)

> “Tóm lại: tuần đầu và đang vào tuần 2, chúng tôi **dựng nền Backend và môi trường xem trước** đúng thứ tự hợp đồng. Tiến độ báo cáo **~8%** — Anh theo dõi định kỳ tại **baocaotiendo**. Tuần tới em tiếp tục **GĐ1**, chuẩn bị thêm web để Anh góp ý, và **cuối tuần 4** mới mở **nghiệm thu Giai đoạn 1**. Cảm ơn Anh.”

---

## Phụ lục — Link nhanh

| Vai trò | URL |
|---------|-----|
| Báo cáo tiến độ KH | https://www.minhtien.online/baocaotiendo |
| Web xem trước | https://www.minhtien.online/en-us |
| API | https://api.minhtien.online |
| Swagger | https://docs.minhtien.online/swagger |
| Admin | https://admin.minhtien.online/login |
| Báo giá 74TR | https://m-tien.com/jet-bay/ |
| Báo giá App (ngoài scope) | https://m-tien.com/app-jetbay/ |

**Tài khoản demo**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jetbay.local | Admin123! |
| User | demo@jetbay.local | Demo123! |

---

*Tài liệu nội bộ — bám [progress-report.ts](../apps/web/src/app/baocaotiendo/progress-report.ts) và [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md). Cập nhật sau mỗi buổi họp tuần.*
