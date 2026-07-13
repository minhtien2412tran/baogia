import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ContentSyncService } from './content-sync.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../services/audit.service';

describe('Content sync rollback (DB)', () => {
  let sync: ContentSyncService;
  let prisma: PrismaService;
  let sourceId: number;
  const prevPublish = process.env.CONTENT_SYNC_PUBLISH_ENABLED;

  beforeAll(async () => {
    process.env.CONTENT_SYNC_PUBLISH_ENABLED = 'true';
    const moduleRef = await Test.createTestingModule({
      providers: [ContentSyncService, PrismaService, AuditService],
    }).compile();
    sync = moduleRef.get(ContentSyncService);
    prisma = moduleRef.get(PrismaService);
    const source = await prisma.contentSource.findFirst();
    if (!source) {
      const created = await prisma.contentSource.create({
        data: {
          name: 'Rollback test source',
          baseUrl: 'https://example.test',
          sourceType: 'MANUAL',
          allowedDomains: ['example.test'],
        },
      });
      sourceId = created.id;
    } else {
      sourceId = source.id;
    }
  });

  afterAll(async () => {
    process.env.CONTENT_SYNC_PUBLISH_ENABLED = prevPublish;
    await prisma.$disconnect();
  });

  it('fails when no published version', async () => {
    const job = await prisma.contentSyncJob.create({
      data: {
        sourceId,
        mode: 'PREVIEW',
        status: 'COMPLETED',
        dryRun: true,
      },
    });
    await expect(sync.rollbackJob(job.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rolls back after publish and preserves history', async () => {
    const job = await prisma.contentSyncJob.create({
      data: {
        sourceId,
        mode: 'PREVIEW',
        status: 'COMPLETED',
        dryRun: true,
      },
    });
    await prisma.contentSyncItem.create({
      data: {
        jobId: job.id,
        externalId: `rb-${job.id}`,
        action: 'UPDATE',
        reviewStatus: 'APPROVED',
        rightsStatus: 'CLIENT_PROVIDED',
        proposedData: { title: 'v1' },
      },
    });

    await sync.publishJob(job.id, 1);
    const afterPublish = await prisma.contentVersion.count({
      where: { entityType: 'ContentSyncJob', entityId: String(job.id) },
    });
    expect(afterPublish).toBeGreaterThanOrEqual(1);

    const rb = await sync.rollbackJob(job.id, 1);
    expect(rb.ok).toBe(true);
    expect(rb.historyPreserved).toBe(true);

    const jobRow = await prisma.contentSyncJob.findUnique({
      where: { id: job.id },
    });
    expect(jobRow?.mode).toBe('ROLLBACK');
    expect(jobRow?.status).toBe('CANCELLED');

    const versions = await prisma.contentVersion.findMany({
      where: { entityType: 'ContentSyncJob', entityId: String(job.id) },
      orderBy: { version: 'desc' },
    });
    expect(versions.length).toBeGreaterThanOrEqual(afterPublish + 1);
    expect((versions[0].data as { mode?: string }).mode).toBe(
      'ROLLBACK_MARKER',
    );

    await expect(sync.rollbackJob(job.id)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
