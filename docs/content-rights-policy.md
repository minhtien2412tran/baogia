# Content rights policy

## Sync modes

| Mode | When | Allowed |
|------|------|---------|
| `SAFE_REFERENCE_MODE` | Default — no written authorization in repo | Facts/taxonomy/metadata discovery; original rewrite; no JetVina HTML/media/logo |
| `AUTHORIZED_DIRECT_SYNC` | Client ownership letter / CMS credentials / signed export | Authorized content with provenance + still require human publish |

## Image rightsStatus

Publishable: `OWNED` | `LICENSED` | `CLIENT_PROVIDED` | `PUBLIC_DOMAIN`  
Blocked: `UNVERIFIED` | `PROHIBITED`

## Current evidence

- No ownership letter, CMS credentials, or export confirmation found in repository.
- JetVina exposes public WordPress REST (`/wp-json/`) and Yoast sitemap — usable for **structure discovery**.
- **2026-07-13 CLIENT_DIRECTED:** product owner asked to prefer images from https://jetvina.com/ for staging UI (catalog in `apps/web/src/lib/jetvina-media-catalog.ts`). This is **not** a signed blanket license for every WP media item (some may be third-party stock on their CMS).
- JetVina logo URL observed in OG metadata remains gated by `JETVINA_OFFICIAL_LOGO_ENABLED` until CLIENT_PROVIDED letter.

## Claims banned until client approval

- “No.1”, “largest”, “exclusive”, “10,000+ aircraft/clients”, association badges without license.
