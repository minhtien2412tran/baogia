import { PositioningPriceService } from './positioning-price.service';

describe('PositioningPriceService', () => {
  it('returns empty when no legs', async () => {
    const prisma = { operatorAircraft: { findMany: jest.fn() } } as never;
    const svc = new PositioningPriceService(prisma);
    await expect(svc.searchPricedOptions({ tripType: 'ONE_WAY', legs: [] })).resolves.toEqual([]);
    expect((prisma as { operatorAircraft: { findMany: jest.Mock } }).operatorAircraft.findMany).not.toHaveBeenCalled();
  });

  it('skips aircraft without coords / contract handled by empty fleet', async () => {
    const prisma = {
      operatorAircraft: { findMany: jest.fn().mockResolvedValue([]) },
      airport: { findMany: jest.fn().mockResolvedValue([]) },
    } as never;
    const svc = new PositioningPriceService(prisma);
    const out = await svc.searchPricedOptions({
      tripType: 'ONE_WAY',
      legs: [{ fromAirport: 'SGN', toAirport: 'DAD', passengers: 4 }],
    });
    expect(out).toEqual([]);
  });
});
