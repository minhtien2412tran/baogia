import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailTemplateService } from './email-template.service';
import { EmailService } from './email.service';
import { AuditService } from './audit.service';

type OperatorContact = {
  id: number;
  name: string;
  contactEmail: string | null;
};

/** Public booking reference — never expose raw DB internals to customers as the primary code. */
export function publicBookingRef(booking: { id: number; bookingCode?: string | null }): string {
  if (booking.bookingCode?.trim()) return booking.bookingCode.trim();
  return `BK-${String(booking.id).padStart(6, '0')}`;
}

@Injectable()
export class FlightNotifyService {
  private readonly logger = new Logger(FlightNotifyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly templates: EmailTemplateService,
    private readonly email: EmailService,
    private readonly audit: AuditService,
  ) {}

  private adminInbox(): string | null {
    return (
      process.env.SMTP_ENQUIRY_TO?.trim() ||
      process.env.SALES_INBOX?.trim() ||
      process.env.SMTP_USER?.trim() ||
      null
    );
  }

  private async operatorRecipientEmails(operator: OperatorContact): Promise<string[]> {
    const set = new Set<string>();
    if (operator.contactEmail?.trim()) {
      set.add(operator.contactEmail.trim().toLowerCase());
    }
    const members = await this.prisma.operatorUser.findMany({
      where: { operatorId: operator.id },
      include: { user: { select: { email: true } } },
    });
    for (const m of members) {
      const e = m.user?.email?.trim();
      if (e) set.add(e.toLowerCase());
    }
    return [...set];
  }

  /**
   * Notify Operator (+ fan-out) and Sales/Admin separately — never shared To/Cc.
   * Idempotency: campaignKey = event:recipientGroup · referenceId = bookingRef:statusVersion
   */
  async notifyOperatorAndAdmin(bookingId: number, event = 'created') {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        passengers: true,
        aircraft: { include: { operator: true, aircraftModel: true } },
        quoteOffer: {
          include: {
            operator: true,
            aircraftModel: true,
          },
        },
        quoteRequest: {
          include: {
            legs: {
              include: { fromAirport: true, toAirport: true },
              orderBy: { seq: 'asc' },
            },
          },
        },
      },
    });
    if (!booking) {
      this.logger.warn(`notify skip: booking ${bookingId} missing`);
      return { sent: 0 };
    }

    const legs = booking.quoteRequest?.legs ?? [];
    const itinerary =
      legs
        .map(
          (l) =>
            `${l.fromAirport?.iata ?? '?'}→${l.toAirport?.iata ?? '?'}`,
        )
        .join(' · ') ||
      booking.customerRouteSummary ||
      'N/A';

    const departureDateTime = legs[0]?.departureLocalAt
      ? legs[0].departureLocalAt.toISOString().slice(0, 16).replace('T', ' ')
      : 'TBD';

    const operator: OperatorContact | null =
      booking.quoteOffer?.operator ?? booking.aircraft?.operator ?? null;

    const aircraftLabel = booking.quoteOffer?.aircraftModel
      ? `${booking.quoteOffer.aircraftModel.manufacturer} ${booking.quoteOffer.aircraftModel.model}`
      : booking.aircraft?.aircraftModel
        ? `${booking.aircraft.aircraftModel.manufacturer} ${booking.aircraft.aircraftModel.model}`
        : booking.aircraft?.registration || 'TBD';

    const bookingReference = publicBookingRef(booking);
    const statusVersion = `${booking.bookingStatus}:${event}`;
    const idemRef = `${bookingReference}:${statusVersion}`;

    const baseVars = {
      bookingReference,
      bookingId: booking.id, // ops templates only — customer templates must prefer bookingReference
      bookingStatus: booking.bookingStatus,
      event,
      customerName:
        `${booking.user?.firstName ?? ''} ${booking.user?.lastName ?? ''}`.trim() ||
        booking.user?.email ||
        'Customer',
      customerEmail: booking.user?.email ?? '',
      operatorName: operator?.name ?? 'Unassigned',
      itinerary,
      departureDateTime,
      aircraftLabel,
      passengerCount: booking.passengers?.length ?? 0,
      quoteOfferId: booking.quoteOfferId ?? '',
      aircraftId: booking.aircraftId ?? '',
      operatorId: operator?.id ?? '',
    };

    let sent = 0;
    let operatorMissing = !operator;
    let operatorNoEmail = false;

    if (operator) {
      const recipients = await this.operatorRecipientEmails(operator);
      if (recipients.length === 0) {
        operatorNoEmail = true;
        this.logger.warn(
          JSON.stringify({
            msg: 'operator_missing_email',
            bookingId,
            bookingReference,
            quoteOfferId: booking.quoteOfferId,
            aircraftId: booking.aircraftId,
            operatorId: operator.id,
          }),
        );
      }
      for (const to of recipients) {
        const r = await this.templates.sendRendered({
          key: 'operator_flight_notify',
          to,
          vars: baseVars,
          campaignKey: `booking_${event}:operator`,
          referenceId: idemRef,
          recipientGroup: 'operator',
        });
        if (r.sent && r.reason !== 'idempotent_skip') sent += 1;
        if (!r.sent && r.reason && r.reason !== 'idempotent_skip') {
          await this.alertMailDeliveryFailed({
            bookingReference,
            bookingId,
            recipientGroup: 'operator',
            to,
            error: r.reason,
            idemRef,
          });
        }
      }
    } else {
      this.logger.warn(
        JSON.stringify({
          msg: 'operator_unassigned',
          bookingId,
          bookingReference,
          quoteOfferId: booking.quoteOfferId,
          aircraftId: booking.aircraftId,
        }),
      );
    }

    if (operatorMissing || operatorNoEmail) {
      await this.alertOperatorUnassigned({
        ...baseVars,
        reason: operatorMissing ? 'operator_missing' : 'operator_missing_email',
        idemRef,
      });
    }

    const adminTo = this.adminInbox();
    if (adminTo) {
      const r = await this.templates.sendRendered({
        key: 'admin_flight_notify',
        to: adminTo,
        vars: {
          ...baseVars,
          operatorName: operator?.name ?? 'UNASSIGNED — manual ops required',
        },
        campaignKey: `booking_${event}:sales`,
        referenceId: idemRef,
        recipientGroup: 'sales',
      });
      if (r.sent && r.reason !== 'idempotent_skip') sent += 1;
      if (!r.sent && r.reason && r.reason !== 'idempotent_skip') {
        await this.alertMailDeliveryFailed({
          bookingReference,
          bookingId,
          recipientGroup: 'sales',
          to: adminTo,
          error: r.reason,
          idemRef,
        });
      }
    }

    await this.audit.log('FLIGHT_NOTIFY', {
      bookingId,
      bookingReference,
      event,
      operatorId: operator?.id ?? null,
      quoteOfferId: booking.quoteOfferId ?? null,
      aircraftId: booking.aircraftId ?? null,
      operatorMissing,
      operatorNoEmail,
      sent,
      needsManual: operatorMissing || operatorNoEmail,
    });

    return {
      sent,
      bookingId,
      bookingReference,
      operatorId: operator?.id ?? null,
      needsManual: operatorMissing || operatorNoEmail,
    };
  }

  private async alertOperatorUnassigned(vars: Record<string, string | number>) {
    const adminTo = this.adminInbox();
    if (!adminTo) return;
    await this.templates.sendRendered({
      key: 'admin_flight_notify',
      to: adminTo,
      vars: {
        ...vars,
        bookingStatus: `OPERATOR_UNASSIGNED (${vars.reason})`,
        operatorName: 'UNASSIGNED',
      },
      campaignKey: 'operator_unassigned:sales',
      referenceId: String(vars.idemRef),
      recipientGroup: 'sales',
    });
  }

  private async alertMailDeliveryFailed(opts: {
    bookingReference: string;
    bookingId: number;
    recipientGroup: string;
    to: string;
    error: string;
    idemRef: string;
  }) {
    const adminTo = this.adminInbox();
    if (!adminTo) return;
    // Sanitize — never forward raw SMTP password; truncate error
    const safeError = opts.error.replace(/pass(word)?[=:]\S+/gi, 'password=***').slice(0, 200);
    const subject = `[JetVina] mail_delivery_failed · ${opts.bookingReference} · ${opts.recipientGroup}`;
    const text = [
      'Mail delivery failed (booking not rolled back).',
      `Booking: ${opts.bookingReference} (#${opts.bookingId})`,
      `Group: ${opts.recipientGroup}`,
      `To: ${opts.to}`,
      `Error: ${safeError}`,
      'Retry from Admin Mail Operations when available.',
    ].join('\n');
    await this.email.sendMail({
      to: adminTo,
      subject,
      text,
      html: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
    });
    await this.audit.log('MAIL_DELIVERY_FAILED', {
      bookingId: opts.bookingId,
      bookingReference: opts.bookingReference,
      recipientGroup: opts.recipientGroup,
      to: opts.to,
      error: safeError,
      idemRef: opts.idemRef,
    });
  }
}
