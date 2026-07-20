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
