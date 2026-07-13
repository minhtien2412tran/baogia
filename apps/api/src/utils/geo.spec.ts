import {
  buildPositioningSegments,
  flightHours,
  haversineKm,
} from '../utils/geo';

describe('geo utils', () => {
  it('haversineKm SGN→HAN is roughly 1160km', () => {
    const km = haversineKm(10.8188, 106.6519, 21.2212, 105.8072);
    expect(km).toBeGreaterThan(1100);
    expect(km).toBeLessThan(1250);
  });

  it('flightHours respects minHours', () => {
    expect(flightHours(10, 800, 1)).toBe(1);
    expect(flightHours(1600, 800, 0.5)).toBe(2);
  });

  it('ONE_WAY builds Base→Pickup→Dest→Base', () => {
    const segs = buildPositioningSegments({
      tripType: 'ONE_WAY',
      startIata: 'SGN',
      homeIata: 'SGN',
      pickupIata: 'HAN',
      destIata: 'DAD',
    });
    expect(segs.map((s) => `${s.type}:${s.fromIata}-${s.toIata}`)).toEqual([
      'POSITIONING:SGN-HAN',
      'REVENUE:HAN-DAD',
      'REPOSITION:DAD-SGN',
    ]);
  });

  it('ROUND_TRIP adds RETURN then REPOSITION', () => {
    const segs = buildPositioningSegments({
      tripType: 'ROUND_TRIP',
      startIata: 'SGN',
      homeIata: 'SGN',
      pickupIata: 'HAN',
      destIata: 'DAD',
    });
    expect(segs.map((s) => `${s.type}:${s.fromIata}-${s.toIata}`)).toEqual([
      'POSITIONING:SGN-HAN',
      'REVENUE:HAN-DAD',
      'RETURN:DAD-HAN',
      'REPOSITION:HAN-SGN',
    ]);
  });

  it('skips positioning when already at pickup', () => {
    const segs = buildPositioningSegments({
      tripType: 'ONE_WAY',
      startIata: 'HAN',
      homeIata: 'SGN',
      pickupIata: 'HAN',
      destIata: 'DAD',
    });
    expect(segs[0]).toMatchObject({ type: 'REVENUE', fromIata: 'HAN', toIata: 'DAD' });
    expect(segs[segs.length - 1]).toMatchObject({
      type: 'REPOSITION',
      fromIata: 'DAD',
      toIata: 'SGN',
    });
  });
});
