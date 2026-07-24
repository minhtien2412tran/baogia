/**
 * Clear, unambiguous date/time for transactional emails.
 * Never emit truncated ISO without timezone (e.g. "2026-07-24 07:30") — that confuses ops.
 */

export type EmailDateLocale = 'en' | 'vi' | 'zh-cn' | string;

const DEFAULT_TZ = 'Asia/Ho_Chi_Minh';

function tzAbbrev(timeZone: string, at: Date): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(at);
    const off = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    // Prefer IANA short name when available
    const short = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    })
      .formatToParts(at)
      .find((p) => p.type === 'timeZoneName')?.value;
    if (short && short !== off) return `${short} · ${off}`;
    return off || timeZone;
  } catch {
    return timeZone;
  }
}

/**
 * Full local wall-clock for a timezone.
 * Example EN: `Friday, 24 July 2026 · 14:30 (ICT · GMT+7)`
 * Example VI: `Thứ Sáu, 24 tháng 7 năm 2026 · 14:30 (ICT · GMT+7)`
 */
export function formatEmailDateTime(
  input: Date | string | null | undefined,
  opts?: { timeZone?: string | null; locale?: EmailDateLocale; includeSeconds?: boolean },
): string {
  if (input == null || input === '') return 'Chưa xác định / Not specified';
  const at = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(at.getTime())) return 'Ngày giờ không hợp lệ / Invalid date-time';

  const timeZone = (opts?.timeZone?.trim() || DEFAULT_TZ).trim();
  const locale =
    opts?.locale === 'vi'
      ? 'vi-VN'
      : opts?.locale === 'zh-cn'
        ? 'zh-CN'
        : 'en-GB';

  try {
    const datePart = new Intl.DateTimeFormat(locale, {
      timeZone,
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(at);

    const timePart = new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: opts?.includeSeconds ? '2-digit' : undefined,
      hour12: false,
    }).format(at);

    const zone = tzAbbrev(timeZone, at);
    return `${datePart} · ${timePart} (${zone} · ${timeZone})`;
  } catch {
    // Fallback still includes Zulu so it is not ambiguous
    return `${at.toISOString()} (UTC)`;
  }
}

export type EmailLegLike = {
  departureLocalAt: Date;
  fromAirport?: { iata?: string | null; city?: string | null; timezone?: string | null } | null;
  toAirport?: { iata?: string | null; city?: string | null; timezone?: string | null } | null;
};

/** One leg: `SGN (Ho Chi Minh) → HAN (Ha Noi) · Friday, 24 July 2026 · 14:30 (ICT · Asia/Ho_Chi_Minh)` */
export function formatEmailLegLine(leg: EmailLegLike, locale?: EmailDateLocale): string {
  const fromIata = leg.fromAirport?.iata ?? '?';
  const toIata = leg.toAirport?.iata ?? '?';
  const fromCity = leg.fromAirport?.city ? ` (${leg.fromAirport.city})` : '';
  const toCity = leg.toAirport?.city ? ` (${leg.toAirport.city})` : '';
  const tz = leg.fromAirport?.timezone || DEFAULT_TZ;
  const when = formatEmailDateTime(leg.departureLocalAt, { timeZone: tz, locale });
  return `${fromIata}${fromCity} → ${toIata}${toCity} · ${when}`;
}

/** Multi-leg block for email (newline-separated). */
export function formatEmailItinerary(
  legs: EmailLegLike[] | null | undefined,
  locale?: EmailDateLocale,
): { itinerary: string; departureDateTime: string; departureTimezone: string } {
  if (!legs?.length) {
    return {
      itinerary: 'Chưa có chặng bay / No legs on file',
      departureDateTime: 'Chưa xác định / Not specified',
      departureTimezone: DEFAULT_TZ,
    };
  }
  const lines = legs.map((l, i) => `Leg ${i + 1}: ${formatEmailLegLine(l, locale)}`);
  const first = legs[0];
  const tz = first.fromAirport?.timezone || DEFAULT_TZ;
  return {
    itinerary: lines.join('\n'),
    departureDateTime: formatEmailDateTime(first.departureLocalAt, { timeZone: tz, locale }),
    departureTimezone: tz,
  };
}
