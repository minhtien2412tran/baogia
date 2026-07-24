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
    subject: '[JetVina] New charter booking {{bookingReference}} — check departure time inside',
    htmlBody: `<p>A new charter booking requires your review.</p>
<p>
  <strong>Booking:</strong> {{bookingReference}}<br/>
  <strong>Customer:</strong> {{customerName}} · {{customerEmail}}<br/>
  <strong>Aircraft:</strong> {{aircraftLabel}}<br/>
  <strong>Passengers:</strong> {{passengerCount}}<br/>
  <strong>Itinerary (each leg · origin local time):</strong><br/>{{itineraryHtml}}<br/>
  <strong>First departure (origin airport local):</strong> {{departureDateTime}}<br/>
  <strong>Timezone IANA:</strong> {{departureTimezone}}<br/>
  <strong>Current status:</strong> {{bookingStatus}}
</p>
<p>Please review aircraft availability and respond through the approved JetVina operations channel.</p>`,
    textBody: `A new charter booking requires your review.

Booking: {{bookingReference}}
Customer: {{customerName}} · {{customerEmail}}
Aircraft: {{aircraftLabel}}
Passengers: {{passengerCount}}
Itinerary (each leg · origin local time):
{{itinerary}}
First departure (origin airport local): {{departureDateTime}}
Timezone IANA: {{departureTimezone}}
Current status: {{bookingStatus}}

Please review aircraft availability and respond through the approved JetVina operations channel.`,
  },
  admin_flight_notify: {
    subject: '[JetVina Admin] {{bookingReference}} · {{bookingStatus}} · {{operatorName}}',
    htmlBody: `<p>Admin / Sales notification</p>
<p>
  <strong>Booking:</strong> {{bookingReference}}<br/>
  <strong>Operator:</strong> {{operatorName}}<br/>
  <strong>Aircraft:</strong> {{aircraftLabel}} · Pax {{passengerCount}}<br/>
  <strong>Customer:</strong> {{customerName}} / {{customerEmail}}<br/>
  <strong>Status:</strong> {{bookingStatus}} ({{event}})<br/>
  <strong>Itinerary:</strong><br/>{{itineraryHtml}}<br/>
  <strong>First departure (origin local):</strong> {{departureDateTime}}<br/>
  <strong>Timezone IANA:</strong> {{departureTimezone}}
</p>`,
    textBody:
      'Admin: {{bookingReference}} operator={{operatorName}} aircraft={{aircraftLabel}} status={{bookingStatus}}\n{{itinerary}}\nFirst departure: {{departureDateTime}} ({{departureTimezone}})',
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
    /** customer | operator | sales — for SoT idempotency / audit only */
    recipientGroup?: string;
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
    const email = opts.to.trim().toLowerCase();

    try {
      const existing = await this.prisma.emailCampaignLog.findUnique({
        where: {
          campaignKey_email_referenceId: {
            campaignKey,
            email,
            referenceId,
          },
        },
      });
      if (existing?.status === 'SENT') {
        return { sent: true, reason: 'idempotent_skip' };
      }

      await this.prisma.emailCampaignLog.upsert({
        where: {
          campaignKey_email_referenceId: {
            campaignKey,
            email,
            referenceId,
          },
        },
        create: {
          campaignKey,
          email,
          referenceId,
          locale: opts.locale ?? 'en',
          status: 'PENDING',
          meta: {
            ...opts.vars,
            recipientGroup: opts.recipientGroup,
          } as object,
        },
        update: {
          // Do not reset SENT; only re-queue FAILED/PENDING
          status: 'PENDING',
          error: null,
          meta: {
            ...opts.vars,
            recipientGroup: opts.recipientGroup,
          } as object,
        },
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
        where: { campaignKey, email, referenceId },
        data: {
          status: result.sent ? 'SENT' : 'FAILED',
          sentAt: result.sent ? new Date() : null,
          error: result.reason ? String(result.reason).slice(0, 500) : null,
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
