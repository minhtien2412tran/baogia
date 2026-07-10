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

*GĐ1 kỹ thuật đạt — mở GĐ2 web polish theo [JETBAY_WORK_PLAN.md](./JETBAY_WORK_PLAN.md).*
