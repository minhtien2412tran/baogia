import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { RequirePermission } from '../auth/permission.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { OperatorContractService } from '../services/operator-contract.service';
import { DocuSignService } from '../integrations/docusign/docusign.service';
import {
  CreateOperatorContractDto,
  UpdateOperatorContractDto,
  RejectOperatorContractDto,
  SendDocuSignDto,
  VoidDocuSignDto,
} from '../dto';

function clientIp(req: Request): string | undefined {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string') return xf.split(',')[0]?.trim();
  return req.ip;
}

@ApiTags('Admin Operator Contracts')
@ApiSecurity('X-API-Key')
@Controller('admin/operator-contracts')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminOperatorContractController {
  constructor(
    private readonly contracts: OperatorContractService,
    private readonly docusign: DocuSignService,
  ) {}

  @Get()
  @ApiQuery({ name: 'aircraftId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'List operator contracts' })
  list(
    @Query('aircraftId') aircraftId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contracts.list({
      aircraftId: aircraftId ? Number(aircraftId) : undefined,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get operator contract' })
  get(@Param('id', ParseIntPipe) id: number) {
    return this.contracts.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create draft operator contract from template (1 open / aircraft)' })
  create(@Body() body: CreateOperatorContractDto, @CurrentUser() user: AuthUser) {
    return this.contracts.create(body, user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update DRAFT contract' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOperatorContractDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.contracts.updateDraft(id, body, user.userId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit contract for internal approval' })
  submit(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.contracts.submit(id, user.userId);
  }

  @Post(':id/approve')
  @UseGuards(PermissionGuard)
  @RequirePermission('APPROVE_CONTRACT')
  @ApiOperation({ summary: 'Approve contract (APPROVE_CONTRACT)' })
  approve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.contracts.approve(id, user.userId, user.role, clientIp(req));
  }

  @Post(':id/reject')
  @UseGuards(PermissionGuard)
  @RequirePermission('APPROVE_CONTRACT')
  @ApiOperation({ summary: 'Reject contract (APPROVE_CONTRACT)' })
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RejectOperatorContractDto,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.contracts.reject(id, body.reason ?? 'Rejected', user.userId, user.role, clientIp(req));
  }

  @Post(':id/void')
  @UseGuards(PermissionGuard)
  @RequirePermission('CANCEL_CONTRACT')
  @ApiOperation({ summary: 'Void contract (CANCEL_CONTRACT)' })
  voidContract(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.contracts.voidContract(id, user.userId, user.role, clientIp(req));
  }

  @Post(':id/docusign/send')
  @ApiOperation({ summary: 'Send APPROVED contract via DocuSign (mock or live)' })
  sendDocuSign(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SendDocuSignDto,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.docusign.send(id, body.recipients, user.userId, clientIp(req));
  }

  @Post(':id/docusign/void')
  @UseGuards(PermissionGuard)
  @RequirePermission('VOID_DOCUSIGN')
  @ApiOperation({ summary: 'Void DocuSign envelope (VOID_DOCUSIGN)' })
  voidDocuSign(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: VoidDocuSignDto,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.docusign.void(id, body.reason, user.userId, user.role, clientIp(req));
  }

  @Get(':id/docusign')
  @ApiOperation({ summary: 'DocuSign envelope status + CoC URL' })
  docusignStatus(@Param('id', ParseIntPipe) id: number) {
    return this.docusign.getStatus(id);
  }
}
