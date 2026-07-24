# W6-02 — Pack chuẩn bị ký nghiệm thu GĐ1

> **Ngày cập nhật:** 24/07/2026 ~10:57 · **SMTP prod:** **PASS** (T-S4-01)  
> **Khuyến nghị họp:** **Phương án A** — không cần residual SMTP

## 1. Tài liệu mang vào họp

| # | File | Mục đích |
|---|------|----------|
| 1 | [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md) | Biên bản ký (in / PDF) — tick **A** |
| 2 | [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) | DoD kỹ thuật + SMTP PASS |
| 3 | [TEST_MATRIX.md](./TEST_MATRIX.md) | Evidence smoke + mail #61/#62 |
| 4 | [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md) | Việc còn mở sau GĐ1 (News / UX) |
| 5 | [OWNER_MEDIA_DECISION.md](./OWNER_MEDIA_DECISION.md) | Media option **2** đã ghi |
| 6 | [OWNER_INPUT_FORMS.md](./OWNER_INPUT_FORMS.md) | Form paste News + UX (song song) |

## 2. Checklist trước họp (15 phút)

- [x] SMTP: `integrations.smtp=true` · `smtpCatcher=false` (24/07 ~10:51)
- [x] Mail smoke: quote **#61** + contact **#62** — EmailService sent
- [ ] Owner xác nhận thấy thư trong Gmail (hoặc Spam) — ghi ngày trên biên bản
- [ ] In / mở `GD1_NT_BIEN_BAN.md` — tick **Phương án A**
- [ ] Điền ngày họp + người tham dự
- [ ] Xác nhận URL: API / Swagger Basic / Admin / Web
- [ ] Không paste password vào biên bản

## 3. Đề xuất lịch (Owner chọn 1 slot)

| Slot | Ngày gợi ý | Giờ (ICT) | Hình thức |
|------|------------|-----------|-----------|
| A | ________ | 09:00–09:45 | Online |
| B | ________ | 14:00–14:45 | Online |
| C | ________ | 16:00–16:45 | Online / offline |

**Owner điền (chat hoặc reply):**

```text
W6-02 SIGNING
Slot: A|B|C
Ngày: YYYY-MM-DD
Giờ: HH:MM ICT
Hình thức: online|offline
Link họp: ...
Người ký KH: ...
Inbox mail #61/#62: SEEN|SPAM|NOT_SEEN
```

## 4. Diễn biến họp (30–45 phút) — Phương án A

1. Dev tóm tắt DoD GĐ1 (5 phút) — smoke 55/55, backup PASS, SMTP PASS  
2. Show evidence mail / TEST_MATRIX (không mở password)  
3. Media option 2 đã ghi nhận (thông tin)  
4. Ký biên bản GĐ1 — **đóng GĐ1**  
5. Next song song: News (W2-05) · UX (W3-06) · UAT GĐ2 sau đó  

## 5. Sau khi ký

Dev cập nhật:

- `GD1_SIGNOFF.md` — KH signed + ngày  
- `CONTINUE_AT_HOME.md` / `OWNER_HANDOFF_NEXT.md` — GĐ1 → `CLOSED — SIGNED-OFF`  
- `/baocaotiendo` (khi Owner yêu cầu)

**Không** ghi CLOSED trước khi có chữ ký.
