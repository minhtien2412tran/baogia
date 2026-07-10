import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';
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
  search(@Query('q') q: string, @Query('limit') limit?: string) {
    return this.airportService.search(q, limit ? Number(limit) : 10);
  }

  @Get()
  @ApiOperation({ summary: 'List all airports' })
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.airportService.list(page ? Number(page) : 1, limit ? Number(limit) : 50);
  }
}
