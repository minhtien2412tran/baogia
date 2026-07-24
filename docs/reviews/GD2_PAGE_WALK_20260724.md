# GD2 Page Walk — 2026-07-24

> Wave 1 (W1-05 / W1-06) · Prod https://www.minhtien.online · Admin https://admin.minhtien.online  
> Method: HTTP status probe + API inventory (no visual screenshot batch this run)

## Smoke / health (cùng ngày)

| Check | Result |
|-------|--------|
| `GET /health` | PASS `ok` · production |
| Web `/en-us` | 200 |
| Admin `/login` | 200 |
| `integrations.smtp` | false · **catcher** (Mailpit) — T-S4-01 BLOCKED |
| `smoke-web-api` (VPS + local after key sync) | **PASS** · quote id **59** (local) / **58** (VPS earlier) |
| `smoke-auth-booking` | **PASS** · booking id 12 · demo login via `admin@j-ta.local` fallback |
| `pnpm audit:i18n` | fail=0 · **warn=0** (24/07 ~10:15 — tourism nav cookie/more keys) · verdict **PASS** |

**Fix ops:** Local `API_KEY` lệch prod → 401. Đã thêm `scripts/pull-prod-api-key.mjs` và sync (không commit secret).

## Page walk (URL đúng trong code)

| # | Page | URL | HTTP | Note |
|---|------|-----|------|------|
| 1 | Home | `/en-us` | 200 | PASS |
| 2 | Fixed Price | `/en-us/fixed-price-charter` | 200 | PASS |
| 3 | Empty Leg | `/en-us/empty-leg` | 200 | PASS |
| 4 | Quote (home widget) | `/en-us` | 200 | Smoke quote PASS |
| 5 | Jet Card | `/en-us/jet-card` | 200 | PASS |
| 6 | Travel Credit | `/en-us/travel-credit` | 200 | PASS (không phải `travel-credits`) |
| 7 | Destinations hub | `/en-us/destination` | 200 | PASS (không phải `destinations`) |
| 8 | Golf destinations | `/en-us/golf-destinations` | 200 | PASS |
| 9 | News | `/en-us/news` | 200 | PASS · API news n=1 |
| 10 | Account | `/en-us/account` | 200 | PASS (login gate UX) |
| 11 | Account bookings | `/en-us/account/bookings` | 200 | PASS |
| 12 | Account quotes | `/en-us/account/quotes` | 200 | PASS |
| 13 | Login | `/en-us/login` | 200 | PASS |
| 14 | Register | `/en-us/register` | 200 | PASS |
| 15 | Charter | `/en-us/private-jet-charter` | 200 | PASS |
| 16 | About | `/en-us/about-us` | 200 | PASS |
| 17 | Admin login | `/login` | 200 | PASS |
| 18 | Admin dashboard | `/dashboard` | 200 | PASS (shell) |
| 19 | Admin articles | `/dashboard/content` | 200 | PASS shell · CRUD cần JWT manual |
| 20 | Admin quotes | `/dashboard/quotes` | 200 | PASS shell |

## Sai URL / thiếu trang (ghi nhận)

| URL thử (theo note cũ) | HTTP | Phân loại | Action |
|------------------------|------|-----------|--------|
| `/en-us/travel-credits` | 404 → **308** `/travel-credit` | P2 fixed | Alias redirect |
| `/en-us/destinations` | 404 → **308** `/destination` | P2 fixed | Alias redirect |
| `/en-us/contact` | 404 | **P1** | → **200** (Wave 3a) |
| `/en-us/customer-care` | 404 → **308** `/contact` | P2 fixed | Alias (JetVina cũng 404) |
| `/en-us/empty-leg-flights` | 404 → **308** `/empty-leg` | P2 fixed | Alias redirect |
| `/dashboard/news` | 404 | P2 docs | Dùng `/dashboard/content` |
| `/en-us/en-us/contact` | **308** → `/en-us/contact` | P1 fixed | Double-locale breadcrumb bug |

## CMS inventory (API)

| Resource | Count | Gap vs DoD GĐ2 |
|----------|-------|----------------|
| News EN | **1** | Cần ≥3–5 thật (GD2-CMS-01) |
| News VI | **1** | Cùng bài / thiếu bản dịch riêng? |
| FP routes | 12 | OK seed · copy EN/VI rà Wave 2 |
| Destinations | 14 | OK seed · SEO/copy Wave 2 |
| Jet Card plans | 3 | OK |
| Travel Credit pkgs | 3 | OK |
| Empty legs | 2 | OK |

## Bug backlog từ walk

### P0
- _(không có HTTP P0 trên trang ưu tiên đã probe)_

### P1
1. **Thiếu trang Contact** (`/contact` 404) — chặn UAT “Contact” trong note §3.2.C  
2. **News chỉ 1 bài** — chưa đủ CMS tối thiểu GĐ2  
3. **SMTP catcher** — không chặn page walk nhưng chặn mail U11 / đóng GĐ1 phương án A  

### P2
1. `audit:i18n` warn=10 tourism/nav partial (non EN-US locales)  
2. Chuẩn hóa tài liệu URL (travel-credit / destination / content)  
3. Visual polish parity jetvina.com — chưa screenshot (Wave 3)  
4. Admin CRUD news draft — cần login demo manual (W1-07 partial)

## Page walk update — Contact (24/07 session 2)

| URL | Trước | Sau | Note |
|-----|-------|-----|------|
| `/en-us/contact` | 404 | **200** | Plan A — form → `POST /quotes/request` `[Website Contact]` |
| `/vi/contact` | — | **200** | i18n VI |
| Header Contact Us | → charter | → `/contact` | JetBayHeader |
| Footer company | — | + Contact | `FOOTER_COMPANY_DEF` |

Deploy web: 24/07 · route `/[locale]/contact` in build output.

### CTA scan (W3-03)

- Không còn link `/contact` 404 trên prod sau deploy.  
- Sai URL cũ trong note (`/travel-credits`, `/destinations`) vẫn 404 nếu gõ tay — đúng route: `/travel-credit`, `/destination`.  

### P1 còn lại

- News n=1 (Owner content)  
- SMTP catcher  

### Bugfix 24/07 ~10:15 (Dev)

- Contact breadcrumb double locale `/en-us/en-us/contact` → fixed (`href: '/contact'` + harden `navHref`)  
- Alias 404 → 308 redirects in middleware  
- `audit:i18n` warn 10 → **0** (tourism nav cookie/more)  
- `next.config` remotePatterns không còn OR với `JETVINA_MEDIA_PRODUCTION_ENABLED`  
