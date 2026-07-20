import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { AircraftService } from '../services/aircraft.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';

@ApiTags('Admin Aircraft')
@ApiSecurity('X-API-Key')
@Controller('admin/aircraft')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminAircraftController {
  constructor(private readonly aircraft: AircraftService) {}

  @Get('categories')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'List aircraft categories with models' })
  listCategories() {
    return this.aircraft.listCategories();
  }

  @Post('categories')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Create aircraft category' })
  createCategory(
    @Body() body: { code: string; label: string; maxPassengers?: number },
  ) {
    return this.aircraft.createCategory(body);
  }

  @Patch('categories/:id')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Update aircraft category' })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { code?: string; label?: string; maxPassengers?: number },
  ) {
    return this.aircraft.updateCategory(id, body);
  }

  @Delete('categories/:id')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Delete aircraft category' })
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.aircraft.deleteCategory(id);
  }

  @Get('models')
  @RequirePermissions('aircraft.view')
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiOperation({ summary: 'List aircraft models' })
  listModels(@Query('categoryId') categoryId?: string) {
    return this.aircraft.listModels(
      categoryId ? Number(categoryId) : undefined,
    );
  }

  @Post('models')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Create aircraft model' })
  createModel(
    @Body()
    body: {
      manufacturer: string;
      model: string;
      categoryId: number;
      rangeKm?: number;
      speedKmh?: number;
      sleepCapacity?: number;
    },
  ) {
    return this.aircraft.createModel(body);
  }

  @Patch('models/:id')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Update aircraft model' })
  updateModel(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      manufacturer?: string;
      model?: string;
      categoryId?: number;
      rangeKm?: number;
      speedKmh?: number;
      sleepCapacity?: number;
    },
  ) {
    return this.aircraft.updateModel(id, body);
  }

  @Delete('models/:id')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Delete aircraft model' })
  deleteModel(@Param('id', ParseIntPipe) id: number) {
    return this.aircraft.deleteModel(id);
  }

  @Get('fleet')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'List aircraft instances (tail numbers)' })
  @ApiQuery({ name: 'availabilityStatus', required: false })
  @ApiQuery({ name: 'currentAirportId', required: false })
  listFleet(
    @Query('availabilityStatus') availabilityStatus?: string,
    @Query('currentAirportId') currentAirportId?: string,
  ) {
    return this.aircraft.listFleet({
      availabilityStatus,
      currentAirportId: currentAirportId ? Number(currentAirportId) : undefined,
    });
  }

  @Get('fleet/:id')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Aircraft instance detail + location history' })
  getFleet(@Param('id', ParseIntPipe) id: number) {
    return this.aircraft.getFleetItem(id);
  }

  @Post('fleet')
  @RequirePermissions('aircraft.view')
  @ApiOperation({ summary: 'Create aircraft instance' })
  createFleet(
    @Body()
    body: {
      registration: string;
      aircraftModelId: number;
      operatorId: number;
      baseAirportId?: number;
      currentAirportId?: number;
      hourlyRate?: number;
      hourlyRateCurrency?: string;
      minimumBillableHours?: number;
      availabilityStatus?: string;
    },
  ) {
    return this.aircraft.createFleet(body);
  }

  @Post('fleet/:id/location')
  @RequirePermissions('aircraft.update_location')
  @ApiOperation({ summary: 'Update aircraft current airport + history' })
  updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { airportId: number; reason?: string },
  ) {
    return this.aircraft.updateLocation(id, body);
  }
}
