import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import {
  PERMISSION_KEYS,
  type PermissionKey,
} from '../constants/permissions';

@Injectable()
export class PermissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Role defaults when override is missing or INHERIT. */
  defaultAllowed(role: string, key: PermissionKey): boolean {
    if (role === 'ADMIN') return true;
    // Owners may cancel their own booking unless DENY override
    if (key === 'CANCEL_BOOKING') return true;
    return false;
  }

  async resolve(
    userId: number,
    role: string,
    key: PermissionKey,
  ): Promise<{ allowed: boolean; effect: string; source: 'override' | 'role' }> {
    const row = await this.prisma.userPermissionOverride.findUnique({
      where: { userId_permissionKey: { userId, permissionKey: key } },
    });
    if (row && row.effect === 'DENY') {
      return { allowed: false, effect: 'DENY', source: 'override' };
    }
    if (row && row.effect === 'ALLOW') {
      return { allowed: true, effect: 'ALLOW', source: 'override' };
    }
    const allowed = this.defaultAllowed(role, key);
    return { allowed, effect: 'INHERIT', source: 'role' };
  }

  async assertAllowed(
    userId: number,
    role: string,
    key: PermissionKey,
    ipAddress?: string,
  ): Promise<void> {
    const result = await this.resolve(userId, role, key);
    if (!result.allowed) {
      await this.audit.log(
        'PERMISSION_DENIED',
        { permissionKey: key, effect: result.effect, source: result.source },
        userId,
        ipAddress,
      );
      throw new ForbiddenException(`Permission denied: ${key}`);
    }
  }

  async listForUser(userId: number) {
    const overrides = await this.prisma.userPermissionOverride.findMany({
      where: { userId },
      orderBy: { permissionKey: 'asc' },
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User #${userId} not found`);
    const role = user.role;
    return PERMISSION_KEYS.map((key) => {
      const o = overrides.find((x) => x.permissionKey === key);
      const effect = o?.effect ?? 'INHERIT';
      const resolved =
        effect === 'DENY' ? false : effect === 'ALLOW' ? true : this.defaultAllowed(role, key);
      return {
        permissionKey: key,
        effect,
        allowed: resolved,
      };
    });
  }

  async putOverrides(
    userId: number,
    items: Array<{ permissionKey: string; effect: string }>,
    adminId?: number,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User #${userId} not found`);

    for (const item of items) {
      if (!PERMISSION_KEYS.includes(item.permissionKey as PermissionKey)) {
        throw new BadRequestException(`Unknown permission: ${item.permissionKey}`);
      }
      if (!['INHERIT', 'ALLOW', 'DENY'].includes(item.effect)) {
        throw new BadRequestException(`Invalid effect: ${item.effect}`);
      }
      if (item.effect === 'INHERIT') {
        await this.prisma.userPermissionOverride.deleteMany({
          where: { userId, permissionKey: item.permissionKey },
        });
      } else {
        await this.prisma.userPermissionOverride.upsert({
          where: {
            userId_permissionKey: { userId, permissionKey: item.permissionKey },
          },
          create: {
            userId,
            permissionKey: item.permissionKey,
            effect: item.effect,
          },
          update: { effect: item.effect },
        });
      }
    }

    await this.audit.log('USER_PERMISSIONS_UPDATED', { userId, items }, adminId);
    return this.listForUser(userId);
  }
}
