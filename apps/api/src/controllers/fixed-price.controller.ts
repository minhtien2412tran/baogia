import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { BookFixedPriceDto } from '../dto';
import { FixedPriceService } from '../services/fixed-price.service';

@ApiTags('Fixed Price')
@ApiSecurity('X-API-Key')
@Controller('fixed-price')
export class FixedPriceController {
  constructor(private readonly fixedPriceService: FixedPriceService) {}

  @Get('routes')
  @ApiOperation({ summary: 'Get fixed-price routes' })
  @ApiQuery({ name: 'region', required: false, example: 'Europe' })
  @ApiResponse({ status: 200, description: 'List of fixed-price routes.' })
  getRoutes(@Query('region') region?: string) {
    return this.fixedPriceService.getRoutes(region);
  }

  @Get('routes/:slug')
  @ApiOperation({ summary: 'Get fixed-price route by slug' })
  @ApiParam({ name: 'slug', type: 'string', example: 'london-to-paris' })
  @ApiResponse({ status: 200, description: 'Route details, prices, and FAQs.' })
  getRouteBySlug(@Param('slug') slug: string) {
    return this.fixedPriceService.getRouteBySlug(slug);
  }

  @Post('quote')
  @ApiOperation({ summary: 'Request a booking quote for a fixed price route' })
  @ApiResponse({ status: 201, description: 'Booking quotation created.' })
  createFixedPriceQuote(@Body() body: BookFixedPriceDto) {
    return this.fixedPriceService.createQuote(body);
  }
}
