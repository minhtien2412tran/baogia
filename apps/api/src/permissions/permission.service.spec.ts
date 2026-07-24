import { PermissionService } from './permission.service';

describe('PermissionService resolution order', () => {
  const prisma = {
    userPermissionOverride: {
      findUnique: jest.fn(),
    },
    rolePermission: {
      findUnique: jest.fn(),
    },
    userAirportScope: {
      findMany: jest.fn(),
    },
    airport: {
      findFirst: jest.fn(),
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

describe('PermissionService airport scope (R5)', () => {
  const prisma = {
    userPermissionOverride: { findUnique: jest.fn() },
    rolePermission: { findUnique: jest.fn() },
    userAirportScope: { findMany: jest.fn() },
    airport: { findFirst: jest.fn() },
  };
  const service = new PermissionService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('ADMIN → unrestricted null', async () => {
    await expect(service.airportWhereForUser(1, 'ADMIN')).resolves.toBeNull();
    expect(prisma.userAirportScope.findMany).not.toHaveBeenCalled();
  });

  it('empty scopes → unrestricted null (legacy)', async () => {
    prisma.userAirportScope.findMany.mockResolvedValue([]);
    await expect(service.airportWhereForUser(2, 'SALES')).resolves.toBeNull();
  });

  it('COUNTRY scope → OR filter', async () => {
    prisma.userAirportScope.findMany.mockResolvedValue([
      {
        scopeType: 'COUNTRY',
        countryCode: 'VN',
        continentCode: null,
        airportId: null,
      },
    ]);
    await expect(service.airportWhereForUser(2, 'SALES')).resolves.toEqual({
      OR: [{ countryCode: 'VN' }],
    });
  });

  it('quoteRequestWhere wraps airport filter on legs', async () => {
    prisma.userAirportScope.findMany.mockResolvedValue([
      {
        scopeType: 'COUNTRY',
        countryCode: 'VN',
        continentCode: null,
        airportId: null,
      },
    ]);
    const where = await service.quoteRequestWhereForUser(2, 'SALES');
    expect(where).toEqual({
      legs: {
        some: {
          OR: [
            { fromAirport: { OR: [{ countryCode: 'VN' }] } },
            { toAirport: { OR: [{ countryCode: 'VN' }] } },
          ],
        },
      },
    });
  });

  it('NONE only → impossible id=-1', async () => {
    prisma.userAirportScope.findMany.mockResolvedValue([
      {
        scopeType: 'NONE',
        countryCode: null,
        continentCode: null,
        airportId: null,
      },
    ]);
    await expect(service.airportWhereForUser(2, 'SALES')).resolves.toEqual({
      id: -1,
    });
  });
});
