import { PermissionService } from './permission.service';

describe('PermissionService resolution order', () => {
  const prisma = {
    userPermissionOverride: {
      findUnique: jest.fn(),
    },
    rolePermission: {
      findUnique: jest.fn(),
    },
  };

  const service = new PermissionService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ADMIN always allowed', async () => {
    await expect(
      service.hasPermission(1, 'ADMIN', 'booking.cancel'),
    ).resolves.toBe(true);
    expect(prisma.userPermissionOverride.findUnique).not.toHaveBeenCalled();
  });

  it('DENY overrides ROLE allow', async () => {
    prisma.userPermissionOverride.findUnique.mockResolvedValue({
      effect: 'DENY',
    });
    await expect(
      service.hasPermission(2, 'SALES', 'booking.cancel'),
    ).resolves.toBe(false);
    expect(prisma.rolePermission.findUnique).not.toHaveBeenCalled();
  });

  it('ALLOW overrides missing role permission', async () => {
    prisma.userPermissionOverride.findUnique.mockResolvedValue({
      effect: 'ALLOW',
    });
    await expect(
      service.hasPermission(2, 'SALES', 'contract.approve'),
    ).resolves.toBe(true);
  });

  it('INHERIT falls through to role permission', async () => {
    prisma.userPermissionOverride.findUnique.mockResolvedValue({
      effect: 'INHERIT',
    });
    prisma.rolePermission.findUnique.mockResolvedValue({
      permission: 'booking.view',
    });
    await expect(
      service.hasPermission(2, 'SALES', 'booking.view'),
    ).resolves.toBe(true);
  });

  it('no override uses role only', async () => {
    prisma.userPermissionOverride.findUnique.mockResolvedValue(null);
    prisma.rolePermission.findUnique.mockResolvedValue(null);
    await expect(
      service.hasPermission(2, 'SALES', 'permission.manage'),
    ).resolves.toBe(false);
  });
});
