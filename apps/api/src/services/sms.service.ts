import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  isConfigured(): boolean {
    return Boolean(
      process.env.SMS_API_URL ||
      process.env.TWILIO_ACCOUNT_SID ||
      process.env.ESMS_API_KEY,
    );
  }

  async sendOtp(
    phone: string,
    code: string,
  ): Promise<{ sent: boolean; devCode?: string }> {
    const message = `JetBay verification code: ${code}. Valid for 5 minutes.`;

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      return this.sendTwilio(phone, message);
    }

    if (process.env.ESMS_API_KEY && process.env.ESMS_BRANDNAME) {
      return this.sendEsms(phone, message);
    }

    if (process.env.SMS_API_URL) {
      try {
        const res = await fetch(process.env.SMS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.SMS_API_KEY
              ? { Authorization: `Bearer ${process.env.SMS_API_KEY}` }
              : {}),
          },
          body: JSON.stringify({ phone, message }),
        });
        if (!res.ok) {
          this.logger.error(`SMS API error: ${res.status} ${await res.text()}`);
          return { sent: false };
        }
        return { sent: true };
      } catch (err) {
        this.logger.error(
          `SMS send failed: ${err instanceof Error ? err.message : err}`,
        );
        return { sent: false };
      }
    }

    const appEnv = process.env.APP_ENV ?? process.env.NODE_ENV;
    if (appEnv !== 'production') {
      this.logger.warn(`[DEV SMS] ${phone} → ${code}`);
      return { sent: true, devCode: code };
    }

    this.logger.warn(`SMS not configured — OTP for ${phone} not sent`);
    return { sent: false };
  }

  private async sendTwilio(
    phone: string,
    message: string,
  ): Promise<{ sent: boolean }> {
    const sid = process.env.TWILIO_ACCOUNT_SID!;
    const token = process.env.TWILIO_AUTH_TOKEN!;
    const from = process.env.TWILIO_FROM_NUMBER;
    if (!from) {
      this.logger.error('TWILIO_FROM_NUMBER is required');
      return { sent: false };
    }

    const body = new URLSearchParams({ To: phone, From: from, Body: message });
    try {
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        },
      );
      if (!res.ok) {
        this.logger.error(`Twilio error: ${res.status} ${await res.text()}`);
        return { sent: false };
      }
      return { sent: true };
    } catch (err) {
      this.logger.error(
        `Twilio send failed: ${err instanceof Error ? err.message : err}`,
      );
      return { sent: false };
    }
  }

  private async sendEsms(
    phone: string,
    message: string,
  ): Promise<{ sent: boolean }> {
    try {
      const res = await fetch(
        'https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ApiKey: process.env.ESMS_API_KEY,
            SecretKey: process.env.ESMS_SECRET_KEY,
            Brandname: process.env.ESMS_BRANDNAME,
            SmsType: '2',
            Phone: phone.replace(/^\+/, ''),
            Content: message,
          }),
        },
      );
      const data = (await res.json()) as { CodeResult?: string };
      if (!res.ok || data.CodeResult !== '100') {
        this.logger.error(`ESMS error: ${res.status} ${JSON.stringify(data)}`);
        return { sent: false };
      }
      return { sent: true };
    } catch (err) {
      this.logger.error(
        `ESMS send failed: ${err instanceof Error ? err.message : err}`,
      );
      return { sent: false };
    }
  }
}
