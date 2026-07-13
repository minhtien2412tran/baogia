import {
  applyMinimumBillableHours,
  estimateFlightMinutes,
  haversineKm,
  minutesToHours,
  roundMoney,
} from './flight-math';

export const PRICING_FORMULA_VERSION = 'v1';

export type LegType = 'POSITIONING' | 'PASSENGER' | 'RETURN' | 'REPOSITIONING' | 'EMPTY_LEG';

export interface AirportGeoFees {
  id: number;
  iata: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  landingFee: number;
  parkingFee: number;
  overnightFee: number;
  handlingFee: number;
  feeCurrency: string;
  /** If false, overnight/parking overnight is not charged (cannot park). */
  canParkAircraft: boolean;
}

export interface AircraftRateInput {
  id: number;
  registration: string;
  currentAirportId: number | null;
  hourlyRate: number;
  hourlyRateCurrency: string;
  minimumBillableHours: number;
  cruiseSpeedKmh: number;
}

export interface PassengerRouteInput {
  fromAirportId: number;
  toAirportId: number;
  passengerCount?: number;
  departureAt?: string | null;
}

export interface PlannedLeg {
  legType: LegType;
  sequence: number;
  fromAirportId: number;
  toAirportId: number;
  fromIata: string;
  toIata: string;
  hasPassengers: boolean;
  passengerCount: number;
  estimatedDistanceKm: number;
  estimatedFlightMinutes: number;
  rawFlightHours: number;
  billableHours: number;
  hourlyRateSnapshot: number;
  currency: string;
  estimatedBaseCost: number;
  airportFees: number;
  handlingFees: number;
  parkingFees: number;
  crewFees: number;
  otherFees: number;
  estimatedTotalCost: number;
}

export interface PricingBreakdown {
  formulaVersion: string;
  currency: string;
  aircraftId: number;
  registration: string;
  customerRouteSummary: string;
  operationalRouteSummary: string;
  positioningRequired: boolean;
  billableHours: number;
  hourlyRateSnapshot: number;
  flightHourCost: number;
  airportFeesTotal: number;
  handlingFeesTotal: number;
  parkingFeesTotal: number;
  crewFeesTotal: number;
  otherFeesTotal: number;
  taxesTotal: number;
  markupTotal: number;
  estimatedTotal: number;
  disclaimer: string;
  legs: PlannedLeg[];
}

function feeNum(v: number | null | undefined): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function distanceBetween(a: AirportGeoFees, b: AirportGeoFees): number {
  if (
    a.latitude == null ||
    a.longitude == null ||
    b.latitude == null ||
    b.longitude == null
  ) {
    // Fallback when coords missing: treat as 800 km (≈1.1h at 750 km/h)
    return 800;
  }
  return haversineKm(a.latitude, a.longitude, b.latitude, b.longitude);
}

function destinationFees(to: AirportGeoFees): {
  airportFees: number;
  handlingFees: number;
  parkingFees: number;
} {
  const parking = to.canParkAircraft
    ? feeNum(to.parkingFee) + feeNum(to.overnightFee)
    : 0;
  return {
    airportFees: feeNum(to.landingFee),
    handlingFees: feeNum(to.handlingFee),
    parkingFees: parking,
  };
}

function buildLeg(params: {
  legType: LegType;
  sequence: number;
  from: AirportGeoFees;
  to: AirportGeoFees;
  aircraft: AircraftRateInput;
  hasPassengers: boolean;
  passengerCount: number;
}): PlannedLeg {
  const distanceKm = roundMoney(distanceBetween(params.from, params.to));
  const minutes = estimateFlightMinutes(distanceKm, params.aircraft.cruiseSpeedKmh);
  const rawHours = minutesToHours(minutes);
  const billableHours = applyMinimumBillableHours(
    rawHours,
    params.aircraft.minimumBillableHours,
  );
  const rate = params.aircraft.hourlyRate;
  const currency = params.aircraft.hourlyRateCurrency || 'USD';
  const estimatedBaseCost = roundMoney(billableHours * rate);
  const fees = destinationFees(params.to);
  const estimatedTotalCost = roundMoney(
    estimatedBaseCost + fees.airportFees + fees.handlingFees + fees.parkingFees,
  );

  return {
    legType: params.legType,
    sequence: params.sequence,
    fromAirportId: params.from.id,
    toAirportId: params.to.id,
    fromIata: params.from.iata,
    toIata: params.to.iata,
    hasPassengers: params.hasPassengers,
    passengerCount: params.passengerCount,
    estimatedDistanceKm: distanceKm,
    estimatedFlightMinutes: minutes,
    rawFlightHours: rawHours,
    billableHours,
    hourlyRateSnapshot: rate,
    currency,
    estimatedBaseCost,
    airportFees: fees.airportFees,
    handlingFees: fees.handlingFees,
    parkingFees: fees.parkingFees,
    crewFees: 0,
    otherFees: 0,
    estimatedTotalCost,
  };
}

/**
 * Pure pricing engine: builds operational legs (positioning + passenger) and totals.
 * Snapshot is immutable once persisted by PricingService.
 */
export function buildPricingEstimate(input: {
  aircraft: AircraftRateInput;
  airportsById: Map<number, AirportGeoFees>;
  passengerRoute: PassengerRouteInput;
}): PricingBreakdown {
  const { aircraft, airportsById, passengerRoute } = input;
  const from = airportsById.get(passengerRoute.fromAirportId);
  const to = airportsById.get(passengerRoute.toAirportId);
  if (!from || !to) {
    throw new Error('Passenger route airports not found in pricing input');
  }

  const legs: PlannedLeg[] = [];
  let sequence = 0;
  let positioningRequired = false;

  const currentId = aircraft.currentAirportId;
  if (currentId != null && currentId !== from.id) {
    const current = airportsById.get(currentId);
    if (!current) {
      throw new Error('Aircraft current airport not found in pricing input');
    }
    positioningRequired = true;
    legs.push(
      buildLeg({
        legType: 'POSITIONING',
        sequence: sequence++,
        from: current,
        to: from,
        aircraft,
        hasPassengers: false,
        passengerCount: 0,
      }),
    );
  }

  legs.push(
    buildLeg({
      legType: 'PASSENGER',
      sequence: sequence++,
      from,
      to,
      aircraft,
      hasPassengers: true,
      passengerCount: passengerRoute.passengerCount ?? 1,
    }),
  );

  const billableHours = roundMoney(legs.reduce((s, l) => s + l.billableHours, 0));
  const flightHourCost = roundMoney(legs.reduce((s, l) => s + l.estimatedBaseCost, 0));
  const airportFeesTotal = roundMoney(legs.reduce((s, l) => s + l.airportFees, 0));
  const handlingFeesTotal = roundMoney(legs.reduce((s, l) => s + l.handlingFees, 0));
  const parkingFeesTotal = roundMoney(legs.reduce((s, l) => s + l.parkingFees, 0));
  const estimatedTotal = roundMoney(
    flightHourCost + airportFeesTotal + handlingFeesTotal + parkingFeesTotal,
  );

  const customerRouteSummary = `${from.iata} → ${to.iata}`;
  const operationalRouteSummary = legs.map((l) => `${l.fromIata}→${l.toIata}`).join(' · ');

  return {
    formulaVersion: PRICING_FORMULA_VERSION,
    currency: aircraft.hourlyRateCurrency || 'USD',
    aircraftId: aircraft.id,
    registration: aircraft.registration,
    customerRouteSummary,
    operationalRouteSummary,
    positioningRequired,
    billableHours,
    hourlyRateSnapshot: aircraft.hourlyRate,
    flightHourCost,
    airportFeesTotal,
    handlingFeesTotal,
    parkingFeesTotal,
    crewFeesTotal: 0,
    otherFeesTotal: 0,
    taxesTotal: 0,
    markupTotal: 0,
    estimatedTotal,
    disclaimer:
      'Giá ước tính — chưa bao gồm thuế/phí phát sinh thực tế; không phải báo giá chốt.',
    legs,
  };
}

/** Freeze snapshot for DB — JSON-serializable deep copy. */
export function freezePricingSnapshot(breakdown: PricingBreakdown): PricingBreakdown {
  return JSON.parse(JSON.stringify(breakdown)) as PricingBreakdown;
}
