# Git workflow — FE / BE / Dashboard

Mục tiêu: code nhiều máy không nhầm app; PR nhỏ; secret không lên GitHub.

## Nhánh

| Nhánh | Ý nghĩa |
|-------|---------|
| **`jetvina`** | **Active integration / deploy SoT** — branch làm việc mặc định; VPS deploy theo nhánh này |
| `main` | Mirror ổn định sau sync với `jetvina` (đừng giả định `main` mới hơn `jetvina`) |
| `feat/web/<slug>` | Chỉ (hoặc chủ yếu) `apps/web` |
| `feat/api/<slug>` | Chỉ (hoặc chủ yếu) `apps/api` + prisma nếu cần |
| `feat/admin/<slug>` | Chỉ (hoặc chủ yếu) `apps/admin` |
| `chore/docs-<slug>` | Docs / AGENTS / rules |
| `chore/deploy-<slug>` | `scripts/deploy/**` |

Tránh một PR sửa cả web + api + admin trừ khi bắt buộc (ví dụ đổi contract API + client).

Feature branches: **branch off `jetvina`**, mở PR **vào `jetvina`** cho đến khi Owner đổi quy ước. Sau merge vào `jetvina`, sync `main` ← `jetvina` khi đóng milestone.

## Quy trình hàng ngày

```bash
git checkout jetvina
git pull origin jetvina
git checkout -b feat/web/my-task    # hoặc feat/api/... / feat/admin/...

# ... code ...

# Cập nhật docs/CONTINUE_AT_HOME.md nếu đổi tiến độ
git add <files-an-toan>
git status                          # xác nhận không có .env
git commit -m "feat(web): short why"
git push -u origin HEAD
# mở PR vào jetvina trên GitHub
```

## An toàn trước khi push

```bash
pnpm security:hooks          # một lần / máy (core.hooksPath)
git status
git diff --cached
pnpm security:scan           # hoặc để pre-commit chạy tự động
# FAIL nếu thấy: .env, credentials, private keys, sk_live_, ghp_, …
```

Đã ignore: `.env*`, keys/PEM, `credentials.json` (xem `.gitignore`).  
Chi tiết: [GIT_AND_CODE_SECURITY.md](./GIT_AND_CODE_SECURITY.md).

## Cursor / AI trên máy mới

1. `git checkout jetvina && git pull origin jetvina`
2. Mở folder repo trong Cursor (`webclonejetbay` / `baogia`)
3. `@docs/CONTINUE_AT_HOME.md` + `@AGENTS.md`
4. Rules trong `.cursor/rules/` tự load (đã commit)

## Map path → nhánh

```
apps/web/**     → feat/web-*
apps/api/**     → feat/api-*
apps/admin/**   → feat/admin-*
packages/**     → cùng PR với app đang dùng package
docs/**         → chore/docs-* hoặc kèm feature branch
```
