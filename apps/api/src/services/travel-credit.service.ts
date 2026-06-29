import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { RedeemCreditsDto, TravelCreditEnquiryDto } from '../dto';

export const TRAVEL_CREDIT_PACKAGES = [
  { id: 1, name: 'Starter', credits: 1000, price: 1000, currency: 'USD', validityMonths: 12 },
  { id: 2, name: 'Business', credits: 5000, price: 4500, currency: 'USD', validityMonths: 18 },
  { id: 3, name: 'Enterprise', credits: 15000, price: 12000, currency: 'USD', validityMonths: 24 },
];

@Injectable()
export class TravelCreditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  getPackages() {
    return { packages: TRAVEL_CREDIT_PACKAGES };
  }

  async createEnquiry(body: TravelCreditEnquiryDto) {
    if (!body.isConsentAccepted) {
      throw new BadRequestException('Consent is required');
    }
    const pkg = TRAVEL_CREDIT_PACKAGES.find((p) => p.id === body.packageId);
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

  async getBalance(userId = 1) {
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

  async redeem(body: RedeemCreditsDto, userId = 1) {
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
