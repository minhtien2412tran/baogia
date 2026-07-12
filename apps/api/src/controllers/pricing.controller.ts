import { Body, Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PricingEstimateDto } from '../dto';
import { PricingEstimateService } from '../services/pricing-estimate.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Pricing')
@ApiSecurity('X-API-Key')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricing: PricingEstimateService) {}

  @Post('estimate')
  @HttpCode(200)
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Estimate charter price including positioning from current aircraft location',
    description:
      'Creates POSITIONING + PASSENGER legs when aircraft is not at pickup. Does not auto-add RETURN (pending KH confirmation). Price is always labeled as estimate.',
  })
  estimate(@Body() body: PricingEstimateDto, @CurrentUser() user?: AuthUser) {
    const isAdmin = user?.role === 'ADMIN';
    return this.pricing.estimate(
      {
        ...body,
        includeInternalBreakdown: body.includeInternalBreakdown || isAdmin,
      },
      { isAdmin },
    );
  }
}
