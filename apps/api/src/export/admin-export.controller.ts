import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { AdminExportService } from './admin-export.service';

type Format = 'pdf' | 'csv' | 'xlsx';

function parseFormat(raw?: string): Format {
  if (raw === 'pdf' || raw === 'xlsx') return raw;
  return 'csv';
}

@ApiTags('Admin Export')
@ApiSecurity('X-API-Key')
@Controller('admin/export')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminExportController {
  constructor(private readonly exportService: AdminExportService) {}

  @Get('quotes')
  @RequirePermissions('quote.export', 'quote.view')
  @ApiQuery({ name: 'format', required: false, enum: ['pdf', 'csv', 'xlsx'] })
  @ApiOperation({ summary: 'Export quotes list (PDF / CSV Excel-compatible)' })
  async quotes(@Query('format') format: string | undefined, @Res() res: Response) {
    const out = await this.exportService.exportQuotes(parseFormat(format));
    this.send(res, out);
  }

  @Get('bookings')
  @RequirePermissions('booking.export', 'booking.view')
  @ApiQuery({ name: 'format', required: false })
  @ApiOperation({ summary: 'Export bookings list' })
  async bookings(@Query('format') format: string | undefined, @Res() res: Response) {
    const out = await this.exportService.exportBookings(parseFormat(format));
    this.send(res, out);
  }

  @Get('users')
  @RequirePermissions('user.export', 'user.manage')
  @ApiQuery({ name: 'format', required: false })
  @ApiOperation({ summary: 'Export users list' })
  async users(@Query('format') format: string | undefined, @Res() res: Response) {
    const out = await this.exportService.exportUsers(parseFormat(format));
    this.send(res, out);
  }

  @Get('payments')
  @RequirePermissions('payment.export', 'payment.view')
  @ApiQuery({ name: 'format', required: false })
  @ApiOperation({ summary: 'Export payments list' })
  async payments(@Query('format') format: string | undefined, @Res() res: Response) {
    const out = await this.exportService.exportPayments(parseFormat(format));
    this.send(res, out);
  }

  @Get('contracts')
  @RequirePermissions('contract.export', 'contract.view')
  @ApiQuery({ name: 'format', required: false })
  @ApiOperation({ summary: 'Export contracts list' })
  async contracts(@Query('format') format: string | undefined, @Res() res: Response) {
    const out = await this.exportService.exportContracts(parseFormat(format));
    this.send(res, out);
  }

  @Get('quotes/:id/pdf')
  @RequirePermissions('quote.export', 'quote.view')
  @ApiOperation({ summary: 'Export single quote PDF' })
  async quotePdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const buffer = await this.exportService.exportQuotePdf(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="jetvina-quote-${id}.pdf"`,
    );
    res.send(buffer);
  }

  @Get('bookings/:id/pdf')
  @RequirePermissions('booking.export', 'booking.view')
  @ApiOperation({ summary: 'Export single booking PDF' })
  async bookingPdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const buffer = await this.exportService.exportBookingPdf(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="jetvina-booking-${id}.pdf"`,
    );
    res.send(buffer);
  }

  private send(
    res: Response,
    out: { buffer: Buffer; contentType: string; filename: string },
  ) {
    res.setHeader('Content-Type', out.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${out.filename}"`,
    );
    res.send(out.buffer);
  }
}
