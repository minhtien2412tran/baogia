# Media domain audit — 2026-07-24

> Wave 4 (W4-01 / W4-02) · `scripts/media-domain-audit.mjs` · HTML scrape of priority pages (not full crawl)  
> **Re-run ~10:05 ICT** sau fix `ALLOW_JETVINA_REMOTE` + redeploy web (W4-05 residual / hotlink scrub)

## Domain counts (img src / css url in HTML)

| Domain | Số lượng | Loại | Trang sử dụng | Quyết định Owner |
|--------|--------:|------|---------------|------------------|
| www.minhtien.online | 93 | jetbay-prod | see pages below | Option 2 mirror |
| jetvina.com (hotlink) | **0** | — | — | Cắt sau W4-05 + media-env fix |

### Probe home (`/en-us`)

| Metric | Value |
|--------|------:|
| Absolute `jetvina.com` URLs in HTML | **0** |
| `/assets/jetvina/mirror/` refs | **20** |

## Pages → hosts

- `https://www.minhtien.online/en-us` → www.minhtien.online
- `https://www.minhtien.online/en-us/fixed-price-charter` → www.minhtien.online
- `https://www.minhtien.online/en-us/empty-leg` → www.minhtien.online
- `https://www.minhtien.online/en-us/destination` → www.minhtien.online
- `https://www.minhtien.online/en-us/news` → www.minhtien.online
- `https://www.minhtien.online/en-us/jet-card` → www.minhtien.online
- `https://www.minhtien.online/en-us/travel-credit` → www.minhtien.online
- `https://www.minhtien.online/en-us/contact` → www.minhtien.online

## Broken / failed fetches (sample ≤8/page)

_No failures in sampled HEAD/GET checks._

## Owner decision (W4-04) — **Option 2** (đã chọn)

Ghi nhận: [OWNER_MEDIA_DECISION.md](../OWNER_MEDIA_DECISION.md).

## Fallback (W4-03)

Code: `CdnImage` + `ResponsiveImage` dùng `/brand/jetvina/logo-fallback.svg` khi `onError` (một lần, không retry loop).

## Hotlink scrub (W4-05 residual) — 24/07

**Bug:** `ALLOW_JETVINA_REMOTE` từng OR với `JETVINA_MEDIA_PRODUCTION_ENABLED=true` → deploy mirror vẫn bật hotlink.

**Fix:** `apps/web/src/lib/media-env.ts` — remote chỉ khi `NEXT_PUBLIC_ALLOW_JETVINA_REMOTE=true`; production mirror flag không mở hotlink. Deploy ghi `JETVINA_MEDIA_LOCAL_MIRROR_ENABLED=true` + remote OFF.

**Verify:** `pnpm test:media` PASS · audit 8 priority pages · `jetvina.com` = 0 · home mirror = 20.
