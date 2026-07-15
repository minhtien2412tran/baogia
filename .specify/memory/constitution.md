# JetVina / JetBay Constitution

> Spec Kit project principles. Source of progress: `docs/CONTINUE_AT_HOME.md` · `AGENTS.md`.  
> Spec Kit version aligned with CLI: see `.specify/integration.json`.

## Core Principles

### I. Product boundary
The main product is the **jetbay.com clone** in `apps/web` (prod www.minhtien.online).  
`m-tien.com/jet-bay` and `m-tien.com/app-jetbay` are sales/quote landings only — not the product UI.

### II. Feature scope
Ship features only from `docs/JETBAY_BAO_GIA.md` + `docs/JETBAY_DANH_GIA_KY_THUAT.md`.  
Do not invent HomeFix CRM/marketplace capabilities. Security patterns may mirror HomeFix; secrets/DB/ports stay JetBay-only.

### III. Monorepo surface discipline
| Path | Role | Branch prefix |
|------|------|---------------|
| `apps/web/` | Public FE | `feat/web-*` |
| `apps/api/` | Nest API | `feat/api-*` |
| `apps/admin/` | CMS dashboard | `feat/admin-*` |
| `packages/ui/` | `@jetbay/ui` | with consumer |
| `docs/` | Specs & progress | with related feature |

Prefer one concern per PR. Do not mix web/api/admin concerns without need.

### IV. Secrets & production safety
Never commit `.env`, `.env.local`, API keys, DB passwords, Stripe/Twilio/SMTP secrets.  
Never print production secrets in chat, logs, or docs.  
Do not mark SMTP / payment / OAuth / SMS as PASS without real provider + inbox/sandbox verification.

### V. Progress board is source of truth
Chat sessions do not remember progress. Before coding: read `docs/CONTINUE_AT_HOME.md` (+ product map).  
After meaningful work: update CONTINUE + related checklist. Do not invent status from conversation.

### VI. Spec-driven workflow (Spec Kit)
For new non-trivial work prefer:

1. `/speckit-constitution` — refresh principles if product rules change  
2. `/speckit-specify` — baseline specification  
3. `/speckit-plan` — implementation plan  
4. `/speckit-tasks` — actionable tasks  
5. `/speckit-implement` — execute  
Optional: `/speckit-clarify` · `/speckit-analyze` · `/speckit-checklist` · `/speckit-converge`

## Constraints

- UI package: `@jetbay/ui` when sharing components.  
- Production API: `https://api.minhtien.online` · Admin: `https://admin.minhtien.online`.  
- GĐ2 SMTP: loopback/Mailpit catcher ≠ real customer inbox (T-S4-01 stays Owner-blocked until real `SMTP_*`).  
- GĐ4 integrations: sandbox keys only until UAT signed — no fake production payments.

## Development Workflow

1. Align branch prefix with app surface.  
2. Run relevant unit/smoke before calling work done.  
3. Deploy via repo scripts (`sync-api.ps1` / `deploy-*.sh`) with `DEPLOY_CONFIRM` — never overwrite VPS `.env`.  
4. Commit only when explicitly asked; no force-push to main.

## Governance

Amendments to this constitution must stay consistent with `AGENTS.md` and Owner handoff docs.  
When Spec Kit templates conflict with JetBay hard rules, **JetBay rules win**.
