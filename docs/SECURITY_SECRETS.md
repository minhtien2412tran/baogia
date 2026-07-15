# Jet-Bay — Secrets & Environment Security

**Rule:** Never commit `.env`, never print secrets in logs/chat, never copy secrets from Backend cũ (`baotienweb-api`).

## Files

| File | Commit? | Purpose |
|------|---------|---------|
| `apps/api/.env.example` | ✅ | Safe placeholders only |
| `apps/api/.env` | ❌ | Local secrets (gitignored) |
| `scripts/deploy/jetbay-be/env.production.template` | ✅ | Prod template with `CHANGE_ME_*` |
| `/var/www/jetbay-be/.env` | ❌ on server | Production secrets, `chmod 600` |

## Generate local secrets

```bash
node scripts/generate-local-env.mjs
node scripts/sync-frontend-api-key.mjs   # copy API_KEY → web/admin NEXT_PUBLIC_API_KEY
```

Creates `apps/api/.env` with random `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `API_KEY`, `PAYMENT_SECRET`.

Clients must send header `X-API-Key` (same value as `API_KEY`). After rotating prod secrets, run on VPS:

```bash
bash /var/www/jetbay-be/deploy/sync-admin-api-key.sh
# then rebuild/restart jetbay-admin
```

## Rotate production secrets (VPS)

```bash
# From repo (uploads script) then on VPS:
scp scripts/deploy/jetbay-be/rotate-secrets.sh root@103.200.20.100:/var/www/jetbay-be/deploy/
ssh root@103.200.20.100 'bash /var/www/jetbay-be/deploy/rotate-secrets.sh'
```

Rotates: `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `API_KEY`, `PAYMENT_SECRET`, PostgreSQL `jetbay_user` password + `DATABASE_URL`.  
Backs up previous `.env` under `/root/backups/jetbay-secrets-*` (not printed).  
Truncates refresh tokens → users must login again.  
Restarts PM2 `jetbay-be` and smoke-checks `/health` + `/auth/login`.

## Production boot guards

With `APP_ENV=production`, API refuses to start if JWT/refresh/API_KEY/PAYMENT_SECRET/DATABASE_URL are missing or still placeholders (`CHANGE_ME`, `change-in-production`).

## Demo accounts (change on handover)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@jetbay.local` | **rotated 2026-07-15** — VPS `/root/backups/jetbay-security-ops-20260715-165745/demo-passwords.txt` |
| User | `demo@jetbay.local` | **rotated 2026-07-15** — same file |
| Swagger Basic | `SWAGGER_BASIC_USER` | **rotated 2026-07-15** — same file · script `deploy/rotate-demo-swagger.sh` |

Seed defaults `Admin123!` / `Demo123!` **no longer valid** on prod after rotation.

## Git hooks & CI

See **[GIT_AND_CODE_SECURITY.md](./GIT_AND_CODE_SECURITY.md)** — `pnpm security:hooks` · `pnpm security:scan` · CI secret scan + Dependabot.

## Related docs

- [GIT_AND_CODE_SECURITY.md](./GIT_AND_CODE_SECURITY.md) — pre-commit, CI, GitHub branch protection  
- [JETBAY_SECURITY_VS_FEATURES.md](./JETBAY_SECURITY_VS_FEATURES.md) — bảo mật tham khảo HomeFix × chức năng theo báo giá  
- [JETBAY_VPS_DEPLOY.md](./JETBAY_VPS_DEPLOY.md) — deploy runbook  
- [API.md](./API.md) — Swagger / OpenAPI URLs  
- [JETBAY_INTEGRATIONS_STATUS.md](./JETBAY_INTEGRATIONS_STATUS.md) — readiness flags (no secret values)
