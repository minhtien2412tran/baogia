import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class AircraftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listCategories() {
    const categories = await this.prisma.aircraftCategory.findMany({
      include: { models: { orderBy: { model: 'asc' } } },
      orderBy: { code: 'asc' },
    });
    return { categories };
  }

  async listModels(categoryId?: number) {
    const models = await this.prisma.aircraftModel.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: [{ manufacturer: 'asc' }, { model: 'asc' }],
    });
    return { models };
  }

  async createCategory(body: {
    code: string;
    label: string;
    maxPassengers?: number;
  }) {
    const category = await this.prisma.aircraftCategory.create({
      data: {
        code: body.code.toUpperCase(),
        label: body.label,
        maxPassengers: body.maxPassengers ?? 8,
      },
    });
    await this.audit.log('AIRCRAFT_CATEGORY_CREATED', {
      categoryId: category.id,
    });
    return category;
  }

  async updateCategory(
    id: number,
    body: { code?: string; label?: string; maxPassengers?: number },
  ) {
    await this.findCategoryOrThrow(id);
    return this.prisma.aircraftCategory.update({
      where: { id },
      data: {
        code: body.code?.toUpperCase(),
        label: body.label,
        maxPassengers: body.maxPassengers,
      },
    });
  }

  async deleteCategory(id: number) {
    await this.findCategoryOrThrow(id);
    const modelCount = await this.prisma.aircraftModel.count({
      where: { categoryId: id },
    });
    if (modelCount > 0) {
      throw new BadRequestException(
        'Remove aircraft models before deleting category',
      );
    }
    await this.prisma.aircraftCategory.delete({ where: { id } });
    return { message: 'Category deleted' };
  }

  async createModel(body: {
    manufacturer: string;
    model: string;
    categoryId: number;
    rangeKm?: number;
    speedKmh?: number;
    sleepCapacity?: number;
  }) {
    await this.findCategoryOrThrow(body.categoryId);
    const created = await this.prisma.aircraftModel.create({
      data: body,
      include: { category: true },
    });
    await this.audit.log('AIRCRAFT_MODEL_CREATED', { modelId: created.id });
    return created;
  }

  async updateModel(
    id: number,
    body: {
      manufacturer?: string;
      model?: string;
      categoryId?: number;
      rangeKm?: number;
      speedKmh?: number;
      sleepCapacity?: number;
    },
  ) {
    await this.findModelOrThrow(id);
    if (body.categoryId) await this.findCategoryOrThrow(body.categoryId);
    return this.prisma.aircraftModel.update({
      where: { id },
      data: body,
      include: { category: true },
    });
  }

  async deleteModel(id: number) {
    await this.findModelOrThrow(id);
    const inUse = await this.prisma.emptyLegOffer.count({
      where: { aircraftModelId: id },
    });
    if (inUse > 0)
      throw new BadRequestException('Model is referenced by empty leg offers');
    const fleet = await this.prisma.aircraft.count({
      where: { aircraftModelId: id },
    });
    if (fleet > 0)
      throw new BadRequestException(
        'Model is referenced by aircraft instances',
      );
    await this.prisma.aircraftModel.delete({ where: { id } });
    return { message: 'Model deleted' };
  }

  // --- Aircraft instances (tail numbers) ---

  async listFleet(filters?: {
    availabilityStatus?: string;
    currentAirportId?: number;
  }) {
    const aircraft = await this.prisma.aircraft.findMany({
      where: {
        ...(filters?.availabilityStatus
          ? { availabilityStatus: filters.availabilityStatus }
          : {}),
        ...(filters?.currentAirportId
          ? { currentAirportId: filters.currentAirportId }
          : {}),
      },
      include: {
        aircraftModel: { include: { category: true } },
        operator: true,
        currentAirport: true,
        baseAirport: true,
      },
      orderBy: { registration: 'asc' },
    });
    return {
      aircraft: aircraft.map((a) => ({
        id: a.id,
        registration: a.registration,
        availabilityStatus: a.availabilityStatus,
        operationalStatus: a.operationalStatus,
        hourlyRate: a.hourlyRate != null ? Number(a.hourlyRate) : null,
        hourlyRateCurrency: a.hourlyRateCurrency,
        minimumBillableHours: Number(a.minimumBillableHours),
        locationUpdatedAt: a.locationUpdatedAt?.toISOString() ?? null,
        model: `${a.aircraftModel.manufacturer} ${a.aircraftModel.model}`,
        category: a.aircraftModel.category.code,
        operator: a.operator.name,
        currentAirport: a.currentAirport
          ? {
              id: a.currentAirport.id,
              iata: a.currentAirport.iata,
              city: a.currentAirport.city,
            }
          : null,
        baseAirport: a.baseAirport
          ? { id: a.baseAirport.id, iata: a.baseAirport.iata }
          : null,
      })),
    };
  }

  async getFleetItem(id: number) {
    const a = await this.prisma.aircraft.findUnique({
      where: { id },
      include: {
        aircraftModel: { include: { category: true } },
        operator: true,
        currentAirport: true,
        baseAirport: true,
        locationHistory: {
          orderBy: { changedAt: 'desc' },
          take: 20,
          include: { fromAirport: true, toAirport: true },
        },
      },
    });
    if (!a) throw new NotFoundException(`Aircraft ${id} not found`);
    return a;
  }

  async createFleet(body: {
    registration: string;
    aircraftModelId: number;
    operatorId: number;
    baseAirportId?: number;
    currentAirportId?: number;
    hourlyRate?: number;
    hourlyRateCurrency?: string;
    minimumBillableHours?: number;
    availabilityStatus?: string;
  }) {
    await this.findModelOrThrow(body.aircraftModelId);
    const created = await this.prisma.aircraft.create({
      data: {
        registration: body.registration.trim().toUpperCase(),
        aircraftModelId: body.aircraftModelId,
        operatorId: body.operatorId,
        baseAirportId: body.baseAirportId,
        currentAirportId: body.currentAirportId ?? body.baseAirportId,
        hourlyRate: body.hourlyRate,
        hourlyRateCurrency: body.hourlyRateCurrency ?? 'USD',
        minimumBillableHours: body.minimumBillableHours ?? 1,
        availabilityStatus: body.availabilityStatus ?? 'AVAILABLE',
        locationUpdatedAt: new Date(),
      },
    });
    await this.audit.logEntity({
      action: 'AIRCRAFT_CREATED',
      entityType: 'Aircraft',
      entityId: created.id,
      afterData: { registration: created.registration },
    });
    return created;
  }

  async updateLocation(
    id: number,
    body: { airportId: number; reason?: string },
    userId?: number,
  ) {
    const aircraft = await this.prisma.aircraft.findUnique({ where: { id } });
    if (!aircraft) throw new NotFoundException(`Aircraft ${id} not found`);
    const airport = await this.prisma.airport.findUnique({
      where: { id: body.airportId },
    });
    if (!airport)
      throw new NotFoundException(`Airport ${body.airportId} not found`);

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.aircraftLocationHistory.create({
        data: {
          aircraftId: id,
          fromAirportId: aircraft.currentAirportId,
          toAirportId: body.airportId,
          reason: body.reason ?? 'MANUAL_UPDATE',
          updatedByUserId: userId,
        },
      });
      return tx.aircraft.update({
        where: { id },
        data: {
          currentAirportId: body.airportId,
          locationUpdatedAt: new Date(),
          locationUpdatedById: userId,
        },
        include: { currentAirport: true },
      });
    });

    await this.audit.logEntity({
      action: 'AIRCRAFT_LOCATION_UPDATED',
      entityType: 'Aircraft',
      entityId: id,
      beforeData: { currentAirportId: aircraft.currentAirportId },
      afterData: { currentAirportId: body.airportId, reason: body.reason },
      userId,
    });
    return updated;
  }

  private async findCategoryOrThrow(id: number) {
    const c = await this.prisma.aircraftCategory.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Category ${id} not found`);
    return c;
  }

  private async findModelOrThrow(id: number) {
    const m = await this.prisma.aircraftModel.findUnique({ where: { id } });
    if (!m) throw new NotFoundException(`Model ${id} not found`);
    return m;
  }
}
