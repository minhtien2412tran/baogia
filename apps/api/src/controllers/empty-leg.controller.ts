import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiSecurity,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EmptyLegRequestDto, EmptyLegAlertSubscribeDto } from '../dto';
import { EmptyLegService, type EmptyLegListFilters } from '../services/empty-leg.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Empty Legs')
@ApiSecurity('X-API-Key')
@Controller('empty-legs')
export class EmptyLegController {
  constructor(private readonly emptyLegService: EmptyLegService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get available empty-leg offers (filter by continent/country/airport/date; JWT applies airport scope)',
  })
  @ApiQuery({ name: 'fromContinent', required: false, example: 'AS' })
  @ApiQuery({ name: 'toContinent', required: false, example: 'AS' })
  @ApiQuery({ name: 'fromCountry', required: false, example: 'VN' })
  @ApiQuery({ name: 'toCountry', required: false })
  @ApiQuery({ name: 'fromCity', required: false })
  @ApiQuery({ name: 'toCity', required: false })
  @ApiQuery({ name: 'fromAirport', required: false, example: 'SGN' })
  @ApiQuery({ name: 'toAirport', required: false, example: 'HAN' })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'passengers', required: false })
  @ApiQuery({ name: 'categoryCode', required: false, example: 'HEAVY' })
  @ApiQuery({ name: 'priceMin', required: false })
  @ApiQuery({ name: 'priceMax', required: false })
  @ApiResponse({ status: 200, description: 'List of empty legs.' })
  getEmptyLegs(
    @CurrentUser() user: AuthUser | undefined,
    @Query('fromContinent') fromContinent?: string,
    @Query('toContinent') toContinent?: string,
    @Query('fromCountry') fromCountry?: string,
    @Query('toCountry') toCountry?: string,
    @Query('fromCity') fromCity?: string,
    @Query('toCity') toCity?: string,
    @Query('fromAirport') fromAirport?: string,
    @Query('toAirport') toAirport?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('passengers') passengers?: string,
    @Query('categoryCode') categoryCode?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
  ) {
    const filters: EmptyLegListFilters = {
      fromContinent,
      toContinent,
      fromCountry,
      toCountry,
      fromCity,
      toCity,
      fromAirport,
      toAirport,
      dateFrom,
      dateTo,
      passengers: passengers ? Number(passengers) : undefined,
      categoryCode,
      priceMin: priceMin != null && priceMin !== '' ? Number(priceMin) : undefined,
      priceMax: priceMax != null && priceMax !== '' ? Number(priceMax) : undefined,
    };
    return this.emptyLegService.getAll('ACTIVE', filters, user ?? null);
  }

  @Post('alerts/subscribe')
  @ApiOperation({ summary: 'Subscribe to empty leg route alerts' })
  @ApiResponse({ status: 201, description: 'Alert subscription saved.' })
  subscribeAlerts(@Body() body: EmptyLegAlertSubscribeDto) {
    return this.emptyLegService.subscribeAlerts(body);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get empty-leg offer by slug' })
  @ApiParam({ name: 'slug', type: 'string', example: 'paris-to-geneva-empty-leg' })
  @ApiResponse({ status: 200, description: 'Empty-leg details.' })
  getEmptyLegBySlug(@Param('slug') slug: string) {
    return this.emptyLegService.getBySlug(slug);
  }

  @Post(':id/request')
  @ApiOperation({ summary: 'Request an empty-leg offer' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 201, description: 'Request submitted.' })
  requestEmptyLeg(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EmptyLegRequestDto,
  ) {
    return this.emptyLegService.requestOffer(id, body);
  }
}
