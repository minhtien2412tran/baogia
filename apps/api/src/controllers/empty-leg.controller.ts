import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Empty Legs')
@Controller('empty-legs')
export class EmptyLegController {
  @Get()
  @ApiOperation({ summary: 'Get available empty-leg offers' })
  @ApiResponse({ status: 200, description: 'List of empty legs.' })
  getEmptyLegs() {
    return {
      emptyLegs: [
        {
          id: 10,
          slug: 'paris-to-geneva-empty-leg',
          fromAirport: { iata: 'LBG', name: 'Le Bourget Airport', city: 'Paris', country: 'France' },
          toAirport: { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland' },
          departAt: '2026-12-05T09:00:00Z',
          price: 4200.0,
          discountPct: 60,
          aircraftModel: 'Cessna Citation Latitude',
          status: 'ACTIVE',
        },
        {
          id: 11,
          slug: 'nice-to-london-empty-leg',
          fromAirport: { iata: 'NCE', name: 'Nice Cote d\'Azur Airport', city: 'Nice', country: 'France' },
          toAirport: { iata: 'LTN', name: 'Luton Airport', city: 'London', country: 'UK' },
          departAt: '2026-12-07T15:00:00Z',
          price: 5800.0,
          discountPct: 55,
          aircraftModel: 'Bombardier Learjet 60',
          status: 'ACTIVE',
        }
      ]
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get empty-leg offer by slug' })
  @ApiParam({ name: 'slug', type: 'string', example: 'paris-to-geneva-empty-leg' })
  @ApiResponse({ status: 200, description: 'Empty-leg details.' })
  getEmptyLegBySlug(@Param('slug') slug: string) {
    return {
      id: 10,
      slug: slug,
      fromAirport: { iata: 'LBG', name: 'Le Bourget Airport', city: 'Paris', country: 'France' },
      toAirport: { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland' },
      departAt: '2026-12-05T09:00:00Z',
      price: 4200.0,
      discountPct: 60,
      aircraftModel: {
        manufacturer: 'Cessna',
        model: 'Citation Latitude',
        rangeKm: 5000,
        speedKmh: 826,
        sleepCapacity: 0,
      },
      status: 'ACTIVE',
      recommendations: [
        { title: 'Explore Lake Geneva', description: 'Visit local lakeside spots in Switzerland.' }
      ]
    };
  }
}
