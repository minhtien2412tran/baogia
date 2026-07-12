export type DocuSignRecipient = {
  email: string;
  name: string;
  role?: string;
};

export type CreateEnvelopeInput = {
  contractId: number;
  title: string;
  bodyHtml: string;
  recipients: DocuSignRecipient[];
};

export type CreateEnvelopeResult = {
  externalEnvelopeId: string;
  status: string;
  certificateUrl?: string | null;
};

export interface DocuSignProvider {
  createEnvelope(input: CreateEnvelopeInput): Promise<CreateEnvelopeResult>;
  voidEnvelope(externalEnvelopeId: string, reason?: string): Promise<void>;
  getCertificateUrl(externalEnvelopeId: string): Promise<string | null>;
}

export const DOCUSIGN_PROVIDER = Symbol('DOCUSIGN_PROVIDER');
