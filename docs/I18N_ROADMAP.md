# JetBay i18n — Kiến trúc, lộ trình & hướng dẫn

> **Ngôn ngữ chuẩn DB (canonical):** `en`  
> **Web routing:** `en-us`, `en`, `zh-cn`, `zh-hk`, `zh-tw`, `vi`  
> **Package dùng chung:** `packages/i18n` (`@jetbay/i18n`)

---

## 1. Mô hình “reverse i18n”

JetBay tách **2 lớp locale**:

| Lớp | Ví dụ | Vai trò |
|-----|-------|---------|
| **Web locale** | `en-us`, `zh-cn` | URL Next.js `/[locale]/…`, cookie `jb_locale`, UI `t()` |
| **DB locale** | `en`, `zh-cn`, `vi` | Cột `ContentTranslation.locale`, query API `?locale=` |

### Forward (Web → DB)

```
/en-us/news  →  GET /content/news?locale=en
/zh-cn/news  →  GET /content/news?locale=zh-cn
```

Hàm: `toDbLocale(webCode)` trong `@jetbay/i18n`.

### Reverse (DB → Web)

```
DB row locale=en  →  web routes: /en-us/… và /en/…
DB row locale=zh-cn  →  /zh-cn/…
```

Hàm: `toDefaultWebLocale(db)`, `webLocalesForDb(db)`.

### Fallback khi đọc

```
zh-tw  →  zh-tw  →  zh-hk  →  zh-cn  →  en (canonical)
vi     →  vi     →  en
en-us  →  en
```

Hàm: `resolveLocaleFallbackChain()`.

### Ghi DB thống nhất

- Mọi `locale` từ Admin/FE/API được **chuẩn hóa** trước khi ghi (`en-us` → `en`).
- Khi lưu bản dịch **không phải `en`** mà chưa có bản `en`, hệ thống **tự tạo bản canonical** (mirror) để DB luôn có master row.
- Slug/metadata entity (article, destination) **không đa ngôn ngữ** — chỉ `ContentTranslation` đa ngôn ngữ.

---

## 2. Cấu trúc code (đã triển khai GĐ1)

```
packages/i18n/
  src/registry.ts    # toDbLocale, fallback, detectWebLocale
  src/messages.ts    # t() — UI shell (nav, booking labels)
  src/index.ts

apps/api/src/modules/i18n/
  locale.service.ts
  i18n.controller.ts   # GET /i18n/config, GET /i18n/resolve
  i18n.module.ts

apps/web/
  src/config/locales.ts   # re-export @jetbay/i18n + LOCALE_COOKIE
  src/lib/i18n.ts         # re-export t()
  middleware.ts           # Accept-Language + cookie → redirect locale
```

### API endpoints mới

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/i18n/config` | Danh sách web↔DB mapping cho FE/Admin |
| GET | `/i18n/resolve?locale=zh-cn` | Resolve locale + fallback chain |

### Content API (đã chuẩn hóa)

Tất cả `?locale=` được normalize + fallback chain trong `ContentService`.

---

## 3. Hướng dẫn dev

### FE — gọi API có locale

```ts
import { apiLocale } from '@/config/locales';

const { locale } = await params;
const news = await api.getNews(apiLocale(locale));
```

### FE — UI string

```ts
import { t } from '@/lib/i18n';

t(locale, 'searchAircraft'); // "Search Available Aircraft" | "Tìm máy bay…" | …
```

### BE — lưu translation từ Admin

```json
{
  "translation": {
    "locale": "zh-cn",
    "title": "标题",
    "body": "…"
  }
}
```

→ Ghi DB `locale=zh-cn`. Nếu chưa có `en`, tạo mirror `en`.

### Admin — chọn locale khi sửa CMS (GĐ2)

```ts
import { DB_LOCALES, CANONICAL_LOCALE } from '@jetbay/i18n';
// Dropdown: en | zh-cn | zh-hk | zh-tw | vi
// Luôn khuyến nghị nhập en trước (canonical)
```

### Script chuẩn hóa DB (nếu có legacy)

```bash
node scripts/i18n/normalize-db-locales.mjs
```

Đổi `en-us` → `en` trong `ContentTranslation`.

---

## 4. Lộ trình triển khai

### GĐ1 — Nền tảng ✅ (session này)

- [x] Package `@jetbay/i18n` — registry + messages + tests
- [x] API `LocaleService`, `I18nModule`, `/i18n/config`
- [x] `ContentService` normalize + fallback + canonical mirror on write
- [x] DTO validate locale (`en`, `zh-*`, `vi`, `en-us`)
- [x] FE middleware cookie + Accept-Language
- [x] FE API client truyền `?locale=` (news, blogs, videos, destinations)
- [x] FE `t()` mở rộng (booking labels)

### GĐ2 — Admin & CMS (2–3 ngày)

- [ ] Admin: dropdown locale trên mọi form article/page/destination/video
- [ ] Admin: tab đa ngôn ngữ (en | zh-cn | vi) thay hardcode `locale: 'en'`
- [ ] API `GET /admin/content/articles/:id/translations` — list all locales
- [ ] Smoke: tạo bài `zh-cn`, verify FE `/zh-cn/news/…`

### GĐ3 — Nội dung tĩnh & nav (1–2 tuần)

- [ ] Dịch `PAGE_CONTENT` hoặc chuyển hết sang CMS pages
- [ ] Dịch `MEGA_MENU`, footer labels qua `messages.ts` hoặc CMS
- [ ] `hreflang` trong `buildMetadata()`
- [ ] `generateStaticParams` cho 6 locale

### GĐ4 — Domain mở rộng (theo báo giá I18N-CONTENT)

- [ ] `FixedPriceOption.includedTerms` → translation table hoặc JSON i18n
- [ ] `Airport` display names (city đa ngôn ngữ) — optional lookup table
- [ ] `JetCardPlan` / empty leg descriptions
- [ ] Auto-translate pipeline (DeepL/Google) — **chỉ draft**, human review trước publish

### GĐ5 — Production & QA

- [ ] Seed `zh-cn`, `vi` mẫu cho 1 news + 1 destination
- [ ] Smoke: `GET /content/news?locale=zh-cn`
- [ ] E2E Playwright: switch locale header → URL + content
- [ ] Deploy API + Web sau GĐ2

---

## 5. Quy tắc vận hành

1. **Canonical luôn là `en`** — không đổi slug theo locale.
2. **Không lưu `en-us` trong DB** — chỉ dùng trên URL web.
3. **UI shell** → `@jetbay/i18n` messages; **nội dung dài** → CMS `ContentTranslation`.
4. **Quote/booking** — `QuoteRequest.locale` lưu DB locale đã normalize (audit).
5. Thêm locale mới: sửa **một chỗ** `packages/i18n/src/registry.ts` → sync FE/BE/Admin.

---

## 6. Kiểm tra nhanh

```bash
# Unit tests registry
cd packages/i18n && npx tsx --test src/registry.test.ts

# API config
curl -s https://api.minhtien.online/i18n/config | jq .canonicalLocale

# Resolve
curl -s "https://api.minhtien.online/i18n/resolve?locale=en-us"
```

---

## 7. Liên kết

- [JETBAY_DANH_GIA_KY_THUAT.md](./JETBAY_DANH_GIA_KY_THUAT.md) — ma trận 6 locale
- [BE_TEST.md](./BE_TEST.md) — smoke content locale
- [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) — tiến độ tổng
