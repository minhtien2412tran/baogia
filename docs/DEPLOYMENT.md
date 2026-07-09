# Deployment — J-TA Platform

## Architecture

| Service | Port | Stack |
|---------|------|-------|
| Web | 3000 | Next.js 16 |
| Admin | 3001 | Next.js 16 |
| API | 4000 | NestJS 11 + Prisma |

## Docker (recommended)

```bash
docker compose up -d   # Postgres, Redis, MinIO, Mailpit
pnpm install
cd apps/api && pnpm prisma migrate deploy && pnpm prisma:seed
pnpm build
```

Start each app:

```bash
pnpm --filter api start:prod      # :4000
pnpm --filter web start           # :3000
pnpm --filter admin start         # :3001
```

## Environment variables

**Never commit `.env`.** See [SECURITY_SECRETS.md](./SECURITY_SECRETS.md).

### Local API

```bash
node scripts/generate-local-env.mjs   # random JWT / API_KEY / PAYMENT_SECRET
# or: cp apps/api/.env.example apps/api/.env  then replace REPLACE_WITH_*
```

### Production (VPS Jet-Bay)

Template: `scripts/deploy/jetbay-be/env.production.template`  
Live file: `/var/www/jetbay-be/.env` (`chmod 600`)  
Rotate: `bash /var/www/jetbay-be/deploy/rotate-secrets.sh`

Required: `DATABASE_URL`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `API_KEY`, `PAYMENT_SECRET`, `HOST`, `PORT`, `CORS_ORIGIN`, `APP_ENV=production`.

Prod URLs: API `https://api.minhtien.online` · Docs `https://docs.minhtien.online/swagger` · Admin `https://admin.minhtien.online`.

### Web / Admin

```
# apps/web/.env.local & apps/admin/.env.local
NEXT_PUBLIC_API_URL=https://api.minhtien.online
```

## Stripe webhook

Register in Stripe Dashboard:

- **URL:** `https://api.yourdomain.com/payments/stripe/webhook`
- **Events:** `payment_intent.succeeded`
- Set `STRIPE_WEBHOOK_SECRET` from the signing secret

## Production checklist

1. `pnpm prisma migrate deploy` on production database
2. Strong `JWT_SECRET` and HTTPS everywhere
3. Configure SMTP (replace Mailpit), MinIO/S3, Redis
4. Set OAuth client IDs on API + web
5. Configure OnePay/9Pay merchant keys for Vietnam payments
6. Run `pnpm build` for api, web, admin before deploy
7. Enable rate limiting (built-in via `@nestjs/throttler`)
8. Point `CORS_ORIGIN` to your web and admin domains
9. Run smoke tests: `pnpm test:e2e`

## Build commands

```bash
pnpm install
pnpm --filter api prisma:generate
pnpm --filter api build
pnpm --filter web build
pnpm --filter admin build
pnpm test:e2e
```

## Health endpoints

- API root: `GET /`
- **Jet-Bay health:** `GET /health` → `{ status, service, env, version }`
- Swagger: `GET /swagger`
- Admin system health: `GET /admin/system-health` (JWT admin)

## Jet-Bay VPS (api.minhtien.online)

See **[JETBAY_VPS_DEPLOY.md](./JETBAY_VPS_DEPLOY.md)** for isolated deployment on VPS `103.200.20.100`:

- PM2 `jetbay-be` on `127.0.0.1:3010`
- Nginx reverse proxy + Let's Encrypt
- PostgreSQL `jetbay_db` (separate from `baotienweb`)
- Deploy scripts: `scripts/deploy/jetbay-be/`
- **Requires explicit confirmation:** `ĐỒNG Ý TRIỂN KHAI`
