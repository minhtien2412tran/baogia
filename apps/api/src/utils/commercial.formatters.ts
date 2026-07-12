import { Airport, AircraftCategory, FixedPriceRoute, FixedPriceOption } from '@prisma/client';

type RouteWithRelations = FixedPriceRoute & {
  fromAirport: Airport;
  toAirport: Airport;
  options: (FixedPriceOption & { category: AircraftCategory })[];
};

export function formatAirport(a: Airport, detailed = false) {
  const base = {
    iata: a.iata,
    city: a.city,
    country: a.country,
    continentCode: a.continentCode ?? undefined,
    countryCode: a.countryCode ?? undefined,
  };
  if (!detailed) return base;
  return {
    ...base,
    icao: a.icao,
    name: a.name,
    timezone: a.timezone,
    latitude: a.latitude != null ? Number(a.latitude) : undefined,
    longitude: a.longitude != null ? Number(a.longitude) : undefined,
  };
}

export function formatFixedPriceRoute(route: RouteWithRelations, detailed = false) {
  return {
    id: route.id,
    slug: route.slug,
    fromAirport: formatAirport(route.fromAirport, detailed),
    toAirport: formatAirport(route.toAirport, detailed),
    region: route.region,
    status: route.status,
    priceOptions: route.options.map((opt) => ({
      id: opt.id,
      category: opt.category.code,
      categoryLabel: opt.category.label,
      price: Number(opt.price),
      paxLimit: opt.paxLimit,
      includedTerms: opt.includedTerms,
      ...(detailed ? { model: opt.category.label } : {}),
    })),
    ...(detailed
      ? {
          whatsIncluded: [
            'Private aircraft charter flight',
            'VIP lounge access',
            'Standard catering on board',
          ],
          whatsNotIncluded: ['De-icing fees', 'Ground transportation'],
          faqs: [
            {
              question: 'Can I change my flight date?',
              answer: 'Yes, up to 48 hours before departure. Fees may apply.',
            },
          ],
        }
      : {}),
  };
}
