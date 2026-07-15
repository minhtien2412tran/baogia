import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { StorageService } from './storage.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  isSmtpCatcherMode,
  isSmtpDeliverableConfigured,
  isSmtpTransportConfigured,
  smtpNonDeliverableReason,
} from '../utils/smtp-config';

function present(key: string): boolean {
  const v = process.env[key]?.trim();
  return Boolean(
    v &&
    !v.startsWith('CHANGE_ME') &&
    v !== 'dev-jetbay-secret-change-in-production',
  );
}

@Injectable()
export class IntegrationsStatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
  ) {}

  async getStatus() {
    let database: 'up' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      database = 'down';
    }

    const redisPing = await this.redis.ping();
    const minioPing = await this.storage.ping();
    const smtpDeliverable = isSmtpDeliverableConfigured();
    const smtpTransportReady = isSmtpTransportConfigured();
    const smtpCatcher = isSmtpCatcherMode();
    const smtpBlockedReason = smtpNonDeliverableReason();

    return {
      status: database === 'up' && present('JWT_SECRET') ? 'ok' : 'degraded',
      service: 'jetbay-be',
      env: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development',
      version: process.env.APP_VERSION ?? '1.0.0',
      core: {
        jwt: present('JWT_SECRET'),
        refreshTokenSecret: present('REFRESH_TOKEN_SECRET'),
        database,
        redis: redisPing,
        host: process.env.HOST ?? null,
        port: Number(process.env.PORT ?? 0) || null,
      },
      integrations: {
        /** True only for real customer-inbox SMTP (never Mailpit/loopback). */
        smtp: smtpDeliverable,
        smtpHostSet: present('SMTP_HOST'),
        smtpDeliverable,
        smtpTransportReady,
        smtpCatcher,
        smtpBlockedReason,
        minio: minioPing === 'not_configured' ? 'local' : minioPing,
        googleOAuth: present('GOOGLE_CLIENT_ID'),
        appleOAuth: present('APPLE_CLIENT_ID'),
        stripe: present('STRIPE_SECRET_KEY'),
        onepay:
          present('ONEPAY_MERCHANT_ID') && present('ONEPAY_SECURE_SECRET'),
        ninepay:
          present('NINEPAY_MERCHANT_KEY') && present('NINEPAY_SECRET_KEY'),
        sms:
          present('TWILIO_ACCOUNT_SID') ||
          present('ESMS_API_KEY') ||
          present('SMS_API_URL'),
      },
      notes: {
        jwt: 'Required for auth. Set JWT_SECRET + REFRESH_TOKEN_SECRET.',
        minio:
          'MinIO optional — empty MINIO_ENDPOINT uses local upload path (UPLOAD_PATH).',
        smtp:
          'integrations.smtp = real inbox. smtpCatcher = Mailpit allowed via SMTP_ALLOW_CATCHER (not T-S4-01 PASS). See SMTP_SETUP_GUIDE.md.',
        g4: 'SMTP / OAuth / Payment / SMS need customer merchant keys — see docs/JETBAY_G4_INTEGRATIONS.md',
      },
    };
  }
}
