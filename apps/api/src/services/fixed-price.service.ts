import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import {
  BookFixedPriceDto,
  CreateFixedPriceRouteDto,
  UpdateFixedPriceRouteDto,
} from '../dto';
import { formatFixedPriceRoute } from '../utils/commercial.formatters';

const routeInclude = {
  fromAirport: true,
  toAirport: true,
  options: { include: { category: true } },
} as const;

@Injectable()
export class FixedPriceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getRoutes(region?: string) {
    const routes = await this.prisma.fixedPriceRoute.findMany({
      where: {
        status: 'ACTIVE',
        ...(region ? { region: { equals: region, mode: 'insensitive' as const } } : {}),
      },
      include: routeInclude,
      orderBy: { id: 'asc' },
    });
    return {
      region: region ?? 'Global',
      routes: routes.map((r) => formatFixedPriceRoute(r)),
    };
  }

  async getAllRoutesAdmin() {
    const routes = await this.prisma.fixedPriceRoute.findMany({
      include: routeInclude,
      orderBy: { id: 'asc' },
    });
    return { routes: routes.map((r) => formatFixedPriceRoute(r, true)) };
  }

  async getRouteBySlug(slug: string) {
    const route = await this.prisma.fixedPriceRoute.findUnique({
      where: { slug },
      include: routeInclude,
    });
    if (!route) throw new NotFoundException(`Route "${slug}" not found`);
    return formatFixedPriceRoute(route, true);
  }

  async createQuote(body: BookFixedPriceDto) {
    const route = await this.prisma.fixedPriceRoute.findUnique({
      where: { id: body.routeId },
      include: routeInclude,
    });
    if (!route) throw new NotFoundException(`Route #${body.routeId} not found`);

    const option = route.options.find((o) => o.category.code === body.category);
    if (!option) {
      throw new BadRequestException(`Category "${body.category}" not available for this route`);
    }

    return {
      quoteId: route.id * 100 + option.id,
      routeId: body.routeId,
      slug: route.slug,
      category: body.category,
      price: Number(option.price),
      currency: 'USD',
      status: 'PENDING',
      message: 'Fixed-price quote generated. Proceed to payment verification.',
    };
  }

  async createRoute(dto: CreateFixedPriceRouteDto) {
    const from = await this.resolveAirport(dto.fromAirportIata);
    const to = await this.resolveAirport(dto.toAirportIata);

    const route = await this.prisma.fixedPriceRoute.create({
      data: {
        slug: dto.slug,
        fromAirportId: from.id,
        toAirportId: to.id,
        region: dto.region,
        status: dto.status ?? 'ACTIVE',
        options: dto.options?.length
          ? {
              create: await Promise.all(
                dto.options.map(async (opt) => ({
                  categoryId: await this.resolveCategoryId(opt.categoryCode),
                  price: opt.price,
                  paxLimit: opt.paxLimit,
                  includedTerms: opt.includedTerms,
                })),
              ),
            }
          : undefined,
      },
      include: routeInclude,
    });

    await this.audit.log('FIXED_PRICE_ROUTE_CREATED', { routeId: route.id, slug: route.slug });
    return formatFixedPriceRoute(route, true);
  }

  async updateRoute(id: number, dto: UpdateFixedPriceRouteDto) {
    await this.findRouteOrThrow(id);

    const fromId = dto.fromAirportIata
      ? (await this.resolveAirport(dto.fromAirportIata)).id
      : undefined;
    const toId = dto.toAirportIata
      ? (await this.resolveAirport(dto.toAirportIata)).id
      : undefined;

    if (dto.options) {
      await this.prisma.fixedPriceOption.deleteMany({ where: { routeId: id } });
    }

    const route = await this.prisma.fixedPriceRoute.update({
      where: { id },
      data: {
        slug: dto.slug,
        fromAirportId: fromId,
        toAirportId: toId,
        region: dto.region,
        status: dto.status,
        ...(dto.options
          ? {
              options: {
                create: await Promise.all(
                  dto.options.map(async (opt) => ({
                    categoryId: await this.resolveCategoryId(opt.categoryCode),
                    price: opt.price,
                    paxLimit: opt.paxLimit,
                    includedTerms: opt.includedTerms,
                  })),
                ),
              },
            }
          : {}),
      },
      include: routeInclude,
    });

    await this.audit.log('FIXED_PRICE_ROUTE_UPDATED', { routeId: id });
    return formatFixedPriceRoute(route, true);
  }

  async deleteRoute(id: number) {
    await this.findRouteOrThrow(id);
    await this.prisma.fixedPriceRoute.delete({ where: { id } });
    await this.audit.log('FIXED_PRICE_ROUTE_DELETED', { routeId: id });
    return { message: 'Route deleted', id };
  }

  private async findRouteOrThrow(id: number) {
    const route = await this.prisma.fixedPriceRoute.findUnique({ where: { id } });
    if (!route) throw new NotFoundException(`Route #${id} not found`);
    return route;
  }

  private async resolveAirport(iata: string) {
    const airport = await this.prisma.airport.findUnique({ where: { iata: iata.toUpperCase() } });
    if (!airport) throw new BadRequestException(`Airport "${iata}" not found`);
    return airport;
  }

  private async resolveCategoryId(code: string) {
    const category = await this.prisma.aircraftCategory.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!category) throw new BadRequestException(`Aircraft category "${code}" not found`);
    return category.id;
  }
}
