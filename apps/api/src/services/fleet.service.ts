import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import {
  UpdateFleetAvailabilityDto,
  UpdateFleetHourlyRateDto,
  UpdateFleetLocationDto,
} from '../dto';

const fleetInclude = {
  aircraftModel: { include: { category: true } },
  operator: true,
  baseAirport: true,
  currentAirport: true,
} as const;

@Injectable()
export class FleetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private format(ac: Awaited<ReturnType<typeof this.findOrThrow>>) {
    return {
      id: ac.id,
      registration: ac.registration,
      availabilityStatus: ac.availabilityStatus,
      availableFrom: ac.availableFrom?.toISOString() ?? null,
      hourlyRate: Number(ac.hourlyRate),
      hourlyRateCurrency: ac.hourlyRateCurrency,
      minimumBillableHours: Number(ac.minimumBillableHours),
      locationUpdatedAt: ac.locationUpdatedAt.toISOString(),
      model: {
        id: ac.aircraftModel.id,
        label: `${ac.aircraftModel.manufacturer} ${ac.aircraftModel.model}`,
        categoryCode: ac.aircraftModel.category.code,
        maxPassengers: ac.aircraftModel.category.maxPassengers,
        speedKmh: ac.aircraftModel.speedKmh,
      },
      operator: ac.operator ? { id: ac.operator.id, name: ac.operator.name } : null,
      baseAirport: {
        id: ac.baseAirport.id,
        iata: ac.baseAirport.iata,
        city: ac.baseAirport.city,
      },
      currentAirport: {
        id: ac.currentAirport.id,
        iata: ac.currentAirport.iata,
        city: ac.currentAirport.city,
        continentCode: ac.currentAirport.continentCode,
      },
    };
  }

  private async findOrThrow(id: number) {
    const ac = await this.prisma.aircraft.findUnique({
      where: { id },
      include: fleetInclude,
    });
    if (!ac) throw new NotFoundException(`Fleet aircraft #${id} not found`);
    return ac;
  }

  async list(status?: string) {
    const fleet = await this.prisma.aircraft.findMany({
      where: status ? { availabilityStatus: status } : undefined,
      include: fleetInclude,
      orderBy: { registration: 'asc' },
    });
    return { aircraft: fleet.map((ac) => this.format(ac)) };
  }

  async getById(id: number) {
    return this.format(await this.findOrThrow(id));
  }

  async updateLocation(id: number, body: UpdateFleetLocationDto, userId?: number) {
    const ac = await this.findOrThrow(id);
    const to = await this.prisma.airport.findUnique({
      where: { iata: body.currentAirportIata.toUpperCase() },
    });
    if (!to) throw new BadRequestException('Invalid currentAirportIata');

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.aircraftLocationHistory.create({
        data: {
          aircraftId: id,
          fromAirportId: ac.currentAirportId,
          toAirportId: to.id,
          source: 'MANUAL',
          note: body.note,
          createdBy: userId,
        },
      });
      return tx.aircraft.update({
        where: { id },
        data: {
          currentAirportId: to.id,
          locationUpdatedAt: new Date(),
        },
        include: fleetInclude,
      });
    });

    await this.audit.log(
      'AIRCRAFT_LOCATION_UPDATED',
      {
        aircraftId: id,
        from: ac.currentAirport.iata,
        to: to.iata,
        note: body.note,
      },
      userId,
    );
    return this.format(updated);
  }

  async updateAvailability(id: number, body: UpdateFleetAvailabilityDto, userId?: number) {
    await this.findOrThrow(id);
    const updated = await this.prisma.aircraft.update({
      where: { id },
      data: {
        availabilityStatus: body.availabilityStatus,
        availableFrom: body.availableFrom ? new Date(body.availableFrom) : undefined,
      },
      include: fleetInclude,
    });
    await this.audit.log(
      'AIRCRAFT_AVAILABILITY_UPDATED',
      { aircraftId: id, status: body.availabilityStatus },
      userId,
    );
    return this.format(updated);
  }

  async updateHourlyRate(id: number, body: UpdateFleetHourlyRateDto, userId?: number) {
    await this.findOrThrow(id);
    const updated = await this.prisma.aircraft.update({
      where: { id },
      data: {
        hourlyRate: body.hourlyRate,
        ...(body.hourlyRateCurrency != null
          ? { hourlyRateCurrency: body.hourlyRateCurrency }
          : {}),
        ...(body.minimumBillableHours != null
          ? { minimumBillableHours: body.minimumBillableHours }
          : {}),
      },
      include: fleetInclude,
    });
    await this.audit.log(
      'AIRCRAFT_HOURLY_RATE_UPDATED',
      { aircraftId: id, hourlyRate: body.hourlyRate },
      userId,
    );
    return this.format(updated);
  }
}
