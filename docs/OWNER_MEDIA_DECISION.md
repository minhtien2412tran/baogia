# Owner decision — Media (O5 / W4-04)

> Chọn **đúng một** phương án. Không tự mirror nếu chưa có quyền.

| Option | Mô tả | Hệ quả kỹ thuật |
|--------|--------|-----------------|
| **1** | Tiếp tục **hotlink** `jetvina.com` với xác nhận quyền | Giữ URL hiện tại · ghi nhận rủi ro phụ thuộc site ngoài |
| **2** | **Mirror** về CDN/storage JetBay sau khi xác nhận quyền | Chạy `pnpm sync:jetvina-media` / import pipeline · cắt hotlink |
| **3** | Thay bằng media **OWNED** của doanh nghiệp | Upload Admin Media · cập nhật CMS |

**Evidence audit 24/07 (sau mirror + scrub):** [MEDIA_AUDIT_20260724.md](./reviews/MEDIA_AUDIT_20260724.md)  
- `www.minhtien.online`: 93 refs (priority pages)  
- `jetvina.com` hotlink: **0**  
- Home `/assets/jetvina/mirror/`: 20 · Sample broken: 0  

---

## Quyết định đã ghi nhận

| Trường | Giá trị |
|--------|---------|
| **Option** | **2 — Mirror** |
| **Ngày** | 24/07/2026 |
| **Nguồn** | Owner chỉ thị chat session (W4-04) |
| **Quyền** | Owner xác nhận quyền sao chép/lưu trữ khi chọn phương án 2 |
| **Dev follow-up** | ✅ W4-05 mirror+approve · remote OFF · **hotlink scrub PASS** (`media-env` decouple + redeploy ~10:03 ICT) |

**Quyết định Owner:** **2** · Ngày: **24/07/2026** · Người ký: Anh Tuấn Anh (qua handoff chat)
