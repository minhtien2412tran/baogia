import {
  EMAIL_SITE as SITE,
  emailCta,
  emailDetailCard,
  normalizeEmailLocale,
  webPath,
  wrapEmailHtml,
} from './email-layout';

export type CampaignKey =
  | 'welcome_register'
  | 'quote_received'
  | 'quote_followup_24h'
  | 'quote_offered'
  | 'newsletter_welcome'
  | 'booking_created'
  | 'booking_cancelled'
  | 'payment_confirmed'
  | 'nurture_day3';

export type EmailTemplate = { subject: string; text: string; html: string };

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

function wrapHtml(
  title: string,
  bodyHtml: string,
  lang = 'en',
  opts?: { eyebrow?: string; preheader?: string },
): string {
  return wrapEmailHtml({
    title,
    lang,
    bodyHtml,
    eyebrow: opts?.eyebrow,
    preheader: opts?.preheader ?? title,
  });
}

function btn(href: string, label: string): string {
  return emailCta(href, label);
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
  const loc = normalizeEmailLocale(locale);
  const firstName =
    typeof meta.firstName === 'string' ? meta.firstName : undefined;
  const greet = greeting(firstName, loc === 'en' ? 'en' : loc);
  const path = webPath(loc);
  const accountUrl = `${SITE}/${path}/account`;
  const quoteUrl = `${SITE}/${path}/account/quotes`;
  const homeUrl = `${SITE}/${path}`;
  const eyebrow =
    loc === 'vi' ? 'Thông báo' : loc === 'zh-cn' ? '通知' : 'Notice';

  switch (campaignKey) {
    case 'welcome_register': {
      const pack = pickPack(loc, {
        vi: {
          subject: 'Chào mừng đến với JETVINA',
          text: `${greet}\n\nCảm ơn bạn đã tạo tài khoản JETVINA. Quản lý báo giá, booking và tài liệu charter tại: ${accountUrl}\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0;">Cảm ơn bạn đã tham gia JETVINA. Tài khoản đã sẵn sàng — theo dõi báo giá, thanh toán và tài liệu charter mọi lúc.</p>`,
          cta: 'Vào My Account',
        },
        'zh-cn': {
          subject: '欢迎加入 JETVINA',
          text: `${greet}\n\n感谢注册 JETVINA。管理报价、订单与包机文件：${accountUrl}\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0;">感谢加入 JETVINA。您的账户已就绪 — 随时查看报价、支付与包机文件。</p>`,
          cta: '进入我的账户',
        },
        en: {
          subject: 'Welcome to JetVina',
          text: `${greet}\n\nThank you for creating your JETVINA account. Manage quotes, bookings, and charter documents at: ${accountUrl}\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0;">Thank you for joining JETVINA. Your account is ready — track quotes, payments, and charter documents anytime.</p>`,
          cta: 'Go to My Account',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(
          pack.subject,
          `${pack.body}${btn(accountUrl, pack.cta)}`,
          loc === 'en' ? 'en' : loc,
          { eyebrow, preheader: pack.subject },
        ),
      };
    }

    case 'quote_received': {
      const requestId = meta.requestId ?? '';
      const tripSummary =
        typeof meta.tripSummary === 'string' ? meta.tripSummary : '';
      const pack = pickPack(loc, {
        vi: {
          subject: `JETVINA đã nhận yêu cầu báo giá #${requestId}`,
          text: `${greet}\n\nChúng tôi đã nhận yêu cầu charter (#${requestId})${tripSummary ? ` · ${tripSummary}` : ''}. Chuyên viên sẽ liên hệ trong vòng 3 giờ.\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0 0 8px;">Yêu cầu báo giá <strong>#${requestId}</strong> đã được ghi nhận. Đội ngũ charter JETVINA sẽ liên hệ trong vòng <strong>3 giờ</strong>.</p>`,
          cta: 'Xem báo giá',
        },
        'zh-cn': {
          subject: `JETVINA 已收到报价请求 #${requestId}`,
          text: `${greet}\n\n我们已收到包机报价请求（#${requestId}）。顾问将在 3 小时内联系您。\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0 0 8px;">报价请求 <strong>#${requestId}</strong> 已确认。JETVINA 包机团队将在 <strong>3 小时</strong>内联系您。</p>`,
          cta: '查看我的报价',
        },
        en: {
          subject: `JETVINA Quote Request #${requestId} Received`,
          text: `${greet}\n\nWe received your charter quote request (#${requestId})${tripSummary ? ` · ${tripSummary}` : ''}. A specialist will contact you within 3 hours.\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0 0 8px;">Your quote request <strong>#${requestId}</strong> is confirmed. Our charter team will reach out within <strong>3 hours</strong>.</p>`,
          cta: 'View My Quotes',
        },
      });
      const card = emailDetailCard(
        [
          {
            label: loc === 'vi' ? 'Mã' : loc === 'zh-cn' ? '编号' : 'Reference',
            value: `#${requestId}`,
          },
          {
            label: loc === 'vi' ? 'Hành trình' : loc === 'zh-cn' ? '航线' : 'Route',
            value: tripSummary,
          },
        ].filter((r) => r.value),
      );
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(
          pack.subject,
          `${pack.body}${card}${btn(quoteUrl, pack.cta)}`,
          loc === 'en' ? 'en' : loc,
          { eyebrow, preheader: pack.subject },
        ),
      };
    }

    case 'quote_offered': {
      const requestId = meta.requestId ?? '';
      const price = meta.price ?? '';
      const currency = meta.currency ?? 'USD';
      const aircraft = meta.aircraft ?? '';
      const pack = pickPack(loc, {
        vi: {
          subject: `JETVINA đã gửi báo giá #${requestId}`,
          text: `${greet}\n\nChúng tôi đã chuẩn bị offer cho yêu cầu #${requestId}${aircraft ? ` (${aircraft})` : ''}${price ? `: ${price} ${currency}` : ''}. Xem chi tiết: ${quoteUrl}\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0 0 8px;">Báo giá <strong>#${requestId}</strong> đã sẵn sàng. Vui lòng đăng nhập My Account để xem và tiếp tục đặt chỗ.</p>`,
          cta: 'Xem báo giá',
        },
        'zh-cn': {
          subject: `JETVINA 报价已就绪 #${requestId}`,
          text: `${greet}\n\n报价请求 #${requestId} 已生成方案${aircraft ? `（${aircraft}）` : ''}${price ? `：${price} ${currency}` : ''}。查看：${quoteUrl}\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0 0 8px;">报价 <strong>#${requestId}</strong> 已就绪。请登录账户查看并继续预订。</p>`,
          cta: '查看报价',
        },
        en: {
          subject: `JETVINA Quote Offer #${requestId} Ready`,
          text: `${greet}\n\nWe've prepared an offer for quote #${requestId}${aircraft ? ` (${aircraft})` : ''}${price ? `: ${price} ${currency}` : ''}. View details: ${quoteUrl}\n\n— JETVINA`,
          body: `<p style="margin:0 0 12px;">${greet}</p><p style="margin:0 0 8px;">Your quote <strong>#${requestId}</strong> now has an offer. Please sign in to My Account to review and continue booking.</p>`,
          cta: 'View My Quotes',
        },
      });
      const offerCard = emailDetailCard(
        [
          {
            label: loc === 'vi' ? 'Mã' : loc === 'zh-cn' ? '编号' : 'Reference',
            value: `#${requestId}`,
          },
          {
            label: loc === 'vi' ? 'Máy bay' : loc === 'zh-cn' ? '机型' : 'Aircraft',
            value: String(aircraft || ''),
          },
          {
            label: loc === 'vi' ? 'Giá' : loc === 'zh-cn' ? '价格' : 'Price',
            value: price ? `${price} ${currency}` : '',
          },
        ].filter((r) => r.value),
      );
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(
          pack.subject,
          `${pack.body}${offerCard}${btn(quoteUrl, pack.cta)}`,
          loc === 'en' ? 'en' : loc,
          { eyebrow, preheader: pack.subject },
        ),
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
        html: wrapHtml(pack.subject, `${pack.body}${btn(quoteUrl, pack.cta)}`, loc === 'en' ? 'en' : loc, {
          eyebrow,
          preheader: pack.subject,
        }),
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
        html: wrapHtml(pack.subject, `${pack.body}${btn(homeUrl, pack.cta)}`, loc === 'en' ? 'en' : loc, {
          eyebrow,
          preheader: pack.subject,
        }),
      };
    }

    case 'booking_created': {
      const bookingReference = String(meta.bookingReference ?? meta.bookingId ?? '');
      const aircraftLabel = String(meta.aircraftLabel ?? 'TBD');
      const passengerCount = String(meta.passengerCount ?? '');
      const itinerary = String(meta.itinerary ?? '').replace(/\n/g, '<br/>');
      const departureDateTime = String(meta.departureDateTime ?? 'Chưa xác định / Not specified');
      const departureTimezone = String(meta.departureTimezone ?? '');
      const depLabel =
        departureTimezone && !departureDateTime.includes(departureTimezone)
          ? `${departureDateTime}`
          : departureDateTime;
      const pack = pickPack(loc, {
        vi: {
          subject: `JetVina đã tiếp nhận yêu cầu ${bookingReference}`,
          text: `${greet}\n\nJetVina đã tiếp nhận yêu cầu của Quý khách.\n\nMã yêu cầu: ${bookingReference}\nMáy bay: ${aircraftLabel}\nSố hành khách: ${passengerCount}\nHành trình:\n${String(meta.itinerary ?? '')}\nKhởi hành (giờ địa phương sân bay đi): ${depLabel}\n\nĐội ngũ JetVina sẽ kiểm tra với hãng khai thác và phản hồi trong thời gian sớm nhất. Chuyến bay chưa được xác nhận cho đến khi hãng phản hồi.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>JetVina đã tiếp nhận yêu cầu của Quý khách.</p><p><strong>Mã yêu cầu:</strong> ${bookingReference}<br/><strong>Máy bay:</strong> ${aircraftLabel}<br/><strong>Số hành khách:</strong> ${passengerCount}<br/><strong>Hành trình:</strong><br/>${itinerary}<br/><strong>Khởi hành (giờ địa phương sân bay đi):</strong> ${depLabel}</p><p>Đội ngũ JetVina sẽ kiểm tra với hãng khai thác và phản hồi trong thời gian sớm nhất. <em>Chưa khẳng định chuyến đã được hãng xác nhận.</em></p>`,
          cta: 'Quản lý booking',
        },
        'zh-cn': {
          subject: `JetVina 已收到您的请求 ${bookingReference}`,
          text: `${greet}\n\n我们已收到您的包机请求 ${bookingReference}。\n行程:\n${String(meta.itinerary ?? '')}\n起飞（出发机场当地时间）: ${depLabel}\n\n团队将与运营商确认后尽快回复。在运营商确认前，行程尚未最终确认。\n\n— JETVINA`,
          body: `<p>${greet}</p><p>我们已收到您的请求 <strong>${bookingReference}</strong>。</p><p>机型：${aircraftLabel} · 乘客：${passengerCount}<br/><strong>行程：</strong><br/>${itinerary}<br/><strong>起飞（出发机场当地时间）：</strong> ${depLabel}</p><p>团队将与运营商确认后回复。<em>在运营商确认前，行程尚未最终确认。</em></p>`,
          cta: '管理订单',
        },
        en: {
          subject: `JetVina received your request ${bookingReference}`,
          text: `${greet}\n\nJetVina has received your charter request.\n\nReference: ${bookingReference}\nAircraft: ${aircraftLabel}\nPassengers: ${passengerCount}\nItinerary:\n${String(meta.itinerary ?? '')}\nDeparture (origin airport local time): ${depLabel}\n\nOur team will check with the operating partner and reply shortly. Your flight is not confirmed until the operator responds.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>JetVina has received your charter request.</p><p><strong>Reference:</strong> ${bookingReference}<br/><strong>Aircraft:</strong> ${aircraftLabel}<br/><strong>Passengers:</strong> ${passengerCount}<br/><strong>Itinerary:</strong><br/>${itinerary}<br/><strong>Departure (origin airport local time):</strong> ${depLabel}</p><p>Our team will check with the operating partner and reply shortly. <em>This does not confirm operator acceptance yet.</em></p>`,
          cta: 'Manage booking',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(accountUrl, pack.cta)}`, loc === 'en' ? 'en' : loc, {
          eyebrow,
          preheader: pack.subject,
        }),
      };
    }

    case 'booking_cancelled': {
      const bookingId = meta.bookingId ?? '';
      const pack = pickPack(loc, {
        vi: {
          subject: `Booking #${bookingId} đã hủy — JETVINA`,
          text: `${greet}\n\nBooking #${bookingId} đã được hủy. Liên hệ đội ngũ JETVINA nếu bạn cần hỗ trợ khác.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Booking <strong>#${bookingId}</strong> đã được hủy theo yêu cầu. Nếu đây là nhầm lẫn hoặc bạn cần đặt lại, vui lòng liên hệ chúng tôi.</p>`,
          cta: 'Vào My Account',
        },
        'zh-cn': {
          subject: `订单 #${bookingId} 已取消 — JETVINA`,
          text: `${greet}\n\n订单 #${bookingId} 已取消。如需协助请联系 JETVINA。\n\n— JETVINA`,
          body: `<p>${greet}</p><p>订单 <strong>#${bookingId}</strong> 已取消。如需重新安排，请联系我们的顾问。</p>`,
          cta: '进入我的账户',
        },
        en: {
          subject: `Booking #${bookingId} cancelled — JETVINA`,
          text: `${greet}\n\nBooking #${bookingId} has been cancelled. Contact JETVINA if you need further assistance.\n\n— JETVINA`,
          body: `<p>${greet}</p><p>Booking <strong>#${bookingId}</strong> has been cancelled. If this was a mistake or you need to rebook, please contact our team.</p>`,
          cta: 'Go to My Account',
        },
      });
      return {
        subject: pack.subject,
        text: pack.text,
        html: wrapHtml(pack.subject, `${pack.body}${btn(accountUrl, pack.cta)}`, loc === 'en' ? 'en' : loc, {
          eyebrow,
          preheader: pack.subject,
        }),
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
        html: wrapHtml(pack.subject, `${pack.body}${btn(accountUrl, pack.cta)}`, loc === 'en' ? 'en' : loc, {
          eyebrow,
          preheader: pack.subject,
        }),
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
        html: wrapHtml(pack.subject, `${pack.body}${btn(homeUrl, pack.cta)}`, loc === 'en' ? 'en' : loc, {
          eyebrow,
          preheader: pack.subject,
        }),
      };
    }

    default:
      return {
        subject: 'JETVINA',
        text: `${greet}\n\n— JETVINA`,
        html: wrapHtml('JETVINA', `<p>${greet}</p>`, loc === 'en' ? 'en' : loc, {
          eyebrow,
        }),
      };
  }
}
