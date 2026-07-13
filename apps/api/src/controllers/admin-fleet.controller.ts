import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Admin Fleet')
@ApiSecurity('X-API-Key')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/fleet')
export class AdminFleetController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List operator aircraft + active contracts' })
  async list(@Query('status') status?: string) {
    const fleet = await this.prisma.operatorAircraft.findMany({
      where: status ? { status } : undefined,
      include: {
        operator: true,
        aircraftModel: { include: { category: true } },
        baseAirport: true,
        currentAirport: true,
        contracts: { where: { status: 'ACTIVE' }, take: 1, orderBy: { validFrom: 'desc' } },
      },
      orderBy: { tailNumber: 'asc' },
    });

    return {
      fleet: fleet.map((ac) => ({
        id: ac.id,
        tailNumber: ac.tailNumber,
        status: ac.status,
        operator: { id: ac.operator.id, name: ac.operator.name, region: ac.operator.region },
        model: {
          id: ac.aircraftModel.id,
          label: `${ac.aircraftModel.manufacturer} ${ac.aircraftModel.model}`,
          category: ac.aircraftModel.category.code,
        },
        baseAirport: ac.baseAirport.iata,
        currentAirport: ac.currentAirport.iata,
        contract: ac.contracts[0]
          ? {
              code: ac.contracts[0].code,
              hourlyRate: Number(ac.contracts[0].hourlyRate),
              currency: ac.contracts[0].currency,
              minHours: ac.contracts[0].minHours != null ? Number(ac.contracts[0].minHours) : null,
            }
          : null,
      })),
    };
  }
}
