import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { RedisService } from './redis.service';
import { AuditService } from './audit.service';
import { PermissionService } from './permission.service';
import type { AuthUser } from '../auth/auth.types';

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly redis: RedisService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionService,
  ) {}
  async getStats() {
    const [users, bookings, quotes, partners, articles] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.booking.count(),
      this.prisma.quoteRequest.count(),
      this.prisma.partnerApplication.count({ where: { reviewStatus: 'PENDING' } }),
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
      include: { legs: { include: { fromAirport: true, toAirport: true }, take: 1 } },
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

  async updateQuoteStatus(id: number, status: string, user?: AuthUser, ip?: string) {
    const allowed = ['PENDING', 'OFFERED', 'EXPIRED', 'CONVERTED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      throw new BadRequestException(`Invalid status. Allowed: ${allowed.join(', ')}`);
    }
    const existing = await this.prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Quote #${id} not found`);

    if (status === 'CANCELLED' && user) {
      await this.permissions.assertAllowed(user.userId, user.role, 'CANCEL_QUOTE', ip);
    }

    const updated = await this.prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });
    await this.audit.log(
      'QUOTE_STATUS_UPDATED',
      { quoteId: id, status, previous: existing.status },
      user?.userId,
      ip,
    );
    return {
      id: updated.id,
      status: updated.status,
      email: updated.email,
      message: `Quote #${id} → ${status}`,
    };
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
      note: payments.length === 0 ? 'Demo calculation — no real payments yet' : 'From paid transactions',
      monthlyBreakdown: [
        { month: '2026-04', revenue: Math.round(total * 0.2 * demoMultiplier) },
        { month: '2026-05', revenue: Math.round(total * 0.35 * demoMultiplier) },
        { month: '2026-06', revenue: Math.round(total * 0.45 * demoMultiplier) },
      ],
    };
  }

  async getAuditLogs(page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
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
      })),
      pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
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
