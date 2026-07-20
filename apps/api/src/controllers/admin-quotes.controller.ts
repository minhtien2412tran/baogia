import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AdminQuotesService } from '../services/admin-quotes.service';
import { CreateQuoteOfferDto, UpdateQuoteStatusDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Admin Quotes')
@ApiSecurity('X-API-Key')
@Controller('admin')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminQuotesController {
  constructor(private readonly quotes: AdminQuotesService) {}

  @Get('quotes')
  @RequirePermissions('quote.view')
  @ApiOperation({ summary: 'List quote requests (paginated)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  list(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.quotes.listQuotes({
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Get('quotes/:id')
  @RequirePermissions('quote.view')
  @ApiOperation({ summary: 'Get quote request detail with offers' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotes.getQuote(id);
  }

  @Post('quotes/:id/offers')
  @RequirePermissions('quote.create')
  @ApiOperation({ summary: 'Create a quote offer and mark request OFFERED' })
  createOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateQuoteOfferDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.quotes.createOffer(id, body, user.userId);
  }

  @Patch('quotes/:id/status')
  @RequirePermissions('quote.update')
  @ApiOperation({ summary: 'Update quote request status' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateQuoteStatusDto,
  ) {
    return this.quotes.updateQuoteStatus(id, body.status);
  }
}
