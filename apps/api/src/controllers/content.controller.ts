import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SubscribeNewsletterDto } from '../dto';

@ApiTags('Content (CMS)')
@Controller()
export class ContentController {
  @Get('content/news')
  @ApiOperation({ summary: 'Get news articles listing' })
  @ApiResponse({ status: 200, description: 'News list.' })
  getNews() {
    return {
      news: [
        { id: 201, slug: 'jetbay-expands-fleet', title: 'JETBAY Expands Private Jet Fleet', author: 'PR Team', publishedAt: '2026-06-25' }
      ]
    };
  }

  @Get('content/blogs')
  @ApiOperation({ summary: 'Get blog posts listing' })
  @ApiResponse({ status: 200, description: 'Blogs list.' })
  getBlogs() {
    return {
      blogs: [
        { id: 301, slug: 'pet-travel-tips', title: 'Tips for Flying with Pets on a Private Jet', author: 'Editorial Team', publishedAt: '2026-06-20' }
      ]
    };
  }

  @Get('content/videos')
  @ApiOperation({ summary: 'Get video center items' })
  @ApiResponse({ status: 200, description: 'Videos list.' })
  getVideos() {
    return {
      videos: [
        { id: 401, slug: 'inside-g650-cabin', title: 'A Peek Inside the Gulfstream G650 Cabin', duration: 180, viewCount: 1450 }
      ]
    };
  }

  @Get('content/pages/:slug')
  @ApiOperation({ summary: 'Get dynamic content/legal pages by slug' })
  @ApiParam({ name: 'slug', type: 'string', example: 'privacy-policy' })
  @ApiResponse({ status: 200, description: 'Page contents.' })
  getPage(@Param('slug') slug: string) {
    return {
      slug: slug,
      title: slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms & Conditions',
      body: 'This is the clean-room reconstructed legal content.',
      seoMeta: { title: `${slug} - J-TA`, description: 'Legal policies and documentation.' },
      updatedAt: '2026-06-29T15:00:00Z',
    };
  }

  @Post('newsletter/subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 200, description: 'Successfully subscribed.' })
  subscribeNewsletter(@Body() body: SubscribeNewsletterDto) {
    return {
      status: 'SUBSCRIBED',
      message: 'Successfully subscribed to the newsletter.',
    };
  }
}
