import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { FleetService } from '../services/fleet.service';
import {
  UpdateFleetAvailabilityDto,
  UpdateFleetHourlyRateDto,
  UpdateFleetLocationDto,
} from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Admin Fleet')
@ApiSecurity('X-API-Key')
@Controller('admin/fleet')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminFleetController {
  constructor(private readonly fleet: FleetService) {}

  @Get()
  @ApiOperation({ summary: 'List fleet aircraft (physical tails)' })
  @ApiQuery({ name: 'status', required: false, example: 'AVAILABLE' })
  list(@Query('status') status?: string) {
    return this.fleet.list(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fleet aircraft by id' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.fleet.getById(id);
  }

  @Patch(':id/location')
  @ApiOperation({ summary: 'Update current parking airport (writes location history)' })
  updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateFleetLocationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.fleet.updateLocation(id, body, user.userId);
  }

  @Patch(':id/availability')
  @ApiOperation({ summary: 'Update fleet availability status' })
  updateAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateFleetAvailabilityDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.fleet.updateAvailability(id, body, user.userId);
  }

  @Patch(':id/hourly-rate')
  @ApiOperation({ summary: 'Update hourly rate / minimum billable hours' })
  updateHourlyRate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateFleetHourlyRateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.fleet.updateHourlyRate(id, body, user.userId);
  }
}
