# jetbay-main — FE clone ↔ JetBay API

Standalone Next.js 15 UI clone (AI Studio origin). Product demo remains `apps/web`.

## Connect to Swagger / Nest API

1. Copy `.env.example` → `.env.local`
2. Set `NEXT_PUBLIC_API_KEY` to the same value as API `API_KEY` (VPS / local `apps/api/.env`)
3. Default base URL: `https://api.minhtien.online` (OpenAPI: https://docs.minhtien.online/swagger)

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_API_KEY
npm install
npm run dev
```

## Wired endpoints

| UI | API |
|----|-----|
| Home Empty Legs + `/empty-legs` | `GET /empty-legs` |
| Empty leg alerts | `POST /empty-legs/alerts/subscribe` |
| Home Fixed Price + `/fixed-price-charter` | `GET /fixed-price/routes` |
| Home Jet Card | `GET /jet-card/plans` |
| Hero search | `GET /airports/search` · `POST /quotes/search-aircraft` |

Client: `lib/api.ts` (sends `X-API-Key`). Browser CORS must allow this origin on the API.

## Note

Not in the monorepo `pnpm-workspace`. Uses npm. Prefer porting polished UI into `apps/web` for production delivery.
