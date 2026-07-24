# Owner input forms — paste vào chat

> **Cập nhật:** 24/07/2026 · SMTP W5-10 **PASS** · GĐ1 ký = **phương án A**  
> Copy đúng block, điền chỗ trống, gửi lại với **task ID** ở dòng đầu.  
> Đã PASS (không cần gửi lại): W5-10 · Media Option 2 · Contact 200 · hotlink scrub.

---

## W5-11 — Xác nhận inbox Quote #61 / #62

Mở hộp thư nhận mail quote (inbox + Spam). Chọn đúng 1 giá trị mỗi dòng.

```text
W5-11 INBOX
Quote #61: SEEN|SPAM|NOT_SEEN
Quote #62: SEEN|SPAM|NOT_SEEN
Sender OK: YES|NO
Subject OK: YES|NO
Reply-To OK: YES|NO
Links OK: YES|NO
No internal leak: YES|NO
Screenshot: (che PII) attached|link|none
```

Sau khi Owner gửi block này → Dev chạy W5-12…13 rồi W5-14.

---

## W6-02 — Đặt lịch họp ký GĐ1 (phương án A)

Pack: [W6_02_GD1_SIGNING_PACK.md](./W6_02_GD1_SIGNING_PACK.md) · Biên bản: [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md)

```text
W6-02 SIGNING
Slot: A|B|C
Ngày: YYYY-MM-DD
Giờ: HH:MM ICT
Hình thức: online|offline
Link họp: 
Người ký KH: Anh Tuấn Anh
Inbox mail Quote #61/#62: SEEN|SPAM|NOT_SEEN
Ghi chú: 
```

---

## W2-05 — News (3–5 bài)

Mỗi bài một block (lặp lại). Chi tiết field: [CMS_NEWS_TEMPLATE.md](./CMS_NEWS_TEMPLATE.md)

```text
W2-05 NEWS
---
#1
Locale: en
Title: 
Slug: 
Excerpt: 
Body: 
(paste HTML hoặc plain; ≥200 từ khuyến nghị)
Featured image: URL hoặc “gửi file riêng”
Alt: 
SEO title: 
SEO description: 
Publish date: YYYY-MM-DD
Image rights: OWNED|LICENSED|CLIENT_PROVIDED
VI translation: YES|NO
(Nếu YES: Title VI / Excerpt VI / Body VI)
---
#2
...
---
#3
...
```

Tối thiểu **3 bài** để đạt DoD GĐ2 CMS. Dev không tự viết nội dung thương mại.

---

## W3-06 — UX feedback (tối đa 10 điểm)

```text
W3-06 UX
---
1.
URL: https://www.minhtien.online/en-us/...
Vị trí: (hero / form / footer / …)
Hiện tại: 
Mong muốn: 
Ảnh: (link hoặc đính kèm)
Ưu tiên: P0|P1|P2
---
2.
URL: 
Vị trí: 
Hiện tại: 
Mong muốn: 
Ảnh: 
Ưu tiên: 
---
```

Sau khi nhận, Dev: phân loại → polish → gửi ảnh trước/sau.

Tham chiếu nhanh: https://www.minhtien.online/en-us · https://www.minhtien.online/en-us/contact

---

## Thứ tự gợi ý

1. **W5-11** xác nhận inbox (mở khóa W5-12…14)  
2. **W6-02** đặt lịch ký GĐ1 (SMTP đã xong)  
3. **W2-05** / **W3-06** gửi song song (không chặn họp GĐ1)  
4. Sau ký GĐ1 → Dev publish News + polish UX → UAT GĐ2
