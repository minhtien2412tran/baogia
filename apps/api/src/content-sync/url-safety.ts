import { createHash } from 'crypto';
import { isIP } from 'net';
import { lookup } from 'dns/promises';

const PRIVATE_IPV4 = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // CGNAT
];

function isPrivateIp(ip: string): boolean {
  if (ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80')) {
    return true;
  }
  return PRIVATE_IPV4.some((re) => re.test(ip));
}

export function contentHash(payload: unknown): string {
  const normalized = JSON.stringify(payload);
  return createHash('sha256').update(normalized).digest('hex');
}

export function assertAllowedUrl(
  rawUrl: string,
  allowedDomains: string[],
  opts?: { allowHttpLocal?: boolean },
): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }

  if (url.protocol !== 'https:' && !(opts?.allowHttpLocal && url.protocol === 'http:')) {
    throw new Error('Only HTTPS URLs are allowed');
  }

  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host === '0.0.0.0') {
    throw new Error('Localhost URLs are blocked');
  }

  if (isIP(host) && isPrivateIp(host)) {
    throw new Error('Private IP URLs are blocked');
  }

  const allow = allowedDomains.map((d) => d.toLowerCase().replace(/^www\./, ''));
  const bare = host.replace(/^www\./, '');
  if (!allow.some((d) => bare === d || bare.endsWith(`.${d}`))) {
    throw new Error(`Host ${host} is not in allowlist`);
  }

  return url;
}

/** Resolve DNS and reject private/link-local targets (SSRF). */
export async function assertPublicResolvedHost(hostname: string): Promise<void> {
  if (isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error('Private IP blocked after parse');
    return;
  }
  const records = await lookup(hostname, { all: true });
  for (const r of records) {
    if (isPrivateIp(r.address)) {
      throw new Error(`Resolved private address blocked: ${r.address}`);
    }
  }
}

export const PUBLISHABLE_RIGHTS = new Set([
  'OWNED',
  'LICENSED',
  'CLIENT_PROVIDED',
  'PUBLIC_DOMAIN',
]);

export function canPublishRights(status: string): boolean {
  return PUBLISHABLE_RIGHTS.has(status);
}

export function canStoreCopyrightedHtml(syncMode: string): boolean {
  return syncMode === 'AUTHORIZED_DIRECT_SYNC';
}
