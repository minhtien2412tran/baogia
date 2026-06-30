/** Brand constants — rebrand from legacy JETBAY clone to J-TA */
export const BRAND_NAME = 'J-TA';
export const BRAND_LEGAL = 'J-TA Inc.';
export const BRAND_TAGLINE = 'Global Private Jet Charter';
export const BRAND_LOGO = '/assets/jta/logo.svg';

/** Replace legacy JETBAY strings from CMS or scraped content */
export function rebrandText(text: string): string {
  return text
    .replace(/JETBAY/g, BRAND_NAME)
    .replace(/Jetbay/g, BRAND_NAME)
    .replace(/jetbay/g, 'j-ta')
    .replace(/JETBAY Inc\./g, BRAND_LEGAL)
    .replace(/jet-bay\.com/g, 'j-ta.local');
}
