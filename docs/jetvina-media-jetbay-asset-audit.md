# JetBay asset remap audit (feat/api-content-sync)

Public UI must not serve JetBay photos. Remap via `sanitizePublicMediaSrc` → `resolveMediaAsset`.

| JetBay asset / pattern | Component / path before | Mapping mới | Local JetVina | Placeholder | Có thể xóa |
|------------------------|-------------------------|-------------|---------------|-------------|------------|
| `/assets/jetbay/**` (CDN mirror tree) | `jetbay-cdn.ts` + `CdnImage` | Context-aware JetVina remote (staging) or demo SVG | After `pnpm sync:jetvina-media` | `/placeholders/demo/*` | Chưa — còn reference trong config/tests; xóa chỉ khi 0 import + build/smoke PASS |
| `jetbayImg/**` | Legacy CSS / home styles | Blocked by path check | — | demo | CSS refs còn 2 trong `jetbay-home.css` — audit trước khi xóa file |
| Aircraft webp under jetbay v4 | Fleet / empty leg cards | `AIRCRAFT_EXTERIOR` / `EMPTY_LEG` | mirror when checksum | aircraft-*.svg | Không xóa folder cho đến audit import=0 |
| Destination / cabin banners | Home / services | `DESTINATION` / `AIRCRAFT_CABIN` | — | destination/cabin SVG | Giữ folder |
| Logo `jetbay-logo.svg` | Deleted earlier | `/brand/jetvina/*` | brand folder | wordmark text | Đã xóa logo SVG |

**Rules:** never fallback to JetBay; production never returns `REMOTE_JETVINA_REVIEW`; delete JetBay binaries only after reference audit + builds.
