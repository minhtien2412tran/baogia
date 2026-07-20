import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page ?? 1;
    const limit = Math.min(filters?.limit ?? 50, 100);
    const skip = (page - 1) * limit;
    const where =
      filters?.status && filters.status !== 'all'
        ? { status: filters.status.toUpperCase() }
        : {};

    const [total, payments] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.findMany({
        where,
        include: {
          booking: {
            select: {
              id: true,
              bookingCode: true,
              bookingStatus: true,
              user: {
                select: { id: true, email: true, firstName: true, lastName: true },
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
      data: payments.map((p) => ({
        id: p.id,
        bookingId: p.bookingId,
        bookingCode: p.booking.bookingCode,
        bookingStatus: p.booking.bookingStatus,
        customer: p.booking.user
          ? {
              id: p.booking.user.id,
              email: p.booking.user.email,
              name: `${p.booking.user.firstName ?? ''} ${p.booking.user.lastName ?? ''}`.trim(),
            }
          : null,
        method: p.method,
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status,
        transactionRef: p.transactionRef,
        createdAt: p.createdAt.toISOString(),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(id: number) {
    const p = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
    if (!p) return null;
    return {
      id: p.id,
      bookingId: p.bookingId,
      bookingCode: p.booking.bookingCode,
      method: p.method,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      transactionRef: p.transactionRef,
      createdAt: p.createdAt.toISOString(),
      customer: p.booking.user
        ? {
            id: p.booking.user.id,
            email: p.booking.user.email,
            name: `${p.booking.user.firstName ?? ''} ${p.booking.user.lastName ?? ''}`.trim(),
          }
        : null,
    };
  }
}
