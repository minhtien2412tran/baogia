# Status — API BE (`apps/api`)

> **Updated:** 2026-07-24 ~16:35 ICT · Index: [STATUS_CURRENT.md](./STATUS_CURRENT.md)  
> **Code:** `apps/api` · NestJS + Prisma + PostgreSQL  
> **Prod:** https://api.minhtien.online · **Swagger:** https://docs.minhtien.online/swagger  
> **Audit đầy đủ:** [BE_AUDIT.md](./BE_AUDIT.md) · Test: [BE_TEST.md](./BE_TEST.md)

## 1. Tổng quan

| Hạng mục | Giá trị |
|----------|---------|
| Runtime | PM2 `jetbay-be` · `127.0.0.1:3010` |
| Guards | `Throttler` → `ApiKeyGuard` · JWT / `StaffGuard` / `PermissionGuard` |
| Validation | Whitelist + `forbidNonWhitelisted` |
| Delivery gate | G1 PASS · G3 PASS · G4 code sẵn chờ keys |
| OpenAPI sync | prod-docs **173=173** (remote) |
| HEAD SoT | `jetvina` @ `034ae32` (smoke/docs; runtime mail/R4/R5 đã deploy sớm hơn) |

**Verdict:** BE **LIVE** và ổn định. SMTP thật bật. Mail booking fan-out + idempotency có evidence Dev. RBAC R4/R5 đã deploy. Còn Owner inbox (W5-11) và G4 keys.

---

## 2. Domain — trạng thái rút gọn

| Domain | Status | Ghi chú |
|--------|--------|---------|
| Health / integrations | LIVE | `/health` ok · `smtp=true` · catcher=false |
| Auth JWT | LIVE | OAuth/OTP **ENV-gated** (G4) |
| Quotes / offers | LIVE | Locale persist · Word charter |
| Bookings | LIVE | Create / status / cancel · notify fan-out |
| Pricing | LIVE | Estimate + attach; miss airport → 400 |
| Fleet / airports | LIVE | CRUD admin · R5 airport scope |
| Fixed-price / EL / JetCard / TC | LIVE | Public + admin |
| Contracts / DocuSign | LIVE (mock) | Live DocuSign chờ phụ lục / keys |
| CMS / content / media | LIVE | PermissionGuard R4 |
| Email / FlightNotify | LIVE | Operator fan-out · unassigned · idempotent SENT |
| Customer care queue | LIVE | Retry attempts &lt; 3 |
| Payments gateway | BLOCKED | Keys G4 |
| Realtime (Socket.IO) | LIVE (code+smoke) | Chat/signal; không copy HomeFix data |
| Error envelope | LIVE | `AllExceptionsFilter` · `X-Request-Id` · deploy `113424` |
| RBAC PermissionGuard | LIVE | R4 CMS/settings/audit · R5 quote/booking/airport |
| AdminGuard | REMOVED | 24/07 · backup `140317` |
| Operator Portal API | NOT_STARTED | Epic riêng — chờ OP-D* |

---

## 3. Mail W5 (SoT)

Canonical: [ORDER_EMAIL_AUTOMATION.md](./ORDER_EMAIL_AUTOMATION.md)

| ID | Status | Evidence |
|----|--------|----------|
| W5-10 SMTP | **PASS** | Gmail 465 · sourced `.env` + PM2 |
| W5-11 inbox | **PENDING_OWNER** | Quote #61 / #62 |
| W5-12 fan-out | **DEV_API PASS** | BK-000014 |
| W5-12B cancel | **DEV_API PASS** | BK-000015 |
| W5-12C unassigned | **DEV_API PASS** | BK-000016 |
| W5-13 idempotency | **DEV_API PASS** | BK-000019 · `sentAt` stable |
| W5-14 | **BLOCKED** | Cần W5-11 SEEN + YES |

Datetime mail: IANA + giờ địa phương sân bay đi — **PASS**.

---

## 4. Deploy / backup refs (24/07)

| Backup | Nội dung |
|--------|----------|
| `jetbay-be-20260724-112005` | SMTP + mail SoT + datetime |
| `jetbay-be-20260724-113424` | Error harden + fireAndForget |
| `jetbay-be-20260724-133626` | R4 CMS/media |
| `jetbay-be-20260724-134852` | R4 settings/audit + `settings.*` |
| `jetbay-be-20260724-140317` | R5 scope · AdminGuard removed |

---

## 5. Việc còn mở (BE)

| Ưu tiên | Việc | Ai |
|---------|------|-----|
| P0 | Đóng W5-14 sau Owner W5-11 | Dev |
| P1 | Admin Mail Ops UI (lịch sử/retry) | Dev GĐ2+ |
| P1 | Operator Portal (sau OP-D*) | Dev |
| P2 | Orphan `content_*` catalog cleanup | Dev R5 leftover |
| G4 | Pay / OAuth / SMS / live DocuSign | Owner/KH keys |
| Local | Docker/Postgres cho Jest integration | Dev machine |

---

## 6. Lệnh kiểm nhanh

```bash
curl -s https://api.minhtien.online/health
curl -s https://api.minhtien.online/integrations/status
node scripts/deploy/jetbay-be/smoke-w5-12-booking-fanout.mjs
node scripts/deploy/jetbay-be/smoke-w5-12c-operator-unassigned.mjs
node scripts/deploy/jetbay-be/smoke-w5-13-idempotency.mjs
# SYNC_MODE=prod-docs pnpm smoke:api-sync   # Basic từ VPS .env — không paste secret
```

---

## 7. Liên kết

- Index: [STATUS_CURRENT.md](./STATUS_CURRENT.md)  
- FE: [STATUS_WEB_FE.md](./STATUS_WEB_FE.md) · Admin: [STATUS_ADMIN_DASHBOARD.md](./STATUS_ADMIN_DASHBOARD.md)  
- Architecture: [BE_ARCHITECTURE.md](./BE_ARCHITECTURE.md) · Security: [GIT_AND_CODE_SECURITY.md](./GIT_AND_CODE_SECURITY.md)
