import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirportService {
  constructor(private readonly prisma: PrismaService) {}

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
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [total, airports] = await Promise.all([
      this.prisma.airport.count(),
      this.prisma.airport.findMany({ orderBy: { iata: 'asc' }, skip, take }),
    ]);
    return { data: airports, pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) } };
  }
}
