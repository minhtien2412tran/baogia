# JetBay asset remap audit (updated 2026-07-13)

Public UI must not serve JetBay photos. Remap via `localAsset` → `sanitizePublicMediaSrc` → `resolveMediaAsset`.

| JetBay asset / pattern | Trước | Mapping mới | Local JetVina | Placeholder | Có thể xóa binaries |
|------------------------|-------|-------------|---------------|-------------|---------------------|
| `/assets/jetbay/**` | deprecated | `/media-seed/*` seeds only | `/assets/jetvina/mirror` khi có checksum | `/placeholders/demo/*` | **Removed from public root** (2026-07-13) — inventory in `docs/evidence/jetbay-public-assets-inventory.json`; binaries archived locally under `_archive/` (gitignored) |
| `jetbayImg/**` trong seed path | CDN tree | remapped by context | — | demo | Giữ disk cho đến khi QA xóa có chủ đích |
| Destination API thumbs | `/assets/jetbay/...` | `/media-seed/...` trong `destination-seeds.ts` | — | destination SVG | Giữ |
| Logo `jetbay-logo.svg` | public brand | `/brand/jetvina/*` | brand | wordmark | Đã xóa |

## Audit commands

```bash
pnpm audit:asset-references   # FAIL nếu còn /assets/jetbay trong public source
pnpm audit:branding
pnpm test:e2e:media-staging
pnpm test:e2e:media-production
```

**Rules:** never fallback to JetBay; production never returns `REMOTE_JETVINA_REVIEW`; do not delete `/public/assets/jetbay` tree until explicit cleanup PR + smoke.
