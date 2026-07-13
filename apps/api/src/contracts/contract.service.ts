import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../services/audit.service';
import type { ElectronicSignatureProvider } from './signature.provider';
import { SIGNATURE_PROVIDER } from './signature.provider';

const APPROVAL_FLOW = {
  DRAFT: ['PENDING_APPROVAL', 'CANCELLED'],
  PENDING_APPROVAL: ['APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'CANCELLED'],
  CHANGES_REQUESTED: ['PENDING_APPROVAL', 'CANCELLED'],
  APPROVED: ['SENT_FOR_SIGNATURE', 'SUPERSEDED', 'CANCELLED'],
  REJECTED: ['DRAFT', 'CANCELLED'],
  SENT_FOR_SIGNATURE: ['PARTIALLY_SIGNED', 'COMPLETED', 'DECLINED', 'VOIDED', 'EXPIRED'],
  PARTIALLY_SIGNED: ['COMPLETED', 'DECLINED', 'VOIDED', 'EXPIRED'],
  COMPLETED: [],
  DECLINED: ['DRAFT'],
  VOIDED: [],
  EXPIRED: ['DRAFT'],
  SUPERSEDED: [],
  CANCELLED: [],
} as const;

type ContractStatus = keyof typeof APPROVAL_FLOW;

@Injectable()
export class ContractService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @Inject(SIGNATURE_PROVIDER) private readonly signatures: ElectronicSignatureProvider,
  ) {}

  private assertTransition(from: string, to: string) {
    const allowed = APPROVAL_FLOW[from as ContractStatus] as readonly string[] | undefined;
    if (!allowed || !allowed.includes(to)) {
      throw new BadRequestException(`Cannot transition contract from ${from} to ${to}`);
    }
  }

  private async appendHistory(
    contractId: number,
    fromStatus: string | null,
    toStatus: string,
    action: string,
    userId?: number,
    note?: string,
  ) {
    await this.prisma.contractApprovalHistory.create({
      data: {
        contractId,
        beforeStatus: fromStatus ?? undefined,
        afterStatus: toStatus,
        action,
        actorUserId: userId,
        note,
      },
    });
  }

  async list(status?: string) {
    const contracts = await this.prisma.operatorContract.findMany({
      where: status ? { status } : undefined,
      include: {
        booking: true,
        aircraft: true,
        operator: true,
        contractTemplate: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
    return { contracts };
  }

  async getById(id: number) {
    const contract = await this.prisma.operatorContract.findUnique({
      where: { id },
      include: {
        booking: true,
        aircraft: true,
        operator: true,
        contractTemplate: true,
        history: { orderBy: { createdAt: 'asc' } },
        signatureEvents: { orderBy: { receivedAt: 'asc' } },
      },
    });
    if (!contract) throw new NotFoundException(`Contract ${id} not found`);
    return contract;
  }

  async create(input: {
    bookingId: number;
    aircraftId: number;
    operatorId?: number;
    contractTemplateId?: number;
    amount?: number;
    currency?: string;
    userId?: number;
  }) {
    const booking = await this.prisma.booking.findUnique({ where: { id: input.bookingId } });
    if (!booking) throw new NotFoundException(`Booking ${input.bookingId} not found`);

    const aircraft = await this.prisma.aircraft.findUnique({ where: { id: input.aircraftId } });
    if (!aircraft) throw new NotFoundException(`Aircraft ${input.aircraftId} not found`);

    const operatorId = input.operatorId ?? aircraft.operatorId;
    const amount =
      input.amount ??
      (booking.estimatedPriceTotal != null ? Number(booking.estimatedPriceTotal) : undefined);

    const contract = await this.prisma.operatorContract.create({
      data: {
        bookingId: input.bookingId,
        aircraftId: input.aircraftId,
        operatorId,
        contractTemplateId: input.contractTemplateId,
        contractNumber: `JB-C-${input.bookingId}-${Date.now()}`,
        status: 'DRAFT',
        amount: amount != null ? amount : undefined,
        currency: input.currency ?? booking.estimatedPriceCurrency ?? 'USD',
        createdByUserId: input.userId,
      },
    });

    await this.appendHistory(contract.id, null, 'DRAFT', 'CREATED', input.userId);
    await this.audit.logEntity({
      action: 'CONTRACT_CREATED',
      entityType: 'OperatorContract',
      entityId: contract.id,
      afterData: { status: 'DRAFT', bookingId: input.bookingId },
      userId: input.userId,
    });

    return contract;
  }

  async submitForApproval(id: number, userId?: number) {
    const contract = await this.getById(id);
    this.assertTransition(contract.status, 'PENDING_APPROVAL');
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: { status: 'PENDING_APPROVAL', submittedByUserId: userId },
    });
    await this.appendHistory(id, contract.status, 'PENDING_APPROVAL', 'SUBMIT', userId);
    return updated;
  }

  async approve(id: number, userId?: number, note?: string) {
    const contract = await this.getById(id);
    this.assertTransition(contract.status, 'APPROVED');
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedByUserId: userId,
        approvedAt: new Date(),
      },
    });
    await this.appendHistory(id, contract.status, 'APPROVED', 'APPROVE', userId, note);
    await this.audit.logEntity({
      action: 'CONTRACT_APPROVED',
      entityType: 'OperatorContract',
      entityId: id,
      userId,
    });
    return updated;
  }

  async reject(id: number, userId?: number, reason?: string) {
    const contract = await this.getById(id);
    this.assertTransition(contract.status, 'REJECTED');
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedByUserId: userId,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
    await this.appendHistory(id, contract.status, 'REJECTED', 'REJECT', userId, reason);
    return updated;
  }

  async requestChanges(id: number, userId?: number, note?: string) {
    const contract = await this.getById(id);
    this.assertTransition(contract.status, 'CHANGES_REQUESTED');
    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: { status: 'CHANGES_REQUESTED' },
    });
    await this.appendHistory(id, contract.status, 'CHANGES_REQUESTED', 'REQUEST_CHANGES', userId, note);
    return updated;
  }

  async sendForSignature(
    id: number,
    signers: Array<{ email: string; name: string; role: string }>,
    userId?: number,
  ) {
    const contract = await this.getById(id);
    if (contract.status !== 'APPROVED') {
      throw new ForbiddenException('Contract must be APPROVED before DocuSign send');
    }
    this.assertTransition(contract.status, 'SENT_FOR_SIGNATURE');

    const result = await this.signatures.sendEnvelope({
      contractId: contract.id,
      contractNumber: contract.contractNumber ?? `JB-${contract.id}`,
      signers,
      documentPath: contract.documentPath,
      amount: contract.amount != null ? Number(contract.amount) : null,
      currency: contract.currency,
    });

    const updated = await this.prisma.operatorContract.update({
      where: { id },
      data: {
        status: 'SENT_FOR_SIGNATURE',
        docusignEnvelopeId: result.envelopeId,
        sentAt: new Date(),
      },
    });
    await this.appendHistory(id, contract.status, 'SENT_FOR_SIGNATURE', 'SEND_DOCUSIGN', userId);
    await this.audit.logEntity({
      action: 'CONTRACT_SENT_DOCUSIGN',
      entityType: 'OperatorContract',
      entityId: id,
      afterData: { envelopeId: result.envelopeId, provider: result.provider },
      userId,
    });
    return { contract: updated, envelope: result };
  }

  /**
   * Idempotent webhook handler keyed by eventId.
   */
  async handleSignatureWebhook(payload: {
    eventId: string;
    envelopeId: string;
    eventType: string;
    provider?: string;
    payload?: Prisma.InputJsonValue;
  }) {
    const existing = await this.prisma.signatureWebhookEvent.findUnique({
      where: { eventId: payload.eventId },
    });
    if (existing) {
      return { duplicate: true, event: existing };
    }

    const contract = await this.prisma.operatorContract.findFirst({
      where: { docusignEnvelopeId: payload.envelopeId },
    });

    const event = await this.prisma.signatureWebhookEvent.create({
      data: {
        eventId: payload.eventId,
        provider: payload.provider ?? 'MOCK',
        envelopeId: payload.envelopeId,
        eventType: payload.eventType,
        payload: payload.payload ?? {},
        contractId: contract?.id,
        processedAt: new Date(),
      },
    });

    if (contract) {
      const type = payload.eventType.toLowerCase();
      let next: string | null = null;
      if (type.includes('completed') || type === 'envelope-completed') next = 'COMPLETED';
      else if (type.includes('declined')) next = 'DECLINED';
      else if (type.includes('voided')) next = 'VOIDED';
      else if (type.includes('delivered') || type.includes('sent')) next = null;
      else if (type.includes('partial')) next = 'PARTIALLY_SIGNED';

      if (next && next !== contract.status) {
        try {
          this.assertTransition(contract.status, next);
          await this.prisma.operatorContract.update({
            where: { id: contract.id },
            data: {
              status: next,
              completedAt: next === 'COMPLETED' ? new Date() : undefined,
              voidedAt: next === 'VOIDED' ? new Date() : undefined,
            },
          });
          await this.appendHistory(contract.id, contract.status, next, `WEBHOOK_${payload.eventType}`);
        } catch {
          // ignore invalid transitions from noisy webhook events
        }
      }
    }

    return { duplicate: false, event };
  }

  async listTemplates() {
    const templates = await this.prisma.contractTemplate.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    });
    return { templates };
  }
}
