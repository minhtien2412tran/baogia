import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';

type EnquiryKind = 'travel_credit' | 'jet_card';

type EnquiryPayload = {
  enquiryId: number;
  kind: EnquiryKind;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string | null;
  packageName?: string;
  attachmentUrls?: string[];
};

@Injectable()
export class EnquiryMailService {
  private readonly logger = new Logger(EnquiryMailService.name);

  constructor(private readonly email: EmailService) {}

  private salesInbox(): string {
    return (
      process.env.SMTP_ENQUIRY_TO?.trim() ||
      process.env.SALES_INBOX?.trim() ||
      process.env.SMTP_USER?.trim() ||
      ''
    );
  }

  private kindLabel(kind: EnquiryKind): string {
    return kind === 'travel_credit' ? 'Travel Credits' : 'Jet Card';
  }

  async notifyEnquiry(
    payload: EnquiryPayload,
  ): Promise<{ customerSent: boolean; salesSent: boolean }> {
    const label = this.kindLabel(payload.kind);
    const name = [payload.firstName, payload.lastName]
      .filter(Boolean)
      .join(' ');
    const attachmentBlock =
      payload.attachmentUrls && payload.attachmentUrls.length > 0
        ? `\n\nAttachments:\n${payload.attachmentUrls.map((u) => `- ${u}`).join('\n')}`
        : '';

    const customerText = [
      `Dear ${payload.firstName},`,
      '',
      `Thank you for your ${label} enquiry (#${payload.enquiryId}).`,
      payload.packageName ? `Package: ${payload.packageName}` : '',
      'Our charter specialists will contact you within one business day.',
      '',
      '— JetVina Private Jet Charter',
    ]
      .filter(Boolean)
      .join('\n');

    const customer = await this.email.sendMail({
      to: payload.email,
      subject: `JetVina ${label} Enquiry #${payload.enquiryId} Received`,
      text: customerText,
      html: customerText.replace(/\n/g, '<br>'),
    });

    const salesTo = this.salesInbox();
    let salesSent = false;
    if (salesTo) {
      const salesText = [
        `[${label}] New enquiry #${payload.enquiryId}`,
        '',
        `Name: ${name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        payload.packageName ? `Package: ${payload.packageName}` : '',
        payload.message ? `Message: ${payload.message}` : '',
        attachmentBlock,
      ]
        .filter(Boolean)
        .join('\n');

      const sales = await this.email.sendMail({
        to: salesTo,
        replyTo: payload.email,
        subject: `[JetVina ${label}] ${name} - #${payload.enquiryId}`,
        text: salesText,
        html: salesText.replace(/\n/g, '<br>'),
      });
      salesSent = sales.sent;
    } else {
      this.logger.warn(
        `Sales inbox not configured — skipped staff notification for enquiry #${payload.enquiryId}`,
      );
    }

    return { customerSent: customer.sent, salesSent };
  }

  /** Sales/admin alert for new charter quote (customer ACK is CustomerCare). */
  async notifyNewQuote(payload: {
    quoteId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    message?: string | null;
    tripSummary?: string;
    sourcePage?: string;
  }): Promise<{ salesSent: boolean }> {
    const salesTo = this.salesInbox();
    if (!salesTo) {
      this.logger.warn(
        `Sales inbox not configured — skipped staff notification for quote #${payload.quoteId}`,
      );
      return { salesSent: false };
    }

    const name = [payload.firstName, payload.lastName]
      .filter(Boolean)
      .join(' ');
    const salesText = [
      `[Quote] New charter request #${payload.quoteId}`,
      '',
      `Name: ${name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      payload.tripSummary ? `Route: ${payload.tripSummary}` : '',
      payload.sourcePage ? `Source: ${payload.sourcePage}` : '',
      payload.message ? `Message: ${payload.message}` : '',
      '',
      'Admin → Quotes to review / create offer.',
    ]
      .filter(Boolean)
      .join('\n');

    const sales = await this.email.sendMail({
      to: salesTo,
      replyTo: payload.email,
      subject: `[JetVina Quote] ${name} - #${payload.quoteId}`,
      text: salesText,
      html: salesText.replace(/\n/g, '<br>'),
    });
    return { salesSent: sales.sent };
  }
}
