import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { CreateQuoteOfferDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Admin Quotes')
@ApiSecurity('X-API-Key')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminQuotesController {
  constructor(private readonly quotes: AdminQuotesService) {}

  @Get('quotes')
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
  @ApiOperation({ summary: 'Get quote request detail with offers' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotes.getQuote(id);
  }

  @Get('operators')
  @ApiOperation({ summary: 'List active operators for offer forms' })
  listOperators() {
    return this.quotes.listOperators();
  }

  @Post('quotes/:id/offers')
  @ApiOperation({ summary: 'Create a quote offer and mark request OFFERED' })
  createOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateQuoteOfferDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.quotes.createOffer(id, body, user.userId);
  }
}
