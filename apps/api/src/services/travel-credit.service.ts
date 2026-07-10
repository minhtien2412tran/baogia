import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import {
  CreateTravelCreditPackageDto,
  RedeemCreditsDto,
  TravelCreditEnquiryDto,
  UpdateTravelCreditPackageDto,
} from '../dto';

@Injectable()
export class TravelCreditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private mapPackage(p: {
    id: number;
    name: string;
    creditAmount: { toString(): string } | number;
    priceUsd: { toString(): string } | number;
    bonusPct: { toString(): string } | number | null;
    validityMonths: number;
    currency: string;
    active: boolean;
  }) {
    return {
      id: p.id,
      name: p.name,
      creditAmount: Number(p.creditAmount),
      priceUsd: Number(p.priceUsd),
      bonusPct: p.bonusPct == null ? null : Number(p.bonusPct),
      validityMonths: p.validityMonths,
      currency: p.currency,
      active: p.active,
      // legacy aliases used by older clients
      credits: Number(p.creditAmount),
      price: Number(p.priceUsd),
    };
  }

  async getPackages(includeInactive = false) {
    const packages = await this.prisma.travelCreditPackage.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: { creditAmount: 'asc' },
    });
    return { packages: packages.map((p) => this.mapPackage(p)) };
  }

  async createPackage(body: CreateTravelCreditPackageDto) {
    const created = await this.prisma.travelCreditPackage.create({
      data: {
        name: body.name,
        creditAmount: body.creditAmount,
        priceUsd: body.priceUsd,
        bonusPct: body.bonusPct ?? null,
        validityMonths: body.validityMonths ?? 12,
        currency: body.currency ?? 'USD',
        active: body.active ?? true,
      },
    });
    await this.audit.log('TRAVEL_CREDIT_PACKAGE_CREATED', { id: created.id, name: created.name });
    return this.mapPackage(created);
  }

  async updatePackage(id: number, body: UpdateTravelCreditPackageDto) {
    const existing = await this.prisma.travelCreditPackage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Package #${id} not found`);

    const updated = await this.prisma.travelCreditPackage.update({
      where: { id },
      data: {
        ...(body.name != null ? { name: body.name } : {}),
        ...(body.creditAmount != null ? { creditAmount: body.creditAmount } : {}),
        ...(body.priceUsd != null ? { priceUsd: body.priceUsd } : {}),
        ...(body.bonusPct !== undefined ? { bonusPct: body.bonusPct } : {}),
        ...(body.validityMonths != null ? { validityMonths: body.validityMonths } : {}),
        ...(body.currency != null ? { currency: body.currency } : {}),
        ...(body.active != null ? { active: body.active } : {}),
      },
    });
    await this.audit.log('TRAVEL_CREDIT_PACKAGE_UPDATED', { id });
    return this.mapPackage(updated);
  }

  async deletePackage(id: number) {
    const existing = await this.prisma.travelCreditPackage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Package #${id} not found`);
    await this.prisma.travelCreditPackage.delete({ where: { id } });
    await this.audit.log('TRAVEL_CREDIT_PACKAGE_DELETED', { id, name: existing.name });
    return { ok: true, id };
  }

  async createEnquiry(body: TravelCreditEnquiryDto) {
    if (!body.isConsentAccepted) {
      throw new BadRequestException('Consent is required');
    }
    const pkg = await this.prisma.travelCreditPackage.findFirst({
      where: { id: body.packageId, active: true },
    });
    if (!pkg) throw new BadRequestException(`Package #${body.packageId} not found`);

    const record = await this.prisma.auditLog.create({
      data: {
        action: 'TRAVEL_CREDIT_ENQUIRY',
        details: {
          packageId: body.packageId,
          packageName: pkg.name,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          message: body.message ?? null,
        },
      },
    });

    return {
      enquiryId: record.id,
      packageId: body.packageId,
      status: 'PENDING',
      message: 'Thank you. Our team will contact you about Travel Credits.',
    };
  }

  async getBalance(userId: number) {
    const entries = await this.prisma.travelCreditLedger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const credits = entries.reduce((sum, e) => sum + Number(e.creditsDelta), 0);
    const expiryMap = new Map<string, number>();
    for (const e of entries) {
      if (Number(e.creditsDelta) <= 0) continue;
      const key = e.expiresAt.toISOString();
      expiryMap.set(key, (expiryMap.get(key) ?? 0) + Number(e.creditsDelta));
    }

    return {
      credits: Math.max(0, credits),
      currency: 'USD',
      expirySummary: [...expiryMap.entries()].map(([expiresAt, amount]) => ({
        amount,
        expiresAt,
      })),
    };
  }

  async redeem(body: RedeemCreditsDto, userId: number) {
    const balance = await this.getBalance(userId);
    if (body.credits > balance.credits) {
      throw new BadRequestException('Insufficient travel credits');
    }

    const booking = await this.prisma.booking.findUnique({ where: { id: body.bookingId } });
    if (!booking) throw new BadRequestException(`Booking #${body.bookingId} not found`);

    const payment = await this.prisma.payment.findFirst({
      where: { bookingId: body.bookingId },
      orderBy: { createdAt: 'desc' },
    });
    const originalPrice = payment ? Number(payment.amount) : 12500;
    const newPrice = Math.max(0, originalPrice - body.credits);

    await this.prisma.travelCreditLedger.create({
      data: {
        userId,
        bookingId: body.bookingId,
        creditsDelta: -body.credits,
        expiresAt: new Date('2099-12-31'),
        reason: 'REDEEM_FOR_BOOKING',
      },
    });

    await this.audit.log('TRAVEL_CREDITS_REDEEMED', {
      bookingId: body.bookingId,
      credits: body.credits,
      userId,
    });

    return {
      bookingId: body.bookingId,
      creditsRedeemed: body.credits,
      originalPrice,
      newPrice,
      currency: 'USD',
      message: 'Credits redeemed successfully.',
    };
  }

  async getAdminTransactions(page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [total, transactions] = await Promise.all([
      this.prisma.travelCreditLedger.count(),
      this.prisma.travelCreditLedger.findMany({
        include: { user: true, booking: true, company: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    return {
      data: transactions.map((t) => ({
        id: t.id,
        userId: t.userId,
        userEmail: t.user?.email ?? null,
        companyId: t.companyId,
        bookingId: t.bookingId,
        creditsDelta: Number(t.creditsDelta),
        reason: t.reason,
        expiresAt: t.expiresAt.toISOString(),
        createdAt: t.createdAt.toISOString(),
      })),
      pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
    };
  }
}
