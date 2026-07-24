# Status — Admin / Dashboard (`apps/admin`)

> **Updated:** 2026-07-24 ~16:35 ICT · Index: [STATUS_CURRENT.md](./STATUS_CURRENT.md)  
> **Code:** `apps/admin` · Next.js dashboard  
> **Prod:** https://admin.minhtien.online/login → API `api.minhtien.online`  
> **RBAC SoT:** [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md)

## 1. Tổng quan

| Hạng mục | Giá trị |
|----------|---------|
| Vai trò | CMS + ops CRM (quotes/bookings/fleet/content) — **không** phải Operator Portal |
| Auth | JWT staff · `AuthGate` + `PermissionContext` · `can()` trên nav/actions |
| Guards API | `StaffGuard` + `PermissionGuard` (R1–R5); `AdminGuard` **đã xóa** |
| Deploy gần | Admin `jetbay-admin-20260724-135033` (R4 wave) · schedule từ 21/07 |
| CRM riêng | Không — dùng chung Admin |

**Verdict:** Dashboard **LIVE**. Ops-core + export + RBAC UX đã ship. R4/R5 BE đã deploy. Còn Mail Ops UI, nội dung CMS Owner, và Operator Portal (epic riêng).

---

## 2. Khu vực dashboard — trạng thái

Legend: **LIVE** · **PARTIAL** · **MOCK** · **NOT_STARTED**

| Khu vực | Route | Status | Ghi chú |
|---------|-------|--------|---------|
| Login | `/login` | LIVE | Bake URL API prod |
| Overview | `/dashboard` | LIVE | Stats + flight calendar widget |
| Flight schedule | `/dashboard/schedule` | LIVE | `GET /admin/dashboard/flight-schedule` |
| Quotes | `/dashboard/quotes` | LIVE | Detail · offer · R5 scope |
| Bookings | `/dashboard/bookings` | LIVE | Status · cancel · R5 scope |
| Payments | `/dashboard/payments` | LIVE | View/export; refund chưa |
| Users 360 | `/dashboard/users` | LIVE | Roles SALES/APPROVER hỗ trợ |
| Airports / Aircraft | fleet routes | LIVE | CRUD · location |
| Fixed-price / EL / JC / TC | commercial | LIVE | CRUD + permission |
| Contracts | `/dashboard/contracts` | LIVE | Workflow · DocuSign **mock** |
| Operators | `/dashboard/operators` | LIVE | contactEmail / OperatorUser |
| Email templates | `/dashboard/email-templates` | LIVE | Seed templates |
| CMS content | `/dashboard/content/*` | PARTIAL | Publish cycle PASS · News mỏng |
| Media / media-review | media routes | LIVE | Option 2 · R4 PermissionGuard |
| Permissions | `/dashboard/permissions` | LIVE | Role transfer · overrides · scope UI |
| Settings / brand | `/dashboard/settings` | LIVE | `settings.view/manage` R4 |
| Audit logs | `/dashboard/audit-logs` | LIVE | `audit.view` R4 |
| Export CSV/PDF | buttons trên list | LIVE | `*.export` |
| Revenue demo | dashboard metric | MOCK | Labelled demo |
| **Mail Operations UI** | — | **NOT_STARTED** | Log/retry trong DB; UI backlog |
| **Operator Portal** | — | **NOT_STARTED** | [OPERATOR_PORTAL_EPIC.md](./OPERATOR_PORTAL_EPIC.md) |

---

## 3. RBAC waves

| Wave | Nội dung | Status |
|------|----------|--------|
| R1 | AuthGate · PermissionContext · nav `can()` | DONE (deployed) |
| R2 | Quotes/bookings/… PermissionGuard | DONE |
| R3 | Export · detail UX · schedule | DONE |
| R4 | CMS/media + settings/audit + brand `settings.*` | **DEPLOYED** 24/07 |
| R5 | Airport/quote/booking scope · remove AdminGuard | **DEPLOYED** 24/07 (portal vẫn epic riêng) |

Backup BE: `133626` · `134852` · `140317`. Smoke: `smoke-admin-crud` · `smoke-r4-settings-audit`.

> Một số dòng cũ trong matrix vẫn ghi `AdminGuard` — **ưu tiên** bảng waves + [SESSION_20260724](./reviews/SESSION_20260724_MAIL_MEDIA.md); matrix sẽ sync dần.

---

## 4. Việc còn mở (Admin)

| Ưu tiên | Việc | Ai |
|---------|------|-----|
| P0 | Owner News / CMS publish | Owner W2-05 |
| P1 | Mail Ops UI (history / retry / reassign Operator) | Dev |
| P1 | Operator Portal sau OP-D1…D4 | Owner → Dev |
| P2 | Re-seed SALES perms nếu staff thiếu quyền mới | DevOps |
| P2 | Orphan catalog keys `content_*` | Dev |
| G4 | Live payment / DocuSign UI | Keys KH |

---

## 5. Lệnh kiểm nhanh

```bash
# Login UI: https://admin.minhtien.online/login
node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
# R4 settings/audit (nếu có script local):
# bash scripts/deploy/jetbay-be/smoke-r4-settings-audit.sh
curl -sI https://admin.minhtien.online/dashboard/schedule
```

---

## 6. Ranh giới quan trọng

| Có sẵn | Không phải Portal |
|--------|-------------------|
| Mail fan-out Operator / OperatorUser | UI login riêng cho hãng |
| CRUD Operators + templates | Accept/decline chuyến phía hãng |
| Audit `FLIGHT_NOTIFY` | Availability calendar hãng |

Quyết định Portal: form `OP-D` trong [OWNER_INPUT_FORMS.md](./OWNER_INPUT_FORMS.md).

---

## 7. Liên kết

- Index: [STATUS_CURRENT.md](./STATUS_CURRENT.md)  
- FE: [STATUS_WEB_FE.md](./STATUS_WEB_FE.md) · BE: [STATUS_API_BE.md](./STATUS_API_BE.md)  
- Surface map Admin rows: [WEB_API_SURFACE_MAP.md](./WEB_API_SURFACE_MAP.md)  
- Owner handoff: [OWNER_HANDOFF_NEXT.md](./OWNER_HANDOFF_NEXT.md)
