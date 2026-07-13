/**
 * Editable email template seeds (Admin → Email Templates).
 * Brand tone matches JetVina dark/gold — sample content for demo / handover.
 */

export type EmailTemplateSeed = {
  key: string;
  locale: string;
  subject: string;
  htmlBody: string;
  textBody: string;
};

const wrap = (body: string) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Georgia,'Times New Roman',serif;color:#f5f0e6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:28px 12px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#161410;border:1px solid #3d3528;border-radius:10px;overflow:hidden;">
<tr><td style="padding:26px 28px 6px;text-align:center;letter-spacing:.28em;font-size:13px;color:#c9a962;">JETVINA</td></tr>
<tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.65;color:#e8e0d0;">${body}
<p style="margin-top:26px;font-size:12px;color:#9a9080;">— JetVina Private Air Charter<br/>flights@jetvina.com · +84 396 919 611</p>
</td></tr></table></td></tr></table></body></html>`;

export const EMAIL_TEMPLATE_SEEDS: EmailTemplateSeed[] = [
  {
    key: 'operator_flight_notify',
    locale: 'en',
    subject: '[JetVina] New charter request #{{bookingId}} — {{operatorName}}',
    htmlBody: wrap(`<p>Hello <strong>{{operatorName}}</strong>,</p>
<p>A new booking requires operational confirmation.</p>
<table width="100%" style="margin:16px 0;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:6px 0;color:#9a9080;">Booking</td><td style="padding:6px 0;">#{{bookingId}}</td></tr>
<tr><td style="padding:6px 0;color:#9a9080;">Status</td><td style="padding:6px 0;">{{bookingStatus}}</td></tr>
<tr><td style="padding:6px 0;color:#9a9080;">Customer</td><td style="padding:6px 0;">{{customerName}} · {{customerEmail}}</td></tr>
<tr><td style="padding:6px 0;color:#9a9080;">Itinerary</td><td style="padding:6px 0;">{{itinerary}}</td></tr>
</table>
<p>Please confirm aircraft readiness and crew within 2 hours.</p>`),
    textBody:
      'Booking #{{bookingId}} for {{operatorName}}. Customer {{customerName}} ({{customerEmail}}). Status {{bookingStatus}}. Itinerary: {{itinerary}}',
  },
  {
    key: 'operator_flight_notify',
    locale: 'vi',
    subject: '[JetVina] Yêu cầu charter mới #{{bookingId}} — {{operatorName}}',
    htmlBody: wrap(`<p>Xin chào <strong>{{operatorName}}</strong>,</p>
<p>Có booking mới cần xác nhận khai thác.</p>
<p><strong>Booking:</strong> #{{bookingId}}<br/>
<strong>Trạng thái:</strong> {{bookingStatus}}<br/>
<strong>Khách:</strong> {{customerName}} · {{customerEmail}}<br/>
<strong>Hành trình:</strong> {{itinerary}}</p>
<p>Vui lòng xác nhận máy bay &amp; tổ bay trong vòng 2 giờ.</p>`),
    textBody:
      'Booking #{{bookingId}} — {{operatorName}}. Khách {{customerName}}. {{bookingStatus}}. {{itinerary}}',
  },
  {
    key: 'admin_flight_notify',
    locale: 'en',
    subject: '[JetVina Admin] Booking #{{bookingId}} · {{bookingStatus}}',
    htmlBody: wrap(`<p>Admin alert</p>
<p>Booking <strong>#{{bookingId}}</strong> assigned to <strong>{{operatorName}}</strong>.</p>
<p>Customer: {{customerName}} / {{customerEmail}}<br/>Status: {{bookingStatus}}<br/>Itinerary: {{itinerary}}</p>`),
    textBody:
      'Admin: #{{bookingId}} operator={{operatorName}} status={{bookingStatus}} {{itinerary}}',
  },
  {
    key: 'admin_flight_notify',
    locale: 'vi',
    subject: '[JetVina Admin] Booking #{{bookingId}} · {{bookingStatus}}',
    htmlBody: wrap(`<p>Thông báo quản trị</p>
<p>Booking <strong>#{{bookingId}}</strong> — hãng <strong>{{operatorName}}</strong>.</p>
<p>Khách: {{customerName}} / {{customerEmail}}<br/>Trạng thái: {{bookingStatus}}<br/>Hành trình: {{itinerary}}</p>`),
    textBody:
      'Admin: #{{bookingId}} hãng={{operatorName}} {{bookingStatus}} {{itinerary}}',
  },
  {
    key: 'quote_received_customer',
    locale: 'en',
    subject: 'We received your JetVina quote request',
    htmlBody: wrap(`<p>Dear {{customerName}},</p>
<p>Thank you for requesting a private jet quote. Our charter specialists are preparing options for your itinerary and will reply within <strong>3 hours</strong> (business hours).</p>
<p style="margin:20px 0;padding:14px 16px;background:#1f1a12;border-left:3px solid #c9a962;">Typical empty-leg savings up to 75% · Fixed-price routes available on selected city pairs.</p>
<p>Need help sooner? Call <a href="tel:+84396919611" style="color:#c9a962;">+84 396 919 611</a>.</p>`),
    textBody:
      'Dear {{customerName}}, we received your JetVina quote. Our team replies within 3 hours. +84 396 919 611',
  },
  {
    key: 'quote_received_customer',
    locale: 'vi',
    subject: 'JetVina đã nhận yêu cầu báo giá của bạn',
    htmlBody: wrap(`<p>Kính gửi {{customerName}},</p>
<p>Cảm ơn bạn đã gửi yêu cầu thuê máy bay riêng. Đội ngũ charter sẽ gửi phương án trong <strong>3 giờ</strong> (giờ hành chính).</p>
<p>Cần hỗ trợ gấp? Gọi <a href="tel:+84396919611" style="color:#c9a962;">+84 396 919 611</a>.</p>`),
    textBody:
      'Kính gửi {{customerName}}, JetVina đã nhận yêu cầu báo giá. Phản hồi trong 3 giờ. +84 396 919 611',
  },
  {
    key: 'newsletter_welcome',
    locale: 'en',
    subject: 'Welcome to JetVina — empty legs & private travel',
    htmlBody: wrap(`<p>Welcome aboard.</p>
<p>You are subscribed to JetVina updates: empty-leg deals, destination stories, and membership offers across Vietnam &amp; Asia Pacific.</p>
<p><a href="https://www.minhtien.online/en-us/empty-leg" style="display:inline-block;margin-top:12px;padding:12px 22px;background:#c9a962;color:#0d0d0d;text-decoration:none;border-radius:4px;font-weight:bold;">Browse empty legs</a></p>`),
    textBody: 'Welcome to JetVina newsletter. Browse empty legs: https://www.minhtien.online/en-us/empty-leg',
  },
  {
    key: 'newsletter_welcome',
    locale: 'vi',
    subject: 'Chào mừng đến JetVina — empty leg & du lịch riêng',
    htmlBody: wrap(`<p>Chào mừng bạn.</p>
<p>Bạn đã đăng ký nhận tin JetVina: empty leg, điểm đến và ưu đãi membership tại Việt Nam &amp; châu Á – Thái Bình Dương.</p>
<p><a href="https://www.minhtien.online/vi/empty-leg" style="display:inline-block;margin-top:12px;padding:12px 22px;background:#c9a962;color:#0d0d0d;text-decoration:none;border-radius:4px;font-weight:bold;">Xem empty leg</a></p>`),
    textBody: 'Chào mừng newsletter JetVina. Empty leg: https://www.minhtien.online/vi/empty-leg',
  },
];
