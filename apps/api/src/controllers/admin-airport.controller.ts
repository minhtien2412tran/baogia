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
import { AirportService } from '../services/airport.service';
import { CreateAirportDto, UpdateAirportDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Airports')
@ApiSecurity('X-API-Key')
@Controller('admin/airports')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminAirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'List airports (admin)' })
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.airportService.list(page ? Number(page) : 1, limit ? Number(limit) : 100);
  }

  @Post()
  @ApiOperation({ summary: 'Create airport' })
  create(@Body() body: CreateAirportDto) {
    return this.airportService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update airport' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateAirportDto) {
    return this.airportService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete airport' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.airportService.remove(id);
  }
}
