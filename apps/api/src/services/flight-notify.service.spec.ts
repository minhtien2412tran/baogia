import { FlightNotifyService } from './flight-notify.service';

describe('FlightNotifyService', () => {
  it('skips gracefully when booking missing', async () => {
    const prisma = {
      booking: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const templates = {
      sendRendered: jest.fn(),
    };
    const svc = new FlightNotifyService(prisma as never, templates as never);
    const r = await svc.notifyOperatorAndAdmin(999);
    expect(r.sent).toBe(0);
    expect(templates.sendRendered).not.toHaveBeenCalled();
  });

  it('sends to operator + admin when emails present', async () => {
    const prisma = {
      booking: {
        findUnique: jest.fn().mockResolvedValue({
          id: 7,
          bookingStatus: 'PENDING',
          user: { email: 'c@x.com', firstName: 'C', lastName: 'U' },
          quoteOffer: {
            operator: { id: 1, name: 'Asia Ops', contactEmail: 'ops@x.com' },
          },
          quoteRequest: { legs: [] },
        }),
      },
    };
    const templates = {
      sendRendered: jest.fn().mockResolvedValue({ sent: true }),
    };
    process.env.SMTP_ENQUIRY_TO = 'admin@x.com';
    const svc = new FlightNotifyService(prisma as never, templates as never);
    const r = await svc.notifyOperatorAndAdmin(7, 'created');
    expect(r.sent).toBe(2);
    expect(templates.sendRendered).toHaveBeenCalledTimes(2);
  });
});
