# JETBAY — Private Jet Booking Platform

**Sản phẩm chính:** clean-room **clone jetbay.com** → [`apps/web`](./apps/web) (local http://localhost:3000/en-us).  
**Báo giá** trên [m-tien.com/jet-bay](https://m-tien.com/jet-bay/) chỉ là mô tả bán hàng — xem [docs/JETBAY_PRODUCT_MAP.md](./docs/JETBAY_PRODUCT_MAP.md).

Monorepo: public website, admin dashboard, and NestJS API.

## Architecture

pnpm workspace:
- **`apps/web`** (`@jetbay/web`): Next.js public site — `localhost:3000` — branch `feat/web-*`
- **`apps/admin`** (`@jetbay/admin`): Admin CMS — `localhost:3001` — branch `feat/admin-*`
- **`apps/api`** (`@jetbay/api`): NestJS API — `localhost:4000` — branch `feat/api-*`
- **`packages/ui`** (`@jetbay/ui`): Shared UI
- **`docker-compose.yml`**: PostgreSQL, Redis, MinIO, Mailpit (`jetbay_*` local)

### Tiếp tục code (nhiều máy / Cursor)

| File | Mục đích |
|------|----------|
| [docs/CONTINUE_AT_HOME.md](./docs/CONTINUE_AT_HOME.md) | **Bắt đầu ở đây** sau `git pull` |
| [docs/JETBAY_PRODUCT_MAP.md](./docs/JETBAY_PRODUCT_MAP.md) | Product vs báo giá |
| [AGENTS.md](./AGENTS.md) | Hướng dẫn AI + map FE/BE/Admin |
| [docs/JETBAY_BAO_GIA.md](./docs/JETBAY_BAO_GIA.md) | Báo giá (collateral) |
| [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) | Nhánh git an toàn |
| `.cursor/rules/` | Rules Cursor (commit cùng code) |

```bash
git pull origin main
# mở Cursor → @docs/CONTINUE_AT_HOME.md
```

---

## Local Setup

### Prerequisites
- Node.js (v22+)
- pnpm (v10+)
- Docker (optional, but required to run PostgreSQL/Redis/MinIO/Mailpit containers)

### Installation
Run the following command at the root of the workspace to install dependencies:
```bash
pnpm install
```

### Infrastructure Services
To run PostgreSQL, Redis, MinIO, and Mailpit via Docker Compose:
```bash
# Start infrastructure services
pnpm db:up

# Stop infrastructure services
pnpm db:down
```

### Database Migration
Apply migrations to PostgreSQL and generate the Prisma Client:
```bash
# Generate Prisma Client
pnpm --filter @jetbay/api prisma:generate

# Deploy migrations (requires database connection)
pnpm --filter @jetbay/api prisma:migrate
```

### Running the Applications
To run all applications (`web`, `admin`, `api`) in parallel for development:
```bash
pnpm dev
```

### QA / CI (theo `docs/SPRINT_PROMPTS.md`)
```bash
pnpm qa:ci          # prisma generate + build all + API unit tests
pnpm test:e2e       # Playwright (cần pnpm dev đang chạy)
```

### Demo credentials (sau `pnpm --filter @jetbay/api prisma:seed`)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jetbay.local | Admin123! |
| User | demo@jetbay.local | Demo123! |

Once running:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Swagger (local)**: [http://localhost:4000/swagger](http://localhost:4000/swagger)
- **Swagger (prod)**: [https://docs.minhtien.online/swagger](https://docs.minhtien.online/swagger)
- **API docs**: [docs/API.md](./docs/API.md) · **Secrets**: [docs/SECURITY_SECRETS.md](./docs/SECURITY_SECRETS.md)

Local API env (random secrets, do not commit):

```bash
node scripts/generate-local-env.mjs
```
