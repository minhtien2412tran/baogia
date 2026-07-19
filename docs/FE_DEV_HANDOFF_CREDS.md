# FE developer handoff — JetVina API / Swagger

> **Mục đích:** Gửi cho FE KH để gọi API + mở docs.  
> **Không** commit mật khẩu vào Git · **không** dán lên baocaotiendo.  
> Owner lấy bản có secret từ VPS sau khi chạy rotate.

---

## Cách Owner reset (VPS)

```bash
# 1) Upload script mới (từ máy có repo) rồi SSH VPS:
scp scripts/deploy/jetbay-be/rotate-demo-swagger.sh root@103.200.20.100:/var/www/jetbay-be/deploy/

# 2) Trên VPS — mật khẩu ngẫu nhiên (khuyến nghị):
bash /var/www/jetbay-be/deploy/rotate-demo-swagger.sh

# HOẶC cố định (dễ nhớ cho FE — vẫn chỉ gửi private):
ADMIN_PASS='ThayBangPassAdminManh!' \
DEMO_PASS='ThayBangPassDemoManh!' \
SWAGGER_USER='docs' \
SWAGGER_PASS='ThayBangPassSwaggerManh!' \
bash /var/www/jetbay-be/deploy/rotate-demo-swagger.sh

# 3) Đọc file gửi FE:
sudo less /root/backups/jetbay-security-ops-*/fe-dev-handoff.txt
# lấy bản STAMP mới nhất
ls -lt /root/backups/jetbay-security-ops-*/fe-dev-handoff.txt | head -3

# 4) Thêm API_KEY (không nằm trong handoff file):
grep '^API_KEY=' /var/www/jetbay-be/.env
```

Smoke script in ra `admin_login`/`demo_login` = 200/201 và `swagger_auth` ≠ 401 là OK.

---

## Nội dung gửi FE (Owner điền sau rotate)

Copy từ `fe-dev-handoff.txt` + dòng API_KEY. Mẫu:

```text
JetVina — API / Swagger cho FE

1) Docs: https://docs.minhtien.online/swagger
   Basic Auth user: …
   Basic Auth pass: …

2) X-API-Key (mọi request + Authorize Swagger): …
   API base: https://api.minhtien.online

3) Login JWT (POST /auth/login):
   Admin: admin@jetbay.local / …
   Demo:  demo@jetbay.local / …

4) Web test: https://www.minhtien.online/en-us/login
   Admin:  https://admin.minhtien.online/login

Lưu ý: Admin123! / Demo123! đã hết hiệu lực sau rotate.
```

---

## Checklist FE

- [ ] Vào được Swagger (Basic)
- [ ] Authorize X-API-Key → gọi được `/health` hoặc public list
- [ ] Login demo → Authorize bearer → gọi `/bookings/my` hoặc tương đương
- [ ] Web login demo OK

---

## Liên quan

- [SECURITY_SECRETS.md](./SECURITY_SECRETS.md)  
- [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)  
- Script: `scripts/deploy/jetbay-be/rotate-demo-swagger.sh`
