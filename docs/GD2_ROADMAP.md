# GD2 Roadmap — Web staging nghiệm thu

> **Updated:** 2026-07-24 · **Status:** DEV S1–S4 DONE (trừ SMTP) · **Waiting Owner** O1–O4 + CMS + UAT sign  
> **DoD page groups:** [JETBAY_WEB_PAGE_DOD.md](./JETBAY_WEB_PAGE_DOD.md)  
> **Surface:** [WEB_API_SURFACE_MAP.md](./WEB_API_SURFACE_MAP.md)  
> **Plan chi tiết:** [NEXT_SPRINT_PLAN.md](./NEXT_SPRINT_PLAN.md)  
> **Gap còn thiếu:** [GAP_GD1_GD2_BACKLOG.md](./GAP_GD1_GD2_BACKLOG.md) · [BAO_CAO_TIEN_DO_DAY_DU.md](./BAO_CAO_TIEN_DO_DAY_DU.md) §0 & §4

## Thứ tự ưu tiên trang (khuyến nghị)

| # | Nhóm | Vì sao trước | API dependency | Content dependency | Auth | Rủi ro nếu làm sau/sai thứ tự | Exit NT nhóm |
|---|------|--------------|----------------|--------------------|------|-------------------------------|--------------|
| 1 | **Commercial** (FP / EL / JetCard / TC) | doanh thu + smoke đã PASS seed | listing+enquiry endpoints ready | tier copy / packages | no | Polish charter trước không bán được sản phẩm | Listing + 1 enquiry/quote mỗi loại trên prod, Admin thấy record |
| 2 | **Home** | traffic entry; quote widget nằm home | FP/EL/JC + news + airports | news articles | no | Home đẹp nhưng commercial lỗi → mất lead | Home SSR data + quote E2E SGN→HAN |
| 3 | **Charter ×6** | brand/story; phụ thuộc media + copy | content pages optional | PAGE_CONTENT / CMS | no | Làm đầu → tốn thời gian visual, API lead chưa siết | 6 route 200 + CTA → quote + media JetVina |
| 4 | **Account** | sau khi có quotes/bookings | `/account/dashboard` JWT | — | JWT | Auth trước khi có data → empty UX xấu | Login demo → thấy quotes/bookings; pay vẫn BLOCKED keys |

## Sprint map (GĐ2 focus)

| Sprint | Mục tiêu GĐ2 | Exit |
|--------|--------------|------|
| S1 | Audit + surface map + quote contract locked | Docs merged; smoke-web-api pass; quote legs DTO documented |
| S2 | Commercial + Home + Quote E2E UI | Form empty/error states; no silent empty on fail for commercial |
| S3 | Charter polish + Account UX + Admin ops guide | Visual checklist; demo account UAT |
| S4 | Prod smoke + UAT pack + GĐ1 signoff prep + GĐ4 keys list | UAT_CHECKLIST signed; OWNER items answered |

## Tasks (PASS/FAIL)

| Mã | Ưu tiên | Mục tiêu | Phạm vi | Files | Dependency | Start when | Done when | Test | Docs | Risk | Ai | Status | Wave |
|----|---------|----------|---------|-------|------------|------------|-----------|------|------|------|-----|--------|------|
| T-S1-01 | P0 | Surface map complete | docs | `WEB_API_SURFACE_MAP.md` | audit | now | Map covers all groups | manual review | this file | stale docs | Dev | DONE 2026-07-14 | S1 |
| T-S1-02 | P0 | Quote API body locked | FE↔API | QuoteSearchWidget, smoke-web-api | DTO legs | now | Doc + smoke use same shape | smoke-web-api; quote E2E | SURFACE_MAP | wrong DTO 400 | Dev | DONE evidence | S1 |
| T-S1-03 | P1 | Fix empty phone placeholder | Quote UX | `QuoteSearchWidget.tsx` | — | S1 | No `+10000000000` without user input; phone required + validated | unit/manual | SURFACE_MAP | bad CRM data | Dev | **DONE 2026-07-14** | S1 |
| T-S1-04 | P1 | api-sync with Basic auth | CI | `smoke-api-sync.mjs` | Basic creds VPS | local API up | exit 0 local↔prod↔docs or prod↔docs fallback | `pnpm smoke:api-sync` / `SYNC_MODE=prod-docs` | API_SYNC plan | false FAIL | Dev | **DONE 2026-07-14** | S1 |
| T-S2-01 | P1 | Commercial error/empty UI | FP/EL/JC/TC pages | page.tsx forms | API | S1 done | API down → message not blank | break key local | WEB_PAGE_DOD | silent fail | Dev | **DONE 2026-07-14** | S2 |
| T-S2-02 | P1 | Wire or label fleet carousel | Charter ServicePage | aircraft-catalog / API | public fleet GET or label “sample” | S1 | Not silent MOCK | visual | SURFACE_MAP | fake fleet | Dev | **DONE 2026-07-14** (labelled SAMPLE) | S2 |
| T-S2-03 | P1 | Quote E2E UI proof | Widget | QuoteSearchWidget | SMTP optional | S1 | Screenshot + quote id in Admin | manual + API | UAT | mail separate | Dev | **DONE 2026-07-14** requestId=36 | S2 |
| T-S2-04 | P2 | Home news empty state | NewsHome | NewsHomeSection | CMS | content | Shows “no news” CTA + error ≠ empty | visual | — | blank | Dev | **DONE 2026-07-14** | S2 |
| T-S3-01 | P1 | Charter CMS or documented static | charter pages | page-content / CMS | Owner content | S2 | Slugs mapped; edit path known | Admin | ADMIN_OPS + CHARTER_CMS_MAP | hardcode forever | Dev+Owner | **DONE 2026-07-14** (map) | S3 |
| T-S3-02 | P1 | Account empty + error polish | account/* | AccountShell | JWT | S2 | Retry works | auth-booking | — | auth UX | Dev | **DONE 2026-07-14** | S3 |
| T-S3-03 | P2 | ADMIN_OPS_GUIDE usable | docs | ADMIN_OPS_GUIDE.md | — | S2 | Owner can publish news + charter | walkthrough | this | — | Dev | **DONE 2026-07-14** | S3 |
| T-S4-01 | P0 | SMTP configured + test mail | ops | prod .env | O4 | Owner SMTP | inbox + smtp=true | script send | SMTP_SETUP | stay blocked | Dev+Owner | Dev implementation: **PASS** · Production SMTP configuration: **BLOCKED_OWNER_SMTP** · Inbox delivery: **NOT RUN** · Overall: **BLOCKED_OWNER** | S4 |
| T-S4-02 | P1 | Backup+restore drill | ops | scripts | VPS | S3 | Log restore OK | restore dry-run | DB_BACKUP | data loss | Dev | **DONE 2026-07-14** PASS airports=120 | S4 |
| T-S4-03 | P1 | UAT pack + status 3.1 publish | docs+web | UAT + baocaotiendo | Owner O3 optional | S3 | Page 3.1 live | deploy web | STATUS_3_1 | — | Dev | **DONE 2026-07-14** live · O3: **DEPLOYED / OPTIONAL_OWNER_REVIEW** | S4 |

## Điều kiện nghiệm thu GĐ2 (đề xuất)

- Commercial + Home + Quote: API thật, có empty/error minh bạch.  
- Charter ×6: live + media brand; copy CMS hoặc chấp nhận static đã ghi.  
- Account: login + dashboard quotes/bookings (payment còn BLOCKED nếu chưa keys).  
- Smoke: `smoke-web-api` + `smoke-auth-booking` + manual Quote UI.  
- Owner đã trả O1–O4.  
- [UAT_CHECKLIST.md](./UAT_CHECKLIST.md) có chữ ký Owner.

## Còn thiếu trước NT GĐ2 (24/07)

| ID | Việc | Owner | Status |
|----|------|-------|--------|
| G2-01 | SMTP + inbox (T-S4-01) | Owner O4 | BLOCKED |
| G2-02 | CMS ≥3–5 news + FP copy EN+VI | Owner O10 | OPEN |
| G2-03 | Feedback UI ≤10 điểm | Owner O2 | OPEN |
| G2-04 | Visual polish theo feedback | Dev | ONGOING |
| G2-05 | Media hotlink decision | Owner O5 | OPEN |
| G2-06 | Chốt thứ tự polish O1 | Owner | OPEN |
| G2-07 | UAT sign U1–U15 | Owner | OPEN |
| G2-08 | Smoke pre-NT | Dev | OPEN (chạy tuần 8) |
| G2-09 | Biên bản NT staging | Hai bên | Tuần 8 |

Chi tiết hạng mục trang: [BAO_CAO_TIEN_DO_DAY_DU.md](./BAO_CAO_TIEN_DO_DAY_DU.md) §4.2.
