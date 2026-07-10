# Onboarding user mới — JETBAY

> Dành cho người **không phải Minh** (máy mới / máy nhà).  
> Làm lần lượt từ trên xuống. Không cần SSH VPS trừ khi được giao deploy.

**Repo:** https://github.com/minhtien2412tran/baogia.git  
**Sản phẩm chính:** clone jetbay.com → `apps/web`  
**Báo giá** `m-tien.com/jet-bay` chỉ là collateral — không sửa như product.

---

## 0. Cần cài sẵn (một lần trên máy)

| Tool | Gợi ý kiểm tra |
|------|----------------|
| Git | `git --version` |
| Node.js **v22+** | `node -v` |
| pnpm **v10+** | `npm i -g pnpm` rồi `pnpm -v` |
| Docker Desktop | `docker -v` (bắt buộc nếu chạy DB local) |
| Cursor / VS Code | mở folder repo sau khi clone |
| (Tuỳ chọn) GitHub CLI | `gh auth login` nếu dùng PR từ terminal |

**Windows:** dùng PowerShell hoặc Git Bash.  
**macOS/Linux:** Terminal / zsh / bash.

---

## 1. Xin quyền GitHub

1. Gửi **GitHub username** cho Minh / owner repo.  
2. Được add collaborator (hoặc org team) với quyền **Write** (để push nhánh feature).  
3. Đăng nhập GitHub trên máy:

```bash
# HTTPS (đơn giản)
gh auth login
# hoặc cấu hình credential helper / Personal Access Token

# SSH (nếu dùng SSH key)
ssh-keygen -t ed25519 -C "tenban@congty.com"
# copy ~/.ssh/id_ed25519.pub → GitHub → Settings → SSH keys
ssh -T git@github.com
```

---

## 2. Clone repo (lần đầu)

### HTTPS

```bash
cd ~/work
# Windows ví dụ: cd C:\work
git clone https://github.com/minhtien2412tran/baogia.git
cd baogia
```

### SSH

```bash
cd ~/work
git clone git@github.com:minhtien2412tran/baogia.git
cd baogia
```

### Kiểm tra

```bash
git remote -v
git branch -a
git status
```

Kỳ vọng: `origin` trỏ `minhtien2412tran/baogia`, đang ở `main` (hoặc sau khi checkout).

---

## 3. Lấy code mới nhất (hàng ngày / máy đã clone)

```bash
cd baogia
git checkout main
git pull origin main
pnpm install
```

Nếu đang làm nhánh feature và muốn cập nhật `main` vào nhánh:

```bash
git checkout feat/web/ten-viec-cua-ban
git fetch origin
git merge origin/main
# hoặc: git rebase origin/main  (chỉ khi team đồng ý rebase)
```

---

## 4. Cài dependency + env local

```bash
cd baogia
pnpm install

# Tạo apps/api/.env (secret random — KHÔNG commit)
node scripts/generate-local-env.mjs

# Copy API_KEY sang web/admin (.env.local)
node scripts/sync-frontend-api-key.mjs
```

**Cấm:** commit `.env`, `.env.local`, password, API key thật.

---

## 5. Hạ tầng local (Docker)

```bash
pnpm db:up
# Postgres :5432  user/pass/db = jetbay_user / jetbay_password / jetbay_db
# Redis :6379 · MinIO :9000 · Mailpit :8025
```

Tắt khi xong ngày:

```bash
pnpm db:down
```

---

## 6. Database migrate + seed

```bash
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed
```

### Tài khoản demo (sau seed)

| Vai trò | Email | Password |
|---------|-------|----------|
| Admin | `admin@jetbay.local` | `Admin123!` |
| User | `demo@jetbay.local` | `Demo123!` |

Prod có thể còn `admin@j-ta.local` nếu chưa re-seed — chỉ dùng khi test prod được phép.

---

## 7. Chạy app local

### Cách A — cả monorepo

```bash
pnpm dev
```

### Cách B — từng app (khuyên dùng khi chỉ làm 1 phần)

```bash
# Terminal 1 — API
pnpm --filter @jetbay/api start:dev
# http://127.0.0.1:4000  · Swagger: http://127.0.0.1:4000/swagger

# Terminal 2 — Web (sản phẩm chính)
pnpm --filter @jetbay/web dev
# http://localhost:3000/en-us

# Terminal 3 — Admin
pnpm --filter @jetbay/admin dev
# http://localhost:3001/login
```

### Chỉ nối API prod (không cần Docker DB)

Trong `apps/web/.env.local` / `apps/admin/.env.local` có thể trỏ:

```env
NEXT_PUBLIC_API_URL=https://api.minhtien.online
NEXT_PUBLIC_API_KEY=<xin Minh key hoặc sync từ local nếu chỉ test UI>
```

Vẫn **không** commit file này.

---

## 8. URL tham chiếu

| Vai trò | Local | Prod |
|---------|-------|------|
| Web clone | http://localhost:3000/en-us | https://www.minhtien.online/en-us |
| Admin | http://localhost:3001/login | https://admin.minhtien.online/login |
| API | http://127.0.0.1:4000 | https://api.minhtien.online |
| Swagger | http://127.0.0.1:4000/swagger | https://docs.minhtien.online/swagger |
| Báo giá (không phải product) | — | https://m-tien.com/jet-bay/ |

---

## 9. Git workflow (làm việc hàng ngày)

```bash
git checkout main
git pull origin main

# Đặt tên nhánh theo app
git checkout -b feat/web/mo-ta-ngan      # chỉ apps/web
# git checkout -b feat/api/mo-ta-ngan   # chỉ apps/api
# git checkout -b feat/admin/mo-ta-ngan # chỉ apps/admin

# ... code ...

git status
git diff
# Xác nhận KHÔNG có .env / .env.local

git add <files>
git commit -m "feat(web): mo ta ngan ly do"
git push -u origin HEAD
```

Mở PR vào `main` trên GitHub:  
https://github.com/minhtien2412tran/baogia/compare

Chi tiết: [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)

---

## 10. Đọc trước khi code (Cursor)

1. Mở folder `baogia` trong Cursor  
2. Chat: `@docs/CONTINUE_AT_HOME.md` + `@AGENTS.md` + `@docs/JETBAY_PRODUCT_MAP.md`  
3. Rules trong `.cursor/rules/` tự load  

| File | Mục đích |
|------|----------|
| [CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) | Tiến độ / URL / việc tiếp |
| [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md) | Product vs báo giá |
| [AGENTS.md](../AGENTS.md) | Map monorepo + hard rules |
| [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) | Env / không commit secret |

---

## 11. Test trước khi nhờ deploy

```bash
# API
cd apps/api
npx tsc --noEmit
npm test
cd ../..

# Admin
cd apps/admin
npx tsc --noEmit
npm run build
cd ../..

# Smoke (API local đang chạy :4000)
# PowerShell:
$env:API_URL='http://127.0.0.1:4000'
node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
node scripts/deploy/jetbay-be/smoke-web-api.mjs
```

Chỉ deploy VPS khi smoke **RESULT pass** và được Minh / lead duyệt.  
Deploy scripts: `scripts/deploy/jetbay-be/` — **không** tự chạy trên prod nếu chưa được giao.

---

## 12. Checklist “đã vào dự án xong”

- [ ] Clone được repo, `git pull origin main` OK  
- [ ] `pnpm install` OK  
- [ ] `generate-local-env` + `sync-frontend-api-key` OK  
- [ ] `pnpm db:up` + migrate + seed OK  
- [ ] Mở được web `:3000/en-us`, admin `:3001`, API swagger `:4000`  
- [ ] Login admin seed OK  
- [ ] Đã đọc CONTINUE_AT_HOME + PRODUCT_MAP  
- [ ] Biết tạo nhánh `feat/web-*` / `feat/api-*` / `feat/admin-*`  
- [ ] Biết **không** commit `.env`

---

## 13. One-liner copy (máy mới — bash/Git Bash)

```bash
git clone https://github.com/minhtien2412tran/baogia.git && cd baogia && \
pnpm install && \
node scripts/generate-local-env.mjs && \
node scripts/sync-frontend-api-key.mjs && \
pnpm db:up && \
pnpm --filter @jetbay/api prisma:generate && \
pnpm --filter @jetbay/api exec prisma migrate deploy && \
pnpm --filter @jetbay/api prisma:seed && \
echo "OK — chạy: pnpm --filter @jetbay/api start:dev  |  pnpm --filter @jetbay/web dev  |  pnpm --filter @jetbay/admin dev"
```

### PowerShell (Windows)

```powershell
git clone https://github.com/minhtien2412tran/baogia.git
cd baogia
pnpm install
node scripts/generate-local-env.mjs
node scripts/sync-frontend-api-key.mjs
pnpm db:up
pnpm --filter @jetbay/api prisma:generate
pnpm --filter @jetbay/api exec prisma migrate deploy
pnpm --filter @jetbay/api prisma:seed
Write-Host "OK — mở 3 terminal: api start:dev | web dev | admin dev"
```

---

## Liên kết

[CONTINUE_AT_HOME.md](./CONTINUE_AT_HOME.md) · [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) · [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) · [JETBAY_PRODUCT_MAP.md](./JETBAY_PRODUCT_MAP.md) · [AGENTS.md](../AGENTS.md)
