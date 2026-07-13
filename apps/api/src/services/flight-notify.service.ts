import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class FlightNotifyService {
  private readonly logger = new Logger(FlightNotifyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly templates: EmailTemplateService,
  ) {}

  private adminInbox(): string | null {
    return (
      process.env.SMTP_ENQUIRY_TO?.trim() ||
      process.env.SALES_INBOX?.trim() ||
      process.env.SMTP_USER?.trim() ||
      null
    );
  }

  async notifyOperatorAndAdmin(bookingId: number, event = 'created') {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        quoteOffer: { include: { operator: true } },
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

    const itinerary =
      booking.quoteRequest?.legs
        ?.map(
          (l) =>
            `${l.fromAirport?.iata ?? '?'}→${l.toAirport?.iata ?? '?'} ${l.departureLocalAt.toISOString().slice(0, 16)}`,
        )
        .join(' · ') || 'N/A';

    const operator = booking.quoteOffer?.operator;
    const vars = {
      bookingId: booking.id,
      bookingStatus: `${booking.bookingStatus} (${event})`,
      customerName:
        `${booking.user?.firstName ?? ''} ${booking.user?.lastName ?? ''}`.trim() ||
        booking.user?.email ||
        'Customer',
      customerEmail: booking.user?.email ?? '',
      operatorName: operator?.name ?? 'Unassigned',
      itinerary,
    };

    let sent = 0;

    if (operator?.contactEmail) {
      const r = await this.templates.sendRendered({
        key: 'operator_flight_notify',
        to: operator.contactEmail,
        vars,
        campaignKey: `operator_flight_${event}`,
        referenceId: String(bookingId),
      });
      if (r.sent) sent += 1;
    } else {
      this.logger.warn(
        `No operator contactEmail for booking ${bookingId} (operator=${operator?.id ?? 'none'})`,
      );
    }

    const adminTo = this.adminInbox();
    if (adminTo) {
      const r = await this.templates.sendRendered({
        key: 'admin_flight_notify',
        to: adminTo,
        vars,
        campaignKey: `admin_flight_${event}`,
        referenceId: String(bookingId),
      });
      if (r.sent) sent += 1;
    }

    return { sent, bookingId };
  }
}
