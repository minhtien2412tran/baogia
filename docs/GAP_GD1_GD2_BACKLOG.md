# Gap backlog — đóng GĐ1 & hoàn tất GĐ2

> **Updated:** 2026-07-24 · **Canonical Owner note:** [`note.md`](../note.md) · **Plan task:** [PLAN_GD1_GD2_EXECUTION.md](./PLAN_GD1_GD2_EXECUTION.md)  
> **Báo cáo:** [BAO_CAO_TIEN_DO_DAY_DU.md](./BAO_CAO_TIEN_DO_DAY_DU.md)

---

## Trạng thái chuẩn

| GĐ | Status |
|----|--------|
| GĐ1 | `TECHNICALLY DONE — PENDING SIGN-OFF` |
| GĐ2 | `DEV BASELINE DONE — PENDING OWNER INPUT, SMTP, POLISH AND UAT` |
| GĐ3 | `PLANNED — NOT STARTED` (chuẩn bị nhẹ Wave 7) |
| GĐ4 | `BLOCKED BY EXTERNAL KEYS` |

**Owner SoT:** [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md)  
**SMTP:** Owner W5-10 → Dev W5-11…14. Dev **không** bịa credentials.

---

## GĐ1 — còn thiếu (mã `note.md`)

| ID | Việc | Ai | Wave | Status |
|----|------|-----|------|--------|
| GD1-R1 | SMTP thật **hoặc** residual có điều kiện | Owner+DevOps | W5 / W0-05 | 🔴 / ⬜ |
| GD1-R2 | Email smoke sau SMTP | Dev/QA | W5b | ⬜ |
| GD1-R3 | Ghi kết quả SMTP vào sign-off | Dev/PM | W5-14 | ⬜ |
| GD1-R4 | Rà O1–O4 thống nhất docs | Owner+PM | W0-03 | ⬜ |
| GD1-R5 | Biên bản NT GĐ1 | PM | W6-01 | ⬜ |
| GD1-R6 | Họp + ký | Hai bên | W6-02 | ⬜ |
| GD1-R7 | Chốt residual chuyển GĐ2/3/4 | Hai bên | W6 | ⬜ |
| — | Kỹ thuật / smoke / backup | Dev | — | ✅ |

---

## GĐ2 — còn thiếu theo nhóm

| Nhóm | Mã note | Wave plan | Unlock |
|------|---------|-----------|--------|
| Mail | GD2-MAIL-01…05 | W5 | AFTER_SMTP (+ 5a DEV trước) |
| CMS | GD2-CMS-01…07 | W2 | DEV+OWNER nội dung |
| UX | GD2-UX-01…09 | W3 | DEV + OWNER feedback |
| Media | GD2-MEDIA-01…07 | W4 | OWNER quyết định O5 |
| QA | GD2-QA-01…10 | W1 + W6-07 | DEV |
| UAT | GD2-UAT-01…08 | W6 | OWNER ký |

**Không thuộc GĐ2:** Pay / OAuth / SMS → GĐ4.

---

## Việc Dev làm ngay (không chờ SMTP)

1. ~~Wave 0~~ ✅ · ~~Wave 1~~ ✅  
2. ~~Wave 2 Dev~~ ✅ · **W2-09 PASS** (VPS publish-cycle) · **W2-05** chờ Owner news  
3. ~~Wave 3a Contact~~ ✅  
4. ~~Wave 4-01…03~~ ✅ · **W4-04** chờ Owner — [OWNER_MEDIA_DECISION.md](./OWNER_MEDIA_DECISION.md)  
5. ~~Wave 5a~~ ✅ · **W5-10+** chờ SMTP  

**Handoff 1 trang:** [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md)  
**Biên bản GĐ1 nháp:** [GD1_NT_BIEN_BAN.md](./GD1_NT_BIEN_BAN.md)
