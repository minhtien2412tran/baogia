import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CustomerCareService } from './customer-care/customer-care.service';
import { PaymentService } from './payment.service';
import { OnepayService } from './onepay.service';
import { NinepayService } from './ninepay.service';
import { CreateGatewayPaymentDto } from '../dto';
import {
  ConfirmPaymentDto,
  PaymentIntentDto,
  RequestQuoteDto,
  SearchAircraftDto,
} from '../dto';
import { PositioningPriceService } from './positioning-price.service';

const BASE_PRICE_BY_CATEGORY: Record<string, number> = {
  LIGHT: 12500,
  MIDSIZE: 22000,
  HEAVY: 38000,
  ULTRA_LONG: 55000,
};

@Injectable()
export class QuoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly customerCare: CustomerCareService,
    private readonly payments: PaymentService,
    private readonly onepay: OnepayService,
    private readonly ninepay: NinepayService,
    private readonly positioning: PositioningPriceService,
  ) {}

  async searchAircraft(body: SearchAircraftDto) {
    if (!body.legs?.length) throw new BadRequestException('At least one leg is required');

    const currency = body.currency ?? 'USD';
    const priced = await this.positioning.searchPricedOptions({
      tripType: body.tripType,
      legs: body.legs,
      currency,
    });

    if (priced.length > 0) {
      return {
        searchId: `search-${Date.now()}`,
        tripType: body.tripType,
        pricingMode: 'POSITIONING',
        options: priced.map((opt) => ({
          categoryId: opt.categoryId,
          categoryCode: opt.categoryCode,
          categoryLabel: opt.categoryLabel,
          maxPassengers: opt.maxPassengers,
          aircraftModel: opt.aircraftModel,
          estimatedPrice: opt.estimatedPrice,
          currency: opt.currency,
          operatorId: opt.operatorId,
          operatorName: opt.operatorName,
          tailNumber: opt.tailNumber,
          contractCode: opt.contractCode,
          baseAirport: opt.baseAirport,
          pricingBreakdown: opt.pricingBreakdown,
        })),
      };
    }

    // Fallback when fleet/contracts not seeded yet
    const maxPassengers = Math.max(...body.legs.map((l) => l.passengers ?? 1));
    let categories = await this.prisma.aircraftCategory.findMany({
      where: { maxPassengers: { gte: maxPassengers } },
      include: { models: { take: 1 } },
      orderBy: { maxPassengers: 'asc' },
      take: 4,
    });

    if (categories.length === 0) {
      categories = await this.prisma.aircraftCategory.findMany({
        include: { models: { take: 1 } },
        orderBy: { maxPassengers: 'desc' },
        take: 2,
      });
    }

    const options = categories.map((cat) => {
      const model = cat.models[0];
      const base = BASE_PRICE_BY_CATEGORY[cat.code] ?? 15000;
      const legMultiplier = body.legs.length > 1 ? 1.8 : 1;
      return {
        categoryId: cat.id,
        categoryCode: cat.code,
        categoryLabel: cat.label,
        maxPassengers: cat.maxPassengers,
        aircraftModel: model ? `${model.manufacturer} ${model.model}` : cat.label,
        estimatedPrice: Math.round(base * legMultiplier),
        currency,
      };
    });

    return {
      searchId: `search-${Date.now()}`,
      tripType: body.tripType,
      pricingMode: 'CATEGORY_FLAT',
      options,
    };
  }

  async requestQuote(
    body: RequestQuoteDto,
    opts?: { userId?: number; sourcePage?: string; campaignCode?: string },
  ) {
    if (!body.isConsentAccepted) throw new BadRequestException('Consent is required');
    if (!body.legs?.length) throw new BadRequestException('At least one leg is required');

    const legData: {
      seq: number;
      fromAirportId: number;
      toAirportId: number;
      departureLocalAt: Date;
      passengers: number;
    }[] = [];

    for (let i = 0; i < body.legs.length; i++) {
      const leg = body.legs[i];
      const from = await this.prisma.airport.findUnique({
        where: { iata: leg.fromAirport.toUpperCase() },
      });
      const to = await this.prisma.airport.findUnique({
        where: { iata: leg.toAirport.toUpperCase() },
      });
      if (!from || !to) {
        throw new BadRequestException(`Invalid airport: ${leg.fromAirport} or ${leg.toAirport}`);
      }
      legData.push({
        seq: i,
        fromAirportId: from.id,
        toAirportId: to.id,
        departureLocalAt: new Date(leg.departureDate),
        passengers: leg.passengers,
      });
    }

    const tripType =
      body.tripType ??
      (body.legs.length > 1 ? 'MULTI_CITY' : 'ONE_WAY');

    const quote = await this.prisma.quoteRequest.create({
      data: {
        userId: opts?.userId,
        email: body.email,
        phone: body.phone,
        firstName: body.firstName,
        lastName: body.lastName,
        tripType,
        message: body.message,
        isConsentAccepted: body.isConsentAccepted,
        sourcePage: opts?.sourcePage ?? 'WEB_QUOTE_FORM',
        legs: { create: legData },
        ...(opts?.campaignCode
          ? { worldCupItinerary: { create: { campaignCode: opts.campaignCode } } }
          : {}),
      },
    });

    if (opts?.userId) {
      await this.prisma.consentLog.create({
        data: {
          userId: opts.userId,
          subject: 'QUOTE_CONSENT',
          policyVersion: '1.0',
        },
      });
    }

    await this.audit.log(
      'QUOTE_REQUESTED',
      { quoteId: quote.id, email: body.email },
      opts?.userId,
    );
    void this.customerCare.onQuoteReceived({
      quoteId: quote.id,
      email: body.email,
      firstName: body.firstName,
      userId: opts?.userId,
    });
    return {
      requestId: quote.id,
      status: 'PENDING',
      message: 'Quote request received. Our team will contact you within 3 hours.',
    };
  }

  async getMyQuotes(userId: number, email: string) {
    const quotes = await this.prisma.quoteRequest.findMany({
      where: { OR: [{ userId }, { email }] },
      include: {
        legs: {
          include: { fromAirport: true, toAirport: true },
          orderBy: { seq: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return quotes.map((q) => ({
      id: q.id,
      status: q.status,
      tripType: q.tripType,
      createdAt: q.createdAt.toISOString(),
      legs: q.legs.map((leg) => ({
        from: leg.fromAirport.iata,
        to: leg.toAirport.iata,
        departure: leg.departureLocalAt.toISOString().slice(0, 10),
        passengers: leg.passengers,
      })),
    }));
  }

  async getWorldCupMatches() {
    const matches = await this.prisma.worldCupMatch.findMany({
      orderBy: { matchDate: 'asc' },
    });
    return {
      matches: matches.map((m) => ({
        id: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        hostCity: m.hostCity,
        stadium: m.stadium,
        stage: m.stage,
        matchDate: m.matchDate.toISOString(),
      })),
    };
  }

  async getCharterAgreement(id: number) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { booking: { include: { user: true } } },
    });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);

    return {
      id: doc.id,
      bookingId: doc.bookingId,
      documentType: doc.documentType,
      policyVersion: doc.policyVersion,
      status: doc.status,
      fileUrl: doc.fileUrl,
      signerEmail: doc.booking.user.email,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  async createPaymentIntent(body: PaymentIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: body.bookingId },
      include: { quoteOffer: true },
    });
    if (!booking) throw new NotFoundException(`Booking ${body.bookingId} not found`);

    const amount = booking.quoteOffer ? Number(booking.quoteOffer.price) : 12500;

    const transactionRef = `internal_${Date.now()}`;
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: body.bookingId,
        method: body.method,
        amount,
        currency: 'USD',
        status: 'PENDING',
        transactionRef,
      },
    });

    const stripeResult = await this.payments.createStripePaymentIntent({
      amount: Number(payment.amount),
      currency: payment.currency,
      bookingId: body.bookingId,
      paymentId: payment.id,
    });

    if (stripeResult) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { transactionRef: stripeResult.stripePaymentIntentId },
      });
    }

    await this.audit.log('PAYMENT_INTENT_CREATED', {
      paymentId: payment.id,
      bookingId: body.bookingId,
      gateway: stripeResult ? 'stripe' : 'internal',
    });

    return {
      paymentIntentId: String(payment.id),
      amount: Number(payment.amount),
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      gateway: stripeResult ? 'stripe' : 'internal',
      ...(stripeResult ? { clientSecret: stripeResult.clientSecret } : {}),
    };
  }

  async confirmPayment(body: ConfirmPaymentDto) {
    const paymentId = Number(body.paymentIntentId);
    if (Number.isNaN(paymentId)) {
      throw new BadRequestException('Invalid payment intent ID');
    }

    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (this.payments.isStripeEnabled() && payment.transactionRef?.startsWith('pi_')) {
      const ok = await this.payments.confirmStripePayment(payment.transactionRef);
      if (!ok) {
        throw new BadRequestException('Stripe payment not completed');
      }
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'PAID' },
    });

    await this.audit.log('PAYMENT_CONFIRMED', { paymentId: updated.id });
    void this.customerCare.onPaymentConfirmed(updated.id);

    return {
      paymentIntentId: String(updated.id),
      status: updated.status,
      message: 'Payment confirmed successfully.',
    };
  }

  async placeHold(body: PaymentIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: body.bookingId },
      include: { quoteOffer: true },
    });
    if (!booking) throw new NotFoundException(`Booking ${body.bookingId} not found`);

    const amount = booking.quoteOffer ? Number(booking.quoteOffer.price) : 12500;
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: body.bookingId,
        method: 'HOLD',
        amount,
        currency: 'USD',
        status: 'PENDING',
        transactionRef: `hold_${Date.now()}`,
      },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return {
      holdId: String(payment.id),
      bookingId: body.bookingId,
      status: 'HELD',
      expiresAt: expiresAt.toISOString(),
    };
  }

  async createGatewayPayment(body: CreateGatewayPaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: body.bookingId },
      include: { quoteOffer: true },
    });
    if (!booking) throw new NotFoundException(`Booking ${body.bookingId} not found`);

    const amount = booking.quoteOffer ? Number(booking.quoteOffer.price) : 12500;
    const orderRef = `jbay-${body.bookingId}-${Date.now()}`;
    const apiBase = process.env.API_PUBLIC_URL ?? 'http://127.0.0.1:4000';
    const returnUrl =
      body.returnUrl ??
      (body.gateway === 'onepay'
        ? `${apiBase}/payments/onepay/return`
        : `${apiBase}/payments/9pay/return`);

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: body.bookingId,
        method: body.gateway === 'onepay' ? 'BANK_TRANSFER' : 'CREDIT_CARD',
        amount,
        currency: body.gateway === 'onepay' ? 'VND' : 'VND',
        status: 'PENDING',
        transactionRef: orderRef,
      },
    });

    const urlResult =
      body.gateway === 'onepay'
        ? this.onepay.createPaymentUrl({ orderId: orderRef, amount: amount * 25000, returnUrl, currency: 'VND' })
        : this.ninepay.createPaymentUrl({ orderId: orderRef, amount: amount * 25000, returnUrl, currency: 'VND' });

    if (!urlResult) {
      throw new BadRequestException(
        `${body.gateway} is not configured. Set merchant credentials in environment.`,
      );
    }

    await this.audit.log('GATEWAY_PAYMENT_CREATED', {
      paymentId: payment.id,
      gateway: body.gateway,
      orderRef,
    });

    return {
      paymentId: payment.id,
      orderRef,
      gateway: urlResult.gateway,
      redirectUrl: urlResult.redirectUrl,
      amount,
    };
  }

  async handleOnepayReturn(query: Record<string, string>) {
    const ok = this.onepay.verifyIpn(query);
    const orderRef = query.vpc_MerchTxnRef;
    if (ok && orderRef) await this.markGatewayPaid(orderRef);
    return { status: ok ? 'success' : 'failed', orderRef };
  }

  async handleOnepayIpn(query: Record<string, string>) {
    const ok = this.onepay.verifyIpn(query);
    if (ok && query.vpc_MerchTxnRef) await this.markGatewayPaid(query.vpc_MerchTxnRef);
    return ok;
  }

  async handleNinepayReturn(query: Record<string, string>) {
    const ok = this.ninepay.verifyIpn(query);
    const orderRef = query.invoice_no;
    if (ok && orderRef) await this.markGatewayPaid(orderRef);
    return { status: ok ? 'success' : 'failed', orderRef };
  }

  async handleNinepayIpn(body: Record<string, string>) {
    const ok = this.ninepay.verifyIpn(body);
    if (ok && body.invoice_no) await this.markGatewayPaid(body.invoice_no);
    return ok;
  }

  private async markGatewayPaid(orderRef: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { transactionRef: orderRef },
    });
    if (!payment || payment.status === 'PAID') return;
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PAID' },
    });
    await this.audit.log('GATEWAY_PAYMENT_CONFIRMED', { paymentId: payment.id, orderRef });
    void this.customerCare.onPaymentConfirmed(payment.id);
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    const event = this.payments.constructStripeEvent(payload, signature);
    if (!event) return { received: false };

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as { id: string; metadata?: { paymentId?: string } };
      const paymentId = intent.metadata?.paymentId ? Number(intent.metadata.paymentId) : null;
      if (paymentId) {
        await this.prisma.payment.updateMany({
          where: { id: paymentId, status: { not: 'PAID' } },
          data: { status: 'PAID', transactionRef: intent.id },
        });
        await this.audit.log('STRIPE_PAYMENT_CONFIRMED', { paymentId, intentId: intent.id });
        void this.customerCare.onPaymentConfirmed(paymentId);
      }
    }

    return { received: true, type: event.type };
  }
}
