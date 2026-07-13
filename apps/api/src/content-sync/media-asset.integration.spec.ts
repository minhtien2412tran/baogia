import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ContentSyncService } from './content-sync.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../services/audit.service';

/**
 * Real-DB integration for MediaAsset rights workflow.
 * Requires local DATABASE_URL (migrate + seed applied).
 */
describe('MediaAsset rights workflow (DB)', () => {
  let sync: ContentSyncService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ContentSyncService, PrismaService, AuditService],
    }).compile();
    sync = moduleRef.get(ContentSyncService);
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('rejects production approve for UNVERIFIED fixture', async () => {
    const row = await prisma.mediaAsset.findUnique({
      where: { storageKey: 'fixtures/media/unverified-staging.jpg' },
    });
    if (!row) {
      // seed may not have run — create ephemeral
      const created = await sync.upsertMediaAsset({
        storageKey: 'fixtures/media/unverified-staging.jpg',
        rightsStatus: 'UNVERIFIED',
        checksum: 'tmp',
        mimeType: 'image/jpeg',
        width: 10,
        height: 10,
      });
      await expect(
        sync.approveMediaProduction(created.asset.id),
      ).rejects.toBeInstanceOf(ForbiddenException);
      return;
    }
    await expect(sync.approveMediaProduction(row.id)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    const again = await prisma.mediaAsset.findUnique({ where: { id: row.id } });
    expect(again?.approvedForPublish).toBe(false);
  });

  it('allows staging approve then production for CLIENT_PROVIDED fixture', async () => {
    let row = await prisma.mediaAsset.findUnique({
      where: { storageKey: 'fixtures/media/client-provided-plane.jpg' },
    });
    if (!row) {
      const created = await sync.upsertMediaAsset({
        storageKey: 'fixtures/media/client-provided-plane.jpg',
        rightsStatus: 'CLIENT_PROVIDED',
        checksum: 'fixture-client-provided-sha256',
        mimeType: 'image/jpeg',
        width: 1600,
        height: 900,
      });
      row = created.asset;
    } else {
      // reset production flag for idempotent test
      await prisma.mediaAsset.update({
        where: { id: row.id },
        data: { approvedForPublish: false, approvedForStaging: true },
      });
    }

    const staged = await sync.approveMediaStaging(row.id, 1);
    expect(staged.asset.approvedForStaging).toBe(true);

    const prod = await sync.approveMediaProduction(row.id, 1);
    expect(prod.asset.approvedForPublish).toBe(true);
    expect(prod.asset.rightsStatus).toBe('CLIENT_PROVIDED');

    const pub = await sync.listPublicApprovedMedia();
    expect(
      pub.assets.some((a) => a.storageKey === 'fixtures/media/client-provided-plane.jpg'),
    ).toBe(true);

    // cleanup production flag so seed stays non-prod by default
    await prisma.mediaAsset.update({
      where: { id: row.id },
      data: { approvedForPublish: false },
    });
  });

  it('blocks jetbay storage keys', async () => {
    await expect(
      sync.upsertMediaAsset({
        storageKey: '/assets/jetbay/evil.jpg',
        rightsStatus: 'CLIENT_PROVIDED',
      }),
    ).rejects.toThrow(/JetBay/i);
  });
});
