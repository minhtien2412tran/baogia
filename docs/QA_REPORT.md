# QA Report — JetBay Platform

**Date:** 2026-07-09  
**Environment:** Windows 10, Node 22+, PostgreSQL 16 local, pnpm 10  
**Audit:** Theo [SPRINT_PROMPTS.md](./SPRINT_PROMPTS.md) — Prompt kiểm tra sau mỗi bước

## Build status

| App | Build | Tests |
|-----|-------|-------|
| API | ✅ `pnpm --filter @jetbay/api build` | ✅ 5 unit tests |
| Web | ✅ `pnpm --filter @jetbay/web build` | — |
| Admin | ✅ `pnpm --filter @jetbay/admin build` | — |
| CI | ✅ `.github/workflows/ci.yml` | API test job |

## Lệnh đã chạy (CI local)

```bash
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api build
pnpm --filter @jetbay/api test
pnpm --filter @jetbay/admin build
pnpm --filter @jetbay/web build
pnpm --filter @jetbay/api exec prisma db push   # RefreshToken + OtpCode sync
```

## API smoke tests (cần API chạy `:4000`)

| Endpoint | Ghi chú |
|----------|---------|
| `GET /` | Root health |
| `GET /openapi.json` | OpenAPI spec |
| `POST /auth/login` | demo@jetbay.local |
| `POST /auth/otp/send` | Dev code in response |
| `GET /quotes/my` | JWT required |
| `GET /payments/my` | JWT required |
| `GET /admin/system-health` | Admin JWT — redis/minio status |
| `POST /admin/media/upload` | MinIO + admin JWT |
| `POST /payments/stripe/webhook` | Stripe signature |

## Web routes (build output verified)

| Route | Status |
|-------|--------|
| `/[locale]` | ✅ |
| `/[locale]/login`, `/register` | ✅ OAuth + OTP |
| `/[locale]/account/*` | ✅ overview, quotes, jet-card, credits, payments, documents |
| `/[locale]/ski-destinations`, `/golf-destinations` | ✅ |
| 29+ locale pages | ✅ TypeScript clean |

## Admin routes

| Route | Status |
|-------|--------|
| `/dashboard` | ✅ |
| CRUD: fixed-price, empty-legs, jet-card, users, destinations, media, aircraft | ✅ |
| `/dashboard/content/articles/[id]` | ✅ Rich text editor |

## E2E (Playwright — `pnpm test:e2e`)

**Kết quả 2026-07-09: ✅ 9/9 passed** (với `pnpm dev` chạy)

- Home branding + fixed-price section
- Admin dashboard (login via API token)
- API health + OTP dev flow
- Fixed-price London routes
- Ski/golf destinations
- Quote form submit
- Vietnamese locale + OAuth buttons

## Đã hoàn thành (so với báo giá 74TR)

- GĐ4: Google/Apple OAuth, SMS OTP, OnePay/9Pay redirect, Stripe intent + webhook
- MinIO media upload + admin library
- Email (Mailpit/SMTP), PDF charter agreement export
- Refresh token revocation + logout
- Rate limiting
- Account portal đầy đủ sub-pages
- i18n cơ bản (vi/zh/en nav)

## Known limitations

1. **OnePay/9Pay**: Cần merchant keys sandbox/production để test end-to-end
2. **Apple/Google live**: Cần `NEXT_PUBLIC_*_CLIENT_ID` + domain verify
3. **i18n**: Chỉ nav/account/footer — nội dung trang vẫn English
4. **Redis cache**: Service có, chưa cache endpoint đọc nóng
5. **Lighthouse**: Chưa chạy audit performance
6. **E2E CI**: Playwright chưa trong GitHub Actions (chỉ build + unit test)

## Verdict

**✅ Pass build, typecheck, unit tests (5), E2E (9/9) — sẵn sàng review local và staging deploy.**

Chưa production-ready cho đến khi: env secrets production, HTTPS, SMS/Stripe/OnePay keys thật, và chạy full E2E trên staging.
