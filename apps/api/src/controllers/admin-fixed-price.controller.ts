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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateFixedPriceRouteDto, UpdateFixedPriceRouteDto } from '../dto';
import { FixedPriceService } from '../services/fixed-price.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Fixed Price')
@Controller('admin/fixed-price/routes')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminFixedPriceController {
  constructor(private readonly fixedPriceService: FixedPriceService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a fixed-price route (admin)' })
  @ApiResponse({ status: 201, description: 'Route created.' })
  create(@Body() body: CreateFixedPriceRouteDto) {
    return this.fixedPriceService.createRoute(body);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a fixed-price route (admin)' })
  @ApiResponse({ status: 200, description: 'Route updated.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateFixedPriceRouteDto) {
    return this.fixedPriceService.updateRoute(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a fixed-price route (admin)' })
  @ApiResponse({ status: 200, description: 'Route deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fixedPriceService.deleteRoute(id);
  }
}
