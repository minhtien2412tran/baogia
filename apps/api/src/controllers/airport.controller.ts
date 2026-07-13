import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { AirportService } from '../services/airport.service';

@ApiTags('Airports')
@ApiSecurity('X-API-Key')
@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Find airports near a lat/lng (Haversine)' })
  @ApiQuery({ name: 'lat', required: true, example: 10.8231 })
  @ApiQuery({ name: 'lng', required: true, example: 106.6297 })
  @ApiQuery({ name: 'radiusKm', required: false, example: 150 })
  @ApiQuery({ name: 'limit', required: false, example: 8 })
  @ApiQuery({ name: 'locale', required: false })
  nearby(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('limit') limit?: string,
    @Query('locale') locale?: string,
  ) {
    return this.airportService.nearby({
      lat: Number(lat),
      lng: Number(lng),
      radiusKm: radiusKm ? Number(radiusKm) : 150,
      limit: limit ? Number(limit) : 8,
      locale,
    });
  }

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
}
