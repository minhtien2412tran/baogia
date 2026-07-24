import { FlightNotifyService } from './flight-notify.service';

describe('FlightNotifyService', () => {
  const email = { sendMail: jest.fn().mockResolvedValue({ sent: true }) };
  const audit = { log: jest.fn().mockResolvedValue(undefined) };

  it('skips gracefully when booking missing', async () => {
    const prisma = {
      booking: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      operatorUser: { findMany: jest.fn() },
    };
    const templates = {
      sendRendered: jest.fn(),
    };
    const svc = new FlightNotifyService(
      prisma as never,
      templates as never,
      email as never,
      audit as never,
    );
    const r = await svc.notifyOperatorAndAdmin(999);
    expect(r.sent).toBe(0);
    expect(templates.sendRendered).not.toHaveBeenCalled();
  });

  it('sends to operator + admin when emails present', async () => {
    const prisma = {
      booking: {
        findUnique: jest.fn().mockResolvedValue({
          id: 7,
          bookingCode: null,
          bookingStatus: 'PENDING',
          quoteOfferId: 3,
          aircraftId: null,
          passengers: [{ id: 1 }],
          user: { email: 'c@x.com', firstName: 'C', lastName: 'U' },
          quoteOffer: {
            operator: { id: 1, name: 'Asia Ops', contactEmail: 'ops@x.com' },
            aircraftModel: { manufacturer: 'Gulfstream', model: 'G650' },
          },
          aircraft: null,
          quoteRequest: { legs: [] },
        }),
      },
      operatorUser: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const templates = {
      sendRendered: jest.fn().mockResolvedValue({ sent: true }),
    };
    process.env.SMTP_ENQUIRY_TO = 'admin@x.com';
    const svc = new FlightNotifyService(
      prisma as never,
      templates as never,
      email as never,
      audit as never,
    );
    const r = await svc.notifyOperatorAndAdmin(7, 'created');
    expect(r.sent).toBe(2);
    expect(templates.sendRendered).toHaveBeenCalledTimes(2);
    expect(r.needsManual).toBe(false);
  });

  it('alerts sales when operator unassigned (no wrong airline mail)', async () => {
    const prisma = {
      booking: {
        findUnique: jest.fn().mockResolvedValue({
          id: 8,
          bookingCode: null,
          bookingStatus: 'PENDING',
          quoteOfferId: null,
          aircraftId: null,
          passengers: [],
          user: { email: 'c@x.com', firstName: 'C', lastName: 'U' },
          quoteOffer: null,
          aircraft: null,
          quoteRequest: { legs: [] },
        }),
      },
      operatorUser: { findMany: jest.fn() },
    };
    const templates = {
      sendRendered: jest.fn().mockResolvedValue({ sent: true }),
    };
    process.env.SMTP_ENQUIRY_TO = 'admin@x.com';
    const svc = new FlightNotifyService(
      prisma as never,
      templates as never,
      email as never,
      audit as never,
    );
    const r = await svc.notifyOperatorAndAdmin(8, 'created');
    expect(r.needsManual).toBe(true);
    // sales notify + operator_unassigned alert (both admin_flight_notify)
    expect(templates.sendRendered).toHaveBeenCalled();
    const keys = templates.sendRendered.mock.calls.map((c) => c[0].campaignKey);
    expect(keys.some((k: string) => k.includes('sales') || k.includes('operator_unassigned'))).toBe(
      true,
    );
  });
});
