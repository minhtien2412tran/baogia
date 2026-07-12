import { createHmac, timingSafeEqual } from 'crypto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../services/audit.service';
import { OperatorContractService } from '../../services/operator-contract.service';
import { PermissionService } from '../../services/permission.service';
import {
  DOCUSIGN_PROVIDER,
  type DocuSignProvider,
  type DocuSignRecipient,
} from './docusign.types';

@Injectable()
export class DocuSignService {
  private readonly logger = new Logger(DocuSignService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly contracts: OperatorContractService,
    private readonly permissions: PermissionService,
    @Inject(DOCUSIGN_PROVIDER) private readonly provider: DocuSignProvider,
  ) {}

  async send(
    contractId: number,
    recipients: DocuSignRecipient[],
    userId: number,
    ip?: string,
  ) {
    const contract = await this.prisma.operatorContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException(`OperatorContract #${contractId} not found`);
    if (contract.status !== 'APPROVED') {
      throw new BadRequestException(
        'DocuSign send requires APPROVED contract (internal approval first)',
      );
    }
    if (!recipients?.length) {
      throw new BadRequestException('At least one recipient is required');
    }

    const result = await this.provider.createEnvelope({
      contractId,
      title: contract.title,
      bodyHtml: contract.bodyHtml,
      recipients,
    });

    const envelope = await this.prisma.docuSignEnvelope.create({
      data: {
        operatorContractId: contractId,
        externalEnvelopeId: result.externalEnvelopeId,
        status: result.status || 'SENT',
        recipients: recipients as unknown as Prisma.InputJsonValue,
        sentAt: new Date(),
      },
    });

    await this.contracts.markSent(contractId);
    if (contract.bookingId) {
      await this.prisma.booking.update({
        where: { id: contract.bookingId },
        data: { contractStatus: 'SENT' },
      });
    }

    await this.audit.log(
      'DOCUSIGN_ENVELOPE_SENT',
      {
        contractId,
        envelopeId: envelope.externalEnvelopeId,
      },
      userId,
      ip,
    );

    return {
      contractId,
      envelope: {
        id: envelope.id,
        externalEnvelopeId: envelope.externalEnvelopeId,
        status: envelope.status,
        sentAt: envelope.sentAt?.toISOString() ?? null,
      },
    };
  }

  async void(
    contractId: number,
    reason: string | undefined,
    userId: number,
    role: string,
    ip?: string,
  ) {
    await this.permissions.assertAllowed(userId, role, 'VOID_DOCUSIGN', ip);
    const envelope = await this.prisma.docuSignEnvelope.findFirst({
      where: {
        operatorContractId: contractId,
        status: { notIn: ['COMPLETED', 'VOIDED'] },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!envelope) throw new NotFoundException('No active DocuSign envelope for contract');

    await this.provider.voidEnvelope(envelope.externalEnvelopeId, reason);
    await this.prisma.docuSignEnvelope.update({
      where: { id: envelope.id },
      data: { status: 'VOIDED', voidedAt: new Date() },
    });
    await this.prisma.operatorContract.update({
      where: { id: contractId },
      data: { status: 'VOIDED' },
    });
    await this.audit.log(
      'DOCUSIGN_ENVELOPE_VOIDED',
      { contractId, envelopeId: envelope.externalEnvelopeId, reason },
      userId,
      ip,
    );
    return { ok: true, externalEnvelopeId: envelope.externalEnvelopeId };
  }

  async getStatus(contractId: number) {
    const envelopes = await this.prisma.docuSignEnvelope.findMany({
      where: { operatorContractId: contractId },
      orderBy: { createdAt: 'desc' },
    });
    return {
      contractId,
      envelopes: envelopes.map((e) => ({
        id: e.id,
        externalEnvelopeId: e.externalEnvelopeId,
        status: e.status,
        certificateUrl: e.certificateUrl,
        sentAt: e.sentAt?.toISOString() ?? null,
        completedAt: e.completedAt?.toISOString() ?? null,
        voidedAt: e.voidedAt?.toISOString() ?? null,
      })),
    };
  }

  verifyWebhookSignature(rawBody: Buffer, signatureHeader?: string): boolean {
    const secret = process.env.DOCUSIGN_WEBHOOK_SECRET;
    if (!secret) {
      // Dev / mock: allow without secret
      return true;
    }
    if (!signatureHeader) return false;
    const digest = createHmac('sha256', secret).update(rawBody).digest('base64');
    try {
      const a = Buffer.from(digest);
      const b = Buffer.from(signatureHeader);
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  async handleWebhook(payload: {
    eventId?: string;
    envelopeId?: string;
    event?: string;
    status?: string;
    [key: string]: unknown;
  }) {
    const nestedId = (payload as { data?: { envelopeId?: string } }).data?.envelopeId;
    const envelopeId = payload.envelopeId ?? nestedId;
    const eventType = String(payload.event ?? payload.status ?? 'unknown');

    if (!envelopeId) {
      throw new BadRequestException('Missing envelopeId');
    }

    const eventId =
      payload.eventId ?? `${envelopeId}-${eventType}-${Date.now()}`;

    const existing = await this.prisma.docuSignWebhookEvent.findUnique({
      where: { eventId: String(eventId) },
    });
    if (existing) {
      return { ok: true, duplicate: true };
    }

    await this.prisma.docuSignWebhookEvent.create({
      data: {
        eventId: String(eventId),
        envelopeId: String(envelopeId),
        eventType,
        payload: payload as Prisma.InputJsonValue,
      },
    });

    const envelope = await this.prisma.docuSignEnvelope.findUnique({
      where: { externalEnvelopeId: String(envelopeId) },
    });
    if (!envelope) {
      this.logger.warn(`Webhook for unknown envelope ${envelopeId}`);
      return { ok: true, unknownEnvelope: true };
    }

    const normalized = eventType.toUpperCase();
    let nextStatus = envelope.status;
    if (normalized.includes('COMPLETED') || normalized === 'COMPLETED') {
      nextStatus = 'COMPLETED';
    } else if (normalized.includes('DECLINED')) {
      nextStatus = 'DECLINED';
    } else if (normalized.includes('VOID')) {
      nextStatus = 'VOIDED';
    } else if (normalized.includes('DELIVERED')) {
      nextStatus = 'DELIVERED';
    } else if (normalized.includes('SENT')) {
      nextStatus = 'SENT';
    }

    const certUrl =
      nextStatus === 'COMPLETED'
        ? await this.provider.getCertificateUrl(envelope.externalEnvelopeId)
        : envelope.certificateUrl;

    await this.prisma.docuSignEnvelope.update({
      where: { id: envelope.id },
      data: {
        status: nextStatus,
        completedAt: nextStatus === 'COMPLETED' ? new Date() : envelope.completedAt,
        voidedAt: nextStatus === 'VOIDED' ? new Date() : envelope.voidedAt,
        certificateUrl: certUrl,
        rawLastEvent: payload as Prisma.InputJsonValue,
      },
    });

    if (nextStatus === 'COMPLETED') {
      await this.contracts.markCompleted(envelope.operatorContractId);
      await this.audit.log('DOCUSIGN_ENVELOPE_COMPLETED', {
        contractId: envelope.operatorContractId,
        envelopeId: envelope.externalEnvelopeId,
        certificateUrl: certUrl,
      });
    }

    return { ok: true, status: nextStatus };
  }
}
