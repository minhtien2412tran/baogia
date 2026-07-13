import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { EmptyLegRequestDto, EmptyLegAlertSubscribeDto } from '../dto';
import { EmptyLegService } from '../services/empty-leg.service';

@ApiTags('Empty Legs')
@ApiSecurity('X-API-Key')
@Controller('empty-legs')
export class EmptyLegController {
  constructor(private readonly emptyLegService: EmptyLegService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get available empty-leg offers (filter by continent/country/route/date)',
  })
  @ApiQuery({ name: 'continentCode', required: false, example: 'AS' })
  @ApiQuery({ name: 'countryCode', required: false, example: 'VN' })
  @ApiQuery({ name: 'fromIata', required: false })
  @ApiQuery({ name: 'toIata', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiResponse({ status: 200, description: 'List of empty legs.' })
  getEmptyLegs(
    @Query('continentCode') continentCode?: string,
    @Query('countryCode') countryCode?: string,
    @Query('fromIata') fromIata?: string,
    @Query('toIata') toIata?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.emptyLegService.getAll('ACTIVE', {
      continentCode,
      countryCode,
      fromIata,
      toIata,
      fromDate,
      toDate,
    });
  }

  @Post('alerts/subscribe')
  @ApiOperation({ summary: 'Subscribe to empty leg route alerts' })
  @ApiResponse({ status: 201, description: 'Alert subscription saved.' })
  subscribeAlerts(@Body() body: EmptyLegAlertSubscribeDto) {
    return this.emptyLegService.subscribeAlerts(body);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get empty-leg offer by slug' })
  @ApiParam({
    name: 'slug',
    type: 'string',
    example: 'paris-to-geneva-empty-leg',
  })
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
