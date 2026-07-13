# Media / content-sync gap audit (retest 2026-07-13)

## Retest vừa chạy — PASS

| Suite | Result |
|-------|--------|
| `pnpm test:media` | 17/17 |
| API Jest | 41/41 |
| `audit:asset-references` | PASS |
| `validate:jetvina-media-manifest` | PASS (42 records, 5 mirrored) |
| `audit:branding` / `audit:debug` | PASS |
| `prisma migrate status` | up to date |
| Playwright staging media | 13/13 |
| Playwright production no-hotlink | 6/6 |
| `media-api-smoke` (ADMIN) | PASS |
| `media.reviewer` list 200 / approve-production **403** | PASS |
| Web `:3000` / API `:4000` / Admin `:3001` | 200 |

## Còn thiếu — TEST

| Gap | Mức | Ghi chú |
|-----|-----|---------|
| Playwright Admin Media Review (login UI → filter → approve) | DEFERRED | API/HTTP đã cover; chưa có browser E2E |
| Content sync **publish** E2E | DEFERRED | `CONTENT_SYNC_PUBLISH_ENABLED` mặc định off |
| Content sync **rollback** E2E | DEFERRED | Doc có quy trình; chưa automation |
| `pnpm sync:jetvina-media` → ghi `MediaAsset` DB | MISSING | Script chỉ ghi FE mirror/manifest; DB fixtures từ seed |
| Viewer / sync-operator full permission matrix HTTP | PARTIAL | Seeded reviewer OK; chưa smoke mọi role |
| Xóa physical `/public/assets/jetbay` | DEFERRED | 0 public refs; binaries còn trên disk |
| Dedicated DB `jetbay_db` | BLOCKED | User không có CREATE DATABASE; đang `jta_db` |

## Còn thiếu — TÀI LIỆU (đã vá trong pass audit này)

| Doc | Trước | Sau |
|-----|-------|-----|
| `content-rights-policy.md` | Không mô tả MediaAsset flags/API | Đã bổ sung staging/production rules |
| `content-sync-runbook.md` | Chỉ discover; thiếu media commands | Đã bổ sung media + test commands + gaps |
| `jetvina-media-jetbay-asset-audit.md` | Nói còn reference `/assets/jetbay` | Đã cập nhật: audit PASS, `/media-seed` |

## Blocker nghiệp vụ (không phải thiếu code)

1. Written media/logo authorization  
2. Client-provided production assets  
3. Bật `JETVINA_MEDIA_PRODUCTION_ENABLED` / `CONTENT_SYNC_PUBLISH_ENABLED` chỉ sau rights  

## Kết luận

Kỹ thuật media + DB review **đủ để PARTIAL**. Phần chưa đủ chủ yếu là: Admin Playwright E2E, publish/rollback automation, nối file-sync → MediaAsset DB, và tài liệu đã được đồng bộ lại trong audit này.
