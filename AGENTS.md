# JETBAY — Agent instructions (git-tracked)

Chat sessions do **not** remember progress. Before coding, read and update the files below.

**Product first:** official KH site = **[https://jetvina.com/](https://jetvina.com/)** (JetVina). Demo/platform code lives in `apps/web` — prod https://www.minhtien.online/en-us · local `:3000`.  
`m-tien.com/jet-bay` and `m-tien.com/app-jetbay` are **sales/quote landings only** — not the KH site. See [docs/JETBAY_PRODUCT_MAP.md](./docs/JETBAY_PRODUCT_MAP.md).

## Progress board (source of truth)

| Doc | Purpose |
|-----|---------|
| [docs/CONTINUE_AT_HOME.md](./docs/CONTINUE_AT_HOME.md) | **Where we left off** — start here on a new machine |
| [docs/NEXT_SPRINT_PLAN.md](./docs/NEXT_SPRINT_PLAN.md) | **Sprint plan** — Web↔API · sync · docs · việc KH |
| [docs/WEB_API_SURFACE_MAP.md](./docs/WEB_API_SURFACE_MAP.md) | Web/Admin ↔ API status matrix |
| [docs/OWNER_ACTION_ITEMS.md](./docs/OWNER_ACTION_ITEMS.md) | Việc chủ dự án phải làm |
| [docs/OWNER_NEXT_ACTIONS.md](./docs/OWNER_NEXT_ACTIONS.md) | **Owner handoff pack** (P0 SMTP → UAT/CMS/G4) |
| [docs/GD4_SANDBOX_READINESS.md](./docs/GD4_SANDBOX_READINESS.md) | GĐ4 sandbox gap checklist (prep only) |
| [docs/ORDER_EMAIL_AUTOMATION.md](./docs/ORDER_EMAIL_AUTOMATION.md) | Nhận đơn / gửi mail auto·bán tự động |
| [docs/COMMIT_PLAN_GD2.md](./docs/COMMIT_PLAN_GD2.md) | GĐ2 dirty-tree commit plan |
| [docs/GD2_ROADMAP.md](./docs/GD2_ROADMAP.md) | GĐ2 tasks P0–P3 + page priority |
| [docs/CHARTER_CMS_MAP.md](./docs/CHARTER_CMS_MAP.md) | Charter ×6 static vs CMS slugs |
| [docs/TEST_MATRIX.md](./docs/TEST_MATRIX.md) | Test commands + evidence |
| [docs/API_SYNC_SMOKE.md](./docs/API_SYNC_SMOKE.md) | OpenAPI prod↔docs sync + Basic |
| [docs/BE_AUDIT.md](./docs/BE_AUDIT.md) | **Backend audit** — domain-by-domain status / gaps / smoke |
| [docs/BE_TEST.md](./docs/BE_TEST.md) | **Backend test** — smoke scripts, ma trận case ↔ domain |
| [docs/BE_ARCHITECTURE.md](./docs/BE_ARCHITECTURE.md) | Nest module target layout + refactor phases |
| [docs/ONBOARDING_NHAN_VIEN.md](./docs/ONBOARDING_NHAN_VIEN.md) | Full clone + setup for new teammates |
| [docs/SPEC_KIT.md](./docs/SPEC_KIT.md) | **Spec Kit** — `specify` CLI + Cursor `/speckit-*` skills |
| [docs/GIT_AND_CODE_SECURITY.md](./docs/GIT_AND_CODE_SECURITY.md) | **Git/code security** — secret scan, hooks, CI, Dependabot |
| [docs/JETBAY_PRODUCT_MAP.md](./docs/JETBAY_PRODUCT_MAP.md) | Product vs báo giá — architecture map |
| [docs/JETBAY_WEB_PAGE_DOD.md](./docs/JETBAY_WEB_PAGE_DOD.md) | Clone page DoD |
| [docs/JETBAY_DELIVERY_CHECKLIST.md](./docs/JETBAY_DELIVERY_CHECKLIST.md) | Delivery DoD G0–G4 + App gate |
| [docs/JETBAY_BAO_GIA.md](./docs/JETBAY_BAO_GIA.md) | Báo giá (collateral / scope & price) |
| [docs/JETBAY_DANH_GIA_KY_THUAT.md](./docs/JETBAY_DANH_GIA_KY_THUAT.md) | Feature tree & ma trận kỹ thuật |
| [docs/JETBAY_SECURITY_VS_FEATURES.md](./docs/JETBAY_SECURITY_VS_FEATURES.md) | Security from HomeFix patterns × features from báo giá only |
| [docs/SECURITY_SECRETS.md](./docs/SECURITY_SECRETS.md) | Env / rotate secrets (never commit real `.env`) |
| [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) | Branches: `web` / `api` / `admin` |

## Monorepo map (do not mix)

| Path | Role | Branch prefix |
|------|------|---------------|
| `apps/web/` | Public FE (Next.js) | `feat/web-*` |
| `apps/api/` | Backend NestJS | `feat/api-*` |
| `apps/admin/` | Dashboard CMS | `feat/admin-*` |
| `packages/ui/` | Shared UI `@jetbay/ui` | with consuming app |
| `scripts/deploy/` | VPS deploy only | `chore/deploy-*` |
| `docs/` | Specs & progress | with related feature branch |

## Hard rules

1. **Features** only from `docs/JETBAY_BAO_GIA.md` + `docs/JETBAY_DANH_GIA_KY_THUAT.md` — not HomeFix CRM/marketplace.
2. **Security patterns** may follow `api.homefix.asia` (JWT, X-API-Key, throttle) but **secrets/DB/ports stay JetBay-only**.
3. **Never commit** `.env`, `.env.local`, real API keys, DB passwords. Run `pnpm security:hooks` + `pnpm security:scan` (see [GIT_AND_CODE_SECURITY.md](./docs/GIT_AND_CODE_SECURITY.md)).
4. After meaningful work: update `docs/CONTINUE_AT_HOME.md` + checklist log.
5. Prefer one concern per PR; stay on the matching branch prefix.

## Local env (new machine)

```bash
git pull
pnpm install
node scripts/generate-local-env.mjs
node scripts/sync-frontend-api-key.mjs
pnpm db:up   # if using docker postgres
```

Prod API: `https://api.minhtien.online` · Docs: `https://docs.minhtien.online/swagger` · Admin: `https://admin.minhtien.online`
