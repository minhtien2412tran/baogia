# Security

## Authentication

- **JWT** access tokens signed with `JWT_SECRET` (set in `apps/api/.env`)
- Passwords hashed with **bcryptjs** (never stored plaintext)
- Admin routes require `Authorization: Bearer <token>` and `User.role === 'ADMIN'`

## Development accounts (seed only)

| Email | Password | Role |
|-------|----------|------|
| demo@j-ta.local | Demo123! | USER |
| admin@j-ta.local | Admin123! | ADMIN |

## Production checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Restrict CORS origins via `CORS_ORIGIN`
- [ ] Add rate limiting on public POST endpoints
- [ ] Configure real OAuth providers
- [ ] Integrate payment gateway (Stripe, etc.)

See [BE_AUDIT.md](./docs/BE_AUDIT.md) for full backend security status.
