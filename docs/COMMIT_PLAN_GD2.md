# Commit plan — GĐ2 closure pack (2026-07-15)

> **Commit performed:** YES — 4 commits on `jetvina` (2026-07-15)  
> **Branch:** `jetvina` · **Base HEAD:** `a15b270`  
> **Secret scan:** PASS (docs name env keys only; scripts read local/VPS `.env` without printing values)

## Recommended: 4 commits

### Commit 1 — `feat(api): guard invalid production SMTP configuration`

```text
apps/api/src/utils/smtp-config.ts
apps/api/src/utils/smtp-config.spec.ts
apps/api/src/services/email.service.ts
apps/api/src/services/integrations-status.service.ts
apps/api/src/services/content.service.ts
scripts/smoke-newsletter-smtp-flag.mjs
```

Tests: `jest --testPathPatterns=smtp-config` · `pnpm smoke:newsletter-smtp`

### Commit 2 — `test(ops): add production smoke and environment probes`

```text
scripts/smoke-html-probe.mjs
scripts/smoke-quote-ui.mjs
scripts/smoke-api-sync.mjs
scripts/deploy/jetbay-be/run-smoke-api-sync-remote.sh
scripts/deploy/jetbay-be/env-presence-check.py
scripts/deploy/jetbay-be/backup-restore-drill.sh
package.json   # smoke:* scripts only (or full package.json if shared with commit 1)
```

Tests: `pnpm smoke:html-probe` · `pnpm smoke:quote-ui` · remote api-sync 173=173

### Commit 3 — `fix(web-admin): GĐ2 UX polish and lint hygiene`

```text
apps/web/** (account, home, quote, charter, news, loadApi, ApiLoadNotice, AirportInput, styles, baocaotiendo)
apps/admin/** (AdminAuthGate, email-templates, operators)
packages/i18n/src/messages.ts
apps/api/src/content-sync/media-asset.integration.spec.ts
```

Tests: `pnpm lint` · `pnpm typecheck` · `pnpm test:media` · `pnpm build` · `pnpm test:api`

### Commit 4 — `docs: finalize GĐ2 handoff and owner actions`

```text
AGENTS.md
docs/CONTINUE_AT_HOME.md
docs/JETBAY_WORK_PLAN.md
docs/OWNER_NEXT_ACTIONS.md
docs/OWNER_ACTION_ITEMS.md
docs/GD2_ROADMAP.md
docs/NEXT_SPRINT_PLAN.md
docs/TEST_MATRIX.md
docs/API_SYNC_SMOKE.md
docs/SMTP_SETUP_GUIDE.md
docs/BLOCKERS_AND_DEPENDENCIES.md
docs/PROJECT_STATUS_REPORT_3_1.md
docs/CHANGELOG_CURRENT_SPRINT.md
docs/GD4_SANDBOX_READINESS.md
docs/ADMIN_OPS_GUIDE.md
docs/CHARTER_CMS_MAP.md
docs/UAT_CHECKLIST.md
docs/WEB_API_SURFACE_MAP.md
docs/ACCEPTANCE_CRITERIA_GD1.md
docs/DATABASE_BACKUP_RESTORE.md
docs/DEPLOYMENT_CHECKLIST.md
docs/ENVIRONMENT_VARIABLES.md
docs/PRODUCTION_RUNBOOK.md
+ this file
```

## Alternative: single commit

```text
chore: finalize GĐ2 production readiness and owner handoff
```

Use if repo prefers one PR.

## EXCLUDE from commit

| Path | Reason |
|------|--------|
| `apps/*/.env` / `.env.local` | Secrets (not in tree) |
| DB dumps / `/root/backups/*` | Never |
| Production logs | Never |
| Local IDE / OS junk | N/A none found |

## Notes

- All listed untracked GĐ2 docs/scripts are **COMMIT**.  
- No generated build artifacts in this dirty tree.  
- After commit: redeploy API if SMTP guard (`host.docker.internal`) not yet on VPS (prod currently still LOOPBACK regardless).
