function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';
  if (typeof window !== 'undefined' && url.includes('localhost')) {
    return url.replace('localhost', '127.0.0.1');
  }
  return url;
}

const API_URL = resolveApiUrl();
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
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
    console.warn(`[API] ${path} failed: ${res.status}`, text);
    throw new ApiError(res.status, text);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getFixedPriceRoutes: (region?: string) =>
    request<{ routes: Array<Record<string, unknown>> }>(`/fixed-price/routes${region ? `?region=${region}` : ''}`),
  getFixedPriceRoute: (slug: string) => request<Record<string, unknown>>(`/fixed-price/routes/${slug}`),
  getEmptyLegs: () => request<{ emptyLegs: Array<Record<string, unknown>> }>('/empty-legs'),
  getEmptyLeg: (slug: string) => request<Record<string, unknown>>(`/empty-legs/${slug}`),
  getNews: () => request<{ news: Array<Record<string, unknown>> }>('/content/news'),
  getNewsArticle: (slug: string) => request<Record<string, unknown>>(`/content/news/${slug}`),
  getBlogs: () => request<{ blogs: Array<Record<string, unknown>> }>('/content/blogs'),
  getBlog: (slug: string) => request<Record<string, unknown>>(`/content/blogs/${slug}`),
  getVideos: () => request<{ videos: Array<Record<string, unknown>> }>('/content/videos'),
  getDestinations: (opts?: { category?: string; locale?: string; search?: string; limit?: number }) => {
    const params = new URLSearchParams();
    if (opts?.category) params.set('category', opts.category);
    if (opts?.locale) params.set('locale', opts.locale);
    if (opts?.search) params.set('search', opts.search);
    if (opts?.limit) params.set('limit', String(opts.limit));
    const q = params.toString();
    return request<{ destinations: Array<Record<string, unknown>> }>(`/content/destinations${q ? `?${q}` : ''}`);
  },
  getDestination: (slug: string, locale?: string) =>
    request<Record<string, unknown>>(
      `/content/destinations/${encodeURIComponent(slug)}${locale ? `?locale=${encodeURIComponent(locale)}` : ''}`,
    ),
  searchAirports: (q: string) => request<{ airports: Array<{ iata: string; label: string; city: string }> }>(`/airports/search?q=${encodeURIComponent(q)}`),
  searchAircraft: (body: Record<string, unknown>) =>
    request<{ searchId: string; options: Array<Record<string, unknown>> }>('/quotes/search-aircraft', { method: 'POST', body: JSON.stringify(body) }),
  requestQuote: (body: Record<string, unknown>) =>
    request<{ requestId: number; status: string; message: string }>('/quotes/request', { method: 'POST', body: JSON.stringify(body) }),
  login: (email: string, password: string) =>
    request<{ user: { id: number }; tokens: { accessToken: string } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  sendOtp: (phone: string, purpose: 'LOGIN' | 'REGISTER') =>
    request<{ sent: boolean; devCode?: string }>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone, purpose }),
    }),
  verifyOtpLogin: (phone: string, code: string) =>
    request<{ user: { id: number }; tokens: { accessToken: string } }>('/auth/otp/verify-login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),
  verifyOtpRegister: (phone: string, code: string, email?: string) =>
    request<{ user: { id: number }; tokens: { accessToken: string } }>('/auth/otp/verify-register', {
      method: 'POST',
      body: JSON.stringify({ phone, code, email }),
    }),
  oauthGoogle: (token: string) =>
    request<{ user: { id: number }; tokens: { accessToken: string } }>('/auth/oauth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  oauthApple: (token: string) =>
    request<{ user: { id: number }; tokens: { accessToken: string; refreshToken?: string } }>(
      '/auth/oauth/apple',
      { method: 'POST', body: JSON.stringify({ token }) },
    ),
  logout: (refreshToken: string) =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  createGatewayPayment: (
    token: string,
    body: { bookingId: number; gateway: 'onepay' | '9pay'; returnUrl?: string },
  ) =>
    request<{ redirectUrl: string; gateway: string; paymentId: number }>('/payments/gateway', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
  register: (email: string, password: string) =>
    request<{ user: { id: number }; tokens: { accessToken: string } }>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMyBookings: (token: string) =>
    request<
      Array<{
        id: number;
        status?: string;
        bookingStatus?: string;
        documents?: Array<{
          id: number;
          documentType: string;
          status: string;
          fileUrl?: string;
          htmlUrl?: string;
        }>;
      }>
    >('/bookings/my', { headers: { Authorization: `Bearer ${token}` } }),
  getMyPayments: (token: string) =>
    request<
      Array<{
        id: number;
        bookingId: number;
        method: string;
        amount: number;
        currency: string;
        status: string;
        transactionRef?: string;
        createdAt: string;
      }>
    >('/payments/my', { headers: { Authorization: `Bearer ${token}` } }),
  getMyQuotes: (token: string) =>
    request<Array<{
      id: number;
      status: string;
      tripType: string;
      createdAt: string;
      legs: { from: string; to: string; departure: string; passengers: number }[];
    }>>('/quotes/my', { headers: { Authorization: `Bearer ${token}` } }),
  getMyJetCardAccounts: (token: string) =>
    request<Array<{
      accountId: number;
      planName: string;
      remainingHours: number;
      expiryDate: string;
      purchasedAt: string;
      recentTransactions: { txnType: string; hoursDelta: number; date: string }[];
    }>>('/jet-card/my', { headers: { Authorization: `Bearer ${token}` } }),
  getTravelCreditBalance: (token: string) =>
    request<{ credits: number; currency: string; expirySummary: { amount: number; expiresAt: string }[] }>(
      '/travel-credits/balance',
      { headers: { Authorization: `Bearer ${token}` } },
    ),
  getMe: (token: string) =>
    request<{ id: number; email: string; firstName?: string; lastName?: string; accountType?: string }>(
      '/me',
      { headers: { Authorization: `Bearer ${token}` } },
    ),
  getJetCardPlans: () => request<{ plans: Array<Record<string, unknown>> }>('/jet-card/plans'),
  submitJetCardEnquiry: (body: Record<string, unknown>) =>
    request<{ enquiryId: number; status: string; message: string }>('/jet-card/enquiries', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getTravelCreditPackages: () => request<{ packages: Array<Record<string, unknown>> }>('/travel-credits/packages'),
  submitTravelCreditEnquiry: (body: Record<string, unknown>) =>
    request<{ enquiryId: number; status: string; message: string }>('/travel-credits/enquiries', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  requestFixedPriceQuote: (body: Record<string, unknown>) =>
    request<{ quoteId: number; status: string; message: string }>('/fixed-price/quote', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  requestEmptyLeg: (id: number, body: Record<string, unknown>) =>
    request<{ requestId: number; status: string; message: string }>(`/empty-legs/${id}/request`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getPartnerPrograms: () =>
    request<{ roles: Array<{ code: string; name: string; commission: string; features: string[] }> }>(
      '/partners/programs',
    ),
  submitPartnerApplication: (body: Record<string, unknown>) =>
    request<{ applicationId: number; status: string; message: string }>('/partners/applications', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getWorldCupMatches: () =>
    request<{ matches: Array<Record<string, unknown>> }>('/campaigns/world-cup/matches'),
  requestWorldCupQuote: (body: Record<string, unknown>) =>
    request<{ requestId: number; status: string; message: string }>('/campaigns/world-cup/quotes', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getContentPage: (slug: string, locale = 'en') =>
    request<Record<string, unknown>>(`/content/pages/${slug}?locale=${locale}`),
  subscribeNewsletter: (email: string, locale = 'en') =>
    request<{ status: string; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, locale }),
    }),
  subscribeEmptyLegAlerts: (body: { email: string; fromAirport: string; toAirport: string; locale?: string }) =>
    request<{ status: string; message: string }>('/empty-legs/alerts/subscribe', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export async function safeApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.warn('[API] fallback used:', e);
    return fallback;
  }
}
