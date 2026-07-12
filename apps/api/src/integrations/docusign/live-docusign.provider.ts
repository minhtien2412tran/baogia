import { Logger } from '@nestjs/common';
import type {
  CreateEnvelopeInput,
  CreateEnvelopeResult,
  DocuSignProvider,
} from './docusign.types';
import { MockDocuSignProvider } from './mock-docusign.provider';

/**
 * Live DocuSign client scaffold. Requires DOCUSIGN_* env.
 * Falls back to mock when credentials are incomplete.
 */
export class LiveDocuSignProvider implements DocuSignProvider {
  private readonly logger = new Logger(LiveDocuSignProvider.name);
  private readonly fallback = new MockDocuSignProvider();
  private readonly ready: boolean;

  constructor() {
    this.ready = Boolean(
      process.env.DOCUSIGN_INTEGRATION_KEY &&
        process.env.DOCUSIGN_USER_ID &&
        process.env.DOCUSIGN_ACCOUNT_ID &&
        process.env.DOCUSIGN_PRIVATE_KEY,
    );
    if (!this.ready) {
      this.logger.warn(
        'DocuSign live credentials incomplete — using MockDocuSignProvider fallback',
      );
    }
  }

  async createEnvelope(input: CreateEnvelopeInput): Promise<CreateEnvelopeResult> {
    if (!this.ready) return this.fallback.createEnvelope(input);
    // JWT auth + Envelopes:create would go here when sandbox is provisioned.
    this.logger.warn('Live DocuSign API not wired — falling back to mock envelope');
    return this.fallback.createEnvelope(input);
  }

  async voidEnvelope(externalEnvelopeId: string, reason?: string): Promise<void> {
    if (!this.ready) return this.fallback.voidEnvelope(externalEnvelopeId, reason);
    this.logger.warn(`Live void not wired for ${externalEnvelopeId}`);
    return this.fallback.voidEnvelope(externalEnvelopeId, reason);
  }

  async getCertificateUrl(externalEnvelopeId: string): Promise<string | null> {
    if (!this.ready) return this.fallback.getCertificateUrl(externalEnvelopeId);
    return this.fallback.getCertificateUrl(externalEnvelopeId);
  }
}
