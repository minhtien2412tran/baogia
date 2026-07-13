import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../services/audit.service';
import {
  assertAllowedUrl,
  assertPublicResolvedHost,
  canPublishRights,
  canStoreCopyrightedHtml,
  contentHash,
} from './url-safety';

type WpPageMeta = {
  id: number;
  slug: string;
  link: string;
  modified?: string;
  title?: { rendered?: string };
};

@Injectable()
export class ContentSyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  featureFlags() {
    return {
      CONTENT_SYNC_ENABLED: process.env.CONTENT_SYNC_ENABLED !== 'false',
      CONTENT_SYNC_PUBLISH_ENABLED: process.env.CONTENT_SYNC_PUBLISH_ENABLED === 'true',
      JETBAY_CONTENT_CLEANUP_ENABLED: process.env.JETBAY_CONTENT_CLEANUP_ENABLED !== 'false',
      NEW_BRAND_CONTENT_ENABLED: process.env.NEW_BRAND_CONTENT_ENABLED === 'true',
      EXTERNAL_MEDIA_IMPORT_ENABLED: process.env.EXTERNAL_MEDIA_IMPORT_ENABLED === 'true',
      syncModeDefault: 'SAFE_REFERENCE_MODE',
    };
  }

  private assertSyncEnabled() {
    if (process.env.CONTENT_SYNC_ENABLED === 'false') {
      throw new ForbiddenException('CONTENT_SYNC_ENABLED is off');
    }
  }

  async listSources() {
    const sources = await this.prisma.contentSource.findMany({ orderBy: { id: 'asc' } });
    return { sources, flags: this.featureFlags() };
  }

  async createSource(input: {
    name: string;
    baseUrl: string;
    sourceType: string;
    syncMode?: string;
    allowedDomains: string[];
    createdBy?: number;
  }) {
    this.assertSyncEnabled();
    const syncMode = input.syncMode ?? 'SAFE_REFERENCE_MODE';
    if (syncMode === 'AUTHORIZED_DIRECT_SYNC') {
      throw new BadRequestException(
        'AUTHORIZED_DIRECT_SYNC requires rights evidence — set via PATCH after legal approval',
      );
    }
    const domains = input.allowedDomains.map((d) => d.toLowerCase());
    assertAllowedUrl(input.baseUrl, domains);

    const source = await this.prisma.contentSource.create({
      data: {
        name: input.name,
        baseUrl: input.baseUrl.replace(/\/$/, ''),
        sourceType: input.sourceType,
        syncMode,
        allowedDomains: domains,
        createdBy: input.createdBy,
        updatedAt: new Date(),
      },
    });
    await this.audit.logEntity({
      action: 'CONTENT_SOURCE_CREATED',
      entityType: 'ContentSource',
      entityId: source.id,
      afterData: { name: source.name, syncMode: source.syncMode },
      userId: input.createdBy,
    });
    return source;
  }

  async getSource(id: number) {
    const source = await this.prisma.contentSource.findUnique({ where: { id } });
    if (!source) throw new NotFoundException(`ContentSource ${id} not found`);
    return source;
  }

  async updateSource(
    id: number,
    body: {
      name?: string;
      isEnabled?: boolean;
      syncMode?: string;
      allowedDomains?: string[];
      rateLimitPerMin?: number;
      rightsEvidenceNote?: string;
    },
    userId?: number,
  ) {
    const existing = await this.getSource(id);
    if (body.syncMode === 'AUTHORIZED_DIRECT_SYNC' && !body.rightsEvidenceNote) {
      throw new BadRequestException(
        'Provide rightsEvidenceNote to enable AUTHORIZED_DIRECT_SYNC',
      );
    }
    const updated = await this.prisma.contentSource.update({
      where: { id },
      data: {
        name: body.name,
        isEnabled: body.isEnabled,
        syncMode: body.syncMode,
        allowedDomains: body.allowedDomains,
        rateLimitPerMin: body.rateLimitPerMin,
      },
    });
    await this.audit.logEntity({
      action: 'CONTENT_SOURCE_UPDATED',
      entityType: 'ContentSource',
      entityId: id,
      beforeData: { syncMode: existing.syncMode },
      afterData: { syncMode: updated.syncMode, rightsEvidenceNote: body.rightsEvidenceNote },
      userId,
    });
    return updated;
  }

  async testConnection(id: number) {
    this.assertSyncEnabled();
    const source = await this.getSource(id);
    const domains = source.allowedDomains as string[];
    const url = assertAllowedUrl(`${source.baseUrl}/wp-json/`, domains);
    await assertPublicResolvedHost(url.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'JetBayContentSync/1.0 (+tech@minhtien.online; SAFE_REFERENCE_MODE)',
          Accept: 'application/json',
        },
        redirect: 'manual',
      });
      if (res.status >= 300 && res.status < 400) {
        throw new BadRequestException('Redirects are not followed for SSRF safety');
      }
      const ok = res.ok;
      await this.prisma.contentSource.update({
        where: { id },
        data: {
          lastTestAt: new Date(),
          lastTestOk: ok,
          lastError: ok ? null : `HTTP ${res.status}`,
        },
      });
      return { ok, status: res.status, syncMode: source.syncMode };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connection failed';
      await this.prisma.contentSource.update({
        where: { id },
        data: { lastTestAt: new Date(), lastTestOk: false, lastError: msg },
      });
      throw new BadRequestException(msg);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Discover WordPress pages metadata only (no HTML body storage in SAFE mode).
   */
  async discover(sourceId: number, triggeredBy?: number, dryRun = true) {
    this.assertSyncEnabled();
    const source = await this.getSource(sourceId);
    if (!source.isEnabled) throw new BadRequestException('Source disabled');

    const job = await this.prisma.contentSyncJob.create({
      data: {
        sourceId,
        mode: 'DISCOVER',
        status: 'RUNNING',
        dryRun,
        triggeredBy,
        startedAt: new Date(),
      },
    });

    try {
      const domains = source.allowedDomains as string[];
      const listUrl = assertAllowedUrl(
        `${source.baseUrl}/wp-json/wp/v2/pages?per_page=20&_fields=id,slug,link,modified,title`,
        domains,
      );
      await assertPublicResolvedHost(listUrl.hostname);

      const res = await fetch(listUrl.toString(), {
        headers: {
          'User-Agent': 'JetBayContentSync/1.0 (+tech@minhtien.online; SAFE_REFERENCE_MODE)',
          Accept: 'application/json',
        },
        redirect: 'error',
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`Discover HTTP ${res.status}`);
      const pages = (await res.json()) as WpPageMeta[];

      let newCount = 0;
      let changedCount = 0;
      let blockedCount = 0;
      const items: Prisma.ContentSyncItemCreateManyInput[] = [];

      for (const page of pages) {
        const meta = {
          externalId: String(page.id),
          slug: page.slug,
          title: page.title?.rendered ?? null,
          sourceUrl: page.link,
          modifiedAt: page.modified ?? null,
          contentType: this.classifyPage(page.slug),
        };
        const hash = contentHash(meta);

        // Never store marketing HTML in SAFE mode
        if (!canStoreCopyrightedHtml(source.syncMode) && meta.contentType === 'LEGAL') {
          blockedCount++;
          items.push({
            jobId: job.id,
            externalId: meta.externalId,
            action: 'BLOCK',
            proposedData: meta,
            rightsStatus: 'PROHIBITED',
            reviewStatus: 'PENDING',
            error: 'Legal pages require legal review — not auto-imported',
          });
          continue;
        }

        const existing = await this.prisma.contentSourceRecord.findUnique({
          where: {
            sourceId_externalId_locale: {
              sourceId,
              externalId: meta.externalId,
              locale: source.defaultLocale,
            },
          },
        });

        const action = !existing ? 'CREATE' : existing.contentHash !== hash ? 'UPDATE' : 'SKIP';
        if (action === 'CREATE') newCount++;
        if (action === 'UPDATE') changedCount++;

        items.push({
          jobId: job.id,
          externalId: meta.externalId,
          action,
          beforeData: existing
            ? ({ title: existing.title, hash: existing.contentHash } as Prisma.InputJsonValue)
            : undefined,
          proposedData: {
            ...meta,
            transformationMode: 'FACTS_ONLY',
            note: 'SAFE_REFERENCE_MODE: metadata only, no HTML/media import',
          } as Prisma.InputJsonValue,
          rightsStatus: 'UNVERIFIED',
          reviewStatus: 'PENDING',
        });

        if (!dryRun && action !== 'SKIP') {
          await this.prisma.contentSourceRecord.upsert({
            where: {
              sourceId_externalId_locale: {
                sourceId,
                externalId: meta.externalId,
                locale: source.defaultLocale,
              },
            },
            create: {
              sourceId,
              externalId: meta.externalId,
              sourceUrl: meta.sourceUrl,
              canonicalUrl: meta.sourceUrl,
              contentType: meta.contentType,
              locale: source.defaultLocale,
              title: meta.title,
              rawMetadata: meta as Prisma.InputJsonValue,
              modifiedAt: meta.modifiedAt ? new Date(meta.modifiedAt) : undefined,
              contentHash: hash,
              status: 'NORMALIZED',
            },
            update: {
              title: meta.title,
              sourceUrl: meta.sourceUrl,
              rawMetadata: meta as Prisma.InputJsonValue,
              contentHash: hash,
              modifiedAt: meta.modifiedAt ? new Date(meta.modifiedAt) : undefined,
              status: 'NORMALIZED',
              fetchedAt: new Date(),
            },
          });
        }
      }

      if (items.length) {
        await this.prisma.contentSyncItem.createMany({ data: items });
      }

      const completed = await this.prisma.contentSyncJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          fetchedCount: pages.length,
          newCount,
          changedCount,
          skippedCount: items.filter((i) => i.action === 'SKIP').length,
          blockedCount,
        },
      });

      return { job: completed, items: await this.listJobItems(job.id) };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Discover failed';
      await this.prisma.contentSyncJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', completedAt: new Date(), errorSummary: msg, failedCount: 1 },
      });
      throw new BadRequestException(msg);
    }
  }

  private classifyPage(slug: string): string {
    if (/privacy|terms|cookie|legal|conditions|notice/.test(slug)) return 'LEGAL';
    if (/empty/.test(slug)) return 'EMPTY_LEG';
    if (/service|charter|cargo|medevac|specialist/.test(slug)) return 'SERVICE';
    if (/private-jet|fleet/.test(slug)) return 'FLEET';
    if (/news|stories|the-life/.test(slug)) return 'NEWS';
    if (/about|contact|sustainability/.test(slug)) return 'PAGE';
    return 'OTHER';
  }

  async listJobs(sourceId?: number) {
    const jobs = await this.prisma.contentSyncJob.findMany({
      where: sourceId ? { sourceId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { jobs };
  }

  async getJob(id: number) {
    const job = await this.prisma.contentSyncJob.findUnique({
      where: { id },
      include: { source: true },
    });
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async listJobItems(jobId: number) {
    const items = await this.prisma.contentSyncItem.findMany({
      where: { jobId },
      orderBy: { id: 'asc' },
    });
    return { items };
  }

  async approveItem(itemId: number, userId?: number) {
    const item = await this.prisma.contentSyncItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException(`Item ${itemId} not found`);
    if (item.rightsStatus === 'PROHIBITED' || item.rightsStatus === 'UNVERIFIED') {
      throw new ForbiddenException(
        'Cannot approve item while rightsStatus is UNVERIFIED or PROHIBITED — complete rights review first',
      );
    }
    if (!canPublishRights(item.rightsStatus)) {
      throw new ForbiddenException('rightsStatus is not publishable');
    }
    return this.prisma.contentSyncItem.update({
      where: { id: itemId },
      data: { reviewStatus: 'APPROVED', approvedBy: userId, approvedAt: new Date() },
    });
  }

  async rejectItem(itemId: number, userId?: number) {
    return this.prisma.contentSyncItem.update({
      where: { id: itemId },
      data: { reviewStatus: 'REJECTED', approvedBy: userId, approvedAt: new Date() },
    });
  }

  async requestRewrite(itemId: number) {
    return this.prisma.contentSyncItem.update({
      where: { id: itemId },
      data: { reviewStatus: 'REWRITE_REQUESTED' },
    });
  }

  async publishJob(jobId: number, userId?: number) {
    if (process.env.CONTENT_SYNC_PUBLISH_ENABLED !== 'true') {
      throw new ForbiddenException('CONTENT_SYNC_PUBLISH_ENABLED is off (default)');
    }
    const job = await this.getJob(jobId);
    const items = await this.prisma.contentSyncItem.findMany({ where: { jobId } });
    const blocked = items.filter(
      (i) =>
        i.reviewStatus !== 'APPROVED' ||
        i.rightsStatus === 'UNVERIFIED' ||
        i.rightsStatus === 'PROHIBITED',
    );
    if (blocked.length) {
      throw new ForbiddenException({
        message: 'Publish blocked: pending rights or review',
        blockedCount: blocked.length,
      });
    }
    // Staging-only publish marker — does not mutate public CMS articles automatically
    await this.prisma.contentVersion.create({
      data: {
        entityType: 'ContentSyncJob',
        entityId: String(jobId),
        version: Date.now(),
        data: { publishedItemIds: items.map((i) => i.id), mode: 'STAGING_MARKER' },
        createdBy: userId,
        reason: 'Manual publish gate passed',
        sourceJobId: jobId,
      },
    });
    await this.audit.logEntity({
      action: 'CONTENT_SYNC_PUBLISH',
      entityType: 'ContentSyncJob',
      entityId: jobId,
      userId,
      afterData: { itemCount: items.length },
    });
    return { ok: true, jobId: job.id, publishedItems: items.length, target: 'staging-marker' };
  }

  async listRights() {
    const rights = await this.prisma.contentRights.findMany({ orderBy: { id: 'desc' }, take: 100 });
    return { rights };
  }

  async upsertRights(
    body: {
      id?: number;
      assetType: string;
      sourceUrl?: string;
      storageKey?: string;
      rightsStatus: string;
      rightsOwner?: string;
      notes?: string;
    },
    userId?: number,
  ) {
    if (body.id) {
      return this.prisma.contentRights.update({
        where: { id: body.id },
        data: {
          assetType: body.assetType,
          sourceUrl: body.sourceUrl,
          storageKey: body.storageKey,
          rightsStatus: body.rightsStatus,
          rightsOwner: body.rightsOwner,
          notes: body.notes,
          approvedForPublish: canPublishRights(body.rightsStatus),
        },
      });
    }
    return this.prisma.contentRights.create({
      data: {
        assetType: body.assetType,
        sourceUrl: body.sourceUrl,
        storageKey: body.storageKey,
        rightsStatus: body.rightsStatus,
        rightsOwner: body.rightsOwner,
        notes: body.notes,
        approvedForPublish: canPublishRights(body.rightsStatus),
        approvedBy: canPublishRights(body.rightsStatus) ? userId : undefined,
        approvedAt: canPublishRights(body.rightsStatus) ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });
  }

  async approveRights(id: number, userId?: number) {
    const row = await this.prisma.contentRights.findUnique({ where: { id } });
    if (!row) throw new NotFoundException(`Rights ${id} not found`);
    if (!canPublishRights(row.rightsStatus) && row.rightsStatus === 'UNVERIFIED') {
      // promote only with explicit OWNED/LICENSED/etc set first
      throw new BadRequestException('Set rightsStatus to OWNED/LICENSED/CLIENT_PROVIDED/PUBLIC_DOMAIN before approve');
    }
    return this.prisma.contentRights.update({
      where: { id },
      data: {
        approvedForPublish: true,
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }

  async blockRights(id: number) {
    return this.prisma.contentRights.update({
      where: { id },
      data: { rightsStatus: 'PROHIBITED', approvedForPublish: false },
    });
  }

  /** Static JetBay remnant scan for admin cleanup UI (code paths, not live DB prod scan). */
  jetbayCleanupReport() {
    return {
      mode: 'SAFE_REFERENCE_MODE',
      generatedAt: new Date().toISOString(),
      groups: [
        {
          group: 'Brand constants',
          findings: 4,
          replaced: 4,
          removed: 0,
          pendingReview: 0,
          notes: 'apps/web/src/lib/brand.ts → JetVina placeholders',
        },
        {
          group: 'Unverified marketing stats',
          findings: 4,
          replaced: 0,
          removed: 0,
          pendingReview: 4,
          notes: 'StatsSection hidden behind feature flag until client-approved numbers',
        },
        {
          group: 'JetBay logo / CDN assets',
          findings: 1,
          replaced: 0,
          removed: 0,
          pendingReview: 1,
          notes: 'Use internal placeholder; JetVina logo blocked until CLIENT_PROVIDED',
        },
        {
          group: 'Email templates',
          findings: 8,
          replaced: 8,
          removed: 0,
          pendingReview: 0,
          notes: 'customer-care templates use brand settings',
        },
        {
          group: 'Package namespace @jetbay/*',
          findings: 6,
          replaced: 0,
          removed: 0,
          pendingReview: 6,
          notes: 'Deferred — renaming breaks monorepo imports; KEEP for now',
        },
        {
          group: 'Legal pages',
          findings: 5,
          replaced: 0,
          removed: 0,
          pendingReview: 5,
          notes: 'Never auto-synced from JetVina; require legal review',
        },
      ],
    };
  }

  async getBrandSettings() {
    const row = await this.prisma.siteSetting.findUnique({ where: { key: 'brand' } });
    const defaults = {
      brandName: 'JetVina',
      legalName: 'JetVina',
      tagline: 'Private Air Charter',
      logoPath: '/assets/brand/logo-placeholder.svg',
      showUnverifiedStats: false,
      contactEmail: null as string | null,
      contactPhone: null as string | null,
      socialLinks: [] as Array<{ label: string; href: string }>,
      rightsNote: 'SAFE_REFERENCE_MODE — brand name provisional until client confirmation',
    };
    if (!row) return defaults;
    return { ...defaults, ...(row.value as object) };
  }

  async setBrandSettings(value: Record<string, unknown>, userId?: number) {
    const row = await this.prisma.siteSetting.upsert({
      where: { key: 'brand' },
      create: { key: 'brand', value: value as Prisma.InputJsonValue, updatedBy: userId },
      update: { value: value as Prisma.InputJsonValue, updatedBy: userId },
    });
    await this.prisma.contentVersion.create({
      data: {
        entityType: 'SiteSetting',
        entityId: 'brand',
        version: Date.now(),
        data: value as Prisma.InputJsonValue,
        createdBy: userId,
        reason: 'Brand settings update',
      },
    });
    return row;
  }

  async seedDefaultJetvinaSource(userId?: number) {
    const existing = await this.prisma.contentSource.findFirst({
      where: { baseUrl: 'https://jetvina.com' },
    });
    if (existing) return existing;
    return this.createSource({
      name: 'JetVina public WordPress (reference)',
      baseUrl: 'https://jetvina.com',
      sourceType: 'WORDPRESS_API',
      syncMode: 'SAFE_REFERENCE_MODE',
      allowedDomains: ['jetvina.com'],
      createdBy: userId,
    });
  }
}
