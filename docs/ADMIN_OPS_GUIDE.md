# Admin Ops Guide (draft)

> **Updated:** 2026-07-14 · **Status:** DRAFT usable · **URL:** https://admin.minhtien.online  
> **API:** https://api.minhtien.online · **Demo admin:** xem baocaotiendo (rotated passwords)

## 1. Đăng nhập

1. Mở https://admin.minhtien.online/login  
2. Dùng tài khoản admin (không dùng user demo).  
3. Xác nhận dòng API trên form = `https://api.minhtien.online`.  
4. Nếu lỗi “Cannot reach API” → báo Dev (sai bake `NEXT_PUBLIC_API_URL`).

## 2. Quy trình hàng ngày

| Việc | Menu | Ghi chú |
|------|------|---------|
| Xem lead báo giá mới | Quotes | Sau customer quote widget / forms |
| Đổi trạng thái quote | Quotes → status | Tạo offer nếu có operators |
| Fixed Price routes | Fixed Price | Tiers/options; seed đã có 12 |
| Empty Legs | Empty Legs | Ít record mẫu |
| Jet Card / Travel Credit | tương ứng | Plans + packages |
| News / Pages | Content | **Ưu tiên thêm bài EN+VI** |
| Destinations | Destinations | Filter golf/ski/island trên web |
| Operators + mail templates | Operators / Email Templates | Sample templates JetVina |
| Media | Media / Media Review | Rights trước production mirror |
| Audit | Audit Logs | Tra cứu thao tác |
| Users | Users | Không nâng USER → ADMIN tùy tiện |

## 3. Publish tin tức (PASS criteria)

1. Content → Articles → Create.  
2. Locale `en` master; thêm bản `vi` nếu có.  
3. Status published.  
4. Web `/en-us/news` hiện bài trong <5 phút (revalidate/ISR tùy cache).  
5. FAIL nếu chỉ tạo draft.

## 4. Không làm trên Admin

- Đổi JWT/API keys production (Dev/Ops).  
- Commit secret.  
- Approve media PROHIBITED / unverified vào prod nếu policy cấm.

## 5. Khi mail không tới

Kiểm tra [SMTP_SETUP_GUIDE.md](./SMTP_SETUP_GUIDE.md). Form có thể **201** nhưng SMTP stub → không inbox.

## 6. Charter pages (static + CMS)

Copy mặc định nằm trong code (`page-content.ts`). Để bổ sung đoạn CMS:

1. Xem bảng slug: [CHARTER_CMS_MAP.md](./CHARTER_CMS_MAP.md).  
2. Content → Pages → Create với slug đúng (vd. `private-jet-charter`).  
3. Publish → web inject body; hero/sections static vẫn giữ.  
4. Media JetVina: dùng catalog đã gắn web (không upload CDN lạ vào prod mirror nếu policy cấm).

## 7. Kiểm tra quote lead (UAT)

1. Web quote widget SGN→HAN → Request (phone + email + consent).  
2. Admin → Quotes → thấy `requestId` (vd. smoke `#36`).  
3. Mail khách: chỉ PASS khi SMTP thật (O4).
