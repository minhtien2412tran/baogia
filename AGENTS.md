# JETBAY — Agent instructions (git-tracked)

Chat sessions do **not** remember progress. Before coding, read and update the files below.

**Product first:** the main deliverable is the **jetbay.com clone** in `apps/web` — prod https://www.minhtien.online/en-us · local `:3000`.  
`m-tien.com/jet-bay` and `m-tien.com/app-jetbay` are **sales/quote landings only** — not the product UI. See [docs/JETBAY_PRODUCT_MAP.md](./docs/JETBAY_PRODUCT_MAP.md).

## Progress board (source of truth)

| Doc | Purpose |
|-----|---------|
| [docs/CONTINUE_AT_HOME.md](./docs/CONTINUE_AT_HOME.md) | **Where we left off** — start here on a new machine |
| [docs/ONBOARDING_NHAN_VIEN.md](./docs/ONBOARDING_NHAN_VIEN.md) | Full clone + setup for new teammates |
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
3. **Never commit** `.env`, `.env.local`, real API keys, DB passwords.
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
