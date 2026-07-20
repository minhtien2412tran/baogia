# I18N Verification Matrix — JetVina / JetBay

**Cập nhật:** 2026-07-20  
**Mục tiêu người dùng:** mọi ngôn ngữ trên **web + email + nội dung** khớp locale đang dùng.  
**Verdict hiện tại:** **KHÔNG đạt 100%** — shell UI (nav/form) khá tốt; marketing copy, service pages, CMS body, email còn lệch EN.

**Chạy audit tự động:**

```powershell
pnpm --filter @jetbay/i18n build
pnpm audit:i18n
pnpm audit:i18n:live
# strict (FAIL nếu còn WARN):
node scripts/audit-i18n-coverage.mjs --live https://www.minhtien.online --strict
```

**Liên quan:** [I18N_ROADMAP.md](./I18N_ROADMAP.md) · [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md)

---

## 0. Định nghĩa “đúng ngôn ngữ”

| Lớp | Nguồn | Đạt khi |
|-----|-------|---------|
| **A. Shell UI** | `t()` / `tn()` trong `@jetbay/i18n` | Mọi key có bản cho DB locale; không fallback EN bất ngờ |
| **B. Page marketing** | `PAGE_CONTENT` + `getPageOverlay` | Hero/title/sections theo locale |
| **C. Hardcoded JSX** | Literal trong components | Không còn EN cứng trên route non-`en` |
| **D. CMS / API content** | `ContentTranslation` + `?locale=` | Có row locale hoặc fallback chain có chủ đích |
| **E. Email** | Template DB / customer-care packs | Subject+body theo locale khách / subscriber |
| **F. Anti auto-translate** | `<html lang>` + `translate=no` | Browser không tự dịch đè bản site |

**100%** = A–F PASS cho mọi `WEB_LOCALES` + mọi email transactional chính.

---

## 1. Locale map

| Web locale | DB locale | Shell `t()` | Nav `tn()` | Page overlays | Product UI pack | Ghi chú |
|------------|-----------|-------------|------------|---------------|-----------------|---------|
| `en-us` / `en` | `en` | Base | Base | Không (đúng) | — | Canonical |
| `vi` | `vi` | Full | Full | Full (11 pages) | (in messages) | Ổn shell |
| `zh-cn` / `zh-hk` / `zh-tw` | same | Full | Full | Full | (in messages) | Ổn shell |
| `ja` `ko` `th` `id` `fr` `de` `es` `it` `ru` `ar` | same | Tourism overlay | Tourism nav | **Không** | `PRODUCT_UI_BY_LANG` | Hero service pages vẫn EN |

---

## 2. Checklist kiểm tra thủ công (mỗi locale)

Lặp lại cho: `en-us`, `vi`, `zh-cn`, `ja`, `fr`, `ar` (tối thiểu).

### 2.1 Web shell

| # | Bước | Expect | Pass? |
|---|------|--------|-------|
| W1 | Mở `/{locale}/` hard refresh, **tắt** Chrome Translate | Nav + quote widget + cookie đúng ngôn ngữ | ☐ |
| W2 | Language picker hiện **native label** (`English (US)`, không `Tiếng Anh (Mỹ)`) | Anti-translate OK | ☐ |
| W3 | `html[lang]` khớp (`en-US`, `vi`, `zh-CN`, …) + có `translate="no"` | View-source | ☐ |
| W4 | Form: From/To/Passengers/Search button localized | `t()` | ☐ |
| W5 | Login/Register/Contact CTA localized | `t()` / `tn()` | ☐ |

### 2.2 Service / marketing pages

| # | Path | Expect non-`en` | Hiện trạng |
|---|------|-----------------|------------|
| S1 | `/private-jet-charter` | Title+hero overlay (vi/zh) | Overlay OK; **sections cứng EN** trong `ServicePage.tsx` |
| S2 | Cùng trang: “Global Private Air Charter…”, FAQ, stats labels | Phải localized | **FAIL** — hardcoded EN |
| S3 | `/corporate-air-charter` … World Cup pages | Overlay vi/zh; tourism = EN hero | PARTIAL |
| S4 | Home Why / Stats / Partner / SOS / App download | Localized | **FAIL** — nhiều EN cứng |

### 2.3 CMS / destinations / news

| # | Path | Expect | Hiện trạng |
|---|------|--------|------------|
| C1 | `/news` `?locale=` | Article title theo locale nếu có `ContentTranslation` | Fallback EN nếu chưa dịch |
| C2 | `/destination` | Destination body theo locale | Tương tự |
| C3 | Admin CMS chỉ lưu `en` | Không đủ cho 100% | P1 Owner/CMS |

### 2.4 Email

| # | Trigger | Expect | Hiện trạng |
|---|---------|--------|------------|
| E1 | Quote / enquiry customer ACK | Locale từ form | **DONE** en/vi/zh-cn (code packs) |
| E2 | Quote sales/ops alert | Theo locale khách | **DONE** en/vi/zh-cn |
| E3 | Newsletter welcome / nurture | `EmailSubscriber.locale` | **DONE** en/vi/zh-cn |
| E4 | Jet Card / Travel Credit enquiry | DTO locale | **DONE** customer; sales PARTIAL |
| E5 | Quote follow-up 24h (scanner) | Giữ locale quote | **PARTIAL** — scanner → EN |
| E6 | Admin offer (`onQuoteOffered`) | Theo `quote.locale` | **HARDCODED_EN** — không pass locale |
| E7 | Welcome register | Locale đăng ký | **HARDCODED_EN** — `RegisterDto` không có locale; `User` không có preferredLocale |
| E8 | Booking created / cancel / payment | Locale user/quote | **HARDCODED_EN** — call site omit locale |
| E9 | Operator / admin flight notify | DB template locale | **HARDCODED_EN** — luôn `en` dù seed có `vi` |
| E10 | Admin Email Templates UI | Sửa được mọi locale | **FAIL** — luôn load `en`; không locale picker |

### 2.5 Email — nguyên nhân gốc (audit BE)

```text
Web locale ──► DTO.locale ──► EmailCampaignLog / code packs (en|vi|zh-cn)
                 │
                 ✗ không ghi QuoteRequest.locale / User.preferredLocale
                 │
Later (offer, booking, pay, follow-up) ──► thiếu locale ──► default "en"
```

| Gap | Fix ưu tiên |
|-----|-------------|
| `QuoteRequest.locale` schema có nhưng **không persist** khi create | Ghi locale từ DTO |
| `User` không có preferred locale | Thêm field hoặc lấy từ quote/subscriber |
| Dual system: Admin DB templates ≠ customer-care packs | Wire hoặc document ops-only |
| Seeds `quote_received_customer` / `newsletter_welcome` **dead** | Live dùng code packs |
| `zh-hk`/`zh-tw` → body zh-cn; ja/ko/… greeting only | Packs đầy đủ hoặc fallback có chủ đích |

### 2.6 Web gaps bổ sung (audit FE)

| Gap | File / note |
|-----|-------------|
| `about-us` **không** có page overlay | `pages-i18n.ts` |
| `getHomeOverlay()` **dead** — home dùng `t('heroTitle')` | `pages-i18n.ts` / home |
| `servicePageMetadata(key)` **không truyền locale** → SEO luôn EN | `service-page.ts` |
| PJC FAQ/blocks từ `jetbay-cdn.ts` EN, bỏ qua overlay sections | `ServicePage.tsx` |
| Auth login/register, account panels, enquiry placeholders | Nhiều literal EN |
| `ar` thiếu `dir="rtl"` | layout |
| zh-cn thiếu một số key cookie trong nav (`cookieConsent` leftovers) | `nav-catalog.ts` |
| Tourism shell ~35% messages / ~20% nav localized | `tourism-locales.ts` |

---

## 3. Ma trận bề mặt × trạng thái (SoT)

| Surface | Mechanism | en | vi | zh* | tourism (ja…ar) | Gap |
|---------|-----------|----|----|-----|-----------------|-----|
| Header mega menu | `tn()` | ✅ | ✅ | ✅ | ✅ overlay | — |
| Quote widget labels | `t()` | ✅ | ✅ | ✅ | ✅ | — |
| Cookie banner | `tn()` / `t()` | ✅ | ✅ | ✅ | ✅ | — |
| Service page hero | overlay | ✅ base | ✅ | ✅ | ❌ EN | Tourism overlays missing |
| Service page body sections | JSX literals | ✅ EN | ❌ EN | ❌ EN | ❌ EN | **P0 hardcode** |
| Home Why/Stats/Partner | JSX literals | ✅ EN | ❌ EN | ❌ EN | ❌ EN | **P0 hardcode** |
| PAGE_CONTENT base | TS | ✅ | merge overlay | merge | no overlay | — |
| CMS articles | API translation | ✅ | nếu có row | nếu có | nếu có | Content debt |
| Email templates DB | seed en/vi | ✅ | ✅ | ❌ | ❌ | Expand seeds |
| Customer-care packs | code packs | ✅ | ✅ | ✅ | partial | Align all locales |
| Browser auto-translate | html attrs | ✅ blocked | ✅ | ✅ | ✅ | Deployed 2026-07-20 |

---

## 4. Definition of Done — “100% ngôn ngữ”

- [ ] `pnpm audit:i18n` → **0 FAIL**
- [ ] `pnpm audit:i18n:live --strict` → **0 FAIL / 0 WARN** (sau khi hết hardcode)
- [ ] Mọi chuỗi user-facing trong `apps/web` đi qua `t`/`tn`/overlay/CMS (không literal EN trên non-en)
- [ ] Mọi `SERVICE_PAGES` có overlay cho **mọi** `DB_LOCALES` non-en (hoặc ẩn section EN)
- [ ] Email transactional: catalog locale ≥ `en,vi,zh-cn` (+ tourism theo roadmap)
- [ ] UAT checklist §2 signed cho 6 locale mẫu
- [ ] Không còn marker auto-translate (`Hiến chương`, …) trong HTML server

---

## 5. Migration waves (để đạt DoD)

| Wave | Việc | Owner |
|------|------|-------|
| **I18N-1** | Đưa hardcode `ServicePage` + home sections → keys/overlays; metadata theo locale; wire hoặc xóa `getHomeOverlay` | Dev · **DONE 2026-07-20** (ServicePage/Why/Stats → `t()`; audit fail=0) |
| **I18N-2** | Page overlays tourism (ja…ar) + `about-us`; RTL `ar` | Dev · **DONE 2026-07-20** (11/11 overlays + RTL) |
| **I18N-3** | CMS: dịch article/destination/page theo locale | Owner + Admin |
| **I18N-4a** | Persist `QuoteRequest.locale` (+ optional `User.preferredLocale`); pass vào offer/booking/payment/follow-up | Dev · **PARTIAL** persist + offer/booking/payment/welcome register |
| **I18N-4b** | Flight notify dùng locale; Admin email locale picker; thống nhất DB vs code packs | Dev |
| **I18N-4c** | SMTP smoke E1–E9 × `{en,vi,zh-cn}` | Owner SMTP |
| **I18N-5** | CI: `audit:i18n` + weekly `audit:i18n:live` | Dev |

---

## 6. Lệnh kiểm tra nhanh production

```powershell
# EN must stay English + anti-translate
curl.exe -s https://www.minhtien.online/en-us/private-jet-charter | findstr /C:"Private Jets" /C:"translate=\"no\"" /C:"lang=\"en-US\""

# VI shell must appear
curl.exe -s https://www.minhtien.online/vi/private-jet-charter | findstr /C:"Một chiều" /C:"Tìm" /C:"Thuê"

# Must NOT appear (auto-translate mangling)
curl.exe -s https://www.minhtien.online/en-us/private-jet-charter | findstr /C:"Hiến chương" /C:"Tiếng Anh (Mỹ)"
```

---

## 7. Log kết quả

| Ngày | Lệnh | Kết quả |
|------|------|---------|
| 2026-07-20 | Code audit + script added | Verdict **PARTIAL** — hardcode EN + tourism overlays missing |
| 2026-07-20 | Live en-us anti-translate deploy | PASS attrs + English HTML |
| 2026-07-20 | Deep FE + email audit merged | Email: ACK DONE; lifecycle HARDCODED_EN; Web: about-us/metadata/CDN FAQ gaps documented |
