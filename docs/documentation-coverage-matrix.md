# Documentation coverage matrix — media / content-sync

Canonical status: [media-content-sync-status.md](./media-content-sync-status.md)

| Chủ đề | Policy | Architecture | Runbook | Test | Rollback | Status |
|--------|--------|--------------|---------|------|----------|--------|
| Media rights | [content-rights-policy.md](./content-rights-policy.md) | [jetvina-content-mapping.md](./jetvina-content-mapping.md) | [content-sync-runbook.md](./content-sync-runbook.md) | `test:media` / media-asset.spec | N/A | CURRENT |
| Logo rights | content-rights-policy + [public-branding-cleanup-final.md](./public-branding-cleanup-final.md) | brand-logo audit | runbook flags | brand tests | N/A | CURRENT |
| Remote review | content-rights-policy | media-content-sync-status | runbook | Playwright staging | N/A | CURRENT |
| Local mirror | RIGHTS.md under assets/jetvina | media-content-sync-status | `sync:jetvina-media` | validate manifest | N/A | CURRENT |
| Manifest | content-rights-policy | pass report | validate command | validate script | N/A | CURRENT |
| MediaAsset DB | content-rights-policy | schema + migration | runbook import | media-asset.integration | N/A | CURRENT |
| Media approval | content-rights-policy | Media Review UI | runbook | API smoke + Playwright Admin | N/A | CURRENT |
| Content discovery | [content-sync-workflow.md](./content-sync-workflow.md) | content-source-audit | runbook | discover smoke | N/A | CURRENT |
| Content preview | workflow | — | runbook | job items API | N/A | CURRENT |
| Content publish | rights-policy + workflow | publishJob staging-marker | runbook | publish E2E | [content-sync-rollback.md](./content-sync-rollback.md) | EXTENDING |
| Content rollback | rollback.md | ContentVersion | rollback.md | rollback E2E | rollback.md | EXTENDING |
| Permission matrix | rights-policy | permission.catalog | runbook | permission HTTP tests | N/A | EXTENDING |
| Audit Log | rights-policy | AuditService | runbook | media-asset tests | N/A | CURRENT |
| Production no-hotlink | rights-policy | next.config + resolver | status | Playwright production | N/A | CURRENT |
| Asset cleanup | [jetvina-media-jetbay-asset-audit.md](./jetvina-media-jetbay-asset-audit.md) | — | cleanup section | audit:asset-references | N/A | CURRENT |
| Feature flags | status §5 | .env.example | runbook | media env tests | N/A | CURRENT |
| Incident recovery | rollback.md | — | runbook | MISSING full DR drill | rollback | PARTIAL |
| Database setup | status §5 | CONTINUE_AT_HOME | runbook | migrate status | N/A | CURRENT (`jta_db` local) |
| Seed | status | seed.ts | runbook | seed ×2 | N/A | CURRENT |
| Admin UI | — | AdminShell media-review | runbook | Playwright Admin | N/A | EXTENDING |
| Browser E2E | — | — | status | staging/prod/admin | N/A | EXTENDING |

## Doc classification (media/content-sync set)

| File | Classification |
|------|----------------|
| media-content-sync-status.md | **CURRENT_SOURCE_OF_TRUTH** |
| media-gap-audit.md | CURRENT_SUPPORTING_DOC |
| jetvina-media-pass-report.md | CURRENT_SUPPORTING_DOC (detail report) |
| content-rights-policy.md | CURRENT_SUPPORTING_DOC |
| content-sync-workflow.md | CURRENT_SUPPORTING_DOC |
| content-sync-runbook.md | CURRENT_SUPPORTING_DOC |
| content-sync-rollback.md | CURRENT_SUPPORTING_DOC |
| jetvina-content-mapping.md | CURRENT_SUPPORTING_DOC |
| jetvina-media-jetbay-asset-audit.md | CURRENT_SUPPORTING_DOC |
| documentation-coverage-matrix.md | CURRENT_SUPPORTING_DOC |
| public-branding-cleanup-final.md | CURRENT_SUPPORTING_DOC |
| content-source-audit.md | HISTORICAL / early audit — superseded numbers in status file |
| jetbay-cleanup-audit.md | HISTORICAL — early cleanup plan |
| brand-logo-icon-image-audit.md | CURRENT_SUPPORTING_DOC (logo) |
| JETBAY_BAO_GIA.md / DANH_GIA | HISTORICAL sales/tech scope — not runtime how-to |
