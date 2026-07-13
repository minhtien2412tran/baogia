import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreateEmptyLegDto, EmptyLegRequestDto, EmptyLegAlertSubscribeDto, UpdateEmptyLegDto } from '../dto';
import { formatAirport } from '../utils/commercial.formatters';

const emptyLegInclude = {
  fromAirport: true,
  toAirport: true,
  aircraftModel: true,
} as const;

@Injectable()
export class EmptyLegService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private formatOffer(offer: Awaited<ReturnType<typeof this.findOfferOrThrow>>, detailed = false) {
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
          }
        : `${offer.aircraftModel.manufacturer} ${offer.aircraftModel.model}`,
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
    filters?: {
      continentCode?: string;
      countryCode?: string;
      fromIata?: string;
      toIata?: string;
      fromDate?: string;
      toDate?: string;
    },
  ) {
    const where: Prisma.EmptyLegOfferWhereInput =
      status === 'all' ? {} : { status };

    if (filters?.fromIata) {
      where.fromAirport = { iata: filters.fromIata.toUpperCase() };
    }
    if (filters?.toIata) {
      where.toAirport = { iata: filters.toIata.toUpperCase() };
    }
    if (filters?.continentCode || filters?.countryCode) {
      const airportFilter: Prisma.AirportWhereInput = {};
      if (filters.continentCode) {
        airportFilter.continentCode = filters.continentCode.toUpperCase();
      }
      if (filters.countryCode) {
        airportFilter.countryCode = filters.countryCode.toUpperCase();
      }
      where.OR = [{ fromAirport: airportFilter }, { toAirport: airportFilter }];
    }
    if (filters?.fromDate || filters?.toDate) {
      where.departAt = {};
      if (filters.fromDate) where.departAt.gte = new Date(filters.fromDate);
      if (filters.toDate) where.departAt.lte = new Date(filters.toDate);
    }

    const offers = await this.prisma.emptyLegOffer.findMany({
      where,
      include: emptyLegInclude,
      orderBy: { departAt: 'asc' },
    });
    return {
      emptyLegs: offers.map((o) => ({
        ...this.formatOffer(o),
        estimatedPriceLabel: 'Giá ước tính',
        priceDisclaimer:
          'Giá ước tính — có thể thay đổi theo positioning và phí sân bay thực tế.',
        fromContinent: o.fromAirport.continentCode,
        toContinent: o.toAirport.continentCode,
        fromCountryCode: o.fromAirport.countryCode,
        toCountryCode: o.toAirport.countryCode,
      })),
    };
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

    await this.audit.log('EMPTY_LEG_ALERT_SUBSCRIBE', {
      email: body.email,
      fromAirport: from,
      toAirport: to,
      locale: body.locale ?? 'en',
    });

    return {
      status: 'SUBSCRIBED',
      message: 'You will receive alerts when matching empty legs become available.',
    };
  }

  async requestOffer(id: number, body: EmptyLegRequestDto) {
    const offer = await this.findOfferOrThrow(id);
    if (offer.status !== 'ACTIVE') {
      throw new BadRequestException('This empty leg is no longer available');
    }
    if (!body.isConsentAccepted) {
      throw new BadRequestException('Consent is required');
    }

    const request = await this.prisma.auditLog.create({
      data: {
        action: 'EMPTY_LEG_REQUEST',
        details: {
          emptyLegId: id,
          slug: offer.slug,
          contact: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
          },
          passengers: body.passengers,
          message: body.message ?? null,
        },
      },
    });

    return {
      requestId: request.id,
      emptyLegId: id,
      slug: offer.slug,
      status: 'PENDING',
      message: 'Your empty leg request has been received. Our team will contact you shortly.',
    };
  }

  async create(dto: CreateEmptyLegDto) {
    const from = await this.resolveAirport(dto.fromAirportIata);
    const to = await this.resolveAirport(dto.toAirportIata);
    await this.ensureModelExists(dto.aircraftModelId);

    const offer = await this.prisma.emptyLegOffer.create({
      data: {
        slug: dto.slug,
        fromAirportId: from.id,
        toAirportId: to.id,
        departAt: new Date(dto.departAt),
        aircraftModelId: dto.aircraftModelId,
        price: dto.price,
        discountPct: dto.discountPct ?? 0,
        status: dto.status ?? 'ACTIVE',
      },
      include: emptyLegInclude,
    });

    await this.audit.log('EMPTY_LEG_CREATED', { emptyLegId: offer.id, slug: offer.slug });
    return this.formatOffer(offer, true);
  }

  async update(id: number, dto: UpdateEmptyLegDto) {
    await this.findOfferOrThrow(id);

    const fromId = dto.fromAirportIata
      ? (await this.resolveAirport(dto.fromAirportIata)).id
      : undefined;
    const toId = dto.toAirportIata
      ? (await this.resolveAirport(dto.toAirportIata)).id
      : undefined;
    if (dto.aircraftModelId) await this.ensureModelExists(dto.aircraftModelId);

    const offer = await this.prisma.emptyLegOffer.update({
      where: { id },
      data: {
        slug: dto.slug,
        fromAirportId: fromId,
        toAirportId: toId,
        departAt: dto.departAt ? new Date(dto.departAt) : undefined,
        aircraftModelId: dto.aircraftModelId,
        price: dto.price,
        discountPct: dto.discountPct,
        status: dto.status,
      },
      include: emptyLegInclude,
    });

    await this.audit.log('EMPTY_LEG_UPDATED', { emptyLegId: id });
    return this.formatOffer(offer, true);
  }

  async delete(id: number) {
    await this.findOfferOrThrow(id);
    await this.prisma.emptyLegOffer.delete({ where: { id } });
    await this.audit.log('EMPTY_LEG_DELETED', { emptyLegId: id });
    return { message: 'Empty leg deleted', id };
  }

  private async findOfferOrThrow(id: number) {
    const offer = await this.prisma.emptyLegOffer.findUnique({
      where: { id },
      include: emptyLegInclude,
    });
    if (!offer) throw new NotFoundException(`Empty leg #${id} not found`);
    return offer;
  }

  private async resolveAirport(iata: string) {
    const airport = await this.prisma.airport.findUnique({ where: { iata: iata.toUpperCase() } });
    if (!airport) throw new BadRequestException(`Airport "${iata}" not found`);
    return airport;
  }

  private async ensureModelExists(id: number) {
    const model = await this.prisma.aircraftModel.findUnique({ where: { id } });
    if (!model) throw new BadRequestException(`Aircraft model #${id} not found`);
  }
}
