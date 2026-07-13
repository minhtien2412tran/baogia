# Content sync runbook

```powershell
# Install
pnpm install

# Generate + migrate (needs Postgres)
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed

# Seed JetVina reference source (admin JWT)
# POST /admin/content-sources/seed-jetvina-reference

# Test connection
# POST /admin/content-sources/:id/test-connection

# Dry-run discover
# POST /admin/content-sync/discover  { "sourceId": 1, "dryRun": true }

# MediaAsset review (admin JWT + permissions)
# GET  /admin/media-assets?rightsStatus=UNVERIFIED
# POST /admin/media-assets/:id/approve-staging
# POST /admin/media-assets/:id/approve-production   # must fail for UNVERIFIED
# GET  /content/media-assets                        # public: approved only
# Admin UI: /dashboard/media-review

# FE JetVina media (apps/web)
pnpm manifest:jetvina-media
pnpm sync:jetvina-media --dry-run --limit=5
pnpm validate:jetvina-media-manifest
pnpm audit:asset-references
pnpm test:media
pnpm test:e2e:media-staging
pnpm test:e2e:media-production

# Unit / integration tests
cd apps/api
pnpm exec jest --testPathPatterns="url-safety|brand-public|media-asset|api-key.guard"

# Build
pnpm --filter @jetbay/api exec nest build
```

Publish stays off until `CONTENT_SYNC_PUBLISH_ENABLED=true` and rights review complete.  
JetVina FE production hotlink stays off until written rights + `JETVINA_MEDIA_PRODUCTION_ENABLED=true`.

## Not yet automated in this runbook

- Content sync **publish** + **rollback** E2E (gate still off by default)
- Playwright **Admin** Media Review browser login flow
- Wiring `pnpm sync:jetvina-media` file mirrors → `MediaAsset` DB rows (currently FE manifest + seed fixtures)
