# Continue at home — Jet-Bay

> **Mục riêng trong repo** (commit được lên GitHub). Chat Cursor không nhớ — mở file này sau `git pull`.

**Cập nhật lần cuối:** 2026-07-09  
**Repo:** https://github.com/minhtien2412tran/baogia.git  
**Nhánh mặc định:** `main` (ổn định) · làm việc trên `feat/web-*` | `feat/api-*` | `feat/admin-*`

---

## Đã xong (prod)

- [x] API `api.minhtien.online` + Admin `admin.minhtien.online` + Docs Swagger
- [x] Tách BE cũ (port/DB/env) — không đụng HomeFix
- [x] Rotate secrets + `ApiKeyGuard` (`X-API-Key`) + throttle auth
- [x] Swagger: schemes `bearer` + `X-API-Key`
- [x] Smoke prod API key: 16/16 pass

## Việc tiếp theo (ưu tiên)

1. **P1 OTP env** — `OTP_COOLDOWN_SECONDS` / `OTP_MAX_ATTEMPTS` khi bật SMS (G4)
2. **Web polish** — parity trang theo `JETBAY_WEB_PAGE_DOD.md` (nhánh `feat/web-*`)
3. **Admin CRUD** — form còn thiếu (nhánh `feat/admin-*`)
4. **G4 keys KH** — SMTP / OAuth / payment sandbox (không hardcode secret)

## Phân nhánh khi code

| Bạn sửa | Checkout |
|---------|----------|
| `apps/web/**` | `git checkout -b feat/web/<ten-viec>` |
| `apps/api/**` | `git checkout -b feat/api/<ten-viec>` |
| `apps/admin/**` | `git checkout -b feat/admin/<ten-viec>` |
| Docs/deploy only | `chore/docs-*` hoặc `chore/deploy-*` |

Chi tiết: [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)

## Về nhà — 5 lệnh

```bash
git clone https://github.com/minhtien2412tran/baogia.git   # lần đầu
cd baogia
git pull origin main
pnpm install
# đọc file này + AGENTS.md rồi mới code
```

Sau khi xong việc:

```bash
# cập nhật mục "Việc tiếp theo" trong file này
git add -A
git status   # kiểm tra KHÔNG có .env
git commit -m "..."
git push -u origin HEAD
```

## Không commit

- `apps/*/.env`, `.env.local`, `*.env.bak*`
- Secret VPS, password demo bàn giao (chỉ ghi trong checklist nội bộ nếu cần)

## Liên kết nhanh

- [AGENTS.md](../AGENTS.md) · [JETBAY_DELIVERY_CHECKLIST.md](./JETBAY_DELIVERY_CHECKLIST.md) · [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) · [API.md](./API.md)
