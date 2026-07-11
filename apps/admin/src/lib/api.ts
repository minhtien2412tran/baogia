function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';
  if (typeof window !== 'undefined' && url.includes('localhost')) {
    return url.replace('localhost', '127.0.0.1');
  }
  return url.replace(/\/$/, '');
}

const API_URL = resolveApiUrl();
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '';

export function getApiBaseUrl(): string {
  return API_URL;
}

function apiHeaders(extra?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    ...extra,
  };
}

function networkErrorMessage(err: unknown): string {
  if (err instanceof TypeError) {
    return `Cannot reach API at ${API_URL}. Check CORS / network / API status.`;
  }
  if (err instanceof Error) return err.message;
  return 'Request failed';
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jetbay_admin_token');
}

export function setToken(token: string) {
  localStorage.setItem('jetbay_admin_token', token);
}

export function clearToken() {
  localStorage.removeItem('jetbay_admin_token');
}

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: apiHeaders({
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    }),
  });
  if (res.status === 401 || res.status === 403) {
    clearToken();
    throw new Error('Session expired — please sign in again');
  }
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: apiHeaders() });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export type LoginResponse = {
  message?: string;
  user?: { id: number; email: string; role?: string };
  tokens?: { accessToken: string; refreshToken?: string };
};

export const adminApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      throw new Error(networkErrorMessage(err));
    }
    const data = (await res.json().catch(() => ({}))) as LoginResponse & { message?: string };
    if (!res.ok) throw new Error(data.message ?? `Login failed (${res.status})`);
    return data;
  },
  getStats: () => adminRequest<Record<string, number>>('/admin/dashboard/stats'),
  getRecentQuotes: (limit = 10) => adminRequest<unknown[]>(`/admin/dashboard/recent-quotes?limit=${limit}`),
  getRecentBookings: () => adminRequest<unknown[]>('/admin/dashboard/recent-bookings'),
  getRevenue: () => adminRequest<Record<string, unknown>>('/admin/dashboard/revenue-demo'),
  getAuditLogs: () => adminRequest<{ data: unknown[] }>('/admin/audit-logs'),
  getHealth: () => adminRequest<Record<string, unknown>>('/admin/system-health'),
  getBookings: () => adminRequest<{ data: unknown[] }>('/admin/bookings'),
  getFixedPriceRoutes: () => publicGet<{ routes: unknown[] }>('/fixed-price/routes'),
  getAdminFixedPriceRoutes: () => adminRequest<{ routes: unknown[] }>('/admin/fixed-price/routes'),
  createFixedPriceRoute: (body: unknown) =>
    adminRequest<unknown>('/admin/fixed-price/routes', { method: 'POST', body: JSON.stringify(body) }),
  updateFixedPriceRoute: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/fixed-price/routes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteFixedPriceRoute: (id: number) =>
    adminRequest<unknown>(`/admin/fixed-price/routes/${id}`, { method: 'DELETE' }),
  getEmptyLegs: () => adminRequest<{ emptyLegs: unknown[] }>('/admin/empty-legs'),
  createEmptyLeg: (body: unknown) =>
    adminRequest<unknown>('/admin/empty-legs', { method: 'POST', body: JSON.stringify(body) }),
  updateEmptyLeg: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/empty-legs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteEmptyLeg: (id: number) =>
    adminRequest<unknown>(`/admin/empty-legs/${id}`, { method: 'DELETE' }),
  getAdminJetCardPlans: () => adminRequest<{ plans: unknown[] }>('/admin/jet-card/plans'),
  createJetCardPlan: (body: unknown) =>
    adminRequest<unknown>('/admin/jet-card/plans', { method: 'POST', body: JSON.stringify(body) }),
  updateJetCardPlan: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/jet-card/plans/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteJetCardPlan: (id: number) =>
    adminRequest<unknown>(`/admin/jet-card/plans/${id}`, { method: 'DELETE' }),
  updateBookingStatus: (id: number, status: string) =>
    adminRequest<unknown>(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getArticles: () => adminRequest<{ data: unknown[] }>('/admin/content/articles'),
  getArticle: (id: number) => adminRequest<Record<string, unknown>>(`/admin/content/articles/${id}`),
  createArticle: (body: unknown) =>
    adminRequest<unknown>('/admin/content/articles', { method: 'POST', body: JSON.stringify(body) }),
  updateArticle: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/content/articles/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteArticle: (id: number) =>
    adminRequest<unknown>(`/admin/content/articles/${id}`, { method: 'DELETE' }),
  getPages: () => adminRequest<{ data: unknown[] }>('/admin/content/pages'),
  getPage: (id: number) => adminRequest<Record<string, unknown>>(`/admin/content/pages/${id}`),
  createPage: (body: unknown) =>
    adminRequest<unknown>('/admin/content/pages', { method: 'POST', body: JSON.stringify(body) }),
  updatePage: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/content/pages/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deletePage: (id: number) =>
    adminRequest<unknown>(`/admin/content/pages/${id}`, { method: 'DELETE' }),
  getVideos: () => adminRequest<{ data: unknown[] }>('/admin/content/videos'),
  createVideo: (body: unknown) =>
    adminRequest<unknown>('/admin/content/videos', { method: 'POST', body: JSON.stringify(body) }),
  updateVideo: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/content/videos/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteVideo: (id: number) =>
    adminRequest<unknown>(`/admin/content/videos/${id}`, { method: 'DELETE' }),
  updateQuoteStatus: (id: number, status: string) =>
    adminRequest<unknown>(`/admin/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getQuotes: (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return adminRequest<{ data: unknown[]; pagination: Record<string, number> }>(
      `/admin/quotes${qs ? `?${qs}` : ''}`,
    );
  },
  getQuote: (id: number) => adminRequest<Record<string, unknown>>(`/admin/quotes/${id}`),
  getOperators: () => adminRequest<{ operators: unknown[] }>('/admin/operators'),
  createQuoteOffer: (
    quoteId: number,
    body: {
      aircraftModelId: number;
      operatorId: number;
      price: number;
      expiresAt: string;
      pricingBreakdown?: Record<string, unknown>;
    },
  ) =>
    adminRequest<unknown>(`/admin/quotes/${quoteId}/offers`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getAircraftModels: () => adminRequest<{ models: unknown[] }>('/admin/aircraft/models'),
  getAirports: () => adminRequest<{ data: unknown[] }>('/admin/airports?limit=200'),
  createAirport: (body: unknown) =>
    adminRequest<unknown>('/admin/airports', { method: 'POST', body: JSON.stringify(body) }),
  updateAirport: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/airports/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAirport: (id: number) =>
    adminRequest<unknown>(`/admin/airports/${id}`, { method: 'DELETE' }),
  getJetCardPlans: () => publicGet<{ plans: unknown[] }>('/jet-card/plans'),
  getTravelCreditPackages: () => publicGet<{ packages: unknown[] }>('/travel-credits/packages'),
  getAdminTravelCreditPackages: () =>
    adminRequest<{ packages: unknown[] }>('/admin/travel-credits/packages'),
  createTravelCreditPackage: (body: unknown) =>
    adminRequest<unknown>('/admin/travel-credits/packages', { method: 'POST', body: JSON.stringify(body) }),
  updateTravelCreditPackage: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/travel-credits/packages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  deleteTravelCreditPackage: (id: number) =>
    adminRequest<unknown>(`/admin/travel-credits/packages/${id}`, { method: 'DELETE' }),
  getPartnerApplications: () => adminRequest<{ applications: unknown[] }>('/admin/partners/applications'),
  reviewPartnerApplication: (id: number, status: 'APPROVED' | 'REJECTED') =>
    adminRequest<unknown>(`/admin/partners/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getUsers: () => adminRequest<{ data: unknown[] }>('/admin/users'),
  updateUser: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getTravelCreditTransactions: () => adminRequest<{ data: unknown[] }>('/admin/travel-credits/transactions'),
  getDestinations: (category?: string) =>
    adminRequest<{ data: unknown[]; pagination: { total: number } }>(
      `/admin/content/destinations${category ? `?category=${category}&limit=100` : '?limit=100'}`,
    ),
  createDestination: (body: unknown) =>
    adminRequest<unknown>('/admin/content/destinations', { method: 'POST', body: JSON.stringify(body) }),
  updateDestination: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/content/destinations/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteDestination: (id: number) =>
    adminRequest<unknown>(`/admin/content/destinations/${id}`, { method: 'DELETE' }),
  listMedia: () =>
    adminRequest<{ configured: boolean; objects: { key: string; url: string; size: number; lastModified: string }[] }>(
      '/admin/media',
    ),
  uploadMedia: async (file: File) => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_URL}/admin/media/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
      },
      body: form,
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json() as Promise<{ key: string; url: string }>;
  },
  deleteMedia: (objectKey: string) => {
    const path = objectKey
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/');
    return adminRequest<unknown>(`/admin/media/${path}`, { method: 'DELETE' });
  },
  getAircraftCategories: () => adminRequest<{ categories: unknown[] }>('/admin/aircraft/categories'),
  createAircraftCategory: (body: unknown) =>
    adminRequest<unknown>('/admin/aircraft/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateAircraftCategory: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/aircraft/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAircraftCategory: (id: number) =>
    adminRequest<unknown>(`/admin/aircraft/categories/${id}`, { method: 'DELETE' }),
  createAircraftModel: (body: unknown) =>
    adminRequest<unknown>('/admin/aircraft/models', { method: 'POST', body: JSON.stringify(body) }),
  updateAircraftModel: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/aircraft/models/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAircraftModel: (id: number) =>
    adminRequest<unknown>(`/admin/aircraft/models/${id}`, { method: 'DELETE' }),
};
