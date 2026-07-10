import { Global, Module } from '@nestjs/common';
import { AuditService } from '../../services/audit.service';
import { EmailService } from '../../services/email.service';
import { PaymentService } from '../../services/payment.service';
import { DocumentService } from '../../services/document.service';
import { OnepayService } from '../../services/onepay.service';
import { NinepayService } from '../../services/ninepay.service';
import { RedisService } from '../../services/redis.service';
import { StorageService } from '../../services/storage.service';
import { SmsService } from '../../services/sms.service';

/**
 * Shared infra providers used across feature modules.
 * Physical files remain under src/services until phase 6 colocation.
 */
@Global()
@Module({
  providers: [
    AuditService,
    EmailService,
    PaymentService,
    DocumentService,
    OnepayService,
    NinepayService,
    RedisService,
    StorageService,
    SmsService,
  ],
  exports: [
    AuditService,
    EmailService,
    PaymentService,
    DocumentService,
    OnepayService,
    NinepayService,
    RedisService,
    StorageService,
    SmsService,
  ],
})
export class IntegrationsModule {}
