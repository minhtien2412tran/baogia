# Status — Web FE (`apps/web`)

> **Updated:** 2026-07-24 ~16:35 ICT · Index: [STATUS_CURRENT.md](./STATUS_CURRENT.md)  
> **Code:** `apps/web` · **UI kit:** `@jetbay/ui`  
> **Prod demo:** https://www.minhtien.online · local `:3000`  
> **KH official (nội dung/IA):** https://jetvina.com/ — không lẫn với báo giá `m-tien.com/jet-bay`

## 1. Tổng quan

| Hạng mục | Giá trị |
|----------|---------|
| Stack | Next.js (App Router) · i18n locales `en-us` / `vi` / `zh-cn` (+) |
| PM2 | `jetbay-web` · port `:3012` |
| API | `https://api.minhtien.online` + `X-API-Key` |
| Giai đoạn | GĐ2 polish / UAT · GĐ1 kỹ thuật xong chờ ký |
| Deploy gần | `jetbay-web-20260724-10*` (Contact · hotlink scrub · i18n) |

**Verdict:** Web demo **LIVE** và nối API prod ổn định. Còn nội dung (News), UX Owner, và G4 pay/OAuth trên FE.

---

## 2. Trang / module — trạng thái

Legend: **LIVE** · **PARTIAL** · **BLOCKED** · **NOT_STARTED**

| Module | Route (locale) | Status | Ghi chú |
|--------|----------------|--------|---------|
| Home | `/` | LIVE | FP / EL / JetCard / news teaser từ API |
| Charter ×6 | `/private-jet-charter` (+5) | PARTIAL | Static + CMS slug; map [CHARTER_CMS_MAP.md](./CHARTER_CMS_MAP.md) |
| Fixed-price | `/fixed-price-charter` | LIVE | List + detail + quote |
| Empty Legs | `/empty-leg` · detail | LIVE | Filter continent/IATA/date |
| Jet Card | `/jet-card` | LIVE | Plans + enquiry |
| Travel Credit | `/travel-credit` | LIVE | Alias 308 từ `travel-credits` |
| Destinations | `/destination` (+) | LIVE | API content |
| Quote widget | home / forms | LIVE | `quotes/request` · phone required |
| Contact | `/contact` | LIVE | EN/VI **200** (24/07) |
| News / blogs / video | `/news` … | PARTIAL | API OK · content mỏng (Owner W2-05) |
| Auth | `/login` `/register` | LIVE | JWT; OAuth/OTP **BLOCKED** (G4 keys) |
| Account | `/account/*` · `/account/bookings` | LIVE | Profile · avatar · trips · social fields |
| Payments (account) | `/account/payments` | BLOCKED | Gateway keys G4 |
| Newsletter | footer | LIVE | Subscribe API; deliver qua SMTP W5 |
| Progress report | `/baocaotiendo` | LIVE | Public v3.1 |
| World Cup / partners | campaign pages | PARTIAL | Forms; verify mỏng |
| Fleet showcase | charter sections | PARTIAL | Labelled SAMPLE (không inventory live) |
| Media images | toàn site | LIVE | Option 2 mirror · 0 hotlink jetvina |
| i18n | en-us / vi / zh | LIVE | `pnpm audit:i18n` fail=0 warn=0 (24/07) |

Chi tiết surface cũ hơn: [WEB_API_SURFACE_MAP.md](./WEB_API_SURFACE_MAP.md) · DoD trang: [JETBAY_WEB_PAGE_DOD.md](./JETBAY_WEB_PAGE_DOD.md) · Walk: [reviews/GD2_PAGE_WALK_20260724.md](./reviews/GD2_PAGE_WALK_20260724.md)

---

## 3. Đã PASS gần đây (không hỏi lại)

| Hạng mục | Evidence |
|----------|----------|
| Contact EN/VI 200 | `/en-us/contact` · `/vi/contact` |
| Media Option 2 + scrub hotlink | jetvina.com HTML = 0 remote hotlink |
| Alias redirects | 308 `travel-credits` → `travel-credit`, … |
| i18n audit | fail=0 warn=0 |
| smoke-web-api | PASS (quote IDs gần nhất #60+) |
| Account profile / avatar / social | migrations prod · public smoke |

---

## 4. Việc còn mở (FE)

| Ưu tiên | Việc | Ai |
|---------|------|-----|
| P0 | News / CMS content publish | Owner W2-05 |
| P0 | UX feedback pack | Owner W3-06 |
| P1 | Polish parity jetvina.com | Dev ongoing |
| P1 | Charter CMS body đầy đủ | Owner + Dev |
| P2 | Fleet live inventory (nếu product đòi) | Product decision |
| G4 | Pay / OAuth / SMS UI unlock | KH keys |

---

## 5. Lệnh kiểm nhanh

```bash
curl -sI https://www.minhtien.online/en-us/contact
curl -sI https://www.minhtien.online/vi/contact
node scripts/deploy/jetbay-be/smoke-web-api.mjs
pnpm audit:i18n
node scripts/media-domain-audit.mjs
```

---

## 6. Liên kết

- Index: [STATUS_CURRENT.md](./STATUS_CURRENT.md)  
- BE: [STATUS_API_BE.md](./STATUS_API_BE.md) · Admin: [STATUS_ADMIN_DASHBOARD.md](./STATUS_ADMIN_DASHBOARD.md)  
- i18n SoT: [I18N_VERIFICATION_MATRIX.md](./I18N_VERIFICATION_MATRIX.md)  
- Media: [OWNER_MEDIA_DECISION.md](./OWNER_MEDIA_DECISION.md)
