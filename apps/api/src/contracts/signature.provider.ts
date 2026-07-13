import { Injectable } from '@nestjs/common';

export interface SendEnvelopeInput {
  contractId: number;
  contractNumber: string;
  signers: Array<{ email: string; name: string; role: string }>;
  documentPath?: string | null;
  amount?: number | null;
  currency?: string;
}

export interface SendEnvelopeResult {
  envelopeId: string;
  status: string;
  provider: string;
}

export interface ElectronicSignatureProvider {
  readonly name: string;
  sendEnvelope(input: SendEnvelopeInput): Promise<SendEnvelopeResult>;
}

@Injectable()
export class MockDocuSignProvider implements ElectronicSignatureProvider {
  readonly name = 'docusign-mock';

  async sendEnvelope(input: SendEnvelopeInput): Promise<SendEnvelopeResult> {
    const envelopeId = `MOCK-ENV-${input.contractId}-${Date.now()}`;
    return {
      envelopeId,
      status: 'sent',
      provider: this.name,
    };
  }
}

export const SIGNATURE_PROVIDER = Symbol('SIGNATURE_PROVIDER');
