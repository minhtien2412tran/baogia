import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AirportService } from '../services/airport.service';
import { CreateAirportDto, UpdateAirportDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { PermissionService } from '../permissions/permission.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Admin Airports')
@ApiSecurity('X-API-Key')
@Controller('admin/airports')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminAirportController {
  constructor(
    private readonly airportService: AirportService,
    private readonly permissions: PermissionService,
  ) {}

  @Get()
  @RequirePermissions('airport.view')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'continentCode', required: false })
  @ApiQuery({ name: 'countryCode', required: false })
  @ApiOperation({
    summary: 'List airports (scoped by user airport permissions)',
    description:
      'SALES with COUNTRY=VN only sees VN airports. ADMIN sees all. Fees + canParkAircraft included for pricing.',
  })
  async list(
    @CurrentUser() user: AuthUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('continentCode') continentCode?: string,
    @Query('countryCode') countryCode?: string,
  ) {
    const scopeWhere = (await this.permissions.airportWhereForUser(
      user.userId,
      user.role,
    )) as Prisma.AirportWhereInput | null;
    return this.airportService.list(page ? Number(page) : 1, limit ? Number(limit) : 100, {
      continentCode,
      countryCode,
      scopeWhere,
    });
  }

  @Post()
  @RequirePermissions('airport.manage')
  @ApiOperation({ summary: 'Create airport (incl. parking fees / canParkAircraft)' })
  create(@Body() body: CreateAirportDto) {
    return this.airportService.create(body);
  }

  @Patch(':id')
  @RequirePermissions('airport.manage')
  @ApiOperation({ summary: 'Update airport' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateAirportDto) {
    return this.airportService.update(id, body);
  }

  @Delete(':id')
  @RequirePermissions('airport.manage')
  @ApiOperation({ summary: 'Delete airport' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.airportService.remove(id);
  }
}
