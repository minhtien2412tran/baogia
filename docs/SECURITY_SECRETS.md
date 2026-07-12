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
| Admin | `admin@jetbay.local` | `Admin123!` |
| User | `demo@jetbay.local` | `Demo123!` |
| Staff (AS scope) | `staff-asia@jetbay.local` | `Staff123!` |

These are **seed passwords**, not env secrets. Rotate user passwords separately before customer handover.

## DocuSign (CR Wave 5)

| Env | Purpose |
|-----|---------|
| `DOCUSIGN_MODE` | `mock` (default) or `live` |
| `DOCUSIGN_INTEGRATION_KEY` | Integration Key (live) |
| `DOCUSIGN_USER_ID` | Impersonated user GUID |
| `DOCUSIGN_ACCOUNT_ID` | Account ID |
| `DOCUSIGN_PRIVATE_KEY` | RSA private key PEM (JWT grant) |
| `DOCUSIGN_BASE_URL` | e.g. `https://demo.docusign.net` |
| `DOCUSIGN_WEBHOOK_SECRET` | Optional HMAC for Connect webhook |

Never commit real DocuSign keys. Mock mode is enough for local smoke.

## Related docs

- [JETBAY_SECURITY_VS_FEATURES.md](./JETBAY_SECURITY_VS_FEATURES.md) — bảo mật tham khảo HomeFix × chức năng theo báo giá  
- [JETBAY_VPS_DEPLOY.md](./JETBAY_VPS_DEPLOY.md) — deploy runbook  
- [API.md](./API.md) — Swagger / OpenAPI URLs  
- [JETBAY_INTEGRATIONS_STATUS.md](./JETBAY_INTEGRATIONS_STATUS.md) — readiness flags (no secret values)
