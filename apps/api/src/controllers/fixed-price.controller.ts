import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BookFixedPriceDto } from '../dto';

@ApiTags('Fixed Price')
@Controller('fixed-price')
export class FixedPriceController {
  @Get('routes')
  @ApiOperation({ summary: 'Get fixed-price routes' })
  @ApiQuery({ name: 'region', required: false, example: 'Europe' })
  @ApiResponse({ status: 200, description: 'List of fixed-price routes.' })
  getRoutes(@Query('region') region?: string) {
    return {
      region: region ?? 'Global',
      routes: [
        {
          id: 1,
          slug: 'london-to-paris',
          fromAirport: { iata: 'LHR', city: 'London', country: 'UK' },
          toAirport: { iata: 'LBG', city: 'Paris', country: 'France' },
          region: 'Europe',
          status: 'ACTIVE',
          priceOptions: [
            { category: 'LIGHT', price: 9500.0, paxLimit: 8 },
            { category: 'MIDSIZE', price: 14500.0, paxLimit: 10 }
          ]
        },
        {
          id: 2,
          slug: 'new-york-to-miami',
          fromAirport: { iata: 'TEB', city: 'New York', country: 'USA' },
          toAirport: { iata: 'OPF', city: 'Miami', country: 'USA' },
          region: 'North America',
          status: 'ACTIVE',
          priceOptions: [
            { category: 'LIGHT', price: 16000.0, paxLimit: 8 },
            { category: 'MIDSIZE', price: 23000.0, paxLimit: 10 }
          ]
        }
      ]
    };
  }

  @Get('routes/:slug')
  @ApiOperation({ summary: 'Get fixed-price route by slug' })
  @ApiParam({ name: 'slug', type: 'string', example: 'london-to-paris' })
  @ApiResponse({ status: 200, description: 'Route details, prices, and FAQs.' })
  getRouteBySlug(@Param('slug') slug: string) {
    return {
      id: 1,
      slug: slug,
      fromAirport: { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
      toAirport: { iata: 'LBG', name: 'Le Bourget Airport', city: 'Paris', country: 'France' },
      region: 'Europe',
      status: 'ACTIVE',
      priceOptions: [
        { category: 'LIGHT', price: 9500.0, paxLimit: 8, model: 'Cessna Citation Latitude' },
        { category: 'MIDSIZE', price: 14500.0, paxLimit: 10, model: 'Bombardier Challenger 350' }
      ],
      whatsIncluded: [
        'Private aircraft charter flight',
        'VIP lounge access',
        'Standard catering on board',
        'Luggage allowance'
      ],
      whatsNotIncluded: [
        'De-icing fees (if applicable)',
        'Ground transportation',
        'Special catering request'
      ],
      faqs: [
        { question: 'Can I change my flight date?', answer: 'Yes, up to 48 hours before departure. Fees may apply.' }
      ]
    };
  }

  @Post('quote')
  @ApiOperation({ summary: 'Request a booking quote for a fixed price route' })
  @ApiResponse({ status: 201, description: 'Booking quotation created.' })
  createFixedPriceQuote(@Body() body: BookFixedPriceDto) {
    return {
      quoteId: 777,
      routeId: body.routeId,
      category: body.category,
      price: body.category === 'LIGHT' ? 9500.0 : 14500.0,
      currency: 'USD',
      status: 'PENDING',
      message: 'Fixed-price quote generated. Proceed to payment verification.',
    };
  }
}
