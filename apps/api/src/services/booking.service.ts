import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
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
  ) {}

  private normalizeStatus(status: string): BookingStatus {
    const normalized = status.toLowerCase() as BookingStatus;
    if (!BOOKING_STATUSES.includes(normalized)) {
      throw new BadRequestException(`Invalid status. Allowed: ${BOOKING_STATUSES.join(', ')}`);
    }
    return normalized;
  }

  private formatBooking(booking: Awaited<ReturnType<typeof this.findBookingOrThrow>>) {
    const latestPayment = booking.payments[0];
    return {
      id: booking.id,
      quoteId: booking.quoteRequestId ?? booking.quoteOfferId ?? null,
      userId: booking.userId,
      bookingType: booking.bookingType,
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
        fileUrl: doc.fileUrl,
        placeholder: true,
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

  async create(dto: CreateBookingDto, ipAddress?: string) {
    this.validateCreateDto(dto);

    const userId = dto.userId ?? (await this.ensureDemoUser(dto.contact));

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

  async findById(id: number, userId?: number) {
    const booking = await this.findBookingOrThrow(id);
    if (userId && booking.userId !== userId) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return this.formatBooking(booking);
  }

  async cancel(id: number, userId?: number, ipAddress?: string) {
    const booking = await this.findBookingOrThrow(id);
    if (userId && booking.userId !== userId) {
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
      data: { bookingStatus: 'CANCELLED' },
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
      { bookingId: id, previousStatus: booking.bookingStatus },
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

  private async ensureDemoUser(contact: CreateBookingDto['contact']) {
    const existing = await this.prisma.user.findUnique({
      where: { email: contact.email },
    });
    if (existing) {
      return existing.id;
    }
    const created = await this.prisma.user.create({
      data: {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
      },
    });
    return created.id;
  }
}
