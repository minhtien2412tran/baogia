# Production Runbook (short)

> **Updated:** 2026-07-14 · **Status:** CURRENT short form  
> Chi tiết deploy: [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md) · [JETBAY_VPS_DEPLOY.md](./JETBAY_VPS_DEPLOY.md)

## Surfaces

| Role | URL | Process |
|------|-----|---------|
| API | https://api.minhtien.online | PM2 `jetbay-be` :3010 |
| Web | https://www.minhtien.online | PM2 `jetbay-web` :3012 |
| Admin | https://admin.minhtien.online | PM2 `jetbay-admin` |
| Docs | https://docs.minhtien.online/swagger | Basic auth |

## Health

```bash
curl -s https://api.minhtien.online/health
curl -s https://api.minhtien.online/integrations/status
```

## After API deploy

```bash
bash /var/www/jetbay-be/deploy/smoke-all.sh
# or minimum:
node scripts/deploy/jetbay-be/smoke-web-api.mjs   # from CI/laptop with API_URL=prod
```

## After Web deploy (Windows laptop)

```powershell
powershell -File scripts/deploy/jetbay-be/sync-web.ps1
ssh root@VPS "export DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'; bash /var/www/jetbay-web/deploy/deploy-web.sh"
```

**Do not deploy without Owner/Dev confirm.** Rollback = restore previous PM2 release / backup dir under `/root/backups/`.

## Incidents

| Symptom | Check |
|---------|-------|
| Admin cannot reach API | Bake URL in admin build |
| Mail not arriving | SMTP_SETUP_GUIDE |
| 401 Swagger | Basic user/pass VPS backup |
| Quote 400 | Body `legs[].passengers` |
