import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter | null {
    if (this.transporter) return this.transporter;
    const host = process.env.SMTP_HOST;
    if (!host) return null;

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: false,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD ?? '' }
        : undefined,
    });
    return this.transporter;
  }

  async sendMail(opts: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<{ sent: boolean; reason?: string }> {
    const transport = this.getTransporter();
    if (!transport) {
      this.logger.warn(`Email skipped (SMTP not configured): ${opts.subject} → ${opts.to}`);
      return { sent: false, reason: 'SMTP not configured' };
    }

    try {
      await transport.sendMail({
        from: process.env.SMTP_FROM ?? 'J-TA <noreply@j-ta.local>',
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html ?? opts.text.replace(/\n/g, '<br>'),
      });
      this.logger.log(`Email sent: ${opts.subject} → ${opts.to}`);
      return { sent: true };
    } catch (err) {
      this.logger.error(`Email failed: ${err instanceof Error ? err.message : err}`);
      return { sent: false, reason: err instanceof Error ? err.message : 'send failed' };
    }
  }

  async sendQuoteConfirmation(opts: {
    email: string;
    firstName: string;
    requestId: number;
  }) {
    return this.sendMail({
      to: opts.email,
      subject: `J-TA Quote Request #${opts.requestId} Received`,
      text: [
        `Dear ${opts.firstName},`,
        '',
        `Thank you for your private jet charter quote request (#${opts.requestId}).`,
        'Our charter specialists will contact you within 3 hours.',
        '',
        '— J-TA Private Jet Charter',
      ].join('\n'),
    });
  }
}
