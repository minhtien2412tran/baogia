# News article template — CMS GĐ2 (W2-03)

> Admin → **Content / Articles** (`https://admin.minhtien.online/dashboard/content`)  
> Mục tiêu GĐ2: **≥3–5 bài** có ảnh + EN (và VI nếu có).  
> **Không** publish nội dung giả khi Owner chưa duyệt.

## Fields bắt buộc (mỗi locale)

| Field | Internal | Bắt buộc | Ghi chú |
|-------|----------|----------|---------|
| Internal ID | `id` | Auto | DB sau khi tạo |
| Locale | `locale` | ✅ | `en` / `vi` / … |
| Title | `title` | ✅ | ≤70 ký tự · brand JetVina |
| Slug | `slug` | ✅ | `kebab-case` · unique |
| Excerpt | `excerpt` | ✅ | 1–2 câu list |
| Body | `body` | ✅ | ≥200 từ · HTML editor |
| Featured image | `thumbnail` / media | ✅ | URL hoặc Media library |
| Image alt text | alt trên media | ✅ | Mô tả ảnh, không SEO spam |
| SEO title | `seoTitle` / meta | ✅ | Có thể = title |
| SEO description | `seoDescription` | ✅ | ≤160 ký tự |
| Author | `author` / staff | Khuyến nghị | Tên hiển thị |
| Publish date | `publishedAt` | Auto/set | |
| Status | `DRAFT` / `PUBLISHED` | ✅ | Draft → Preview → Publish |
| Linked translation | cùng `slug` locale khác hoặc relation | Khuyến nghị | EN↔VI |
| Image source / rights | note CMS / O5 | ✅ | OWNED / licensed / hotlink approved |

## Owner content pending (W2-04/05)

| # | Chủ đề gợi ý | Title (EN) | Slug | Locale VI? | Ảnh + rights? | Status |
|---|--------------|------------|------|------------|-------------|--------|
| 1 | Giới thiệu dịch vụ charter | | | | | ⬜ OWNER |
| 2 | Fixed Price / route nổi bật | | | | | ⬜ OWNER |
| 3 | Empty leg tip | | | | | ⬜ OWNER |
| 4 | Destination spotlight | | | | | ⬜ OWNER |
| 5 | An toàn / quy trình booking | | | | | ⬜ OWNER |

**Residual:** News public hiện **n=1** — chưa đạt 3–5 vì thiếu nội dung Owner. Dev không tự viết bài thương mại.

## Quy trình nhập / publish (Dev)

1. Owner gửi bảng trên (hoặc doc Word) + ảnh có quyền.  
2. Admin tạo **DRAFT** EN (và VI).  
3. Preview `/en-us/news/{slug}` (nếu preview support) hoặc publish staging.  
4. **Publish** → verify list + detail **200**.  
5. Tick GD2-CMS-01 trên GAP backlog.  

Smoke cycle (khi có `ADMIN_PASSWORD`): `node scripts/smoke-cms-publish-cycle.mjs`

## Sau khi Owner gửi nội dung

1. Dev/CMS tạo draft trên Admin  
2. Publish EN (và VI)  
3. Verify `https://www.minhtien.online/en-us/news` + detail slug  
4. Cập nhật [CMS_INVENTORY](./reviews/CMS_INVENTORY_20260724.md)

---

*Plan: [PLAN_GD1_GD2_EXECUTION.md](./PLAN_GD1_GD2_EXECUTION.md) Wave 2*
