/** Shared SMTP readiness helpers — no secrets logged. */

const LOOPBACK_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'host.docker.internal',
]);

export function isProductionAppEnv(env = process.env): boolean {
  const v = (env.APP_ENV ?? env.NODE_ENV ?? '').toLowerCase();
  return v === 'production' || v === 'prod';
}

/** Host present but not usable for real inbound mail in production. */
export function isLoopbackSmtpHost(host: string | undefined | null): boolean {
  if (!host?.trim()) return false;
  const h = host.trim().toLowerCase();
  return LOOPBACK_HOSTS.has(h) || h.endsWith('.local');
}

/**
 * True when SMTP is configured for real delivery attempts.
 * In production, localhost/MailHog-style hosts count as NOT configured.
 */
export function isSmtpDeliverableConfigured(env = process.env): boolean {
  const host = env.SMTP_HOST?.trim();
  if (!host) return false;
  if (host.startsWith('CHANGE_ME')) return false;
  if (isProductionAppEnv(env) && isLoopbackSmtpHost(host)) return false;
  return true;
}

export function smtpNonDeliverableReason(env = process.env): string | null {
  const host = env.SMTP_HOST?.trim();
  if (!host) return 'SMTP_HOST empty';
  if (isProductionAppEnv(env) && isLoopbackSmtpHost(host)) {
    return `SMTP_HOST=${host} is loopback — not valid for production delivery (set real SMTP_* ; see SMTP_SETUP_GUIDE.md)`;
  }
  return null;
}
