# Continue at home — JETBAY

> Chat Cursor không nhớ — mở file này sau `git pull`.  
> Bản đồ đầy đủ: [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md)

**Dự án:** JETBAY (monorepo) — **web chính thức KH = [jetvina.com](https://jetvina.com/)** · demo code = `apps/web`  
**Báo giá** (`m-tien.com/jet-bay`) chỉ là mô tả bán hàng — không phải trang chính thức.  
**Repo:** https://github.com/minhtien2412tran/baogia.git  
**Nhánh:** `main` · `feat/web-*` | `feat/api-*` | `feat/admin-*`

---

## URL nhanh

| Vai trò | URL | Ghi chú |
|---------|-----|---------|
| **Web chính thức KH** | https://jetvina.com/ | JetVina — nguồn truth IA / nội dung / liên hệ |
| **Web demo (clone)** | https://www.minhtien.online/en-us | ✅ PM2 `jetbay-web` `:3012` · local `:3000` |
| **Báo cáo tiến độ KH** | https://www.minhtien.online/baocaotiendo | ✅ trang nội bộ gửi Anh Tuấn Anh |
| API | https://api.minhtien.online | ✅ |
| Admin | https://admin.minhtien.online/login | ✅ |
| Swagger | https://docs.minhtien.online/swagger | ✅ |
| Báo giá Web (collateral) | https://m-tien.com/jet-bay/ | Chỉ pitch / giá — không sửa như product |
| Báo giá App (collateral) | https://m-tien.com/app-jetbay/ | Scope App 248TR — chưa code RN |

---

## Đã xong

- [x] API + Admin + Docs Swagger (prod)
- [x] Web nối API prod (local → `api.minhtien.online`)
- [x] ApiKeyGuard / secrets / rebrand JETBAY
- [x] Quy hoạch: product = clone · báo giá = collateral ([JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md))
- [x] **Deploy public web** — `www.minhtien.online` (+ apex → www) · SSL · CORS

## Việc tiếp theo (ưu tiên sản phẩm)

> **Plan:** [NEXT_SPRINT_PLAN.md](./NEXT_SPRINT_PLAN.md) · [GD2_ROADMAP.md](./GD2_ROADMAP.md) · [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md) · [OWNER_ACTION_ITEMS.md](./OWNER_ACTION_ITEMS.md) · [TEST_MATRIX.md](./TEST_MATRIX.md)

1. **CR Wave1–5 BE + Empty Leg FE filter (2026-07-12)** — nhánh `feat/api-cr-wave3-contracts-rbac-docusign`: fleet/pricing/HĐ/RBAC/DocuSign mock · web `/empty-leg` lọc continent/IATA/date · smoke `smoke-cr-wave1/3` — live DocuSign/Admin UI chờ phụ lục
2. **CR sau họp** — kịch bản họp tiến độ: [KH_KICH_BAN_HOP_TIENDO.md](./KH_KICH_BAN_HOP_TIENDO.md) (đã gộp từ `main` 19/07) · biên bản `JETBAY_CR_2026_01` / `KH_KICH_BAN_SAU_HOP_CR` *(bổ sung khi có file)* · báo cáo tiến độ **không** ghi CR = đã hoàn thành GĐ
3. **Polish theo JetVina** (ongoing) — so [jetvina.com](https://jetvina.com/) (+ `scratch/` khi cần layout)
4. **G4 keys** — SMTP / OAuth / payment / SMS **chờ KH** → [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md)

**Trạng thái phiên 15/07 (evening audit):** **GĐ2 Dev complete · Repository pack committed · Waiting for Owner SMTP**

**Bổ sung audit 18/07:** BE typecheck PASS; local runtime còn blocked bởi Docker/Postgres. Admin/RBAC đã re-matrix tại [ADMIN_RBAC_FUNCTION_MATRIX.md](./ADMIN_RBAC_FUNCTION_MATRIX.md): menu Admin chưa permission-aware, controller còn trộn `AdminGuard`/`PermissionGuard`, triển khai theo waves R1–R5.

**Bản dịch / locale (20/07):** Prod `/en-us/*` trả **đúng English** (đã curl verify). Screenshot “en-us hiện tiếng Việt” là Chrome auto-translate (`Charter`→`Hiến chương`, `English (US)`→`Tiếng Anh (Mỹ)` — không khớp catalog `vi`). Fix FE: `<html lang>` theo locale + `translate="no"` / `google=notranslate` + language picker `translate="no"`.

**BE báo giá/hợp đồng (20/07):** Deploy API + đóng gap 74TR: persist `QuoteRequest.locale`, xuất Word charter, smoke `smoke-bao-gia-contracts.mjs` **PASS** prod (quote→pricing→booking PDF/Word→contract DocuSign mock). SoT [BE_AUDIT.md](./BE_AUDIT.md) · [BE_TEST.md](./BE_TEST.md). Tham chiếu scope: [m-tien.com/jet-bay](https://m-tien.com/jet-bay/) (collateral). Còn Owner: G4 keys · RBAC migrate · Company/SavedSearch.

**I18N CDN blocks (20/07):** PJC `serviceBlocks` + `processSteps` → `t()` (en/vi/zh); CDN giữ ảnh.

**Fix Intl locale (20/07 night):** `RangeError: Incorrect locale information` trên home (empty-leg / news dates) — `formatDate`/`toIntlLocale` dùng `htmlLang` (`en-US`/`zh-CN`) thay vì route code `en-us`/`zh-cn`.

**CRM/Dashboard audit + P0 pass (20/07 late):** CRM hiện dùng chung `apps/admin` + `/admin/*` API, chưa có app CRM riêng. Đã bảo vệ payment intent/confirm/hold/gateway, document export/detail và pricing booking operations bằng JWT + ownership; staff login nhận `SALES`/`CONTRACT_APPROVER`; Admin phân biệt 401/403 và nạp permission-aware navigation; role DTO hỗ trợ đủ 4 role; quote offer → booking nối `quoteOfferId`, giá offer và quote `CONVERTED`; email campaign retry tối đa 3 lần. API/Admin typecheck PASS. Còn Owner-blocked: SMTP thật/G4 keys; integration tests local bị chặn bởi DB credentials.

**CRM/Dashboard verification (20/07 late):** API/Admin/Web production builds PASS · `audit:docs PASS` · `security:scan:all` findings=0 · permission unit 5/5 PASS · `audit:i18n` fail=0, warn=10 tourism nav partial. Full API Jest vẫn có 18 integration failures do local Postgres credentials, không phải compile failure.

**Account profile + booking sync (20/07):** `/en-us/account` hiện đọc dashboard chung từ BE và cho user sửa tên, họ, phone, loại tài khoản; upload avatar JPEG/PNG/WebP vào shared storage và lưu `User.avatarUrl`. Quote/booking flow tự prefill profile khi có JWT; booking contact cùng email đăng nhập sẽ cập nhật lại hồ sơ user để đồng bộ các kênh. Đã thêm API `PATCH /me`, `POST /me/avatar`, migration `20260720235000_user_profile_avatar`. Cần chạy migration trên prod và UAT upload avatar/profile + booking.

**Realtime audit + implementation (21/07):** HomeFix được audit read-only: Socket.IO JWT gateway cho chat/call, WebRTC chỉ relay SDP/ICE. Đã port pattern vào JetVina bằng `RealtimeModule`: conversation/member/message lưu DB JetVina riêng; REST `/realtime/conversations`; Socket.IO namespace `/realtime`; kiểm tra JWT + membership cho room/message/WebRTC signal; staff có thể join conversation. Không copy dữ liệu, `.env`, uploads hoặc DB HomeFix. Migration `20260721001500_realtime_conversations`; cần migrate prod và test REST/Socket.IO/WebRTC signaling.

Postman collection: `docs/postman/JETVINA_REALTIME.postman_collection.json`. Production smoke: `/health` 200; unauthenticated REST 401; Socket.IO polling 200; namespace without JWT rejected with `Authentication required`.

**I18N polish (20/07 evening):** metadata theo locale · about-us overlay · cookie zh-cn · `dir=rtl` cho `ar` · xóa `getHomeOverlay` chết · offer/booking email dùng `quote.locale` · PJC highlight bodies `t()` · tourism title overlay cho `/private-jet-charter`.

**I18N 100% gate (20/07):** SoT [I18N_VERIFICATION_MATRIX.md](./I18N_VERIFICATION_MATRIX.md) + `pnpm audit:i18n`. **I18N-1/2 core done**. Còn tourism nav WARN · welcome SMS OTP · SMTP Owner · RBAC.

**Audit 19/07 (sync + AI hygiene):** working tree clean trên `jetvina` · merge `main` → `jetvina` (giữ [KH_KICH_BAN_HOP_TIENDO.md](./KH_KICH_BAN_HOP_TIENDO.md)) · `main` ↔ `jetvina` aligned · residual GĐ2 (`b243bc8`+) **đã commit** · agent SoT refresh ([AGENTS.md](../AGENTS.md) · [GIT_WORKFLOW.md](./GIT_WORKFLOW.md))

```text
Current phase: GĐ2 Dev complete
Current mode: Waiting for Owner
Active branch: jetvina (deploy / integration SoT; main = mirror after sync)
Next technical phase after Owner unlock:
1. SMTP inbox verification
2. Payment sandbox
3. OAuth sandbox
4. SMS sandbox
5. Integration health checks
6. End-to-end UAT
7. Production readiness review
```

1. **P0 Owner** — SMTP provider thật ([OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)); Mailpit catcher chỉ ops (`smtp=false` · `smtpCatcher=true`)  
2. **P1 Owner** — UAT · CMS · G4 keys  
3. **Optional deploy web** — locale form / EmptyLegAlertsForm parse (API empty-leg fix đã live)  
4. **Sau unlock** — [GD4_SANDBOX_READINESS.md](./GD4_SANDBOX_READINESS.md) · **không** bật fake production integration

### Đã deploy — Nhánh tổng hợp `jetvina` (2026-07-13)

- Base: JetVina UI/logo từ `feat/api-content-sync` (`b9c4c52`)
- Gộp: ops-mail (OperatorUser, EmailTemplate, flight notify, admin Operators/Templates)
- Gộp: nearby airports + quote search dùng pricing engine (positioning + round-trip + về base)
- Branch: `jetvina` · **API + Admin + Web đã deploy VPS** · migrate + seed OK
- Smoke BE: `/health` 200 · `/airports/nearby` 200 (SGN) · `POST /quotes/search-aircraft` 201 (3 options, POSITIONING) · admin `/dashboard/operators` + `/email-templates` 200 · web `/en-us` 200
- Fix deploy web: `formatNumber` trong `apps/web/src/config/locales.ts` — **đã có trong repo** (`jetvina`)
- **Footer payment chips** (2026-07-13) — bỏ remap JetBay CDN → ảnh JetVina; dùng `/placeholders/payment/*.svg` gốc (Visa/MC/Amex/UnionPay/Discover)
- **API sync + security plan** (2026-07-13) — local `:4000` ↔ prod ↔ docs **173 paths đồng bộ**; web local/prod cùng prod API · [JETBAY_API_SYNC_SECURITY_PLAN.md](./JETBAY_API_SYNC_SECURITY_PLAN.md)
- **Fleet slider + Phase A security** (2026-07-13) — aircraft showcase → FlightScrollRail + dots · placeholder ảnh · throttle quotes · `pnpm smoke:api-sync` · onboarding topology
- **Swagger polish** (2026-07-13) — enrich OpenAPI (summary+description mọi op) · tag descriptions · rewrite [API.md](./API.md) · deploy docs.minhtien.online
- **Swagger i18n + responsive UI** (2026-07-13) — `?lang=vi|en|zh-cn` · theme tối JetVina · picker ngôn ngữ · mobile/tablet friendly
- **Rebrand public JetBay→JetVina** (2026-07-13) — Swagger/docs · API mail/SMS · Admin shell (giữ path kỹ thuật cleanup)
- **Fix Swagger blank page** (2026-07-13) — bỏ `MutationObserver` trong i18n client (loop DOM → UI trống); retry `setInterval` · redeploy API
- **Swagger i18n titles** (2026-07-13) — UI fetch `/openapi.json?lang=` (spec nhúng EN không theo `?lang`) · dịch tiêu đề tag + summary (vi/zh)
- **API security Phase A/B** (2026-07-13) — key-split sync · Helmet/Nginx header dedupe · Swagger Basic opt-in · security.txt · Nginx rate-limit conf · newsletter throttle · [JETBAY_API_SYNC_SECURITY_PLAN.md](./JETBAY_API_SYNC_SECURITY_PLAN.md) status board
- **Seed airports / fleet / locales** (2026-07-13) — +~70 sân bay du lịch · 8 hãng · 10 model · 15 tail · thêm locale `ja/ko/th/id/fr/de/es/it/ru/ar` (UI shell)
- **Admin API URL fix** (2026-07-13) — login không còn trỏ `127.0.0.1:4000`; `deploy-admin.sh` luôn bake `api.minhtien.online`
- **Product i18n tourism** (2026-07-13) — `airportNoResults` + quote/FP/EL keys cho 10 locale · redeploy web
- **Mail diagnose** (2026-07-13) — scheduler OK; SMTP prod = `localhost:1025` → ECONNREFUSED · chờ SMTP thật
- **Gap report** — [JETVINA_GAP_REPORT.md](./JETVINA_GAP_REPORT.md)
- **Aviation motion icons** (2026-07-13) — SVG `AviationMotionIcon` (takeoff/landing/swap/radar/shield…) · hero trust + quote widget · redeploy web
- **Security Phase B ops** (2026-07-13) — Nginx rate-limit **applied** · Swagger Basic **ON** (401 anonymous) · demo passwords **rotated** · creds: `/root/backups/jetbay-security-ops-20260713-162720/` · [JETBAY_API_SYNC_SECURITY_PLAN.md](./JETBAY_API_SYNC_SECURITY_PLAN.md)
- **Fleet nearest-base search** (2026-07-13) — +10 airports (CDG/ORY/KIX/TPE/SFO/ORD/BOS/MLE/SEZ/HPH) · +10 aircraft · search ưu tiên base gần điểm đi · luôn hiện `baseAirport` + km · seed prod
- **JetVina media + loader + samples** (2026-07-13) — hotlink `jetvina.com` ON · page loader · +6 hãng mẫu · email templates en/vi · [JETVINA_SAMPLE_CONTENT.md](./JETVINA_SAMPLE_CONTENT.md)
- **Báo cáo tiến độ v3.0** (2026-07-13) — `/baocaotiendo` cập nhật % GĐ1/WEB/ADM · demo + Swagger Basic passwords (đã rotate) · không còn `Admin123!`/`Demo123!`
- **JetVina images shared** (2026-07-13) — `jv()` helper · private-jet-charter + heroes/fleet/destinations dùng catalog [jetvina.com](https://jetvina.com/) · không còn SVG demo fleet
- **T-S1-03 Quote phone** (2026-07-14) — bỏ `+10000000000`; validate `quotePhoneRequired`; label `phoneRequired` · rebuild `@jetbay/i18n`
- **T-S1-04 api-sync** (2026-07-14) — `smoke-api-sync.mjs`: Basic auth + `SYNC_MODE=auto|full|prod-docs` (local down → so sánh prod↔docs)
- **T-S2-01 empty/error** (2026-07-14) — `loadApi` + `ApiLoadNotice` trên Home FP/EL/JC + FP/JC/TC pages + EmptyLegBrowse
- **T-S2-02 fleet sample** (2026-07-14) — `AircraftCarousel` gắn tag “Sample fleet” + note; không silent MOCK; chưa public fleet API
- **T-S2-03 Quote UI proof** (2026-07-14) — `pnpm smoke:quote-ui` PASS · **requestId=36** · UI hiện `quoteSuccessWithId` (Reference #id)
- **T-S2-04 home news** (2026-07-14) — `loadApi` + EmptyState CTA / ApiLoadNotice trên Home + `/news`
- **T-S3-01 + T-S3-03** (2026-07-14) — [CHARTER_CMS_MAP.md](./CHARTER_CMS_MAP.md) · `PAGE_CMS_SLUG` ×6 · ADMIN_OPS §6–7
- **T-S3-02 Account UX** (2026-07-14) — error panel Retry/Login i18n · 401→login · empty CTA trên quotes/JC/TC/payments note
- **T-S4-02 backup drill** (2026-07-14) — **PASS** dump + restore test Airports **120=120** · script `backup-restore-drill.sh`
- **T-S4-03** (2026-07-14) — UAT pack + baocaotiendo **v3.1** live · web S1–S3 polish **deployed** www
- **T-S4-01 SMTP** (canonical): Dev implementation **PASS** · Production SMTP configuration **BLOCKED_OWNER_SMTP** · Inbox delivery **NOT RUN** · Overall **BLOCKED_OWNER**
- **Production API sync** — PASS **173=173** (VPS) · Local Basic: **NEEDS_LOCAL_ENV_REFRESH** nếu stale — [API_SYNC_SMOKE.md](./API_SYNC_SMOKE.md)
- **FINDSTR fix** — `pnpm smoke:html-probe`
- **Quote evidence** — `#37` prior · `#38`/`#39` earlier 15/07 · `#40` quote-ui · `#41` web-api · **latest audit** `smoke:quote-ui` **#46** (2026-07-15 evening)
- **Owner handoff** — [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)
- **HTML email redesign** (2026-07-15) — layout charcoal/gold · localize · API deployed · commits `7faace3`…`98ccdec`
- **Empty-leg alert 400** (2026-07-15) — DTO validators · redeploy · smoke **201** · commit `b9dce75`
- **GĐ2 closure audit** (2026-07-15 evening) — tree was clean at `b9dce75` · SMTP still LOOPBACK/catcher · tests PASS · residual html-probe + prod-recheck **committed** `b243bc8` — [COMMIT_PLAN_GD2.md](./COMMIT_PLAN_GD2.md)
- **Spec Kit** (2026-07-15) — CLI `specify` **v0.12.15** (uv tool, GitHub) · `specify init --here --integration cursor-agent --script ps` · constitution JetBay · [SPEC_KIT.md](./SPEC_KIT.md)
- **Git/code security** (2026-07-15) — `pnpm security:scan` + pre-commit hooks · CI secret job · Dependabot · [GIT_AND_CODE_SECURITY.md](./GIT_AND_CODE_SECURITY.md) · commit `76a7d78` · web redeployed · **demo+Swagger rotated** → VPS `/root/backups/jetbay-security-ops-20260715-165745/demo-passwords.txt` · push `jetvina` OK

**VƯỚNG (Owner):** O4 SMTP · UAT · CMS · G4 keys · media decision — xem [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)  
**Kế hoạch:** [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md) · **SMTP:** [SMTP_SETUP_GUIDE.md](./SMTP_SETUP_GUIDE.md)

### Đã merge + deploy (2026-07-10)

- [x] **GĐ1 ĐÓNG** — `fix-gd1-prod.sh` · smoke **55/55** · `APP_ENV=production` · FP×12 · news×1 · [GD1_SIGNOFF.md](./GD1_SIGNOFF.md)
- [x] **Deploy web + admin** (2026-07-10) — Home news/newsletter · FP tiers · admin FP options · smoke 55/55 · pages 200
- [x] **CSS polish web** (2026-07-10) — logo JetBay · header desktop · airport dropdown · hero overflow · redeploy `jetbay-web`
- [x] **Motion effects web** (2026-07-10) — scroll reveal · hero flight path · parallax · stat progress
- [x] **Motion v2** (2026-07-10) — counter 10K+/190+ · 3D tilt cards · page transition · booking flow FX
- [x] **i18n GĐ1** (2026-07-10) — `@jetbay/i18n` · reverse locale DB `en` · `/i18n/config` · FE middleware cookie · [I18N_ROADMAP.md](./I18N_ROADMAP.md)
- [x] **Deploy i18n GĐ1 prod** (2026-07-10) — API `jetbay-be` + web `jetbay-web` · `/i18n/config` public · vendor i18n `dist/`
- [x] **i18n review fixes** (2026-07-11) — `isValidDbLocale` · article metadata locale · canonical stub · deploy-web npm install · `/en`→`/en-us` redirect
- [x] **i18n đa ngôn ngữ UI** (2026-07-11) — LanguagePicker tìm kiếm · nav/footer dịch 6 locale · page content overlay · booking widget `t()`
- [x] **Auth header + account UI** (2026-07-11) — HeaderUserMenu khi đăng nhập · sidebar account dashboard · deploy prod
- [x] **Account dashboard v2** (2026-07-11) — `GET /account/dashboard` · fetch 1 lần · UI hiện đại + motion · stats/quotes/bookings/payments/docs
- [x] **Customer care email** (2026-07-11) — `EmailSubscriber` + `EmailCampaignLog` · `CustomerCareService` cron · templates HTML · hooks register/quote/newsletter/booking/payment · fix 429 account (`SkipThrottle` + layout provider)
- [x] **i18n dịch sạch FP + newsletter** (2026-07-11) — Fixed Price / Empty Leg / footer newsletter · ~50 key mới trong `@jetbay/i18n` · wire `t()` toàn trang listing
- [x] **Service page CSS heritage** (2026-07-11) — `jetbay-service.css` · Playfair/Cormorant fonts · fix contrast light bands · neo-classical gold/cream
- [x] **Home stats + logo polish** (2026-07-11) — fix invisible counter gradient on light band · uniform stat cards · retina logo · news grid width cap · footer newsletter placeholder contrast
- [x] **Modern UI audit** (2026-07-11) — news card thumbnail + read more · footer 4-col + fix newsletter title wrap · media logo grid · payment/social chips · `jetbay-modern.css`
- [x] **UI polish v2** (2026-07-11) — SVG logo Retina · newsletter band · empty states · skeleton loading · focus rings + skip link
- [x] **Quote widget FE↔BE** (2026-07-11) — tách search vs request quote · tripType · consent + email bắt buộc · typed API · empty leg departAt · JetCard plan.name từ API
- [x] **FlightScrollRail** (2026-07-11) — bỏ scrollbar ngang · nút máy bay + đường bay progress · Fixed Price · Empty Legs · Stats mobile · Aircraft · Media · trip tabs
- [x] **Light cards + MediaHero** (2026-07-11) — fix chữ trắng trên card trắng (StepsTimeline/FeatureGrid) · ảnh destination/article 16:9 cover · Empty Leg steps → LightSection
- [x] **FP detail spacing + colors** (2026-07-11) — bỏ `jb-motion-reveal` ẩn nội dung · `jb-slug-body--wide` · hero service compact · tier/inclusion contrast · btn-outline gold
- [x] **Airport search locale** (2026-07-11) — `?locale=` trên `/airports/search` · nhãn vi/zh · alias hcm/hue/HUI · autoSelect khi gõ tắt
- [x] **Deploy prod** (2026-07-11) — API + web + seed HUI · smoke hcm/hue locale vi/en · FP/corporate/home **200**
- [x] **Media public URLs** (2026-07-11) — `@Public()` GET `/media/*` · fix NestJS wildcard truncate · admin URL textarea · sync-admin + i18n vendor
- [x] **Local polish bugs** (2026-07-13) — fix hydration (imperative hero canvas) · scroll-behavior attr · DateField in quote widget · pax/date contrast · remove nested pnpm-workspace · turbopack.root

### Đang làm — Ops platform (`feat/api-ops-platform`, 2026-07-13)

- [x] Phase 1 schema — `Aircraft` tail + location · FlightLeg · PricingEstimate · RBAC · Contracts · migration `20260713100000_ops_platform` · seed CAN/HAN/SGN + `B-JBAY1` @ CAN · sales.vn / sales.nocancel
- [x] Phase 2 pricing — `POST /pricing/estimate` · booking breakdown/recalculate · unit tests CAN→HAN→SGN (positioning + min hours + snapshot)
- [x] Phase 3 — `/airports/continents|countries` · empty-leg continent/country filters · web `EmptyLegBrowse` + «Giá ước tính»
- [x] Phase 4 — Permission DENY>ALLOW>ROLE · `PermissionGuard` · airport scope APIs · admin `/dashboard/permissions`
- [x] Phase 5–6 — OperatorContract workflow · mock DocuSign · idempotent `POST /webhooks/docusign` · `.env.example` DocuSign keys
- [x] Phase 7 — admin fleet/contracts/permissions · booking «Giá ước tính» columns · API `nest build` PASS · unit 11/11 PASS
- [x] Siết (2026-07-13): cancel `booking.cancel` cho staff · airport list theo UserAirportScope · `canParkAircraft` trong pricing · admin permission ticks · [OPS_CHARTER_FLOW.md](./OPS_CHARTER_FLOW.md)
- [ ] **Blocked local:** no Docker → chưa `migrate deploy` / seed trên máy này — chạy migrate+seed khi có Postgres (local hoặc VPS staging)
- [ ] **Không deploy prod** cho đến khi được yêu cầu

### Đang làm — Content sync / JetVina SAFE_REFERENCE (`feat/api-content-sync`, 2026-07-13)

**Canonical status:** [media-content-sync-status.md](./media-content-sync-status.md)

- [x] Mode **SAFE_REFERENCE_MODE** (no ownership evidence in repo)
- [x] Docs foundation + MediaAsset schema / API / Media Review UI
- [x] Media resolver, manifest, no-hotlink, DB review API — **DONE** (see status file)
- [x] `/baocaotiendo` public title → JetVina Website
- [x] Admin Media Review browser E2E — **PASS** (`test:e2e:admin-media`)
- [x] Content sync publish/rollback automation — **PASS** (Jest integration)
- [x] Mirror sync → MediaAsset DB import — **PASS** (flag-gated API + CLI)
- [ ] Written media authorization — **BLOCKED**
- [ ] Client-provided production media — **BLOCKED**
- [ ] Package rename `@jetbay/*` — **DEFERRED**
- [ ] **No prod deploy** / **No push** unless requested

Local DB note: migrate/seed on **`jta_db`** (PARTIAL isolation — not CREATE `jetbay_db`). Not a full PostgreSQL blocker.
Demo seed (sau migrate+seed): `sales.vn@jetbay.local` / `Sales123!` (scope VN) · `sales.nocancel@jetbay.local` (DENY `booking.cancel`)

- [x] `feat/api-security-hardening` (+ admin screens / partner-TC) → **`main`** (`9893789`)  
- [x] VPS API `jetbay-be` + Admin `jetbay-admin` redeployed  
- [x] Prod smoke admin **16/16** · web **8/8**  
- [x] Redeploy (Content DTO validators + article `#NaN` fix + Settings UI) — `ARTICLE_PATCH 200` · smoke **16/16** + **8/8**  
- [x] OpenAPI YAML (`/openapi.yaml`) + `@jetbay/api-client` (`pnpm openapi:client`) · docs RN section in API.md · prod YAML **200**  
- [x] **Báo cáo tiến độ KH** (`/baocaotiendo`) — UI aviation + JS effects · redeploy web **200**
- [x] **Retest full prod** — smoke BE 16/16 · docs 11/11 · admin 16/16 · web 8/8 · [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md)

### Đang làm / vừa xong (tuần 1 — 10/07)

- [x] Admin FP **price tiers** editor (`options[]` category, price, pax, terms)
- [x] Web Home: News + Newsletter sections wired
- [x] FP listing: `categoryLabel`, `includedTerms`, empty state
- [x] `docs/JETBAY_WORK_PLAN.md` + `docs/KH_G4_KEYS_CHECKLIST.md`
- [ ] Charter ×6 polish vs scratch (tuần 2–3)
- [x] Deploy admin/web lên prod (2026-07-10)

### Đang làm / vừa xong (admin)

- [x] Partner applications: Approve / Reject (+ tạo `PartnerAccount` khi approve)  
- [x] Travel Credit packages: CRUD DB (thay hardcode) + admin form  
- [x] Prod: migrate `TravelCreditPackage` · API `:3010` · admin redeployed  
- [!] Prod `.env` từng lệch `jta_db` / `PORT=4000` — đã sửa → `jetbay_db` + `PORT=3010` (backup `.env.bak-*`)  
- [x] Nav: Aircraft · Media · Videos · CMS Pages  
- [x] Quotes status workflow (`PATCH /admin/quotes/:id/status`)  
- [x] Videos CMS UI  
- [x] Airport admin CRUD  
- [x] CMS Pages editor (`/dashboard/content/pages/[id]`)  
- [x] **API security hardening** (`feat/api-security-hardening`): JWT on `POST /bookings`, OTP CSPRNG, SMS `APP_ENV`, QuoteOffer admin API, optional JWT on quote request

### Test trước khi deploy (bắt buộc)

```powershell
# Local
cd apps/api; npx tsc --noEmit; npm test; cd ../..
cd apps/admin; npx tsc --noEmit; npm run build; cd ../..
$env:API_URL='http://127.0.0.1:4000'
node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
node scripts/deploy/jetbay-be/smoke-web-api.mjs

# Chỉ deploy khi RESULT pass
# Sau deploy: smoke lại với API_URL=https://api.minhtien.online
# Full suite prod: bash scripts/deploy/jetbay-be/smoke-all.sh (trên VPS)
```

### Redeploy web (Windows)

```powershell
powershell -File scripts/deploy/jetbay-be/sync-web.ps1
ssh root@103.200.20.100 "export DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'; bash /var/www/jetbay-web/deploy/deploy-web.sh"
```

---

## Code trang chính (clone)

```text
apps/web/src/app/[locale]/page.tsx     ← Home
apps/web/src/components/home/          ← Hero, FP, EL, JetCard…
apps/web/src/app/[locale]/*            ← Các trang con
scratch/                               ← HTML mẫu jet-bay.com
```

```bash
pnpm --filter @jetbay/web dev
# mở http://localhost:3000/en-us
```

---

## Về nhà / máy mới / nhân viên khác

**Hướng dẫn đầy đủ (clone + env + DB + chạy app):**  
→ [ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md)

```bash
git clone https://github.com/minhtien2412tran/baogia.git
cd baogia
git pull origin main
pnpm install
node scripts/generate-local-env.mjs
node scripts/sync-frontend-api-key.mjs
pnpm db:up
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed
# đọc ONBOARDING_NHAN_VIEN.md + JETBAY_PRODUCT_MAP.md + file này
```

Demo seed: `admin@jetbay.local` / `Admin123!` · `demo@jetbay.local` / `Demo123!`  
(Prod có thể còn `@j-ta.local` nếu chưa re-seed.)

## Liên kết

[ONBOARDING_NHAN_VIEN.md](./ONBOARDING_NHAN_VIEN.md) · [AGENTS.md](../AGENTS.md) · [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md) · [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md) · [GD1_SIGNOFF.md](./GD1_SIGNOFF.md) · [JETBAY_BAO_GIA.md](./JETBAY_BAO_GIA.md) · [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
