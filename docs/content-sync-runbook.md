# Content sync runbook

```powershell
# Install
pnpm install

# Generate + migrate (needs Postgres)
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy

# Seed JetVina reference source (admin JWT)
# POST /admin/content-sources/seed-jetvina-reference

# Test connection
# POST /admin/content-sources/:id/test-connection

# Dry-run discover
# POST /admin/content-sync/discover  { "sourceId": 1, "dryRun": true }

# Unit tests
cd apps/api
pnpm exec jest --testPathPatterns="url-safety|pricing.engine|permission.service"

# Build
pnpm --filter @jetbay/api exec nest build
```

Publish stays off until `CONTENT_SYNC_PUBLISH_ENABLED=true` and rights review complete.
