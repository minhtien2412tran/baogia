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
    subject: '[JetVina] New charter booking {{bookingReference}} — check departure time inside',
    htmlBody: wrap(`<p>A new charter booking requires your review.</p>
<p>
  <strong>Booking:</strong> {{bookingReference}}<br/>
  <strong>Customer:</strong> {{customerName}} · {{customerEmail}}<br/>
  <strong>Aircraft:</strong> {{aircraftLabel}}<br/>
  <strong>Passengers:</strong> {{passengerCount}}<br/>
  <strong>Itinerary (each leg · origin local time):</strong><br/>{{itineraryHtml}}<br/>
  <strong>First departure (origin airport local):</strong> {{departureDateTime}}<br/>
  <strong>Timezone IANA:</strong> {{departureTimezone}}<br/>
  <strong>Current status:</strong> {{bookingStatus}}
</p>
<p>Please review aircraft availability and respond through the approved JetVina operations channel.</p>`),
    textBody: `A new charter booking requires your review.

Booking: {{bookingReference}}
Customer: {{customerName}} · {{customerEmail}}
Aircraft: {{aircraftLabel}}
Passengers: {{passengerCount}}
Itinerary (each leg · origin local time):
{{itinerary}}
First departure (origin airport local): {{departureDateTime}}
Timezone IANA: {{departureTimezone}}
Current status: {{bookingStatus}}

Please review aircraft availability and respond through the approved JetVina operations channel.`,
  },
  {
    key: 'operator_flight_notify',
    locale: 'vi',
    subject: '[JetVina] Booking charter mới {{bookingReference}} — xem giờ khởi hành trong mail',
    htmlBody: wrap(`<p>Có booking charter mới cần hãng xem xét.</p>
<p>
  <strong>Booking:</strong> {{bookingReference}}<br/>
  <strong>Khách:</strong> {{customerName}} · {{customerEmail}}<br/>
  <strong>Máy bay:</strong> {{aircraftLabel}}<br/>
  <strong>Hành khách:</strong> {{passengerCount}}<br/>
  <strong>Hành trình (từng chặng · giờ địa phương sân bay đi):</strong><br/>{{itineraryHtml}}<br/>
  <strong>Khởi hành chặng 1 (giờ địa phương sân bay đi):</strong> {{departureDateTime}}<br/>
  <strong>Múi giờ IANA:</strong> {{departureTimezone}}<br/>
  <strong>Trạng thái:</strong> {{bookingStatus}}
</p>
<p>Vui lòng kiểm tra sẵn sàng máy bay và phản hồi qua kênh vận hành JetVina đã thống nhất.</p>`),
    textBody:
      'Booking {{bookingReference}} — {{aircraftLabel}}.\n{{itinerary}}\nKhởi hành: {{departureDateTime}} ({{departureTimezone}})',
  },
  {
    key: 'admin_flight_notify',
    locale: 'en',
    subject: '[JetVina Admin] {{bookingReference}} · {{bookingStatus}} · {{operatorName}}',
    htmlBody: wrap(`<p>Admin / Sales notification</p>
<p>
  <strong>Booking:</strong> {{bookingReference}}<br/>
  <strong>Operator:</strong> {{operatorName}}<br/>
  <strong>Aircraft:</strong> {{aircraftLabel}} · Pax {{passengerCount}}<br/>
  <strong>Customer:</strong> {{customerName}} / {{customerEmail}}<br/>
  <strong>Status:</strong> {{bookingStatus}} ({{event}})<br/>
  <strong>Itinerary:</strong><br/>{{itineraryHtml}}<br/>
  <strong>First departure (origin local):</strong> {{departureDateTime}}<br/>
  <strong>Timezone IANA:</strong> {{departureTimezone}}
</p>`),
    textBody:
      'Admin: {{bookingReference}} operator={{operatorName}} aircraft={{aircraftLabel}} status={{bookingStatus}}\n{{itinerary}}\nFirst departure: {{departureDateTime}} ({{departureTimezone}})',
  },
  {
    key: 'admin_flight_notify',
    locale: 'vi',
    subject: '[JetVina Admin] {{bookingReference}} · {{bookingStatus}} · {{operatorName}}',
    htmlBody: wrap(`<p>Thông báo Sales / Admin</p>
<p>
  <strong>Booking:</strong> {{bookingReference}}<br/>
  <strong>Hãng:</strong> {{operatorName}}<br/>
  <strong>Máy bay:</strong> {{aircraftLabel}} · Pax {{passengerCount}}<br/>
  <strong>Khách:</strong> {{customerName}} / {{customerEmail}}<br/>
  <strong>Trạng thái:</strong> {{bookingStatus}} ({{event}})<br/>
  <strong>Hành trình:</strong><br/>{{itineraryHtml}}<br/>
  <strong>Khởi hành chặng 1 (giờ địa phương):</strong> {{departureDateTime}}<br/>
  <strong>Múi giờ IANA:</strong> {{departureTimezone}}
</p>`),
    textBody:
      'Admin: {{bookingReference}} hãng={{operatorName}} {{aircraftLabel}} {{bookingStatus}}\n{{itinerary}}\nKhởi hành: {{departureDateTime}} ({{departureTimezone}})',
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
