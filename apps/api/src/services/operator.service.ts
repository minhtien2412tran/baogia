import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OperatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list() {
    const operators = await this.prisma.operator.findMany({
      orderBy: { id: 'asc' },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
        _count: { select: { quoteOffers: true } },
      },
    });
    return { operators };
  }

  async get(id: number) {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });
    if (!operator) throw new NotFoundException(`Operator #${id} not found`);
    return { operator };
  }

  async create(body: {
    name: string;
    region: string;
    legalName?: string;
    country?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    status?: string;
  }) {
    const operator = await this.prisma.operator.create({
      data: {
        name: body.name.trim(),
        region: body.region.trim(),
        legalName: body.legalName?.trim(),
        country: body.country?.trim(),
        contactName: body.contactName?.trim(),
        contactEmail: body.contactEmail?.trim().toLowerCase(),
        contactPhone: body.contactPhone?.trim(),
        status: body.status ?? 'ACTIVE',
      },
    });
    await this.audit.log('OPERATOR_CREATED', { operatorId: operator.id });
    return { operator };
  }

  async update(
    id: number,
    body: Partial<{
      name: string;
      region: string;
      legalName: string;
      country: string;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
      status: string;
    }>,
  ) {
    await this.get(id);
    const operator = await this.prisma.operator.update({
      where: { id },
      data: {
        ...(body.name != null ? { name: body.name.trim() } : {}),
        ...(body.region != null ? { region: body.region.trim() } : {}),
        ...(body.legalName != null ? { legalName: body.legalName.trim() } : {}),
        ...(body.country != null ? { country: body.country.trim() } : {}),
        ...(body.contactName != null
          ? { contactName: body.contactName.trim() }
          : {}),
        ...(body.contactEmail != null
          ? { contactEmail: body.contactEmail.trim().toLowerCase() }
          : {}),
        ...(body.contactPhone != null
          ? { contactPhone: body.contactPhone.trim() }
          : {}),
        ...(body.status != null ? { status: body.status } : {}),
      },
    });
    await this.audit.log('OPERATOR_UPDATED', { operatorId: id });
    return { operator };
  }

  async attachUser(
    operatorId: number,
    body: {
      userId?: number;
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    },
  ) {
    await this.get(operatorId);
    let userId = body.userId;
    if (!userId && body.email) {
      const email = body.email.trim().toLowerCase();
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        if (!body.password) {
          throw new BadRequestException(
            'password required when creating operator user',
          );
        }
        user = await this.prisma.user.create({
          data: {
            email,
            passwordHash: bcrypt.hashSync(body.password, 10),
            firstName: body.firstName ?? 'Operator',
            lastName: body.lastName ?? 'User',
            role: 'USER',
          },
        });
      }
      userId = user.id;
    }
    if (!userId) throw new BadRequestException('userId or email required');

    const membership = await this.prisma.operatorUser.upsert({
      where: {
        operatorId_userId: { operatorId, userId },
      },
      create: {
        operatorId,
        userId,
        role: body.role ?? 'OPERATOR_STAFF',
      },
      update: { role: body.role ?? 'OPERATOR_STAFF' },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
    await this.audit.log('OPERATOR_USER_ATTACHED', {
      operatorId,
      userId,
    });
    return { membership };
  }

  async detachUser(operatorId: number, userId: number) {
    await this.prisma.operatorUser.deleteMany({
      where: { operatorId, userId },
    });
    await this.audit.log('OPERATOR_USER_DETACHED', { operatorId, userId });
    return { ok: true };
  }
}
