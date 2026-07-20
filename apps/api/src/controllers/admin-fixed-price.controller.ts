import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { CreateFixedPriceRouteDto, UpdateFixedPriceRouteDto } from '../dto';
import { FixedPriceService } from '../services/fixed-price.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';

@ApiTags('Admin Fixed Price')
@ApiSecurity('X-API-Key')
@Controller('admin/fixed-price/routes')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminFixedPriceController {
  constructor(private readonly fixedPriceService: FixedPriceService) {}

  @Get()
  @RequirePermissions('fixed_price.view')
  @ApiOperation({ summary: 'List all fixed-price routes (admin)' })
  listAll() {
    return this.fixedPriceService.getAllRoutesAdmin();
  }

  @Post()
  @RequirePermissions('fixed_price.manage')
  @ApiOperation({ summary: 'Create a fixed-price route (admin)' })
  @ApiResponse({ status: 201, description: 'Route created.' })
  create(@Body() body: CreateFixedPriceRouteDto) {
    return this.fixedPriceService.createRoute(body);
  }

  @Patch(':id')
  @RequirePermissions('fixed_price.manage')
  @ApiOperation({ summary: 'Update a fixed-price route (admin)' })
  @ApiResponse({ status: 200, description: 'Route updated.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateFixedPriceRouteDto,
  ) {
    return this.fixedPriceService.updateRoute(id, body);
  }

  @Delete(':id')
  @RequirePermissions('fixed_price.manage')
  @ApiOperation({ summary: 'Delete a fixed-price route (admin)' })
  @ApiResponse({ status: 200, description: 'Route deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fixedPriceService.deleteRoute(id);
  }
}
