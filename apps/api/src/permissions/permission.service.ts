import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ADMIN_ROLE, Permission, PERMISSIONS } from './permission.catalog';

export type PermissionEffect = 'INHERIT' | 'ALLOW' | 'DENY';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  catalog() {
    return { permissions: [...PERMISSIONS] };
  }

  /**
   * Resolve effective permission: DENY > ALLOW > ROLE inherit.
   * ADMIN always allowed.
   */
  async hasPermission(
    userId: number,
    role: string,
    permission: Permission,
  ): Promise<boolean> {
    if (role === ADMIN_ROLE) return true;

    const override = await this.prisma.userPermissionOverride.findUnique({
      where: { userId_permission: { userId, permission } },
    });

    if (override) {
      if (override.effect === 'DENY') return false;
      if (override.effect === 'ALLOW') return true;
      // INHERIT falls through to role
    }

    const rolePerm = await this.prisma.rolePermission.findUnique({
      where: { role_permission: { role, permission } },
    });
    return Boolean(rolePerm);
  }

  async listEffectivePermissions(
    userId: number,
    role: string,
  ): Promise<string[]> {
    if (role === ADMIN_ROLE) return [...PERMISSIONS];

    const [rolePerms, overrides] = await Promise.all([
      this.prisma.rolePermission.findMany({ where: { role } }),
      this.prisma.userPermissionOverride.findMany({ where: { userId } }),
    ]);

    const set = new Set(rolePerms.map((p) => p.permission));
    for (const o of overrides) {
      if (o.effect === 'DENY') set.delete(o.permission);
      if (o.effect === 'ALLOW') set.add(o.permission);
    }
    return [...set].sort();
  }

  async setOverride(
    userId: number,
    permission: string,
    effect: PermissionEffect,
    updatedBy?: number,
  ) {
    if (effect === 'INHERIT') {
      await this.prisma.userPermissionOverride.deleteMany({
        where: { userId, permission },
      });
      return { userId, permission, effect: 'INHERIT' as const };
    }
    return this.prisma.userPermissionOverride.upsert({
      where: { userId_permission: { userId, permission } },
      update: { effect, updatedBy },
      create: { userId, permission, effect, updatedBy },
    });
  }

  async getRolePermissions(role: string) {
    const rows = await this.prisma.rolePermission.findMany({
      where: { role },
      orderBy: { permission: 'asc' },
    });
    return {
      role,
      permissions: rows.map((r) => r.permission),
    };
  }

  async setRolePermissions(role: string, permissions: string[]) {
    const allowed = new Set(PERMISSIONS as readonly string[]);
    const cleaned = [...new Set(permissions)].filter((p) => allowed.has(p));
    await this.prisma.rolePermission.deleteMany({ where: { role } });
    if (cleaned.length === 0) return { role, permissions: [] as string[] };
    await this.prisma.rolePermission.createMany({
      data: cleaned.map((permission) => ({ role, permission })),
      skipDuplicates: true,
    });
    return { role, permissions: cleaned };
  }

  async getUserScopes(userId: number) {
    return this.prisma.userAirportScope.findMany({
      where: { userId },
      include: { airport: true },
      orderBy: { id: 'asc' },
    });
  }

  async getUserOverrides(userId: number) {
    return this.prisma.userPermissionOverride.findMany({
      where: { userId },
      orderBy: { permission: 'asc' },
    });
  }

  async replaceUserScopes(
    userId: number,
    scopes: Array<{
      scopeType: string;
      continentCode?: string;
      countryCode?: string;
      airportId?: number;
    }>,
    actorId?: number,
  ) {
    await this.prisma.userAirportScope.deleteMany({ where: { userId } });
    if (scopes.length === 0) return [];
    await this.prisma.userAirportScope.createMany({
      data: scopes.map((s) => ({
        userId,
        scopeType: s.scopeType,
        continentCode: s.continentCode,
        countryCode: s.countryCode,
        airportId: s.airportId,
        createdBy: actorId,
        updatedBy: actorId,
      })),
    });
    return this.getUserScopes(userId);
  }

  /**
   * Build Prisma Airport where filter from user scopes.
   * Empty scopes or ALL → no restriction (null).
   * NONE → impossible filter.
   */
  async airportWhereForUser(
    userId: number,
    role: string,
  ): Promise<object | null> {
    if (role === ADMIN_ROLE) return null;

    const scopes = await this.prisma.userAirportScope.findMany({
      where: { userId },
    });
    if (scopes.length === 0) return null;
    if (scopes.some((s) => s.scopeType === 'ALL')) return null;
    if (scopes.every((s) => s.scopeType === 'NONE')) {
      return { id: -1 };
    }

    const or: object[] = [];
    for (const s of scopes) {
      if (s.scopeType === 'CONTINENT' && s.continentCode) {
        or.push({ continentCode: s.continentCode });
      } else if (s.scopeType === 'COUNTRY' && s.countryCode) {
        or.push({ countryCode: s.countryCode });
      } else if (s.scopeType === 'SELECTED_AIRPORTS' && s.airportId) {
        or.push({ id: s.airportId });
      }
    }
    if (or.length === 0) return { id: -1 };
    return { OR: or };
  }

  async assertAirportInScope(
    userId: number,
    role: string,
    airportId: number,
  ): Promise<boolean> {
    const where = await this.airportWhereForUser(userId, role);
    if (!where) return true;
    const found = await this.prisma.airport.findFirst({
      where: { AND: [{ id: airportId }, where] },
    });
    return Boolean(found);
  }
}
