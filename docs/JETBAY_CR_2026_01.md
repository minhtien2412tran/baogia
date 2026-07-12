# BIÊN BẢN TIẾP NHẬN VÀ ĐẶC TẢ YÊU CẦU BỔ SUNG

## DỰ ÁN JETBAY – HỆ THỐNG ĐẶT CHUYẾN BAY TƯ NHÂN

| | |
|--|--|
| **Mã tài liệu** | JETBAY-CR-2026-01 |
| **Phiên bản** | 1.0 |
| **Ngày lập** | 12/07/2026 |
| **Đơn vị thực hiện** | Minh Tiến Solutions |
| **Loại tài liệu** | Yêu cầu thay đổi và bổ sung nghiệp vụ |
| **Trạng thái** | Chờ khách hàng xác nhận |

**Trạng thái kỹ thuật (2026-07-12):** Wave 1–5 BE trên nhánh `feat/api-cr-wave3-contracts-rbac-docusign` (kế thừa Wave1–2): Airport/fleet/pricing · Empty Leg filter + airport scope · OperatorContract + duyệt · DocuSign **mock** (envelope/webhook/CoC) · UserPermissionOverride. Live DocuSign / FE — chờ phụ lục + sandbox KH.

**Kịch bản sau họp:** [KH_KICH_BAN_SAU_HOP_CR.md](./KH_KICH_BAN_SAU_HOP_CR.md) · **Báo cáo tiến độ:** https://www.minhtien.online/baocaotiendo

---

# 1. Mục đích tài liệu

Tài liệu này ghi nhận và chuẩn hóa các yêu cầu mới do khách hàng cung cấp trong quá trình triển khai dự án JetBay.

Các yêu cầu tập trung vào:

1. Tìm kiếm chuyến bay chân trống theo châu lục.
2. Tính giá chuyến bay ước tính theo giờ khai thác.
3. Tính cả chi phí điều máy bay từ sân bay đang đậu đến điểm đón khách.
4. Gộp nhiều chặng khai thác thành một chuyến và một báo giá cho khách hàng.
5. Quản lý hợp đồng riêng với hãng hoặc đơn vị khai thác theo từng máy bay.
6. Tích hợp ký điện tử qua DocuSign.
7. Duyệt hợp đồng nội bộ trước khi gửi ký.
8. Phân quyền hủy riêng cho từng người dùng.
9. Quản lý vị trí máy bay đang đậu tại từng sân bay.
10. Phân quyền phạm vi sân bay mà từng người dùng được xem.

Tài liệu này là cơ sở để:

* Xác nhận lại đúng yêu cầu của khách hàng.
* Phân tích ảnh hưởng đến hệ thống hiện tại.
* Thiết kế cơ sở dữ liệu, API và giao diện.
* Lập kế hoạch phát triển và kiểm thử.
* Xác định hạng mục thuộc phạm vi hiện tại và hạng mục có thể phát sinh.
* Lập phụ lục hợp đồng hoặc báo giá bổ sung nếu cần.

---

# 2. Căn cứ hiện trạng dự án

## 2.1. Phạm vi báo giá hiện tại

Báo giá hiện tại có tổng giá trị 74.000.000 VNĐ, bao gồm các nhóm chính:

* Backend API và cơ sở dữ liệu.
* Website công khai.
* Bảng quản trị và CMS.
* Đăng nhập và xác thực.
* Tích hợp thanh toán cơ bản.
* Xuất tài liệu Word/PDF.
* Thời gian triển khai dự kiến 16 tuần.
* Bảo hành 12 tháng.

Tích hợp ký điện tử DocuSign chưa được thể hiện rõ thành một hạng mục riêng trong phạm vi báo giá hiện tại. Vì vậy, phần DocuSign cần được phân tích và xác nhận riêng trước khi đưa vào phạm vi chính thức.

## 2.2. Tiến độ hiện tại

Dự án bắt đầu ngày 09/07/2026 và hiện đang trong Giai đoạn 1.

Các phần đã có khung ban đầu gồm:

* Backend API.
* Cơ sở dữ liệu.
* Đăng nhập JWT.
* Swagger/OpenAPI.
* Website xem thử.
* Admin xem thử.
* Các API sản phẩm, nội dung và báo giá đang tiếp tục hoàn thiện.

Các chức năng CMS đầy đủ, quy trình duyệt, xuất tài liệu và thanh toán vẫn nằm ở các giai đoạn tiếp theo.

## 2.3. Hiện trạng bản demo

Trang Empty Leg hiện có:

* Điểm khởi hành.
* Điểm đến.
* Ngày khởi hành.
* Số lượng hành khách.
* Danh sách chuyến bay chân trống đang có.

Chưa thấy chức năng tìm kiếm hoặc phân nhóm Empty Leg theo châu lục.

Quy trình đặt chuyến hiện được mô tả gồm:

1. Khách gửi yêu cầu.
2. JetBay tạo báo giá phù hợp.
3. Khách xác nhận, ký thỏa thuận và thanh toán.
4. JetBay tổ chức chuyến bay.

Yêu cầu mới sẽ mở rộng bước báo giá, hợp đồng và phê duyệt nội bộ của quy trình này.

---

# 3. Thuật ngữ sử dụng

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| **Booking** | Một yêu cầu/đơn đặt chuyến; có thể nhiều chặng nội bộ nhưng một gói với khách |
| **Flight Leg** | Một chặng bay cụ thể (A → B) |
| **Positioning Leg** | Chặng điều máy bay từ nơi đậu đến điểm đón (có thể không có khách) |
| **Passenger Leg** | Chặng bay có hành khách |
| **Empty Leg** | Chặng trống / ưu đãi |
| **Operator** | Hãng bay hoặc đơn vị khai thác |
| **Giá ước tính** | Giá sơ bộ; chưa chính thức đến khi hãng/thẩm quyền xác nhận |

---

# 4–15. Tóm tắt 12 nhóm yêu cầu

Chi tiết đầy đủ giữ nguyên theo biên bản họp (mục 4–15). Tóm tắt vận hành:

| # | Nhóm | Ý chính |
|---|------|---------|
| 1 | Empty Leg theo châu lục | Lọc continent → country → city → airport; cascade + quyền xem |
| 2 | Giá theo giờ | Hourly rate × giờ khai thác + phí cố định/sân bay/… |
| 3 | Positioning từ nơi đậu | Ví dụ CAN→HAN→SGN; không chỉ tính HAN→SGN |
| 4 | Booking nhiều chặng | 1 mã/1 giá với KH; nhiều Flight Leg nội bộ |
| 5 | Airport + vị trí MB | Fees, currentAirport, available aircraft |
| 6 | HĐ riêng theo máy bay | 1 aircraft → 1 operator contract |
| 7 | HĐ từ mẫu | Template + auto-fill + DRAFT |
| 8 | Duyệt HĐ nội bộ | Chỉ APPROVED mới gửi DocuSign |
| 9 | DocuSign | Envelope, webhook, CoC — **phụ lục riêng** |
| 10 | Permission override | INHERIT / ALLOW / DENY per user |
| 11 | Quyền hủy tách | booking/quote/contract/flight… + audit |
| 12 | Airport scope | ALL / continent / country / list / none |

---

# 16. Luồng nghiệp vụ tổng thể (12 bước)

1. KH gửi yêu cầu → 2. Tìm MB → 3. Tạo hành trình (positioning + passenger) → 4. Giá ước tính → 5. Báo giá → 6. Duyệt giá nội bộ → 7. KH xác nhận → 8. Tạo HĐ operator → 9. Duyệt HĐ → 10. DocuSign → 11. Theo dõi ký → 12. Hoàn tất hồ sơ + cập nhật vị trí MB.

---

# 17–18. DB & API (đề xuất)

Xem chi tiết trong bản đầy đủ họp. Thực thể chính: Airport mở rộng, Aircraft (location/rate), Booking pricing, FlightLeg, OperatorContract, UserPermissionOverride, UserAirportScope.

API nhóm: empty-legs filter, airports/fees/available-aircraft, aircraft location/rate, pricing/estimate, bookings/:id/legs, operator-contracts + approval + docusign, permissions + airport-scopes, webhooks/docusign.

---

# 19. Nghiệm thu (rút gọn)

* Empty Leg lọc châu lục + không lộ airport ngoài quyền.
* CAN→HAN→SGN: tạo 2 legs, tổng giờ gồm positioning; KH thấy 1 tổng giá.
* Booking nhiều leg + loại đúng.
* HĐ mẫu, 1 MB–1 HĐ, chưa duyệt không DocuSign.
* DocuSign: envelope, webhook idempotent, CoC, void theo quyền.
* Permission DENY chặn API 403; airport scope áp dụng mọi API/export.
* Audit đủ thao tác giá / vị trí / duyệt / DocuSign / hủy / quyền.

---

# 20. Ảnh hưởng hệ thống

Airport, Aircraft, Booking/Leg, pricing, Empty Leg web, admin MB/sân bay/phân quyền, quote/approval/contract, third-party, audit, OpenAPI, test suite, **tiến độ**.

**Không** đánh dấu “đã hoàn thành” trên báo cáo tiến độ lúc tiếp nhận.

> Đã tiếp nhận yêu cầu – đang phân tích ảnh hưởng và chờ xác nhận phạm vi.

---

# 21. Phân loại phạm vi sơ bộ

## 21.1. Mở rộng module đã có (cần đánh giá khối lượng)

* Empty Leg theo châu lục · Airport mở rộng · vị trí MB · giá theo giờ · Positioning Leg · booking nhiều chặng · permission + airport scope.

## 21.2. Module nghiệp vụ mới

* Operator contract · approval workflow · versioning · 1 HĐ / máy bay.

## 21.3. Tích hợp bên thứ ba mới

* DocuSign (API, template, envelope, webhook, CoC) → **phụ lục / báo giá bổ sung**.

---

# 22. Thông tin KH cần cung cấp

1–8. Dữ liệu MB, giá giờ, căn cứ, vị trí đậu, phụ phí, return rules, airport fees.  
9–11. Operator, mẫu HĐ, quy tắc 1 MB–1 HĐ.  
12–15. Người duyệt / hủy / user + airport scope.  
16–19. DocuSign sandbox, người ký, nhắc ký, chi phí DocuSign.  
20. Xác nhận in-scope vs phụ lục.

---

# 23. Điều kiện xác nhận yêu cầu

Chốt khi hai bên xác nhận công thức giá, return leg, phí, cập nhật vị trí, booking đa chặng, HĐ theo MB, mẫu HĐ, duyệt, hủy, airport scope, DocuSign, khối lượng phát sinh, tiến độ, chi phí bổ sung.

**Tiếp nhận ≠ tự động nằm trong 74TR.** Chỉ triển khai chính thức sau: (1) KH xác nhận đặc tả · (2) đánh giá KT · (3) chốt phạm vi/tiến độ/chi phí · (4) phụ lục nếu cần.

---

# 24. Xác nhận của các bên

## Đại diện khách hàng

* Họ và tên:
* Chức vụ:
* Ngày xác nhận:
* Ý kiến:
* Chữ ký:

## Đại diện Minh Tiến Solutions

* Họ và tên: Trần Minh Tiến
* Chức vụ:
* Ngày xác nhận:
* Ý kiến:
* Chữ ký:

---

*Bản rút gọn lưu repo để agent/dev bám scope. Bản đầy đủ mục 4–19 giữ trong email/PDF gửi KH nếu cần; kịch bản nói chuyện: [KH_KICH_BAN_SAU_HOP_CR.md](./KH_KICH_BAN_SAU_HOP_CR.md).*
