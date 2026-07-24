import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  CreateContentArticleDto,
  CreateContentPageDto,
  CreateDestinationDto,
  CreateVideoDto,
  UpdateContentArticleDto,
  UpdateContentPageDto,
  UpdateDestinationDto,
  UpdateVideoDto,
} from '../dto';
import { ContentService } from '../services/content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';

@ApiTags('Admin Content')
@ApiSecurity('X-API-Key')
@Controller('admin/content')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  // --- PAGES ---

  @Get('pages')
  @RequirePermissions('content.view')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'List content pages (admin)' })
  listPages(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.contentService.adminListPages({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      status,
    });
  }

  @Post('pages')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Create content page (admin)' })
  createPage(@Body() body: CreateContentPageDto) {
    return this.contentService.adminCreatePage(body);
  }

  @Get('pages/:id')
  @RequirePermissions('content.view')
  @ApiOperation({ summary: 'Get content page by id (admin)' })
  getPage(
    @Param('id', ParseIntPipe) id: number,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.adminGetPage(id, locale ?? 'en');
  }

  @Patch('pages/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Update content page (admin)' })
  updatePage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateContentPageDto,
  ) {
    return this.contentService.adminUpdatePage(id, body);
  }

  @Delete('pages/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Delete content page (admin)' })
  deletePage(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeletePage(id);
  }

  // --- ARTICLES ---

  @Get('articles')
  @RequirePermissions('content.view')
  @ApiQuery({ name: 'type', required: false, example: 'news' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiOperation({ summary: 'List articles (admin)' })
  listArticles(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contentService.adminListArticles({
      type,
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Post('articles')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Create article (admin)' })
  createArticle(@Body() body: CreateContentArticleDto) {
    return this.contentService.adminCreateArticle(body);
  }

  @Get('articles/:id')
  @RequirePermissions('content.view')
  @ApiOperation({ summary: 'Get article by ID (admin)' })
  getArticle(
    @Param('id', ParseIntPipe) id: number,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.adminGetArticle(id, locale ?? 'en');
  }

  @Patch('articles/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Update article (admin)' })
  updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateContentArticleDto,
  ) {
    return this.contentService.adminUpdateArticle(id, body);
  }

  @Delete('articles/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Delete article (admin)' })
  deleteArticle(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeleteArticle(id);
  }

  // --- VIDEOS ---

  @Get('videos')
  @RequirePermissions('content.view')
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'List videos (admin)' })
  listVideos(@Query('status') status?: string, @Query('page') page?: string) {
    return this.contentService.adminListVideos({
      status,
      page: page ? Number(page) : 1,
    });
  }

  @Post('videos')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Create video (admin)' })
  createVideo(@Body() body: CreateVideoDto) {
    return this.contentService.adminCreateVideo(body);
  }

  @Patch('videos/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Update video (admin)' })
  updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVideoDto,
  ) {
    return this.contentService.adminUpdateVideo(id, body);
  }

  @Delete('videos/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Delete video (admin)' })
  deleteVideo(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeleteVideo(id);
  }

  // --- DESTINATIONS ---

  @Get('destinations')
  @RequirePermissions('content.view')
  @ApiQuery({ name: 'category', required: false })
  @ApiOperation({ summary: 'List destinations (admin)' })
  listDestinations(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contentService.adminListDestinations({
      category,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post('destinations')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Create destination (admin)' })
  createDestination(@Body() body: CreateDestinationDto) {
    return this.contentService.adminCreateDestination(body);
  }

  @Patch('destinations/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Update destination (admin)' })
  updateDestination(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDestinationDto,
  ) {
    return this.contentService.adminUpdateDestination(id, body);
  }

  @Delete('destinations/:id')
  @RequirePermissions('content.manage')
  @ApiOperation({ summary: 'Delete destination (admin)' })
  deleteDestination(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeleteDestination(id);
  }
}
