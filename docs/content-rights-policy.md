# Content rights policy

## Sync modes

| Mode | When | Allowed |
|------|------|---------|
| `SAFE_REFERENCE_MODE` | Default — no written authorization in repo | Facts/taxonomy/metadata discovery; original rewrite; no JetVina HTML/media/logo |
| `AUTHORIZED_DIRECT_SYNC` | Client ownership letter / CMS credentials / signed export | Authorized content with provenance + still require human publish |

## Image rightsStatus

Publishable: `OWNED` | `LICENSED` | `CLIENT_PROVIDED` | `PUBLIC_DOMAIN`  
Blocked: `UNVERIFIED` | `PROHIBITED`

### MediaAsset (admin review)

| Flag | Meaning | Rule |
|------|---------|------|
| `approvedForStaging` | Staging/dev preview | Allowed for UNVERIFIED review mirrors |
| `approvedForPublish` | Production publish | **Requires** publishable rightsStatus + checksum + storageKey; **rejects** UNVERIFIED / PROHIBITED / JetBay paths |
| CLIENT_DIRECTED staging preference | Product asked to prefer JetVina URLs in non-prod UI | **Not** legal equivalence to CLIENT_PROVIDED |

API:

- `GET /admin/media-assets`
- `POST /admin/media-assets` (review meta)
- `POST /admin/media-assets/:id/approve-staging` → `content_media.approve_staging`
- `POST /admin/media-assets/:id/approve-production` → `content_media.approve_production`
- `POST /admin/media-assets/:id/block` → `content_media.block`
- `GET /content/media-assets` (public) → production-approved only

Admin UI: `/dashboard/media-review`

FE flags (web): `JETVINA_MEDIA_PRODUCTION_ENABLED` default **false**; remote review never in `APP_ENV=production`.

## Current evidence

- No ownership letter, CMS credentials, or export confirmation found in repository.
- JetVina exposes public WordPress REST (`/wp-json/`) and Yoast sitemap — usable for **structure discovery**.
- **2026-07-13 CLIENT_DIRECTED:** product owner asked to prefer images from https://jetvina.com/ for staging UI (catalog in `apps/web/src/lib/jetvina-media-catalog.ts`). This is **not** a signed blanket license for every WP media item (some may be third-party stock on their CMS).
- JetVina logo URL observed in OG metadata remains gated by `JETVINA_OFFICIAL_LOGO_ENABLED` until CLIENT_PROVIDED letter.
- Seed fixtures under `fixtures/media/*` are **test-only** and must not be treated as real JetVina rights.

## Claims banned until client approval

- “No.1”, “largest”, “exclusive”, “10,000+ aircraft/clients”, association badges without license.
