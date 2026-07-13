# Content sync rollback

> Current status: [media-content-sync-status.md](./media-content-sync-status.md)

## What rollback does

1. Every brand settings change writes `ContentVersion` (`entityType=SiteSetting`, `entityId=brand`).
2. Successful publish gate writes `ContentVersion` for `ContentSyncJob` (`mode: STAGING_MARKER`).
3. `POST /admin/content-sync/jobs/:id/rollback` (permission `content_sync.rollback`) writes a `ROLLBACK_MARKER` version, sets job `mode=ROLLBACK` / `status=CANCELLED`, and **preserves** all prior versions.
4. Sync never auto-deletes CMS articles; restore from `ContentVersion` / DB backup.
5. Booking/user/payment tables are out of scope — never rolled back by content jobs.

## API

| Endpoint | Permission | Notes |
|----------|------------|--------|
| `POST /admin/content-sync/jobs/:id/publish` | `content_sync.publish` | Requires `CONTENT_SYNC_PUBLISH_ENABLED=true`; staging marker only |
| `POST /admin/content-sync/jobs/:id/rollback` | `content_sync.rollback` | Fails if no publish version; fails if latest is already rollback |

## Tests

```bash
pnpm test:content-sync-publish
pnpm test:content-sync-rollback
```

```powershell
# DB backup before cutover (example)
# pg_dump $DATABASE_URL > backup-pre-content-$(Get-Date -Format yyyyMMdd).sql
```
