/**
 * JetBay Nest API client (Swagger: https://docs.minhtien.online/swagger).
 * Requires NEXT_PUBLIC_API_URL + NEXT_PUBLIC_API_KEY (X-API-Key).
 */

function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.minhtien.online';
  if (typeof window !== 'undefined' && url.includes('localhost')) {
    return url.replace('localhost', '127.0.0.1');
  }
  return url.replace(/\/$/, '');
}

const API_URL = resolveApiUrl();
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export type AirportHit = {
  iata: string;
  label: string;
  city: string;
  country?: string;
  name?: string;
};

export type QuoteLegPayload = {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  passengers: number;
};

export type AircraftSearchOption = {
  categoryId: number;
  categoryCode: string;
  categoryLabel: string;
  maxPassengers: number;
  aircraftModel: string;
  estimatedPrice: number;
  currency: string;
  operatorName?: string;
  baseAirport?: string;
};

export type SearchAircraftResponse = {
  searchId: string;
  tripType: string;
  options: AircraftSearchOption[];
};

export function parseApiErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof ApiError)) return fallback;
  try {
    const parsed = JSON.parse(err.message) as { message?: string | string[] };
    const msg = parsed.message;
    if (Array.isArray(msg)) return msg.join('. ');
    if (typeof msg === 'string' && msg.trim()) return msg;
  } catch {
    if (err.message && err.message.length < 200) return err.message;
  }
  if (err.status === 401 || err.status === 403) {
    return 'API key missing or invalid. Set NEXT_PUBLIC_API_KEY.';
  }
  return fallback;
}

function apiHeaders(extra?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    ...extra,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: apiHeaders(options?.headers),
    next: options?.method && options.method !== 'GET' ? undefined : { revalidate: 30 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getApiBaseUrl: () => API_URL,
  hasApiKey: () => Boolean(API_KEY),

  getFixedPriceRoutes: (region?: string) =>
    request<{
      routes: Array<{
        id: number;
        slug: string;
        region?: string;
        fromAirport?: { city?: string; iata?: string; country?: string };
        toAirport?: { city?: string; iata?: string; country?: string };
        priceOptions?: Array<{
          category: string;
          categoryLabel?: string;
          price: number;
          paxLimit: number;
        }>;
      }>;
    }>(`/fixed-price/routes${region ? `?region=${encodeURIComponent(region)}` : ''}`),

  getEmptyLegs: (params?: {
    continentCode?: string;
    countryCode?: string;
    fromIata?: string;
    toIata?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.continentCode) q.set('continentCode', params.continentCode);
    if (params?.countryCode) q.set('countryCode', params.countryCode);
    if (params?.fromIata) q.set('fromIata', params.fromIata);
    if (params?.toIata) q.set('toIata', params.toIata);
    const qs = q.toString();
    return request<{
      emptyLegs: Array<{
        id: number;
        slug: string;
        fromAirport?: { city?: string; iata?: string; country?: string };
        toAirport?: { city?: string; iata?: string; country?: string };
        departAt?: string;
        price?: number;
        discountPct?: number;
        aircraftModel?: string;
        estimatedPriceLabel?: string;
        fromContinent?: string;
        toContinent?: string;
      }>;
    }>(`/empty-legs${qs ? `?${qs}` : ''}`);
  },

  getJetCardPlans: () =>
    request<{
      plans: Array<{
        id: number;
        name: string;
        hours: number;
        validityYears?: number;
        minNoticeHours?: number;
        dailyMinHours?: number;
        price?: number;
      }>;
    }>('/jet-card/plans'),

  searchAirports: (q: string, locale = 'en') =>
    request<{ airports: AirportHit[]; autoSelect?: string }>(
      `/airports/search?q=${encodeURIComponent(q)}&limit=12&locale=${encodeURIComponent(locale)}`,
    ),

  searchAircraft: (body: {
    tripType: string;
    legs: QuoteLegPayload[];
    locale?: string;
    currency?: string;
  }) =>
    request<SearchAircraftResponse>('/quotes/search-aircraft', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  subscribeEmptyLegAlerts: (body: {
    email: string;
    fromAirport: string;
    toAirport: string;
    locale?: string;
  }) =>
    request<{ status: string; message: string }>('/empty-legs/alerts/subscribe', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export type ApiLoadResult<T> =
  | { ok: true; data: T; error?: undefined }
  | { ok: false; data: T; error: string };

export async function loadApi<T>(fn: () => Promise<T>, fallback: T): Promise<ApiLoadResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    return {
      ok: false,
      data: fallback,
      error: parseApiErrorMessage(err, 'Service temporarily unavailable'),
    };
  }
}
