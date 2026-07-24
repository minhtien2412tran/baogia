import { EmailTemplateService } from './email-template.service';

describe('EmailTemplateService.render', () => {
  const svc = Object.create(EmailTemplateService.prototype) as EmailTemplateService;

  it('replaces mustache-style vars', () => {
    expect(
      svc.render('Hello {{name}} #{{id}}', { name: 'Ops', id: 42 }),
    ).toBe('Hello Ops #42');
  });

  it('empty for missing vars', () => {
    expect(svc.render('X={{missing}}', {})).toBe('X=');
  });
});

describe('EmailTemplateService.sendRendered idempotency', () => {
  it('skips SMTP when EmailCampaignLog already SENT', async () => {
    const email = { sendMail: jest.fn().mockResolvedValue({ sent: true }) };
    const prisma = {
      emailCampaignLog: {
        findUnique: jest.fn().mockResolvedValue({ status: 'SENT' }),
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
      emailTemplate: {
        findUnique: jest.fn().mockResolvedValue({
          subject: 'Hi {{name}}',
          htmlBody: '<p>{{name}}</p>',
          textBody: '{{name}}',
        }),
      },
    };
    const audit = { log: jest.fn() };
    const svc = new EmailTemplateService(
      prisma as never,
      email as never,
      audit as never,
    );

    const r = await svc.sendRendered({
      key: 'admin_flight_notify',
      to: 'sales@example.com',
      vars: { name: 'Ops' },
      campaignKey: 'booking_confirmed:sales',
      referenceId: 'BK-000099:CONFIRMED:confirmed',
      recipientGroup: 'sales',
    });

    expect(r).toEqual({ sent: true, reason: 'idempotent_skip' });
    expect(email.sendMail).not.toHaveBeenCalled();
    expect(prisma.emailCampaignLog.upsert).not.toHaveBeenCalled();
  });
});
