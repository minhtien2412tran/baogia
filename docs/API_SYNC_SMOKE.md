# API Sync smoke guide

> **Updated:** 2026-07-15

## Modes

| SYNC_MODE | Behavior |
|-----------|----------|
| `auto` (default) | Try local; on failure compare prod↔docs |
| `full` | Local required |
| `prod-docs` | Skip local; prod↔docs only |

## Credentials

OpenAPI is protected by HTTP Basic (`SWAGGER_BASIC_USER` / `SWAGGER_BASIC_PASSWORD`).

- Do **not** commit secrets.
- Prefer running on VPS:

```bash
# from repo or after sync-api
scp scripts/smoke-api-sync.mjs root@VPS:/tmp/
bash scripts/deploy/jetbay-be/run-smoke-api-sync-remote.sh
# Exit 0 = PASS (prod paths == docs paths)
```

- Local laptop:

```powershell
$env:SYNC_MODE='prod-docs'
$env:SWAGGER_BASIC_USER='...'   # set from VPS .env yourself
$env:SWAGGER_BASIC_PASSWORD='...'
pnpm smoke:api-sync
```

Exit codes: `0` PASS · `1` fail/mismatch · `2` `BLOCKED_OWNER_CREDENTIAL`.

## Evidence 2026-07-15

| Check | Status |
|-------|--------|
| **Production API sync** | **PASS — 173=173** (VPS `run-smoke-api-sync-remote.sh`) |
| **Local convenience credential** | **NEEDS_LOCAL_ENV_REFRESH** if laptop Basic is stale (exit 2) — not a production blocker |
