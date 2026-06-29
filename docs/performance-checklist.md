# Performance Checklist

- [x] API pagination on listing endpoints
- [x] Next.js `revalidate: 30` on public API fetches
- [x] Prisma indexes on slug/status (via schema)
- [ ] Lighthouse audit (run manually)
- [ ] Image optimization (placeholder URLs only)
- [ ] Redis caching (requires Docker)

Run locally: `pnpm dev` then test http://localhost:3000/en
