import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SearchAircraftDto, RequestQuoteDto, PaymentIntentDto, ConfirmPaymentDto } from '../dto';

@ApiTags('Quotes & Bookings')
@Controller()
export class QuoteController {
  @Post('quotes/search-aircraft')
  @ApiOperation({ summary: 'Search available aircraft options' })
  @ApiResponse({ status: 200, description: 'List of matching aircraft categories with pricing.' })
  searchAircraft(@Body() body: SearchAircraftDto) {
    return {
      searchId: 'search-task-123456',
      tripType: body.tripType,
      options: [
        {
          categoryId: 1,
          categoryCode: 'LIGHT',
          categoryLabel: 'Light Jet',
          maxPassengers: 8,
          aircraftModel: 'Cessna Citation Latitude',
          estimatedPrice: 12500.0,
          currency: body.currency ?? 'USD',
        },
        {
          categoryId: 2,
          categoryCode: 'HEAVY',
          categoryLabel: 'Heavy Jet',
          maxPassengers: 16,
          aircraftModel: 'Gulfstream G650',
          estimatedPrice: 38000.0,
          currency: body.currency ?? 'USD',
        }
      ]
    };
  }

  @Post('quotes/request')
  @ApiOperation({ summary: 'Submit a formal quote request' })
  @ApiResponse({ status: 201, description: 'Quote request submitted.' })
  requestQuote(@Body() body: RequestQuoteDto) {
    return {
      requestId: 999,
      status: 'PENDING',
      message: 'Quote request received. Our team will review and contact you within 3 hours.',
    };
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
    return {
      status: 'PAID',
      transactionRef: 'tx_confirmed_7890',
      confirmedAt: new Date().toISOString(),
    };
  }

  @Post('payments/hold')
  @ApiOperation({ summary: 'Hold card balance and set bank transfer intent' })
  @ApiResponse({ status: 200, description: 'Card hold initiated.' })
  holdPayment(@Body() body: PaymentIntentDto) {
    return {
      status: 'HOLD_ACTIVE',
      holdAmount: 2000.0,
      description: 'Card hold active. Complete bank transfer within 48 hours to secure booking.',
    };
  }

  @Get('campaigns/world-cup/matches')
  @ApiOperation({ summary: 'Get official match calendar with filters' })
  @ApiQuery({ name: 'stage', required: false, example: 'Group Stage' })
  @ApiQuery({ name: 'hostCity', required: false, example: 'New York' })
  @ApiResponse({ status: 200, description: 'Match list.' })
  getWorldCupMatches(@Query('stage') stage?: string, @Query('hostCity') hostCity?: string) {
    return {
      matches: [
        {
          id: 1,
          matchDate: '2026-06-15T18:00:00Z',
          stage: stage ?? 'Group Stage',
          homeTeam: 'USA',
          awayTeam: 'England',
          hostCity: hostCity ?? 'New York',
          stadium: 'MetLife Stadium',
        },
        {
          id: 2,
          matchDate: '2026-06-20T15:00:00Z',
          stage: stage ?? 'Group Stage',
          homeTeam: 'Mexico',
          awayTeam: 'Brazil',
          hostCity: hostCity ?? 'Los Angeles',
          stadium: 'SoFi Stadium',
        }
      ]
    };
  }

  @Post('campaigns/world-cup/quotes')
  @ApiOperation({ summary: 'Submit World Cup booking quote request' })
  @ApiResponse({ status: 201, description: 'World Cup Quote request submitted.' })
  requestWorldCupQuote(@Body() body: RequestQuoteDto) {
    return {
      quoteId: 1001,
      campaign: 'WORLD_CUP_2026',
      status: 'PENDING',
      message: 'World Cup Quote request received. Matches and routing logged.',
    };
  }
}
