import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import {
  ConfirmPaymentDto,
  PaymentIntentDto,
  RequestQuoteDto,
  SearchAircraftDto,
} from '../dto';

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
  ) {}

  async searchAircraft(body: SearchAircraftDto) {
    if (!body.legs?.length) throw new BadRequestException('At least one leg is required');

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

    const currency = body.currency ?? 'USD';
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
      options,
    };
  }

  async requestQuote(body: RequestQuoteDto) {
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

    const quote = await this.prisma.quoteRequest.create({
      data: {
        email: body.email,
        phone: body.phone,
        firstName: body.firstName,
        lastName: body.lastName,
        message: body.message,
        isConsentAccepted: body.isConsentAccepted,
        sourcePage: 'WEB_QUOTE_FORM',
        legs: { create: legData },
      },
    });

    await this.audit.log('QUOTE_REQUESTED', { quoteId: quote.id, email: body.email });
    return {
      requestId: quote.id,
      status: 'PENDING',
      message: 'Quote request received. Our team will contact you within 3 hours.',
    };
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

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: body.bookingId,
        method: body.method,
        amount,
        currency: 'USD',
        status: 'PENDING',
        transactionRef: `pi_${Date.now()}`,
      },
    });

    await this.audit.log('PAYMENT_INTENT_CREATED', {
      paymentId: payment.id,
      bookingId: body.bookingId,
    });

    return {
      paymentIntentId: String(payment.id),
      amount: Number(payment.amount),
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
    };
  }

  async confirmPayment(body: ConfirmPaymentDto) {
    const paymentId = Number(body.paymentIntentId);
    if (Number.isNaN(paymentId)) {
      throw new BadRequestException('Invalid payment intent ID');
    }

    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'PAID' },
    });

    await this.audit.log('PAYMENT_CONFIRMED', { paymentId: updated.id });

    return {
      paymentIntentId: String(updated.id),
      status: updated.status,
      message: 'Payment confirmed successfully.',
    };
  }

  async placeHold(body: PaymentIntentDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: body.bookingId } });
    if (!booking) throw new NotFoundException(`Booking ${body.bookingId} not found`);

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: body.bookingId,
        method: 'HOLD',
        amount: 12500,
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
}
