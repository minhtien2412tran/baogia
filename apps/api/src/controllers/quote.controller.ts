import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SearchAircraftDto, RequestQuoteDto, PaymentIntentDto, ConfirmPaymentDto } from '../dto';
import { QuoteService } from '../services/quote.service';

@ApiTags('Quotes & Bookings')
@Controller()
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post('quotes/search-aircraft')
  @ApiOperation({ summary: 'Search available aircraft options' })
  @ApiResponse({ status: 200, description: 'List of matching aircraft categories with pricing.' })
  searchAircraft(@Body() body: SearchAircraftDto) {
    return this.quoteService.searchAircraft(body);
  }

  @Post('quotes/request')
  @ApiOperation({ summary: 'Submit a formal quote request' })
  @ApiResponse({ status: 201, description: 'Quote request submitted.' })
  requestQuote(@Body() body: RequestQuoteDto) {
    return this.quoteService.requestQuote(body);
  }

  @Get('documents/charter-agreements/:id')
  @ApiOperation({ summary: 'Get details of a charter agreement document' })
  @ApiParam({ name: 'id', type: 'number', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Agreement document details.' })
  getCharterAgreement(@Param('id') id: number) {
    return {
      id: Number(id),
      bookingId: 101,
      documentType: 'CHARTER_AGREEMENT',
      policyVersion: '1.2',
      status: 'PENDING',
      fileUrl: 'http://localhost:9000/documents/charter-agreement-101.pdf',
      signerEmail: 'john.doe@example.com',
      createdAt: '2026-06-29T08:00:00Z',
    };
  }

  @Post('payments/intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created.' })
  createPaymentIntent(@Body() body: PaymentIntentDto) {
    return {
      paymentIntentId: 'pi_mock_123456',
      amount: 12500.0,
      currency: 'USD',
      method: body.method,
      status: 'PENDING',
    };
  }

  @Post('payments/confirm')
  @ApiOperation({ summary: 'Confirm a payment transaction' })
  @ApiResponse({ status: 200, description: 'Payment confirmed.' })
  confirmPayment(@Body() body: ConfirmPaymentDto) {
    return { paymentIntentId: body.paymentIntentId, status: 'PAID', message: 'Payment confirmed successfully.' };
  }

  @Post('payments/hold')
  @ApiOperation({ summary: 'Place a payment hold' })
  @ApiResponse({ status: 201, description: 'Hold placed.' })
  placeHold(@Body() body: PaymentIntentDto) {
    return { holdId: 'hold_mock_789', bookingId: body.bookingId, status: 'HELD', expiresAt: '2026-07-06T00:00:00Z' };
  }

  @Get('campaigns/world-cup/matches')
  @ApiOperation({ summary: 'List World Cup 2026 matches' })
  getWorldCupMatches() {
    return { matches: [{ id: 1, homeTeam: 'Brazil', awayTeam: 'Argentina', hostCity: 'Miami', matchDate: '2026-07-19T20:00:00Z' }] };
  }

  @Post('campaigns/world-cup/quotes')
  @ApiOperation({ summary: 'Submit World Cup charter quote' })
  requestWorldCupQuote(@Body() body: RequestQuoteDto) {
    return this.quoteService.requestQuote({ ...body, message: `[World Cup] ${body.message ?? ''}` });
  }
}
