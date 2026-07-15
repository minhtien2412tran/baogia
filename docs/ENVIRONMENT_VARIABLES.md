# Environment Variables

> **Updated:** 2026-07-14 · **Status:** CURRENT index  
> **Source of truth templates:** `apps/api/.env.example` · `apps/web/.env.example` · admin deploy bake

## API (critical)

| Var | Purpose | Prod note |
|-----|---------|-----------|
| DATABASE_URL | Postgres | jetbay_db |
| JWT_SECRET / REFRESH_TOKEN_SECRET | Auth | rotated strong |
| API_KEY | X-API-Key | FE must match web |
| SMTP_* | Mail | **Owner** — see SMTP_SETUP_GUIDE |
| STRIPE_* / ONEPAY_* / NINEPAY_* | Pay | GĐ4 Owner |
| GOOGLE_CLIENT_ID / APPLE_CLIENT_ID | OAuth | GĐ4 |
| TWILIO_* / ESMS_* / SMS_* | OTP | GĐ4 |
| SWAGGER_BASIC_* | Docs lock | ON prod |
| MINIO_* | Uploads | optional → local path |
| REDIS_URL | Cache/queue | required core |

## Web

| Var | Purpose |
|-----|---------|
| NEXT_PUBLIC_API_URL | Usually prod API |
| NEXT_PUBLIC_API_KEY | Same app key as API |
| NEXT_PUBLIC_ALLOW_JETVINA_REMOTE | Hotlink JetVina images |
| NEXT_PUBLIC_PREFER_JETVINA_MEDIA | Remap media |
| NEXT_PUBLIC_SHOW_UNVERIFIED_* | Marketing sections |

## Admin

Bake tại deploy: `NEXT_PUBLIC_API_URL=https://api.minhtien.online`.

**Never commit real `.env`.**
