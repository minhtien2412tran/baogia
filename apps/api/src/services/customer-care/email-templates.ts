export type CampaignKey =
  | 'welcome_register'
  | 'quote_received'
  | 'quote_followup_24h'
  | 'newsletter_welcome'
  | 'booking_created'
  | 'payment_confirmed'
  | 'nurture_day3';

export type EmailTemplate = { subject: string; text: string; html: string };

const SITE =
  (process.env.WEB_PUBLIC_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? 'https://www.minhtien.online').replace(
    /\/$/,
    '',
  );

function greeting(firstName: string | undefined, locale: string): string {
  const name = firstName?.trim() || (locale.startsWith('vi') ? 'Quý khách' : 'there');
  return locale.startsWith('vi') ? `Kính gửi ${name},` : `Dear ${name},`;
}

function wrapHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Georgia,'Times New Roman',serif;color:#f5f0e6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #3d3528;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;text-align:center;">
          <span style="font-size:22px;letter-spacing:0.2em;color:#c9a962;">JETBAY</span>
        </td></tr>
        <tr><td style="padding:8px 32px 32px;font-size:15px;line-height:1.65;color:#e8e0d0;">
          ${bodyHtml}
          <p style="margin-top:28px;font-size:13px;color:#9a9080;">— JetBay Private Jet Charter<br>
          <a href="${SITE}" style="color:#c9a962;">${SITE.replace(/^https?:\/\//, '')}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function btn(href: string, label: string): string {
  return `<p style="margin:24px 0;"><a href="${href}" style="display:inline-block;padding:12px 24px;background:#c9a962;color:#0d0d0d;text-decoration:none;border-radius:4px;font-weight:bold;">${label}</a></p>`;
}

export function renderEmailTemplate(
  campaignKey: CampaignKey,
  locale: string,
  meta: Record<string, unknown> = {},
): EmailTemplate {
  const loc = locale.startsWith('vi') ? 'vi' : 'en';
  const firstName = typeof meta.firstName === 'string' ? meta.firstName : undefined;
  const greet = greeting(firstName, loc);
  const accountUrl = `${SITE}/${loc === 'vi' ? 'vi-vn' : 'en-us'}/account`;
  const quoteUrl = `${SITE}/${loc === 'vi' ? 'vi-vn' : 'en-us'}/account/quotes`;

  switch (campaignKey) {
    case 'welcome_register': {
      const subject = loc === 'vi' ? 'Chào mừng đến với JetBay' : 'Welcome to JetBay';
      const text =
        loc === 'vi'
          ? `${greet}\n\nCảm ơn bạn đã tạo tài khoản JetBay. Quản lý báo giá, booking và tài liệu charter tại: ${accountUrl}\n\n— JetBay`
          : `${greet}\n\nThank you for creating your JetBay account. Manage quotes, bookings, and charter documents at: ${accountUrl}\n\n— JetBay`;
      const body =
        loc === 'vi'
          ? `<p>${greet}</p><p>Cảm ơn bạn đã tham gia JetBay. Tài khoản của bạn đã sẵn sàng — theo dõi báo giá, thanh toán và tài liệu charter mọi lúc.</p>${btn(accountUrl, 'Vào My Account')}`
          : `<p>${greet}</p><p>Thank you for joining JetBay. Your account is ready — track quotes, payments, and charter documents anytime.</p>${btn(accountUrl, 'Go to My Account')}`;
      return { subject, text, html: wrapHtml(subject, body) };
    }

    case 'quote_received': {
      const requestId = meta.requestId ?? '';
      const subject =
        loc === 'vi' ? `JetBay đã nhận yêu cầu báo giá #${requestId}` : `JetBay Quote Request #${requestId} Received`;
      const text =
        loc === 'vi'
          ? `${greet}\n\nChúng tôi đã nhận yêu cầu charter (#${requestId}). Chuyên viên sẽ liên hệ trong vòng 3 giờ.\n\n— JetBay`
          : `${greet}\n\nWe received your charter quote request (#${requestId}). A specialist will contact you within 3 hours.\n\n— JetBay`;
      const body =
        loc === 'vi'
          ? `<p>${greet}</p><p>Yêu cầu báo giá <strong>#${requestId}</strong> đã được ghi nhận. Đội ngũ charter JetBay sẽ liên hệ trong vòng <strong>3 giờ</strong>.</p>${btn(quoteUrl, 'Xem báo giá')}`
          : `<p>${greet}</p><p>Your quote request <strong>#${requestId}</strong> is confirmed. Our charter team will reach out within <strong>3 hours</strong>.</p>${btn(quoteUrl, 'View My Quotes')}`;
      return { subject, text, html: wrapHtml(subject, body) };
    }

    case 'quote_followup_24h': {
      const requestId = meta.requestId ?? '';
      const subject =
        loc === 'vi'
          ? `Cập nhật báo giá #${requestId} — JetBay`
          : `Update on your quote #${requestId} — JetBay`;
      const text =
        loc === 'vi'
          ? `${greet}\n\nYêu cầu #${requestId} vẫn đang được xử lý. Cần hỗ trợ gấp? Trả lời email này hoặc truy cập ${quoteUrl}\n\n— JetBay`
          : `${greet}\n\nQuote #${requestId} is still in progress. Need urgent help? Reply to this email or visit ${quoteUrl}\n\n— JetBay`;
      const body =
        loc === 'vi'
          ? `<p>${greet}</p><p>Yêu cầu <strong>#${requestId}</strong> đang được chuyên viên JetBay xử lý. Bạn cần điều chỉnh lịch trình hoặc hành khách? Hãy cho chúng tôi biết.</p>${btn(quoteUrl, 'Xem chi tiết')}`
          : `<p>${greet}</p><p>Quote <strong>#${requestId}</strong> is being handled by our team. Need to adjust itinerary or passengers? Let us know.</p>${btn(quoteUrl, 'View details')}`;
      return { subject, text, html: wrapHtml(subject, body) };
    }

    case 'newsletter_welcome': {
      const subject = loc === 'vi' ? 'Cảm ơn bạn đã đăng ký JetBay Newsletter' : 'Thanks for subscribing to JetBay';
      const text =
        loc === 'vi'
          ? `${greet}\n\nBạn sẽ nhận tin ưu đãi charter, empty leg và điểm đến mới từ JetBay.\n\n— JetBay`
          : `${greet}\n\nYou'll receive charter deals, empty legs, and destination highlights from JetBay.\n\n— JetBay`;
      const body =
        loc === 'vi'
          ? `<p>${greet}</p><p>Cảm ơn bạn đã đăng ký newsletter. Chúng tôi sẽ gửi ưu đãi charter và cập nhật hành trình phù hợp với bạn.</p>${btn(SITE, 'Khám phá JetBay')}`
          : `<p>${greet}</p><p>Thanks for subscribing. We'll send curated charter offers and travel inspiration.</p>${btn(SITE, 'Explore JetBay')}`;
      return { subject, text, html: wrapHtml(subject, body) };
    }

    case 'booking_created': {
      const bookingId = meta.bookingId ?? '';
      const subject = loc === 'vi' ? `Booking #${bookingId} đã tạo — JetBay` : `Booking #${bookingId} created — JetBay`;
      const text =
        loc === 'vi'
          ? `${greet}\n\nBooking #${bookingId} đã được tạo. Hoàn tất thanh toán và ký tài liệu charter tại: ${accountUrl}\n\n— JetBay`
          : `${greet}\n\nBooking #${bookingId} has been created. Complete payment and sign charter documents at: ${accountUrl}\n\n— JetBay`;
      const body =
        loc === 'vi'
          ? `<p>${greet}</p><p>Booking <strong>#${bookingId}</strong> đã sẵn sàng. Vui lòng hoàn tất thanh toán và ký thỏa thuận charter trong My Account.</p>${btn(accountUrl, 'Quản lý booking')}`
          : `<p>${greet}</p><p>Booking <strong>#${bookingId}</strong> is ready. Please complete payment and sign your charter agreement in My Account.</p>${btn(accountUrl, 'Manage booking')}`;
      return { subject, text, html: wrapHtml(subject, body) };
    }

    case 'payment_confirmed': {
      const amount = meta.amount ?? '';
      const currency = meta.currency ?? 'USD';
      const bookingId = meta.bookingId ?? '';
      const subject = loc === 'vi' ? 'Thanh toán JetBay đã xác nhận' : 'JetBay payment confirmed';
      const text =
        loc === 'vi'
          ? `${greet}\n\nThanh toán ${amount} ${currency} cho booking #${bookingId} đã được xác nhận.\n\n— JetBay`
          : `${greet}\n\nPayment of ${amount} ${currency} for booking #${bookingId} is confirmed.\n\n— JetBay`;
      const body =
        loc === 'vi'
          ? `<p>${greet}</p><p>Chúng tôi đã xác nhận thanh toán <strong>${amount} ${currency}</strong> cho booking <strong>#${bookingId}</strong>. Cảm ơn bạn đã tin tưởng JetBay.</p>${btn(accountUrl, 'Xem booking')}`
          : `<p>${greet}</p><p>We've confirmed your payment of <strong>${amount} ${currency}</strong> for booking <strong>#${bookingId}</strong>. Thank you for flying with JetBay.</p>${btn(accountUrl, 'View booking')}`;
      return { subject, text, html: wrapHtml(subject, body) };
    }

    case 'nurture_day3': {
      const subject =
        loc === 'vi' ? 'Sẵn sàng cho chuyến bay riêng tiếp theo?' : 'Ready for your next private flight?';
      const searchUrl = `${SITE}/${loc === 'vi' ? 'vi-vn' : 'en-us'}`;
      const text =
        loc === 'vi'
          ? `${greet}\n\nJetBay hỗ trợ charter toàn cầu 24/7. Yêu cầu báo giá miễn phí tại ${searchUrl}\n\n— JetBay`
          : `${greet}\n\nJetBay offers 24/7 global charter support. Request a free quote at ${searchUrl}\n\n— JetBay`;
      const body =
        loc === 'vi'
          ? `<p>${greet}</p><p>Bạn đang lên kế hoạch cho chuyến đi sắp tới? Đội ngũ JetBay sẵn sàng tư vấn máy bay phù hợp và báo giá trong vài giờ.</p>${btn(searchUrl, 'Yêu cầu báo giá')}`
          : `<p>${greet}</p><p>Planning your next trip? Our charter specialists can recommend the right aircraft and quote within hours.</p>${btn(searchUrl, 'Request a quote')}`;
      return { subject, text, html: wrapHtml(subject, body) };
    }

    default:
      return {
        subject: 'JetBay',
        text: `${greet}\n\n— JetBay`,
        html: wrapHtml('JetBay', `<p>${greet}</p>`),
      };
  }
}
