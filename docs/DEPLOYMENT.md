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
pnpm start
```

## Environment variables

### API (`apps/api/.env`)

```
DATABASE_URL=postgresql://...
PORT=4000
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

### Web / Admin

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Production checklist

1. Replace demo auth with JWT + bcrypt
2. Add `AdminGuard` on `/admin/*`
3. Enable Helmet + rate limiting (see `SECURITY.md`)
4. Use HTTPS and secure cookie storage
5. Run `pnpm build` for all apps before deploy
6. Set `NODE_ENV=production`

## Build commands

```bash
pnpm install
pnpm --filter api prisma:generate
pnpm build          # builds web, admin, api
pnpm test:e2e       # Playwright smoke tests
```
