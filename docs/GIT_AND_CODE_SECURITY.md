# Git & code security — JetBay / JetVina

> **Updated:** 2026-07-15 · Complements [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) · [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)

## Goals

1. **Never** commit `.env`, private keys, or live provider secrets.  
2. Fail fast locally (pre-commit) and in CI.  
3. Keep dependency/security patches flowing via Dependabot.  
4. Agents/docs teach the same rules as CI.

## Local setup (every clone)

```bash
pnpm install
pnpm security:hooks          # sets core.hooksPath → scripts/git-hooks
pnpm security:scan           # staged files
pnpm security:scan:all       # whole tree (slow / CI)
```

Pre-commit runs:

```text
node scripts/security/scan-secrets.mjs --staged
```

Hook **never prints secret values** — only `file` + `rule` id. Bypass (emergency only):

```bash
git commit --no-verify   # discouraged; fix findings instead
```

## What is blocked

| Rule id (examples) | Meaning |
|--------------------|---------|
| `env-file` | Staged `.env` / `.env.*` (not `.example`) |
| `private-key` | PEM / OpenSSH private key blocks |
| `stripe-live-secret` | `sk_live_…` |
| `github-pat` | `ghp_…` |
| `database-url-with-password` | `DATABASE_URL=postgres://user:pass@…` |
| `smtp-password-assignment` | Hard-coded `SMTP_PASSWORD='…'` |

Docs and `.env.example` are allowlisted for **key names** only.

## CI

`.github/workflows/ci.yml`:

1. Job `security` — `pnpm security:scan:all` (required) + `pnpm audit --audit-level=high` (warn).  
2. Job `build` — existing build/tests.  
3. Triggers: `main` / `develop` / **`jetvina`**.

Dependabot: `.github/dependabot.yml` (npm weekly + Actions monthly).

## GitHub repo settings (Owner — UI)

Recommended (Settings → Branches → Protect `main` / `jetvina`):

- [ ] Require PR before merge  
- [ ] Require status checks: `security` + `build`  
- [ ] Require linear history (optional)  
- [ ] Restrict force-push  
- [ ] Do **not** allow bypass without 2FA  

Settings → Secrets: use Actions secrets for any future deploy automation — never paste prod `.env` into Issues/PR.

## Code hardening already in product

| Control | Where |
|---------|--------|
| `X-API-Key` + timing-safe compare | API guards |
| ValidationPipe `whitelist` + `forbidNonWhitelisted` | `main.ts` |
| Throttle quotes / auth | Nest throttler + Nginx |
| Swagger Basic (prod) | docs.minhtien.online |
| SMTP loopback block / catcher ≠ deliverable | `smtp-config.ts` |
| Production boot rejects `CHANGE_ME` secrets | API bootstrap |
| `security.txt` | web `/.well-known/security.txt` |

## Agent / Spec Kit

Cursor rule: `.cursor/rules/jetbay-security.mdc`  
Constitution: `.specify/memory/constitution.md` § IV secrets  

## Rotate after leak

If a secret was ever committed: follow [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) rotate scripts · revoke provider keys · purge history only with Owner approval (`git filter-repo` / support).

### 2026-07-15 — baocaotiendo credentials

Public page previously embedded rotated demo + Swagger Basic passwords in `apps/web/.../progress-report.ts` (also live on www).  
**Remediation:** stripped from Git + web redeployed. **Rotated 2026-07-15** via `rotate-demo-swagger.sh` → `/root/backups/jetbay-security-ops-20260715-165745/demo-passwords.txt`.  
PM2 pitfall fixed: export `SWAGGER_BASIC_*` before `pm2 restart --update-env` (`fix-swagger-pm2-env.sh`). Never recommit plaintext passwords.
