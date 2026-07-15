# Project Status Report 3.1

> **Date:** 2026-07-14 · **Version:** 3.1 · **Status:** **DEPLOYED / OPTIONAL_OWNER_REVIEW** (live `/baocaotiendo`)  
> **Evidence:** [TEST_MATRIX.md](./TEST_MATRIX.md) · [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md) · [GD2_ROADMAP.md](./GD2_ROADMAP.md)

## Executive

GĐ1 nội bộ đã đóng (10/07). Prod API/Web/Admin sống. GĐ2 Dev S1–S4 (trừ inbox mail) **DONE**. Backup restore **PASS** (Airports=120). **Mail deliver BLOCKED_OWNER_SMTP** — `SMTP_HOST=LOOPBACK`. Pay/OAuth/SMS false.

**Verdict overall:** **PARTIAL** — GĐ2 Dev-ready; NT đầy đủ còn SMTP (O4) + Owner UAT sign + G4 keys. O3 wording = optional review only.

## GĐ1

| Hạng mục | Status |
|----------|--------|
| Smoke 55/55 (historical signoff) | DONE nội bộ |
| Biên bản với Anh | OPEN — cuối tuần 4 |
| SMTP deliver | **BLOCKED** (localhost:1025) |
| Backup restore drill | **PASS** 2026-07-14 |

## Web GĐ2 (Dev)

| | |
|--|--|
| Quote phone required / no fake | DONE |
| Commercial/home empty≠error | DONE |
| Fleet carousel | SAMPLE labelled |
| Quote UI proof | `#38` quote-ui · `#39` web-api (`#37` historical) |
| News empty/error | DONE |
| Charter CMS map | DOCUMENTED |
| Account retry / empty CTA | DONE |
| Prod deploy of S1–S3 polish | DONE |

## API / Ops

| | |
|--|--|
| health production | PASS |
| integrations.smtp | false · smtpHostSet true · blockedReason loopback |
| SMTP_HOST prod | LOOPBACK (`localhost`) — Delivery **BLOCKED_OWNER_SMTP** |
| Backup dump | `/root/backups/jetbay-db/jetbay-20260714-145739.dump` |
| Restore drill | PASS airports 120=120 |
| API sync prod↔docs | PASS **173=173** |

## Test evidence

- smoke-web-api PASS (#39) · smoke-auth-booking PASS · smoke:quote-ui PASS (#38)  
- backup-restore-drill PASS (2026-07-14)  
- Pay/OAuth/SMS: false on `/integrations/status`

## Blockers còn mở

| ID | Blocker | Owner |
|----|---------|-------|
| B1 / O4 | SMTP thật (không localhost) | Owner — [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md) |
| O3 | Wording baocaotiendo 3.1 | **OPTIONAL** (đã live) |
| G4 | Stripe/OnePay/9Pay + OAuth + SMS | Owner |
| CMS | Publish thêm news/charter body | Owner |

## Kết luận

**Dev GĐ2 sprint work hết phần không phụ thuộc Owner.** Không tuyên bố mail OK / payment OK / NT GĐ2 signed.
