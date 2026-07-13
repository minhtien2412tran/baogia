import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildPositioningSegments,
  flightHours,
  haversineKm,
  type FlightSegmentPlan,
  type SegmentType,
} from '../utils/geo';

export type PricingSegment = {
  type: SegmentType;
  from: string;
  to: string;
  km: number;
  hours: number;
  cost: number;
  landingFee: number;
};

export type PricedFleetOption = {
  operatorAircraftId: number;
  tailNumber: string;
  operatorId: number;
  operatorName: string;
  contractCode: string;
  hourlyRate: number;
  categoryId: number;
  categoryCode: string;
  categoryLabel: string;
  maxPassengers: number;
  aircraftModel: string;
  aircraftModelId: number;
  baseAirport: string;
  currentAirport: string;
  estimatedPrice: number;
  currency: string;
  pricingBreakdown: {
    segments: PricingSegment[];
    flightCost: number;
    airportFees: number;
    total: number;
  };
};

@Injectable()
export class PositioningPriceService {
  constructor(private readonly prisma: PrismaService) {}

  async searchPricedOptions(input: {
    tripType: string;
    legs: Array<{ fromAirport: string; toAirport: string; passengers?: number }>;
    currency?: string;
  }): Promise<PricedFleetOption[]> {
    if (!input.legs?.length) return [];

    const currency = input.currency ?? 'USD';
    const maxPax = Math.max(...input.legs.map((l) => l.passengers ?? 1));
    const pickupIata = input.legs[0].fromAirport.toUpperCase();
    const destIata = input.legs[0].toAirport.toUpperCase();
    const extraRevenueLegs =
      input.tripType === 'MULTI_CITY' && input.legs.length > 1
        ? input.legs.slice(1).map((l) => ({
            from: l.fromAirport.toUpperCase(),
            to: l.toAirport.toUpperCase(),
          }))
        : [];

    const iatas = new Set<string>([pickupIata, destIata]);
    for (const l of extraRevenueLegs) {
      iatas.add(l.from);
      iatas.add(l.to);
    }

    const fleet = await this.prisma.operatorAircraft.findMany({
      where: {
        status: 'ACTIVE',
        contracts: { some: { status: 'ACTIVE' } },
        aircraftModel: { category: { maxPassengers: { gte: maxPax } } },
      },
      include: {
        operator: true,
        aircraftModel: { include: { category: true } },
        baseAirport: true,
        currentAirport: true,
        contracts: {
          where: { status: 'ACTIVE' },
          orderBy: { validFrom: 'desc' },
          take: 1,
        },
      },
      take: 40,
    });

    for (const ac of fleet) {
      iatas.add(ac.baseAirport.iata);
      iatas.add(ac.currentAirport.iata);
    }

    const airports = await this.prisma.airport.findMany({
      where: { iata: { in: [...iatas] }, status: 'ACTIVE' },
    });
    const byIata = new Map(airports.map((a) => [a.iata, a]));

    const pickup = byIata.get(pickupIata);
    const dest = byIata.get(destIata);
    if (!pickup || !dest) return [];

    const options: PricedFleetOption[] = [];

    for (const ac of fleet) {
      const contract = ac.contracts[0];
      if (!contract) continue;
      if (ac.operator.status !== 'ACTIVE') continue;

      const start = ac.currentAirport.lat != null ? ac.currentAirport : ac.baseAirport;
      if (start.lat == null || start.lng == null) continue;
      if (ac.baseAirport.lat == null || ac.baseAirport.lng == null) continue;

      const speed = ac.aircraftModel.speedKmh ?? 800;
      const rangeKm = ac.aircraftModel.rangeKm;
      const hourlyRate = Number(contract.hourlyRate);
      const minHours = contract.minHours != null ? Number(contract.minHours) : 0.5;

      const plan = buildPositioningSegments({
        tripType: input.tripType,
        startIata: start.iata,
        homeIata: ac.baseAirport.iata,
        pickupIata,
        destIata,
        extraRevenueLegs,
      });

      let skip = false;
      const segments: PricingSegment[] = [];
      let flightCost = 0;
      let airportFees = 0;

      for (const seg of plan) {
        const from = byIata.get(seg.fromIata);
        const to = byIata.get(seg.toIata);
        if (!from?.lat || !from.lng || !to?.lat || !to.lng) {
          skip = true;
          break;
        }
        const km = haversineKm(from.lat, from.lng, to.lat, to.lng);
        if (rangeKm != null && km > rangeKm) {
          skip = true;
          break;
        }
        const hours = flightHours(km, speed, minHours);
        const cost = Math.round(hours * hourlyRate);
        const landingFee =
          seg.type === 'POSITIONING' ? 0 : Number(to.landingFee ?? 0);
        flightCost += cost;
        airportFees += landingFee;
        segments.push({
          type: seg.type,
          from: seg.fromIata,
          to: seg.toIata,
          km: Math.round(km),
          hours: Math.round(hours * 100) / 100,
          cost,
          landingFee,
        });
      }

      if (skip || segments.length === 0) continue;

      const total = flightCost + airportFees;
      options.push({
        operatorAircraftId: ac.id,
        tailNumber: ac.tailNumber,
        operatorId: ac.operatorId,
        operatorName: ac.operator.name,
        contractCode: contract.code,
        hourlyRate,
        categoryId: ac.aircraftModel.categoryId,
        categoryCode: ac.aircraftModel.category.code,
        categoryLabel: ac.aircraftModel.category.label,
        maxPassengers: ac.aircraftModel.category.maxPassengers,
        aircraftModel: `${ac.aircraftModel.manufacturer} ${ac.aircraftModel.model}`,
        aircraftModelId: ac.aircraftModelId,
        baseAirport: ac.baseAirport.iata,
        currentAirport: ac.currentAirport.iata,
        estimatedPrice: total,
        currency,
        pricingBreakdown: {
          segments,
          flightCost,
          airportFees,
          total,
        },
      });
    }

    // Best price per category (demo: one card per category)
    const byCategory = new Map<string, PricedFleetOption>();
    for (const opt of options.sort((a, b) => a.estimatedPrice - b.estimatedPrice)) {
      if (!byCategory.has(opt.categoryCode)) {
        byCategory.set(opt.categoryCode, opt);
      }
    }

    return [...byCategory.values()].sort((a, b) => a.estimatedPrice - b.estimatedPrice);
  }

  /** Expose segment planner for unit tests without DB */
  buildSegments(plan: Parameters<typeof buildPositioningSegments>[0]): FlightSegmentPlan[] {
    return buildPositioningSegments(plan);
  }
}
