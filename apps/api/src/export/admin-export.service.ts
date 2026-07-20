import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';

type ExportFormat = 'pdf' | 'xlsx' | 'csv';

@Injectable()
export class AdminExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportQuotes(format: ExportFormat) {
    const quotes = await this.prisma.quoteRequest.findMany({
      include: {
        legs: {
          include: { fromAirport: true, toAirport: true },
          orderBy: { seq: 'asc' },
          take: 1,
        },
        offers: { select: { id: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    const rows = quotes.map((q) => ({
      id: q.id,
      name: `${q.firstName} ${q.lastName}`,
      email: q.email,
      status: q.status,
      tripType: q.tripType,
      route: q.legs[0]
        ? `${q.legs[0].fromAirport.iata} → ${q.legs[0].toAirport.iata}`
        : '',
      offers: q.offers.length,
      createdAt: q.createdAt.toISOString(),
    }));
    return this.render('Quotes', rows, format, [
      'id',
      'name',
      'email',
      'status',
      'tripType',
      'route',
      'offers',
      'createdAt',
    ]);
  }

  async exportBookings(format: ExportFormat) {
    const bookings = await this.prisma.booking.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    const rows = bookings.map((b) => ({
      id: b.id,
      code: b.bookingCode ?? '',
      status: b.bookingStatus,
      email: b.user?.email ?? '',
      total: Number(b.estimatedPriceTotal ?? 0),
      currency: b.estimatedPriceCurrency ?? 'USD',
      createdAt: b.createdAt.toISOString(),
    }));
    return this.render('Bookings', rows, format, [
      'id',
      'code',
      'status',
      'email',
      'total',
      'currency',
      'createdAt',
    ]);
  }

  async exportUsers(format: ExportFormat) {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    const rows = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString(),
    }));
    return this.render('Users', rows, format, [
      'id',
      'email',
      'name',
      'role',
      'status',
      'createdAt',
    ]);
  }

  async exportPayments(format: ExportFormat) {
    const payments = await this.prisma.payment.findMany({
      include: { booking: { select: { bookingCode: true } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    const rows = payments.map((p) => ({
      id: p.id,
      bookingCode: p.booking.bookingCode ?? '',
      method: p.method,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }));
    return this.render('Payments', rows, format, [
      'id',
      'bookingCode',
      'method',
      'amount',
      'currency',
      'status',
      'createdAt',
    ]);
  }

  async exportContracts(format: ExportFormat) {
    const contracts = await this.prisma.operatorContract.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    const rows = contracts.map((c) => ({
      id: c.id,
      contractNumber: c.contractNumber ?? '',
      bookingId: c.bookingId,
      status: c.status,
      amount: c.amount != null ? Number(c.amount) : '',
      currency: c.currency ?? 'USD',
      createdAt: c.createdAt.toISOString(),
    }));
    return this.render('Contracts', rows, format, [
      'id',
      'contractNumber',
      'bookingId',
      'status',
      'amount',
      'currency',
      'createdAt',
    ]);
  }

  async exportQuotePdf(id: number) {
    const quote = await this.prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        legs: {
          include: { fromAirport: true, toAirport: true },
          orderBy: { seq: 'asc' },
        },
        offers: true,
      },
    });
    if (!quote) throw new NotFoundException(`Quote #${id} not found`);

    const lines = [
      `Quote #${quote.id}`,
      `Customer: ${quote.firstName} ${quote.lastName} <${quote.email}>`,
      `Status: ${quote.status}`,
      `Trip: ${quote.tripType}`,
      '',
      'Legs:',
      ...quote.legs.map(
        (l) =>
          `  ${l.seq}. ${l.fromAirport.iata} → ${l.toAirport.iata} · pax ${l.passengers}`,
      ),
      '',
      `Offers: ${quote.offers.length}`,
      ...quote.offers.map(
        (o) => `  #${o.id} · ${Number(o.price)} · ${o.status}`,
      ),
    ];
    return this.pdfBuffer('JetVina Quote', lines);
  }

  async exportBookingPdf(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, payments: true },
    });
    if (!booking) throw new NotFoundException(`Booking #${id} not found`);
    const lines = [
      `Booking ${booking.bookingCode}`,
      `Status: ${booking.bookingStatus}`,
      `Customer: ${booking.user?.email ?? '—'}`,
      `Total: ${booking.estimatedPriceCurrency ?? 'USD'} ${Number(booking.estimatedPriceTotal ?? 0)}`,
      '',
      'Payments:',
      ...booking.payments.map(
        (p) =>
          `  #${p.id} · ${p.method} · ${p.currency} ${Number(p.amount)} · ${p.status}`,
      ),
    ];
    return this.pdfBuffer('JetVina Booking', lines);
  }

  private async render(
    title: string,
    rows: Record<string, string | number>[],
    format: ExportFormat,
    columns: string[],
  ) {
    if (format === 'pdf') {
      const lines = [
        title,
        `Generated: ${new Date().toISOString()}`,
        `Rows: ${rows.length}`,
        '',
        columns.join(' | '),
        ...rows.map((r) => columns.map((c) => String(r[c] ?? '')).join(' | ')),
      ];
      const buffer = await this.pdfBuffer(`JetVina ${title}`, lines);
      return {
        buffer,
        contentType: 'application/pdf',
        filename: `jetvina-${title.toLowerCase()}.pdf`,
      };
    }

    // Excel-compatible CSV (UTF-8 BOM) — avoids new heavy deps; opens in Excel.
    const header = columns.join(',');
    const body = rows
      .map((r) =>
        columns
          .map((c) => {
            const raw = String(r[c] ?? '');
            return `"${raw.replace(/"/g, '""')}"`;
          })
          .join(','),
      )
      .join('\n');
    const csv = `\uFEFF${header}\n${body}`;
    const buffer = Buffer.from(csv, 'utf8');
    const ext = format === 'xlsx' ? 'xlsx.csv' : 'csv';
    return {
      buffer,
      contentType: 'text/csv; charset=utf-8',
      filename: `jetvina-${title.toLowerCase()}.${ext === 'xlsx.csv' ? 'csv' : 'csv'}`,
    };
  }

  private pdfBuffer(title: string, lines: string[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 48, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc
        .fillColor('#0b1f2a')
        .fontSize(18)
        .text('JetVina', { continued: false });
      doc
        .fontSize(11)
        .fillColor('#5a6b75')
        .text(title)
        .moveDown();
      doc.fillColor('#0b1f2a').fontSize(10);
      for (const line of lines) {
        doc.text(line);
      }
      doc.end();
    });
  }
}
