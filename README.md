# J - TA Clean-Room Private Jet Booking Platform

This project is a monorepo containing the public website, admin dashboard, and backend API for J - TA, a clean-room clone of a private jet booking platform.

## Architecture

The platform uses a pnpm monorepo structure:
- **`apps/web`**: Next.js public website (running on `localhost:3000`)
- **`apps/admin`**: Next.js custom admin dashboard (running on `localhost:3001`)
- **`apps/api`**: NestJS core backend API (running on `localhost:4000`)
- **`docker-compose.yml`**: Docker environment configurations for PostgreSQL, Redis, MinIO, and Mailpit.

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
pnpm --filter api prisma:generate

# Deploy migrations (requires database connection)
pnpm --filter api prisma:migrate
```

### Running the Applications
To run all applications (`web`, `admin`, `api`) in parallel for development:
```bash
pnpm dev
```

Once running:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Swagger Documentation**: [http://localhost:4000/swagger](http://localhost:4000/swagger)
- **OpenAPI JSON Spec**: [http://localhost:4000/openapi.json](http://localhost:4000/openapi.json)
