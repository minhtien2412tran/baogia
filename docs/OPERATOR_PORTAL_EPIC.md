# Operator Portal — Epic SoT (chưa ship)

> **Updated:** 2026-07-24 · **Status:** `NOT STARTED` (epic riêng — **không** ghi DONE vì mail Operator đã chạy)  
> **Canonical mail:** [ORDER_EMAIL_AUTOMATION.md](./ORDER_EMAIL_AUTOMATION.md)  
> **RBAC:** [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md) — `OperatorUser.role` ≠ Admin `User.role`

---

## 1. Ranh giới

| Đã có (không phải Portal) | Portal (epic này) |
|---------------------------|-------------------|
| Mail fan-out Operator / OperatorUser | UI đăng nhập riêng cho hãng |
| Admin CRUD Operators + templates | Accept / decline chuyến |
| `OperatorUser` membership trong DB | Availability / calendar hãng |
| Audit `FLIGHT_NOTIFY` | Báo giá phía hãng / SLA |
| | RBAC chỉ data của hãng mình |

**Không** pull HomeFix CRM/marketplace. Scope chỉ charter báo giá JetBay.

---

## 2. Quyết định sản phẩm (Owner cần chọn trước code lớn)

| ID | Câu hỏi | Options |
|----|---------|---------|
| OP-D1 | Portal host | `operator.minhtien.online` · path `/operator` trên Admin · app riêng |
| OP-D2 | Auth | JWT User gắn `OperatorUser` · magic-link mail · SSO sau |
| OP-D3 | Vai trò | `OPERATOR_ADMIN` / `OPERATOR_STAFF` (đã có enum membership) |
| OP-D4 | Giai đoạn | GĐ3 prep · GĐ4 · phụ lục CR |

Dev **không** tự chọn OP-D1…D4 — ghi Owner decision vào CONTINUE khi có.

---

## 3. Backlog đề xuất (sau Owner quyết định)

### Phase A — Auth + shell (M)

1. Model link `User` ↔ `OperatorUser` (login được, chỉ thấy `operatorId` của mình).  
2. Guard `OperatorGuard` + permissions `operator_portal.*` (catalog mới — **không** trộn Admin).  
3. Shell FE tối thiểu: login · list chuyến được assign.

### Phase B — Trip actions (L)

4. Accept / decline booking request.  
5. Ghi audit + mail lại Sales/customer theo SoT mail.  
6. Availability stub (block dates).

### Phase C — Commercial (L, phụ lục)

7. Counter-price / notes.  
8. SLA timers.  
9. Export CSV chuyến hãng.

---

## 4. DoD epic (khi DONE thật)

- [ ] Owner đã chọn OP-D1…D4  
- [ ] SALES Admin vẫn dùng Admin; Operator **không** thấy data hãng khác  
- [ ] E2E: offer → booking → Operator thấy chuyến → accept → Sales nhận mail  
- [ ] Không claim DONE chỉ vì SMTP fan-out  

---

## 5. Việc Dev làm ngay (không chờ Portal)

- Giữ mail SoT + W5-12/12B/12C evidence.  
- Đảm bảo mỗi Offer có `operatorId` + `contactEmail` / OperatorUser.  
- Không scaffold app/route portal cho đến khi Owner chốt OP-D1.

**Status dòng SoT:** `Operator Portal = NOT STARTED — epic doc ready`
