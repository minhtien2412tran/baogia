/** Shared allowlist / MIME / SSRF helpers for JetVina media sync. */
import { isIP } from 'node:net';

export const ALLOWED_HOSTS = new Set(['jetvina.com', 'www.jetvina.com']);
export const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
export const MAX_BYTES = 8 * 1024 * 1024;

export function isPrivateIp(ip) {
  if (ip === '::1' || ip === '127.0.0.1') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  if (ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80')) return true;
  return false;
}

export function sniffMime(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return 'image/png';
  }
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  if (buf.length >= 12 && buf.toString('ascii', 4, 8) === 'ftyp') return 'image/avif';
  return null;
}

/** Synchronous host/path checks (DNS SSRF checked by caller). */
export function assertAllowedUrlShape(urlString) {
  const u = new URL(urlString);
  if (u.protocol !== 'https:') throw new Error('only https allowed');
  if (!ALLOWED_HOSTS.has(u.hostname)) throw new Error(`host not allowlisted: ${u.hostname}`);
  if (!u.pathname.startsWith('/wp-content/uploads/')) {
    throw new Error('path must be under /wp-content/uploads/');
  }
  if (u.pathname.toLowerCase().endsWith('.svg')) throw new Error('SVG blocked from external source');
  return u;
}

export function assertResolvedIpsSafe(addresses) {
  for (const address of addresses) {
    if (isPrivateIp(address) || (isIP(address) && isPrivateIp(address))) {
      throw new Error(`SSRF blocked private IP ${address}`);
    }
  }
}

export function validateDownloadedImage(buf, contentType) {
  if (buf.length > MAX_BYTES) throw new Error(`file too large ${buf.length}`);
  const sniffed = sniffMime(buf);
  if (!sniffed || !ALLOWED_MIME.has(sniffed)) {
    throw new Error(`MIME blocked sniff=${sniffed} header=${contentType}`);
  }
  if (contentType && !contentType.startsWith('image/') && contentType !== 'application/octet-stream') {
    throw new Error(`content-type blocked ${contentType}`);
  }
  return sniffed;
}
