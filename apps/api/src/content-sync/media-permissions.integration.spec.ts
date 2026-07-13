import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionService } from '../permissions/permission.service';
import { createHash } from 'node:crypto';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

/**
 * Permission matrix for content_media (effective resolution).
 * HTTP smoke against live API is documented separately; this suite is DB-backed.
 */
describe('Media permission matrix (DB)', () => {
  let prisma: PrismaService;
  let permissions: PermissionService;
  const stamp = Date.now();
  const emails: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, PermissionService],
    }).compile();
    prisma = moduleRef.get(PrismaService);
    permissions = moduleRef.get(PermissionService);
  });

  afterAll(async () => {
    for (const email of emails) {
      const u = await prisma.user.findUnique({ where: { email } });
      if (u) {
        await prisma.userPermissionOverride.deleteMany({
          where: { userId: u.id },
        });
        await prisma.user.delete({ where: { id: u.id } });
      }
    }
    await prisma.$disconnect();
  });

  async function makeUser(
    label: string,
    role: string,
    allows: string[],
    denies: string[] = [],
  ) {
    const email = `media.matrix.${label}.${stamp}@jetbay.local`;
    emails.push(email);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword('Test123!'),
        firstName: label,
        lastName: 'Matrix',
        role,
      },
    });
    for (const permission of allows) {
      await prisma.userPermissionOverride.create({
        data: { userId: user.id, permission, effect: 'ALLOW' },
      });
    }
    for (const permission of denies) {
      await prisma.userPermissionOverride.create({
        data: { userId: user.id, permission, effect: 'DENY' },
      });
    }
    return user;
  }

  it('viewer: list only', async () => {
    const u = await makeUser('viewer', 'USER', ['content_media.view']);
    expect(
      await permissions.hasPermission(u.id, u.role, 'content_media.view'),
    ).toBe(true);
    expect(
      await permissions.hasPermission(u.id, u.role, 'content_media.sync'),
    ).toBe(false);
    expect(
      await permissions.hasPermission(
        u.id,
        u.role,
        'content_media.approve_production',
      ),
    ).toBe(false);
  });

  it('sync operator: sync yes, prod approve no', async () => {
    const u = await makeUser('sync', 'SALES', [
      'content_media.view',
      'content_media.sync',
    ]);
    expect(
      await permissions.hasPermission(u.id, u.role, 'content_media.sync'),
    ).toBe(true);
    expect(
      await permissions.hasPermission(
        u.id,
        u.role,
        'content_media.approve_production',
      ),
    ).toBe(false);
  });

  it('reviewer: staging yes, production no', async () => {
    const u = await makeUser('reviewer', 'SALES', [
      'content_media.view',
      'content_media.review',
      'content_media.approve_staging',
    ]);
    expect(
      await permissions.hasPermission(
        u.id,
        u.role,
        'content_media.approve_staging',
      ),
    ).toBe(true);
    expect(
      await permissions.hasPermission(
        u.id,
        u.role,
        'content_media.approve_production',
      ),
    ).toBe(false);
  });

  it('production approver: production yes', async () => {
    const u = await makeUser('prod', 'SALES', [
      'content_media.view',
      'content_media.approve_production',
    ]);
    expect(
      await permissions.hasPermission(
        u.id,
        u.role,
        'content_media.approve_production',
      ),
    ).toBe(true);
  });

  it('ADMIN bypasses catalog', async () => {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) return;
    expect(
      await permissions.hasPermission(
        admin.id,
        'ADMIN',
        'content_media.approve_production',
      ),
    ).toBe(true);
  });

  it('DENY overrides role/allow', async () => {
    const u = await makeUser('deny', 'SALES', ['content_media.view'], [
      'content_media.approve_staging',
    ]);
    // Explicit ALLOW then DENY on same permission
    await prisma.userPermissionOverride.upsert({
      where: {
        userId_permission: {
          userId: u.id,
          permission: 'content_media.approve_staging',
        },
      },
      update: { effect: 'ALLOW' },
      create: {
        userId: u.id,
        permission: 'content_media.approve_staging',
        effect: 'ALLOW',
      },
    });
    await prisma.userPermissionOverride.upsert({
      where: {
        userId_permission: {
          userId: u.id,
          permission: 'content_media.approve_staging',
        },
      },
      update: { effect: 'DENY' },
      create: {
        userId: u.id,
        permission: 'content_media.approve_staging',
        effect: 'DENY',
      },
    });
    expect(
      await permissions.hasPermission(
        u.id,
        u.role,
        'content_media.approve_staging',
      ),
    ).toBe(false);
    expect(
      await permissions.hasPermission(u.id, u.role, 'content_media.view'),
    ).toBe(true);
  });

  it('seeded media.reviewer cannot approve production', async () => {
    const reviewer = await prisma.user.findUnique({
      where: { email: 'media.reviewer@jetbay.local' },
    });
    if (!reviewer) return;
    expect(
      await permissions.hasPermission(
        reviewer.id,
        reviewer.role,
        'content_media.view',
      ),
    ).toBe(true);
    expect(
      await permissions.hasPermission(
        reviewer.id,
        reviewer.role,
        'content_media.approve_production',
      ),
    ).toBe(false);
  });
});
