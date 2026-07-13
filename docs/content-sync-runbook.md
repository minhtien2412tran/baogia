# Content sync runbook

> Canonical status: [media-content-sync-status.md](./media-content-sync-status.md)

```powershell
# Install
pnpm install

# Generate + migrate (needs Postgres — local DB name may be jta_db)
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed

# Seed JetVina reference source (admin JWT)
# POST /admin/content-sources/seed-jetvina-reference

# Test connection
# POST /admin/content-sources/:id/test-connection

# Dry-run discover
# POST /admin/content-sync/discover  { "sourceId": 1, "dryRun": true }

# Publish / rollback (APP_ENV=test only; CONTENT_SYNC_PUBLISH_ENABLED=true)
# POST /admin/content-sync/jobs/:id/publish
# POST /admin/content-sync/jobs/:id/rollback

# MediaAsset review (admin JWT + permissions)
# GET  /admin/media-assets?rightsStatus=UNVERIFIED
# POST /admin/media-assets/:id/approve-staging
# POST /admin/media-assets/:id/approve-production   # must fail for UNVERIFIED
# POST /admin/media-assets/import-manifest          # requires EXTERNAL_MEDIA_IMPORT_ENABLED + content_media.sync
# GET  /content/media-assets                        # public: approved only
# Admin UI: /dashboard/media-review

# FE JetVina media (apps/web)
pnpm manifest:jetvina-media
pnpm sync:jetvina-media --dry-run --limit=5
pnpm import:jetvina-media --dry-run
pnpm validate:jetvina-media-manifest
pnpm audit:asset-references
pnpm audit:docs
pnpm test:media
pnpm test:e2e:media-staging
pnpm test:e2e:media-production
pnpm test:e2e:admin-media

# Unit / integration tests
pnpm test:content-sync-publish
pnpm test:content-sync-rollback
pnpm test:media-import-db
pnpm test:media-permissions
cd apps/api
pnpm exec jest --testPathPatterns="url-safety|brand-public|media-asset|api-key.guard"

# Build
pnpm --filter @jetbay/api exec nest build
```

Publish stays off until `CONTENT_SYNC_PUBLISH_ENABLED=true` and rights review complete.  
JetVina FE production hotlink stays off until written rights + `JETVINA_MEDIA_PRODUCTION_ENABLED=true`.

## Feature flags

| Flag | Package | Default prod | Notes |
|------|---------|--------------|--------|
| `NEXT_PUBLIC_PREFER_JETVINA_MEDIA` | web (client) | prefer off | Not a security boundary alone |
| `JETVINA_MEDIA_REMOTE_REVIEW_ENABLED` | web | **false** | Staging remote review only |
| `JETVINA_MEDIA_LOCAL_MIRROR_ENABLED` | web | true | Approved/local mirrors |
| `JETVINA_MEDIA_PRODUCTION_ENABLED` | web | **false** | Requires written rights |
| `CONTENT_SYNC_ENABLED` | api | true | Discovery/preview |
| `CONTENT_SYNC_PUBLISH_ENABLED` | api | **false** | Staging marker publish |
| `EXTERNAL_MEDIA_IMPORT_ENABLED` | api | **false** | Manifest → MediaAsset |
| `JETVINA_OFFICIAL_LOGO_ENABLED` | api/web | **false** | Official logo gate |

Restart web/api after changing flags (Next inlines `NEXT_PUBLIC_*` at build/dev start).
