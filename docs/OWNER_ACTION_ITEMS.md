# Owner Action Items — chủ dự án

> **Updated:** 2026-07-15 · **Status:** CURRENT  
> **Handoff pack:** [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md)  
> **Related:** [BLOCKERS_AND_DEPENDENCIES.md](./BLOCKERS_AND_DEPENDENCIES.md) · [KH_G4_KEYS_CHECKLIST.md](./KH_G4_KEYS_CHECKLIST.md)

---

## Việc cần làm ngay

| ID | Việc cần làm | Vì sao cần | Đầu vào cần cung cấp | Hạn phụ thuộc | Nếu chưa làm sẽ ảnh hưởng gì | Trạng thái |
|----|--------------|------------|----------------------|----------------|------------------------------|------------|
| O1 | Xác nhận thứ tự polish GĐ2: **Commercial → Home → Charter → Account** (đề xuất Dev) hoặc chọn khác | Khóa backlog | Email/chat 1 dòng: ưu tiên 1→4 | Tuần này | Scope thảo luận | OPEN |
| O2 | Duyệt UI live web + charter; gửi feedback ưu tiên (max 10 điểm) | Tránh polish mù | Link + screenshot ghi chú | Tuần này | Làm lại visual sau | OPEN |
| O3 | Báo cáo tiến độ **v3.1** | Đã live tại `/baocaotiendo` | Review tùy chọn; chỉnh wording nếu cần | — | Không chặn kỹ thuật | **DEPLOYED / OPTIONAL_OWNER_REVIEW** |
| O4 | **Configure production SMTP** (xem chi tiết dưới) | Mail quote/newsletter/admin | Biến SMTP trên VPS `.env` — **không** gửi password qua chat | ASAP — **P0** | Form 201 nhưng không có inbox | **OPEN / BLOCKED_OWNER_SMTP** |
| O5 | Xác nhận hotlink ảnh `jetvina.com` tạm thời được phép | Rights media | Có/không + deadline mirror | Tuần này | Phải tắt remote → placeholder | OPEN |

### O4 — Configure production SMTP (canonical)

Required (set directly on VPS `/var/www/jetbay-be/.env` or secret manager — never commit / never paste into chat):

```text
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
```

Optional: `SMTP_ENQUIRY_TO` (sales inbox).

```bash
pm2 restart jetbay-be --update-env
curl -sS https://api.minhtien.online/integrations/status
# expected: integrations.smtp=true , smtpBlockedReason=null
```

Dev verifies real inbox after Owner configures. Only then T-S4-01 → PASS.

---

## Việc cần cung cấp (GĐ3–GĐ4 / nội dung)

| ID | Việc cần làm | Vì sao cần | Đầu vào | Hạn | Ảnh hưởng | Trạng thái |
|----|--------------|------------|---------|-----|-----------|------------|
| O7 | Payment sandbox (Stripe và/hoặc OnePay/9Pay) | GĐ4 | Merchant keys + webhook | Tuần 6+ | Payment BLOCKED | OPEN |
| O8 | Google / Apple OAuth (nếu cần) | Login social | Client ID + redirect | GĐ4 | OAuth NOT_CONFIGURED | OPEN |
| O9 | SMS OTP (nếu cần) | Login OTP | API key + sender | GĐ4 | OTP log-only | OPEN |
| O10 | CMS: ≥3–5 news + FP copy EN+VI | Web content | Admin publish | GĐ2–GĐ3 | News n=1 | OPEN |
| O11 | Bản dịch body locale | i18n thật | VI + EN | GĐ2–GĐ3 | Body vẫn EN | OPEN |
| O12 | Privacy/Terms nếu đổi brand | Compliance | Text | Trước go-live | Page sai brand | OPEN |

> O6 (SMTP credentials) đã gộp vào **O4** — không còn mục riêng.

---

## Việc cần xác nhận

| ID | Việc | Đầu vào | Trạng thái |
|----|------|---------|------------|
| O13 | Quote → Admin đủ cho NT GĐ2? | Có/không + SLA | OPEN |
| O14 | Account GĐ2 chỉ email/password (chưa OAuth)? | Có/không | OPEN |
| O15 | Enquiry → email sales vs Admin-only | Email nhận | OPEN (sau SMTP) |
| O16 | Email template JetVina OK gửi khách? | Duyệt Admin templates | OPEN (sau SMTP) |
| O17 | Slot họp NT GĐ1 biên bản HĐ | Lịch + người ký | OPEN |

---

## Việc cần quyết định

| ID | Việc | Đầu vào | Trạng thái |
|----|------|---------|------------|
| O18 | Hotlink JetVina vs mirror CDN | Quyết định + deadline | OPEN (cùng O5) |
| O19 | Ưu tiên cổng thanh toán 1–2 | Stripe / OnePay / 9Pay | OPEN |
| O20 | OAuth/SMS trong gói 74TR go-live? | In / out | OPEN |
| O21 | GĐ2 DoD: visual parity vs API+core flows? | Văn bản short | OPEN |

---

## Không cần bạn làm (Dev tự làm)

- Smoke scripts, surface map, SMTP production guard, empty-state UI, account polish, backup drill, api-sync evidence, docs sync.

---

**Next Owner:** **O4 SMTP** trước → rồi UAT sign + CMS (O10). Chi tiết thao tác: [OWNER_NEXT_ACTIONS.md](./OWNER_NEXT_ACTIONS.md).
