# Changelog — current sprint

> **Updated:** 2026-07-18 · **Commits on `jetvina`:** SMTP · ops smokes · web-admin · docs — [COMMIT_PLAN_GD2.md](./COMMIT_PLAN_GD2.md)

## Status

```text
Current phase: GĐ2 Dev complete
Current mode: Waiting for Owner
Repository: ready to commit (SAFE, no secrets in tree)
SMTP: BLOCKED_OWNER_SMTP (LOOPBACK)
```

## Canonical

- **T-S4-01:** Dev PASS · Production SMTP **BLOCKED_OWNER_SMTP** · Inbox **NOT RUN** · Overall **BLOCKED_OWNER**  
- **O3:** v3.1 **DEPLOYED / OPTIONAL_OWNER_REVIEW**  
- **O4:** single SMTP Owner item — [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)  
- **API sync:** Production **PASS 173=173** · Local Basic may **NEEDS_LOCAL_ENV_REFRESH**  
- **Latest quotes:** quote-ui **#42** · web-api **#41** (#37–#40 history)

## Prep after Owner

- [GD4_SANDBOX_READINESS.md](./GD4_SANDBOX_READINESS.md) — Payment / OAuth / SMS sandbox gaps (no fake prod)

## Session notes

- Re-audit BE local: API typecheck PASS; integration tests blocked by Docker/Postgres local.
- Re-matrix Admin/RBAC: [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md) là SoT mới cho roles, permission catalog, guard coverage, Admin UI và migration R1–R5.
- Gap P0 xác nhận thêm: login Admin chỉ nhận `ADMIN`; `403` bị coi session expired; Aircraft UI read-only; orphan content_* keys; `StaffGuard` dead.
- Added `host.docker.internal` to SMTP loopback denylist + env probe READY meta for real hosts.  
- `pnpm smoke:newsletter-smtp` wired in package.json.  
- Secret scan: SAFE (env key **names** in docs/scripts only).
