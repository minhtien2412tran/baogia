# Feature Matrix

**Cập nhật:** 2026-07-09

| Feature | Web UI | API | Database | Status |
|---------|--------|-----|----------|--------|
| Home + search | ✅ | ✅ | ✅ QuoteRequest | Production-ready |
| Fixed Price | ✅ CRUD admin | ✅ DB | ✅ | Production-ready |
| Empty Legs | ✅ CRUD admin | ✅ DB | ✅ | Production-ready |
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
| Aircraft admin | ✅ CRUD | ✅ DB | ✅ AircraftModel | Production-ready |
| i18n | 🟡 Nav/account only | ✅ locale param | — | Partial |
| Redis cache | — | 🟡 Service only | — | Optional next |

**Mock / cần cấu hình production:** OnePay/9Pay sandbox keys, Twilio/ESMS SMS, Stripe live keys, Apple/Google OAuth domain verify.
