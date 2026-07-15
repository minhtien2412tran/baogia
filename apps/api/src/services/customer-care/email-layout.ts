/**
 * Shared JetVina transactional email chrome — modern, premium, email-safe.
 * Brand: charcoal + gold (matches public web). Localize caller copy; this only wraps layout.
 */

export const EMAIL_SITE = (
  process.env.WEB_PUBLIC_URL ??
  process.env.NEXT_PUBLIC_WEB_URL ??
  'https://www.minhtien.online'
).replace(/\/$/, '');

export const ADMIN_QUOTES_URL =
  process.env.ADMIN_PUBLIC_URL?.replace(/\/$/, '') ||
  'https://admin.minhtien.online/dashboard/quotes';

export function normalizeEmailLocale(locale?: string | null): string {
  if (!locale) return 'en';
  const raw = locale.toLowerCase().trim();
  if (raw.startsWith('vi')) return 'vi';
  if (raw.startsWith('zh')) return 'zh-cn';
  if (raw.startsWith('ja')) return 'ja';
  if (raw.startsWith('ko')) return 'ko';
  if (raw.startsWith('th')) return 'th';
  if (raw.startsWith('id') || raw === 'in') return 'id';
  if (raw.startsWith('fr')) return 'fr';
  if (raw.startsWith('de')) return 'de';
  if (raw.startsWith('es')) return 'es';
  if (raw.startsWith('it')) return 'it';
  if (raw.startsWith('ru')) return 'ru';
  if (raw.startsWith('ar')) return 'ar';
  return 'en';
}

/** Infer UI locale from phone country code when client omitted locale. */
export function inferLocaleFromPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  const p = phone.replace(/\s+/g, '');
  if (p.startsWith('+84') || p.startsWith('84') || /^0\d{9,10}$/.test(p))
    return 'vi';
  if (p.startsWith('+86') || p.startsWith('86')) return 'zh-cn';
  if (p.startsWith('+81')) return 'ja';
  if (p.startsWith('+82')) return 'ko';
  if (p.startsWith('+66')) return 'th';
  if (p.startsWith('+62')) return 'id';
  if (p.startsWith('+33')) return 'fr';
  if (p.startsWith('+49')) return 'de';
  return undefined;
}

export function webPath(locale: string): string {
  const loc = normalizeEmailLocale(locale);
  if (loc === 'en') return 'en-us';
  return loc;
}

export function emailCta(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
  <tr><td style="border-radius:6px;background:#c9a962;">
    <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.04em;color:#14110e;text-decoration:none;">${label}</a>
  </td></tr>
</table>`;
}

export type DetailRow = { label: string; value: string };

export function emailDetailCard(rows: DetailRow[]): string {
  const cells = rows
    .filter((r) => r.value?.trim())
    .map(
      (r, i) => `<tr>
      <td style="padding:12px 0;border-top:${i === 0 ? 'none' : '1px solid #2e2a24'};font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9a9080;width:34%;vertical-align:top;">${escapeHtml(r.label)}</td>
      <td style="padding:12px 0;border-top:${i === 0 ? 'none' : '1px solid #2e2a24'};font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#f5f0e6;vertical-align:top;">${escapeHtml(r.value)}</td>
    </tr>`,
    )
    .join('');
  if (!cells) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#14110e;border:1px solid #3d3528;border-radius:8px;">
  <tr><td style="padding:8px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cells}</table>
  </td></tr>
</table>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function wrapEmailHtml(opts: {
  title: string;
  lang?: string;
  eyebrow?: string;
  bodyHtml: string;
  preheader?: string;
}): string {
  const lang = opts.lang || 'en';
  const eyebrow = opts.eyebrow
    ? `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c9a962;">${escapeHtml(opts.eyebrow)}</p>`
    : '';
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>`
    : '';

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0908;color:#f5f0e6;">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0908;padding:40px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#161310;border:1px solid #3d3528;border-radius:12px;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#8a7028,#c9a962,#e8d5a3,#c9a962,#8a7028);font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:28px 32px 12px;text-align:center;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:0.28em;color:#c9a962;">JETVINA</div>
        <div style="margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8a8376;">Private Air Charter</div>
      </td></tr>
      <tr><td style="padding:8px 32px 36px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#ece4d6;">
        ${eyebrow}
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.35;color:#faf6ee;">${escapeHtml(opts.title)}</h1>
        ${opts.bodyHtml}
        <p style="margin:36px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#8a8376;">
          JetVina Private Air Charter<br>
          <a href="${EMAIL_SITE}" style="color:#c9a962;text-decoration:none;">${EMAIL_SITE.replace(/^https?:\/\//, '')}</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
