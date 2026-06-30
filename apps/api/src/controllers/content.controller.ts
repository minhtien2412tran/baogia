import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SubscribeNewsletterDto } from '../dto';
import { ContentService } from '../services/content.service';

@ApiTags('Content (CMS)')
@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('content/news')
  @ApiOperation({ summary: 'Get news articles listing' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'locale', required: false, example: 'en' })
  @ApiResponse({ status: 200, description: 'News list.' })
  getNews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.listArticles('NEWS', {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
      locale,
    });
  }

  @Get('content/news/:slug')
  @ApiOperation({ summary: 'Get news article by slug' })
  @ApiParam({ name: 'slug', example: 'jetbay-expands-fleet' })
  @ApiQuery({ name: 'locale', required: false })
  getNewsBySlug(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.contentService.getArticleBySlug('NEWS', slug, locale ?? 'en');
  }

  @Get('content/blogs')
  @ApiOperation({ summary: 'Get blog posts listing' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'locale', required: false })
  @ApiResponse({ status: 200, description: 'Blogs list.' })
  getBlogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.listArticles('BLOG', {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
      locale,
    });
  }

  @Get('content/blogs/:slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiParam({ name: 'slug', example: 'pet-travel-tips' })
  @ApiQuery({ name: 'locale', required: false })
  getBlogBySlug(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.contentService.getArticleBySlug('BLOG', slug, locale ?? 'en');
  }

  @Get('content/videos')
  @ApiOperation({ summary: 'Get video center items' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'locale', required: false })
  @ApiResponse({ status: 200, description: 'Videos list.' })
  getVideos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.listVideos({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
      locale,
    });
  }

  @Get('content/destinations')
  @ApiOperation({ summary: 'Get destination listings' })
  @ApiQuery({ name: 'category', required: false, example: 'ISLAND' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'locale', required: false })
  getDestinations(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.listDestinations({
      category,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : undefined,
      search,
      locale,
    });
  }

  @Get('content/destinations/:slug')
  @ApiOperation({ summary: 'Get destination by slug' })
  @ApiParam({ name: 'slug', type: 'string', example: 'nassau' })
  @ApiQuery({ name: 'locale', required: false })
  getDestination(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.contentService.getDestinationBySlug(slug, locale ?? 'en');
  }

  @Get('content/pages/:slug')
  @ApiOperation({ summary: 'Get dynamic content/legal pages by slug' })
  @ApiParam({ name: 'slug', type: 'string', example: 'privacy-policy' })
  @ApiQuery({ name: 'locale', required: false })
  @ApiResponse({ status: 200, description: 'Page contents.' })
  getPage(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.contentService.getPageBySlug(slug, locale ?? 'en');
  }

  @Post('newsletter/subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 200, description: 'Successfully subscribed.' })
  subscribeNewsletter(@Body() body: SubscribeNewsletterDto) {
    return this.contentService.subscribeNewsletter(body);
  }
}
