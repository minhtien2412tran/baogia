import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { QuoteService } from '../services/quote.service';
import { JetCardService } from '../services/jet-card.service';
import { TravelCreditService } from '../services/travel-credit.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly auth: AuthService,
    private readonly booking: BookingService,
    private readonly quote: QuoteService,
    private readonly jetCard: JetCardService,
    private readonly travelCredit: TravelCreditService,
  ) {}

  async getDashboard(userId: number, email: string) {
    const [profile, bookings, quotes, payments, jetCards, travelCredits] =
      await Promise.all([
        this.auth.getProfile(userId),
        this.booking.findMyBookings(userId),
        this.quote.getMyQuotes(userId, email),
        this.booking.findMyPayments(userId),
        this.jetCard
          .getUserAccounts(userId)
          .catch(
            () => [] as Awaited<ReturnType<JetCardService['getUserAccounts']>>,
          ),
        this.travelCredit.getBalance(userId).catch(() => ({
          credits: 0,
          currency: 'USD',
          expirySummary: [] as { amount: number; expiresAt: string }[],
        })),
      ]);

    const documents = bookings.flatMap((b) =>
      (b.documents ?? []).map((d) => ({
        ...d,
        bookingId: b.id,
      })),
    );

    const jetCardHours = jetCards.reduce(
      (sum, c) => sum + (Number(c.remainingHours) || 0),
      0,
    );

    return {
      profile,
      stats: {
        bookings: bookings.length,
        quotes: quotes.length,
        payments: payments.length,
        documents: documents.length,
        jetCardHours,
        travelCredits: travelCredits.credits ?? 0,
      },
      bookings,
      quotes,
      payments,
      documents,
      jetCards,
      travelCredits,
    };
  }
}
