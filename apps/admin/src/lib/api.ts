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
  const token = getToken() ?? 'demo-token-1';
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-User-Id': '1',
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const adminApi = {
  login: (email: string, password: string) =>
    fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }).then((r) => r.json()),
  getStats: () => adminRequest<Record<string, number>>('/admin/dashboard/stats'),
  getRecentQuotes: (limit = 10) => adminRequest<unknown[]>(`/admin/dashboard/recent-quotes?limit=${limit}`),
  getRecentBookings: () => adminRequest<unknown[]>('/admin/dashboard/recent-bookings'),
  getRevenue: () => adminRequest<Record<string, unknown>>('/admin/dashboard/revenue-demo'),
  getAuditLogs: () => adminRequest<{ data: unknown[] }>('/admin/audit-logs'),
  getHealth: () => adminRequest<Record<string, unknown>>('/admin/system-health'),
  getBookings: () => adminRequest<{ data: unknown[] }>('/admin/bookings'),
  getFixedPriceRoutes: () => fetch(`${API_URL}/fixed-price/routes`).then((r) => r.json()),
  getEmptyLegs: () => adminRequest<{ emptyLegs: unknown[] }>('/admin/empty-legs'),
  getArticles: () => adminRequest<{ data: unknown[] }>('/admin/content/articles'),
  getAirports: () => fetch(`${API_URL}/airports`).then((r) => r.json()),
};
