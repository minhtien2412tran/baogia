import { createHmac } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NinepayService {
  private readonly logger = new Logger(NinepayService.name);

  isConfigured(): boolean {
    return Boolean(
      process.env.NINEPAY_MERCHANT_KEY &&
      process.env.NINEPAY_SECRET_KEY &&
      process.env.NINEPAY_ENDPOINT,
    );
  }

  private sign(payload: string): string {
    const secret = process.env.NINEPAY_SECRET_KEY ?? '';
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  createPaymentUrl(opts: {
    orderId: string;
    amount: number;
    returnUrl: string;
    currency?: string;
  }): { gateway: '9pay'; redirectUrl: string } | null {
    if (!this.isConfigured()) return null;

    const endpoint = process.env.NINEPAY_ENDPOINT!;
    const merchantKey = process.env.NINEPAY_MERCHANT_KEY!;
    const time = Math.floor(Date.now() / 1000);
    const amount = Math.round(opts.amount);
    const currency = opts.currency ?? 'VND';

    const raw = `${time}|${opts.returnUrl}|${merchantKey}|${opts.orderId}|${amount}|${currency}`;
    const signature = this.sign(raw);

    const params = new URLSearchParams({
      merchantKey,
      invoice_no: opts.orderId,
      amount: String(amount),
      currency,
      return_url: opts.returnUrl,
      time: String(time),
      signature,
      description: `JetVina Booking ${opts.orderId}`,
    });

    return { gateway: '9pay', redirectUrl: `${endpoint}?${params.toString()}` };
  }

  verifyIpn(body: Record<string, string>): boolean {
    if (!this.isConfigured()) return false;
    const { signature, ...rest } = body;
    if (!signature) return false;
    const payload = Object.keys(rest)
      .sort()
      .map((k) => `${k}=${rest[k]}`)
      .join('&');
    const ok = this.sign(payload) === signature;
    if (!ok) this.logger.warn('9Pay IPN signature mismatch');
    return ok;
  }
}
