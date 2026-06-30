function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';
  if (typeof window !== 'undefined' && url.includes('localhost')) {
    return url.replace('localhost', '127.0.0.1');
  }
  return url;
}

const API_URL = resolveApiUrl();

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
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
  register: (email: string, password: string) =>
    request<{ user: { id: number }; tokens: { accessToken: string } }>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMyBookings: (token: string) =>
    request<unknown[]>('/bookings/my', { headers: { Authorization: `Bearer ${token}` } }),
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
