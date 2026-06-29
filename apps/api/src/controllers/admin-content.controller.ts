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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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

@ApiTags('Admin Content')
@Controller('admin/content')
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  // --- PAGES ---

  @Get('pages')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create content page (admin)' })
  createPage(@Body() body: CreateContentPageDto) {
    return this.contentService.adminCreatePage(body);
  }

  @Patch('pages/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content page (admin)' })
  updatePage(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateContentPageDto) {
    return this.contentService.adminUpdatePage(id, body);
  }

  @Delete('pages/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content page (admin)' })
  deletePage(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeletePage(id);
  }

  // --- ARTICLES ---

  @Get('articles')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create article (admin)' })
  createArticle(@Body() body: CreateContentArticleDto) {
    return this.contentService.adminCreateArticle(body);
  }

  @Patch('articles/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update article (admin)' })
  updateArticle(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateContentArticleDto) {
    return this.contentService.adminUpdateArticle(id, body);
  }

  @Delete('articles/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete article (admin)' })
  deleteArticle(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeleteArticle(id);
  }

  // --- VIDEOS ---

  @Get('videos')
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'List videos (admin)' })
  listVideos(@Query('status') status?: string, @Query('page') page?: string) {
    return this.contentService.adminListVideos({
      status,
      page: page ? Number(page) : 1,
    });
  }

  @Post('videos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create video (admin)' })
  createVideo(@Body() body: CreateVideoDto) {
    return this.contentService.adminCreateVideo(body);
  }

  @Patch('videos/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update video (admin)' })
  updateVideo(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateVideoDto) {
    return this.contentService.adminUpdateVideo(id, body);
  }

  @Delete('videos/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete video (admin)' })
  deleteVideo(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeleteVideo(id);
  }

  // --- DESTINATIONS ---

  @Get('destinations')
  @ApiBearerAuth()
  @ApiQuery({ name: 'category', required: false })
  @ApiOperation({ summary: 'List destinations (admin)' })
  listDestinations(@Query('category') category?: string, @Query('page') page?: string) {
    return this.contentService.adminListDestinations({
      category,
      page: page ? Number(page) : 1,
    });
  }

  @Post('destinations')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create destination (admin)' })
  createDestination(@Body() body: CreateDestinationDto) {
    return this.contentService.adminCreateDestination(body);
  }

  @Patch('destinations/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update destination (admin)' })
  updateDestination(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateDestinationDto) {
    return this.contentService.adminUpdateDestination(id, body);
  }

  @Delete('destinations/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete destination (admin)' })
  deleteDestination(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.adminDeleteDestination(id);
  }
}
