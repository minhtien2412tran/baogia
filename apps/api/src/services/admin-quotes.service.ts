import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CustomerCareService } from './customer-care/customer-care.service';
import { CreateQuoteOfferDto } from '../dto';

@Injectable()
export class AdminQuotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly customerCare: CustomerCareService,
  ) {}

  async listQuotes(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page ?? 1;
    const limit = Math.min(filters?.limit ?? 20, 100);
    const skip = (page - 1) * limit;
    const where =
      filters?.status && filters.status !== 'all'
        ? { status: filters.status.toUpperCase() }
        : {};

    const [total, quotes] = await Promise.all([
      this.prisma.quoteRequest.count({ where }),
      this.prisma.quoteRequest.findMany({
        where,
        include: {
          legs: {
            include: { fromAirport: true, toAirport: true },
            orderBy: { seq: 'asc' },
            take: 1,
          },
          offers: { select: { id: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: quotes.map((q) => ({
        id: q.id,
        email: q.email,
        name: `${q.firstName} ${q.lastName}`,
        phone: q.phone,
        status: q.status,
        tripType: q.tripType,
        offerCount: q.offers.length,
        route: q.legs[0]
          ? `${q.legs[0].fromAirport.iata} → ${q.legs[0].toAirport.iata}`
          : null,
        createdAt: q.createdAt.toISOString(),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getQuote(id: number) {
    const quote = await this.prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        legs: {
          include: { fromAirport: true, toAirport: true },
          orderBy: { seq: 'asc' },
        },
        offers: {
          include: {
            aircraftModel: { include: { category: true } },
            operator: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        worldCupItinerary: true,
      },
    });
    if (!quote) throw new NotFoundException(`Quote #${id} not found`);

    return {
      id: quote.id,
      userId: quote.userId,
      email: quote.email,
      phone: quote.phone,
      firstName: quote.firstName,
      lastName: quote.lastName,
      tripType: quote.tripType,
      status: quote.status,
      locale: quote.locale,
      currency: quote.currency,
      message: quote.message,
      sourcePage: quote.sourcePage,
      campaign: quote.worldCupItinerary?.campaignCode ?? null,
      createdAt: quote.createdAt.toISOString(),
      legs: quote.legs.map((leg) => ({
        seq: leg.seq,
        from: leg.fromAirport.iata,
        to: leg.toAirport.iata,
        departureAt: leg.departureLocalAt.toISOString(),
        passengers: leg.passengers,
      })),
      offers: quote.offers.map((o) => ({
        id: o.id,
        price: Number(o.price),
        status: o.status,
        expiresAt: o.expiresAt.toISOString(),
        aircraft: `${o.aircraftModel.manufacturer} ${o.aircraftModel.model}`,
        category: o.aircraftModel.category.code,
        operator: o.operator.name,
        createdAt: o.createdAt.toISOString(),
      })),
    };
  }

  async listOperators() {
    const operators = await this.prisma.operator.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    });
    return {
      operators: operators.map((o) => ({
        id: o.id,
        name: o.name,
        region: o.region,
        status: o.status,
      })),
    };
  }

  async createOffer(
    quoteId: number,
    dto: CreateQuoteOfferDto,
    adminUserId?: number,
  ) {
    const quote = await this.prisma.quoteRequest.findUnique({
      where: { id: quoteId },
    });
    if (!quote) throw new NotFoundException(`Quote #${quoteId} not found`);

    const [aircraft, operator] = await Promise.all([
      this.prisma.aircraftModel.findUnique({
        where: { id: dto.aircraftModelId },
      }),
      this.prisma.operator.findUnique({ where: { id: dto.operatorId } }),
    ]);
    if (!aircraft)
      throw new BadRequestException(
        `Aircraft model #${dto.aircraftModelId} not found`,
      );
    if (!operator)
      throw new BadRequestException(`Operator #${dto.operatorId} not found`);
    if (operator.status !== 'ACTIVE') {
      throw new BadRequestException('Operator is not active');
    }

    const expiresAt = new Date(dto.expiresAt);
    if (
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException('expiresAt must be a future date');
    }

    const offer = await this.prisma.$transaction(async (tx) => {
      const created = await tx.quoteOffer.create({
        data: {
          quoteRequestId: quoteId,
          aircraftModelId: dto.aircraftModelId,
          operatorId: dto.operatorId,
          price: dto.price,
          pricingBreakdown:
            dto.pricingBreakdown === undefined
              ? undefined
              : (dto.pricingBreakdown as Prisma.InputJsonValue),
          expiresAt,
          status: 'ACTIVE',
        },
        include: {
          aircraftModel: { include: { category: true } },
          operator: true,
        },
      });
      await tx.quoteRequest.update({
        where: { id: quoteId },
        data: { status: 'OFFERED' },
      });
      return created;
    });

    await this.audit.log(
      'QUOTE_OFFER_CREATED',
      { quoteId, offerId: offer.id, price: dto.price },
      adminUserId,
    );

    const aircraftLabel = `${offer.aircraftModel.manufacturer} ${offer.aircraftModel.model}`;
    void this.customerCare.onQuoteOffered({
      quoteId,
      offerId: offer.id,
      email: quote.email,
      firstName: quote.firstName,
      userId: quote.userId,
      price: Number(offer.price),
      currency: 'USD',
      aircraft: aircraftLabel,
    });

    return {
      id: offer.id,
      quoteRequestId: quoteId,
      price: Number(offer.price),
      status: offer.status,
      expiresAt: offer.expiresAt.toISOString(),
      aircraft: aircraftLabel,
      operator: offer.operator.name,
      quoteStatus: 'OFFERED',
      message: `Offer #${offer.id} created for quote #${quoteId}`,
    };
  }
}
