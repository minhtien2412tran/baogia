import { randomUUID } from 'crypto';
import type {
  CreateEnvelopeInput,
  CreateEnvelopeResult,
  DocuSignProvider,
} from './docusign.types';

/**
 * Local/dev DocuSign stand-in — envelopes are mock-{uuid}.
 * Webhook can complete them without calling DocuSign cloud.
 */
export class MockDocuSignProvider implements DocuSignProvider {
  private readonly certs = new Map<string, string>();

  async createEnvelope(input: CreateEnvelopeInput): Promise<CreateEnvelopeResult> {
    const id = `mock-${randomUUID()}`;
    const cert = `https://mock.docusign.local/coc/${id}.pdf`;
    this.certs.set(id, cert);
    return {
      externalEnvelopeId: id,
      status: 'SENT',
      certificateUrl: null,
    };
  }

  async voidEnvelope(_externalEnvelopeId: string, _reason?: string): Promise<void> {
    return;
  }

  async getCertificateUrl(externalEnvelopeId: string): Promise<string | null> {
    return this.certs.get(externalEnvelopeId) ?? `https://mock.docusign.local/coc/${externalEnvelopeId}.pdf`;
  }
}
