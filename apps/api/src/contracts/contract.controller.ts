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
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { Public } from '../auth/public.decorator';
import { ContractService } from './contract.service';

@ApiTags('Contracts')
@ApiSecurity('X-API-Key')
@Controller()
export class ContractController {
  constructor(private readonly contracts: ContractService) {}

  @Get('admin/contracts')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.view')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List operator contracts' })
  list(@Query('status') status?: string) {
    return this.contracts.list(status);
  }

  @Get('admin/contracts/templates')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.view')
  @ApiBearerAuth('bearer')
  listTemplates() {
    return this.contracts.listTemplates();
  }

  @Get('admin/contracts/:id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.view')
  @ApiBearerAuth('bearer')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.contracts.getById(id);
  }

  @Post('admin/contracts')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.create')
  @ApiBearerAuth('bearer')
  create(
    @Body()
    body: {
      bookingId: number;
      aircraftId: number;
      operatorId?: number;
      contractTemplateId?: number;
      amount?: number;
      currency?: string;
    },
    @CurrentUser() user: AuthUser,
  ) {
    return this.contracts.create({ ...body, userId: user.userId });
  }

  @Post('admin/contracts/:id/submit')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.submit_approval')
  @ApiBearerAuth('bearer')
  submit(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.contracts.submitForApproval(id, user.userId);
  }

  @Post('admin/contracts/:id/approve')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.approve')
  @ApiBearerAuth('bearer')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { note?: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.contracts.approve(id, user.userId, body?.note);
  }

  @Post('admin/contracts/:id/reject')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.reject')
  @ApiBearerAuth('bearer')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason?: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.contracts.reject(id, user.userId, body?.reason);
  }

  @Post('admin/contracts/:id/request-changes')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.request_changes')
  @ApiBearerAuth('bearer')
  requestChanges(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { note?: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.contracts.requestChanges(id, user.userId, body?.note);
  }

  @Post('admin/contracts/:id/send-docusign')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('contract.send_docusign')
  @ApiBearerAuth('bearer')
  send(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: { signers: Array<{ email: string; name: string; role: string }> },
    @CurrentUser() user: AuthUser,
  ) {
    return this.contracts.sendForSignature(id, body.signers ?? [], user.userId);
  }

  @Post('webhooks/docusign')
  @Public()
  @ApiOperation({
    summary: 'DocuSign / mock signature webhook (idempotent by eventId)',
  })
  webhook(
    @Body()
    body: {
      eventId: string;
      envelopeId: string;
      eventType: string;
      provider?: string;
      payload?: Record<string, unknown>;
    },
  ) {
    return this.contracts.handleSignatureWebhook({
      eventId: body.eventId,
      envelopeId: body.envelopeId,
      eventType: body.eventType,
      provider: body.provider,
      payload: body.payload as
        import('@prisma/client').Prisma.InputJsonValue | undefined,
    });
  }
}
