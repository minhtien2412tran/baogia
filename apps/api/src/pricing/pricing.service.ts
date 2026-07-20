import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../services/audit.service';
import {
  AirportGeoFees,
  AircraftRateInput,
  PricingBreakdown,
  buildPricingEstimate,
  freezePricingSnapshot,
} from './pricing.engine';

function dec(v: Prisma.Decimal | number | null | undefined): number {
  if (v == null) return 0;
  return typeof v === 'number' ? v : Number(v);
}

@Injectable()
export class PricingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private async assertBookingOwner(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: { userId: true },
    });
    if (!booking) throw new NotFoundException(`Booking ${bookingId} not found`);
    if (booking.userId !== userId) {
      throw new ForbiddenException('You do not own this booking');
    }
    return booking;
  }

  private toAirportFees(a: {
    id: number;
    iata: string;
    city: string;
    latitude: Prisma.Decimal | null;
    longitude: Prisma.Decimal | null;
    landingFee: Prisma.Decimal | null;
    parkingFee: Prisma.Decimal | null;
    overnightFee: Prisma.Decimal | null;
    handlingFee: Prisma.Decimal | null;
    feeCurrency: string | null;
    canParkAircraft: boolean;
  }): AirportGeoFees {
    return {
      id: a.id,
      iata: a.iata,
      city: a.city,
      latitude: a.latitude == null ? null : Number(a.latitude),
      longitude: a.longitude == null ? null : Number(a.longitude),
      landingFee: dec(a.landingFee),
      parkingFee: dec(a.parkingFee),
      overnightFee: dec(a.overnightFee),
      handlingFee: dec(a.handlingFee),
      feeCurrency: a.feeCurrency ?? 'USD',
      canParkAircraft: a.canParkAircraft !== false,
    };
  }

  private toAircraftRate(aircraft: {
    id: number;
    registration: string;
    currentAirportId: number | null;
    baseAirportId: number | null;
    hourlyRate: Prisma.Decimal | null;
    hourlyRateCurrency: string;
    minimumBillableHours: Prisma.Decimal;
    aircraftModel: { speedKmh: number | null };
  }): AircraftRateInput {
    const hourly = dec(aircraft.hourlyRate);
    if (hourly <= 0) {
      throw new BadRequestException('Aircraft hourly rate is not configured');
    }
    return {
      id: aircraft.id,
      registration: aircraft.registration,
      currentAirportId: aircraft.currentAirportId,
      baseAirportId: aircraft.baseAirportId,
      hourlyRate: hourly,
      hourlyRateCurrency: aircraft.hourlyRateCurrency || 'USD',
      minimumBillableHours: dec(aircraft.minimumBillableHours) || 1,
      cruiseSpeedKmh: aircraft.aircraftModel.speedKmh || 750,
    };
  }

  async estimate(params: {
    aircraftId: number;
    fromAirportId: number;
    toAirportId: number;
    passengerCount?: number;
    departureAt?: string;
    bookingId?: number;
    quoteRequestId?: number;
    persist?: boolean;
    userId?: number;
    tripType?: string;
  }): Promise<{
    estimate: PricingBreakdown;
    estimateId?: number;
    label: string;
  }> {
    if (params.fromAirportId === params.toAirportId) {
      throw new BadRequestException('From and to airports must differ');
    }
    if (params.bookingId) {
      if (!params.userId) {
        throw new ForbiddenException('Authenticated user required');
      }
      await this.assertBookingOwner(params.bookingId, params.userId);
    }

    const aircraft = await this.prisma.aircraft.findUnique({
      where: { id: params.aircraftId },
      include: { aircraftModel: true },
    });
    if (!aircraft)
      throw new NotFoundException(`Aircraft ${params.aircraftId} not found`);

    const airportIds = new Set<number>([
      params.fromAirportId,
      params.toAirportId,
    ]);
    if (aircraft.currentAirportId) airportIds.add(aircraft.currentAirportId);
    if (aircraft.baseAirportId) airportIds.add(aircraft.baseAirportId);

    const airports = await this.prisma.airport.findMany({
      where: { id: { in: [...airportIds] } },
    });
    const airportsById = new Map(
      airports.map((a) => [a.id, this.toAirportFees(a)]),
    );

    const breakdown = buildPricingEstimate({
      aircraft: this.toAircraftRate(aircraft),
      airportsById,
      passengerRoute: {
        fromAirportId: params.fromAirportId,
        toAirportId: params.toAirportId,
        passengerCount: params.passengerCount,
        departureAt: params.departureAt,
      },
      tripType: params.tripType,
    });

    const snapshot = freezePricingSnapshot(breakdown);
    let estimateId: number | undefined;

    if (params.persist) {
      const created = await this.prisma.pricingEstimate.create({
        data: {
          bookingId: params.bookingId,
          quoteRequestId: params.quoteRequestId,
          aircraftId: params.aircraftId,
          currency: snapshot.currency,
          billableHours: snapshot.billableHours,
          hourlyRateSnapshot: snapshot.hourlyRateSnapshot,
          flightHourCost: snapshot.flightHourCost,
          airportFeesTotal: snapshot.airportFeesTotal,
          handlingFeesTotal: snapshot.handlingFeesTotal,
          parkingFeesTotal: snapshot.parkingFeesTotal,
          crewFeesTotal: snapshot.crewFeesTotal,
          otherFeesTotal: snapshot.otherFeesTotal,
          taxesTotal: snapshot.taxesTotal,
          markupTotal: snapshot.markupTotal,
          estimatedTotal: snapshot.estimatedTotal,
          formulaVersion: snapshot.formulaVersion,
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
          createdByUserId: params.userId,
        },
      });
      estimateId = created.id;
      await this.audit.logEntity({
        action: 'PRICING_ESTIMATE_CREATED',
        entityType: 'PricingEstimate',
        entityId: String(created.id),
        afterData: {
          estimatedTotal: snapshot.estimatedTotal,
          route: snapshot.customerRouteSummary,
        },
        userId: params.userId,
      });
    }

    return {
      estimate: snapshot,
      estimateId,
      label: 'Giá ước tính',
    };
  }

  async attachEstimateToBooking(
    bookingId: number,
    estimateId: number,
    userId?: number,
  ) {
    await this.assertBookingOwner(bookingId, userId ?? 0);
    const estimate = await this.prisma.pricingEstimate.findUnique({
      where: { id: estimateId },
    });
    if (!estimate)
      throw new NotFoundException(`Estimate ${estimateId} not found`);

    const snapshot = estimate.snapshot as unknown as PricingBreakdown;

    await this.prisma.$transaction(async (tx) => {
      await tx.bookingFlightLeg.deleteMany({ where: { bookingId } });
      for (const leg of snapshot.legs) {
        await tx.bookingFlightLeg.create({
          data: {
            bookingId,
            aircraftId: estimate.aircraftId,
            fromAirportId: leg.fromAirportId,
            toAirportId: leg.toAirportId,
            legType: leg.legType,
            sequence: leg.sequence,
            estimatedFlightMinutes: leg.estimatedFlightMinutes,
            estimatedDistanceKm: leg.estimatedDistanceKm,
            hasPassengers: leg.hasPassengers,
            passengerCount: leg.passengerCount,
            hourlyRateSnapshot: leg.hourlyRateSnapshot,
            currency: leg.currency,
            estimatedBaseCost: leg.estimatedBaseCost,
            airportFees: leg.airportFees,
            handlingFees: leg.handlingFees,
            parkingFees: leg.parkingFees,
            crewFees: leg.crewFees,
            otherFees: leg.otherFees,
            estimatedTotalCost: leg.estimatedTotalCost,
            status: 'PLANNED',
          },
        });
      }
      await tx.pricingEstimate.update({
        where: { id: estimateId },
        data: { bookingId },
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          aircraftId: estimate.aircraftId,
          customerRouteSummary: snapshot.customerRouteSummary,
          estimatedPriceTotal: snapshot.estimatedTotal,
          estimatedPriceCurrency: snapshot.currency,
        },
      });
    });

    await this.audit.logEntity({
      action: 'BOOKING_PRICING_ATTACHED',
      entityType: 'Booking',
      entityId: String(bookingId),
      afterData: { estimateId, estimatedTotal: snapshot.estimatedTotal },
      userId,
    });

    return this.getBookingBreakdown(bookingId, userId);
  }

  async recalculateBooking(bookingId: number, userId?: number) {
    if (!userId) throw new ForbiddenException('Authenticated user required');
    await this.assertBookingOwner(bookingId, userId);
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        flightLegs: {
          where: { legType: 'PASSENGER' },
          orderBy: { sequence: 'asc' },
          take: 1,
        },
      },
    });
    if (!booking) throw new NotFoundException(`Booking ${bookingId} not found`);
    if (!booking.aircraftId) {
      throw new BadRequestException('Booking has no aircraft assigned');
    }
    const passengerLeg = booking.flightLegs[0];
    if (!passengerLeg) {
      throw new BadRequestException(
        'Booking has no passenger leg to recalculate',
      );
    }

    const { estimate, estimateId } = await this.estimate({
      aircraftId: booking.aircraftId,
      fromAirportId: passengerLeg.fromAirportId,
      toAirportId: passengerLeg.toAirportId,
      passengerCount: passengerLeg.passengerCount,
      persist: true,
      bookingId,
      userId,
    });

    if (estimateId) {
      await this.attachEstimateToBooking(bookingId, estimateId, userId);
    }

    return { estimate, estimateId, label: 'Giá ước tính' };
  }

  async getBookingBreakdown(bookingId: number, userId?: number) {
    if (!userId) throw new ForbiddenException('Authenticated user required');
    await this.assertBookingOwner(bookingId, userId);
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        flightLegs: {
          orderBy: { sequence: 'asc' },
          include: { fromAirport: true, toAirport: true },
        },
        pricingEstimates: { orderBy: { createdAt: 'desc' }, take: 1 },
        aircraft: { include: { aircraftModel: true, currentAirport: true } },
      },
    });
    if (!booking) throw new NotFoundException(`Booking ${bookingId} not found`);

    const latest = booking.pricingEstimates[0];
    const snapshot = latest?.snapshot as unknown as
      PricingBreakdown | undefined;

    return {
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      customerRouteSummary: booking.customerRouteSummary,
      estimatedPriceTotal:
        booking.estimatedPriceTotal != null
          ? Number(booking.estimatedPriceTotal)
          : null,
      estimatedPriceCurrency: booking.estimatedPriceCurrency,
      label: 'Giá ước tính',
      disclaimer:
        snapshot?.disclaimer ??
        'Giá ước tính — chưa bao gồm thuế/phí phát sinh thực tế; không phải báo giá chốt.',
      estimate: snapshot ?? null,
      flightLegs: booking.flightLegs.map((leg) => ({
        id: leg.id,
        legType: leg.legType,
        sequence: leg.sequence,
        from: leg.fromAirport.iata,
        to: leg.toAirport.iata,
        hasPassengers: leg.hasPassengers,
        estimatedTotalCost:
          leg.estimatedTotalCost != null
            ? Number(leg.estimatedTotalCost)
            : null,
        status: leg.status,
      })),
      aircraft: booking.aircraft
        ? {
            id: booking.aircraft.id,
            registration: booking.aircraft.registration,
            currentAirport: booking.aircraft.currentAirport?.iata ?? null,
            model: `${booking.aircraft.aircraftModel.manufacturer} ${booking.aircraft.aircraftModel.model}`,
          }
        : null,
    };
  }
}
