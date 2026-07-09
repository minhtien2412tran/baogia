# Backend Audit Report

Last updated: 2026-06-30

## Summary

| Area | Before | After |
|------|--------|-------|
| Authentication | Demo tokens, plaintext passwords | JWT + bcryptjs |
| Admin routes | Open (no guards) | `JwtAuthGuard` + `AdminGuard` |
| Input validation | Swagger-only DTOs | `class-validator` on core DTOs |
| Partner API | Hardcoded mock | Prisma `PartnerApplication` |
| Quote search | Hardcoded options | DB `AircraftCategory` lookup |
| World Cup | Hardcoded match | DB `WorldCupMatch` |
| Payments | Mock responses | DB `Payment` records |
| Charter documents | Hardcoded | DB `Document` lookup |
| User roles | None | `User.role` (`USER` / `ADMIN`) |

## Security

### Implemented

- JWT access tokens (7d) + refresh tokens (30d)
- Password hashing with bcryptjs
- AdminGuard on all `/admin/*` routes
- JwtAuthGuard on protected user routes
- ValidationPipe with whitelist + forbidNonWhitelisted
- Helmet middleware

### Seed credentials (development)

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Demo user | demo@jetbay.local | Demo123! | USER |
| Admin | admin@jetbay.local | Admin123! | ADMIN |

### Still pending

- OAuth Google/Apple integration
- Rate limiting
- Payment gateway (Stripe)
- Refresh token revocation

## API coverage

See [API_UI_AUDIT.md](./API_UI_AUDIT.md). Live audit: `GET /api-gateway/ui-audit`

## Setup

```powershell
pnpm db:up
pnpm --filter @jetbay/api prisma:migrate
pnpm --filter @jetbay/api prisma:seed
pnpm --filter @jetbay/api dev
```
