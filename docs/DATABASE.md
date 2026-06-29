# Database — J-TA Platform

## Stack

- **PostgreSQL 16** via Prisma ORM
- Schema: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations/`

## Local setup (without Docker)

```powershell
# Create DB and user in psql
CREATE USER jta_user WITH PASSWORD 'jta_password';
CREATE DATABASE jta_db OWNER jta_user;
```

Set `apps/api/.env`:

```
DATABASE_URL=postgresql://jta_user:jta_password@localhost:5432/jta_db
```

Run migrations and seed:

```powershell
cd apps/api
pnpm prisma migrate dev
pnpm prisma:seed
```

## Key models

| Model | Purpose |
|-------|---------|
| User | Accounts, auth |
| QuoteRequest / QuoteLeg | Charter quote enquiries |
| Booking | Confirmed bookings |
| FixedPriceRoute / EmptyLeg | Commercial products |
| JetCardPlan / TravelCreditPackage | Membership products |
| ContentArticle / Destination | CMS content + i18n |
| AuditLog | Admin action trail |

## Indexes

Performance indexes on frequently queried columns (`email`, `status`, `createdAt`, `slug`) are applied via migration `add_performance_indexes`.

## Demo data

Seed creates `demo@j-ta.local` user, European airports, 6 fixed-price routes, 2 empty legs, jet card plans, travel credits, and CMS articles.
