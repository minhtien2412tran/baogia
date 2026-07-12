import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { AirportScopeService } from './airport-scope.service';
import { CreateEmptyLegDto, EmptyLegRequestDto, EmptyLegAlertSubscribeDto, UpdateEmptyLegDto } from '../dto';
import { formatAirport } from '../utils/commercial.formatters';
import type { AuthUser } from '../auth/auth.types';
const emptyLegInclude = {
  fromAirport: true,
  toAirport: true,
  aircraftModel: { include: { category: true } },
} as const;

export type EmptyLegListFilters = {
  fromContinent?: string;
  toContinent?: string;
  fromCountry?: string;
  toCountry?: string;
  fromCity?: string;
  toCity?: string;
  fromAirport?: string;
  toAirport?: string;
  dateFrom?: string;
  dateTo?: string;
  passengers?: number;
  categoryCode?: string;
  priceMin?: number;
  priceMax?: number;
};

@Injectable()
export class EmptyLegService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly airportScope: AirportScopeService,
  ) {}
  private formatOffer(
    offer: {
      id: number;
      slug: string;
      departAt: Date;
      price: Prisma.Decimal;
      discountPct: number;
      status: string;
      fromAirport: Parameters<typeof formatAirport>[0];
      toAirport: Parameters<typeof formatAirport>[0];
      aircraftModel: {
        id: number;
        manufacturer: string;
        model: string;
        rangeKm: number | null;
        speedKmh: number | null;
        sleepCapacity: number | null;
        category: { code: string; maxPassengers: number };
      };
    },
    detailed = false,
  ) {
    const category = offer.aircraftModel.category;
    return {
      id: offer.id,
      slug: offer.slug,
      fromAirport: formatAirport(offer.fromAirport, detailed),
      toAirport: formatAirport(offer.toAirport, detailed),
      departAt: offer.departAt.toISOString(),
      price: Number(offer.price),
      discountPct: offer.discountPct,
      aircraftModel: detailed
        ? {
            id: offer.aircraftModel.id,
            manufacturer: offer.aircraftModel.manufacturer,
            model: offer.aircraftModel.model,
            rangeKm: offer.aircraftModel.rangeKm,
            speedKmh: offer.aircraftModel.speedKmh,
            sleepCapacity: offer.aircraftModel.sleepCapacity,
            categoryCode: category.code,
            maxPassengers: category.maxPassengers,
          }
        : `${offer.aircraftModel.manufacturer} ${offer.aircraftModel.model}`,
      categoryCode: category.code,
      maxPassengers: category.maxPassengers,
      status: offer.status,
      ...(detailed
        ? {
            recommendations: [
              {
                title: `Explore ${offer.toAirport.city}`,
                description: `Discover destinations near ${offer.toAirport.name}.`,
              },
            ],
          }
        : {}),
    };
  }

  async getAll(
    status = 'ACTIVE',
    filters: EmptyLegListFilters = {},
    viewer?: AuthUser | null,
  ) {
    const where: Prisma.EmptyLegOfferWhereInput = status === 'all' ? {} : { status };

    const fromAirport: Prisma.AirportWhereInput = {};
    if (filters.fromContinent) fromAirport.continentCode = filters.fromContinent.toUpperCase();
    if (filters.fromCountry) {
      const c = filters.fromCountry.trim();
      fromAirport.OR = [
        { countryCode: { equals: c.toUpperCase(), mode: 'insensitive' } },
        { country: { contains: c, mode: 'insensitive' } },
      ];
    }
    if (filters.fromCity) fromAirport.city = { contains: filters.fromCity, mode: 'insensitive' };
    if (filters.fromAirport) fromAirport.iata = filters.fromAirport.toUpperCase();

    const toAirport: Prisma.AirportWhereInput = {};
    if (filters.toContinent) toAirport.continentCode = filters.toContinent.toUpperCase();
    if (filters.toCountry) {
      const c = filters.toCountry.trim();
      toAirport.OR = [
        { countryCode: { equals: c.toUpperCase(), mode: 'insensitive' } },
        { country: { contains: c, mode: 'insensitive' } },
      ];
    }
    if (filters.toCity) toAirport.city = { contains: filters.toCity, mode: 'insensitive' };
    if (filters.toAirport) toAirport.iata = filters.toAirport.toUpperCase();

    // Airport scope: both endpoints of the leg must be in-scope for scoped users
    const scopeWhere = await this.airportScope.airportWhereForUser(
      viewer?.userId,
      viewer?.role,
    );
    if (scopeWhere) {
      const fromParts = [fromAirport, scopeWhere].filter((p) => Object.keys(p).length > 0);
      const toParts = [toAirport, scopeWhere].filter((p) => Object.keys(p).length > 0);
      if (fromParts.length) where.fromAirport = fromParts.length === 1 ? fromParts[0] : { AND: fromParts };
      if (toParts.length) where.toAirport = toParts.length === 1 ? toParts[0] : { AND: toParts };
    } else {
      if (Object.keys(fromAirport).length) where.fromAirport = fromAirport;
      if (Object.keys(toAirport).length) where.toAirport = toAirport;
    }
    if (filters.dateFrom || filters.dateTo) {
      where.departAt = {};
      if (filters.dateFrom) where.departAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.departAt.lte = new Date(filters.dateTo);
    }

    if (filters.priceMin != null || filters.priceMax != null) {
      where.price = {};
      if (filters.priceMin != null && !Number.isNaN(filters.priceMin)) where.price.gte = filters.priceMin;
      if (filters.priceMax != null && !Number.isNaN(filters.priceMax)) where.price.lte = filters.priceMax;
    }

    const aircraftModelWhere: Prisma.AircraftModelWhereInput = {};
    const categoryWhere: Prisma.AircraftCategoryWhereInput = {};
    if (filters.categoryCode) categoryWhere.code = filters.categoryCode.toUpperCase();
    if (filters.passengers != null && !Number.isNaN(filters.passengers)) {
      categoryWhere.maxPassengers = { gte: filters.passengers };
    }
    if (Object.keys(categoryWhere).length) aircraftModelWhere.category = categoryWhere;
    if (Object.keys(aircraftModelWhere).length) where.aircraftModel = aircraftModelWhere;

    const offers = await this.prisma.emptyLegOffer.findMany({
      where,
      include: emptyLegInclude,
      orderBy: { departAt: 'asc' },
    });
    return { emptyLegs: offers.map((o) => this.formatOffer(o)), filtersApplied: filters };
  }

  async getBySlug(slug: string) {
    const offer = await this.prisma.emptyLegOffer.findUnique({
      where: { slug },
      include: emptyLegInclude,
    });
    if (!offer) throw new NotFoundException(`Empty leg "${slug}" not found`);
    return this.formatOffer(offer, true);
  }

  async subscribeAlerts(body: EmptyLegAlertSubscribeDto) {
    if (!body.email?.includes('@')) {
      throw new BadRequestException('Valid email is required');
    }
    const from = body.fromAirport?.toUpperCase().trim();
    const to = body.toAirport?.toUpperCase().trim();
    if (!from || !to) {
      throw new BadRequestException('From and to airports are required');
    }

    await this.audit.log('EMPTY_LEG_ALERT_SUBSCRIBE', { email: body.email, from, to });
    return { message: 'Alert subscription saved', from, to };
  }

  private async findOfferOrThrow(id: number) {
    const offer = await this.prisma.emptyLegOffer.findUnique({
      where: { id },
      include: emptyLegInclude,
    });
    if (!offer) throw new NotFoundException(`Empty leg #${id} not found`);
    return offer;
  }

  async requestOffer(id: number, body: EmptyLegRequestDto) {
    const offer = await this.findOfferOrThrow(id);
    if (offer.status !== 'ACTIVE') {
      throw new BadRequestException('Empty leg is not available');
    }
    await this.audit.log('EMPTY_LEG_REQUEST', { emptyLegId: id, email: body.email });
    return {
      message: 'Empty leg request submitted',
      emptyLegId: id,
      slug: offer.slug,
      estimatedPrice: Number(offer.price),
      disclaimer:
        'Displayed price is an estimate based on available information. Final price will be confirmed after the operator reviews aircraft status, schedule, and related fees.',
    };
  }

  async adminList() {
    return this.getAll('all');
  }

  async create(body: CreateEmptyLegDto) {
    const from = await this.prisma.airport.findUnique({
      where: { iata: body.fromAirportIata.toUpperCase() },
    });
    const to = await this.prisma.airport.findUnique({
      where: { iata: body.toAirportIata.toUpperCase() },
    });
    if (!from || !to) throw new BadRequestException('Invalid airport IATA');
    const slug =
      body.slug ||
      `${from.city}-${to.city}-empty-leg-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await this.prisma.emptyLegOffer.create({
      data: {
        slug,
        fromAirportId: from.id,
        toAirportId: to.id,
        departAt: new Date(body.departAt),
        aircraftModelId: body.aircraftModelId,
        price: body.price,
        discountPct: body.discountPct ?? 0,
        status: body.status ?? 'ACTIVE',
      },
      include: emptyLegInclude,
    });
    await this.audit.log('EMPTY_LEG_CREATED', { id: created.id, slug: created.slug });
    return this.formatOffer(created, true);
  }

  async update(id: number, body: UpdateEmptyLegDto) {
    await this.findOfferOrThrow(id);
    const data: Prisma.EmptyLegOfferUpdateInput = {};
    if (body.departAt) data.departAt = new Date(body.departAt);
    if (body.price != null) data.price = body.price;
    if (body.discountPct != null) data.discountPct = body.discountPct;
    if (body.status) data.status = body.status;
    if (body.aircraftModelId) data.aircraftModel = { connect: { id: body.aircraftModelId } };
    if (body.fromAirportIata) {
      const from = await this.prisma.airport.findUnique({
        where: { iata: body.fromAirportIata.toUpperCase() },
      });
      if (!from) throw new BadRequestException('Invalid from airport');
      data.fromAirport = { connect: { id: from.id } };
    }
    if (body.toAirportIata) {
      const to = await this.prisma.airport.findUnique({
        where: { iata: body.toAirportIata.toUpperCase() },
      });
      if (!to) throw new BadRequestException('Invalid to airport');
      data.toAirport = { connect: { id: to.id } };
    }
    const updated = await this.prisma.emptyLegOffer.update({
      where: { id },
      data,
      include: emptyLegInclude,
    });
    await this.audit.log('EMPTY_LEG_UPDATED', { id });
    return this.formatOffer(updated, true);
  }

  async delete(id: number) {
    await this.findOfferOrThrow(id);
    await this.prisma.emptyLegOffer.delete({ where: { id } });
    await this.audit.log('EMPTY_LEG_DELETED', { id });
    return { message: 'Deleted', id };
  }
}
