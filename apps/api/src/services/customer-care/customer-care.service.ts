import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email.service';
import { type CampaignKey, renderEmailTemplate } from './email-templates';

type ScheduleInput = {
  campaignKey: CampaignKey;
  email: string;
  userId?: number;
  locale?: string;
  referenceId?: string;
  scheduledAt?: Date;
  meta?: Record<string, unknown>;
  immediate?: boolean;
};

@Injectable()
export class CustomerCareService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CustomerCareService.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  onModuleInit() {
    if (process.env.CUSTOMER_CARE_ENABLED === 'false') {
      this.logger.warn(
        'Customer care email automation disabled (CUSTOMER_CARE_ENABLED=false)',
      );
      return;
    }
    const ms = Number(process.env.CUSTOMER_CARE_POLL_MS ?? 120_000);
    void this.processQueue();
    this.timer = setInterval(() => void this.processQueue(), ms);
    this.logger.log(`Customer care scheduler started (every ${ms}ms)`);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private isDeliverable(email: string): boolean {
    return email.includes('@') && !email.endsWith('@phone.jetbay.local');
  }

  private normalizeLocale(locale?: string): string {
    if (!locale) return 'en';
    const raw = locale.toLowerCase().trim();
    if (raw.startsWith('vi')) return 'vi';
    if (raw.startsWith('zh')) return 'zh-cn';
    if (raw.startsWith('ja')) return 'ja';
    if (raw.startsWith('ko')) return 'ko';
    if (raw.startsWith('th')) return 'th';
    if (raw.startsWith('id') || raw === 'in') return 'id';
    if (raw.startsWith('fr')) return 'fr';
    if (raw.startsWith('de')) return 'de';
    if (raw.startsWith('es')) return 'es';
    if (raw.startsWith('it')) return 'it';
    if (raw.startsWith('ru')) return 'ru';
    if (raw.startsWith('ar')) return 'ar';
    return 'en';
  }

  async scheduleCampaign(input: ScheduleInput): Promise<void> {
    if (!this.isDeliverable(input.email)) return;

    const referenceId = input.referenceId ?? '';
    const locale = this.normalizeLocale(input.locale);
    const scheduledAt = input.scheduledAt ?? new Date();

    try {
      const log = await this.prisma.emailCampaignLog.upsert({
        where: {
          campaignKey_email_referenceId: {
            campaignKey: input.campaignKey,
            email: input.email.toLowerCase(),
            referenceId,
          },
        },
        create: {
          campaignKey: input.campaignKey,
          email: input.email.toLowerCase(),
          userId: input.userId,
          referenceId,
          locale,
          scheduledAt,
          meta: (input.meta ?? {}) as Prisma.InputJsonValue,
          status: 'PENDING',
        },
        update: {},
      });

      if (log.status === 'SENT') return;

      if (input.immediate || scheduledAt <= new Date()) {
        await this.sendLog(log.id);
      }
    } catch (err) {
      this.logger.error(
        `scheduleCampaign failed: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async onUserRegistered(opts: {
    userId: number;
    email: string;
    firstName?: string | null;
    locale?: string;
  }) {
    await this.scheduleCampaign({
      campaignKey: 'welcome_register',
      email: opts.email,
      userId: opts.userId,
      locale: opts.locale,
      referenceId: String(opts.userId),
      meta: { firstName: opts.firstName ?? undefined },
      immediate: true,
    });
  }

  async onQuoteReceived(opts: {
    quoteId: number;
    email: string;
    firstName: string;
    userId?: number;
    locale?: string;
    tripSummary?: string;
  }) {
    const meta = {
      requestId: opts.quoteId,
      firstName: opts.firstName,
      tripSummary: opts.tripSummary,
    };
    await this.scheduleCampaign({
      campaignKey: 'quote_received',
      email: opts.email,
      userId: opts.userId,
      locale: opts.locale,
      referenceId: String(opts.quoteId),
      meta,
      immediate: true,
    });

    const followUpAt = new Date();
    followUpAt.setHours(followUpAt.getHours() + 24);
    await this.scheduleCampaign({
      campaignKey: 'quote_followup_24h',
      email: opts.email,
      userId: opts.userId,
      locale: opts.locale,
      referenceId: String(opts.quoteId),
      meta,
      scheduledAt: followUpAt,
    });
  }

  /** Semi-auto: admin created an offer → email customer. */
  async onQuoteOffered(opts: {
    quoteId: number;
    offerId: number;
    email: string;
    firstName: string;
    userId?: number | null;
    locale?: string;
    price: number;
    currency?: string;
    aircraft?: string;
  }) {
    await this.scheduleCampaign({
      campaignKey: 'quote_offered',
      email: opts.email,
      userId: opts.userId ?? undefined,
      locale: opts.locale,
      referenceId: `offer-${opts.offerId}`,
      meta: {
        requestId: opts.quoteId,
        offerId: opts.offerId,
        firstName: opts.firstName,
        price: opts.price,
        currency: opts.currency ?? 'USD',
        aircraft: opts.aircraft,
      },
      immediate: true,
    });
  }

  async onBookingCancelled(opts: {
    bookingId: number;
    email: string;
    userId?: number;
    firstName?: string | null;
    locale?: string;
  }) {
    await this.scheduleCampaign({
      campaignKey: 'booking_cancelled',
      email: opts.email,
      userId: opts.userId,
      locale: opts.locale,
      referenceId: String(opts.bookingId),
      meta: {
        bookingId: opts.bookingId,
        firstName: opts.firstName ?? undefined,
      },
      immediate: true,
    });
  }

  async onNewsletterSubscribe(email: string, locale?: string) {
    const normalized = email.toLowerCase();
    await this.prisma.emailSubscriber.upsert({
      where: { email: normalized },
      create: {
        email: normalized,
        locale: this.normalizeLocale(locale),
        source: 'NEWSLETTER',
      },
      update: { status: 'ACTIVE', locale: this.normalizeLocale(locale) },
    });

    await this.scheduleCampaign({
      campaignKey: 'newsletter_welcome',
      email: normalized,
      locale,
      referenceId: normalized,
      immediate: true,
    });
  }

  async onBookingCreated(opts: {
    bookingId: number;
    bookingReference: string;
    userId: number;
    email: string;
    firstName?: string | null;
    locale?: string;
    aircraftLabel?: string;
    passengerCount?: number;
    itinerary?: string;
    departureDateTime?: string;
    departureTimezone?: string;
  }) {
    await this.scheduleCampaign({
      campaignKey: 'booking_created',
      email: opts.email,
      userId: opts.userId,
      locale: opts.locale,
      referenceId: `${opts.bookingReference}:PENDING:created`,
      meta: {
        bookingId: opts.bookingId,
        bookingReference: opts.bookingReference,
        firstName: opts.firstName ?? undefined,
        aircraftLabel: opts.aircraftLabel,
        passengerCount: opts.passengerCount,
        itinerary: opts.itinerary,
        departureDateTime: opts.departureDateTime,
        departureTimezone: opts.departureTimezone,
      },
      immediate: true,
    });
  }

  async onPaymentConfirmed(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            user: true,
            quoteRequest: true,
          },
        },
      },
    });
    const user = payment?.booking?.user;
    if (!payment || !user) return;

    await this.scheduleCampaign({
      campaignKey: 'payment_confirmed',
      email: user.email,
      userId: user.id,
      locale: payment.booking.quoteRequest?.locale ?? undefined,
      referenceId: String(paymentId),
      meta: {
        bookingId: payment.bookingId,
        amount: Number(payment.amount),
        currency: payment.currency,
        firstName: user.firstName ?? undefined,
      },
      immediate: true,
    });
  }

  async processQueue(): Promise<void> {
    try {
      await this.scanQuoteFollowups();
      await this.scanNurtureEmails();

      const due = await this.prisma.emailCampaignLog.findMany({
        where: { status: 'PENDING', scheduledAt: { lte: new Date() } },
        orderBy: { scheduledAt: 'asc' },
        take: 30,
      });

      for (const row of due) {
        await this.sendLog(row.id);
      }
    } catch (err) {
      this.logger.error(
        `processQueue error: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  private async sendLog(logId: number): Promise<void> {
    const log = await this.prisma.emailCampaignLog.findUnique({
      where: { id: logId },
    });
    if (!log || log.status !== 'PENDING') return;
    if (!this.isDeliverable(log.email)) {
      await this.prisma.emailCampaignLog.update({
        where: { id: logId },
        data: { status: 'SKIPPED', error: 'undeliverable email' },
      });
      return;
    }

    const meta = { ...((log.meta as Record<string, unknown> | null) ?? {}) };
    const template = renderEmailTemplate(
      log.campaignKey as CampaignKey,
      log.locale,
      meta,
    );
    const result = await this.email.sendMail({
      to: log.email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    if (result.sent) {
      await this.prisma.emailCampaignLog.update({
        where: { id: logId },
        data: { status: 'SENT', sentAt: new Date(), error: null },
      });
      return;
    }

    const attempts = Number(meta.attempts ?? 0) + 1;
    meta.attempts = attempts;
    const retryable = attempts < 3;
    const nextAttempt = new Date(Date.now() + 15 * 60 * 1000);
    await this.prisma.emailCampaignLog.update({
      where: { id: logId },
      data: {
        status: retryable ? 'PENDING' : 'FAILED',
        scheduledAt: retryable ? nextAttempt : log.scheduledAt,
        error: result.reason ?? 'Email delivery failed',
        meta: meta as Prisma.InputJsonValue,
      },
    });
    this.logger.warn(
      `Email campaign ${logId} ${retryable ? 'scheduled for retry' : 'failed permanently'} (attempt ${attempts})`,
    );
  }

  private async scanQuoteFollowups(): Promise<void> {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);

    const quotes = await this.prisma.quoteRequest.findMany({
      where: { status: 'PENDING', createdAt: { lte: cutoff } },
      select: { id: true, email: true, userId: true, firstName: true },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });

    for (const q of quotes) {
      const existing = await this.prisma.emailCampaignLog.findUnique({
        where: {
          campaignKey_email_referenceId: {
            campaignKey: 'quote_followup_24h',
            email: q.email.toLowerCase(),
            referenceId: String(q.id),
          },
        },
      });
      if (existing?.status === 'SENT') continue;

      await this.scheduleCampaign({
        campaignKey: 'quote_followup_24h',
        email: q.email,
        userId: q.userId ?? undefined,
        referenceId: String(q.id),
        meta: { requestId: q.id, firstName: q.firstName },
        immediate: true,
      });
    }
  }

  private async scanNurtureEmails(): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 3);

    const subs = await this.prisma.emailSubscriber.findMany({
      where: { status: 'ACTIVE', createdAt: { lte: cutoff } },
      take: 30,
      orderBy: { createdAt: 'asc' },
    });

    for (const sub of subs) {
      const hasQuote = await this.prisma.quoteRequest.findFirst({
        where: { email: sub.email },
        select: { id: true },
      });
      if (hasQuote) continue;

      await this.scheduleCampaign({
        campaignKey: 'nurture_day3',
        email: sub.email,
        userId: sub.userId ?? undefined,
        locale: sub.locale,
        referenceId: `sub-${sub.id}`,
        meta: {},
        immediate: true,
      });
    }
  }
}
