import { Global, Module } from '@nestjs/common';
import { AuditService } from '../../services/audit.service';
import { EmailService } from '../../services/email.service';
import { EnquiryMailService } from '../../services/enquiry-mail.service';
import { CustomerCareService } from '../../services/customer-care/customer-care.service';
import { PaymentService } from '../../services/payment.service';
import { DocumentService } from '../../services/document.service';
import { OnepayService } from '../../services/onepay.service';
import { NinepayService } from '../../services/ninepay.service';
import { RedisService } from '../../services/redis.service';
import { StorageService } from '../../services/storage.service';
import { SmsService } from '../../services/sms.service';
import { PermissionService } from '../../services/permission.service';
import { AirportScopeService } from '../../services/airport-scope.service';
import { DOCUSIGN_PROVIDER } from '../../integrations/docusign/docusign.types';
import { MockDocuSignProvider } from '../../integrations/docusign/mock-docusign.provider';
import { LiveDocuSignProvider } from '../../integrations/docusign/live-docusign.provider';

function createDocuSignProvider() {
  const mode = (process.env.DOCUSIGN_MODE ?? 'mock').toLowerCase();
  if (mode === 'live') return new LiveDocuSignProvider();
  return new MockDocuSignProvider();
}

/**
 * Shared infra providers used across feature modules.
 * Physical files remain under src/services until phase 6 colocation.
 */
@Global()
@Module({
  providers: [
    AuditService,
    EmailService,
    EnquiryMailService,
    CustomerCareService,
    PaymentService,
    DocumentService,
    OnepayService,
    NinepayService,
    RedisService,
    StorageService,
    SmsService,
    PermissionService,
    AirportScopeService,
    { provide: DOCUSIGN_PROVIDER, useFactory: createDocuSignProvider },
  ],
  exports: [
    AuditService,
    EmailService,
    EnquiryMailService,
    CustomerCareService,
    PaymentService,
    DocumentService,
    OnepayService,
    NinepayService,
    RedisService,
    StorageService,
    SmsService,
    PermissionService,
    AirportScopeService,
    DOCUSIGN_PROVIDER,
  ],
})
export class IntegrationsModule {}
