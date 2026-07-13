# JetVina — Sample emails & operators (editable)

> Date: **2026-07-13** · Source brand: [jetvina.com](https://jetvina.com/)  
> Admin edit: https://admin.minhtien.online/dashboard/email-templates · Operators

## Media / loader

- Page loader: gold plane + progress (JetVina style) on locale routes  
- Images: hotlink allowed from `https://jetvina.com/wp-content/uploads/**` when `NEXT_PUBLIC_ALLOW_JETVINA_REMOTE=true`  
- Catalog: `apps/web/src/lib/jetvina-media-catalog.ts`

## Sample operators (Admin → Operators)

| Name | Region | Base focus | Note |
|------|--------|------------|------|
| JetVina Vietnam Ops | APAC | SGN/HAN/DAD | Core |
| Indochina Jet Supply | APAC | VN | Sample supplier |
| Silk Route Aviation | APAC | SIN | Sample |
| Lotus Private Wings | APAC | BKK | Sample |
| Saigon Executive Air | APAC | SGN | Sample |
| Horizon Gulf Charter | EMEA | DXB | Sample |
| Nordic Prestige Jets | EMEA | ARN | Sample |
| (+ existing EuroJet, Pacific, Sakura, Americas, Alpine, Gulf Prestige…) | | | |

All marked `(sample)` in legalName where new — safe to rename/edit later.

## Sample email templates (DB + Admin)

| Key | Locale | Purpose |
|-----|--------|---------|
| `operator_flight_notify` | en, vi | Mail hãng bay khi có booking |
| `admin_flight_notify` | en, vi | Mail nội bộ admin |
| `quote_received_customer` | en, vi | Xác nhận đã nhận báo giá (mẫu) |
| `newsletter_welcome` | en, vi | Welcome newsletter |

Variables commonly used: `{{bookingId}}` `{{operatorName}}` `{{customerName}}` `{{customerEmail}}` `{{bookingStatus}}` `{{itinerary}}`

### Look & feel

- Background `#0d0d0d`, card `#161410`, accent gold `#c9a962`  
- Header wordmark **JETVINA**  
- Footer: `flights@jetvina.com · +84 396 919 611` (from [jetvina.com](https://jetvina.com/))

Customer-care campaign emails (welcome / quote / booking) still render from code in `customer-care/email-templates.ts` — same visual wrap.

## How to edit later

1. Admin login → **Email Templates** → chọn key/locale → sửa subject/HTML  
2. Admin → **Operators** → sửa tên / email / status  
3. Re-seed only if you want to reset samples: `bash /var/www/jetbay-be/deploy/seed-prod.sh`
