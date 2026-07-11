/** Client auth session — localStorage JWT (web clone GĐ1) */

export const AUTH_CHANGED_EVENT = 'jetbay-auth-changed';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jetbay_token');
}

export function getAuthUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem('jetbay_user_id');
  return id ? Number(id) : null;
}

export function isLoggedIn(): boolean {
  return !!getAuthToken();
}

export function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

export async function clearAuthSession(logoutApi?: () => Promise<void>) {
  if (logoutApi) {
    try {
      await logoutApi();
    } catch {
      /* best-effort */
    }
  }
  localStorage.removeItem('jetbay_token');
  localStorage.removeItem('jetbay_refresh_token');
  localStorage.removeItem('jetbay_user_id');
  notifyAuthChanged();
}
