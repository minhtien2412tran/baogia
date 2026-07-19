# Feature Matrix

**Cập nhật:** 2026-07-18
**Prod API:** https://api.minhtien.online · **Admin:** https://admin.minhtien.online/login  
**Checklist:** [JETBAY_DELIVERY_CHECKLIST.md](./JETBAY_DELIVERY_CHECKLIST.md)
**Admin/RBAC SoT:** [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md)

| Feature | Web UI | API | Database | Status |
|---------|--------|-----|----------|--------|
| Home + search | ✅ | ✅ prod seed | ✅ QuoteRequest | Production-ready |
| Fixed Price | ✅ CRUD admin | ✅ DB (12 routes) | ✅ | Production-ready |
| Empty Legs | ✅ CRUD admin | ✅ DB (2 offers) | ✅ | Production-ready |
| Jet Card | ✅ Account + admin | ✅ DB | ✅ | Production-ready |
| Travel Credits | ✅ Account | ✅ DB | ✅ | Production-ready |
| News/Blogs | ✅ + article editor | ✅ CMS | ✅ ContentArticle | Production-ready |
| Destinations | ✅ + admin CRUD | ✅ DB | ✅ Destination | Production-ready |
| Quote request | ✅ Widget + email | ✅ DB | ✅ | Production-ready |
| Bookings | ✅ Account + pay | ✅ DB | ✅ Booking | Production-ready |
| Auth | ✅ OAuth/OTP/email | ✅ JWT+bcrypt | ✅ User + RefreshToken | Production-ready |
| Payments | ✅ OnePay/9Pay UI | ✅ Stripe+gateway | ✅ Payment | Needs merchant keys |
| Documents | ✅ PDF/HTML export | ✅ pdfkit | ✅ Document | Production-ready |
| Media library | — | ✅ MinIO | — | Needs MINIO_ENDPOINT |
| Partner | ✅ Form | ✅ DB | ✅ PartnerApplication | Production-ready |
| World Cup | ✅ Form | ✅ DB | ✅ QuoteRequest | Production-ready |
| Aircraft admin | 🟡 UI read-only list | ✅ CRUD API | ✅ AircraftModel / Aircraft | Partial — expose fleet CRUD in Admin |
| Admin RBAC | 🟡 Permissions/scopes UI; login only `ADMIN` | 🟡 Mixed `PermissionGuard` / `AdminGuard` | ✅ RolePermission + overrides + scopes | Partial — migration R1–R5 |
| i18n | 🟡 Nav/account only | ✅ locale param | — | Partial |
| Redis cache | — | 🟡 Service only | — | Optional next |
| VPS deploy API/Admin | — | ✅ PM2 3010/3011 | ✅ jetbay_db | Live |

**Mock / cần cấu hình production:** OnePay/9Pay sandbox keys, Twilio/ESMS SMS, Stripe live keys, Apple/Google OAuth domain verify — xem [JETBAY_G4_INTEGRATIONS.md](./JETBAY_G4_INTEGRATIONS.md).
