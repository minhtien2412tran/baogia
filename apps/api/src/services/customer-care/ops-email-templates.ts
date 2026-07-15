import {
  ADMIN_QUOTES_URL,
  EMAIL_SITE,
  emailCta,
  emailDetailCard,
  escapeHtml,
  normalizeEmailLocale,
  webPath,
  wrapEmailHtml,
} from './email-layout';

export type MailBundle = { subject: string; text: string; html: string };

type Pack = {
  eyebrow: string;
  title: string;
  intro: string;
  labels: Record<string, string>;
  cta: string;
  foot: string;
  subject: (id: number | string, name?: string) => string;
};

function packFor(locale: string, kind: 'quote_sales' | 'enquiry_customer' | 'enquiry_sales'): Pack {
  const loc = normalizeEmailLocale(locale);
  const admin = loc === 'vi' ? 'vi' : loc === 'zh-cn' ? 'zh-cn' : 'en';

  if (kind === 'quote_sales') {
    const maps = {
      vi: {
        eyebrow: 'Nội bộ · Ops',
        title: 'Yêu cầu báo giá mới',
        intro: 'Có yêu cầu charter mới từ website. Vui lòng xem và tạo offer trong Admin.',
        labels: {
          name: 'Khách hàng',
          email: 'Email',
          phone: 'Điện thoại',
          route: 'Hành trình',
          source: 'Nguồn',
          message: 'Ghi chú',
          ref: 'Mã yêu cầu',
        },
        cta: 'Mở Admin Quotes',
        foot: 'Trả lời email này để liên hệ trực tiếp khách hàng (Reply-To đã gắn).',
        subject: (id: number | string, name?: string) =>
          `[JETVINA Quote] ${name || 'Khách'} - #${id}`,
      },
      'zh-cn': {
        eyebrow: '内部 · 运营',
        title: '新的包机报价请求',
        intro: '网站收到新的包机询价。请在管理后台查看并创建方案。',
        labels: {
          name: '客户',
          email: '邮箱',
          phone: '电话',
          route: '航线',
          source: '来源',
          message: '备注',
          ref: '请求编号',
        },
        cta: '打开报价后台',
        foot: '直接回复本邮件即可联系客户（已设置 Reply-To）。',
        subject: (id: number | string, name?: string) =>
          `[JETVINA Quote] ${name || '客户'} - #${id}`,
      },
      en: {
        eyebrow: 'Internal · Ops',
        title: 'New charter quote request',
        intro: 'A new charter request just arrived from the website. Review and create an offer in Admin.',
        labels: {
          name: 'Customer',
          email: 'Email',
          phone: 'Phone',
          route: 'Route',
          source: 'Source',
          message: 'Notes',
          ref: 'Request ID',
        },
        cta: 'Open Admin Quotes',
        foot: 'Reply to this email to contact the customer directly (Reply-To is set).',
        subject: (id: number | string, name?: string) =>
          `[JETVINA Quote] ${name || 'Customer'} - #${id}`,
      },
    } as const;
    return maps[admin];
  }

  if (kind === 'enquiry_customer') {
    const maps = {
      vi: {
        eyebrow: 'Xác nhận',
        title: 'Đã nhận yêu cầu của bạn',
        intro: 'Cảm ơn bạn đã quan tâm JETVINA. Chuyên viên sẽ liên hệ trong một ngày làm việc.',
        labels: {
          ref: 'Mã yêu cầu',
          kind: 'Dịch vụ',
          package: 'Gói',
        },
        cta: 'Khám phá JETVINA',
        foot: 'Nếu cần hỗ trợ gấp, hãy trả lời email này.',
        subject: (id: number | string) => `JETVINA đã nhận yêu cầu #${id}`,
      },
      'zh-cn': {
        eyebrow: '确认',
        title: '我们已收到您的询价',
        intro: '感谢关注 JETVINA。顾问将在一个工作日内与您联系。',
        labels: {
          ref: '编号',
          kind: '服务',
          package: '套餐',
        },
        cta: '探索 JETVINA',
        foot: '如需加急协助，请直接回复本邮件。',
        subject: (id: number | string) => `JETVINA 已收到询价 #${id}`,
      },
      en: {
        eyebrow: 'Confirmation',
        title: 'We received your enquiry',
        intro: 'Thank you for contacting JETVINA. A specialist will reach out within one business day.',
        labels: {
          ref: 'Reference',
          kind: 'Service',
          package: 'Package',
        },
        cta: 'Explore JETVINA',
        foot: 'Need urgent help? Just reply to this email.',
        subject: (id: number | string) => `JETVINA enquiry #${id} received`,
      },
    } as const;
    return maps[admin];
  }

  // enquiry_sales
  const maps = {
    vi: {
      eyebrow: 'Nội bộ · Ops',
      title: 'Enquiry mới',
      intro: 'Có enquiry mới từ website. Kiểm tra và phản hồi khách hàng.',
      labels: {
        name: 'Khách hàng',
        email: 'Email',
        phone: 'Điện thoại',
        kind: 'Loại',
        package: 'Gói',
        message: 'Nội dung',
        ref: 'Mã',
      },
      cta: 'Mở trang chủ Admin',
      foot: 'Reply-To đã gắn email khách.',
      subject: (id: number | string, name?: string) =>
        `[JETVINA Enquiry] ${name || 'Khách'} - #${id}`,
    },
    'zh-cn': {
      eyebrow: '内部 · 运营',
      title: '新询价',
      intro: '网站收到新询价，请及时跟进。',
      labels: {
        name: '客户',
        email: '邮箱',
        phone: '电话',
        kind: '类型',
        package: '套餐',
        message: '留言',
        ref: '编号',
      },
      cta: '打开管理后台',
      foot: 'Reply-To 已指向客户邮箱。',
      subject: (id: number | string, name?: string) =>
        `[JETVINA Enquiry] ${name || '客户'} - #${id}`,
    },
    en: {
      eyebrow: 'Internal · Ops',
      title: 'New enquiry',
      intro: 'A new enquiry arrived from the website. Please follow up.',
      labels: {
        name: 'Customer',
        email: 'Email',
        phone: 'Phone',
        kind: 'Type',
        package: 'Package',
        message: 'Message',
        ref: 'Reference',
      },
      cta: 'Open Admin',
      foot: 'Reply-To points to the customer email.',
      subject: (id: number | string, name?: string) =>
        `[JETVINA Enquiry] ${name || 'Customer'} - #${id}`,
    },
  } as const;
  return maps[admin];
}

export function renderQuoteSalesEmail(opts: {
  locale?: string;
  quoteId: number;
  name: string;
  email: string;
  phone: string;
  tripSummary?: string;
  sourcePage?: string;
  message?: string | null;
}): MailBundle {
  const loc = normalizeEmailLocale(opts.locale);
  const p = packFor(loc, 'quote_sales');
  const subject = p.subject(opts.quoteId, opts.name);
  const rows = [
    { label: p.labels.ref, value: `#${opts.quoteId}` },
    { label: p.labels.name, value: opts.name },
    { label: p.labels.email, value: opts.email },
    { label: p.labels.phone, value: opts.phone },
    { label: p.labels.route, value: opts.tripSummary || '' },
    { label: p.labels.source, value: opts.sourcePage || '' },
    { label: p.labels.message, value: opts.message || '' },
  ];
  const body = `
    <p style="margin:0 0 8px;">${escapeHtml(p.intro)}</p>
    ${emailDetailCard(rows)}
    ${emailCta(ADMIN_QUOTES_URL, p.cta)}
    <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9a9080;">${escapeHtml(p.foot)}</p>
  `;
  const text = [
    subject,
    '',
    p.intro,
    ...rows.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`),
    '',
    `${p.cta}: ${ADMIN_QUOTES_URL}`,
  ].join('\n');

  return {
    subject,
    text,
    html: wrapEmailHtml({
      title: `${p.title} #${opts.quoteId}`,
      lang: loc === 'en' ? 'en' : loc,
      eyebrow: p.eyebrow,
      preheader: `${opts.tripSummary || opts.name} · #${opts.quoteId}`,
      bodyHtml: body,
    }),
  };
}

export function renderEnquiryCustomerEmail(opts: {
  locale?: string;
  enquiryId: number;
  firstName: string;
  kindLabel: string;
  packageName?: string;
}): MailBundle {
  const loc = normalizeEmailLocale(opts.locale);
  const p = packFor(loc, 'enquiry_customer');
  const subject = p.subject(opts.enquiryId);
  const path = webPath(loc);
  const home = `${EMAIL_SITE}/${path}`;
  const greet =
    loc === 'vi'
      ? `Kính gửi ${opts.firstName || 'Quý khách'},`
      : loc === 'zh-cn'
        ? `尊敬的${opts.firstName || '客户'}，`
        : `Dear ${opts.firstName || 'there'},`;
  const rows = [
    { label: p.labels.ref, value: `#${opts.enquiryId}` },
    { label: p.labels.kind, value: opts.kindLabel },
    { label: p.labels.package, value: opts.packageName || '' },
  ];
  const body = `
    <p style="margin:0 0 8px;">${escapeHtml(greet)}</p>
    <p style="margin:0 0 8px;">${escapeHtml(p.intro)}</p>
    ${emailDetailCard(rows)}
    ${emailCta(home, p.cta)}
    <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9a9080;">${escapeHtml(p.foot)}</p>
  `;
  return {
    subject,
    text: [greet, '', p.intro, ...rows.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`)].join('\n'),
    html: wrapEmailHtml({
      title: p.title,
      lang: loc === 'en' ? 'en' : loc,
      eyebrow: p.eyebrow,
      preheader: subject,
      bodyHtml: body,
    }),
  };
}

export function renderEnquirySalesEmail(opts: {
  locale?: string;
  enquiryId: number;
  name: string;
  email: string;
  phone: string;
  kindLabel: string;
  packageName?: string;
  message?: string | null;
  attachmentUrls?: string[];
}): MailBundle {
  const loc = normalizeEmailLocale(opts.locale);
  const p = packFor(loc, 'enquiry_sales');
  const subject = p.subject(opts.enquiryId, opts.name);
  const attach =
    opts.attachmentUrls && opts.attachmentUrls.length
      ? opts.attachmentUrls.join('\n')
      : '';
  const rows = [
    { label: p.labels.ref, value: `#${opts.enquiryId}` },
    { label: p.labels.name, value: opts.name },
    { label: p.labels.email, value: opts.email },
    { label: p.labels.phone, value: opts.phone },
    { label: p.labels.kind, value: opts.kindLabel },
    { label: p.labels.package, value: opts.packageName || '' },
    { label: p.labels.message, value: opts.message || '' },
    { label: 'Attachments', value: attach },
  ];
  const body = `
    <p style="margin:0 0 8px;">${escapeHtml(p.intro)}</p>
    ${emailDetailCard(rows)}
    ${emailCta(ADMIN_QUOTES_URL.replace(/\/quotes$/, ''), p.cta)}
    <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9a9080;">${escapeHtml(p.foot)}</p>
  `;
  return {
    subject,
    text: [subject, '', p.intro, ...rows.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`)].join('\n'),
    html: wrapEmailHtml({
      title: `${p.title} #${opts.enquiryId}`,
      lang: loc === 'en' ? 'en' : loc,
      eyebrow: p.eyebrow,
      preheader: subject,
      bodyHtml: body,
    }),
  };
}
