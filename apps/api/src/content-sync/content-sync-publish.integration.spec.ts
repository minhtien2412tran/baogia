import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ContentSyncService } from './content-sync.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../services/audit.service';

/**
 * Content sync publish (staging marker) — local DB.
 * Does not enable production CMS mutation.
 */
describe('Content sync publish (DB)', () => {
  let sync: ContentSyncService;
  let prisma: PrismaService;
  let sourceId: number;
  const prevPublish = process.env.CONTENT_SYNC_PUBLISH_ENABLED;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ContentSyncService, PrismaService, AuditService],
    }).compile();
    sync = moduleRef.get(ContentSyncService);
    prisma = moduleRef.get(PrismaService);

    let source = await prisma.contentSource.findFirst({
      where: { name: 'Test publish source' },
    });
    if (!source) {
      source = await prisma.contentSource.create({
        data: {
          name: 'Test publish source',
          baseUrl: 'https://example.test',
          sourceType: 'MANUAL',
          allowedDomains: ['example.test'],
          syncMode: 'SAFE_REFERENCE_MODE',
        },
      });
    }
    sourceId = source.id;
  });

  afterAll(async () => {
    process.env.CONTENT_SYNC_PUBLISH_ENABLED = prevPublish;
    await prisma.$disconnect();
  });

  async function makeJob(opts: {
    reviewStatus: string;
    rightsStatus: string;
  }) {
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
        externalId: `pub-test-${job.id}`,
        action: 'UPDATE',
        reviewStatus: opts.reviewStatus,
        rightsStatus: opts.rightsStatus,
        proposedData: { title: 'fixture' },
      },
    });
    return job;
  }

  it('rejects publish when flag off', async () => {
    process.env.CONTENT_SYNC_PUBLISH_ENABLED = 'false';
    const job = await makeJob({
      reviewStatus: 'APPROVED',
      rightsStatus: 'CLIENT_PROVIDED',
    });
    await expect(sync.publishJob(job.id)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('rejects unapproved items', async () => {
    process.env.CONTENT_SYNC_PUBLISH_ENABLED = 'true';
    const job = await makeJob({
      reviewStatus: 'PENDING',
      rightsStatus: 'CLIENT_PROVIDED',
    });
    await expect(sync.publishJob(job.id)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('rejects UNVERIFIED rights', async () => {
    process.env.CONTENT_SYNC_PUBLISH_ENABLED = 'true';
    const job = await makeJob({
      reviewStatus: 'APPROVED',
      rightsStatus: 'UNVERIFIED',
    });
    await expect(sync.publishJob(job.id)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('publishes staging marker when approved + rights ok', async () => {
    process.env.CONTENT_SYNC_PUBLISH_ENABLED = 'true';
    const job = await makeJob({
      reviewStatus: 'APPROVED',
      rightsStatus: 'CLIENT_PROVIDED',
    });
    const first = await sync.publishJob(job.id, 1);
    expect(first.ok).toBe(true);
    expect(first.target).toBe('staging-marker');

    const versions = await prisma.contentVersion.findMany({
      where: { entityType: 'ContentSyncJob', entityId: String(job.id) },
    });
    expect(versions.length).toBeGreaterThanOrEqual(1);

    // second publish — another version (idempotent gate)
    const second = await sync.publishJob(job.id, 1);
    expect(second.ok).toBe(true);
    const again = await prisma.contentVersion.findMany({
      where: { entityType: 'ContentSyncJob', entityId: String(job.id) },
    });
    expect(again.length).toBeGreaterThanOrEqual(versions.length + 1);
  });
});
