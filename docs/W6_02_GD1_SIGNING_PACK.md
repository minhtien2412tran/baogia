# W6-02 — Pack chuẩn bị ký nghiệm thu GĐ1

> **Ngày soạn:** 24/07/2026 · **Trạng thái SMTP prod:** vẫn **Mailpit catcher** (`SMTP_HOST=LOOPBACK`, `SMTP_ALLOW_CATCHER=true`) — **chưa** đủ W5-10  
> **Khuyến nghị:** họp ký theo **phương án B (residual SMTP)** trừ khi Owner hoàn tất SMTP thật trước họp

## 1. Tài liệu mang vào họp

| # | File | Mục đích |
|---|------|----------|
| 1 | [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md) | Biên bản ký (in / PDF) |
| 2 | [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) | DoD kỹ thuật + phụ lục residual SMTP |
| 3 | [TEST_MATRIX.md](./TEST_MATRIX.md) | Evidence smoke |
| 4 | [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md) | Việc còn mở sau GĐ1 |
| 5 | [OWNER_MEDIA_DECISION.md](./OWNER_MEDIA_DECISION.md) | Media option **2** đã ghi |

## 2. Checklist trước họp (15 phút)

- [ ] In / mở `GD1_NT_BIEN_BAN.md` — tick **Phương án B** (SMTP residual) **hoặc** A nếu đã có inbox proof
- [ ] Điền ngày họp + người tham dự
- [ ] Xác nhận URL demo: API / Swagger Basic / Admin / Web
- [ ] Không paste password vào biên bản

## 3. Đề xuất lịch (Owner chọn 1 slot)

| Slot | Ngày gợi ý | Giờ (ICT) | Hình thức |
|------|------------|-----------|-----------|
| A | ________ | 09:00–09:45 | Online |
| B | ________ | 14:00–14:45 | Online |
| C | ________ | 16:00–16:45 | Online / offline |

**Owner điền:** Slot đã chọn: ___ · Link họp: ________ · Người ký phía KH: ________

## 4. Diễn biến họp (30–45 phút)

1. Dev tóm tắt DoD GĐ1 (5 phút) — smoke 55/55, backup PASS  
2. Residual SMTP: đọc phụ lục · hai bên ký (hoặc show inbox nếu A)  
3. Media option 2 đã ghi nhận (thông tin)  
4. Ký biên bản GĐ1  
5. Next: GĐ2 UAT sau News / UX / SMTP  

## 5. Sau khi ký

Dev cập nhật:

- `GD1_SIGNOFF.md` — KH signed  
- `CONTINUE_AT_HOME.md` / `OWNER_HANDOFF_NEXT.md` — GĐ1 → `CLOSED — SIGNED-OFF`  
- `/baocaotiendo` (khi Owner yêu cầu)

**Không** ghi CLOSED trước khi có chữ ký.
