/** Brand constants — provisional JetVina under SAFE_REFERENCE_MODE.
 * Legal entity, contact, and logo must be confirmed by the client before production cutover.
 * Do NOT hotlink JetVina assets. Logo placeholder is internal-only.
 */
export const BRAND_NAME = 'JetVina';
export const BRAND_LEGAL = 'JetVina';
export const BRAND_TAGLINE = 'Private Air Charter';
export const BRAND_LOGO = '/assets/brand/logo-placeholder.svg';

/** Hide unverified marketing claims (10K+, No.1, etc.) until client-approved numbers. */
export const SHOW_UNVERIFIED_STATS = false;

/** Normalize legacy JetBay / J-TA strings from CMS or scraped content */
export function rebrandText(text: string): string {
  return text
    .replace(/JetBay Inc\./gi, BRAND_LEGAL)
    .replace(/JetBay/gi, BRAND_NAME)
    .replace(/J\s*-\s*TA/g, BRAND_NAME)
    .replace(/J-TA/g, BRAND_NAME)
    .replace(/j-ta\.local/g, 'jetvina.local')
    .replace(/@j-ta\.local/g, '@jetvina.local')
    .replace(/jetbay\.local/gi, 'jetvina.local')
    .replace(/jet-bay\.com/gi, 'jetvina.local');
}
