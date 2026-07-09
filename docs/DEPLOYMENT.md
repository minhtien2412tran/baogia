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

### API (`apps/api/.env`)

See `apps/api/.env.example` for the full list. Minimum production set:

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=jta-uploads
SMTP_HOST=...
SMTP_PORT=587
SMTP_FROM="J-TA <noreply@yourdomain.com>"
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
API_PUBLIC_URL=https://api.yourdomain.com
PAYMENT_RETURN_URL=https://yourdomain.com/en-us/account
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
APPLE_CLIENT_ID=...
ONEPAY_MERCHANT_ID=...
NINEPAY_MERCHANT_KEY=...
TWILIO_ACCOUNT_SID=...   # optional SMS
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=...
PORT=4000
NODE_ENV=production
```

### Web (`apps/web/.env.local`)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_APPLE_CLIENT_ID=...
```

### Admin (`apps/admin/.env.local`)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
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
