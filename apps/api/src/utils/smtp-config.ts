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

/** Owner opt-in: Mailpit/MailHog catcher on loopback (not a real customer inbox). */
export function isSmtpCatcherAllowed(env = process.env): boolean {
  const v = (env.SMTP_ALLOW_CATCHER ?? '').trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

export function isSmtpCatcherMode(env = process.env): boolean {
  const host = env.SMTP_HOST?.trim();
  return (
    isProductionAppEnv(env) &&
    isLoopbackSmtpHost(host) &&
    isSmtpCatcherAllowed(env)
  );
}

/**
 * Transport may send (includes intentional Mailpit catcher when allowed).
 * Does NOT mean a real customer inbox.
 */
export function isSmtpTransportConfigured(env = process.env): boolean {
  const host = env.SMTP_HOST?.trim();
  if (!host) return false;
  if (host.startsWith('CHANGE_ME')) return false;
  if (isProductionAppEnv(env) && isLoopbackSmtpHost(host)) {
    return isSmtpCatcherAllowed(env);
  }
  return true;
}

/**
 * True when SMTP is configured for real delivery attempts.
 * In production, localhost/MailHog-style hosts never count as deliverable —
 * even with SMTP_ALLOW_CATCHER (catcher ≠ inbox verification).
 */
export function isSmtpDeliverableConfigured(env = process.env): boolean {
  const host = env.SMTP_HOST?.trim();
  if (!host) return false;
  if (host.startsWith('CHANGE_ME')) return false;
  if (isProductionAppEnv(env) && isLoopbackSmtpHost(host)) return false;
  return true;
}

/** Reason transport must not send (empty host or blocked loopback without catcher). */
export function smtpTransportBlockedReason(env = process.env): string | null {
  const host = env.SMTP_HOST?.trim();
  if (!host) return 'SMTP_HOST empty';
  if (isProductionAppEnv(env) && isLoopbackSmtpHost(host) && !isSmtpCatcherAllowed(env)) {
    return `SMTP_HOST=${host} is loopback — not valid for production delivery (set real SMTP_* or SMTP_ALLOW_CATCHER=true for Mailpit; see SMTP_SETUP_GUIDE.md)`;
  }
  return null;
}

/** Reason public "deliverable" is false (loopback / empty). */
export function smtpNonDeliverableReason(env = process.env): string | null {
  const host = env.SMTP_HOST?.trim();
  if (!host) return 'SMTP_HOST empty';
  if (isProductionAppEnv(env) && isLoopbackSmtpHost(host)) {
    if (isSmtpCatcherAllowed(env)) {
      return `SMTP catcher mode (Mailpit on ${host}) — not a real inbox; T-S4-01 stays blocked until real SMTP_*`;
    }
    return `SMTP_HOST=${host} is loopback — not valid for production delivery (set real SMTP_* ; see SMTP_SETUP_GUIDE.md)`;
  }
  return null;
}
