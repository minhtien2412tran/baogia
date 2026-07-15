# Database Backup & Restore

> **Updated:** 2026-07-14 · **Status:** DRILL **PASS** (prod)  
> **DB prod:** `jetbay_db` (VPS) · Local docker `jetbay_db`

## Script

`scripts/deploy/jetbay-be/backup-restore-drill.sh` trên VPS:

```bash
bash /var/www/jetbay-be/deploy/backup-restore-drill.sh
# hoặc chỉ backup:
DRY_RUN_ONLY=1 bash /var/www/jetbay-be/deploy/backup-restore-drill.sh
```

Dùng `sudo -u postgres` (app role thường không CREATE DATABASE). Strip Prisma `?schema=`.

## Evidence 2026-07-14

| Step | Result |
|------|--------|
| Dump | `/root/backups/jetbay-db/jetbay-20260714-145739.dump` (252K) |
| Prod Airport COUNT | 120 |
| Restore → `jetbay_db_restore_test` COUNT | 120 |
| Drop test DB | OK |
| Log | `/root/backups/jetbay-db/drill-20260714-145739.log` |
| Verdict | **PASS** |

Cron đề xuất: daily 02:00 chạy backup (DRY_RUN_ONLY=1) + weekly full drill.

## Không

- Không restore đè prod khi chưa được Owner approve.  
- Không commit dump chứa PII lên git.
