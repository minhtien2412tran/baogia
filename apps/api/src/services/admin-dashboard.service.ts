import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { RedisService } from './redis.service';

function inferWorkflow(action: string): string {
  if (action.startsWith('QUOTE_')) return 'quotes';
  if (action.startsWith('BOOKING_')) return 'bookings';
  if (
    action.startsWith('PAYMENT_') ||
    action.startsWith('GATEWAY_') ||
    action.startsWith('STRIPE_')
  ) {
    return 'payments';
  }
  if (action.startsWith('CONTRACT_') || action.includes('DOCUSIGN')) {
    return 'contracts';
  }
  if (action.startsWith('ADMIN_USER_') || action.startsWith('PERMISSION_')) {
    return action.startsWith('PERMISSION_') ? 'permissions' : 'users';
  }
  if (action.startsWith('CONTENT_')) return 'content';
  if (action.startsWith('AIRPORT_')) return 'airports';
  if (
    action.startsWith('FIXED_PRICE_') ||
    action.startsWith('EMPTY_LEG_') ||
    action.startsWith('JET_CARD_') ||
    action.startsWith('TRAVEL_CREDIT') ||
    action.startsWith('PARTNER_')
  ) {
    return 'commercial';
  }
  return 'other';
}

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly redis: RedisService,
  ) {}

  async getStats() {
    const [users, bookings, quotes, partners, articles] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.booking.count(),
      this.prisma.quoteRequest.count(),
      this.prisma.partnerApplication.count({
        where: { reviewStatus: 'PENDING' },
      }),
      this.prisma.contentArticle.count({ where: { isPublished: true } }),
    ]);
    return {
      users,
      bookings,
      quoteRequests: quotes,
      pendingPartners: partners,
      publishedArticles: articles,
      generatedAt: new Date().toISOString(),
    };
  }

  async getRecentQuotes(limit = 10) {
    const quotes = await this.prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        legs: { include: { fromAirport: true, toAirport: true }, take: 1 },
      },
    });
    return quotes.map((q) => ({
      id: q.id,
      email: q.email,
      name: `${q.firstName} ${q.lastName}`,
      status: q.status,
      tripType: q.tripType,
      route: q.legs[0]
        ? `${q.legs[0].fromAirport.iata} → ${q.legs[0].toAirport.iata}`
        : null,
      createdAt: q.createdAt.toISOString(),
    }));
  }

  async getRecentBookings(limit = 10) {
    const bookings = await this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: true },
    });
    return bookings.map((b) => ({
      id: b.id,
      userId: b.userId,
      email: b.user.email,
      bookingType: b.bookingType,
      status: b.bookingStatus,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  /**
   * Flight calendar for Admin — same itinerary sources as web quotes/bookings:
   * BookingFlightLeg.departureAt, QuoteLeg.departureLocalAt, EmptyLeg windows.
   */
  async getFlightSchedule(fromIso?: string, toIso?: string) {
    const now = new Date();
    const from = fromIso
      ? new Date(fromIso)
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const to = toIso
      ? new Date(toIso)
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return {
        from: from.toISOString(),
        to: to.toISOString(),
        events: [],
        error: 'Invalid date range',
      };
    }

    const [bookingLegs, quoteLegs, emptyLegs, bookingsViaQuote] =
      await Promise.all([
        this.prisma.bookingFlightLeg.findMany({
          where: {
            departureAt: { gte: from, lte: to },
            booking: { bookingStatus: { not: 'CANCELLED' } },
          },
          include: {
            fromAirport: { select: { iata: true, city: true } },
            toAirport: { select: { iata: true, city: true } },
            booking: {
              select: {
                id: true,
                bookingCode: true,
                bookingStatus: true,
                user: { select: { email: true, firstName: true, lastName: true } },
              },
            },
            aircraft: { select: { registration: true } },
          },
          orderBy: { departureAt: 'asc' },
          take: 500,
        }),
        this.prisma.quoteLeg.findMany({
          where: {
            departureLocalAt: { gte: from, lte: to },
            quoteRequest: {
              status: { notIn: ['CANCELLED', 'EXPIRED'] },
            },
          },
          include: {
            fromAirport: { select: { iata: true, city: true } },
            toAirport: { select: { iata: true, city: true } },
            quoteRequest: {
              select: {
                id: true,
                status: true,
                email: true,
                firstName: true,
                lastName: true,
                bookings: { select: { id: true }, take: 1 },
              },
            },
          },
          orderBy: { departureLocalAt: 'asc' },
          take: 500,
        }),
        this.prisma.emptyLegOffer.findMany({
          where: {
            departAt: { gte: from, lte: to },
            status: 'ACTIVE',
          },
          include: {
            fromAirport: { select: { iata: true, city: true } },
            toAirport: { select: { iata: true, city: true } },
          },
          take: 200,
        }),
        // Bookings without BookingFlightLeg rows — use linked quote legs
        this.prisma.booking.findMany({
          where: {
            bookingStatus: { not: 'CANCELLED' },
            flightLegs: { none: {} },
            quoteRequest: {
              legs: {
                some: { departureLocalAt: { gte: from, lte: to } },
              },
            },
          },
          include: {
            user: { select: { email: true, firstName: true, lastName: true } },
            quoteRequest: {
              include: {
                legs: {
                  where: { departureLocalAt: { gte: from, lte: to } },
                  include: {
                    fromAirport: { select: { iata: true, city: true } },
                    toAirport: { select: { iata: true, city: true } },
                  },
                  orderBy: { seq: 'asc' },
                },
              },
            },
          },
          take: 200,
        }),
      ]);

    type FlightEvent = {
      id: string;
      source: 'booking' | 'quote' | 'empty_leg';
      bookingId?: number;
      quoteId?: number;
      bookingCode?: string | null;
      route: string;
      fromIata: string;
      toIata: string;
      departureAt: string;
      arrivalAt?: string | null;
      status: string;
      customer?: string;
      passengers?: number;
      aircraft?: string | null;
      href: string;
    };

    const events: FlightEvent[] = [];

    for (const leg of bookingLegs) {
      if (!leg.departureAt) continue;
      const name = leg.booking.user
        ? `${leg.booking.user.firstName ?? ''} ${leg.booking.user.lastName ?? ''}`.trim() ||
          leg.booking.user.email
        : undefined;
      events.push({
        id: `bfl-${leg.id}`,
        source: 'booking',
        bookingId: leg.booking.id,
        bookingCode: leg.booking.bookingCode,
        route: `${leg.fromAirport.iata} → ${leg.toAirport.iata}`,
        fromIata: leg.fromAirport.iata,
        toIata: leg.toAirport.iata,
        departureAt: leg.departureAt.toISOString(),
        arrivalAt: leg.arrivalAt?.toISOString() ?? null,
        status: leg.booking.bookingStatus,
        customer: name ?? leg.booking.user?.email,
        passengers: leg.passengerCount,
        aircraft: leg.aircraft?.registration ?? null,
        href: `/dashboard/bookings/${leg.booking.id}`,
      });
    }

    const bookingIdsCovered = new Set(events.map((e) => e.bookingId).filter(Boolean));

    for (const b of bookingsViaQuote) {
      if (bookingIdsCovered.has(b.id)) continue;
      for (const leg of b.quoteRequest?.legs ?? []) {
        const name = b.user
          ? `${b.user.firstName ?? ''} ${b.user.lastName ?? ''}`.trim() || b.user.email
          : undefined;
        events.push({
          id: `bkq-${b.id}-${leg.id}`,
          source: 'booking',
          bookingId: b.id,
          bookingCode: b.bookingCode,
          quoteId: b.quoteRequestId ?? undefined,
          route: `${leg.fromAirport.iata} → ${leg.toAirport.iata}`,
          fromIata: leg.fromAirport.iata,
          toIata: leg.toAirport.iata,
          departureAt: leg.departureLocalAt.toISOString(),
          status: b.bookingStatus,
          customer: name ?? b.user?.email,
          passengers: leg.passengers,
          href: `/dashboard/bookings/${b.id}`,
        });
      }
    }

    for (const leg of quoteLegs) {
      // Skip if already converted and shown as booking via quote
      if (leg.quoteRequest.bookings?.length) continue;
      events.push({
        id: `ql-${leg.id}`,
        source: 'quote',
        quoteId: leg.quoteRequest.id,
        route: `${leg.fromAirport.iata} → ${leg.toAirport.iata}`,
        fromIata: leg.fromAirport.iata,
        toIata: leg.toAirport.iata,
        departureAt: leg.departureLocalAt.toISOString(),
        status: leg.quoteRequest.status,
        customer:
          `${leg.quoteRequest.firstName} ${leg.quoteRequest.lastName}`.trim() ||
          leg.quoteRequest.email,
        passengers: leg.passengers,
        href: `/dashboard/quotes/${leg.quoteRequest.id}`,
      });
    }

    for (const el of emptyLegs) {
      events.push({
        id: `el-${el.id}`,
        source: 'empty_leg',
        route: `${el.fromAirport.iata} → ${el.toAirport.iata}`,
        fromIata: el.fromAirport.iata,
        toIata: el.toAirport.iata,
        departureAt: el.departAt.toISOString(),
        status: el.status ?? 'ACTIVE',
        href: '/dashboard/empty-legs',
      });
    }

    events.sort(
      (a, b) =>
        new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime(),
    );

    const upcoming = events
      .filter((e) => new Date(e.departureAt).getTime() >= Date.now() - 60 * 60 * 1000)
      .slice(0, 12);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      generatedAt: new Date().toISOString(),
      counts: {
        total: events.length,
        booking: events.filter((e) => e.source === 'booking').length,
        quote: events.filter((e) => e.source === 'quote').length,
        emptyLeg: events.filter((e) => e.source === 'empty_leg').length,
      },
      upcoming,
      events,
    };
  }

  async getRevenueDemo() {
    const payments = await this.prisma.payment.findMany({
      where: { status: 'PAID' },
      select: { amount: true, currency: true },
    });
    const total = payments.reduce((s, p) => s + Number(p.amount), 0);
    const demoMultiplier = payments.length === 0 ? 12 : 1;
    return {
      currency: 'USD',
      totalRevenue: total * demoMultiplier,
      paidTransactions: payments.length,
      note:
        payments.length === 0
          ? 'Demo calculation — no real payments yet'
          : 'From paid transactions',
      monthlyBreakdown: [
        { month: '2026-04', revenue: Math.round(total * 0.2 * demoMultiplier) },
        {
          month: '2026-05',
          revenue: Math.round(total * 0.35 * demoMultiplier),
        },
        {
          month: '2026-06',
          revenue: Math.round(total * 0.45 * demoMultiplier),
        },
      ],
    };
  }

  async getAuditLogs(
    page = 1,
    limit = 20,
    filters?: { action?: string; workflow?: string; q?: string },
  ) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const and: Prisma.AuditLogWhereInput[] = [];

    if (filters?.action) {
      and.push({ action: filters.action });
    } else if (filters?.workflow) {
      const wf = filters.workflow;
      if (wf === 'commercial') {
        and.push({
          OR: [
            { action: { startsWith: 'FIXED_PRICE_' } },
            { action: { startsWith: 'EMPTY_LEG_' } },
            { action: { startsWith: 'JET_CARD_' } },
            { action: { startsWith: 'TRAVEL_CREDIT' } },
            { action: { startsWith: 'PARTNER_' } },
          ],
        });
      } else if (wf === 'payments') {
        and.push({
          OR: [
            { action: { startsWith: 'PAYMENT_' } },
            { action: { startsWith: 'GATEWAY_' } },
            { action: { startsWith: 'STRIPE_' } },
          ],
        });
      } else if (wf === 'quotes') {
        and.push({ action: { startsWith: 'QUOTE_' } });
      } else if (wf === 'bookings') {
        and.push({ action: { startsWith: 'BOOKING_' } });
      } else if (wf === 'contracts') {
        and.push({
          OR: [
            { action: { startsWith: 'CONTRACT_' } },
            { action: { contains: 'DOCUSIGN' } },
          ],
        });
      } else if (wf === 'users') {
        and.push({ action: { startsWith: 'ADMIN_USER_' } });
      } else if (wf === 'permissions') {
        and.push({ action: { startsWith: 'PERMISSION_' } });
      } else if (wf === 'content') {
        and.push({ action: { startsWith: 'CONTENT_' } });
      } else if (wf === 'airports') {
        and.push({ action: { startsWith: 'AIRPORT_' } });
      }
    }

    if (filters?.q?.trim()) {
      const q = filters.q.trim();
      and.push({
        OR: [
          { action: { contains: q, mode: 'insensitive' } },
          { ipAddress: { contains: q, mode: 'insensitive' } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
        ],
      });
    }

    const where: Prisma.AuditLogWhereInput =
      and.length > 0 ? { AND: and } : {};

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { user: { select: { email: true } } },
      }),
    ]);
    return {
      data: logs.map((l) => ({
        id: l.id,
        action: l.action,
        userId: l.userId,
        userEmail: l.user?.email ?? null,
        details: l.details,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt.toISOString(),
        workflow: inferWorkflow(l.action),
      })),
      pagination: {
        page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
      workflows: [
        'quotes',
        'bookings',
        'payments',
        'contracts',
        'users',
        'content',
        'commercial',
        'airports',
        'permissions',
      ],
    };
  }

  async getSystemHealth() {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }
    const minioStatus = await this.storage.ping();
    const redisStatus = await this.redis.ping();
    return {
      status: dbStatus === 'ok' ? 'healthy' : 'degraded',
      services: {
        api: { status: 'ok', uptime: process.uptime() },
        database: { status: dbStatus },
        redis: { status: redisStatus },
        minio: { status: minioStatus },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
