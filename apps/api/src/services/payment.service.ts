import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe | null = null;

  isStripeEnabled(): boolean {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  }

  private getStripe(): Stripe | null {
    if (this.stripe) return this.stripe;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    this.stripe = new Stripe(key);
    return this.stripe;
  }

  async createStripePaymentIntent(opts: {
    amount: number;
    currency: string;
    bookingId: number;
    paymentId: number;
  }): Promise<{ clientSecret: string; stripePaymentIntentId: string } | null> {
    const stripe = this.getStripe();
    if (!stripe) return null;

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(opts.amount * 100),
      currency: opts.currency.toLowerCase(),
      metadata: {
        bookingId: String(opts.bookingId),
        paymentId: String(opts.paymentId),
      },
      automatic_payment_methods: { enabled: true },
    });

    if (!intent.client_secret) return null;

    return {
      clientSecret: intent.client_secret,
      stripePaymentIntentId: intent.id,
    };
  }

  async confirmStripePayment(stripePaymentIntentId: string): Promise<boolean> {
    const stripe = this.getStripe();
    if (!stripe) return false;

    try {
      const intent = await stripe.paymentIntents.retrieve(
        stripePaymentIntentId,
      );
      return intent.status === 'succeeded';
    } catch (err) {
      this.logger.error(
        `Stripe confirm failed: ${err instanceof Error ? err.message : err}`,
      );
      return false;
    }
  }

  constructStripeEvent(
    payload: Buffer,
    signature: string,
  ): Stripe.Event | null {
    const stripe = this.getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !secret) return null;
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (err) {
      this.logger.error(
        `Stripe webhook verify failed: ${err instanceof Error ? err.message : err}`,
      );
      return null;
    }
  }
}
