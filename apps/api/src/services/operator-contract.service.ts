import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { PermissionService } from './permission.service';
import { OPEN_CONTRACT_STATUSES } from '../constants/permissions';

const contractInclude = {
  aircraft: { include: { aircraftModel: true, currentAirport: true } },
  operator: true,
  template: true,
  booking: true,
  envelopes: { orderBy: { createdAt: 'desc' as const }, take: 5 },
} as const;

@Injectable()
export class OperatorContractService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionService,
  ) {}

  private format(c: Awaited<ReturnType<typeof this.findOrThrow>>) {
    return {
      id: c.id,
      title: c.title,
      status: c.status,
      version: c.version,
      aircraftId: c.aircraftId,
      aircraftRegistration: c.aircraft.registration,
      operatorId: c.operatorId,
      operatorName: c.operator.name,
      bookingId: c.bookingId,
      templateId: c.templateId,
      templateCode: c.template.code,
      bodyHtml: c.bodyHtml,
      createdBy: c.createdBy,
      approvedBy: c.approvedBy,
      approvedAt: c.approvedAt?.toISOString() ?? null,
      rejectedReason: c.rejectedReason,
      envelopes: c.envelopes.map((e) => ({
        id: e.id,
        externalEnvelopeId: e.externalEnvelopeId,
        status: e.status,
        certificateUrl: e.certificateUrl,
        sentAt: e.sentAt?.toISOString() ?? null,
        completedAt: e.completedAt?.toISOString() ?? null,
      })),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }

  private async findOrThrow(id: number) {
    const c = await this.prisma.operatorContract.findUnique({
      where: { id },
      include: contractInclude,
    });
    if (!c) throw new NotFoundException(`OperatorContract #${id} not found`);
    return c;
  }

  private fillTemplate(
    body: string,
    ctx: {
      aircraft: { registration: string; hourlyRate: { toString(): string }; hourlyRateCurrency: string };
      operator: { name: string; region: string };
      bookingId?: number | null;
    },
  ) {
    return body
      .replaceAll('{{aircraft.registration}}', ctx.aircraft.registration)
      .replaceAll('{{aircraft.hourlyRate}}', ctx.aircraft.hourlyRate.toString())
      .replaceAll('{{aircraft.currency}}', ctx.aircraft.hourlyRateCurrency)
      .replaceAll('{{operator.name}}', ctx.operator.name)
      .replaceAll('{{operator.region}}', ctx.operator.region)
      .replaceAll('{{booking.id}}', ctx.bookingId != null ? String(ctx.bookingId) : 'N/A')
      .replaceAll('{{date}}', new Date().toISOString().slice(0, 10));
  }

  async list(filters?: { aircraftId?: number; status?: string; page?: number; limit?: number }) {
    const page = filters?.page ?? 1;
    const limit = Math.min(filters?.limit ?? 20, 100);
    const where: Record<string, unknown> = {};
    if (filters?.aircraftId) where.aircraftId = filters.aircraftId;
    if (filters?.status) where.status = filters.status;

    const [total, rows] = await Promise.all([
      this.prisma.operatorContract.count({ where }),
      this.prisma.operatorContract.findMany({
        where,
        include: contractInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return {
      data: rows.map((r) => this.format(r)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number) {
    return this.format(await this.findOrThrow(id));
  }

  async create(
    body: {
      aircraftId: number;
      templateId?: number;
      templateCode?: string;
      bookingId?: number;
      title?: string;
    },
    createdBy: number,
  ) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: { id: body.aircraftId },
      include: { operator: true },
    });
    if (!aircraft) throw new NotFoundException(`Aircraft #${body.aircraftId} not found`);
    if (!aircraft.operatorId || !aircraft.operator) {
      throw new BadRequestException('Aircraft has no operator assigned');
    }

    const open = await this.prisma.operatorContract.findFirst({
      where: {
        aircraftId: body.aircraftId,
        status: { in: [...OPEN_CONTRACT_STATUSES] },
      },
    });
    if (open) {
      throw new BadRequestException(
        `Aircraft already has open contract #${open.id} (${open.status}). Close/void it first.`,
      );
    }

    let template =
      body.templateId != null
        ? await this.prisma.contractTemplate.findUnique({ where: { id: body.templateId } })
        : body.templateCode
          ? await this.prisma.contractTemplate.findUnique({ where: { code: body.templateCode } })
          : await this.prisma.contractTemplate.findFirst({
              where: { status: 'ACTIVE' },
              orderBy: { id: 'asc' },
            });
    if (!template || template.status !== 'ACTIVE') {
      throw new BadRequestException('No active contract template found');
    }

    if (body.bookingId) {
      const booking = await this.prisma.booking.findUnique({ where: { id: body.bookingId } });
      if (!booking) throw new NotFoundException(`Booking #${body.bookingId} not found`);
    }

    const title =
      body.title ??
      `Operator agreement — ${aircraft.registration} / ${aircraft.operator.name}`;
    const bodyHtml = this.fillTemplate(template.bodyHtml, {
      aircraft,
      operator: aircraft.operator,
      bookingId: body.bookingId,
    });

    const created = await this.prisma.operatorContract.create({
      data: {
        aircraftId: aircraft.id,
        operatorId: aircraft.operatorId,
        bookingId: body.bookingId ?? null,
        templateId: template.id,
        title,
        bodyHtml,
        status: 'DRAFT',
        createdBy,
      },
      include: contractInclude,
    });

    if (body.bookingId) {
      await this.prisma.booking.update({
        where: { id: body.bookingId },
        data: { contractStatus: 'DRAFT' },
      });
    }

    await this.audit.log(
      'OPERATOR_CONTRACT_CREATED',
      { contractId: created.id, aircraftId: aircraft.id },
      createdBy,
    );
    return this.format(created);
  }

  async updateDraft(id: number, body: { title?: string; bodyHtml?: string }, userId: number) {
    const c = await this.findOrThrow(id);
    if (c.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT contracts can be edited');
    }
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: {
        title: body.title ?? c.title,
        bodyHtml: body.bodyHtml ?? c.bodyHtml,
      },
      include: contractInclude,
    });
    await this.audit.log('OPERATOR_CONTRACT_UPDATED', { contractId: id }, userId);
    return this.format(updated);
  }

  async submit(id: number, userId: number) {
    const c = await this.findOrThrow(id);
    if (c.status !== 'DRAFT' && c.status !== 'REJECTED') {
      throw new BadRequestException('Only DRAFT or REJECTED contracts can be submitted');
    }
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: { status: 'PENDING_APPROVAL', rejectedReason: null },
      include: contractInclude,
    });
    if (c.bookingId) {
      await this.prisma.booking.update({
        where: { id: c.bookingId },
        data: { contractStatus: 'PENDING_APPROVAL' },
      });
    }
    await this.audit.log('OPERATOR_CONTRACT_SUBMITTED', { contractId: id }, userId);
    return this.format(updated);
  }

  async approve(id: number, userId: number, role: string, ip?: string) {
    await this.permissions.assertAllowed(userId, role, 'APPROVE_CONTRACT', ip);
    const c = await this.findOrThrow(id);
    if (c.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('Contract must be PENDING_APPROVAL to approve');
    }
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
        rejectedReason: null,
      },
      include: contractInclude,
    });
    if (c.bookingId) {
      await this.prisma.booking.update({
        where: { id: c.bookingId },
        data: { contractStatus: 'APPROVED' },
      });
    }
    await this.audit.log('OPERATOR_CONTRACT_APPROVED', { contractId: id }, userId, ip);
    return this.format(updated);
  }

  async reject(id: number, reason: string, userId: number, role: string, ip?: string) {
    await this.permissions.assertAllowed(userId, role, 'APPROVE_CONTRACT', ip);
    const c = await this.findOrThrow(id);
    if (c.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('Contract must be PENDING_APPROVAL to reject');
    }
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedReason: reason || 'Rejected',
        approvedBy: null,
        approvedAt: null,
      },
      include: contractInclude,
    });
    if (c.bookingId) {
      await this.prisma.booking.update({
        where: { id: c.bookingId },
        data: { contractStatus: 'DRAFT' },
      });
    }
    await this.audit.log(
      'OPERATOR_CONTRACT_REJECTED',
      { contractId: id, reason },
      userId,
      ip,
    );
    return this.format(updated);
  }

  async voidContract(id: number, userId: number, role: string, ip?: string) {
    await this.permissions.assertAllowed(userId, role, 'CANCEL_CONTRACT', ip);
    const c = await this.findOrThrow(id);
    if (['COMPLETED', 'VOIDED'].includes(c.status)) {
      throw new BadRequestException(`Cannot void contract in status ${c.status}`);
    }
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: { status: 'VOIDED' },
      include: contractInclude,
    });
    if (c.bookingId) {
      await this.prisma.booking.update({
        where: { id: c.bookingId },
        data: { contractStatus: 'NONE' },
      });
    }
    await this.audit.log('OPERATOR_CONTRACT_VOIDED', { contractId: id }, userId, ip);
    return this.format(updated);
  }

  async markSent(id: number) {
    return this.prisma.operatorContract.update({
      where: { id },
      data: { status: 'SENT' },
      include: contractInclude,
    });
  }

  async markCompleted(id: number) {
    const c = await this.findOrThrow(id);
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: contractInclude,
    });
    if (c.bookingId) {
      await this.prisma.booking.update({
        where: { id: c.bookingId },
        data: { contractStatus: 'COMPLETED', agreementStatus: 'SIGNED' },
      });
    }
    return updated;
  }
}
