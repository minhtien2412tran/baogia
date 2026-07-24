# UAT Checklist — GĐ2 staging

> **Updated:** 2026-07-24 · **Status:** **PACK READY — Owner sign ⬜** (chưa ký)  
> Chạy trên https://www.minhtien.online + Admin. **Không PASS mail** nếu SMTP chưa thật.  
> Plan UAT: [PLAN_GD1_GD2_EXECUTION.md](./PLAN_GD1_GD2_EXECUTION.md) Wave 6 · nguồn gap: [`note.md`](../note.md)

| # | Case | Steps | Expected | Result |
|---|------|-------|----------|--------|
| U1 | Home load | Mở `/en-us` | FP/EL/JC sections có data hoặc empty rõ | API seed OK · FE notice sau deploy |
| U2 | Airport search | Gõ SGN trên quote | Dropdown ≥1 | PASS smoke airports |
| U3 | Quote search | SGN→HAN search | Options >0 | **PASS** options=8 |
| U4 | Quote request | Submit email+phone+consent | Success UI + Reference #id | **PASS API #36** |
| U5 | Admin quote | Login admin → Quotes | Thấy quote mới | Verify **#36** (owner) |
| U6 | FP list | `/fixed-price-charter` | ≥12 routes | PASS smoke n=12 |
| U7 | FP enquiry | Book form | Success | smoke-web historically OK |
| U8 | EL list/request | empty-leg flow | Success | EL n=2 smoke |
| U9 | JetCard enquiry | form | Success | JC n=3 smoke |
| U10 | Travel Credit enquiry | form | Success | TC enquiry smoke |
| U11 | Newsletter | footer subscribe | API OK | **Mail BLOCKED** SMTP localhost |
| U12 | Register/Login | email password | JWT account | smoke-auth-booking PASS |
| U13 | Account | `/account` | Quotes/bookings hoặc empty CTA + Retry | T-S3-02 code done |
| U14 | Charter pages | 6 charter URLs | 200 + hero | PROD live · CMS optional map |
| U15 | Locale VI | đổi VI | UI chrome dịch | Product keys OK |

**Dev pack:** evidence trong [TEST_MATRIX.md](./TEST_MATRIX.md) + [PROJECT_STATUS_REPORT_3_1.md](./PROJECT_STATUS_REPORT_3_1.md).  
**Sign-off Owner:** ________ Date: ________
