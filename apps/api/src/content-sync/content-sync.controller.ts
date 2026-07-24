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
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { ContentSyncService } from './content-sync.service';
import { Public } from '../auth/public.decorator';

@ApiTags('Content Sync')
@ApiSecurity('X-API-Key')
@Controller()
export class ContentSyncController {
  constructor(private readonly sync: ContentSyncService) {}

  @Get('content/brand')
  @Public()
  @ApiOperation({
    summary: 'Public brand settings (safe placeholders until client confirm)',
  })
  getBrand() {
    return this.sync.getBrandSettings();
  }

  @Get('admin/content-sources')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.view')
  @ApiBearerAuth('bearer')
  listSources() {
    return this.sync.listSources();
  }

  @Post('admin/content-sources')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.manage')
  @ApiBearerAuth('bearer')
  createSource(
    @Body()
    body: {
      name: string;
      baseUrl: string;
      sourceType: string;
      allowedDomains: string[];
      syncMode?: string;
    },
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.createSource({ ...body, createdBy: user.userId });
  }

  @Post('admin/content-sources/seed-jetvina-reference')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.manage')
  @ApiBearerAuth('bearer')
  seedJetvina(@CurrentUser() user: AuthUser) {
    return this.sync.seedDefaultJetvinaSource(user.userId);
  }

  @Get('admin/content-sources/:id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.view')
  @ApiBearerAuth('bearer')
  getSource(@Param('id', ParseIntPipe) id: number) {
    return this.sync.getSource(id);
  }

  @Patch('admin/content-sources/:id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.manage')
  @ApiBearerAuth('bearer')
  patchSource(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.updateSource(id, body, user.userId);
  }

  @Post('admin/content-sources/:id/test-connection')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.manage')
  @ApiBearerAuth('bearer')
  test(@Param('id', ParseIntPipe) id: number) {
    return this.sync.testConnection(id);
  }

  @Post('admin/content-sync/discover')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.discover')
  @ApiBearerAuth('bearer')
  discover(
    @Body() body: { sourceId: number; dryRun?: boolean },
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.discover(
      body.sourceId,
      user.userId,
      body.dryRun !== false,
    );
  }

  @Get('admin/content-sync/jobs')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.preview')
  @ApiBearerAuth('bearer')
  jobs(@Query('sourceId') sourceId?: string) {
    return this.sync.listJobs(sourceId ? Number(sourceId) : undefined);
  }

  @Get('admin/content-sync/jobs/:id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.preview')
  @ApiBearerAuth('bearer')
  job(@Param('id', ParseIntPipe) id: number) {
    return this.sync.getJob(id);
  }

  @Get('admin/content-sync/jobs/:id/items')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.preview')
  @ApiBearerAuth('bearer')
  items(@Param('id', ParseIntPipe) id: number) {
    return this.sync.listJobItems(id);
  }

  @Get('admin/content-sync/jobs/:id/diff')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.preview')
  @ApiBearerAuth('bearer')
  diff(@Param('id', ParseIntPipe) id: number) {
    return this.sync.listJobItems(id);
  }

  @Post('admin/content-sync/items/:id/approve')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.review')
  @ApiBearerAuth('bearer')
  approveItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.approveItem(id, user.userId);
  }

  @Post('admin/content-sync/items/:id/reject')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.review')
  @ApiBearerAuth('bearer')
  rejectItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.rejectItem(id, user.userId);
  }

  @Post('admin/content-sync/items/:id/request-rewrite')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.review')
  @ApiBearerAuth('bearer')
  rewrite(@Param('id', ParseIntPipe) id: number) {
    return this.sync.requestRewrite(id);
  }

  @Post('admin/content-sync/jobs/:id/publish')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Publish approved sync job (staging marker; flag-gated)',
  })
  publish(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.publishJob(id, user.userId);
  }

  @Post('admin/content-sync/jobs/:id/rollback')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_sync.rollback')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Rollback published sync job (preserves ContentVersion history)',
  })
  rollback(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.rollbackJob(id, user.userId);
  }

  @Get('admin/content-rights')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_rights.view')
  @ApiBearerAuth('bearer')
  rights() {
    return this.sync.listRights();
  }

  @Post('admin/content-rights')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_rights.approve')
  @ApiBearerAuth('bearer')
  upsertRights(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.upsertRights(body as never, user.userId);
  }

  @Post('admin/content-rights/:id/approve')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_rights.approve')
  @ApiBearerAuth('bearer')
  approveRights(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.approveRights(id, user.userId);
  }

  @Post('admin/content-rights/:id/block')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_rights.approve')
  @ApiBearerAuth('bearer')
  blockRights(@Param('id', ParseIntPipe) id: number) {
    return this.sync.blockRights(id);
  }

  @Get('admin/media-assets')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_media.view')
  @ApiBearerAuth('bearer')
  listMedia(@Query('rightsStatus') rightsStatus?: string) {
    return this.sync.listMediaAssets(
      rightsStatus ? { rightsStatus } : undefined,
    );
  }

  @Get('admin/media-assets/:id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_media.view')
  @ApiBearerAuth('bearer')
  getMedia(@Param('id', ParseIntPipe) id: number) {
    return this.sync.getMediaAsset(id);
  }

  @Post('admin/media-assets')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_media.review')
  @ApiBearerAuth('bearer')
  upsertMedia(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.upsertMediaAsset(body as never, user.userId);
  }

  @Post('admin/media-assets/import-manifest')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_media.sync')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary:
      'Import JetVina media manifest into MediaAsset (UNVERIFIED; flag-gated)',
  })
  importManifest(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.importMediaManifest(body as never, user.userId);
  }

  @Post('admin/media-assets/:id/approve-staging')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_media.approve_staging')
  @ApiBearerAuth('bearer')
  approveMediaStaging(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.approveMediaStaging(id, user.userId);
  }

  @Post('admin/media-assets/:id/approve-production')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_media.approve_production')
  @ApiBearerAuth('bearer')
  approveMediaProduction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.approveMediaProduction(id, user.userId);
  }

  @Post('admin/media-assets/:id/block')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_media.block')
  @ApiBearerAuth('bearer')
  blockMedia(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.blockMediaAsset(id, user.userId);
  }

  @Get('content/media-assets')
  @Public()
  @ApiOperation({
    summary: 'Public media — production-approved assets only',
  })
  publicMedia() {
    return this.sync.listPublicApprovedMedia();
  }

  @Get('admin/content-cleanup/jetbay')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.view')
  @ApiBearerAuth('bearer')
  cleanup() {
    return this.sync.jetbayCleanupReport();
  }

  @Get('admin/site-settings/brand')
  @UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
  @RequirePermissions('settings.view', 'content_source.view', 'content_source.manage')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Admin brand settings (Settings tab)' })
  adminBrand() {
    return this.sync.getBrandSettings();
  }

  @Patch('admin/site-settings/brand')
  @UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
  @RequirePermissions('settings.manage', 'content_source.manage')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update brand settings' })
  patchBrand(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sync.setBrandSettings(body, user.userId);
  }

  @Get('admin/content-sync/flags')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions('content_source.view')
  @ApiBearerAuth('bearer')
  flags() {
    return this.sync.featureFlags();
  }
}
