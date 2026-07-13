# Public branding cleanup — final audit (2026-07-13)

Branch: `feat/api-content-sync`  
Mode: SAFE_REFERENCE · Logo rights: **UNVERIFIED** · No production deploy

## Summary counts

| Metric | Count |
|--------|------:|
| Files matching JetBay/jetbay (broad scan, excl. node_modules/.next) | ~150–164 |
| **Public-affecting** (copy/metadata/UI/email/docs/API public) | **~37** |
| Keep-as-internal (`@jetbay/*`, `jb-*` CSS, localStorage keys, CDN path helper, component file names) | **~113** |
| Public violations remaining after this pass (static audit allowlisted) | See `pnpm audit:branding` |

Internal package names and `jb-*` CSS classes are **KEEP** and are **not** public branding defects.

## Classification table (consolidated)

| File/Record | Loại | Public? | Nội dung | Hành động | Kết quả |
|---|---|---:|---|---|---|
| `packages/*` name `@jetbay/*` | INTERNAL_PACKAGE | No | Monorepo scope | KEEP | KEEP |
| `apps/web/src/styles/jetbay-*.css`, class `jb-*` | INTERNAL_CSS_CLASS | No* | CSS tokens | KEEP | KEEP |
| Prisma migrations / seed emails `@jetbay.local` | HISTORICAL_MIGRATION | No | DB seeds | KEEP | KEEP |
| `packages/i18n/src/messages.ts` + `nav-catalog.ts` + `pages-i18n.ts` | PUBLIC_COPY | Yes | Hero/nav/footer claims | REPLACE → JetVina / neutral | DONE |
| `apps/web/src/lib/page-content.ts` + about/booking defaults | PUBLIC_COPY | Yes | Service/SOS/App copy | REPLACE + hide sections | DONE |
| Home Sos / JetCard / Partner / App / Why | PUBLIC_COPY | Yes | Marketing JetBay | BLOCK via `SHOW_UNVERIFIED_MARKETING_SECTIONS` | DONE |
| `MediaSection` / footer memberships | PUBLIC_ASSET | Yes | Association logos | BLOCK | DONE |
| `public/assets/jetbay/**` | PUBLIC_ASSET | Yes | Historical images | BLOCK → `/placeholders/*` via `sanitizePublicMediaSrc` | DONE |
| `public/brand/jetvina/**` | PUBLIC_ASSET | Staging | Official logo UNVERIFIED | KEEP + flag gating | DONE |
| `layout.tsx` / `metadata.ts` OG/favicon | PUBLIC_METADATA | Yes | Icons/OG | REPLACE brand paths | DONE |
| `GET /content/brand` | PUBLIC_API_DATA | Yes | Brand JSON | Sanitize + production gate | DONE |
| `email-templates.ts` | PUBLIC_COPY | Yes | Transactional email | Already JetVina | DONE |
| `document.service.ts` HTML/PDF | PUBLIC_COPY | Yes | Charter agreement | REPLACE JetBay→JetVina | DONE |
| `login/page.tsx` demo credentials | PUBLIC_COPY | Yes | Error leak | REMOVE | DONE |
| `baocaotiendo/**` | COMMENT_OR_DOC | Semi | Internal KH progress | CLIENT_REVIEW / KEEP report title | PENDING |
| Social handles in CDN config | CLIENT_REVIEW_REQUIRED | Yes | Instagram etc. | Omitted until client provides | BLOCKED |
| Logo rights letter | CLIENT_REVIEW_REQUIRED | — | UNVERIFIED | Await CLIENT_PROVIDED | BLOCKED |

\*CSS class names can appear in DOM but are not user-facing brand copy.

## Feature flags

| Flag | Effect |
|------|--------|
| `JETVINA_OFFICIAL_LOGO_ENABLED` / `NEXT_PUBLIC_*` | Staging logo preview |
| `NEXT_PUBLIC_APP_ENV=production` | Force logo fallback (ignore staging flag) |
| `NEXT_PUBLIC_SHOW_UNVERIFIED_MARKETING` | Show SOS/JetCard/Partner/App/Why |
| `NEXT_PUBLIC_ALLOW_JETBAY_MEDIA` | Allow raw `/assets/jetbay` images |

## Automation

- `pnpm audit:branding` → `scripts/audit-public-branding.mjs`
- `tests/public-branding.smoke.spec.ts` (Playwright)
- API `brand-public.spec.ts` production gating
