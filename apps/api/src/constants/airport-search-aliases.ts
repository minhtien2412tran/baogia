/** Maps free-text queries (incl. Vietnamese) → DB country/city filters */

export type AirportAliasTarget = {
  countries?: string[];
  cities?: string[];
  /** Direct IATA when query is an abbreviation (e.g. hcm → SGN) */
  iata?: string;
};

/** Normalize for alias lookup: lowercase, strip accents */
export function normalizeAirportQuery(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

export const AIRPORT_SEARCH_ALIASES: Record<string, AirportAliasTarget> = {
  france: { countries: ['France'] },
  phap: { countries: ['France'] },
  usa: { countries: ['USA', 'United States'] },
  us: { countries: ['USA', 'United States'] },
  my: { countries: ['USA', 'United States'] },
  'hoa ky': { countries: ['USA', 'United States'] },
  'ho ky': { countries: ['USA', 'United States'] },
  uk: { countries: ['UK', 'United Kingdom'] },
  anh: { countries: ['UK', 'United Kingdom'] },
  vietnam: { countries: ['Vietnam'] },
  'viet nam': { countries: ['Vietnam'] },
  switzerland: { countries: ['Switzerland'] },
  'thuy si': { countries: ['Switzerland'] },
  germany: { countries: ['Germany'] },
  duc: { countries: ['Germany'] },
  italy: { countries: ['Italy'] },
  y: { countries: ['Italy'] },
  spain: { countries: ['Spain'] },
  'tay ban nha': { countries: ['Spain'] },
  japan: { countries: ['Japan'] },
  nhat: { countries: ['Japan'] },
  'nhat ban': { countries: ['Japan'] },
  china: { countries: ['China'] },
  'trung quoc': { countries: ['China'] },
  singapore: { countries: ['Singapore'] },
  thailand: { countries: ['Thailand'] },
  'thai lan': { countries: ['Thailand'] },
  uae: { countries: ['UAE', 'United Arab Emirates'] },
  paris: { cities: ['Paris'], iata: 'LBG' },
  lbg: { iata: 'LBG' },
  cdg: { iata: 'CDG' },
  ory: { iata: 'ORY' },
  london: { cities: ['London'] },
  nice: { cities: ['Nice'] },
  geneva: { cities: ['Geneva'] },
  'new york': { cities: ['New York'] },
  'los angeles': { cities: ['Los Angeles'] },
  miami: { cities: ['Miami'] },
  'las vegas': { cities: ['Las Vegas'] },
  washington: { cities: ['Washington'] },
  'san francisco': { cities: ['San Francisco'], iata: 'SFO' },
  chicago: { cities: ['Chicago'], iata: 'ORD' },
  boston: { cities: ['Boston'], iata: 'BOS' },
  osaka: { cities: ['Osaka'], iata: 'KIX' },
  taipei: { cities: ['Taipei'], iata: 'TPE' },
  maldives: { countries: ['Maldives'], iata: 'MLE' },
  male: { cities: ['Male'], iata: 'MLE' },
  seychelles: { countries: ['Seychelles'], iata: 'SEZ' },
  'hai phong': { cities: ['Hai Phong'], iata: 'HPH' },
  haiphong: { cities: ['Hai Phong'], iata: 'HPH' },
  'ho chi minh': { cities: ['Ho Chi Minh City'], iata: 'SGN' },
  'sai gon': { cities: ['Ho Chi Minh City'], iata: 'SGN' },
  'tp hcm': { cities: ['Ho Chi Minh City'], iata: 'SGN' },
  hcm: { cities: ['Ho Chi Minh City'], iata: 'SGN' },
  hcmc: { cities: ['Ho Chi Minh City'], iata: 'SGN' },
  tphcm: { cities: ['Ho Chi Minh City'], iata: 'SGN' },
  sgn: { iata: 'SGN' },
  hanoi: { cities: ['Hanoi'], iata: 'HAN' },
  'ha noi': { cities: ['Hanoi'], iata: 'HAN' },
  han: { iata: 'HAN' },
  hue: { cities: ['Hue'], iata: 'HUI' },
  hui: { iata: 'HUI' },
  'phu bai': { cities: ['Hue'], iata: 'HUI' },
  'da nang': { cities: ['Da Nang'], iata: 'DAD' },
  danang: { cities: ['Da Nang'], iata: 'DAD' },
  dad: { iata: 'DAD' },
  'nha trang': { cities: ['Nha Trang'], iata: 'CXR' },
  cxr: { iata: 'CXR' },
  vn: { countries: ['Vietnam'] },
  tokyo: { cities: ['Tokyo'] },
  dubai: { cities: ['Dubai'] },
  bangkok: { cities: ['Bangkok'] },
  'hong kong': { cities: ['Hong Kong'] },
  bali: { cities: ['Denpasar'], iata: 'DPS' },
  denpasar: { cities: ['Denpasar'], iata: 'DPS' },
};

export function resolveAirportAlias(q: string): AirportAliasTarget | null {
  const norm = normalizeAirportQuery(q);
  if (!norm) return null;
  return AIRPORT_SEARCH_ALIASES[norm] ?? null;
}

export function buildAliasOrFilters(alias: AirportAliasTarget) {
  const or: Array<{
    iata?: string;
    country?: { contains: string; mode: 'insensitive' };
    city?: { contains: string; mode: 'insensitive' };
  }> = [];
  if (alias.iata) {
    or.push({ iata: alias.iata.toUpperCase() });
  }
  for (const c of alias.countries ?? []) {
    or.push({ country: { contains: c, mode: 'insensitive' } });
  }
  for (const c of alias.cities ?? []) {
    or.push({ city: { contains: c, mode: 'insensitive' } });
  }
  return or;
}
