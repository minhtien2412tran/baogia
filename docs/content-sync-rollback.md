# Content sync rollback

1. Every brand settings change writes `ContentVersion` (`entityType=SiteSetting`, `entityId=brand`).
2. Successful publish gate writes `ContentVersion` for `ContentSyncJob`.
3. To rollback brand: `PATCH /admin/site-settings/brand` with previous version `data`.
4. Sync never auto-deletes CMS articles; restore from `ContentVersion` / DB backup.
5. Booking/user/payment tables are out of scope — never rolled back by content jobs.

```powershell
# DB backup before cutover (example)
# pg_dump $DATABASE_URL > backup-pre-content-$(Get-Date -Format yyyyMMdd).sql
```
