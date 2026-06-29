import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmptyLegRequestDto, EmptyLegAlertSubscribeDto } from '../dto';
import { EmptyLegService } from '../services/empty-leg.service';

@ApiTags('Empty Legs')
@Controller('empty-legs')
export class EmptyLegController {
  constructor(private readonly emptyLegService: EmptyLegService) {}

  @Get()
  @ApiOperation({ summary: 'Get available empty-leg offers' })
  @ApiResponse({ status: 200, description: 'List of empty legs.' })
  getEmptyLegs() {
    return this.emptyLegService.getAll('ACTIVE');
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
