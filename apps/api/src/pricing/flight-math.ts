/** Great-circle distance in km (WGS84 sphere approximation). */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Flight minutes from distance and cruise speed (km/h). Floor 30 min. */
export function estimateFlightMinutes(distanceKm: number, speedKmh: number): number {
  const speed = Math.max(speedKmh || 750, 200);
  return Math.max(30, Math.round((distanceKm / speed) * 60));
}

export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

export function applyMinimumBillableHours(
  rawHours: number,
  minimumBillableHours: number,
): number {
  return Math.max(rawHours, minimumBillableHours);
}

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}
