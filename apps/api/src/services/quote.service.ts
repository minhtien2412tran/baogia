import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { RequestQuoteDto, SearchAircraftDto } from '../dto';

@Injectable()
export class QuoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  searchAircraft(body: SearchAircraftDto) {
    return {
      searchId: `search-${Date.now()}`,
      tripType: body.tripType,
      options: [
        { categoryId: 1, categoryCode: 'LIGHT', categoryLabel: 'Light Jet', maxPassengers: 8, aircraftModel: 'Cessna Citation Latitude', estimatedPrice: 12500, currency: body.currency ?? 'USD' },
        { categoryId: 2, categoryCode: 'HEAVY', categoryLabel: 'Heavy Jet', maxPassengers: 16, aircraftModel: 'Gulfstream G650', estimatedPrice: 38000, currency: body.currency ?? 'USD' },
      ],
    };
  }

  async requestQuote(body: RequestQuoteDto) {
    if (!body.isConsentAccepted) throw new BadRequestException('Consent is required');
    if (!body.legs?.length) throw new BadRequestException('At least one leg is required');

    const legData: { seq: number; fromAirportId: number; toAirportId: number; departureLocalAt: Date; passengers: number }[] = [];
    for (let i = 0; i < body.legs.length; i++) {
      const leg = body.legs[i];
      const from = await this.prisma.airport.findUnique({ where: { iata: leg.fromAirport.toUpperCase() } });
      const to = await this.prisma.airport.findUnique({ where: { iata: leg.toAirport.toUpperCase() } });
      if (!from || !to) throw new BadRequestException(`Invalid airport: ${leg.fromAirport} or ${leg.toAirport}`);
      legData.push({ seq: i, fromAirportId: from.id, toAirportId: to.id, departureLocalAt: new Date(leg.departureDate), passengers: leg.passengers });
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
    return { requestId: quote.id, status: 'PENDING', message: 'Quote request received. Our team will contact you within 3 hours.' };
  }
}
