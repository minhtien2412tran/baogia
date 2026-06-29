import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(action: string, details?: Prisma.InputJsonValue, userId?: number, ipAddress?: string) {
    return this.prisma.auditLog.create({
      data: {
        action,
        details: details ?? undefined,
        userId: userId ?? undefined,
        ipAddress: ipAddress ?? undefined,
      },
    });
  }
}
