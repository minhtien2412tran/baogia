import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';

export type AirportScopeType = 'ALL' | 'CONTINENT' | 'COUNTRY' | 'AIRPORT_LIST' | 'NONE';

@Injectable()
export class AirportScopeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Prisma Airport filter for scoped users.
   * ADMIN / missing scope / ALL → null (no filter).
   * NONE → impossible match.
   */
  async airportWhereForUser(
    userId: number | undefined,
    role?: string,
  ): Promise<Prisma.AirportWhereInput | null> {
    if (!userId || role === 'ADMIN') return null;

    const scope = await this.prisma.userAirportScope.findUnique({
      where: { userId },
    });
    if (!scope || scope.scopeType === 'ALL') return null;
    if (scope.scopeType === 'NONE') {
      return { id: -1 };
    }
    if (scope.scopeType === 'CONTINENT') {
      return {
        continentCode: { in: scope.continentCodes.map((c) => c.toUpperCase()) },
      };
    }
    if (scope.scopeType === 'COUNTRY') {
      return {
        OR: [
          { countryCode: { in: scope.countryCodes.map((c) => c.toUpperCase()) } },
          { country: { in: scope.countryCodes, mode: 'insensitive' } },
        ],
      };
    }
    if (scope.scopeType === 'AIRPORT_LIST') {
      return { id: { in: scope.airportIds } };
    }
    return null;
  }

  async getForUser(userId: number) {
    const scope = await this.prisma.userAirportScope.findUnique({ where: { userId } });
    if (!scope) {
      return {
        userId,
        scopeType: 'ALL' as AirportScopeType,
        continentCodes: [] as string[],
        countryCodes: [] as string[],
        airportIds: [] as number[],
      };
    }
    return {
      userId: scope.userId,
      scopeType: scope.scopeType as AirportScopeType,
      continentCodes: scope.continentCodes,
      countryCodes: scope.countryCodes,
      airportIds: scope.airportIds,
    };
  }

  async putForUser(
    userId: number,
    body: {
      scopeType: AirportScopeType;
      continentCodes?: string[];
      countryCodes?: string[];
      airportIds?: number[];
    },
    adminId?: number,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User #${userId} not found`);

    const data = {
      scopeType: body.scopeType,
      continentCodes: (body.continentCodes ?? []).map((c) => c.toUpperCase()),
      countryCodes: (body.countryCodes ?? []).map((c) => c.toUpperCase()),
      airportIds: body.airportIds ?? [],
    };

    await this.prisma.userAirportScope.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    await this.audit.log(
      'USER_AIRPORT_SCOPE_UPDATED',
      { userId, ...data },
      adminId,
    );
    return this.getForUser(userId);
  }
}
