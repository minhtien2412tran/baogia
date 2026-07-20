# Admin · User · RBAC Function Matrix

**Source of truth:** code audit nhánh `jetvina` · cập nhật **2026-07-20 late**
**Phạm vi:** `apps/admin` UI ↔ `apps/api` guards/routes ↔ Prisma RBAC  
**Liên quan:** [BE_AUDIT.md](./BE_AUDIT.md) · [BE_TEST.md](./BE_TEST.md) · [WEB_API_SURFACE_MAP.md](./WEB_API_SURFACE_MAP.md)

## 1. Mục tiêu tổ chức

Ma trận này tách 5 lớp không được đánh đồng:

1. **Identity** — người dùng là ai (`User.role`, `OperatorUser.role`).
2. **Capability** — permission string trong `permission.catalog.ts`.
3. **Data scope** — user được thấy sân bay/khu vực nào.
4. **Enforcement** — route đang dùng `PermissionGuard` hay `AdminGuard`.
5. **Presentation** — menu/nút trong Admin có ẩn theo quyền hay không.

Trạng thái chuẩn mong muốn:

```text
User.role
  + RolePermission
  + UserPermissionOverride (DENY / ALLOW / INHERIT)
  + UserAirportScope
      ↓
PermissionGuard tại API
      ↓
permission-aware navigation + action buttons tại Admin
```

## 2. Identity / role matrix

| Identity            | Nơi dùng                                  | Quyền mặc định                                                               | Data scope                                                                 | Được vào Admin                                                                 |
| ------------------- | ----------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `USER`              | Khách hàng web                            | Account, quote/booking/payment của chính mình; không có role permission seed | Dữ liệu sở hữu (`userId`)                                                  | Không                                                                          |
| `ADMIN`             | Quản trị nội bộ                           | Bypass toàn bộ permission catalog                                            | Không giới hạn                                                             | Có, toàn bộ                                                                    |
| `SALES`             | Nhân viên kinh doanh                      | Quote/booking/pricing/aircraft/airport/contract khởi tạo                     | Có thể giới hạn `ALL`, `NONE`, `COUNTRY`, `CONTINENT`, `SELECTED_AIRPORTS` | Hiện **bị chặn login Admin** (`role !== ADMIN`); mục tiêu: vào theo permission |
| `CONTRACT_APPROVER` | Người duyệt hợp đồng                      | Xem/duyệt/từ chối/yêu cầu sửa/gửi DocuSign; xem booking/quote                | Chưa áp scope ngoài airport                                                | Hiện **bị chặn login Admin**; mục tiêu: vào theo permission                    |
| `OPERATOR_ADMIN`    | Thành viên operator (`OperatorUser.role`) | Chưa nối vào `User.role`/permission catalog                                  | Theo operator                                                              | Chưa có portal riêng                                                           |
| `OPERATOR_STAFF`    | Nhân viên operator (`OperatorUser.role`)  | Chưa nối vào `User.role`/permission catalog                                  | Theo operator                                                              | Chưa có portal riêng                                                           |

> `OperatorUser.role` là membership của hãng khai thác, không phải role đăng nhập Admin. Không trộn hai namespace role.
>
> `StaffGuard` (`ADMIN` \| `SALES` \| `CONTRACT_APPROVER`) tồn tại trong API nhưng **chưa gắn controller nào** — dead code cho đến khi migration R2.

## 3. Cách tính quyền hiệu lực

| Lớp               | Model / code               | Quy tắc                                                                                                                                   |
| ----------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Role base         | `RolePermission`           | Permission mặc định của `SALES`, `CONTRACT_APPROVER`, role mở rộng                                                                        |
| User override     | `UserPermissionOverride`   | `DENY` chặn; `ALLOW` cấp thêm; `INHERIT` quay về role                                                                                     |
| Admin bypass      | `PermissionService`        | `ADMIN` luôn có toàn bộ catalog                                                                                                           |
| Data scope        | `UserAirportScope`         | Giới hạn airport theo vùng/quốc gia/danh sách. **Empty scopes = không restrict** (null) — dễ lộ full list nếu quên gắn scope              |
| Route requirement | `@RequirePermissions(...)` | Nhiều permission trên cùng route dùng logic **OR**                                                                                        |
| Authentication    | `JwtAuthGuard`             | Xác định `userId` + `role`; không thay thế authorization                                                                                  |
| Orphan catalog    | `permission.catalog.ts`    | Keys chưa wire route: `content_sync.run`, `content_media.approve`, `content_rewrite.approve` (rewrite thực tế dùng `content_sync.review`) |

## 4. Role × permission domain

Legend: `A` admin bypass · `R` có trong role seed · `—` chưa cấp mặc định · `O` có thể cấp bằng override.

| Domain         | Permission catalog                                                                  | ADMIN | SALES seed                    | CONTRACT_APPROVER seed                              | USER |
| -------------- | ----------------------------------------------------------------------------------- | ----- | ----------------------------- | --------------------------------------------------- | ---- |
| Booking        | `booking.view/create/update/cancel`                                                 | A     | R                             | `view`                                              | —    |
| Quote          | `quote.view/create`                                                                 | A     | R                             | `view`                                              | —    |
| Pricing        | `pricing.estimate/view_cost`                                                        | A     | R                             | —                                                   | —    |
| Aircraft       | `aircraft.view/view_location/update_location`                                       | A     | `view`, `view_location`       | —                                                   | —    |
| Airport        | `airport.view/manage`                                                               | A     | `view`                        | —                                                   | —    |
| Empty leg      | `empty_leg.view/manage`                                                             | A     | — (O)                         | — (O)                                               | —    |
| Contract       | `contract.view/create/submit_approval/approve/reject/request_changes/send_docusign` | A     | `view/create/submit_approval` | `view/approve/reject/request_changes/send_docusign` | —    |
| Permissions    | `permission.manage`, `user.manage`                                                  | A     | — (O)                         | — (O)                                               | —    |
| Content source | `content_source.view/manage`                                                        | A     | — (O)                         | — (O)                                               | —    |
| Content sync   | `content_sync.discover/preview/run/review/publish/rollback`                         | A     | — (O)                         | — (O)                                               | —    |
| Content rights | `content_rights.view/approve`                                                       | A     | — (O)                         | — (O)                                               | —    |
| Content media  | `content_media.view/sync/review/approve/approve_staging/approve_production/block`   | A     | — (O)                         | — (O)                                               | —    |
| Rewrite        | `content_rewrite.approve`                                                           | A     | — (O)                         | — (O)                                               | —    |

## 5. Admin function × API enforcement matrix

| Admin area      | UI route                                           | API surface                           | Current guard                               | Catalog coverage                                      | UI permission-aware                           | Target                                         |
| --------------- | -------------------------------------------------- | ------------------------------------- | ------------------------------------------- | ----------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| Overview        | `/dashboard`                                       | `/admin/dashboard/*`                  | `AdminGuard`                                | Missing dashboard permissions                         | No                                            | Add `dashboard.view`; migrate                  |
| Quotes          | `/dashboard/quotes`                                | `/admin/quotes*`                      | `AdminGuard`                                | `quote.*` exists                                      | No                                            | `quote.view/create/update`                     |
| Bookings        | `/dashboard/bookings`                              | `/admin/bookings*`                    | `AdminGuard`                                | `booking.*` exists                                    | No                                            | Map CRUD to `booking.*`                        |
| Pricing         | Used via quote/booking                             | `/pricing/*`                          | JWT + partial permission usage needs verify | `pricing.*` exists                                    | No                                            | Enforce estimate/cost separately               |
| Fixed Price     | `/dashboard/fixed-price`                           | `/admin/fixed-price/routes*`          | `AdminGuard`                                | Missing `fixed_price.*`                               | No                                            | Add `fixed_price.view/manage`                  |
| Empty Legs      | `/dashboard/empty-legs`                            | `/admin/empty-legs*`                  | `AdminGuard`                                | `empty_leg.*` exists                                  | No                                            | Migrate to `PermissionGuard`                   |
| Jet Card        | `/dashboard/jet-card`                              | `/admin/jet-card/plans*`              | `AdminGuard`                                | Missing `jet_card.*`                                  | No                                            | Add `jet_card.view/manage`                     |
| Travel Credits  | `/dashboard/travel-credits`                        | `/admin/travel-credits*`              | `AdminGuard`                                | Missing `travel_credit.*`                             | No                                            | Add view/manage permissions                    |
| Aircraft        | `/dashboard/aircraft`                              | `/admin/aircraft/*`                   | `AdminGuard`                                | `aircraft.*` exists                                   | No · **UI read-only** (API CRUD chưa expose)  | Migrate + expose category/model/fleet CRUD     |
| Airports        | `/dashboard/airports`                              | `/admin/airports*`                    | `PermissionGuard`                           | `airport.view/manage`                                 | No                                            | Keep; add permission-aware UI                  |
| Contracts       | `/dashboard/contracts`                             | `/admin/contracts*`                   | `PermissionGuard`                           | Complete workflow set                                 | No · thiếu create/detail/request-changes      | Keep; hide actions by permission               |
| Users           | `/dashboard/users`                                 | `/admin/users*`                       | `AdminGuard`                                | `user.manage` exists                                  | No · chỉ USER↔ADMIN; API DTO cũng chỉ 2 role  | Migrate; support SALES/APPROVER; user-360      |
| Permissions     | `/dashboard/permissions`                           | `/admin/permissions*`                 | `PermissionGuard`                           | `permission.manage`, `user.manage`                    | Partly · User ID thủ công                     | User picker, role editor, validation           |
| Partners        | `/dashboard/partners`                              | `/admin/partners*`                    | `AdminGuard`                                | Missing `partner.*`                                   | No                                            | Add view/manage permissions                    |
| Operators       | `/dashboard/operators`                             | `/admin/operators*`                   | `AdminGuard`                                | Missing `operator.*`                                  | No                                            | Add view/manage permissions                    |
| Email templates | `/dashboard/email-templates`                       | `/admin/email-templates*`             | `AdminGuard`                                | Missing `email_template.*`                            | No                                            | Add view/manage/send permissions               |
| CMS content     | `/dashboard/content/*`                             | `/admin/content/*`                    | `AdminGuard`                                | Missing general `content.*`                           | No                                            | Add article/page/video/destination permissions |
| Content sources | `/dashboard/content-sources`                       | `/admin/content-sources*`             | `PermissionGuard`                           | Complete source set                                   | No · UI thiếu create/update/detail            | Keep; permission-aware nav/actions             |
| Content sync    | `/dashboard/content-sync`                          | `/admin/content-sync*`                | `PermissionGuard`                           | Complete workflow set                                 | No · thiếu approve/reject/publish/rollback UI | Keep; separate review/publish/rollback buttons |
| Content rights  | `/dashboard/content-rights`                        | `/admin/content-rights*`              | `PermissionGuard`                           | Complete rights set                                   | No · UI chỉ R                                 | Keep; hide approve/block by permission         |
| Media review    | `/dashboard/media-review`                          | `/admin/media-assets*`                | `PermissionGuard`                           | Complete lifecycle set                                | No · thiếu block/import                       | Keep; action-level gating                      |
| Media upload    | `/dashboard/media`                                 | `/admin/media*`                       | `AdminGuard`                                | Content-media permissions exist but different surface | No                                            | Consolidate with media lifecycle               |
| Brand/settings  | `/dashboard/settings`, `/dashboard/jetbay-cleanup` | `/admin/site-settings/brand`, cleanup | Mixed (`PermissionGuard` brand; cleanup PG) | Reuses content-source permissions                     | No · Settings page chỉ system-health          | Add `settings.view/manage`; wire brand editor  |
| Audit logs      | `/dashboard/audit-logs`                            | `/admin/audit-logs`                   | `AdminGuard`                                | Missing `audit.view`                                  | No                                            | Add `audit.view`                               |

## 5b. Admin UI completeness (ngoài RBAC)

| Gap                  | Hiện trạng                                                                    | Priority |
| -------------------- | ----------------------------------------------------------------------------- | -------- |
| Login staff          | Đã mở cho `ADMIN` / `SALES` / `CONTRACT_APPROVER`; API legacy routes vẫn cần migration tiếp | DONE/P1 |
| Auth gate            | `AdminAuthGate` chỉ check token localStorage                                  | P0       |
| 403 handling         | Admin client giữ session và hiển thị Forbidden; chỉ 401 mới clear token       | DONE     |
| Quote/booking detail | List + status có; thiếu detail/offers history/cancel reason/pricing breakdown | P1       |
| User 360             | Không link user → quotes/bookings/payments/documents                          | P1       |
| Aircraft management  | Page read-only dù API có CRUD category/model/fleet/location                   | P1       |
| Content workflow UI  | Sync/rights/media API giàu hơn UI hiện tại                                    | P1       |
| CMS i18n             | Hard-code locale `en` trên articles/pages/videos/destinations                 | P2       |
| Web account ↔ Admin  | Account snapshot chỉ phục vụ KH; Admin chưa có customer support view          | P2       |

**Audit update 20/07 late:** Admin có thêm quote/booking detail, user customer-360, dashboard retry/error và empty states cho dashboard/quotes/bookings/users. API role DTO/service hỗ trợ đủ bốn role. Các gap còn lại giữ trong backlog R2–R4: aircraft CRUD, contract create/detail, CMS workflow actions và permission namespaces theo domain.

## 6. Public user function matrix

| User function            | Web surface          | API ownership rule                          | RBAC admin relation                                         |
| ------------------------ | -------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| Profile/account          | `/account/*`         | JWT user owns account                       | Admin `user.manage` may change role/status, not impersonate |
| Quote request/history    | Quote UI, `/account` | Public/optional JWT create; JWT `quotes/my` | Staff needs `quote.view/create/update`                      |
| Booking                  | `/account/bookings`  | JWT `userId` from token                     | Staff needs `booking.*`                                     |
| Payment                  | `/account/payments`  | JWT + booking/payment ownership             | Future `payment.view/manage/refund` admin permissions       |
| Jet Card / Travel Credit | `/account/*`         | JWT account/ledger ownership                | Future account-management permissions                       |
| Saved search / Company   | Schema exists        | API incomplete                              | Do not expose in Admin until API contract exists            |

## 7. Gaps cần xử lý theo ưu tiên

### P0 — security / correctness

- Admin login **hard-blocks** non-`ADMIN` roles; seeded `SALES` / `CONTRACT_APPROVER` cannot enter Admin UI at all.
- Admin navigation renders **all 29 links** for any authenticated session; API is the only protection.
- Most legacy admin routes still use `AdminGuard`; even after login unlock, staff permissions remain “permission theater” on those routes.
- `AdminBookingController` class-level `AdminGuard` + method `PermissionGuard` on cancel → SALES cannot cancel via admin booking route.
- Admin client treats HTTP `403` as session expiry (`clearToken`); permission denial wrongly logs the user out.
- `setRolePermissions` / overrides accept raw strings; must reject non-catalog keys.
- Users API DTO + UI hỗ trợ `USER` / `ADMIN` / `SALES` / `CONTRACT_APPROVER`; cần tiếp tục action gating theo `user.manage`.
- Empty `UserAirportScope` means **no restriction** — document and fix default policy.

### P1 — complete RBAC coverage

- Add missing permission namespaces: dashboard, fixed price, jet card, travel credit, partner, operator, email template, CMS, settings, audit, payment.
- Convert controllers domain-by-domain from `AdminGuard` to `PermissionGuard`; preserve `ADMIN` bypass.
- Add action-level permission requirements, not only page/controller-level checks.
- Apply data scopes beyond airport list where business requires it (quote/booking/fleet by departure/base airport).

### P2 — Admin UX

- Load `/admin/permissions/me` once in Admin layout/context.
- Filter navigation from a single feature registry; do not hardcode a second permission map in each page.
- Disable/hide create/edit/approve/publish actions based on effective permissions.
- Replace free-text User ID permission editor with searchable user picker.
- Add role template editor and effective-permission preview (role + overrides + scopes).

### P2 — tests / evidence

- Unit: role permission, override precedence, ADMIN bypass, invalid permission rejection.
- E2E: `USER` denied Admin; `SALES` allowed quote/booking but denied approval; approver allowed contract approve; explicit DENY wins.
- Scope: VN sales cannot read/update out-of-scope airport or scoped quote/booking data.
- UI: hidden nav/action must match API 403 behavior.

## 8. Migration waves

| Wave   | Scope                                                                                               | Exit gate                                                                      |
| ------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **R1** | Unlock staff login · 401≠403 · DTO/catalog validation · permission-aware nav from `/permissions/me` | Staff can enter Admin; denied actions show 403 UI, not logout; menu matches me |
| **R2** | Quotes, bookings, pricing, aircraft, empty legs · drop class `AdminGuard` on those controllers      | SALES workflows usable without `ADMIN`; API 403 matrix green                   |
| **R3** | Commercial modules, users (role enum), operators, partners, email templates                         | Every write has explicit `*.manage` permission                                 |
| **R4** | CMS/media/settings/audit · wire or delete orphan content_* keys                                     | Content workflow separation (view/review/publish/rollback/approve production)  |
| **R5** | Data scope defaults + quote/booking scope · operator portal decision · deprecate `AdminGuard`       | Scope enforcement documented/tested; `OperatorUser.role` boundary resolved     |

## 9. Definition of Done

- [ ] One feature registry drives Admin navigation and documents required permissions.
- [ ] Every `/admin/*` route has JWT plus either explicit permission(s) or documented ADMIN-only exception.
- [ ] No page exposes action controls the API will always reject for the current user.
- [ ] Role names, permission names and scope types are validated constants.
- [ ] `USER`, `SALES`, `CONTRACT_APPROVER`, `ADMIN` E2E authorization matrix passes.
- [ ] Airport/data scope tests pass.
- [ ] OpenAPI describes required permission per protected operation.
- [ ] `BE_AUDIT`, `BE_TEST`, `WEB_API_SURFACE_MAP` stay synchronized with this matrix.
