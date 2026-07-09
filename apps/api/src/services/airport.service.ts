import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreateAirportDto, UpdateAirportDto } from '../dto';

@Injectable()
export class AirportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async search(q: string, limit = 10) {
    if (!q || q.length < 1) return { airports: [] };
    const term = q.trim().toUpperCase();
    const airports = await this.prisma.airport.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { iata: { contains: term, mode: 'insensitive' } },
          { icao: { contains: term, mode: 'insensitive' } },
          { city: { contains: q.trim(), mode: 'insensitive' } },
          { name: { contains: q.trim(), mode: 'insensitive' } },
        ],
      },
      take: Math.min(limit, 25),
      orderBy: { iata: 'asc' },
    });
    return {
      airports: airports.map((a) => ({
        id: a.id,
        iata: a.iata,
        icao: a.icao,
        name: a.name,
        city: a.city,
        country: a.country,
        label: `${a.city} (${a.iata}) — ${a.name}`,
      })),
    };
  }

  async list(page = 1, limit = 50) {
    const take = Math.min(limit, 200);
    const skip = (page - 1) * take;
    const [total, airports] = await Promise.all([
      this.prisma.airport.count(),
      this.prisma.airport.findMany({ orderBy: { iata: 'asc' }, skip, take }),
    ]);
    return {
      data: airports.map((a) => ({
        id: a.id,
        iata: a.iata,
        icao: a.icao,
        name: a.name,
        city: a.city,
        country: a.country,
        timezone: a.timezone,
        status: a.status,
      })),
      pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
    };
  }

  async create(body: CreateAirportDto) {
    const iata = body.iata.trim().toUpperCase();
    const existing = await this.prisma.airport.findUnique({ where: { iata } });
    if (existing) throw new BadRequestException(`Airport ${iata} already exists`);

    const airport = await this.prisma.airport.create({
      data: {
        iata,
        icao: body.icao.trim().toUpperCase(),
        name: body.name.trim(),
        city: body.city.trim(),
        country: body.country.trim(),
        timezone: body.timezone?.trim() || 'UTC',
        status: body.status ?? 'ACTIVE',
      },
    });
    await this.audit.log('AIRPORT_CREATED', { airportId: airport.id, iata: airport.iata });
    return airport;
  }

  async update(id: number, body: UpdateAirportDto) {
    const existing = await this.prisma.airport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Airport #${id} not found`);

    if (body.iata) {
      const iata = body.iata.trim().toUpperCase();
      const clash = await this.prisma.airport.findFirst({
        where: { iata, NOT: { id } },
      });
      if (clash) throw new BadRequestException(`Airport ${iata} already exists`);
    }

    const airport = await this.prisma.airport.update({
      where: { id },
      data: {
        ...(body.iata != null ? { iata: body.iata.trim().toUpperCase() } : {}),
        ...(body.icao != null ? { icao: body.icao.trim().toUpperCase() } : {}),
        ...(body.name != null ? { name: body.name.trim() } : {}),
        ...(body.city != null ? { city: body.city.trim() } : {}),
        ...(body.country != null ? { country: body.country.trim() } : {}),
        ...(body.timezone != null ? { timezone: body.timezone.trim() } : {}),
        ...(body.status != null ? { status: body.status } : {}),
      },
    });
    await this.audit.log('AIRPORT_UPDATED', { airportId: id });
    return airport;
  }

  async remove(id: number) {
    const existing = await this.prisma.airport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Airport #${id} not found`);
    try {
      await this.prisma.airport.delete({ where: { id } });
    } catch {
      throw new BadRequestException(
        `Cannot delete airport ${existing.iata} — it is referenced by routes or quotes`,
      );
    }
    await this.audit.log('AIRPORT_DELETED', { airportId: id, iata: existing.iata });
    return { ok: true, id };
  }
}
