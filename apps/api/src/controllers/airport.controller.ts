import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiSecurity, ApiParam } from '@nestjs/swagger';
import { AirportService } from '../services/airport.service';

@ApiTags('Airports')
@ApiSecurity('X-API-Key')
@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search airports by IATA, city, or name' })
  @ApiQuery({ name: 'q', required: true, example: 'London' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'locale', required: false, example: 'vi' })
  search(@Query('q') q: string, @Query('limit') limit?: string, @Query('locale') locale?: string) {
    return this.airportService.search(q, limit ? Number(limit) : 10, locale);
  }

  @Get()
  @ApiOperation({ summary: 'List all airports' })
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.airportService.list(page ? Number(page) : 1, limit ? Number(limit) : 50);
  }

  @Get(':id/fees')
  @ApiOperation({ summary: 'Get airport fees (landing/parking/handling)' })
  @ApiParam({ name: 'id', type: 'number' })
  getFees(@Param('id', ParseIntPipe) id: number) {
    return this.airportService.getFees(id);
  }

  @Get(':id/available-aircraft')
  @ApiOperation({ summary: 'List AVAILABLE fleet aircraft currently at this airport' })
  @ApiParam({ name: 'id', type: 'number' })
  getAvailableAircraft(@Param('id', ParseIntPipe) id: number) {
    return this.airportService.getAvailableAircraft(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get airport by id' })
  @ApiParam({ name: 'id', type: 'number' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.airportService.getById(id);
  }
}
