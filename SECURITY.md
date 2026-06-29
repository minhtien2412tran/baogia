# Security Notes — J-TA Platform

## Current posture (development)

- **Auth**: Demo tokens (`demo-token-{userId}`). Not production-safe.
- **Passwords**: Stored as plain hash placeholder; bcrypt not yet implemented.
- **CORS**: Restricted to `localhost:3000` and `localhost:3001` by default.
- **Validation**: NestJS `ValidationPipe` enabled globally.
- **Admin routes**: No JWT guard yet — rely on demo Bearer token.

## Before production

1. Implement `@nestjs/jwt` + bcrypt password hashing
2. Add `AdminGuard` on all `/admin/*` routes
3. Enable Helmet middleware ✅ (dev)
4. Add rate limiting (`@nestjs/throttler`) — pending
5. Rotate `JWT_SECRET` and database credentials via env
6. Never commit `.env` files
7. Enable HTTPS and secure cookies for tokens

## Frontend

- Tokens stored in `localStorage` (demo only)
- No `dangerouslySetInnerHTML` on CMS content without sanitization
- Add CSRF protection for production forms
