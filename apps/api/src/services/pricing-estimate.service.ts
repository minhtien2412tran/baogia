import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { PricingEstimateDto } from '../dto';

const ESTIMATE_DISCLAIMER =
  'Displayed price is an estimate based on available information. The official price will be confirmed after the operator reviews aircraft status, schedule, and related fees.';

/** CR Wave 2: RETURN legs are intentionally NOT auto-added until KH confirms pricing rules. */

function haversineKm(
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

@Injectable()
export class PricingEstimateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async estimate(body: PricingEstimateDto, opts?: { isAdmin?: boolean }) {
    const pickupIata = body.pickupAirport.toUpperCase().trim();
    const dropoffIata = body.dropoffAirport.toUpperCase().trim();
    if (pickupIata === dropoffIata) {
      throw new BadRequestException('Pickup and dropoff airports must differ');
    }

    const pickup = await this.prisma.airport.findUnique({ where: { iata: pickupIata } });
    const dropoff = await this.prisma.airport.findUnique({ where: { iata: dropoffIata } });
    if (!pickup || !dropoff) throw new BadRequestException('Invalid airport IATA');

    const departureAt = new Date(body.departureAt);
    if (Number.isNaN(departureAt.getTime())) {
      throw new BadRequestException('Invalid departureAt');
    }

    let aircraft = body.aircraftId
      ? await this.prisma.aircraft.findUnique({
          where: { id: body.aircraftId },
          include: {
            aircraftModel: { include: { category: true } },
            currentAirport: true,
          },
        })
      : null;

    if (body.aircraftId && !aircraft) {
      throw new NotFoundException(`Aircraft #${body.aircraftId} not found`);
    }

    if (!aircraft) {
      // Prefer AVAILABLE at pickup; else any AVAILABLE (nearest by haversine if coords exist)
      const atPickup = await this.prisma.aircraft.findFirst({
        where: { currentAirportId: pickup.id, availabilityStatus: 'AVAILABLE' },
        include: {
          aircraftModel: { include: { category: true } },
          currentAirport: true,
        },
      });
      if (atPickup) {
        aircraft = atPickup;
      } else {
        const available = await this.prisma.aircraft.findMany({
          where: { availabilityStatus: 'AVAILABLE' },
          include: {
            aircraftModel: { include: { category: true } },
            currentAirport: true,
          },
        });
        if (!available.length) {
          throw new BadRequestException('No AVAILABLE fleet aircraft to estimate');
        }
        aircraft = this.pickNearest(available, pickup) ?? available[0];
      }
    }

    if (aircraft.aircraftModel.category.maxPassengers < body.passengers) {
      throw new BadRequestException(
        `Selected aircraft max passengers is ${aircraft.aircraftModel.category.maxPassengers}`,
      );
    }

    const speedKmh = aircraft.aircraftModel.speedKmh ?? 750;
    const hourlyRate = Number(aircraft.hourlyRate);
    const minHours = Number(aircraft.minimumBillableHours);
    const currency = aircraft.hourlyRateCurrency;

    type LegDraft = {
      legType: 'POSITIONING' | 'PASSENGER';
      fromAirportId: number;
      toAirportId: number;
      fromIata: string;
      toIata: string;
      departureAt: Date;
      arrivalAt: Date;
      estimatedFlightMinutes: number;
      distanceKm: number;
      hasPassengers: boolean;
      passengerCount: number;
      hourlyRateApplied: number;
      estimatedCost: number;
    };

    const legs: LegDraft[] = [];
    let cursor = departureAt;
    const needsPositioning = aircraft.currentAirportId !== pickup.id;

    if (needsPositioning) {
      const from = aircraft.currentAirport;
      const dist = this.distanceKm(from, pickup);
      const minutes = Math.max(30, Math.round((dist / speedKmh) * 60));
      const arrival = new Date(cursor.getTime() + minutes * 60_000);
      const hours = minutes / 60;
      legs.push({
        legType: 'POSITIONING',
        fromAirportId: from.id,
        toAirportId: pickup.id,
        fromIata: from.iata,
        toIata: pickup.iata,
        departureAt: cursor,
        arrivalAt: arrival,
        estimatedFlightMinutes: minutes,
        distanceKm: Math.round(dist * 10) / 10,
        hasPassengers: false,
        passengerCount: 0,
        hourlyRateApplied: hourlyRate,
        estimatedCost: Math.round(hours * hourlyRate * 100) / 100,
      });
      cursor = arrival;
    }

    {
      const dist = this.distanceKm(pickup, dropoff);
      const minutes = Math.max(30, Math.round((dist / speedKmh) * 60));
      const arrival = new Date(cursor.getTime() + minutes * 60_000);
      const hours = minutes / 60;
      legs.push({
        legType: 'PASSENGER',
        fromAirportId: pickup.id,
        toAirportId: dropoff.id,
        fromIata: pickup.iata,
        toIata: dropoff.iata,
        departureAt: cursor,
        arrivalAt: arrival,
        estimatedFlightMinutes: minutes,
        distanceKm: Math.round(dist * 10) / 10,
        hasPassengers: true,
        passengerCount: body.passengers,
        hourlyRateApplied: hourlyRate,
        estimatedCost: Math.round(hours * hourlyRate * 100) / 100,
      });
    }

    const rawFlightHours = legs.reduce((s, l) => s + l.estimatedFlightMinutes / 60, 0);
    const billableHours = Math.max(rawFlightHours, minHours);
    // Scale last leg cost if minimum billable hours applies
    const flightCostUncapped = legs.reduce((s, l) => s + l.estimatedCost, 0);
    const flightCost =
      billableHours > rawFlightHours
        ? Math.round(billableHours * hourlyRate * 100) / 100
        : Math.round(flightCostUncapped * 100) / 100;

    const airportFees =
      this.feeSum(pickup) + this.feeSum(dropoff) + (needsPositioning ? this.feeSum(aircraft.currentAirport) : 0);

    const estimatedCost = Math.round((flightCost + airportFees) * 100) / 100;
    // Customer-facing estimated price = cost for Wave 1 (margin TBD with KH)
    const estimatedPrice = estimatedCost;

    const publicLegs = legs.map((l) => ({
      legType: l.legType,
      fromAirport: l.fromIata,
      toAirport: l.toIata,
      departureAt: l.departureAt.toISOString(),
      arrivalAt: l.arrivalAt.toISOString(),
      estimatedFlightMinutes: l.estimatedFlightMinutes,
      distanceKm: l.distanceKm,
      hasPassengers: l.hasPassengers,
      passengerCount: l.passengerCount,
      ...(opts?.isAdmin || body.includeInternalBreakdown
        ? { estimatedCost: l.estimatedCost, hourlyRateApplied: l.hourlyRateApplied }
        : {}),
    }));

    if (body.quoteRequestId) {
      const qr = await this.prisma.quoteRequest.findUnique({ where: { id: body.quoteRequestId } });
      if (!qr) throw new NotFoundException(`QuoteRequest #${body.quoteRequestId} not found`);
      await this.prisma.flightLeg.deleteMany({ where: { quoteRequestId: body.quoteRequestId } });
      await this.prisma.flightLeg.createMany({
        data: legs.map((l) => ({
          quoteRequestId: body.quoteRequestId,
          aircraftId: aircraft!.id,
          fromAirportId: l.fromAirportId,
          toAirportId: l.toAirportId,
          legType: l.legType,
          departureAt: l.departureAt,
          arrivalAt: l.arrivalAt,
          estimatedFlightMinutes: l.estimatedFlightMinutes,
          distanceKm: l.distanceKm,
          hasPassengers: l.hasPassengers,
          passengerCount: l.passengerCount,
          hourlyRateApplied: l.hourlyRateApplied,
          estimatedCost: l.estimatedCost,
          status: 'PLANNED',
        })),
      });
    }

    if (body.bookingId) {
      const bk = await this.prisma.booking.findUnique({ where: { id: body.bookingId } });
      if (!bk) throw new NotFoundException(`Booking #${body.bookingId} not found`);
      await this.prisma.flightLeg.deleteMany({ where: { bookingId: body.bookingId } });
      await this.prisma.flightLeg.createMany({
        data: legs.map((l) => ({
          bookingId: body.bookingId,
          aircraftId: aircraft!.id,
          fromAirportId: l.fromAirportId,
          toAirportId: l.toAirportId,
          legType: l.legType,
          departureAt: l.departureAt,
          arrivalAt: l.arrivalAt,
          estimatedFlightMinutes: l.estimatedFlightMinutes,
          distanceKm: l.distanceKm,
          hasPassengers: l.hasPassengers,
          passengerCount: l.passengerCount,
          hourlyRateApplied: l.hourlyRateApplied,
          estimatedCost: l.estimatedCost,
          status: 'PLANNED',
        })),
      });
      await this.prisma.booking.update({
        where: { id: body.bookingId },
        data: {
          estimatedCost,
          estimatedPrice,
          currency,
          selectedAircraftId: aircraft.id,
          pricingStatus: 'ESTIMATED',
        },
      });
    }

    await this.audit.log('PRICING_ESTIMATE', {
      pickup: pickupIata,
      dropoff: dropoffIata,
      aircraftId: aircraft.id,
      estimatedPrice,
      positioning: needsPositioning,
    });

    return {
      estimatedPrice,
      estimatedCost: opts?.isAdmin || body.includeInternalBreakdown ? estimatedCost : undefined,
      currency,
      pricingStatus: 'ESTIMATED',
      disclaimer: ESTIMATE_DISCLAIMER,
      billableHours: Math.round(billableHours * 100) / 100,
      rawFlightHours: Math.round(rawFlightHours * 100) / 100,
      minimumBillableHours: minHours,
      positioningRequired: needsPositioning,
      customerItinerary: {
        summary: `${pickup.city} → ${dropoff.city}`,
        pickupAirport: pickupIata,
        dropoffAirport: dropoffIata,
      },
      aircraft: {
        id: aircraft.id,
        registration: aircraft.registration,
        model: `${aircraft.aircraftModel.manufacturer} ${aircraft.aircraftModel.model}`,
        currentAirport: aircraft.currentAirport.iata,
        hourlyRate: opts?.isAdmin || body.includeInternalBreakdown ? hourlyRate : undefined,
      },
      legs: publicLegs,
      ...(opts?.isAdmin || body.includeInternalBreakdown
        ? {
            internalBreakdown: {
              flightCost,
              airportFees,
              notes: 'RETURN/repositioning not included until KH confirms pricing rules',
            },
          }
        : {}),
    };
  }

  async listBookingLegs(bookingId: number, includeInternal = false) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException(`Booking #${bookingId} not found`);
    const legs = await this.prisma.flightLeg.findMany({
      where: { bookingId },
      include: { fromAirport: true, toAirport: true, aircraft: true },
      orderBy: { departureAt: 'asc' },
    });
    return {
      bookingId,
      estimatedPrice: booking.estimatedPrice != null ? Number(booking.estimatedPrice) : null,
      currency: booking.currency,
      pricingStatus: booking.pricingStatus,
      disclaimer: ESTIMATE_DISCLAIMER,
      legs: legs.map((l) => ({
        id: l.id,
        legType: l.legType,
        fromAirport: l.fromAirport.iata,
        toAirport: l.toAirport.iata,
        departureAt: l.departureAt.toISOString(),
        arrivalAt: l.arrivalAt?.toISOString() ?? null,
        estimatedFlightMinutes: l.estimatedFlightMinutes,
        distanceKm: l.distanceKm != null ? Number(l.distanceKm) : null,
        hasPassengers: l.hasPassengers,
        passengerCount: l.passengerCount,
        status: l.status,
        ...(includeInternal
          ? {
              estimatedCost: l.estimatedCost != null ? Number(l.estimatedCost) : null,
              hourlyRateApplied: l.hourlyRateApplied != null ? Number(l.hourlyRateApplied) : null,
            }
          : {}),
      })),
    };
  }

  private feeSum(a: {
    landingFee: { toNumber?: () => number } | number | null;
    parkingFee: { toNumber?: () => number } | number | null;
    handlingFee: { toNumber?: () => number } | number | null;
  }) {
    const n = (v: typeof a.landingFee) =>
      v == null ? 0 : typeof v === 'number' ? v : Number(v);
    return n(a.landingFee) + n(a.parkingFee) + n(a.handlingFee);
  }

  private distanceKm(
    from: { latitude: { toNumber?: () => number } | number | null; longitude: { toNumber?: () => number } | number | null; iata: string },
    to: { latitude: { toNumber?: () => number } | number | null; longitude: { toNumber?: () => number } | number | null; iata: string },
  ): number {
    const lat1 = from.latitude == null ? null : Number(from.latitude);
    const lon1 = from.longitude == null ? null : Number(from.longitude);
    const lat2 = to.latitude == null ? null : Number(to.latitude);
    const lon2 = to.longitude == null ? null : Number(to.longitude);
    if (lat1 != null && lon1 != null && lat2 != null && lon2 != null) {
      return haversineKm(lat1, lon1, lat2, lon2);
    }
    // Fallback fixed distances for known demo pairs
    const key = `${from.iata}-${to.iata}`;
    const known: Record<string, number> = {
      'CAN-HAN': 1280,
      'HAN-CAN': 1280,
      'HAN-SGN': 1160,
      'SGN-HAN': 1160,
      'CAN-SGN': 1350,
    };
    return known[key] ?? 800;
  }

  private pickNearest<
    T extends {
      currentAirport: {
        latitude: { toNumber?: () => number } | number | null;
        longitude: { toNumber?: () => number } | number | null;
        iata: string;
      };
    },
  >(list: T[], pickup: { latitude: unknown; longitude: unknown; iata: string }): T | null {
    const plat = pickup.latitude == null ? null : Number(pickup.latitude);
    const plon = pickup.longitude == null ? null : Number(pickup.longitude);
    if (plat == null || plon == null) return list[0] ?? null;
    let best: T | null = null;
    let bestDist = Infinity;
    for (const ac of list) {
      const d = this.distanceKm(ac.currentAirport, pickup as { latitude: number; longitude: number; iata: string });
      if (d < bestDist) {
        bestDist = d;
        best = ac;
      }
    }
    return best;
  }
}
