/** Map Nest API payloads → jetbay-main UI cards */

const PLACEHOLDER_JET =
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop';

const CITY_IMAGES: Record<string, string> = {
  London: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop',
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
  Nice: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1000&auto=format&fit=crop',
  Miami: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop',
  'Los Angeles': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
};

export type UiEmptyLeg = {
  id: number | string;
  slug?: string;
  image: string;
  model?: string;
  seats?: string;
  date?: string;
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
  price: string;
  continent?: string;
};

export type UiFixedRoute = {
  id: number | string;
  slug?: string;
  region?: string;
  from: { code: string; city: string };
  to: { code: string; city: string };
  priceLight: string;
  priceMid: string;
  paxLight?: number;
  paxMid?: number;
  image: string;
  classes?: Array<{ name: string; price: string; pax: string }>;
};

export type UiJetPlan = {
  id: number | string;
  name: string;
  hours: number;
  bullets: string[];
  accent: 'white' | 'gold' | 'blue';
};

const PLAN_COPY: Record<number, { bullets: string[]; accent: UiJetPlan['accent'] }> = {
  10: {
    bullets: ['Occasional private flyers', 'Flexibility without long-term commitment'],
    accent: 'white',
  },
  25: {
    bullets: ['Business travellers & executives', 'Lower hourly rates, priority booking'],
    accent: 'gold',
  },
  50: {
    bullets: ['Frequent global travellers', 'Best value, ultimate convenience'],
    accent: 'blue',
  },
};

function airportLine(a?: { city?: string; iata?: string; country?: string }) {
  const city = a?.city ?? a?.iata ?? '—';
  const detail = [a?.country, a?.iata ? `(${a.iata})` : null].filter(Boolean).join(' ');
  return { city, detail: detail || (a?.iata ? `(${a.iata})` : '') };
}

function formatMoney(n: unknown): string {
  const num = Number(n);
  if (!Number.isFinite(num)) return 'On request';
  return num.toLocaleString('en-US');
}

export function mapEmptyLegs(
  rows: Array<Record<string, unknown>> | undefined,
): UiEmptyLeg[] {
  if (!rows?.length) return [];
  return rows.map((el, idx) => {
    const from = airportLine(el.fromAirport as { city?: string; iata?: string; country?: string });
    const to = airportLine(el.toAirport as { city?: string; iata?: string; country?: string });
    const departAt = el.departAt ? new Date(String(el.departAt)) : null;
    const date =
      departAt && !Number.isNaN(departAt.getTime())
        ? departAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : undefined;
    return {
      id: (el.id as number) ?? idx,
      slug: el.slug as string | undefined,
      image: `${PLACEHOLDER_JET}&sig=${idx}`,
      model: (el.aircraftModel as string) || undefined,
      seats: undefined,
      date,
      fromCity: from.city,
      fromCountry: from.detail,
      toCity: to.city,
      toCountry: to.detail,
      price: formatMoney(el.price),
      continent: (el.fromContinent as string) || (el.toContinent as string) || undefined,
    };
  });
}

export function mapFixedRoutes(
  rows: Array<Record<string, unknown>> | undefined,
): UiFixedRoute[] {
  if (!rows?.length) return [];
  return rows.map((r, idx) => {
    const fromA = r.fromAirport as { city?: string; iata?: string } | undefined;
    const toA = r.toAirport as { city?: string; iata?: string } | undefined;
    const tiers =
      (r.priceOptions as Array<{
        category: string;
        categoryLabel?: string;
        price: number;
        paxLimit: number;
      }>) ?? [];
    const light = tiers[0];
    const mid = tiers[1] ?? tiers[0];
    const city = toA?.city ?? fromA?.city ?? 'Charter';
    const image = CITY_IMAGES[city] ?? PLACEHOLDER_JET;
    const classes = tiers.map((t) => ({
      name: t.categoryLabel ?? t.category,
      price: `USD ${formatMoney(t.price)}`,
      pax: `Up to ${t.paxLimit} passengers`,
    }));
    return {
      id: (r.id as number) ?? idx,
      slug: r.slug as string | undefined,
      region: r.region as string | undefined,
      from: { code: fromA?.iata ?? '—', city: fromA?.city ?? '—' },
      to: { code: toA?.iata ?? '—', city: toA?.city ?? '—' },
      priceLight: formatMoney(light?.price),
      priceMid: formatMoney(mid?.price),
      paxLight: light?.paxLimit ?? 8,
      paxMid: mid?.paxLimit ?? 16,
      image,
      classes:
        classes.length > 0
          ? classes
          : [
              { name: 'Light Jets', price: 'On request', pax: 'Up to 8 passengers' },
              { name: 'Midsize to Heavy Jets', price: 'On request', pax: 'Up to 16 passengers' },
            ],
    };
  });
}

export function mapJetPlans(
  rows: Array<Record<string, unknown>> | undefined,
): UiJetPlan[] {
  if (!rows?.length) return [];
  return rows.map((p, idx) => {
    const hours = Number(p.hours ?? 10);
    const copy = PLAN_COPY[hours] ?? {
      bullets: [String(p.name ?? 'Jet Card'), hours ? `${hours} flight hours` : 'Membership'],
      accent: 'white' as const,
    };
    return {
      id: (p.id as number) ?? idx,
      name: String(p.name ?? `${hours} Hour Jet Card`),
      hours,
      bullets: copy.bullets,
      accent: copy.accent,
    };
  });
}

/** Continent tab labels used by Empty Legs page → ISO-ish codes for client filter */
export const REGION_CONTINENT: Record<string, string | null> = {
  All: null,
  'North America': 'NA',
  'Central America': 'NA',
  'South America': 'SA',
  Europe: 'EU',
  'Eastern Europe': 'EU',
  'East Asia': 'AS',
  'Southeast Asia': 'AS',
  'West Asia': 'AS',
  'South Asia': 'AS',
  'Central Asia': 'AS',
  Africa: 'AF',
  Oceania: 'OC',
};
