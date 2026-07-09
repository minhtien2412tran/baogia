/** Brand constants — JETBAY project */
export const BRAND_NAME = 'JetBay';
export const BRAND_LEGAL = 'JetBay Inc.';
export const BRAND_TAGLINE = 'Global Private Jet Charter';
export const BRAND_LOGO = '/assets/jetbay/logo.svg';

/** Normalize legacy J-TA / jetbay.com strings from CMS or scraped content */
export function rebrandText(text: string): string {
  return text
    .replace(/J\s*-\s*TA/g, BRAND_NAME)
    .replace(/J-TA/g, BRAND_NAME)
    .replace(/j-ta\.local/g, 'jetbay.local')
    .replace(/@j-ta\.local/g, '@jetbay.local')
    .replace(/jet-bay\.com/g, 'jetbay.local');
}
