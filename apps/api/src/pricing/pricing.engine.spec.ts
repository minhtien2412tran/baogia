import {
  applyMinimumBillableHours,
  estimateFlightMinutes,
  haversineKm,
  minutesToHours,
} from './flight-math';
import {
  AircraftRateInput,
  AirportGeoFees,
  buildPricingEstimate,
  freezePricingSnapshot,
} from './pricing.engine';

function airport(
  partial: Partial<AirportGeoFees> &
    Pick<AirportGeoFees, 'id' | 'iata' | 'city'>,
): AirportGeoFees {
  return {
    latitude: null,
    longitude: null,
    landingFee: 0,
    parkingFee: 0,
    overnightFee: 0,
    handlingFee: 0,
    feeCurrency: 'USD',
    canParkAircraft: true,
    ...partial,
  };
}

describe('flight-math', () => {
  it('computes haversine roughly CAN–HAN (~800–1400 km)', () => {
    // Guangzhou Baiyun ~23.39, 113.30 · Noi Bai ~21.22, 105.80
    const km = haversineKm(23.3924, 113.2988, 21.2212, 105.8072);
    expect(km).toBeGreaterThan(700);
    expect(km).toBeLessThan(1500);
  });

  it('applies minimum billable hours', () => {
    expect(applyMinimumBillableHours(0.5, 2)).toBe(2);
    expect(applyMinimumBillableHours(3, 2)).toBe(3);
  });

  it('estimates minutes from distance', () => {
    expect(estimateFlightMinutes(750, 750)).toBe(60);
    expect(minutesToHours(90)).toBe(1.5);
  });
});

describe('pricing engine CAN→HAN→SGN', () => {
  const can = airport({
    id: 1,
    iata: 'CAN',
    city: 'Guangzhou',
    latitude: 23.3924,
    longitude: 113.2988,
    landingFee: 500,
    handlingFee: 200,
    parkingFee: 100,
  });
  const han = airport({
    id: 2,
    iata: 'HAN',
    city: 'Hanoi',
    latitude: 21.2212,
    longitude: 105.8072,
    landingFee: 400,
    handlingFee: 150,
    parkingFee: 80,
  });
  const sgn = airport({
    id: 3,
    iata: 'SGN',
    city: 'Ho Chi Minh City',
    latitude: 10.8188,
    longitude: 106.652,
    landingFee: 450,
    handlingFee: 180,
    parkingFee: 90,
  });

  const map = new Map<number, AirportGeoFees>([
    [can.id, can],
    [han.id, han],
    [sgn.id, sgn],
  ]);

  const aircraftAtCan: AircraftRateInput = {
    id: 10,
    registration: 'B-JBAY1',
    currentAirportId: can.id,
    hourlyRate: 8500,
    hourlyRateCurrency: 'USD',
    minimumBillableHours: 2,
    cruiseSpeedKmh: 900,
  };

  it('adds POSITIONING CAN→HAN then PASSENGER HAN→SGN; customer sees HAN→SGN', () => {
    const estimate = buildPricingEstimate({
      aircraft: aircraftAtCan,
      airportsById: map,
      passengerRoute: {
        fromAirportId: han.id,
        toAirportId: sgn.id,
        passengerCount: 4,
      },
    });

    expect(estimate.customerRouteSummary).toBe('HAN → SGN');
    expect(estimate.positioningRequired).toBe(true);
    expect(estimate.legs).toHaveLength(2);
    expect(estimate.legs[0].legType).toBe('POSITIONING');
    expect(estimate.legs[0].fromIata).toBe('CAN');
    expect(estimate.legs[0].toIata).toBe('HAN');
    expect(estimate.legs[0].hasPassengers).toBe(false);
    expect(estimate.legs[1].legType).toBe('PASSENGER');
    expect(estimate.legs[1].fromIata).toBe('HAN');
    expect(estimate.legs[1].toIata).toBe('SGN');
    expect(estimate.estimatedTotal).toBeGreaterThan(0);
    expect(estimate.disclaimer).toMatch(/Giá ước tính/);
    // min 2h per leg → at least 4 billable hours
    expect(estimate.billableHours).toBeGreaterThanOrEqual(4);
  });

  it('skips positioning when aircraft already at HAN', () => {
    const estimate = buildPricingEstimate({
      aircraft: { ...aircraftAtCan, currentAirportId: han.id },
      airportsById: map,
      passengerRoute: { fromAirportId: han.id, toAirportId: sgn.id },
    });
    expect(estimate.positioningRequired).toBe(false);
    expect(estimate.legs).toHaveLength(1);
    expect(estimate.legs[0].legType).toBe('PASSENGER');
  });

  it('skips overnight parking fees when airport cannot park aircraft', () => {
    const noParkSgn = airport({
      id: 3,
      iata: 'SGN',
      city: 'Ho Chi Minh City',
      latitude: 10.8188,
      longitude: 106.652,
      landingFee: 450,
      handlingFee: 180,
      parkingFee: 90,
      overnightFee: 200,
      canParkAircraft: false,
    });
    const map2 = new Map<number, AirportGeoFees>([
      [can.id, can],
      [han.id, han],
      [noParkSgn.id, noParkSgn],
    ]);
    const withPark = buildPricingEstimate({
      aircraft: { ...aircraftAtCan, currentAirportId: han.id },
      airportsById: map,
      passengerRoute: { fromAirportId: han.id, toAirportId: sgn.id },
    });
    const withoutPark = buildPricingEstimate({
      aircraft: { ...aircraftAtCan, currentAirportId: han.id },
      airportsById: map2,
      passengerRoute: { fromAirportId: han.id, toAirportId: noParkSgn.id },
    });
    expect(withoutPark.parkingFeesTotal).toBe(0);
    expect(withPark.parkingFeesTotal).toBeGreaterThan(0);
  });

  it('freezes snapshot immutably (deep clone)', () => {
    const estimate = buildPricingEstimate({
      aircraft: aircraftAtCan,
      airportsById: map,
      passengerRoute: { fromAirportId: han.id, toAirportId: sgn.id },
    });
    const frozen = freezePricingSnapshot(estimate);
    frozen.estimatedTotal = 1;
    frozen.legs[0].billableHours = 0;
    expect(estimate.estimatedTotal).not.toBe(1);
    expect(estimate.legs[0].billableHours).not.toBe(0);
  });
});
