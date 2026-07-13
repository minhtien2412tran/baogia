import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ContentSyncService } from './content-sync.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../services/audit.service';

describe('Media manifest import (DB)', () => {
  let sync: ContentSyncService;
  let prisma: PrismaService;
  const prev = process.env.EXTERNAL_MEDIA_IMPORT_ENABLED;
  const key = `fixtures/media/import-test-${Date.now()}.jpg`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ContentSyncService, PrismaService, AuditService],
    }).compile();
    sync = moduleRef.get(ContentSyncService);
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    process.env.EXTERNAL_MEDIA_IMPORT_ENABLED = prev;
    await prisma.mediaAsset.deleteMany({
      where: { storageKey: { startsWith: 'fixtures/media/import-test-' } },
    });
    await prisma.$disconnect();
  });

  it('rejects when flag off', async () => {
    process.env.EXTERNAL_MEDIA_IMPORT_ENABLED = 'false';
    await expect(
      sync.importMediaManifest({
        records: [{ storageKey: key, checksum: 'abc' }],
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('dry-run does not write DB', async () => {
    process.env.EXTERNAL_MEDIA_IMPORT_ENABLED = 'true';
    const before = await prisma.mediaAsset.count({
      where: { storageKey: key },
    });
    const r = await sync.importMediaManifest({
      dryRun: true,
      records: [
        {
          storageKey: key,
          checksum: 'dry-checksum',
          mimeType: 'image/jpeg',
        },
      ],
    });
    expect(r.created).toBe(1);
    const after = await prisma.mediaAsset.count({
      where: { storageKey: key },
    });
    expect(after).toBe(before);
  });

  it('creates then idempotent update; rejects jetbay; no rights escalate', async () => {
    process.env.EXTERNAL_MEDIA_IMPORT_ENABLED = 'true';
    const created = await sync.importMediaManifest({
      records: [
        {
          storageKey: key,
          checksum: 'checksum-v1',
          mimeType: 'image/jpeg',
          width: 10,
          height: 10,
          sourceUrl: 'https://jetvina.com/wp-content/uploads/x.jpg',
        },
      ],
    });
    expect(created.created).toBe(1);
    const row = await prisma.mediaAsset.findUnique({
      where: { storageKey: key },
    });
    expect(row?.rightsStatus).toBe('UNVERIFIED');
    expect(row?.approvedForPublish).toBe(false);

    const again = await sync.importMediaManifest({
      records: [
        {
          storageKey: key,
          checksum: 'checksum-v1',
          mimeType: 'image/jpeg',
        },
      ],
    });
    expect(again.updated + again.skipped).toBeGreaterThanOrEqual(1);
    const count = await prisma.mediaAsset.count({
      where: { storageKey: key },
    });
    expect(count).toBe(1);

    const blocked = await sync.importMediaManifest({
      records: [
        { storageKey: key, checksum: 'checksum-v1' },
        { storageKey: '/assets/jetbay/evil.jpg', checksum: 'x' },
      ],
    });
    expect(blocked.blocked).toBeGreaterThanOrEqual(1);
    expect(blocked.updated + blocked.skipped).toBeGreaterThanOrEqual(1);
  });

  it('skips editor-modified when checksum unchanged', async () => {
    process.env.EXTERNAL_MEDIA_IMPORT_ENABLED = 'true';
    const editorKey = `fixtures/media/import-test-editor-${Date.now()}.jpg`;
    await sync.importMediaManifest({
      records: [{ storageKey: editorKey, checksum: 'same', altText: 'orig' }],
    });
    const row = await prisma.mediaAsset.findUnique({
      where: { storageKey: editorKey },
    });
    await prisma.mediaAsset.update({
      where: { id: row!.id },
      data: { altText: 'editor alt', reviewedBy: 1, focalPointX: 0.3 },
    });
    const r = await sync.importMediaManifest({
      records: [
        { storageKey: editorKey, checksum: 'same', altText: 'should-not-win' },
      ],
    });
    expect(r.skipped).toBe(1);
    const again = await prisma.mediaAsset.findUnique({
      where: { storageKey: editorKey },
    });
    expect(again?.altText).toBe('editor alt');
  });
});
