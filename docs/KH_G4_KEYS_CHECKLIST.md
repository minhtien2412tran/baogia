# Checklist keys GĐ4 — gửi khách hàng

**Dự án:** JetBay 74TR · **Giai đoạn:** 4 (tuần 13–16)  
**Dev đã sẵn sàng code** — cần thông tin từ phía Anh để bật tích hợp thật.

Gửi checklist này **từ tuần 6** để tránh trễ go-live.

---

## 1. Email (SMTP production)

| Mục | Anh cung cấp |
|-----|----------------|
| SMTP host | |
| Port (587/465) | |
| Username / password | |
| From address (vd. `noreply@domain.com`) | |
| SPF/DKIM đã trỏ DNS? | ☐ |

## 2. Thanh toán (chọn ưu tiên 1–2 cổng)

| Cổng | Sandbox keys | Live keys (sau UAT) |
|------|--------------|---------------------|
| Stripe | Secret key + webhook secret | |
| OnePay | Merchant ID + access code + secure secret | |
| 9Pay | Merchant key + secret | |

**Cần:** 1 giao dịch sandbox thành công trước go-live.

## 3. Đăng nhập mở rộng (tuỳ chọn)

| Provider | Cần |
|----------|-----|
| Google OAuth | Client ID + redirect URI verify |
| Apple Sign In | Service ID + key |
| SMS OTP | Provider API key + sender name |

*Nếu chưa có: go-live với email/password vẫn được theo hợp đồng.*

## 4. PDF / Word charter

| Mục | Anh xác nhận |
|-----|----------------|
| Mẫu điều khoản / logo | |
| Ngôn ngữ ưu tiên (EN / VI) | |
| 1 booking UAT để xuất thử | |

---

## Liên hệ kỹ thuật

- API integrations status: https://api.minhtien.online/integrations/status  
- Swagger: https://docs.minhtien.online/swagger  

Chi tiết kỹ thuật: [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md)
