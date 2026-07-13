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
  PUBLISHABLE_RIGHTS,
} from './url-safety';
import {
  resolvePublicBrandLogos,
  assertNoJetBayPublicBrand,
} from './brand-public';

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
      CONTENT_SYNC_PUBLISH_ENABLED:
        process.env.CONTENT_SYNC_PUBLISH_ENABLED === 'true',
      JETBAY_CONTENT_CLEANUP_ENABLED:
        process.env.JETBAY_CONTENT_CLEANUP_ENABLED !== 'false',
      NEW_BRAND_CONTENT_ENABLED:
        process.env.NEW_BRAND_CONTENT_ENABLED === 'true',
      EXTERNAL_MEDIA_IMPORT_ENABLED:
        process.env.EXTERNAL_MEDIA_IMPORT_ENABLED === 'true',
      JETVINA_OFFICIAL_LOGO_ENABLED:
        process.env.JETVINA_OFFICIAL_LOGO_ENABLED === 'true',
      syncModeDefault: 'SAFE_REFERENCE_MODE',
    };
  }

  private assertSyncEnabled() {
    if (process.env.CONTENT_SYNC_ENABLED === 'false') {
      throw new ForbiddenException('CONTENT_SYNC_ENABLED is off');
    }
  }

  async listSources() {
    const sources = await this.prisma.contentSource.findMany({
      orderBy: { id: 'asc' },
    });
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
    const source = await this.prisma.contentSource.findUnique({
      where: { id },
    });
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
    if (
      body.syncMode === 'AUTHORIZED_DIRECT_SYNC' &&
      !body.rightsEvidenceNote
    ) {
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
      afterData: {
        syncMode: updated.syncMode,
        rightsEvidenceNote: body.rightsEvidenceNote,
      },
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
          'User-Agent':
            'JetBayContentSync/1.0 (+tech@minhtien.online; SAFE_REFERENCE_MODE)',
          Accept: 'application/json',
        },
        redirect: 'manual',
      });
      if (res.status >= 300 && res.status < 400) {
        throw new BadRequestException(
          'Redirects are not followed for SSRF safety',
        );
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
          'User-Agent':
            'JetBayContentSync/1.0 (+tech@minhtien.online; SAFE_REFERENCE_MODE)',
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
        if (
          !canStoreCopyrightedHtml(source.syncMode) &&
          meta.contentType === 'LEGAL'
        ) {
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

        const action = !existing
          ? 'CREATE'
          : existing.contentHash !== hash
            ? 'UPDATE'
            : 'SKIP';
        if (action === 'CREATE') newCount++;
        if (action === 'UPDATE') changedCount++;

        items.push({
          jobId: job.id,
          externalId: meta.externalId,
          action,
          beforeData: existing
            ? {
                title: existing.title,
                hash: existing.contentHash,
              }
            : undefined,
          proposedData: {
            ...meta,
            transformationMode: 'FACTS_ONLY',
            note: 'SAFE_REFERENCE_MODE: metadata only, no HTML/media import',
          },
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
              rawMetadata: meta,
              modifiedAt: meta.modifiedAt
                ? new Date(meta.modifiedAt)
                : undefined,
              contentHash: hash,
              status: 'NORMALIZED',
            },
            update: {
              title: meta.title,
              sourceUrl: meta.sourceUrl,
              rawMetadata: meta,
              contentHash: hash,
              modifiedAt: meta.modifiedAt
                ? new Date(meta.modifiedAt)
                : undefined,
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
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorSummary: msg,
          failedCount: 1,
        },
      });
      throw new BadRequestException(msg);
    }
  }

  private classifyPage(slug: string): string {
    if (/privacy|terms|cookie|legal|conditions|notice/.test(slug))
      return 'LEGAL';
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
    const item = await this.prisma.contentSyncItem.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException(`Item ${itemId} not found`);
    if (
      item.rightsStatus === 'PROHIBITED' ||
      item.rightsStatus === 'UNVERIFIED'
    ) {
      throw new ForbiddenException(
        'Cannot approve item while rightsStatus is UNVERIFIED or PROHIBITED — complete rights review first',
      );
    }
    if (!canPublishRights(item.rightsStatus)) {
      throw new ForbiddenException('rightsStatus is not publishable');
    }
    return this.prisma.contentSyncItem.update({
      where: { id: itemId },
      data: {
        reviewStatus: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }

  async rejectItem(itemId: number, userId?: number) {
    return this.prisma.contentSyncItem.update({
      where: { id: itemId },
      data: {
        reviewStatus: 'REJECTED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }

  async requestRewrite(itemId: number) {
    return this.prisma.contentSyncItem.update({
      where: { id: itemId },
      data: { reviewStatus: 'REWRITE_REQUESTED' },
    });
  }

  private async nextContentVersion(
    entityType: string,
    entityId: string,
  ): Promise<number> {
    const agg = await this.prisma.contentVersion.aggregate({
      where: { entityType, entityId },
      _max: { version: true },
    });
    return (agg._max.version ?? 0) + 1;
  }

  async publishJob(jobId: number, userId?: number) {
    if (process.env.CONTENT_SYNC_PUBLISH_ENABLED !== 'true') {
      throw new ForbiddenException(
        'CONTENT_SYNC_PUBLISH_ENABLED is off (default)',
      );
    }
    const job = await this.getJob(jobId);
    const items = await this.prisma.contentSyncItem.findMany({
      where: { jobId },
    });
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
    const version = await this.nextContentVersion(
      'ContentSyncJob',
      String(jobId),
    );
    await this.prisma.contentVersion.create({
      data: {
        entityType: 'ContentSyncJob',
        entityId: String(jobId),
        version,
        data: {
          publishedItemIds: items.map((i) => i.id),
          mode: 'STAGING_MARKER',
        },
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
    await this.prisma.contentSyncJob.update({
      where: { id: jobId },
      data: {
        mode: 'PUBLISH',
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
    return {
      ok: true,
      jobId: job.id,
      publishedItems: items.length,
      target: 'staging-marker',
    };
  }

  /**
   * Rollback a published sync job to the previous ContentVersion marker.
   * Does not mutate booking/user/payment. Keeps full version history.
   */
  async rollbackJob(jobId: number, userId?: number) {
    const job = await this.getJob(jobId);
    const versions = await this.prisma.contentVersion.findMany({
      where: { entityType: 'ContentSyncJob', entityId: String(jobId) },
      orderBy: { version: 'desc' },
      take: 5,
    });
    const latest = versions[0];
    if (!latest) {
      throw new NotFoundException('No published version to roll back');
    }
    const latestData = latest.data as { mode?: string } | null;
    if (latestData?.mode === 'ROLLBACK_MARKER') {
      throw new BadRequestException('Latest version is already a rollback');
    }

    const previous = versions.find(
      (v) =>
        v.id !== latest.id &&
        (v.data as { mode?: string } | null)?.mode !== 'ROLLBACK_MARKER',
    );

    await this.prisma.contentVersion.create({
      data: {
        entityType: 'ContentSyncJob',
        entityId: String(jobId),
        version: await this.nextContentVersion(
          'ContentSyncJob',
          String(jobId),
        ),
        data: {
          mode: 'ROLLBACK_MARKER',
          rolledBackFromVersion: latest.version,
          restoredToVersion: previous?.version ?? null,
          previousMode: latestData?.mode ?? null,
        },
        createdBy: userId,
        reason: 'Manual content-sync rollback',
        sourceJobId: jobId,
      },
    });

    await this.prisma.contentSyncJob.update({
      where: { id: jobId },
      data: {
        mode: 'ROLLBACK',
        status: 'CANCELLED',
        completedAt: new Date(),
        errorSummary: `Rolled back from version ${latest.version}`,
      },
    });

    await this.audit.logEntity({
      action: 'CONTENT_SYNC_ROLLBACK',
      entityType: 'ContentSyncJob',
      entityId: jobId,
      userId,
      beforeData: { version: latest.version, mode: latestData?.mode },
      afterData: {
        restoredToVersion: previous?.version ?? null,
        jobStatus: 'CANCELLED',
      },
    });

    return {
      ok: true,
      jobId: job.id,
      rolledBackFromVersion: latest.version,
      restoredToVersion: previous?.version ?? null,
      historyPreserved: true,
    };
  }

  async listRights() {
    const rights = await this.prisma.contentRights.findMany({
      orderBy: { id: 'desc' },
      take: 100,
    });
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
        approvedAt: canPublishRights(body.rightsStatus)
          ? new Date()
          : undefined,
        updatedAt: new Date(),
      },
    });
  }

  async approveRights(id: number, userId?: number) {
    const row = await this.prisma.contentRights.findUnique({ where: { id } });
    if (!row) throw new NotFoundException(`Rights ${id} not found`);
    if (
      !canPublishRights(row.rightsStatus) &&
      row.rightsStatus === 'UNVERIFIED'
    ) {
      // promote only with explicit OWNED/LICENSED/etc set first
      throw new BadRequestException(
        'Set rightsStatus to OWNED/LICENSED/CLIENT_PROVIDED/PUBLIC_DOMAIN before approve',
      );
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

  async listMediaAssets(filter?: { rightsStatus?: string }) {
    const assets = await this.prisma.mediaAsset.findMany({
      where: filter?.rightsStatus
        ? { rightsStatus: filter.rightsStatus }
        : undefined,
      orderBy: { id: 'desc' },
      take: 200,
    });
    return { assets };
  }

  async getMediaAsset(id: number) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException(`MediaAsset ${id} not found`);
    return { asset };
  }

  async upsertMediaAsset(
    body: {
      id?: number;
      storageKey: string;
      originalFilename?: string;
      mimeType?: string;
      width?: number;
      height?: number;
      fileSize?: number;
      checksum?: string;
      sourceType?: string;
      sourceUrl?: string;
      sourcePageUrl?: string;
      wordpressMediaId?: number;
      rightsStatus?: string;
      rightsEvidence?: string;
      altText?: string;
      usageContexts?: string[];
      focalPointX?: number;
      focalPointY?: number;
      objectPositionDesktop?: string;
      objectPositionMobile?: string;
    },
    userId?: number,
  ) {
    const rightsStatus = body.rightsStatus ?? 'UNVERIFIED';
    if (body.storageKey.includes('/assets/jetbay')) {
      throw new BadRequestException('JetBay storage paths are not allowed');
    }
    const data = {
      originalFilename: body.originalFilename,
      mimeType: body.mimeType,
      width: body.width,
      height: body.height,
      fileSize: body.fileSize,
      checksum: body.checksum,
      sourceType: body.sourceType ?? 'UPLOAD',
      sourceUrl: body.sourceUrl,
      sourcePageUrl: body.sourcePageUrl,
      wordpressMediaId: body.wordpressMediaId,
      rightsStatus,
      rightsEvidence: body.rightsEvidence,
      altText: body.altText,
      usageContexts: body.usageContexts ?? undefined,
      focalPointX: body.focalPointX,
      focalPointY: body.focalPointY,
      objectPositionDesktop: body.objectPositionDesktop,
      objectPositionMobile: body.objectPositionMobile,
      reviewedBy: userId,
      // never auto-approve production from upsert
      approvedForPublish: false,
    };

    if (body.id) {
      const before = await this.prisma.mediaAsset.findUnique({
        where: { id: body.id },
      });
      if (!before) throw new NotFoundException(`MediaAsset ${body.id} not found`);
      const asset = await this.prisma.mediaAsset.update({
        where: { id: body.id },
        data: {
          ...data,
          storageKey: body.storageKey,
          approvedForPublish: false,
        },
      });
      await this.audit.logEntity({
        action: 'media_asset.update',
        entityType: 'MediaAsset',
        entityId: asset.id,
        beforeData: {
          altText: before.altText,
          rightsStatus: before.rightsStatus,
          focalPointX: before.focalPointX,
          focalPointY: before.focalPointY,
        },
        afterData: {
          altText: asset.altText,
          rightsStatus: asset.rightsStatus,
          focalPointX: asset.focalPointX,
          focalPointY: asset.focalPointY,
        },
        userId,
      });
      return { asset };
    }

    const asset = await this.prisma.mediaAsset.create({
      data: {
        storageKey: body.storageKey,
        ...data,
        uploadedBy: userId,
      },
    });
    await this.audit.logEntity({
      action: 'media_asset.create',
      entityType: 'MediaAsset',
      entityId: asset.id,
      afterData: {
        storageKey: asset.storageKey,
        rightsStatus: asset.rightsStatus,
      },
      userId,
    });
    return { asset };
  }

  async approveMediaStaging(id: number, userId?: number) {
    const before = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!before) throw new NotFoundException(`MediaAsset ${id} not found`);
    if (before.rightsStatus === 'PROHIBITED') {
      throw new ForbiddenException('Cannot approve blocked media');
    }
    const asset = await this.prisma.mediaAsset.update({
      where: { id },
      data: { approvedForStaging: true, reviewedBy: userId },
    });
    await this.audit.logEntity({
      action: 'media_asset.approve_staging',
      entityType: 'MediaAsset',
      entityId: id,
      beforeData: { approvedForStaging: before.approvedForStaging },
      afterData: { approvedForStaging: true },
      userId,
    });
    return { asset };
  }

  async approveMediaProduction(id: number, userId?: number) {
    const before = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!before) throw new NotFoundException(`MediaAsset ${id} not found`);
    if (!canPublishRights(before.rightsStatus)) {
      throw new ForbiddenException(
        'Cannot approve production while rightsStatus is UNVERIFIED or not OWNED/LICENSED/CLIENT_PROVIDED/PUBLIC_DOMAIN',
      );
    }
    if (!before.checksum || !before.storageKey) {
      throw new BadRequestException(
        'Production approval requires checksum and storageKey',
      );
    }
    if (before.storageKey.includes('jetbay')) {
      throw new BadRequestException('JetBay paths cannot be production-approved');
    }
    const asset = await this.prisma.mediaAsset.update({
      where: { id },
      data: {
        approvedForPublish: true,
        approvedForStaging: true,
        reviewedBy: userId,
      },
    });
    await this.audit.logEntity({
      action: 'media_asset.approve_production',
      entityType: 'MediaAsset',
      entityId: id,
      beforeData: { approvedForPublish: before.approvedForPublish },
      afterData: { approvedForPublish: true, rightsStatus: asset.rightsStatus },
      userId,
    });
    return { asset };
  }

  async blockMediaAsset(id: number, userId?: number) {
    const before = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!before) throw new NotFoundException(`MediaAsset ${id} not found`);
    const asset = await this.prisma.mediaAsset.update({
      where: { id },
      data: {
        rightsStatus: 'PROHIBITED',
        approvedForPublish: false,
        approvedForStaging: false,
        reviewedBy: userId,
      },
    });
    await this.audit.logEntity({
      action: 'media_asset.block',
      entityType: 'MediaAsset',
      entityId: id,
      beforeData: { rightsStatus: before.rightsStatus },
      afterData: { rightsStatus: 'PROHIBITED' },
      userId,
    });
    return { asset };
  }

  /**
   * Import JetVina (or fixture) manifest records into MediaAsset.
   * Never auto-approves. Defaults rightsStatus=UNVERIFIED.
   * Requires EXTERNAL_MEDIA_IMPORT_ENABLED=true.
   */
  async importMediaManifest(
    body: {
      dryRun?: boolean;
      records: Array<{
        storageKey: string;
        checksum?: string;
        mimeType?: string;
        width?: number;
        height?: number;
        fileSize?: number;
        sourceUrl?: string;
        sourcePageUrl?: string;
        wordpressMediaId?: number;
        altText?: string;
        usageContexts?: string[];
        localPath?: string;
      }>;
    },
    userId?: number,
  ) {
    if (!this.featureFlags().EXTERNAL_MEDIA_IMPORT_ENABLED) {
      throw new ForbiddenException(
        'EXTERNAL_MEDIA_IMPORT_ENABLED is off (default)',
      );
    }
    const records = body.records ?? [];
    if (!records.length) {
      throw new BadRequestException('records[] required');
    }

    const report = {
      dryRun: Boolean(body.dryRun),
      created: 0,
      updated: 0,
      skipped: 0,
      blocked: 0,
      errors: [] as string[],
      ids: [] as number[],
    };

    const run = async (tx: Prisma.TransactionClient) => {
      for (const rec of records) {
        const key = (rec.storageKey || '').trim();
        if (!key) {
          report.blocked += 1;
          report.errors.push('empty storageKey');
          continue;
        }
        if (key.includes('/assets/jetbay') || key.includes('assets/jetbay')) {
          report.blocked += 1;
          report.errors.push(`rejected jetbay path: ${key}`);
          continue;
        }
        if (/^https?:\/\//i.test(key)) {
          report.blocked += 1;
          report.errors.push(`storageKey must be local path, not URL: ${key}`);
          continue;
        }
        if (
          rec.sourceUrl &&
          /jetvina\.com/i.test(rec.sourceUrl) &&
          !rec.checksum
        ) {
          // remote-only without mirror checksum → review-only block from import
          report.blocked += 1;
          report.errors.push(
            `remote jetvina without checksum (mirror first): ${key}`,
          );
          continue;
        }

        const existing = await tx.mediaAsset.findUnique({
          where: { storageKey: key },
        });

        if (existing) {
          // Editor-modified: keep alt/focal when checksum unchanged
          const checksumChanged =
            Boolean(rec.checksum) &&
            Boolean(existing.checksum) &&
            rec.checksum !== existing.checksum;
          const editorTouched =
            existing.reviewedBy != null &&
            (Boolean(existing.altText) ||
              existing.focalPointX != null ||
              existing.focalPointY != null);

          if (!checksumChanged && editorTouched) {
            report.skipped += 1;
            report.ids.push(existing.id);
            continue;
          }

          if (body.dryRun) {
            report.updated += 1;
            report.ids.push(existing.id);
            continue;
          }

          const updated = await tx.mediaAsset.update({
            where: { id: existing.id },
            data: {
              checksum: rec.checksum ?? existing.checksum,
              mimeType: rec.mimeType ?? existing.mimeType,
              width: rec.width ?? existing.width,
              height: rec.height ?? existing.height,
              fileSize: rec.fileSize ?? existing.fileSize,
              sourceUrl: rec.sourceUrl ?? existing.sourceUrl,
              sourcePageUrl: rec.sourcePageUrl ?? existing.sourcePageUrl,
              wordpressMediaId:
                rec.wordpressMediaId ?? existing.wordpressMediaId,
              sourceType: 'JETVINA_MIRROR',
              // never escalate rights or auto-approve
              rightsStatus:
                existing.rightsStatus === 'PROHIBITED'
                  ? 'PROHIBITED'
                  : existing.rightsStatus === 'UNVERIFIED'
                    ? 'UNVERIFIED'
                    : existing.rightsStatus,
              approvedForPublish: false,
              ...(checksumChanged || !editorTouched
                ? {
                    altText: rec.altText ?? existing.altText,
                    usageContexts:
                      rec.usageContexts ?? existing.usageContexts ?? undefined,
                  }
                : {}),
            },
          });
          report.updated += 1;
          report.ids.push(updated.id);
          continue;
        }

        if (body.dryRun) {
          report.created += 1;
          continue;
        }

        const created = await tx.mediaAsset.create({
          data: {
            storageKey: key,
            checksum: rec.checksum,
            mimeType: rec.mimeType,
            width: rec.width,
            height: rec.height,
            fileSize: rec.fileSize,
            sourceUrl: rec.sourceUrl,
            sourcePageUrl: rec.sourcePageUrl,
            wordpressMediaId: rec.wordpressMediaId,
            altText: rec.altText,
            usageContexts: rec.usageContexts ?? undefined,
            sourceType: 'JETVINA_MIRROR',
            rightsStatus: 'UNVERIFIED',
            rightsEvidence:
              'Imported from JetVina manifest — UNVERIFIED until written authorization',
            approvedForStaging: false,
            approvedForPublish: false,
            uploadedBy: userId,
          },
        });
        report.created += 1;
        report.ids.push(created.id);
      }

      if (
        report.errors.length &&
        report.created === 0 &&
        report.updated === 0 &&
        report.skipped === 0 &&
        report.blocked === records.length
      ) {
        throw new BadRequestException({
          message: 'Import blocked — no valid records',
          errors: report.errors,
        });
      }
    };

    if (body.dryRun) {
      await run(this.prisma as unknown as Prisma.TransactionClient);
    } else {
      await this.prisma.$transaction(async (tx) => run(tx));
      await this.audit.logEntity({
        action: 'media_asset.import_manifest',
        entityType: 'MediaAsset',
        entityId: 0,
        userId,
        afterData: {
          created: report.created,
          updated: report.updated,
          skipped: report.skipped,
          blocked: report.blocked,
        },
      });
    }

    return { ok: true, ...report };
  }

  /** Public-safe media list — production-approved only. */
  async listPublicApprovedMedia() {
    const assets = await this.prisma.mediaAsset.findMany({
      where: {
        approvedForPublish: true,
        rightsStatus: { in: [...PUBLISHABLE_RIGHTS] },
      },
      select: {
        id: true,
        storageKey: true,
        mimeType: true,
        width: true,
        height: true,
        altText: true,
        usageContexts: true,
        objectPositionDesktop: true,
        objectPositionMobile: true,
        rightsStatus: true,
      },
      take: 100,
    });
    return { assets };
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
          notes:
            'StatsSection hidden behind feature flag until client-approved numbers',
        },
        {
          group: 'JetBay logo / CDN assets',
          findings: 1,
          replaced: 0,
          removed: 0,
          pendingReview: 1,
          notes:
            'Use internal placeholder; JetVina logo blocked until CLIENT_PROVIDED',
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
    const flags = this.featureFlags();
    const defaults = {
      brandName: 'JetVina',
      legalName: 'JetVina',
      tagline: 'Private Air Charter',
      logoPrimary: '/brand/jetvina/logo-primary.png',
      logoLight: '/brand/jetvina/logo-light.png',
      logoDark: '/brand/jetvina/logo-dark.png',
      logoMark: '/brand/jetvina/logo-mark.png',
      favicon: '/brand/jetvina/favicon-32x32.png',
      ogImage: '/brand/jetvina/og-default.png',
      logoFallback: '/brand/jetvina/logo-fallback.svg',
      primaryColor: '#c9a45c',
      secondaryColor: '#0a0c0f',
      contactPhone: null as string | null,
      contactEmail: null as string | null,
      whatsapp: null as string | null,
      socialLinks: [] as Array<{ label: string; href: string }>,
      rightsStatus: 'UNVERIFIED' as string,
      rightsEvidence:
        'Local copy of jetvina.com logo for staging — awaiting CLIENT_PROVIDED / ownership confirmation',
      approvedBy: null as string | null,
      approvedAt: null as string | null,
      showUnverifiedStats: false,
      showUnverifiedPartnerLogos: false,
      rightsNote:
        'SAFE_REFERENCE_MODE — official logo UNVERIFIED; production publish blocked',
    };

    const row = await this.prisma.siteSetting.findUnique({
      where: { key: 'brand' },
    });
    const merged = row ? { ...defaults, ...(row.value as object) } : defaults;
    const rightsStatus = String(merged.rightsStatus ?? 'UNVERIFIED');
    const canPublish = canPublishRights(rightsStatus);
    const stagingPreview = flags.JETVINA_OFFICIAL_LOGO_ENABLED;
    const isProduction = process.env.APP_ENV === 'production';
    const publicLogos = resolvePublicBrandLogos({
      logoPrimary: merged.logoPrimary,
      logoLight: merged.logoLight,
      logoDark: merged.logoDark,
      logoMark: merged.logoMark,
      favicon: merged.favicon,
      ogImage: merged.ogImage,
      logoFallback: merged.logoFallback,
      rightsStatus,
      officialLogoEnabled: stagingPreview,
      isProduction,
    });

    const response = {
      ...merged,
      rightsStatus,
      officialLogoEnabled: stagingPreview && !isProduction,
      ...publicLogos,
      flags: {
        NEW_BRAND_CONTENT_ENABLED: flags.NEW_BRAND_CONTENT_ENABLED,
        EXTERNAL_MEDIA_IMPORT_ENABLED: flags.EXTERNAL_MEDIA_IMPORT_ENABLED,
        JETVINA_OFFICIAL_LOGO_ENABLED: flags.JETVINA_OFFICIAL_LOGO_ENABLED,
      },
    };

    // Never expose JetBay in public brand payload
    const jetbayHits = assertNoJetBayPublicBrand(response);
    if (jetbayHits.length) {
      return {
        ...response,
        brandName: 'JetVina',
        legalName: 'JetVina',
        socialLinks: [],
        contactEmail: null,
        contactPhone: null,
        whatsapp: null,
        rightsNote:
          'Sanitized — JetBay strings stripped from public brand response',
        _sanitizedKeys: jetbayHits.length,
      };
    }

    return response;
  }

  async setBrandSettings(value: Record<string, unknown>, userId?: number) {
    const rightsStatus = String(value.rightsStatus ?? 'UNVERIFIED');
    if (value.approvedForPublish === true && !canPublishRights(rightsStatus)) {
      throw new BadRequestException(
        'Cannot approve logo publish while rightsStatus is not OWNED/LICENSED/CLIENT_PROVIDED/PUBLIC_DOMAIN',
      );
    }
    const payload = {
      ...value,
      rightsStatus,
      approvedBy: canPublishRights(rightsStatus)
        ? (value.approvedBy ?? userId ?? null)
        : null,
      approvedAt: canPublishRights(rightsStatus)
        ? (value.approvedAt ?? new Date().toISOString())
        : null,
    };
    const row = await this.prisma.siteSetting.upsert({
      where: { key: 'brand' },
      create: {
        key: 'brand',
        value: payload,
        updatedBy: userId,
      },
      update: { value: payload, updatedBy: userId },
    });
    await this.prisma.contentVersion.create({
      data: {
        entityType: 'SiteSetting',
        entityId: 'brand',
        version: Date.now(),
        data: payload,
        createdBy: userId,
        reason: 'Brand settings update',
      },
    });
    return this.getBrandSettings();
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
