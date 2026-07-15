import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { inferLocaleFromPhone, normalizeEmailLocale } from './customer-care/email-layout';
import {
  renderEnquiryCustomerEmail,
  renderEnquirySalesEmail,
  renderQuoteSalesEmail,
} from './customer-care/ops-email-templates';

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
  locale?: string;
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

  private resolveLocale(locale?: string, phone?: string): string {
    return normalizeEmailLocale(
      locale || inferLocaleFromPhone(phone) || 'en',
    );
  }

  private kindLabel(kind: EnquiryKind, locale: string): string {
    if (locale === 'vi') {
      return kind === 'travel_credit' ? 'Travel Credits' : 'Jet Card';
    }
    if (locale === 'zh-cn') {
      return kind === 'travel_credit' ? '旅行积分' : 'Jet Card';
    }
    return kind === 'travel_credit' ? 'Travel Credits' : 'Jet Card';
  }

  async notifyEnquiry(
    payload: EnquiryPayload,
  ): Promise<{ customerSent: boolean; salesSent: boolean }> {
    const locale = this.resolveLocale(payload.locale, payload.phone);
    const label = this.kindLabel(payload.kind, locale);
    const name = [payload.firstName, payload.lastName]
      .filter(Boolean)
      .join(' ');

    const customerMail = renderEnquiryCustomerEmail({
      locale,
      enquiryId: payload.enquiryId,
      firstName: payload.firstName,
      kindLabel: label,
      packageName: payload.packageName,
    });

    const customer = await this.email.sendMail({
      to: payload.email,
      subject: customerMail.subject,
      text: customerMail.text,
      html: customerMail.html,
    });

    const salesTo = this.salesInbox();
    let salesSent = false;
    if (salesTo) {
      const salesMail = renderEnquirySalesEmail({
        locale,
        enquiryId: payload.enquiryId,
        name,
        email: payload.email,
        phone: payload.phone,
        kindLabel: label,
        packageName: payload.packageName,
        message: payload.message,
        attachmentUrls: payload.attachmentUrls,
      });
      const sales = await this.email.sendMail({
        to: salesTo,
        replyTo: payload.email,
        subject: salesMail.subject,
        text: salesMail.text,
        html: salesMail.html,
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
    locale?: string;
  }): Promise<{ salesSent: boolean }> {
    const salesTo = this.salesInbox();
    if (!salesTo) {
      this.logger.warn(
        `Sales inbox not configured — skipped staff notification for quote #${payload.quoteId}`,
      );
      return { salesSent: false };
    }

    const locale = this.resolveLocale(payload.locale, payload.phone);
    const name = [payload.firstName, payload.lastName]
      .filter(Boolean)
      .join(' ');
    const mail = renderQuoteSalesEmail({
      locale,
      quoteId: payload.quoteId,
      name,
      email: payload.email,
      phone: payload.phone,
      tripSummary: payload.tripSummary,
      sourcePage: payload.sourcePage,
      message: payload.message,
    });

    const sales = await this.email.sendMail({
      to: salesTo,
      replyTo: payload.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    return { salesSent: sales.sent };
  }
}
