# Placeholders & JetVina media

## Priority (public UI)

1. **JetVina** — curated URLs from [jetvina.com](https://jetvina.com/) (`NEXT_PUBLIC_PREFER_JETVINA_MEDIA`, default on)
2. **SVG demos** — `/placeholders/demo/*` when prefer flag is `false`
3. JetBay `/assets/jetbay/*` — blocked unless `NEXT_PUBLIC_ALLOW_JETBAY_MEDIA=true`

Catalog: `src/lib/jetvina-media-catalog.ts`  
Rights: `../assets/jetvina/RIGHTS.md`  
Optional mirror: `pnpm sync:jetvina-media`

## SVG demo regenerate

`pnpm generate:demo-placeholders`

## Payment chips (footer)

`/placeholders/payment/*.svg` — original text/mark chips (Visa / MC / Amex / UnionPay / Discover).  
Do **not** remap through JetBay CDN; keeps footer free of JetVina promo art and third-party logo files.
