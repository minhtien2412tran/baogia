# Kịch bản sau họp — CR JETBAY-CR-2026-01

**Dùng cho:** Sau buổi họp với Anh Tuấn Anh (tiếp nhận yêu cầu bổ sung)  
**Biên bản:** [JETBAY_CR_2026_01.md](./JETBAY_CR_2026_01.md)  
**Báo cáo tiến độ:** [https://www.minhtien.online/baocaotiendo](https://www.minhtien.online/baocaotiendo)  
**Hợp đồng gốc:** [https://m-tien.com/jet-bay/](https://m-tien.com/jet-bay/) · 74TR · 16 tuần từ 09/07/2026  
**Ngày soạn:** 12/07/2026 · **Tuần dự án:** 2/16 · **Giai đoạn đang mở:** GĐ1

> **Nguyên tắc:**  
> 1. Tiếp nhận CR ≠ đã làm xong ≠ đã nằm trọn trong 74TR.  
> 2. Báo cáo tiến độ **không** tăng % vì CR — ghi *“đã tiếp nhận – đang phân tích – chờ xác nhận phạm vi”*.  
> 3. Không hứa DocuSign / phân quyền chi tiết / pricing engine trong tuần tới.  
> 4. GĐ1–GĐ4 theo HĐ gốc vẫn giữ lịch; CR có thể cần **phụ lục + điều chỉnh tiến độ**.

---

## 1. Một câu mở đầu (email / gọi lại sau họp)

> “Cảm ơn Anh đã chia sẻ yêu cầu bổ sung trong buổi họp. Em đã chuẩn hóa thành biên bản **JETBAY-CR-2026-01** (ngày 12/07). Hiện trạng: **đã tiếp nhận và đang phân tích ảnh hưởng** — chưa triển khai code các hạng mục mới. Trong 3–5 ngày làm việc em gửi Anh bảng phân loại phạm vi (trong 74TR / mở rộng / phụ lục DocuSign) kèm câu hỏi chốt công thức giá và dữ liệu cần Anh cung cấp. Tiến độ GĐ1 theo hợp đồng gốc vẫn tiếp tục; báo cáo tại baocaotiendo **không** ghi nhận các yêu cầu này là đã hoàn thành.”

---

## 2. Trạng thái nói với khách (đúng / sai)

| Được nói | Không nói |
|----------|-----------|
| Đã ghi nhận 12 nhóm yêu cầu vào biên bản CR | “Em làm luôn tuần này” |
| Đang phân tích DB / API / ảnh hưởng tiến độ | “Cái này đã có sẵn trong hệ thống” |
| Một phần liên quan module cũ, cần đánh giá khối lượng | “DocuSign nằm trong 74TR rồi” |
| DocuSign = tích hợp mới → phụ lục / xác nhận chi phí | “Giá ước tính / positioning đã xong” |
| Cần Anh xác nhận công thức + data + phụ lục trước khi code | “Phân quyền chi tiết xong rồi” |
| Empty Leg demo hiện **chưa** lọc châu lục | Tăng % báo cáo vì “nhận CR” |

**Câu chốt phạm vi:**

> “Việc tiếp nhận yêu cầu trong biên bản **chưa** đồng nghĩa toàn bộ nằm trong 74 triệu. Chỉ triển khai chính thức sau khi Anh xác nhận đặc tả, bên em đánh giá kỹ thuật, hai bên chốt phạm vi–tiến độ–chi phí, và ký phụ lục nếu cần.”

---

## 3. Phân loại 12 yêu cầu — cách trình bày sau họp

### Nhóm A — Mở rộng module đã có (cần đánh giá khối lượng, có thể ảnh hưởng 74TR / lịch)

| CR | Nội dung | Liên quan hệ hiện tại | Nói với KH |
|----|----------|----------------------|------------|
| 1 | Empty Leg theo châu lục | Web Empty Leg + Airport | “Bổ sung bộ lọc; demo hiện chưa có” |
| 2–3 | Giá theo giờ + positioning | Quote / search aircraft (v1 đơn giản) | “Đây là engine tính giá mới — không chỉ form báo giá” |
| 4 | Booking nhiều Flight Leg | Booking + QuoteLeg hiện có | “Mở rộng mô hình 1 booking – nhiều chặng nội bộ” |
| 5 | Vị trí MB + phí sân bay | Airport / Aircraft admin | “Cần data thực từ Anh (giá giờ, vị trí đậu)” |
| 10–12 | Permission + hủy tách + airport scope | JWT USER/ADMIN hiện tại | “Vượt role USER/ADMIN — RBAC chi tiết” |

### Nhóm B — Module nghiệp vụ mới (thường phát sinh / phụ lục)

| CR | Nội dung | Nói với KH |
|----|----------|------------|
| 6–8 | HĐ operator theo máy bay + mẫu + duyệt nội bộ | “Module hợp đồng nhà cung cấp — chưa có trong demo CMS hiện tại” |

### Nhóm C — Tích hợp bên thứ ba (bắt buộc phụ lục)

| CR | Nội dung | Nói với KH |
|----|----------|------------|
| 9 | DocuSign | “Báo giá gốc có xuất Word/PDF, **chưa** DocuSign. Phí tài khoản/envelope do Anh trả nhà cung cấp. Cần phụ lục + sandbox trước khi code.” |

---

## 4. Ảnh hưởng tiến độ (không báo vượt — báo rủi ro lịch)

| Lịch HĐ gốc | Việc CR ảnh hưởng | Cách nói |
|-------------|-------------------|----------|
| **GĐ1** tuần 1–4 | Không nhét CR lớn vào GĐ1 | “Tuần 2–4 vẫn đóng nền API theo HĐ; song song **phân tích CR**, chưa code CR nặng” |
| **GĐ2** tuần 5–8 Web | Empty Leg filter, disclaimer giá ước tính | “Có thể đưa **một phần** lọc châu lục vào GĐ2 **sau khi** chốt phạm vi” |
| **GĐ3** tuần 9–12 CMS | Aircraft location, airport fees, permission UI, contract draft | “Phần lớn admin CR phù hợp GĐ3 hoặc phụ lục” |
| **GĐ4** tuần 13–16 | DocuSign gần go-live; hoặc phụ lục sau | “DocuSign **không** mặc định vào GĐ4 trừ khi phụ lục đã ký” |

**Nếu KH hỏi “có trễ không?”**

> “Nếu Anh chốt nhanh công thức + data và chỉ lấy phần mở rộng vừa phải trong 74TR, có thể xếp vào GĐ2–GĐ3. Nếu làm full (pricing engine + HĐ operator + DocuSign + RBAC), cần **phụ lục và điều chỉnh tuần** — em sẽ nêu rõ số tuần ước lượng sau khi phân tích, không ước miệng trong họp.”

---

## 5. Việc cần Anh xác nhận trước (ưu tiên hỏi)

### P0 — Chốt nghiệp vụ (trước khi thiết kế sâu)

1. Công thức giá: có **bắt buộc** tính return/repositioning về căn cứ không?  
2. Danh sách phụ phí bắt buộc vs tùy chọn.  
3. Khách có được xem breakdown positioning không, hay **chỉ một tổng giá**?  
4. Quy tắc 1 máy bay – 1 HĐ operator khi đổi máy bay giữa chừng.  
5. Ai được duyệt HĐ / hủy booking / void DocuSign (tên vai trò).  

### P1 — Dữ liệu mẫu (để prototype)

6. 5–10 máy bay: hourly rate, base airport, current airport.  
7. 10–20 sân bay ưu tiên + continent/country + 1–2 mức phí mẫu.  
8. 1 mẫu HĐ operator (Word/PDF) + danh sách trường cần điền.  

### P2 — DocuSign (chỉ khi muốn phụ lục)

9. Sandbox DocuSign / Integration Key / ai trả phí envelope.  
10. Thứ tự ký (JetBay ↔ Operator ↔ …).  

### P3 — Phạm vi thương mại

11. Anh chọn: **(A)** chỉ mở rộng vừa trong 74TR · **(B)** full CR + phụ lục · **(C)** trì hoãn DocuSign sau go-live web.  

---

## 6. Kịch bản phát triển tiếp theo (nội bộ + nói với KH)

### Tuần 2–3 (ngay sau họp) — **không code CR nặng**

| Việc | Owner | Nói với KH |
|------|-------|------------|
| Gửi biên bản CR + link baocaotiendo | Dev | “Xin Anh đọc và góp ý chỉnh sửa biên bản” |
| Ma trận in-scope / out-scope / phụ lục (1 trang) | Dev | “Em gửi bảng phân loại trong 3–5 ngày” |
| Câu hỏi P0–P1 ở mục 5 | Dev → KH | “Cần Anh trả lời để chốt thiết kế” |
| Tiếp tục GĐ1 theo HĐ (API checklist, vận hành) | Dev | “Không dừng nền tảng vì CR” |
| **Không** tăng % trên baocaotiendo vì CR | Dev | Trạng thái: *đã tiếp nhận – đang phân tích* |

### Tuần 3–4 — đóng GĐ1 + chờ xác nhận CR

| Việc | Điều kiện |
|------|-----------|
| Nghiệm thu GĐ1 / đợt thanh toán 1 (30%) | Theo HĐ gốc — **không** phụ thuộc CR |
| Bản đánh giá kỹ thuật CR (effort, schema, rủi ro) | Sau khi KH trả lời P0 |
| Bản thảo phụ lục DocuSign + RBAC/HĐ (nếu chọn B) | Sau khi KH chọn A/B/C |

### Sau khi KH ký xác nhận CR / phụ lục

Thứ tự triển khai đề xuất (chỉ khi đã chốt):

```
Wave 1 — Data nền
  Airport continent/country/fees · Aircraft location + hourlyRate · seed mẫu

Wave 2 — Pricing & legs
  POST /pricing/estimate · Positioning + Passenger legs · disclaimer “giá ước tính”
  Empty Leg filter châu lục (web) · quyền airport scope (API)

Wave 3 — Admin ops
  UI vị trí MB · fees · permission override · cancel rights

Wave 4 — Operator contract
  Template · draft · approval workflow · audit

Wave 5 — DocuSign (phụ lục)
  Envelope · webhook · CoC · void theo quyền
```

Mỗi wave có DoD nghiệm thu riêng — **không** gộp “CR xong” một lần.

---

## 7. Checklist gửi KH sau họp (email)

**Tiêu đề gợi ý:** `[JetBay] Biên bản tiếp nhận yêu cầu bổ sung JETBAY-CR-2026-01 — chờ Anh xác nhận`

**Nội dung ngắn:**

1. Cảm ơn buổi họp; đính kèm / link biên bản CR.  
2. Trạng thái: **tiếp nhận – phân tích – chưa triển khai**.  
3. Nhắc: không tự động nằm hết trong 74TR; DocuSign = phụ lục.  
4. Xin Anh:  
   - Đọc biên bản, sửa chỗ hiểu sai trong **5 ngày làm việc**.  
   - Trả lời câu hỏi P0 (công thức giá, return leg, ai duyệt/hủy).  
   - Chọn hướng A / B / C (mục 5.P3).  
5. Bên em: trong **3–5 ngày** gửi bảng phân loại phạm vi + ước lượng ảnh hưởng lịch (không số tiền miệng nếu chưa tính).  
6. Link báo cáo tiến độ GĐ1: https://www.minhtien.online/baocaotiendo  

---

## 8. FAQ sau họp

### “Các yêu cầu này có làm ngay không?”

> “Em ghi nhận đầy đủ vào biên bản. Tuần này–tuần sau ưu tiên **chốt đặc tả và phân loại phạm vi**. Code chỉ mở khi Anh xác nhận và (nếu phát sinh) có phụ lục — tránh làm sai công thức giá rồi phải làm lại.”

### “Sao Empty Leg trên web chưa lọc châu lục?”

> “Đúng với hiện trạng demo: đang có list + form cơ bản. Lọc châu lục là hạng mục CR mới — sẽ xếp vào kế hoạch **sau khi** chốt phạm vi.”

### “DocuSign có trong 74TR không?”

> “Báo giá gốc có **xuất Word/PDF**. DocuSign là **ký điện tử bên thứ ba** — cần phụ lục, tài khoản sandbox của Anh, và Anh chịu phí envelope trừ khi thỏa thuận khác.”

### “Có làm chậm go-live không?”

> “GĐ1 theo lịch gốc vẫn chạy. Phần CR full có thể cần thêm tuần hoặc tách phụ lục sau go-live web — em sẽ nêu rõ sau đánh giá, không ước miệng.”

### “Phân quyền USER/ADMIN hiện tại đủ chưa?”

> “Đủ cho bản demo GĐ1. Yêu cầu INHERIT/ALLOW/DENY và phạm vi sân bay là **RBAC mới** — thuộc CR, chưa coi là đã có.”

---

## 9. Việc nội bộ tuần này (dev)

- [ ] Gửi KH biên bản [JETBAY_CR_2026_01.md](./JETBAY_CR_2026_01.md) (PDF/email)  
- [ ] Soạn bảng 1 trang: In-scope nghi vấn / Out-scope / Phụ lục DocuSign  
- [ ] Map CR → Prisma hiện tại (Airport, Booking, QuoteLeg, Operator…) — gap list  
- [ ] **Không** merge feature CR lớn vào `main` trước khi KH xác nhận  
- [ ] Giữ baocaotiendo: không tăng %; có thể thêm dòng “CR 2026-01: đã tiếp nhận” (optional)  
- [ ] Tiếp tục GĐ1 / polish web theo [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md)  
- [ ] Nhắc DocuSign + G4 keys vào backlog phụ lục, không nhầm với [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md) (SMTP/pay)

---

## 10. Câu kết buổi follow-up

> “Tóm lại: biên bản **JETBAY-CR-2026-01** đã ghi nhận đủ yêu cầu Anh nêu. Trạng thái hiện tại là **chờ Anh xác nhận đặc tả và hướng phạm vi (A/B/C)**. Trong lúc đó bên em **không dừng** lộ trình GĐ1 theo hợp đồng 74TR, và **không** báo các hạng mục CR là đã xong trên báo cáo tiến độ. Khi Anh chốt, em gửi kế hoạch wave 1–5 kèm điều kiện phụ lục nếu có.”

---

## Phụ lục — Link nhanh

| Tài liệu | URL / path |
|----------|------------|
| Biên bản CR | [docs/JETBAY_CR_2026_01.md](./JETBAY_CR_2026_01.md) |
| Kịch bản họp tiến độ (trước) | [KH_KICH_BAN_HOP_TIENDO.md](./KH_KICH_BAN_HOP_TIENDO.md) |
| Báo cáo KH | https://www.minhtien.online/baocaotiendo |
| Báo giá 74TR | https://m-tien.com/jet-bay/ |
| Work plan | [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md) |

---

*Nội bộ Minh Tiến Solutions — cập nhật sau mỗi lần KH phản hồi CR.*
