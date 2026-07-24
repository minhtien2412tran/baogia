# Gap backlog — đóng GĐ1 & hoàn tất GĐ2

> **Updated:** 2026-07-24 · SMTP W5-10 **PASS** · W5-12…13 **DEV_API PASS** · Media Option 2 **PASS** · R4/R5 **DEPLOYED**  
> **Canonical Owner note:** [`note.md`](../note.md) · **Plan task:** [PLAN_GD1_GD2_EXECUTION.md](./PLAN_GD1_GD2_EXECUTION.md)  
> **Báo cáo:** [BAO_CAO_TIEN_DO_DAY_DU.md](./BAO_CAO_TIEN_DO_DAY_DU.md) · **Status app:** [STATUS_CURRENT.md](./STATUS_CURRENT.md)

---

## Trạng thái chuẩn

| GĐ | Status |
|----|--------|
| GĐ1 | `TECHNICALLY DONE — PENDING SIGN-OFF` |
| GĐ2 | `DEV BASELINE DONE — PENDING OWNER INPUT (News/UX/W5-11), POLISH AND UAT` |
| GĐ3 | `PLANNED — NOT STARTED` (chuẩn bị nhẹ Wave 7) |
| GĐ4 | `BLOCKED BY EXTERNAL KEYS` |

**Owner SoT:** [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md)  
**SMTP:** W5-10 **PASS** · W5-11 Owner inbox · W5-12…13 **DEV_API PASS** · W5-14 **BLOCKED**  
**Mail nhóm:** GD2-MAIL — Dev xong 12–13; đóng 14 sau Owner W5-11.

---

## GĐ1 — còn thiếu (mã `note.md`)

| ID | Việc | Ai | Wave | Status |
|----|------|-----|------|--------|
| GD1-R1 | SMTP thật **hoặc** residual có điều kiện | Owner+DevOps | W5 / W0-05 | ✅ W5-10 PASS |
| GD1-R2 | Email smoke sau SMTP | Dev/QA | W5b | 🟡 API send PASS · W5-11 inbox Owner |
| GD1-R3 | Ghi kết quả SMTP vào sign-off | Dev/PM | W5-14 | ⬜ sau 11–13 |
| GD1-R4 | Rà O1–O4 thống nhất docs | Owner+PM | W0-03 | ✅ |
| GD1-R5 | Biên bản NT GĐ1 | PM | W6-01 | ✅ nháp |
| GD1-R6 | Họp + ký | Hai bên | W6-02 | ⬜ Owner slot |
| GD1-R7 | Chốt residual chuyển GĐ2/3/4 | Hai bên | W6 | ⬜ |
| — | Kỹ thuật / smoke / backup | Dev | — | ✅ |

---

## GĐ2 — còn thiếu theo nhóm

| Nhóm | Mã note | Wave plan | Unlock |
|------|---------|-----------|--------|
| Mail | GD2-MAIL-01…05 | W5 | W5-11 Owner · 12–13 ✅ · W5-14 sau inbox |
| CMS | GD2-CMS-01…07 | W2 | OWNER News (W2-05) · publish cycle PASS |
| UX | GD2-UX-01…09 | W3 | OWNER feedback W3-06 |
| Media | GD2-MEDIA-01…07 | W4 | ✅ Option 2 |
| QA | GD2-QA-01…10 | W1 + W6-07 | DEV |
| UAT | GD2-UAT-01…08 | W6 | OWNER ký |

**Không thuộc GĐ2:** Pay / OAuth / SMS → GĐ4.

---

## Việc Dev làm ngay

1. ~~Wave 0–4 Dev~~ ✅ · Media Option 2 ✅ · Contact ✅  
2. ~~W5-10 SMTP~~ ✅ · **W5-11** chờ Owner · W5-12…14 sau đó  
3. ~~R4 CMS/media PermissionGuard~~ ✅ DEPLOYED 24/07  
4. ~~R4 settings/audit + brand settings.*~~ ✅ DEPLOYED 24/07  
5. ~~R5 scope core (quote/booking/airport) + remove AdminGuard~~ ✅ DEPLOYED 24/07  
6. ~~W5-12/12B fan-out DEV_API~~ ✅ BK-000014/015 · Owner W5-11 vẫn mở  
7. ~~W5-12C operator_unassigned DEV_API~~ ✅ BK-000016  
8. ~~W5-13 idempotency DEV_API~~ ✅ BK-000019  
9. Operator Portal = NOT STARTED — chờ OP-D* ([OPERATOR_PORTAL_EPIC.md](./OPERATOR_PORTAL_EPIC.md))  
10. Sau W5-11 → W5-14  

**Handoff 1 trang:** [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md)  
**Biên bản GĐ1 nháp:** [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md)
