/** Great-circle distance helpers for airport geo + positioning pricing */

const EARTH_RADIUS_KM = 6371;

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine distance in km between two WGS84 points */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export type SegmentType = 'POSITIONING' | 'REVENUE' | 'RETURN' | 'REPOSITION';

export type FlightSegmentPlan = {
  type: SegmentType;
  fromIata: string;
  toIata: string;
};

/**
 * Build positioning itinerary for charter demo pricing.
 * ONE_WAY: Start → Pickup → Dest → HomeBase
 * ROUND_TRIP: Start → Pickup → Dest → Pickup → HomeBase
 */
export function buildPositioningSegments(opts: {
  tripType: string;
  /** Where the aircraft is now (positioning origin) */
  startIata: string;
  /** Contractual home base (reposition destination) */
  homeIata: string;
  pickupIata: string;
  destIata: string;
  extraRevenueLegs?: Array<{ from: string; to: string }>;
}): FlightSegmentPlan[] {
  const {
    tripType,
    startIata,
    homeIata,
    pickupIata,
    destIata,
    extraRevenueLegs = [],
  } = opts;
  const segments: FlightSegmentPlan[] = [];

  if (startIata !== pickupIata) {
    segments.push({ type: 'POSITIONING', fromIata: startIata, toIata: pickupIata });
  }

  segments.push({ type: 'REVENUE', fromIata: pickupIata, toIata: destIata });

  for (const leg of extraRevenueLegs) {
    segments.push({ type: 'REVENUE', fromIata: leg.from, toIata: leg.to });
  }

  const lastDest =
    extraRevenueLegs.length > 0
      ? extraRevenueLegs[extraRevenueLegs.length - 1].to
      : destIata;

  if (tripType === 'ROUND_TRIP') {
    segments.push({ type: 'RETURN', fromIata: lastDest, toIata: pickupIata });
    if (pickupIata !== homeIata) {
      segments.push({ type: 'REPOSITION', fromIata: pickupIata, toIata: homeIata });
    }
  } else if (lastDest !== homeIata) {
    segments.push({ type: 'REPOSITION', fromIata: lastDest, toIata: homeIata });
  }

  return segments;
}

export function flightHours(distanceKm: number, speedKmh: number, minHours = 0.5): number {
  const speed = Math.max(speedKmh, 300);
  return Math.max(minHours, distanceKm / speed);
}
