import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContentArticle, ContentTranslation, Destination, Video } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { LocaleService } from '../modules/i18n/locale.service';
import { CANONICAL_LOCALE } from '@jetbay/i18n';
import {
  ContentTranslationDto,
  CreateContentArticleDto,
  CreateContentPageDto,
  CreateDestinationDto,
  CreateVideoDto,
  SubscribeNewsletterDto,
  UpdateContentArticleDto,
  UpdateContentPageDto,
  UpdateDestinationDto,
  UpdateVideoDto,
} from '../dto';

type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  locale?: string;
  category?: string;
};

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly locales: LocaleService,
  ) {}

  private paginate(page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    return { take, skip: (page - 1) * take, page, limit: take };
  }

  private parseStatus(status?: string) {
    if (!status || status === 'all') return undefined;
    return status === 'published';
  }

  private statusLabel(isPublished: boolean) {
    return isPublished ? 'published' : 'draft';
  }

  private async getTranslation(entityType: string, entityId: number, locale = CANONICAL_LOCALE) {
    const chain = this.locales.fallbackChain(locale);
    for (const loc of chain) {
      const translation = await this.prisma.contentTranslation.findUnique({
        where: { entityType_entityId_locale: { entityType, entityId, locale: loc } },
      });
      if (translation) return translation;
    }
    return this.prisma.contentTranslation.findFirst({
      where: { entityType, entityId },
      orderBy: { locale: 'asc' },
    });
  }

  private async upsertTranslation(
    entityType: string,
    entityId: number,
    dto: ContentTranslationDto,
  ) {
    const normalized = this.locales.normalizeTranslationDto(dto);
    const locale = normalized.locale;

    const saved = await this.prisma.contentTranslation.upsert({
      where: {
        entityType_entityId_locale: {
          entityType,
          entityId,
          locale,
        },
      },
      update: {
        title: normalized.title,
        body: normalized.body,
        excerpt: normalized.excerpt,
        seoTitle: normalized.seoTitle,
        seoDescription: normalized.seoDescription,
      },
      create: {
        entityType,
        entityId,
        locale,
        title: normalized.title,
        body: normalized.body,
        excerpt: normalized.excerpt,
        seoTitle: normalized.seoTitle,
        seoDescription: normalized.seoDescription,
      },
    });

    // Reverse sync: non-canonical save mirrors to canonical if missing (unified master row)
    if (locale !== CANONICAL_LOCALE) {
      const canonical = await this.prisma.contentTranslation.findUnique({
        where: {
          entityType_entityId_locale: { entityType, entityId, locale: CANONICAL_LOCALE },
        },
      });
      if (!canonical) {
        await this.prisma.contentTranslation.create({
          data: {
            entityType,
            entityId,
            locale: CANONICAL_LOCALE,
            title: normalized.title,
            body: normalized.body,
            excerpt: normalized.excerpt,
            seoTitle: normalized.seoTitle,
            seoDescription: normalized.seoDescription,
          },
        });
      }
    }

    return saved;
  }

  private formatArticle(
    article: ContentArticle & { category?: { name: string; slug: string } | null },
    translation: ContentTranslation | null,
    detailed = false,
  ) {
    const base = {
      id: article.id,
      slug: article.slug,
      type: article.type.toLowerCase(),
      title: translation?.title ?? article.slug,
      excerpt: translation?.excerpt ?? translation?.seoDescription ?? null,
      author: article.author,
      thumbnail: article.thumbnail,
      category: article.category?.slug ?? null,
      status: this.statusLabel(article.isPublished),
      publishedAt: article.publishedAt?.toISOString() ?? null,
    };
    if (!detailed) return base;
    return {
      ...base,
      content: translation?.body ?? '',
      seoTitle: translation?.seoTitle,
      seoDescription: translation?.seoDescription,
      createdAt: article.createdAt.toISOString(),
    };
  }

  private async resolveCategoryId(slug?: string) {
    if (!slug) return undefined;
    const category = await this.prisma.contentCategory.findUnique({ where: { slug } });
    if (!category) throw new BadRequestException(`Category "${slug}" not found`);
    return category.id;
  }

  private articleTypeFromDto(type: string) {
    const map: Record<string, string> = { news: 'NEWS', blog: 'BLOG' };
    const upper = map[type.toLowerCase()] ?? type.toUpperCase();
    if (!['NEWS', 'BLOG'].includes(upper)) {
      throw new BadRequestException('Article type must be news or blog');
    }
    return upper;
  }

  // --- PUBLIC: PAGES ---

  async getPageBySlug(slug: string, locale = CANONICAL_LOCALE) {
    const article = await this.prisma.contentArticle.findFirst({
      where: { slug, type: { in: ['PAGE', 'LEGAL'] }, isPublished: true },
    });
    if (!article) throw new NotFoundException(`Page "${slug}" not found`);

    const translation = await this.getTranslation('ARTICLE', article.id, locale);
    return {
      slug: article.slug,
      title: translation?.title ?? slug,
      body: translation?.body ?? '',
      excerpt: translation?.excerpt ?? translation?.seoDescription ?? null,
      seoMeta: {
        title: translation?.seoTitle ?? translation?.title,
        description: translation?.seoDescription,
      },
      updatedAt: article.publishedAt?.toISOString() ?? article.createdAt.toISOString(),
    };
  }

  // --- PUBLIC: ARTICLES ---

  async listArticles(type: 'NEWS' | 'BLOG', query: ListQuery) {
    const { page, limit, take, skip } = this.paginate(query.page, query.limit);
    const locale = this.locales.normalize(query.locale);
    const isPublished = this.parseStatus(query.status) ?? true;

    const articles = await this.prisma.contentArticle.findMany({
      where: {
        type,
        isPublished,
        ...(query.category
          ? { category: { slug: query.category } }
          : {}),
      },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take,
    });

    const withTranslations = await Promise.all(
      articles.map(async (a) => {
        const t = await this.getTranslation('ARTICLE', a.id, locale);
        if (query.search && t && !t.title.toLowerCase().includes(query.search.toLowerCase())) {
          return null;
        }
        return this.formatArticle(a, t);
      }),
    );

    const data = withTranslations.filter(Boolean);
    const total = await this.prisma.contentArticle.count({
      where: { type, isPublished },
    });

    const key = type === 'NEWS' ? 'news' : 'blogs';
    return {
      [key]: data,
      pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
    };
  }

  async getArticleBySlug(type: 'NEWS' | 'BLOG', slug: string, locale = CANONICAL_LOCALE) {
    const article = await this.prisma.contentArticle.findFirst({
      where: { slug, type, isPublished: true },
      include: { category: true },
    });
    if (!article) throw new NotFoundException(`${type} article "${slug}" not found`);

    const translation = await this.getTranslation('ARTICLE', article.id, locale);
    return this.formatArticle(article, translation, true);
  }

  // --- PUBLIC: VIDEOS ---

  async listVideos(query: ListQuery) {
    const { page, limit, take, skip } = this.paginate(query.page, query.limit);
    const locale = this.locales.normalize(query.locale);
    const isPublished = this.parseStatus(query.status) ?? true;

    const videos = await this.prisma.video.findMany({
      where: { isPublished },
      orderBy: { publishedAt: 'desc' },
      skip,
      take,
    });

    const data = (
      await Promise.all(
        videos.map(async (v) => {
          const t = await this.getTranslation('VIDEO', v.id, locale);
          if (query.search && t && !t.title.toLowerCase().includes(query.search.toLowerCase())) {
            return null;
          }
          return this.formatVideo(v, t);
        }),
      )
    ).filter(Boolean);

    const total = await this.prisma.video.count({ where: { isPublished } });
    return {
      videos: data,
      pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
    };
  }

  private formatVideo(video: Video, translation: ContentTranslation | null) {
    return {
      id: video.id,
      slug: video.slug,
      title: translation?.title ?? video.slug,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail,
      duration: video.duration,
      viewCount: video.viewCount,
      status: this.statusLabel(video.isPublished),
      publishedAt: video.publishedAt?.toISOString() ?? null,
    };
  }

  // --- PUBLIC: DESTINATIONS ---

  async listDestinations(query: ListQuery) {
    const { page, limit, take, skip } = this.paginate(query.page, query.limit);
    const locale = this.locales.normalize(query.locale);
    const isPublished = this.parseStatus(query.status) ?? true;

    const destinations = await this.prisma.destination.findMany({
      where: {
        isPublished,
        ...(query.category ? { category: query.category.toUpperCase() } : {}),
      },
      orderBy: { city: 'asc' },
      skip,
      take,
    });

    const data = (
      await Promise.all(
        destinations.map(async (d) => {
          const t = await this.getTranslation('DESTINATION', d.id, locale);
          if (query.search) {
            const q = query.search.toLowerCase();
            if (
              !d.city.toLowerCase().includes(q) &&
              !d.country.toLowerCase().includes(q) &&
              !(t?.title.toLowerCase().includes(q) ?? false)
            ) {
              return null;
            }
          }
          return this.formatDestination(d, t);
        }),
      )
    ).filter(Boolean);

    const total = await this.prisma.destination.count({
      where: { isPublished, ...(query.category ? { category: query.category.toUpperCase() } : {}) },
    });

    return {
      destinations: data,
      pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
    };
  }

  async getDestinationBySlug(slug: string, locale = CANONICAL_LOCALE) {
    const dest = await this.prisma.destination.findFirst({
      where: { slug, isPublished: true },
    });
    if (!dest) throw new NotFoundException(`Destination not found: ${slug}`);
    const t = await this.getTranslation('DESTINATION', dest.id, locale);
    return this.formatDestination(dest, t, true);
  }

  private formatDestination(dest: Destination, translation: ContentTranslation | null, detailed = false) {
    const base = {
      id: dest.id,
      slug: dest.slug,
      category: dest.category,
      city: dest.city,
      country: dest.country,
      title: translation?.title ?? dest.city,
      tagline: translation?.excerpt ?? null,
      thumbnail: dest.thumbnail,
      status: this.statusLabel(dest.isPublished),
    };
    if (!detailed) return base;
    return {
      ...base,
      description: translation?.body ?? '',
      seoTitle: translation?.seoTitle,
      seoDescription: translation?.seoDescription,
    };
  }

  // --- NEWSLETTER ---

  async subscribeNewsletter(body: SubscribeNewsletterDto) {
    await this.prisma.auditLog.create({
      data: {
        action: 'NEWSLETTER_SUBSCRIBE',
        details: { email: body.email, locale: this.locales.normalize(body.locale) },
      },
    });
    return { status: 'SUBSCRIBED', message: 'Successfully subscribed to the newsletter.' };
  }

  // --- ADMIN: PAGES ---

  async adminListPages(query: ListQuery) {
    const { page, limit, take, skip } = this.paginate(query.page, query.limit);
    const locale = this.locales.normalize(query.locale);
    const isPublished = this.parseStatus(query.status);

    const pages = await this.prisma.contentArticle.findMany({
      where: {
        type: { in: ['PAGE', 'LEGAL'] },
        ...(isPublished !== undefined ? { isPublished } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const data = await Promise.all(
      pages.map(async (p) => {
        const t = await this.getTranslation('ARTICLE', p.id, locale);
        const formatted = this.formatArticle(p, t, true) as Record<string, unknown>;
        return {
          ...formatted,
          body: formatted.content,
          isPublished: p.isPublished,
        };
      }),
    );

    const total = await this.prisma.contentArticle.count({
      where: { type: { in: ['PAGE', 'LEGAL'] } },
    });

    return { data, pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) } };
  }

  async adminCreatePage(dto: CreateContentPageDto) {
    const isPublished = dto.status === 'published';
    const page = await this.prisma.contentArticle.create({
      data: {
        type: 'PAGE',
        slug: dto.slug,
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });
    await this.upsertTranslation('ARTICLE', page.id, dto.translation);
    await this.audit.log('CONTENT_PAGE_CREATED', { pageId: page.id, slug: dto.slug });
    const t = await this.getTranslation('ARTICLE', page.id, dto.translation.locale);
    return this.formatArticle(page, t, true);
  }

  async adminGetPage(id: number, locale = CANONICAL_LOCALE) {
    const page = await this.findPageOrThrow(id);
    const t = await this.getTranslation('ARTICLE', id, locale);
    const formatted = this.formatArticle(page, t, true) as Record<string, unknown>;
    return {
      ...formatted,
      body: formatted.content,
      isPublished: page.isPublished,
    };
  }

  async adminUpdatePage(id: number, dto: UpdateContentPageDto) {
    await this.findPageOrThrow(id);
    const isPublished = dto.status ? dto.status === 'published' : undefined;

    const page = await this.prisma.contentArticle.update({
      where: { id },
      data: {
        slug: dto.slug,
        ...(isPublished !== undefined
          ? { isPublished, publishedAt: isPublished ? new Date() : null }
          : {}),
      },
    });
    if (dto.translation) await this.upsertTranslation('ARTICLE', id, dto.translation);
    await this.audit.log('CONTENT_PAGE_UPDATED', { pageId: id });
    const t = await this.getTranslation('ARTICLE', id, this.locales.normalize(dto.translation?.locale));
    return this.formatArticle(page, t, true);
  }

  async adminDeletePage(id: number) {
    await this.findPageOrThrow(id);
    await this.prisma.contentTranslation.deleteMany({
      where: { entityType: 'ARTICLE', entityId: id },
    });
    await this.prisma.contentArticle.delete({ where: { id } });
    await this.audit.log('CONTENT_PAGE_DELETED', { pageId: id });
    return { message: 'Page deleted', id };
  }

  private async findPageOrThrow(id: number) {
    const page = await this.prisma.contentArticle.findFirst({
      where: { id, type: { in: ['PAGE', 'LEGAL'] } },
    });
    if (!page) throw new NotFoundException(`Page #${id} not found`);
    return page;
  }

  // --- ADMIN: ARTICLES ---

  async adminListArticles(query: ListQuery & { type?: string }) {
    const { page, limit, take, skip } = this.paginate(query.page, query.limit);
    const locale = this.locales.normalize(query.locale);
    const isPublished = this.parseStatus(query.status);
    const typeFilter = query.type
      ? [this.articleTypeFromDto(query.type)]
      : ['NEWS', 'BLOG'];

    const articles = await this.prisma.contentArticle.findMany({
      where: {
        type: { in: typeFilter },
        ...(isPublished !== undefined ? { isPublished } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const data = await Promise.all(
      articles.map(async (a) => {
        const t = await this.getTranslation('ARTICLE', a.id, locale);
        return this.formatArticle(a, t);
      }),
    );

    const total = await this.prisma.contentArticle.count({
      where: { type: { in: typeFilter } },
    });

    return { data, pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) } };
  }

  async adminGetArticle(id: number, locale = CANONICAL_LOCALE) {
    const article = await this.findArticleOrThrow(id);
    const t = await this.getTranslation('ARTICLE', id, locale);
    return this.formatArticle(article, t, true);
  }

  async adminCreateArticle(dto: CreateContentArticleDto) {
    const type = this.articleTypeFromDto(dto.type);
    const isPublished = dto.status === 'published';
    const categoryId = await this.resolveCategoryId(dto.category);

    const article = await this.prisma.contentArticle.create({
      data: {
        type,
        slug: dto.slug,
        author: dto.author,
        thumbnail: dto.thumbnail,
        categoryId,
        isPublished,
        publishedAt: dto.publishedAt
          ? new Date(dto.publishedAt)
          : isPublished
            ? new Date()
            : undefined,
      },
      include: { category: true },
    });

    await this.upsertTranslation('ARTICLE', article.id, dto.translation);
    await this.audit.log('CONTENT_ARTICLE_CREATED', { articleId: article.id, type });
    const t = await this.getTranslation('ARTICLE', article.id, dto.translation.locale);
    return this.formatArticle(article, t, true);
  }

  async adminUpdateArticle(id: number, dto: UpdateContentArticleDto) {
    const existing = await this.findArticleOrThrow(id);
    const isPublished = dto.status ? dto.status === 'published' : undefined;
    const categoryId = dto.category !== undefined ? await this.resolveCategoryId(dto.category) : undefined;
    const type = dto.type ? this.articleTypeFromDto(dto.type) : undefined;

    const article = await this.prisma.contentArticle.update({
      where: { id },
      data: {
        ...(type ? { type } : {}),
        slug: dto.slug,
        author: dto.author,
        thumbnail: dto.thumbnail,
        categoryId: dto.category !== undefined ? categoryId : undefined,
        ...(isPublished !== undefined
          ? { isPublished, publishedAt: isPublished ? new Date() : null }
          : {}),
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      },
      include: { category: true },
    });

    if (dto.translation) await this.upsertTranslation('ARTICLE', id, dto.translation);
    await this.audit.log('CONTENT_ARTICLE_UPDATED', { articleId: id, type: existing.type });
    const t = await this.getTranslation('ARTICLE', id, this.locales.normalize(dto.translation?.locale));
    return this.formatArticle(article, t, true);
  }

  async adminDeleteArticle(id: number) {
    await this.findArticleOrThrow(id);
    await this.prisma.contentTranslation.deleteMany({
      where: { entityType: 'ARTICLE', entityId: id },
    });
    await this.prisma.contentArticle.delete({ where: { id } });
    await this.audit.log('CONTENT_ARTICLE_DELETED', { articleId: id });
    return { message: 'Article deleted', id };
  }

  private async findArticleOrThrow(id: number) {
    const article = await this.prisma.contentArticle.findFirst({
      where: { id, type: { in: ['NEWS', 'BLOG'] } },
    });
    if (!article) throw new NotFoundException(`Article #${id} not found`);
    return article;
  }

  // --- ADMIN: VIDEOS ---

  async adminListVideos(query: ListQuery) {
    const { page, limit, take, skip } = this.paginate(query.page, query.limit);
    const locale = this.locales.normalize(query.locale);
    const isPublished = this.parseStatus(query.status);

    const videos = await this.prisma.video.findMany({
      where: isPublished !== undefined ? { isPublished } : {},
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const data = await Promise.all(
      videos.map(async (v) => {
        const t = await this.getTranslation('VIDEO', v.id, locale);
        return this.formatVideo(v, t);
      }),
    );

    const total = await this.prisma.video.count();
    return { data, pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) } };
  }

  async adminCreateVideo(dto: CreateVideoDto) {
    const isPublished = dto.status === 'published';
    const video = await this.prisma.video.create({
      data: {
        slug: dto.slug,
        videoUrl: dto.videoUrl,
        thumbnail: dto.thumbnail,
        duration: dto.duration ?? 0,
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });
    await this.upsertTranslation('VIDEO', video.id, dto.translation);
    await this.audit.log('CONTENT_VIDEO_CREATED', { videoId: video.id });
    const t = await this.getTranslation('VIDEO', video.id, dto.translation.locale);
    return this.formatVideo(video, t);
  }

  async adminUpdateVideo(id: number, dto: UpdateVideoDto) {
    await this.findVideoOrThrow(id);
    const isPublished = dto.status ? dto.status === 'published' : undefined;

    const video = await this.prisma.video.update({
      where: { id },
      data: {
        slug: dto.slug,
        videoUrl: dto.videoUrl,
        thumbnail: dto.thumbnail,
        duration: dto.duration,
        ...(isPublished !== undefined
          ? { isPublished, publishedAt: isPublished ? new Date() : undefined }
          : {}),
      },
    });
    if (dto.translation) await this.upsertTranslation('VIDEO', id, dto.translation);
    await this.audit.log('CONTENT_VIDEO_UPDATED', { videoId: id });
    const t = await this.getTranslation('VIDEO', id, this.locales.normalize(dto.translation?.locale));
    return this.formatVideo(video, t);
  }

  async adminDeleteVideo(id: number) {
    await this.findVideoOrThrow(id);
    await this.prisma.contentTranslation.deleteMany({
      where: { entityType: 'VIDEO', entityId: id },
    });
    await this.prisma.video.delete({ where: { id } });
    await this.audit.log('CONTENT_VIDEO_DELETED', { videoId: id });
    return { message: 'Video deleted', id };
  }

  private async findVideoOrThrow(id: number) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video) throw new NotFoundException(`Video #${id} not found`);
    return video;
  }

  // --- ADMIN: DESTINATIONS ---

  async adminListDestinations(query: ListQuery) {
    const { page, limit, take, skip } = this.paginate(query.page, query.limit);
    const locale = this.locales.normalize(query.locale);
    const isPublished = this.parseStatus(query.status);

    const destinations = await this.prisma.destination.findMany({
      where: {
        ...(isPublished !== undefined ? { isPublished } : {}),
        ...(query.category ? { category: query.category.toUpperCase() } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const data = await Promise.all(
      destinations.map(async (d) => {
        const t = await this.getTranslation('DESTINATION', d.id, locale);
        return this.formatDestination(d, t, true);
      }),
    );

    const total = await this.prisma.destination.count();
    return { data, pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) } };
  }

  async adminCreateDestination(dto: CreateDestinationDto) {
    const isPublished = dto.status === 'published';
    const dest = await this.prisma.destination.create({
      data: {
        slug: dto.slug,
        category: dto.category.toUpperCase(),
        city: dto.city,
        country: dto.country,
        thumbnail: dto.thumbnail,
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });
    await this.upsertTranslation('DESTINATION', dest.id, dto.translation);
    await this.audit.log('CONTENT_DESTINATION_CREATED', { destinationId: dest.id });
    const t = await this.getTranslation('DESTINATION', dest.id, dto.translation.locale);
    return this.formatDestination(dest, t, true);
  }

  async adminUpdateDestination(id: number, dto: UpdateDestinationDto) {
    await this.findDestinationOrThrow(id);
    const isPublished = dto.status ? dto.status === 'published' : undefined;

    const dest = await this.prisma.destination.update({
      where: { id },
      data: {
        slug: dto.slug,
        category: dto.category?.toUpperCase(),
        city: dto.city,
        country: dto.country,
        thumbnail: dto.thumbnail,
        ...(isPublished !== undefined
          ? { isPublished, publishedAt: isPublished ? new Date() : undefined }
          : {}),
      },
    });
    if (dto.translation) await this.upsertTranslation('DESTINATION', id, dto.translation);
    await this.audit.log('CONTENT_DESTINATION_UPDATED', { destinationId: id });
    const t = await this.getTranslation('DESTINATION', id, this.locales.normalize(dto.translation?.locale));
    return this.formatDestination(dest, t, true);
  }

  async adminDeleteDestination(id: number) {
    await this.findDestinationOrThrow(id);
    await this.prisma.contentTranslation.deleteMany({
      where: { entityType: 'DESTINATION', entityId: id },
    });
    await this.prisma.destination.delete({ where: { id } });
    await this.audit.log('CONTENT_DESTINATION_DELETED', { destinationId: id });
    return { message: 'Destination deleted', id };
  }

  private async findDestinationOrThrow(id: number) {
    const dest = await this.prisma.destination.findUnique({ where: { id } });
    if (!dest) throw new NotFoundException(`Destination #${id} not found`);
    return dest;
  }
}
