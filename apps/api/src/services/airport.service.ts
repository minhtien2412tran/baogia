import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreateAirportDto, UpdateAirportDto } from '../dto';
import {
  buildAliasOrFilters,
  normalizeAirportQuery,
  resolveAirportAlias,
} from '../constants/airport-search-aliases';
import { formatAirportDisplay } from '../constants/airport-display-locale';

@Injectable()
export class AirportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async search(q: string, limit = 10, locale?: string) {
    if (!q || q.length < 1) return { airports: [], autoSelect: undefined as string | undefined };

    const raw = q.trim();
    const term = raw.toUpperCase();
    const alias = resolveAirportAlias(raw);

    const orConditions: Prisma.AirportWhereInput[] = [
      { iata: { contains: term, mode: 'insensitive' } },
      { icao: { contains: term, mode: 'insensitive' } },
      { city: { contains: raw, mode: 'insensitive' } },
      { name: { contains: raw, mode: 'insensitive' } },
      { country: { contains: raw, mode: 'insensitive' } },
    ];

    if (alias) {
      orConditions.push(...buildAliasOrFilters(alias));
    }

    const norm = normalizeAirportQuery(raw);
    if (norm !== raw.toLowerCase()) {
      orConditions.push(
        { city: { contains: norm, mode: 'insensitive' } },
        { country: { contains: norm, mode: 'insensitive' } },
      );
    }

    const airports = await this.prisma.airport.findMany({
      where: {
        status: 'ACTIVE',
        OR: orConditions,
      },
      take: Math.min(Math.max(limit, 1), 25),
      orderBy: [{ city: 'asc' }, { iata: 'asc' }],
    });

    const scored = airports
      .map((a) => ({
        airport: a,
        score: this.scoreMatch(a, raw, term, alias),
      }))
      .sort((a, b) => b.score - a.score || a.airport.iata.localeCompare(b.airport.iata));

    const take = Math.min(Math.max(limit, 1), 25);
    const top = scored.slice(0, take);

    let autoSelect: string | undefined;
    if (alias?.iata) {
      autoSelect = alias.iata.toUpperCase();
    } else if (top.length === 1) {
      autoSelect = top[0].airport.iata;
    } else if (top.length > 1 && top[0].score >= 70 && top[0].score - top[1].score >= 25) {
      autoSelect = top[0].airport.iata;
    }

    return {
      autoSelect,
      airports: top.map(({ airport: a }) => {
        const display = formatAirportDisplay(
          { iata: a.iata, city: a.city, country: a.country, name: a.name },
          locale,
        );
        return {
          id: a.id,
          iata: a.iata,
          icao: a.icao,
          name: display.name,
          city: display.city,
          country: display.country,
          label: display.label,
        };
      }),
    };
  }

  private scoreMatch(
    a: { iata: string; city: string; country: string; name: string },
    raw: string,
    term: string,
    alias: ReturnType<typeof resolveAirportAlias>,
  ): number {
    let score = 0;
    const cityLower = a.city.toLowerCase();
    const countryLower = a.country.toLowerCase();
    const rawLower = raw.toLowerCase();
    const norm = normalizeAirportQuery(raw);

    if (a.iata.toUpperCase() === term) score += 100;
    else if (a.iata.toUpperCase().startsWith(term)) score += 80;

    if (alias?.iata && a.iata.toUpperCase() === alias.iata.toUpperCase()) score += 120;

    if (cityLower === rawLower || cityLower === norm) score += 70;
    else if (cityLower.startsWith(rawLower) || cityLower.startsWith(norm)) score += 50;
    else if (cityLower.includes(rawLower)) score += 30;

    if (countryLower === rawLower || countryLower.includes(rawLower)) score += 40;

    if (alias?.countries?.some((c) => countryLower.includes(c.toLowerCase()))) score += 35;
    if (alias?.cities?.some((c) => cityLower.includes(c.toLowerCase()))) score += 45;

    // Prefer major private-jet hubs when searching by country
    const hubIata = new Set(['LBG', 'NCE', 'LTN', 'TEB', 'VNY', 'OPF', 'SGN', 'HAN', 'HUI', 'DAD', 'DXB', 'SIN']);
    if (alias && hubIata.has(a.iata)) score += 15;

    return score;
  }

  async list(
    page = 1,
    limit = 50,
    filters?: { continentCode?: string; countryCode?: string; status?: string },
  ) {
    const take = Math.min(limit, 200);
    const skip = (page - 1) * take;
    const where: Prisma.AirportWhereInput = {};
    if (filters?.continentCode) where.continentCode = filters.continentCode.toUpperCase();
    if (filters?.countryCode) where.countryCode = filters.countryCode.toUpperCase();
    if (filters?.status) where.status = filters.status;

    const [total, airports] = await Promise.all([
      this.prisma.airport.count({ where }),
      this.prisma.airport.findMany({ where, orderBy: { iata: 'asc' }, skip, take }),
    ]);
    return {
      data: airports.map((a) => ({
        id: a.id,
        iata: a.iata,
        icao: a.icao,
        name: a.name,
        city: a.city,
        country: a.country,
        countryCode: a.countryCode,
        continentCode: a.continentCode,
        continentName: a.continentName,
        timezone: a.timezone,
        latitude: a.latitude != null ? Number(a.latitude) : null,
        longitude: a.longitude != null ? Number(a.longitude) : null,
        canParkAircraft: a.canParkAircraft,
        landingFee: a.landingFee != null ? Number(a.landingFee) : null,
        parkingFee: a.parkingFee != null ? Number(a.parkingFee) : null,
        overnightFee: a.overnightFee != null ? Number(a.overnightFee) : null,
        handlingFee: a.handlingFee != null ? Number(a.handlingFee) : null,
        feeCurrency: a.feeCurrency,
        status: a.status,
      })),
      pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
    };
  }

  async listContinents() {
    const rows = await this.prisma.airport.findMany({
      where: { continentCode: { not: null }, status: 'ACTIVE' },
      distinct: ['continentCode'],
      select: { continentCode: true, continentName: true },
      orderBy: { continentCode: 'asc' },
    });
    return {
      continents: rows
        .filter((r) => r.continentCode)
        .map((r) => ({
          code: r.continentCode as string,
          name: r.continentName ?? r.continentCode,
        })),
    };
  }

  async listCountries(continentCode?: string) {
    const rows = await this.prisma.airport.findMany({
      where: {
        status: 'ACTIVE',
        countryCode: { not: null },
        ...(continentCode ? { continentCode: continentCode.toUpperCase() } : {}),
      },
      distinct: ['countryCode'],
      select: { countryCode: true, countryName: true, country: true, continentCode: true },
      orderBy: { country: 'asc' },
    });
    return {
      countries: rows
        .filter((r) => r.countryCode)
        .map((r) => ({
          code: r.countryCode as string,
          name: r.countryName ?? r.country,
          continentCode: r.continentCode,
        })),
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
