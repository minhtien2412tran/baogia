import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  CreateTravelCreditPackageDto,
  RedeemCreditsDto,
  TravelCreditEnquiryDto,
  UpdateTravelCreditPackageDto,
} from '../dto';
import { TravelCreditService } from '../services/travel-credit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Travel Credits')
@ApiSecurity('X-API-Key')
@Controller('travel-credits')
export class TravelCreditController {
  constructor(private readonly travelCreditService: TravelCreditService) {}

  @Get('packages')
  @ApiOperation({ summary: 'Get travel credit packages' })
  @ApiResponse({ status: 200, description: 'Available packages.' })
  getPackages() {
    return this.travelCreditService.getPackages();
  }

  @Post('enquiries')
  @ApiOperation({ summary: 'Submit a travel credit enquiry' })
  @ApiResponse({ status: 201, description: 'Enquiry received.' })
  createEnquiry(@Body() body: TravelCreditEnquiryDto) {
    return this.travelCreditService.createEnquiry(body);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get current user Travel Credit balance' })
  @ApiResponse({ status: 200, description: 'Balance details.' })
  getCreditsBalance(@CurrentUser() user: AuthUser) {
    return this.travelCreditService.getBalance(user.userId);
  }

  @Post('redeem')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Redeem Travel Credits for a booking' })
  @ApiResponse({ status: 200, description: 'Credits redeemed.' })
  redeemCredits(@Body() body: RedeemCreditsDto, @CurrentUser() user: AuthUser) {
    return this.travelCreditService.redeem(body, user.userId);
  }
}

@ApiTags('Admin Travel Credits')
@ApiSecurity('X-API-Key')
@Controller('admin/travel-credits')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminTravelCreditController {
  constructor(private readonly travelCreditService: TravelCreditService) {}

  @Get('packages')
  @RequirePermissions('travel_credit.view')
  @ApiOperation({ summary: 'List all travel credit packages (admin)' })
  listPackages() {
    return this.travelCreditService.getPackages(true);
  }

  @Post('packages')
  @RequirePermissions('travel_credit.manage')
  @ApiOperation({ summary: 'Create travel credit package' })
  createPackage(@Body() body: CreateTravelCreditPackageDto) {
    return this.travelCreditService.createPackage(body);
  }

  @Patch('packages/:id')
  @RequirePermissions('travel_credit.manage')
  @ApiOperation({ summary: 'Update travel credit package' })
  updatePackage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTravelCreditPackageDto,
  ) {
    return this.travelCreditService.updatePackage(id, body);
  }

  @Delete('packages/:id')
  @RequirePermissions('travel_credit.manage')
  @ApiOperation({ summary: 'Delete travel credit package' })
  deletePackage(@Param('id', ParseIntPipe) id: number) {
    return this.travelCreditService.deletePackage(id);
  }

  @Get('transactions')
  @RequirePermissions('travel_credit.view')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'List travel credit transactions (admin)' })
  getTransactions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.travelCreditService.getAdminTransactions(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }
}
