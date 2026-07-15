import {
  isLoopbackSmtpHost,
  isSmtpDeliverableConfigured,
  smtpNonDeliverableReason,
} from './smtp-config';

describe('smtp-config', () => {
  it('detects loopback hosts', () => {
    expect(isLoopbackSmtpHost('localhost')).toBe(true);
    expect(isLoopbackSmtpHost('127.0.0.1')).toBe(true);
    expect(isLoopbackSmtpHost('::1')).toBe(true);
    expect(isLoopbackSmtpHost('0.0.0.0')).toBe(true);
    expect(isLoopbackSmtpHost('host.docker.internal')).toBe(true);
    expect(isLoopbackSmtpHost('mailhog.local')).toBe(true);
    expect(isLoopbackSmtpHost('smtp.sendgrid.net')).toBe(false);
  });

  it('rejects localhost in production', () => {
    const env = {
      APP_ENV: 'production',
      SMTP_HOST: 'localhost',
      SMTP_PORT: '1025',
    };
    expect(isSmtpDeliverableConfigured(env)).toBe(false);
    expect(smtpNonDeliverableReason(env) ?? '').toMatch(/loopback/);
  });

  it('accepts real host in production', () => {
    const env = {
      APP_ENV: 'production',
      SMTP_HOST: 'smtp.example.com',
    };
    expect(isSmtpDeliverableConfigured(env)).toBe(true);
    expect(smtpNonDeliverableReason(env)).toBeNull();
  });

  it('allows localhost in non-production (local MailHog)', () => {
    const env = {
      APP_ENV: 'development',
      SMTP_HOST: 'localhost',
    };
    expect(isSmtpDeliverableConfigured(env)).toBe(true);
  });
});
