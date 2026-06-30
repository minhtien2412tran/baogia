function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';
  if (typeof window !== 'undefined' && url.includes('localhost')) {
    return url.replace('localhost', '127.0.0.1');
  }
  return url;
}

const API_URL = resolveApiUrl();

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jta_admin_token');
}

export function setToken(token: string) {
  localStorage.setItem('jta_admin_token', token);
}

export function clearToken() {
  localStorage.removeItem('jta_admin_token');
}

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (res.status === 401 || res.status === 403) {
    clearToken();
    throw new Error('Session expired — please sign in again');
  }
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' } });
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
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as LoginResponse & { message?: string };
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
  getEmptyLegs: () => adminRequest<{ emptyLegs: unknown[] }>('/admin/empty-legs'),
  getArticles: () => adminRequest<{ data: unknown[] }>('/admin/content/articles'),
  getPages: () => adminRequest<{ data: unknown[] }>('/admin/content/pages'),
  updatePage: (id: number, body: unknown) =>
    adminRequest<unknown>(`/admin/content/pages/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getAirports: () => publicGet<{ airports: unknown[] }>('/airports'),
  getJetCardPlans: () => publicGet<{ plans: unknown[] }>('/jet-card/plans'),
  getTravelCreditPackages: () => publicGet<{ packages: unknown[] }>('/travel-credits/packages'),
  getPartnerApplications: () => adminRequest<{ applications: unknown[] }>('/admin/partners/applications'),
  getTravelCreditTransactions: () => adminRequest<{ data: unknown[] }>('/admin/travel-credits/transactions'),
  getDestinations: (category?: string) =>
    adminRequest<{ data: unknown[]; pagination: { total: number } }>(
      `/admin/content/destinations${category ? `?category=${category}&limit=100` : '?limit=100'}`,
    ),
};
