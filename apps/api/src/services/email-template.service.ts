import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { AuditService } from './audit.service';

export type TemplateVars = Record<string, string | number | null | undefined>;

const FALLBACK: Record<
  string,
  { subject: string; htmlBody: string; textBody: string }
> = {
  operator_flight_notify: {
    subject: '[JetVina] New flight / booking #{{bookingId}}',
    htmlBody: `<p>Hello {{operatorName}},</p>
<p>A new booking <strong>#{{bookingId}}</strong> requires your attention.</p>
<p><strong>Customer:</strong> {{customerName}} ({{customerEmail}})<br/>
<strong>Status:</strong> {{bookingStatus}}<br/>
<strong>Itinerary:</strong> {{itinerary}}</p>
<p>Please confirm operational readiness.</p>`,
    textBody:
      'Booking #{{bookingId}} for {{customerName}}. Status: {{bookingStatus}}. Itinerary: {{itinerary}}',
  },
  admin_flight_notify: {
    subject: '[JetVina Admin] Booking #{{bookingId}} — {{bookingStatus}}',
    htmlBody: `<p>Admin notification</p>
<p>Booking <strong>#{{bookingId}}</strong> · Operator: {{operatorName}} · Status: {{bookingStatus}}</p>
<p>Customer: {{customerName}} / {{customerEmail}}</p>
<p>Itinerary: {{itinerary}}</p>`,
    textBody:
      'Admin: Booking #{{bookingId}} operator={{operatorName}} status={{bookingStatus}} itinerary={{itinerary}}',
  },
};

@Injectable()
export class EmailTemplateService {
  private readonly logger = new Logger(EmailTemplateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly audit: AuditService,
  ) {}

  render(template: string, vars: TemplateVars): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const v = vars[key];
      return v == null ? '' : String(v);
    });
  }

  async list() {
    const templates = await this.prisma.emailTemplate.findMany({
      orderBy: [{ key: 'asc' }, { locale: 'asc' }],
    });
    return { templates, fallbackKeys: Object.keys(FALLBACK) };
  }

  async get(key: string, locale = 'en') {
    const row = await this.prisma.emailTemplate.findUnique({
      where: { key_locale: { key, locale } },
    });
    if (row) return row;
    const fb = FALLBACK[key];
    if (!fb) throw new NotFoundException(`Email template ${key} not found`);
    return {
      id: 0,
      key,
      locale,
      subject: fb.subject,
      htmlBody: fb.htmlBody,
      textBody: fb.textBody,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      fromFallback: true,
    };
  }

  async upsert(
    body: {
      key: string;
      locale?: string;
      subject: string;
      htmlBody: string;
      textBody?: string;
    },
    userId?: number,
  ) {
    const locale = body.locale ?? 'en';
    const template = await this.prisma.emailTemplate.upsert({
      where: { key_locale: { key: body.key, locale } },
      create: {
        key: body.key,
        locale,
        subject: body.subject,
        htmlBody: body.htmlBody,
        textBody: body.textBody,
        updatedBy: userId,
      },
      update: {
        subject: body.subject,
        htmlBody: body.htmlBody,
        textBody: body.textBody,
        updatedBy: userId,
      },
    });
    await this.audit.log('EMAIL_TEMPLATE_UPSERT', {
      key: body.key,
      locale,
      templateId: template.id,
    });
    return { template };
  }

  async sendRendered(opts: {
    key: string;
    locale?: string;
    to: string;
    vars: TemplateVars;
    campaignKey?: string;
    referenceId?: string;
  }): Promise<{ sent: boolean; reason?: string }> {
    const tpl = await this.get(opts.key, opts.locale ?? 'en');
    const subject = this.render(tpl.subject, opts.vars);
    const html = this.render(tpl.htmlBody, opts.vars);
    const text = this.render(
      tpl.textBody ?? tpl.htmlBody.replace(/<[^>]+>/g, ' '),
      opts.vars,
    );

    const campaignKey = opts.campaignKey ?? opts.key;
    const referenceId = opts.referenceId ?? '';

    try {
      await this.prisma.emailCampaignLog.upsert({
        where: {
          campaignKey_email_referenceId: {
            campaignKey,
            email: opts.to,
            referenceId,
          },
        },
        create: {
          campaignKey,
          email: opts.to,
          referenceId,
          locale: opts.locale ?? 'en',
          status: 'PENDING',
          meta: opts.vars as object,
        },
        update: { status: 'PENDING', error: null },
      });
    } catch (e) {
      this.logger.warn(`campaign log upsert failed: ${String(e)}`);
    }

    const result = await this.email.sendMail({
      to: opts.to,
      subject,
      html,
      text,
    });

    await this.prisma.emailCampaignLog
      .updateMany({
        where: { campaignKey, email: opts.to, referenceId },
        data: {
          status: result.sent ? 'SENT' : 'FAILED',
          sentAt: result.sent ? new Date() : null,
          error: result.reason ?? null,
        },
      })
      .catch(() => undefined);

    return result;
  }

  /** Expose fallbacks for seed / tests */
  fallbackCatalog() {
    return FALLBACK;
  }
}
