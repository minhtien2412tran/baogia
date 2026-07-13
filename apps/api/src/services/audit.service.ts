import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Prisma } from '@prisma/client';

export interface EntityAuditInput {
  action: string;
  entityType?: string;
  entityId?: string | number;
  beforeData?: Prisma.InputJsonValue;
  afterData?: Prisma.InputJsonValue;
  metadata?: Prisma.InputJsonValue;
  details?: Prisma.InputJsonValue;
  userId?: number;
  ipAddress?: string;
  sessionId?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    action: string,
    details?: Prisma.InputJsonValue,
    userId?: number,
    ipAddress?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        action,
        details: details ?? undefined,
        userId: userId ?? undefined,
        ipAddress: ipAddress ?? undefined,
      },
    });
  }

  async logEntity(input: EntityAuditInput) {
    return this.prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId != null ? String(input.entityId) : undefined,
        beforeData: input.beforeData ?? undefined,
        afterData: input.afterData ?? undefined,
        metadata: input.metadata ?? undefined,
        details: input.details ?? undefined,
        userId: input.userId ?? undefined,
        ipAddress: input.ipAddress ?? undefined,
        sessionId: input.sessionId ?? undefined,
      },
    });
  }
}
