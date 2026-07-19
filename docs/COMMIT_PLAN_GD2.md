# Commit plan — GĐ2 closure (updated 2026-07-15 evening)

> **Main pack commit status:** DONE on `jetvina`  
> **Base:** `a15b270` → **HEAD pack end historically:** through `fb6e5ae` (4 commits) + follow-ups  
> **Current HEAD at audit start:** `b9dce75` (clean)  
> **This audit residual:** committed with Spec Kit pack (see git log after `b9dce75`)

## Already committed (history `a15b270..b9dce75`)

| Hash | Message |
|------|---------|
| `498ecb7` | feat(api): guard invalid production SMTP configuration |
| `b916d85` | test(ops): add production smoke and environment probes |
| `f4336af` | fix(web-admin): GĐ2 UX polish and lint hygiene |
| `fb6e5ae` | docs: finalize GĐ2 handoff and owner actions |
| `1b587db` | feat(api): enable Mailpit catcher on production loopback |
| `2752a1d` | feat(api): auto sales alert and offer/cancel emails for quotes |
| `7faace3` | feat(api): enhance enquiry and quote email handling with localization |
| `98ccdec` | feat(api, web): add locale support for enquiry forms and email templates |
| `b9dce75` | feat(api, web): enhance EmptyLeg DTOs and error handling in alerts form |

Secret scan (meta, 141 files in recent range): **PASS** — no committed `.env`; docs/.env.example only **REVIEW** (key names, SAFE).

## Residual commit (optional, this audit)

```text
chore(ops): default html-probe args and GĐ2 prod recheck script
```

| File | Action |
|------|--------|
| `package.json` | `smoke:html-probe` defaults → baocaotiendo `3.1` `14/07` |
| `docs/WEB_API_SURFACE_MAP.md` | Canonical SMTP / API sync wording |
| `scripts/deploy/jetbay-be/gd2-prod-recheck.sh` | Safe prod HTTP + smtp flags (no secrets) |
| `scripts/scan-commit-secrets-meta.mjs` | Meta secret name scan for future handoffs |
| `docs/CONTINUE_AT_HOME.md` | Audit closure notes (if updated) |
| `docs/COMMIT_PLAN_GD2.md` | This file |

**Exclude:** `.env*`, DB dumps, VPS logs, production secrets.

```text
Residual + Spec Kit: committing on explicit Owner/Dev instruction (2026-07-15).
```

**Verified 2026-07-19:** residual files present on HEAD after `b243bc8` (html-probe defaults, `gd2-prod-recheck.sh`, secret-scan meta) — no further residual commit needed.
