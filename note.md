# GAP BACKLOG — ĐÓNG GIAI ĐOẠN 1 VÀ HOÀN TẤT GIAI ĐOẠN 2

> **Ngày cập nhật:** 24/07/2026
> **Trạng thái tổng thể:** GĐ1 hoàn thành kỹ thuật, còn thủ tục đóng giai đoạn. GĐ2 đã hoàn thành phần lớn Dev Sprint S1–S4, còn tích hợp SMTP, nội dung CMS, hoàn thiện UX, quyết định media và nghiệm thu UAT.
> **Báo cáo chính:** `docs/BAO_CAO_TIEN_DO_DAY_DU.md`
> **Plan chia task (AI/Dev thực thi):** [`docs/PLAN_GD1_GD2_EXECUTION.md`](docs/PLAN_GD1_GD2_EXECUTION.md)  
> **Session 24/07:** Wave 2 Dev + Contact 200 + media audit + SMTP 5a + W2-09 PASS + W6-01 nháp  
> **Owner SoT:** [`docs/OWNER_HANDOFF_NEXT.md`](docs/OWNER_HANDOFF_NEXT.md) — chờ W4-04 · W3-06 · W2-05 · W5-10 · họp GĐ1  
> Evidence: `docs/reviews/CMS_INVENTORY_20260724.md` · `MEDIA_AUDIT_20260724.md` · Contact `/en-us/contact`
> **Sign-off GĐ1:** `docs/GD1_SIGNOFF.md`
> **DoD các nhóm trang:** `docs/JETBAY_WEB_PAGE_DOD.md`
> **UAT:** `docs/UAT_CHECKLIST.md`

**Hướng dẫn cho AI:** Đọc file này để hiểu phạm vi còn thiếu. Thực thi theo `PLAN_GD1_GD2_EXECUTION.md`. **Không** yêu cầu / commit mật khẩu SMTP — Owner sẽ thêm máy chủ + pass trên VPS sau; Dev chỉ chuẩn bị template/smoke (Wave 5a) rồi verify (Wave 5b) khi được báo đã cấu hình.

---

## 1. Tóm tắt tình trạng hiện tại

| Giai đoạn | Tình trạng                  | Kết luận                                                                                         |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| **GĐ1**   | Kỹ thuật đã hoàn thành      | Chưa đóng hoàn toàn vì còn SMTP hoặc chấp nhận residual, biên bản nghiệm thu và xác nhận hai bên |
| **GĐ2**   | Dev S1–S4 cơ bản hoàn thành | Còn các đầu việc vận hành, nội dung, polish giao diện và nghiệm thu staging                      |
| **GĐ3**   | Chưa triển khai đầy đủ      | Chuẩn bị CMS vận hành, đào tạo Admin, RBAC nâng cao và quy trình vận hành                        |
| **GĐ4**   | Chờ điều kiện bên ngoài     | Chờ keys Pay/OAuth/SMS, kiểm thử sandbox và go-live production                                   |

---

# 2. GIAI ĐOẠN 1 — CÔNG VIỆC CÒN THIẾU ĐỂ ĐÓNG

## 2.1. Phần đã hoàn thành

* API, Web và Admin đã được triển khai theo phạm vi GĐ1.
* Đồng bộ contract API/Web và kiểm tra các endpoint chính đã hoàn thành.
* Smoke `smoke-web-api` đã hoàn thành.
* Smoke `smoke-auth-booking` đã hoàn thành.
* Quote UI đã được kiểm tra thủ công.
* Backup/restore drill đã PASS.
* Kiểm tra dữ liệu Airport restore đạt kết quả `120 = 120`.
* Các lỗi kỹ thuật chính của Dev Sprint S1–S4 đã được xử lý.
* Báo cáo tiến độ công khai đã được triển khai tại:
  `https://www.minhtien.online/baocaotiendo`
* Báo cáo đầy đủ GĐ1–GĐ4 đã được cập nhật ngày 24/07/2026.

## 2.2. Phần còn thiếu

| Mã     | Công việc                                                                        | Người phụ trách | Mức độ |
| ------ | -------------------------------------------------------------------------------- | --------------- | ------ |
| GD1-R1 | Cấu hình SMTP thật trên VPS hoặc xác nhận chấp nhận SMTP là residual chuyển tiếp | Owner + DevOps  | P0     |
| GD1-R2 | Chạy lại email smoke sau khi có SMTP thật                                        | Dev/QA          | P0     |
| GD1-R3 | Cập nhật kết quả SMTP vào báo cáo và sign-off                                    | Dev/PM          | P0     |
| GD1-R4 | Rà soát toàn bộ câu trả lời Owner O1–O4 và ghi nhận trạng thái chính thức        | Owner + PM      | P0     |
| GD1-R5 | Hoàn thiện biên bản nghiệm thu GĐ1                                               | PM              | P0     |
| GD1-R6 | Tổ chức họp nghiệm thu và ký biên bản                                            | Hai bên         | P0     |
| GD1-R7 | Chốt danh sách residual được chuyển sang GĐ2/GĐ3/GĐ4                             | Hai bên         | P1     |

## 2.3. Điều kiện đóng GĐ1

GĐ1 chỉ được chuyển sang trạng thái **CLOSED/SIGNED-OFF** khi đáp ứng một trong hai phương án:

### Phương án A — Hoàn thành SMTP

* SMTP production được cấu hình.
* Gửi email test thành công.
* Smoke email PASS.
* Không còn lỗi retry hoặc lỗi queue nghiêm trọng.
* Kết quả được ghi vào `GD1_SIGNOFF.md`.
* Hai bên ký biên bản nghiệm thu.

### Phương án B — Chấp nhận SMTP là residual

* Owner xác nhận chưa cung cấp hoặc chưa chốt SMTP production.
* Hai bên thống nhất SMTP không chặn nghiệm thu GĐ1.
* Residual phải ghi rõ:

  * Người chịu trách nhiệm.
  * Điều kiện cần cung cấp.
  * Hạn xử lý.
  * Giai đoạn tiếp nhận.
* Hai bên ký biên bản nghiệm thu có điều kiện.

## 2.4. Kết luận GĐ1

> **GĐ1 đã hoàn thành về kỹ thuật nhưng chưa hoàn tất về hợp đồng và nghiệm thu.**
> Việc ưu tiên cao nhất hiện tại là chốt SMTP hoặc residual, sau đó ký biên bản nghiệm thu GĐ1.

---

# 3. GIAI ĐOẠN 2 — CÔNG VIỆC CẦN LÀM TIẾP

## 3.1. Mục tiêu GĐ2

Hoàn thiện website ở mức sẵn sàng trình diễn và nghiệm thu staging:

* Nội dung đầy đủ EN/VI.
* Các luồng chính hoạt động ổn định.
* UX/UI đồng nhất và không còn lỗi hiển thị nghiêm trọng.
* Media có nguồn sử dụng rõ ràng.
* Owner kiểm tra, phản hồi và ký UAT.
* Có biên bản nghiệm thu staging cuối GĐ2.

## 3.2. Các nhóm việc còn thiếu

### A. SMTP và email hệ thống

| Mã          | Công việc                                | Kết quả cần đạt                       |
| ----------- | ---------------------------------------- | ------------------------------------- |
| GD2-MAIL-01 | Cấu hình SMTP thật                       | API kết nối được SMTP production      |
| GD2-MAIL-02 | Kiểm tra email gửi quote/booking/contact | Email đến đúng người nhận             |
| GD2-MAIL-03 | Kiểm tra template EN/VI                  | Nội dung đúng ngôn ngữ và thương hiệu |
| GD2-MAIL-04 | Kiểm tra retry và log lỗi                | Không mất email khi SMTP lỗi tạm thời |
| GD2-MAIL-05 | Bổ sung smoke production                 | Có bằng chứng PASS trong tài liệu     |

> SMTP là đầu việc chung giữa GĐ1 và GĐ2, cần xử lý trước khi nghiệm thu GĐ2.

---

### B. CMS và nội dung website

| Mã         | Công việc                             | Kết quả cần đạt                                  |
| ---------- | ------------------------------------- | ------------------------------------------------ |
| GD2-CMS-01 | Bổ sung tối thiểu 3–5 bài News        | Có nội dung thật, ảnh, slug và metadata          |
| GD2-CMS-02 | Hoàn thiện nội dung Fixed Price EN/VI | Không còn nội dung demo hoặc thiếu bản dịch      |
| GD2-CMS-03 | Kiểm tra Destination EN/VI            | Tiêu đề, mô tả, ảnh và SEO đầy đủ                |
| GD2-CMS-04 | Kiểm tra Jet Card/Travel Credit       | Nội dung đúng dữ liệu API                        |
| GD2-CMS-05 | Loại bỏ placeholder/demo text         | Không còn dữ liệu giả trên production/staging    |
| GD2-CMS-06 | Kiểm tra publish/unpublish            | Admin có thể vận hành nội dung                   |
| GD2-CMS-07 | Kiểm tra SEO metadata                 | Title, description, OG image và canonical hợp lệ |

**Điều kiện hoàn thành CMS:**

* Tối thiểu 3–5 bài News thực tế.
* Các trang chính có đủ EN và VI.
* Không còn lorem ipsum hoặc nội dung demo.
* Nội dung hiển thị đúng trên Web sau khi publish từ Admin.

---

### C. UX/UI và phản hồi Owner

| Mã        | Công việc                               | Kết quả cần đạt                            |
| --------- | --------------------------------------- | ------------------------------------------ |
| GD2-UX-01 | Thu thập toàn bộ feedback của Anh/Owner | Có danh sách được đánh số                  |
| GD2-UX-02 | Phân loại feedback P0/P1/P2             | Biết mục nào chặn nghiệm thu               |
| GD2-UX-03 | Polish giao diện desktop                | Đồng nhất spacing, typography và component |
| GD2-UX-04 | Polish tablet/mobile                    | Không vỡ layout hoặc tràn nội dung         |
| GD2-UX-05 | Kiểm tra loading/error/empty state      | Các trang chính đều có trạng thái phù hợp  |
| GD2-UX-06 | Kiểm tra CTA và điều hướng              | Không có nút chết hoặc link sai            |
| GD2-UX-07 | Kiểm tra i18n EN/VI                     | Không còn text hard-code sai ngôn ngữ      |
| GD2-UX-08 | Kiểm tra accessibility cơ bản           | Label, focus, keyboard và contrast hợp lý  |
| GD2-UX-09 | Chụp ảnh trước/sau khi sửa              | Có bằng chứng đối chiếu cho Owner          |

Các trang cần ưu tiên kiểm tra:

* Trang chủ.
* Fixed Price.
* Empty Leg.
* Quote.
* Jet Card.
* Travel Credit.
* Destinations.
* News.
* Account.
* Account Bookings.
* Account Quotes.
* Contact.
* Login/Register.
* Admin CMS.

---

### D. Media và bản quyền nội dung

| Mã           | Công việc                                              | Kết quả cần đạt                     |
| ------------ | ------------------------------------------------------ | ----------------------------------- |
| GD2-MEDIA-01 | Owner quyết định có tiếp tục hotlink Jetvina hay không | Có quyết định bằng văn bản          |
| GD2-MEDIA-02 | Nếu không hotlink, mirror media về hạ tầng riêng       | Không phụ thuộc website bên ngoài   |
| GD2-MEDIA-03 | Kiểm tra manifest media                                | Không thiếu ảnh hoặc reference hỏng |
| GD2-MEDIA-04 | Kiểm tra ảnh trên staging và production                | Không có ảnh 404                    |
| GD2-MEDIA-05 | Kiểm tra quyền sử dụng ảnh/nội dung                    | Giảm rủi ro bản quyền               |
| GD2-MEDIA-06 | Thiết lập fallback image                               | Trang không vỡ khi ảnh nguồn lỗi    |
| GD2-MEDIA-07 | Kiểm tra performance ảnh                               | Dung lượng và kích thước phù hợp    |

**Khuyến nghị:** Không nên để hotlink Jetvina là phương án production lâu dài. Nên có quyết định rõ ràng giữa:

1. Được cấp quyền sử dụng và tiếp tục hotlink.
2. Được cấp quyền và mirror ảnh về server/CDN riêng.
3. Thay thế bằng media do doanh nghiệp sở hữu.

---

### E. QA, smoke và regression

| Mã        | Công việc                        | Kết quả cần đạt                        |
| --------- | -------------------------------- | -------------------------------------- |
| GD2-QA-01 | Chạy lại test API                | Tất cả suite quan trọng PASS           |
| GD2-QA-02 | Chạy smoke Web/API               | Không có contract regression           |
| GD2-QA-03 | Chạy smoke Auth/Booking          | Đăng nhập và booking hoạt động         |
| GD2-QA-04 | Chạy smoke Quote UI              | Tìm chuyến và gửi yêu cầu thành công   |
| GD2-QA-05 | Chạy media audit                 | Không hotlink ngoài danh sách cho phép |
| GD2-QA-06 | Kiểm tra Admin CRUD              | CMS tạo/sửa/xóa/publish hoạt động      |
| GD2-QA-07 | Kiểm tra role và quyền truy cập  | User không truy cập chức năng Admin    |
| GD2-QA-08 | Kiểm tra log lỗi production      | Không có lỗi P0/P1 chưa xử lý          |
| GD2-QA-09 | Kiểm tra backup trước nghiệm thu | Có bản backup và phương án rollback    |
| GD2-QA-10 | Lập regression report            | Có lệnh chạy, kết quả và bằng chứng    |

---

### F. UAT và nghiệm thu GĐ2

| Mã         | Công việc                                     | Người phụ trách |
| ---------- | --------------------------------------------- | --------------- |
| GD2-UAT-01 | Chuẩn hóa `UAT_CHECKLIST.md` theo phạm vi GĐ2 | PM/QA           |
| GD2-UAT-02 | Gửi đường dẫn staging và tài khoản test       | Dev             |
| GD2-UAT-03 | Owner kiểm tra theo checklist                 | Owner           |
| GD2-UAT-04 | Ghi nhận lỗi và phân loại severity            | PM/QA           |
| GD2-UAT-05 | Sửa toàn bộ lỗi chặn nghiệm thu               | Dev             |
| GD2-UAT-06 | Chạy regression sau sửa                       | QA              |
| GD2-UAT-07 | Owner ký UAT                                  | Owner           |
| GD2-UAT-08 | Lập biên bản nghiệm thu staging GĐ2           | Hai bên         |

## 3.3. Điều kiện nghiệm thu GĐ2

GĐ2 chỉ được nghiệm thu khi:

* SMTP đã hoàn thành hoặc được ghi nhận residual có điều kiện.
* Nội dung CMS tối thiểu đã được nhập đủ.
* EN/VI hoạt động ở các trang thuộc phạm vi.
* Không còn lỗi P0.
* Lỗi P1 đã được xử lý hoặc có xác nhận chấp nhận.
* Các smoke chính PASS.
* Owner đã kiểm tra staging.
* `UAT_CHECKLIST.md` có chữ ký/xác nhận.
* Biên bản nghiệm thu staging được hai bên chấp thuận.

---

# 4. THỨ TỰ TRIỂN KHAI TIẾP THEO

## Sprint tiếp theo — P0 đóng GĐ1 và mở khóa GĐ2

1. Chốt SMTP production hoặc residual.
2. Chạy smoke email.
3. Rà soát câu trả lời O1–O4.
4. Hoàn thiện `GD1_SIGNOFF.md`.
5. Ký biên bản nghiệm thu GĐ1.
6. Chốt nguồn media/hotlink Jetvina.
7. Thu thập toàn bộ feedback UX từ Owner.
8. Chốt danh sách nội dung CMS còn thiếu.

## Sprint hoàn thiện GĐ2

1. Nhập 3–5 bài News.
2. Hoàn thiện Fixed Price EN/VI.
3. Hoàn thiện nội dung các trang chính.
4. Sửa feedback UX theo P0/P1/P2.
5. Kiểm tra responsive desktop/tablet/mobile.
6. Kiểm tra media, SEO và performance.
7. Chạy toàn bộ regression.
8. Cập nhật báo cáo tiến độ.

## Sprint nghiệm thu GĐ2

1. Freeze phạm vi GĐ2.
2. Deploy bản staging cuối.
3. Tạo backup và ghi nhận version.
4. Gửi Owner UAT pack.
5. Xử lý lỗi UAT.
6. Chạy regression cuối.
7. Owner ký `UAT_CHECKLIST.md`.
8. Ký biên bản nghiệm thu staging GĐ2.

---

# 5. PHÂN LOẠI ƯU TIÊN

## P0 — Chặn nghiệm thu

* SMTP hoặc biên bản residual.
* Sign-off và biên bản GĐ1.
* Nội dung CMS tối thiểu.
* Quyết định media/hotlink.
* Feedback UX chặn nghiệm thu.
* Smoke/regression.
* Owner UAT.
* Biên bản nghiệm thu GĐ2.

## P1 — Cần hoàn thành trong GĐ2

* Polish responsive.
* SEO metadata.
* Loading/error/empty state.
* Kiểm tra EN/VI.
* Admin CMS publish workflow.
* Performance ảnh.
* Báo cáo QA đầy đủ.

## P2 — Có thể chuyển GĐ3

* Tối ưu nâng cao Lighthouse.
* Mở rộng dashboard thống kê CMS.
* Quy trình duyệt nội dung nhiều cấp.
* Đào tạo vận hành chuyên sâu.
* RBAC R4/R5.
* Audit log nâng cao.
* Báo cáo vận hành định kỳ.

---

# 6. GIAI ĐOẠN 3 — PHẠM VI CẦN CHUẨN BỊ

## Mục tiêu

Chuyển hệ thống từ trạng thái hoàn thành sản phẩm sang trạng thái vận hành có kiểm soát.

## Các hạng mục chính

| Nhóm       | Công việc                                            |
| ---------- | ---------------------------------------------------- |
| CMS        | Hoàn thiện quy trình soạn, duyệt, publish và archive |
| Admin      | Đào tạo người vận hành                               |
| RBAC       | Hoàn thiện quyền R4/R5 và ma trận quyền              |
| Booking    | Hoàn thiện quy trình quản lý booking                 |
| Audit      | Theo dõi hành động quan trọng của Admin              |
| Vận hành   | SOP backup, restore, deploy và rollback              |
| Hỗ trợ     | Quy trình nhận và xử lý lỗi                          |
| Báo cáo    | Báo cáo vận hành và KPI                              |
| Nghiệm thu | UAT vận hành và nghiệm thu tuần 12                   |

## Điều kiện bắt đầu GĐ3

* GĐ2 đã ký nghiệm thu.
* CMS có dữ liệu thật.
* Owner xác định danh sách Admin vận hành.
* Ma trận quyền được phê duyệt.
* Có tài liệu hướng dẫn sử dụng bản đầu tiên.

---

# 7. GIAI ĐOẠN 4 — TÍCH HỢP VÀ GO-LIVE

## Điều kiện phụ thuộc Owner/đối tác

* Payment provider keys.
* OAuth client keys.
* SMS provider keys.
* SMTP production nếu chưa hoàn thành.
* Domain/DNS/SSL chính thức.
* Chính sách thanh toán, hủy và hoàn tiền.
* Tài khoản sandbox của đối tác.

## Các nhóm việc

| Nhóm       | Công việc                                           |
| ---------- | --------------------------------------------------- |
| Payment    | Tích hợp sandbox, callback, webhook, reconciliation |
| OAuth      | Đăng nhập qua nhà cung cấp được phê duyệt           |
| SMS        | OTP và thông báo giao dịch                          |
| Security   | Kiểm tra secret, rate limit và quyền truy cập       |
| Go-live    | Checklist production, rollback và monitoring        |
| UAT        | End-to-end với dịch vụ thật                         |
| Nghiệm thu | Go-live sign-off tuần 16                            |

> Pay, OAuth và SMS không thuộc phạm vi nghiệm thu GĐ2. Các hạng mục này được chuyển sang GĐ4 và chỉ triển khai khi Owner cung cấp đầy đủ keys, tài khoản và chính sách nghiệp vụ.

---

# 8. CÁC TÀI LIỆU CẦN ĐỒNG BỘ

Sau mỗi thay đổi trạng thái, phải cập nhật đồng thời:

* `docs/BAO_CAO_TIEN_DO_DAY_DU.md`
* `docs/GAP_GD1_GD2_BACKLOG.md`
* `docs/GD1_SIGNOFF.md`
* `docs/GD2_ROADMAP.md`
* `docs/UAT_CHECKLIST.md`
* `docs/ACCEPTANCE_CRITERIA_GD1.md`
* `docs/JETBAY_WEB_PAGE_DOD.md`
* `docs/CONTINUE_AT_HOME.md`
* `AGENTS.md`

Không được để các tài liệu có trạng thái mâu thuẫn, ví dụ:

* Một file ghi Owner đã trả O1–O4 nhưng file khác vẫn ghi đang chờ.
* Một file ghi UAT đã ký nhưng backlog vẫn để chưa ký.
* Một file ghi GĐ1 đóng nhưng biên bản nghiệm thu chưa có.
* Một file ghi SMTP hoàn thành nhưng production vẫn dùng `localhost:1025`.

---

# 9. TRẠNG THÁI CHUẨN ĐỀ XUẤT

## GĐ1

**TECHNICALLY DONE — PENDING CONTRACTUAL SIGN-OFF**

Lý do:

* Kỹ thuật, smoke và backup đã hoàn thành.
* Còn SMTP/residual và biên bản nghiệm thu.

## GĐ2

**DEVELOPMENT SUBSTANTIALLY DONE — PENDING CONTENT, POLISH AND UAT**

Lý do:

* Dev Sprint S1–S4 đã hoàn thành phần chính.
* Còn SMTP, CMS, feedback UX, media decision, regression và UAT.

## GĐ3

**PLANNED — NOT STARTED**

## GĐ4

**BLOCKED BY EXTERNAL KEYS AND BUSINESS DECISIONS**

---

# 10. HÀNH ĐỘNG CẦN LÀM NGAY

1. Owner xác nhận SMTP thật hay chấp nhận residual.
2. PM rà soát và loại bỏ trạng thái O1–O4 bị ghi trùng/mâu thuẫn.
3. Xác nhận `UAT_CHECKLIST.md` đã ký thật hay mới chỉ chuẩn bị.
4. Owner quyết định phương án sử dụng media Jetvina.
5. Dev/CMS nhập tối thiểu 3–5 bài News và Fixed Price EN/VI.
6. Tổng hợp feedback giao diện của Owner thành backlog P0/P1/P2.
7. Chạy lại toàn bộ smoke và regression sau khi hoàn thiện.
8. Deploy staging cuối GĐ2.
9. Owner thực hiện UAT.
10. Ký biên bản nghiệm thu GĐ1 và GĐ2 theo đúng trạng thái thực tế.

---

# 11. KẾT LUẬN

Hiện tại dự án không còn nhiều hạng mục phát triển lõi trong GĐ1 và GĐ2. Phần còn lại chủ yếu là:

* Chốt SMTP.
* Hoàn thiện nội dung thật.
* Polish UX/UI.
* Chốt phương án media.
* Chạy regression.
* Owner thực hiện UAT.
* Hoàn thiện hồ sơ và ký nghiệm thu.

Sau khi hoàn thành các đầu việc trên, dự án có thể chính thức đóng GĐ1, nghiệm thu GĐ2 và chuyển sang GĐ3 về vận hành CMS, đào tạo Admin và RBAC nâng cao.
