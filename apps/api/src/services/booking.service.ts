import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CustomerCareService } from './customer-care/customer-care.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto';

const BOOKING_STATUSES = [
  'draft',
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const;

type BookingStatus = (typeof BOOKING_STATUSES)[number];

const STATUS_TO_DB: Record<BookingStatus, string> = {
  draft: 'PENDING',
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

const STATUS_FROM_DB: Record<string, BookingStatus> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly customerCare: CustomerCareService,
  ) {}

  private normalizeStatus(status: string): BookingStatus {
    const normalized = status.toLowerCase() as BookingStatus;
    if (!BOOKING_STATUSES.includes(normalized)) {
      throw new BadRequestException(`Invalid status. Allowed: ${BOOKING_STATUSES.join(', ')}`);
    }
    return normalized;
  }

  private documentExportBase() {
    return (process.env.API_PUBLIC_URL ?? 'http://127.0.0.1:4000').replace(/\/$/, '');
  }

  private formatBooking(booking: Awaited<ReturnType<typeof this.findBookingOrThrow>>) {
    const latestPayment = booking.payments[0];
    const apiBase = this.documentExportBase();
    return {
      id: booking.id,
      quoteId: booking.quoteRequestId ?? booking.quoteOfferId ?? null,
      userId: booking.userId,
      bookingType: booking.bookingType,
      bookingCode: booking.bookingCode,
      customerRouteSummary: booking.customerRouteSummary,
      estimatedPriceTotal:
        booking.estimatedPriceTotal != null ? Number(booking.estimatedPriceTotal) : null,
      estimatedPriceCurrency: booking.estimatedPriceCurrency,
      status: STATUS_FROM_DB[booking.bookingStatus] ?? 'pending',
      agreementStatus: booking.agreementStatus,
      paymentStatus: latestPayment?.status?.toLowerCase() ?? 'pending',
      itinerary: booking.quoteRequest
        ? {
            tripType: booking.quoteRequest.tripType,
            legs: booking.quoteRequest.legs.map((leg) => ({
              fromAirport: leg.fromAirport?.iata ?? '',
              toAirport: leg.toAirport?.iata ?? '',
              departureAt: leg.departureLocalAt.toISOString(),
            })),
          }
        : null,
      passengers: booking.passengers.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        passportNumber: p.passportNumber,
        dateOfBirth: p.dateOfBirth?.toISOString().slice(0, 10) ?? null,
        nationality: p.nationality,
      })),
      contact: booking.user
        ? {
            firstName: booking.user.firstName ?? '',
            lastName: booking.user.lastName ?? '',
            email: booking.user.email,
            phone: booking.user.phone ?? '',
          }
        : null,
      documents: booking.documents.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        status: doc.status,
        fileUrl: `${apiBase}/documents/charter-agreements/${doc.id}/export?format=pdf`,
        htmlUrl: `${apiBase}/documents/charter-agreements/${doc.id}/export?format=html`,
        placeholder: false,
      })),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  private async findBookingOrThrow(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        passengers: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        documents: true,
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
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  private validateCreateDto(dto: CreateBookingDto) {
    if (!dto.itinerary?.legs?.length) {
      throw new BadRequestException('itinerary.legs is required');
    }
    if (!dto.passengers?.length) {
      throw new BadRequestException('At least one passenger is required');
    }
    if (!dto.contact?.email || !dto.contact?.firstName || !dto.contact?.lastName) {
      throw new BadRequestException('contact.firstName, contact.lastName, contact.email are required');
    }
  }

  async create(dto: CreateBookingDto, userId: number, ipAddress?: string) {
    this.validateCreateDto(dto);

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!userExists) {
      throw new BadRequestException('Authenticated user not found');
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        quoteRequestId: dto.quoteId ?? undefined,
        bookingType: dto.bookingType ?? 'CHARTER',
        bookingStatus: STATUS_TO_DB.pending,
        passengers: {
          create: dto.passengers.map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            passportNumber: p.passportNumber,
            dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
            nationality: p.nationality,
          })),
        },
        documents: {
          create: {
            documentType: 'CHARTER_AGREEMENT',
            policyVersion: '1.0',
            fileUrl: '/documents/placeholder-charter-agreement.pdf',
            status: 'PENDING',
          },
        },
      },
      include: {
        user: true,
        passengers: true,
        payments: true,
        documents: true,
        quoteRequest: { include: { legs: { include: { fromAirport: true, toAirport: true } } } },
      },
    });

    await this.audit.log(
      'BOOKING_CREATED',
      { bookingId: booking.id, quoteId: dto.quoteId ?? null },
      userId,
      ipAddress,
    );

    if (booking.user) {
      void this.customerCare.onBookingCreated({
        bookingId: booking.id,
        userId,
        email: booking.user.email,
        firstName: booking.user.firstName,
      });
    }

    return this.formatBooking(booking);
  }

  async findMyBookings(userId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        user: true,
        passengers: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        documents: true,
        quoteRequest: {
          include: {
            legs: {
              include: { fromAirport: true, toAirport: true },
              orderBy: { seq: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map((b) => this.formatBooking(b));
  }

  async findMyPayments(userId: number) {
    const payments = await this.prisma.payment.findMany({
      where: { booking: { userId } },
      include: { booking: { select: { id: true, bookingType: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return payments.map((p) => ({
      id: p.id,
      bookingId: p.bookingId,
      bookingType: p.booking.bookingType,
      method: p.method,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status.toLowerCase(),
      transactionRef: p.transactionRef,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  async findById(id: number, userId?: number) {
    const booking = await this.findBookingOrThrow(id);
    if (userId && booking.userId !== userId) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return this.formatBooking(booking);
  }

  async cancel(
    id: number,
    userId?: number,
    ipAddress?: string,
    opts?: { asStaff?: boolean; reason?: string },
  ) {
    const booking = await this.findBookingOrThrow(id);
    if (userId && !opts?.asStaff && booking.userId !== userId) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    if (booking.bookingStatus === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }
    if (booking.bookingStatus === 'COMPLETED') {
      throw new BadRequestException('Completed bookings cannot be cancelled');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: 'CANCELLED',
        cancelReason: opts?.reason,
        cancelledAt: new Date(),
        cancelledByUserId: userId,
      },
      include: {
        user: true,
        passengers: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        documents: true,
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

    await this.audit.log(
      'BOOKING_CANCELLED',
      {
        bookingId: id,
        previousStatus: booking.bookingStatus,
        asStaff: Boolean(opts?.asStaff),
        reason: opts?.reason,
      },
      userId ?? booking.userId,
      ipAddress,
    );

    return this.formatBooking(updated);
  }

  async findAllAdmin(filters?: { status?: string; page?: number; limit?: number }) {
    const page = filters?.page ?? 1;
    const limit = Math.min(filters?.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where =
      filters?.status && filters.status !== 'all'
        ? { bookingStatus: STATUS_TO_DB[this.normalizeStatus(filters.status)] }
        : {};

    const [total, bookings] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        include: {
          user: true,
          passengers: true,
          payments: { orderBy: { createdAt: 'desc' }, take: 1 },
          documents: true,
          quoteRequest: {
            include: {
              legs: {
                include: { fromAirport: true, toAirport: true },
                orderBy: { seq: 'asc' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: bookings.map((b) => this.formatBooking(b)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatusAdmin(id: number, dto: UpdateBookingStatusDto, adminUserId?: number, ipAddress?: string) {
    const status = this.normalizeStatus(dto.status);
    const booking = await this.findBookingOrThrow(id);

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { bookingStatus: STATUS_TO_DB[status] },
      include: {
        user: true,
        passengers: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        documents: true,
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

    await this.audit.log(
      'BOOKING_STATUS_UPDATED',
      {
        bookingId: id,
        previousStatus: booking.bookingStatus,
        newStatus: STATUS_TO_DB[status],
      },
      adminUserId,
      ipAddress,
    );

    return this.formatBooking(updated);
  }

}
