# Status hiện tại — tổng hợp (FE · BE · Admin)

> **Updated:** 2026-07-24 ~16:35 ICT · nhánh SoT `jetvina` @ `034ae32`  
> **Không** thay CONTINUE — đây là bản tổng hợp đọc nhanh theo app.  
> Progress SoT: [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) · Snapshot: [reviews/SESSION_20260724_MAIL_MEDIA.md](./reviews/SESSION_20260724_MAIL_MEDIA.md)

## Ba file chi tiết

| App | Path code | Prod URL | File status |
|-----|-----------|----------|-------------|
| **Web FE** | `apps/web` | https://www.minhtien.online | [STATUS_WEB_FE.md](./STATUS_WEB_FE.md) |
| **API BE** | `apps/api` | https://api.minhtien.online | [STATUS_API_BE.md](./STATUS_API_BE.md) |
| **Admin / Dashboard** | `apps/admin` | https://admin.minhtien.online | [STATUS_ADMIN_DASHBOARD.md](./STATUS_ADMIN_DASHBOARD.md) |

KH chính thức = [jetvina.com](https://jetvina.com/) · demo = `apps/web` · báo giá collateral = `m-tien.com/jet-bay` — [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md)

---

## Snapshot một trang

| Layer | Trạng thái ngắn | Blocker chính |
|-------|-----------------|---------------|
| **GĐ1** | `TECHNICALLY DONE — PENDING SIGN-OFF` | Owner W5-11 inbox · slot ký W6-02 |
| **GĐ2** | Baseline Dev + polish/UAT | News · UX feedback · W5-14 sau W5-11 |
| **GĐ3** | Planned | — |
| **GĐ4** | Code sẵn · keys chờ | Pay / OAuth / SMS |
| **Web FE** | LIVE · Contact/i18n/media PASS | Content News mỏng · UX Owner |
| **API BE** | LIVE · SMTP + mail W5-12…13 PASS · R4/R5 DEPLOYED | W5-11 Owner · G4 keys |
| **Admin** | LIVE · PermissionGuard R4/R5 · schedule | Mail Ops UI · Operator Portal NOT STARTED |
| **Operator Portal** | NOT STARTED | Owner OP-D1…D4 |

### Mail (chung cả 3 app)

| ID | Status |
|----|--------|
| W5-10 SMTP | **PASS** (`smtp=true`, catcher OFF) |
| W5-11 Owner inbox #61/#62 | **PENDING_OWNER** |
| W5-12 / 12B / 12C / 13 | **DEV_API PASS** |
| W5-14 close docs | **BLOCKED** (cần W5-11) |

SoT mail: [ORDER_EMAIL_AUTOMATION.md](./ORDER_EMAIL_AUTOMATION.md) · Form: [OWNER_INPUT_FORMS.md](./OWNER_INPUT_FORMS.md)

### Owner next (không hỏi lại PASS)

1. Paste `W5-11 INBOX`  
2. News (W2-05) · UX (W3-06) · slot ký GĐ1 (W6-02)  
3. (Optional) OP-D* Portal  

### Dev next

1. Nhận W5-11 → đóng W5-14  
2. **Không** scaffold Operator Portal trước OP-D*  
3. Polish/UAT theo Owner input  

---

## Liên kết SoT khác

| Doc | Vai trò |
|-----|---------|
| [WEB_API_SURFACE_MAP.md](./WEB_API_SURFACE_MAP.md) | Ma trận route ↔ API (chi tiết; một số dòng cũ hơn 24/07) |
| [BE_AUDIT.md](./BE_AUDIT.md) / [BE_TEST.md](./BE_TEST.md) | Domain BE + smoke |
| [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md) | RBAC waves R1–R5 |
| [TEST_MATRIX.md](./TEST_MATRIX.md) | Evidence lệnh |
| [GAP_GD1_GD2_BACKLOG.md](./GAP_GD1_GD2_BACKLOG.md) | Gap GĐ1/GĐ2 |
| [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md) | Việc Owner |
