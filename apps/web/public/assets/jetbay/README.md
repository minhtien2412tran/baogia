# Deprecated — do not use in UI

Historical clone assets lived under this folder. Public runtime must **not** reference `/assets/jetbay/*`.

Use:

- `resolveMediaAsset()` / `sanitizePublicMediaSrc`
- `/assets/jetvina/mirror/` (UNVERIFIED until rights)
- `/placeholders/demo/*`

Binaries may remain on disk for migration audits; they are not linked from `LOCAL_ASSET_ROOT` anymore (`/media-seed` seeds only).
