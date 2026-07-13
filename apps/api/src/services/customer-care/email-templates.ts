export type CampaignKey =
  | 'welcome_register'
  | 'quote_received'
  | 'quote_followup_24h'
  | 'newsletter_welcome'
  | 'booking_created'
  | 'payment_confirmed'
  | 'nurture_day3';

export type EmailTemplate = { subject: string; text: string; html: string };

const SITE = (
  process.env.WEB_PUBLIC_URL ??
  process.env.NEXT_PUBLIC_WEB_URL ??
  'https://www.minhtien.online'
).replace(/\/$/, '');

function greeting(firstName: string | undefined, locale: string): string {
  const name = firstName?.trim();
  if (locale === 'vi') return `Kính gửi ${name || 'Quý khách'},`;
  if (locale === 'zh-cn') return `尊敬的${name || '客户'}，`;
  if (locale === 'ja') return `${name || 'お客様'} 様`;
  if (locale === 'ko') return `${name || '고객'}님께`;
  if (locale === 'fr') return `Bonjour ${name || ''},`.replace('Bonjour ,', 'Bonjour,');
  if (locale === 'de') return `Guten Tag ${name || ''},`.replace('Guten Tag ,', 'Guten Tag,');
  if (locale === 'ar') return `عزيزي ${name || 'العميل'}،`;
  return `Dear ${name || 'there'},`;
}

function webPath(locale: string): string {
  if (locale === 'vi') return 'vi';
  if (locale === 'zh-cn') return 'zh-cn';
  if (locale === 'ja') return 'ja';
  if (locale === 'ko') return 'ko';
  if (locale === 'th') return 'th';
  if (locale === 'id') return 'id';
  if (locale === 'fr') return 'fr';
  if (locale === 'de') return 'de';
  if (locale === 'es') return 'es';
  if (locale === 'it') return 'it';
  if (locale === 'ru') return 'ru';
  if (locale === 'ar') return 'ar';
  return 'en-us';
}

function wrapHtml(title: string, bodyHtml: string, lang = 'en'): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Georgia,'Times New Roman',serif;color:#f5f0e6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #3d3528;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;text-align:center;">
          <span style="font-size:22px;letter-spacing:0.2em;color:#c9a962;">JETVINA</span>
        </td></tr>
        <tr><td style="padding:8px 32px 32px;font-size:15px;line-height:1.65;color:#e8e0d0;">
          ${bodyHtml}
          <p style="margin-top:28px;font-size:13px;color:#9a9080;">— JetVina Private Air Charter<br>
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

type Pack = { subject: string; text: string; body: string; cta: string };

function pickPack(
  locale: string,
  packs: { vi?: Pack; 'zh-cn'?: Pack; en: Pack },
): Pack {
  if (locale === 'vi' && packs.vi) return packs.vi;
  if (locale === 'zh-cn' && packs['zh-cn']) return packs['zh-cn'];
  return packs.en;
}

export function renderEmailTemplate(
  campaignKey: CampaignKey,
  locale: string,
  meta: Record<string, unknown> = {},
): EmailTemplate {
  const loc = locale.startsWith('vi')
    ? 'vi'
    : locale.startsWith('zh')
      ? 'zh-cn'
      : locale.split('-')[0] || 'en';
  const firstName =
    typeof meta.firstName === 'string' ? meta.firstName : undefined;
  const greet = greeting(firstName, loc === 'en' ? 'en' : loc);
  const path = webPath(loc);
  const accountUrl = `${SITE}/${path}/account`;
  const quoteUrl = `${SITE}/${path}/account/quotes`;
  const homeUrl = `${SITE}/${path}`;

  switch (campaignKey) {
    case 'welcome_register': {
      const pack = pickPack(loc, {
        vi: {
          subject: 'Chào mừng đến với JETVINA',
          text: `${greet}\n\nCảm ơn bạn đã tạo tài khoản JETVINA. Quản lý báo giá, booking và tài liệu charter tại: ${accountUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Cảm ơn bạn đã tham gia JETVINA. Tài khoản của bạn đã sẵn sàng — theo dõi báo giá, thanh toán và tài liệu charter mọi lúc.</p>`,
          cta: 'Vào My Account',
        },
        'zh-cn': {
          subject: '欢迎加入 JETVINA',
          text: `${greet}\n\n感谢注册 JETVINA。管理报价、订单与包机文件：${accountUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>感谢加入 JETVINA。您的账户已就绪 — 随时查看报价、支付与包机文件。</p>`,
          cta: '进入我的账户',
        },
        en: {
          subject: 'Welcome to JetVina',
          text: `${greet}\n\nThank you for creating your JETVINA account. Manage quotes, bookings, and charter documents at: ${accountUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Thank you for joining JETVINA. Your account is ready — track quotes, payments, and charter documents anytime.</p>`,
          cta: 'Go to My Account',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(accountUrl, pack.cta)}`, loc),
      };
    }

    case 'quote_received': {
      const requestId = meta.requestId ?? '';
      const pack = pickPack(loc, {
        vi: {
          subject: `JETVINA đã nhận yêu cầu báo giá #${requestId}`,
          text: `${greet}\n\nChúng tôi đã nhận yêu cầu charter (#${requestId}). Chuyên viên sẽ liên hệ trong vòng 3 giờ.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Yêu cầu báo giá <strong>#${requestId}</strong> đã được ghi nhận. Đội ngũ charter JETVINA sẽ liên hệ trong vòng <strong>3 giờ</strong>.</p>`,
          cta: 'Xem báo giá',
        },
        'zh-cn': {
          subject: `JETVINA 已收到报价请求 #${requestId}`,
          text: `${greet}\n\n我们已收到包机报价请求（#${requestId}）。顾问将在 3 小时内联系您。\n\n— JETVINA`,
          body: `<p>${greet}</p><p>报价请求 <strong>#${requestId}</strong> 已确认。JETVINA 包机团队将在 <strong>3 小时</strong>内联系您。</p>`,
          cta: '查看我的报价',
        },
        en: {
          subject: `JETVINA Quote Request #${requestId} Received`,
          text: `${greet}\n\nWe received your charter quote request (#${requestId}). A specialist will contact you within 3 hours.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Your quote request <strong>#${requestId}</strong> is confirmed. Our charter team will reach out within <strong>3 hours</strong>.</p>`,
          cta: 'View My Quotes',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(quoteUrl, pack.cta)}`, loc),
      };
    }

    case 'quote_followup_24h': {
      const requestId = meta.requestId ?? '';
      const pack = pickPack(loc, {
        vi: {
          subject: `Cập nhật báo giá #${requestId} — JETVINA`,
          text: `${greet}\n\nYêu cầu #${requestId} vẫn đang được xử lý. Cần hỗ trợ gấp? Trả lời email này hoặc truy cập ${quoteUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Yêu cầu <strong>#${requestId}</strong> đang được chuyên viên JETVINA xử lý. Bạn cần điều chỉnh lịch trình hoặc hành khách? Hãy cho chúng tôi biết.</p>`,
          cta: 'Xem chi tiết',
        },
        'zh-cn': {
          subject: `报价更新 #${requestId} — JETVINA`,
          text: `${greet}\n\n请求 #${requestId} 仍在处理中。如需加急，请回复本邮件或访问 ${quoteUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>请求 <strong>#${requestId}</strong> 正由 JETVINA 顾问处理。需要调整行程或乘客人数？请告诉我们。</p>`,
          cta: '查看详情',
        },
        en: {
          subject: `Update on your quote #${requestId} — JETVINA`,
          text: `${greet}\n\nQuote #${requestId} is still in progress. Need urgent help? Reply to this email or visit ${quoteUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Quote <strong>#${requestId}</strong> is being handled by our team. Need to adjust itinerary or passengers? Let us know.</p>`,
          cta: 'View details',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(quoteUrl, pack.cta)}`, loc),
      };
    }

    case 'newsletter_welcome': {
      const pack = pickPack(loc, {
        vi: {
          subject: 'Cảm ơn bạn đã đăng ký JETVINA Newsletter',
          text: `${greet}\n\nBạn sẽ nhận tin ưu đãi charter, empty leg và điểm đến mới từ JETVINA.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Cảm ơn bạn đã đăng ký newsletter. Chúng tôi sẽ gửi ưu đãi charter và cập nhật hành trình phù hợp với bạn.</p>`,
          cta: 'Khám phá JETVINA',
        },
        'zh-cn': {
          subject: '感谢订阅 JETVINA 通讯',
          text: `${greet}\n\n您将收到包机优惠、空余航段与目的地精选。\n\n— JETVINA`,
          body: `<p>${greet}</p><p>感谢订阅。我们将发送精选包机优惠与旅行灵感。</p>`,
          cta: '探索 JETVINA',
        },
        en: {
          subject: 'Thanks for subscribing to JETVINA',
          text: `${greet}\n\nYou'll receive charter deals, empty legs, and destination highlights from JETVINA.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Thanks for subscribing. We'll send curated charter offers and travel inspiration.</p>`,
          cta: 'Explore JETVINA',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(homeUrl, pack.cta)}`, loc),
      };
    }

    case 'booking_created': {
      const bookingId = meta.bookingId ?? '';
      const pack = pickPack(loc, {
        vi: {
          subject: `Booking #${bookingId} đã tạo — JETVINA`,
          text: `${greet}\n\nBooking #${bookingId} đã được tạo. Hoàn tất thanh toán và ký tài liệu charter tại: ${accountUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Booking <strong>#${bookingId}</strong> đã sẵn sàng. Vui lòng hoàn tất thanh toán và ký thỏa thuận charter trong My Account.</p>`,
          cta: 'Quản lý booking',
        },
        'zh-cn': {
          subject: `订单 #${bookingId} 已创建 — JETVINA`,
          text: `${greet}\n\n订单 #${bookingId} 已创建。请完成支付并签署包机文件：${accountUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>订单 <strong>#${bookingId}</strong> 已就绪。请在账户中完成支付并签署包机协议。</p>`,
          cta: '管理订单',
        },
        en: {
          subject: `Booking #${bookingId} created — JETVINA`,
          text: `${greet}\n\nBooking #${bookingId} has been created. Complete payment and sign charter documents at: ${accountUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Booking <strong>#${bookingId}</strong> is ready. Please complete payment and sign your charter agreement in My Account.</p>`,
          cta: 'Manage booking',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(accountUrl, pack.cta)}`, loc),
      };
    }

    case 'payment_confirmed': {
      const amount = meta.amount ?? '';
      const currency = meta.currency ?? 'USD';
      const bookingId = meta.bookingId ?? '';
      const pack = pickPack(loc, {
        vi: {
          subject: 'Thanh toán JETVINA đã xác nhận',
          text: `${greet}\n\nThanh toán ${amount} ${currency} cho booking #${bookingId} đã được xác nhận.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Chúng tôi đã xác nhận thanh toán <strong>${amount} ${currency}</strong> cho booking <strong>#${bookingId}</strong>. Cảm ơn bạn đã tin tưởng JETVINA.</p>`,
          cta: 'Xem booking',
        },
        'zh-cn': {
          subject: 'JETVINA 付款已确认',
          text: `${greet}\n\n订单 #${bookingId} 的付款 ${amount} ${currency} 已确认。\n\n— JETVINA`,
          body: `<p>${greet}</p><p>我们已确认订单 <strong>#${bookingId}</strong> 的付款 <strong>${amount} ${currency}</strong>。感谢选择 JETVINA。</p>`,
          cta: '查看订单',
        },
        en: {
          subject: 'JETVINA payment confirmed',
          text: `${greet}\n\nPayment of ${amount} ${currency} for booking #${bookingId} is confirmed.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>We've confirmed your payment of <strong>${amount} ${currency}</strong> for booking <strong>#${bookingId}</strong>. Thank you for flying with JETVINA.</p>`,
          cta: 'View booking',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(accountUrl, pack.cta)}`, loc),
      };
    }

    case 'nurture_day3': {
      const pack = pickPack(loc, {
        vi: {
          subject: 'Sẵn sàng cho chuyến bay riêng tiếp theo?',
          text: `${greet}\n\nJETVINA hỗ trợ charter toàn cầu 24/7. Yêu cầu báo giá miễn phí tại ${homeUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Bạn đang lên kế hoạch cho chuyến đi sắp tới? Đội ngũ JETVINA sẵn sàng tư vấn máy bay phù hợp và báo giá trong vài giờ.</p>`,
          cta: 'Yêu cầu báo giá',
        },
        'zh-cn': {
          subject: '准备好下一次私人飞行了吗？',
          text: `${greet}\n\nJETVINA 提供 24/7 全球包机支持。免费询价：${homeUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>正在规划下一段旅程？我们的顾问可在数小时内推荐机型并报价。</p>`,
          cta: '申请报价',
        },
        en: {
          subject: 'Ready for your next private flight?',
          text: `${greet}\n\nJETVINA offers 24/7 global charter support. Request a free quote at ${homeUrl}\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Planning your next trip? Our charter specialists can recommend the right aircraft and quote within hours.</p>`,
          cta: 'Request a quote',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(homeUrl, pack.cta)}`, loc),
      };
    }

    default:
      return {
        subject: 'JETVINA',
        text: `${greet}\n\n— JETVINA`,
        html: wrapHtml('JETVINA', `<p>${greet}</p>`, loc),
      };
  }
}
