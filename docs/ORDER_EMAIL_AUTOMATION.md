# JETVINA/JETBAY — MAIL AUTOMATION CHO QUOTE VÀ BOOKING

> **Ngày cập nhật:** 24/07/2026 ~11:20 ICT  
> **SMTP production:** ENABLED (`smtp=true`, `catcher=false`)  
> **Canonical SoT:** file này  
> **Deploy datetime fix:** `jetbay-be-20260724-112005`  
> **Trạng thái nghiệm thu W5:** W5-10 **PASS** · datetime/tz **PASS** · W5-11 **chờ Owner inbox** · W5-12…13 **sau W5-11** · W5-14 **chưa DONE**

## 1. Phạm vi nghiệp vụ đã triển khai

Hệ thống phục vụ **charter/private jet quote–booking**, không phải bán vé chuyến lịch trình.

```text
Khách gửi yêu cầu báo giá
    ├── Gửi mail xác nhận cho khách
    └── Gửi thông báo cho Sales/Admin

Admin tạo Offer
    ├── Chọn đúng Operator/hãng khai thác
    ├── Chọn máy bay
    └── Gửi báo giá cho khách

Khách xác nhận Booking
    ├── Gửi booking_created cho khách (không khẳng định hãng đã xác nhận)
    ├── Gửi yêu cầu chuyến đến Operator (+ OperatorUser fan-out)
    └── Gửi thông báo cho Sales/Admin

Booking thay đổi hoặc bị hủy
    ├── Thông báo lại khách (khi sự kiện nghiệp vụ)
    ├── Thông báo Operator
    └── Thông báo Sales/Admin
```

Code: `FlightNotifyService` · `CustomerCareService` · `EnquiryMailService` · `EmailTemplateService`

## 2. Quy tắc xác định hãng nhận mail

1. `QuoteOffer.operator`
2. Fallback `aircraft.operator`
3. `Operator.contactEmail`
4. Fan-out `OperatorUser.email`
5. Sales/Admin luôn nhận (`SMTP_ENQUIRY_TO`)

Nếu thiếu Operator / thiếu email:

* **Không** gửi nhầm hãng khác
* Sales/Admin nhận cảnh báo `operator_unassigned`
* Log JSON: `bookingId`, `bookingReference`, `quoteOfferId`, `aircraftId`
* Audit `FLIGHT_NOTIFY` với `needsManual: true`

## 3–4. Nội dung mail + quy tắc ngày giờ

**Ngày giờ không được viết tắt kiểu** `2026-07-24 07:30` (thiếu múi giờ → dễ nhầm UTC/local).

Định dạng chuẩn (helper `utils/email-datetime.ts`):

```text
Friday, 24 July 2026 · 14:30 (GMT+7 · Asia/Ho_Chi_Minh)
Thứ Sáu, 24 tháng 7 năm 2026 · 14:30 (GMT+7 · Asia/Ho_Chi_Minh)
```

- Mỗi chặng: `Leg N: SGN (city) → HAN (city) · <full local datetime>`
- Khởi hành = **giờ địa phương sân bay đi** (`Airport.timezone`)
- Luôn kèm **IANA timezone** (`Asia/Ho_Chi_Minh`, …)
- Subject Operator: không nhét cả itinerary dài — ghi “check departure time inside”

- Operator / Admin: `bookingReference`, `itineraryHtml`, `departureDateTime`, `departureTimezone`, …
- Khách (`booking_created`): không lộ email hãng; **không** khẳng định hãng đã confirm; label rõ “Khởi hành (giờ địa phương sân bay đi)”

## 5. Gửi an toàn + idempotency

Mỗi nhóm nhận email **riêng** (không chung To/Cc):

| Group | campaignKey example | referenceId |
|-------|---------------------|-------------|
| customer | `booking_created` | `BK-000007:PENDING:created` |
| operator | `booking_created:operator` | `BK-000007:PENDING:created` |
| sales | `booking_created:sales` | `BK-000007:PENDING:created` |

`EmailTemplateService.sendRendered` **skip** nếu log đã `SENT` (`idempotent_skip`).

## 6. Sự kiện

| Event | Khách | Operator | Sales |
|-------|------:|---------:|------:|
| quote request | ✅ | — | ✅ |
| quote offer | ✅ | tùy NV | ✅ |
| booking_created | ✅ | ✅ | ✅ |
| booking status / cancel | ✅ | ✅ | ✅ |
| operator_unassigned | — | — | ✅ cảnh báo |
| mail_delivery_failed | — | — | ✅ cảnh báo (sanitize) |

## 7. Admin Mail Operations

**Chưa ship UI đầy đủ** (GĐ2+). Hiện có: `EmailCampaignLog` + Audit `FLIGHT_NOTIFY` / `MAIL_DELIVERY_FAILED`. Epic UI: xem lịch sử / retry / đổi Operator — backlog riêng.

## 8. Operator cấu hình

Trước vận hành thật: điền `contactEmail`, OperatorUser, active, gán đúng Operator trên mọi Quote Offer.

## 9. Test W5-11…13

| ID | Trạng thái | Ghi chú |
|----|------------|---------|
| W5-10 | **PASS** | smtp=true · catcher=false |
| W5-11 | **OWNER** | Xác nhận inbox/Spam Quote #61/#62 + screenshot che PII |
| W5-12 | **PENDING** | Booking fan-out sau W5-11 |
| W5-12B/C | **PENDING** | Cancel + thiếu Operator |
| W5-13 | **PENDING** | Retry/idempotency evidence |
| W5-14 | **BLOCKED** | Chỉ DONE khi 11–13 có evidence |

## 10. Evidence checklist

```text
W5-10 SMTP integration status: PASS
Email datetime (IANA / origin local): PASS · deploy ~11:20 ICT
W5-11 Quote #61 inbox: PENDING_OWNER
W5-11 Quote #62 inbox: PENDING_OWNER
W5-12 Booking customer/operator/sales mail: PENDING
W5-12 Cancel/status + thiếu Operator: PENDING
W5-13 Retry/log/idempotency: CODE_READY · E2E PENDING
W5-14: BLOCKED until 11–13
```

## 11. Task tiếp theo

**Owner:** W5-11 inbox · danh sách Operator email thật · (song song) News/UX/ký GĐ1  

**Dev sau W5-11:** W5-12 fan-out · 12B/C · W5-13 · rồi W5-14  

## 12. Phạm vi mở rộng — OPERATOR PORTAL

Không ghi đã hoàn thành chỉ vì mail Operator đã chạy. Epic riêng: accept/decline, availability, giá hãng, SLA, audit, RBAC chỉ data của hãng.
