/** Schedule a UI update outside the synchronous effect body (React Compiler lint). */
export function scheduleUi(fn: () => void): void {
  queueMicrotask(fn);
}

export function navigateExternal(url: string): void {
  window.location.assign(url);
}

export function writeCookie(name: string, value: string, maxAgeSec: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAgeSec};samesite=lax`;
}
