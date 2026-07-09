# Performance Checklist

- [x] API pagination on listing endpoints
- [x] Next.js `revalidate: 30` on public API fetches
- [x] Prisma indexes on slug/status (via schema)
- [x] Rate limiting (`@nestjs/throttler` on API)
- [x] Redis service + health ping (`REDIS_URL`)
- [ ] Redis cache on hot read endpoints (optional next step)
- [ ] Lighthouse audit (run manually)
- [ ] Image optimization (Next.js `next/image` for all CDN assets)

Run locally:

```bash
docker compose up -d   # Postgres, Redis, MinIO, Mailpit
pnpm install
pnpm --filter @jetbay/api prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed
pnpm dev
```

Then test http://localhost:3000/en-us
