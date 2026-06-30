import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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
  getCharterAgreement(@Param('id', ParseIntPipe) id: number) {
    return this.quoteService.getCharterAgreement(id);
  }

  @Post('payments/intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created.' })
  createPaymentIntent(@Body() body: PaymentIntentDto) {
    return this.quoteService.createPaymentIntent(body);
  }

  @Post('payments/confirm')
  @ApiOperation({ summary: 'Confirm a payment transaction' })
  @ApiResponse({ status: 200, description: 'Payment confirmed.' })
  confirmPayment(@Body() body: ConfirmPaymentDto) {
    return this.quoteService.confirmPayment(body);
  }

  @Post('payments/hold')
  @ApiOperation({ summary: 'Place a payment hold' })
  @ApiResponse({ status: 201, description: 'Hold placed.' })
  placeHold(@Body() body: PaymentIntentDto) {
    return this.quoteService.placeHold(body);
  }

  @Get('campaigns/world-cup/matches')
  @ApiOperation({ summary: 'List World Cup 2026 matches' })
  getWorldCupMatches() {
    return this.quoteService.getWorldCupMatches();
  }

  @Post('campaigns/world-cup/quotes')
  @ApiOperation({ summary: 'Submit World Cup charter quote' })
  requestWorldCupQuote(@Body() body: RequestQuoteDto) {
    return this.quoteService.requestQuote({
      ...body,
      message: `[World Cup] ${body.message ?? ''}`,
    });
  }
}
