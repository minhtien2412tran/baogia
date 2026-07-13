import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listUsers(page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [total, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          accountType: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async updateUser(
    id: number,
    body: {
      role?: string;
      status?: string;
      firstName?: string;
      lastName?: string;
    },
    adminId: number,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);

    if (body.role && !['USER', 'ADMIN'].includes(body.role)) {
      throw new BadRequestException('role must be USER or ADMIN');
    }
    if (body.status && !['ACTIVE', 'SUSPENDED'].includes(body.status)) {
      throw new BadRequestException('status must be ACTIVE or SUSPENDED');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        role: body.role,
        status: body.status,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });

    await this.audit.log(
      'ADMIN_USER_UPDATED',
      { userId: id, changes: body },
      adminId,
    );
    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      status: updated.status,
      firstName: updated.firstName,
      lastName: updated.lastName,
    };
  }
}
