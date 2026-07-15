import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {
  isSmtpDeliverableConfigured,
  smtpNonDeliverableReason,
} from '../utils/smtp-config';

export type MailAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private verified = false;

  /** True only when SMTP can actually deliver (rejects prod loopback). */
  isConfigured(): boolean {
    return isSmtpDeliverableConfigured();
  }

  private getTransporter(): nodemailer.Transporter | null {
    if (this.transporter) return this.transporter;
    if (!this.isConfigured()) return null;
    const host = process.env.SMTP_HOST?.trim();
    if (!host) return null;

    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure =
      process.env.SMTP_SECURE === 'true' ||
      (process.env.SMTP_SECURE !== 'false' && port === 465);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD ?? '' }
        : undefined,
      tls:
        process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'false'
          ? { rejectUnauthorized: false }
          : undefined,
    });
    return this.transporter;
  }

  async verifyConnection(): Promise<{ ok: boolean; reason?: string }> {
    const blocked = smtpNonDeliverableReason();
    if (blocked) return { ok: false, reason: blocked };
    if (!this.isConfigured())
      return { ok: false, reason: 'SMTP not configured' };
    if (this.verified) return { ok: true };
    const transport = this.getTransporter();
    if (!transport) return { ok: false, reason: 'SMTP not configured' };
    try {
      await transport.verify();
      this.verified = true;
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        reason: err instanceof Error ? err.message : 'verify failed',
      };
    }
  }

  async sendMail(opts: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    replyTo?: string;
    cc?: string;
    attachments?: MailAttachment[];
  }): Promise<{ sent: boolean; reason?: string }> {
    const blocked = smtpNonDeliverableReason();
    if (blocked) {
      this.logger.warn(
        `Email skipped (SMTP not deliverable): ${opts.subject} → ${opts.to} (${blocked})`,
      );
      return { sent: false, reason: blocked };
    }

    const transport = this.getTransporter();
    if (!transport) {
      this.logger.warn(
        `Email skipped (SMTP not configured): ${opts.subject} → ${opts.to}`,
      );
      return { sent: false, reason: 'SMTP not configured' };
    }

    try {
      await transport.sendMail({
        from: process.env.SMTP_FROM ?? 'JetVina <noreply@jetvina.local>',
        to: opts.to,
        cc: opts.cc,
        replyTo: opts.replyTo,
        subject: opts.subject,
        text: opts.text,
        html: opts.html ?? opts.text.replace(/\n/g, '<br>'),
        attachments: opts.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      });
      this.logger.log(`Email sent: ${opts.subject} → ${opts.to}`);
      return { sent: true };
    } catch (err) {
      this.logger.error(
        `Email failed: ${err instanceof Error ? err.message : err}`,
      );
      return {
        sent: false,
        reason: err instanceof Error ? err.message : 'send failed',
      };
    }
  }

  async sendQuoteConfirmation(opts: {
    email: string;
    firstName: string;
    requestId: number;
  }) {
    return this.sendMail({
      to: opts.email,
      subject: `JetVina Quote Request #${opts.requestId} Received`,
      text: [
        `Dear ${opts.firstName},`,
        '',
        `Thank you for your private jet charter quote request (#${opts.requestId}).`,
        'Our charter specialists will contact you within 3 hours.',
        '',
        '— JetVina Private Jet Charter',
      ].join('\n'),
    });
  }
}
