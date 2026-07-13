import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  ParseIntPipe,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import type { Response, Request } from 'express';
import {
  SearchAircraftDto,
  RequestQuoteDto,
  PaymentIntentDto,
  ConfirmPaymentDto,
  CreateGatewayPaymentDto,
} from '../dto';
import { QuoteService } from '../services/quote.service';
import { DocumentService } from '../services/document.service';
import { BookingService } from '../services/booking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Quotes & Bookings')
@ApiSecurity('X-API-Key')
@Controller()
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly documentService: DocumentService,
    private readonly bookingService: BookingService,
  ) {}
  @Post('quotes/search-aircraft')
  @ApiOperation({ summary: 'Search available aircraft options' })
  @ApiResponse({
    status: 200,
    description: 'List of matching aircraft categories with pricing.',
  })
  searchAircraft(@Body() body: SearchAircraftDto) {
    return this.quoteService.searchAircraft(body);
  }

  @Post('quotes/request')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Submit a formal quote request (links userId when JWT present)',
  })
  @ApiResponse({ status: 201, description: 'Quote request submitted.' })
  requestQuote(
    @Body() body: RequestQuoteDto,
    @CurrentUser() user?: AuthUser | null,
  ) {
    return this.quoteService.requestQuote(body, { userId: user?.userId });
  }

  @Get('quotes/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List quote requests for the current user' })
  getMyQuotes(@CurrentUser() user: AuthUser) {
    return this.quoteService.getMyQuotes(user.userId, user.email);
  }

  @Get('documents/charter-agreements/:id')
  @ApiOperation({ summary: 'Get details of a charter agreement document' })
  @ApiResponse({ status: 200, description: 'Agreement document details.' })
  getCharterAgreement(@Param('id', ParseIntPipe) id: number) {
    return this.quoteService.getCharterAgreement(id);
  }

  @Get('documents/charter-agreements/:id/export')
  @ApiOperation({ summary: 'Export charter agreement as HTML or PDF' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiQuery({ name: 'format', required: false, enum: ['html', 'pdf'] })
  async exportCharterAgreement(
    @Param('id', ParseIntPipe) id: number,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    if (format === 'pdf') {
      const buffer = await this.documentService.generateCharterAgreementPdf(id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="charter-agreement-${id}.pdf"`,
      );
      return res.send(buffer);
    }

    const html = await this.documentService.getCharterAgreementHtml(id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (format === 'html') {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="charter-agreement-${id}.html"`,
      );
    }
    return res.send(html);
  }

  @Get('payments/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List payments for the current user' })
  getMyPayments(@CurrentUser() user: AuthUser) {
    return this.bookingService.findMyPayments(user.userId);
  }

  @Public()
  @Post('payments/stripe/webhook')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async stripeWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Res() res: Response,
  ) {
    const signature = req.headers['stripe-signature'];
    if (!signature || !req.rawBody) {
      return res.status(400).send('Missing signature or body');
    }
    const result = await this.quoteService.handleStripeWebhook(
      req.rawBody,
      Array.isArray(signature) ? signature[0] : signature,
    );
    return res.json(result);
  }

  @Post('payments/intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created.' })
  createPaymentIntent(@Body() body: PaymentIntentDto) {
    return this.quoteService.createPaymentIntent(body);
  }

  @Post('payments/confirm')
  @ApiOperation({ summary: 'Confirm a payment transaction' })
  @ApiResponse({ status: 200, description: 'Payment confirmed.' })
  confirmPayment(@Body() body: ConfirmPaymentDto) {
    return this.quoteService.confirmPayment(body);
  }

  @Post('payments/hold')
  @ApiOperation({ summary: 'Place a payment hold' })
  @ApiResponse({ status: 201, description: 'Hold placed.' })
  placeHold(@Body() body: PaymentIntentDto) {
    return this.quoteService.placeHold(body);
  }

  @Post('payments/gateway')
  @ApiOperation({ summary: 'Create OnePay or 9Pay redirect payment URL' })
  createGatewayPayment(@Body() body: CreateGatewayPaymentDto) {
    return this.quoteService.createGatewayPayment(body);
  }

  @Public()
  @Get('payments/onepay/return')
  @ApiOperation({ summary: 'OnePay return URL handler' })
  async onepayReturn(
    @Query() query: Record<string, string>,
    @Res() res: Response,
  ) {
    const result = await this.quoteService.handleOnepayReturn(query);
    const redirect =
      process.env.PAYMENT_RETURN_URL ?? 'http://localhost:3000/en-us/account';
    res.redirect(
      `${redirect}?payment=${result.status}&ref=${result.orderRef ?? ''}`,
    );
  }

  @Public()
  @Get('payments/onepay/ipn')
  @Post('payments/onepay/ipn')
  @ApiOperation({ summary: 'OnePay IPN callback' })
  async onepayIpn(
    @Query() query: Record<string, string>,
    @Res() res: Response,
  ) {
    const ok = await this.quoteService.handleOnepayIpn(query);
    res.send(
      ok
        ? 'responsecode=1&desc=confirm-success'
        : 'responsecode=0&desc=confirm-fail',
    );
  }

  @Public()
  @Get('payments/9pay/return')
  @ApiOperation({ summary: '9Pay return URL handler' })
  async ninepayReturn(
    @Query() query: Record<string, string>,
    @Res() res: Response,
  ) {
    const result = await this.quoteService.handleNinepayReturn(query);
    const redirect =
      process.env.PAYMENT_RETURN_URL ?? 'http://localhost:3000/en-us/account';
    res.redirect(
      `${redirect}?payment=${result.status}&ref=${result.orderRef ?? ''}`,
    );
  }

  @Public()
  @Post('payments/9pay/ipn')
  @ApiOperation({ summary: '9Pay IPN callback' })
  async ninepayIpn(@Body() body: Record<string, string>, @Res() res: Response) {
    const ok = await this.quoteService.handleNinepayIpn(body);
    res.json({ success: ok });
  }

  @Get('campaigns/world-cup/matches')
  @ApiOperation({ summary: 'List World Cup 2026 matches' })
  getWorldCupMatches() {
    return this.quoteService.getWorldCupMatches();
  }

  @Post('campaigns/world-cup/quotes')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Submit World Cup charter quote' })
  requestWorldCupQuote(
    @Body() body: RequestQuoteDto,
    @CurrentUser() user?: AuthUser | null,
  ) {
    return this.quoteService.requestQuote(
      {
        ...body,
        message: `[World Cup] ${body.message ?? ''}`.trim(),
      },
      {
        userId: user?.userId,
        sourcePage: 'WORLD_CUP_CAMPAIGN',
        campaignCode: 'WC2026',
      },
    );
  }
}
