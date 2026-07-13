import { createHmac } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OnepayService {
  private readonly logger = new Logger(OnepayService.name);

  isConfigured(): boolean {
    return Boolean(
      process.env.ONEPAY_MERCHANT_ID &&
      process.env.ONEPAY_ACCESS_CODE &&
      process.env.ONEPAY_SECURE_SECRET,
    );
  }

  private hashParams(params: Record<string, string>): string {
    const secret = process.env.ONEPAY_SECURE_SECRET ?? '';
    const sorted = Object.keys(params)
      .filter((k) => params[k] !== '' && k !== 'vpc_SecureHash')
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    return createHmac('sha256', Buffer.from(secret, 'hex'))
      .update(sorted)
      .digest('hex')
      .toUpperCase();
  }

  createPaymentUrl(opts: {
    orderId: string;
    amount: number;
    currency?: string;
    returnUrl: string;
  }): { gateway: 'onepay'; redirectUrl: string } | null {
    if (!this.isConfigured()) return null;

    const baseUrl =
      process.env.ONEPAY_URL ?? 'https://mtf.onepay.vn/paygate/vpcpay.op';

    const params: Record<string, string> = {
      vpc_Version: '2',
      vpc_Command: 'pay',
      vpc_AccessCode: process.env.ONEPAY_ACCESS_CODE!,
      vpc_Merchant: process.env.ONEPAY_MERCHANT_ID!,
      vpc_ReturnURL: opts.returnUrl,
      vpc_MerchTxnRef: opts.orderId,
      vpc_OrderInfo: `JetBay Booking ${opts.orderId}`,
      vpc_Amount: String(Math.round(opts.amount * 100)),
      vpc_Currency: opts.currency ?? 'VND',
      vpc_Locale: 'vn',
    };

    params.vpc_SecureHash = this.hashParams(params);
    const query = new URLSearchParams(params).toString();
    return { gateway: 'onepay', redirectUrl: `${baseUrl}?${query}` };
  }

  verifyIpn(query: Record<string, string>): boolean {
    if (!this.isConfigured()) return false;
    const received = query.vpc_SecureHash;
    if (!received) return false;
    const expected = this.hashParams(query);
    const ok = received.toUpperCase() === expected;
    if (!ok) this.logger.warn('OnePay IPN hash mismatch');
    return ok;
  }
}
