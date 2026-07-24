# GĐ1 — Biên bản nghiệm thu nội bộ

**Dự án:** JetBay 74TR · **Giai đoạn:** 1 (Backend + nền)  
**Ngày đóng GĐ1:** 2026-07-10  
**Prod API:** https://api.minhtien.online · **Swagger:** https://docs.minhtien.online/swagger

---

## Tiêu chí DoD (G1)

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 1 | Seed airports, aircraft, FP×12, EL×2, content | ✅ | prod: FP=12, EL=2, news=1, destinations=14 |
| 2 | CORS production | ✅ | admin + www + docs |
| 3 | `dotenv` + ValidationPipe + guards | ✅ | `main.ts`, smoke ApiKey 401 |
| 4 | Smoke prod full suite | ✅ | **55/55** (xem bảng dưới) |
| 5 | `APP_ENV=production` | ✅ | `GET /health` → `"env":"production"` |
| 6 | Auth JWT + refresh + booking | ✅ | `smoke-auth-booking.mjs` 4/4 |
| 7 | Không đụng `api.baotienweb.cloud` | ✅ | deploy script tách biệt |
| 8 | MinIO / upload | ✅ | `MINIO_ENDPOINT` cleared → `integrations.minio: "local"` |

---

## Smoke prod (2026-07-10 sau `fix-gd1-prod.sh`)

| Bộ | Pass |
|----|------|
| `smoke-prod.sh` | 16/16 |
| `smoke-docs.sh` | 11/11 |
| `smoke-admin-crud.mjs` | 16/16 |
| `smoke-web-api.mjs` | 8/8 |
| `smoke-auth-booking.mjs` | 4/4 |
| **Tổng** | **55/55** |

```bash
# Chạy lại trên VPS
bash /var/www/jetbay-be/deploy/smoke-all.sh
```

---

## Script đóng GĐ1 prod

```bash
DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' bash /var/www/jetbay-be/deploy/fix-gd1-prod.sh
```

Thực hiện: `APP_ENV=production`, clear MinIO broken endpoint, `prisma migrate deploy` + seed, build, PM2 restart, smoke-all.

---

## Phạm vi GĐ2 (đã mở)

- Web visual polish vs `scratch/`
- Charter ×6, account flows
- CMS nội dung thật từ KH
- G4 keys (pay/OAuth/SMS) — chờ KH từ tuần 6

---

## Ký nội bộ

| Vai trò | Trạng thái | Ngày |
|---------|------------|------|
| Dev (Minh Tiến Solutions) | ✅ Đóng GĐ1 kỹ thuật | 2026-07-10 |
| Khách hàng (Anh Tuấn Anh) | ⬜ Chờ ký biên bản | — |

**Trạng thái chuẩn (24/07):** `TECHNICALLY DONE — PENDING CONTRACTUAL SIGN-OFF`

### SMTP production (W5 / T-S4-01) — cập nhật 24/07 ~10:52

```text
Configuration: PASS · smtp=true · smtpCatcher=false · smtpDeliverable=true
Provider meta: SMTP_HOST=smtp.gmail.com · PORT=465 · SECURE=true · ALLOW_CATCHER=false
Evidence send: EmailService sent quote #61 + #62 (customer ACK + sales alert)
Newsletter: emailDeliverable=true (smoke:newsletter-smtp)
Retry: EmailCampaignLog attempts < 3 (code path verified)
Sign-off path: phương án A — không cần residual SMTP
```

*GĐ1 kỹ thuật đạt — mở GĐ2 web polish theo [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md).*

---

## Phụ lục — Residual SMTP (phương án B · **không dùng** nếu đã PASS ở trên)

> Chỉ dùng khi Owner **chưa** cấu hình SMTP production nhưng hai bên vẫn muốn ký đóng GĐ1.  
> **24/07:** SMTP đã PASS → bỏ phụ lục này khi họp ký.

```text
RESIDUAL — SMTP PRODUCTION (không chặn đóng GĐ1)

1. Tình trạng hiện tại: SMTP_HOST trên VPS đang loopback/catcher;
   mail quote/newsletter chưa vào inbox khách thật.
2. Hai bên thống nhất: hạng mục này KHÔNG chặn nghiệm thu kỹ thuật GĐ1.
3. Người chịu trách nhiệm cung cấp: Anh Tuấn Anh (Owner) — biến SMTP_* trên VPS
   (không gửi mật khẩu qua chat/Git). Hướng dẫn: docs/OWNER_NEXT_ACTIONS.md · docs/SMTP_SETUP_GUIDE.md
4. Điều kiện cần: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
   (+ optional SMTP_ENQUIRY_TO). Sau cấu hình: pm2 restart jetbay-be --update-env
   và /integrations/status → smtp=true.
5. Dev verify: ≥1 mail test vào inbox + ghi PASS vào GD1_SIGNOFF / TEST_MATRIX.
6. Hạn xử lý đề xuất: trước nghiệm thu GĐ2 staging (tuần 8) — trừ khi phụ lục khác.
7. Giai đoạn tiếp nhận nếu trễ: GĐ4 / phụ lục tích hợp (ghi rõ nếu đổi).

Chữ ký Owner: ________  Ngày: ________
Chữ ký Dev/PM: ________  Ngày: ________
```

**Phương án A (đủ SMTP):** bỏ phụ lục này — ghi “SMTP production PASS ngày ____ · evidence TEST_MATRIX”.
