export type AccountProfile = {
  publicId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  whatsapp?: string | null;
  zalo?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  preferredLocale?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  accountType?: string | null;
  role?: string;
  status?: string;
};

export type AccountStats = {
  bookings: number;
  quotes: number;
  payments: number;
  documents: number;
  jetCardHours: number;
  travelCredits: number;
};

export type AccountBooking = {
  id: number;
  status: string;
  paymentStatus?: string;
  bookingType?: string;
  itinerary?: {
    tripType: string;
    legs: { fromAirport: string; toAirport: string; departureAt: string }[];
  } | null;
  documents?: Array<{
    id: number;
    documentType: string;
    status: string;
    fileUrl?: string;
    htmlUrl?: string;
    bookingId?: number;
  }>;
  createdAt?: string;
};

export type AccountQuote = {
  id: number;
  status: string;
  tripType: string;
  createdAt: string;
  legs: { from: string; to: string; departure: string; passengers: number }[];
};

export type AccountPayment = {
  id: number;
  bookingId: number;
  method: string;
  amount: number;
  currency: string;
  status: string;
  transactionRef?: string;
  createdAt: string;
};

export type AccountDocument = {
  id: number;
  documentType: string;
  status: string;
  fileUrl?: string;
  htmlUrl?: string;
  bookingId: number;
};

export type JetCardAccount = {
  accountId: number;
  planName: string;
  remainingHours: number;
  expiryDate: string;
  purchasedAt: string;
  recentTransactions: { txnType: string; hoursDelta: number; date: string }[];
};

export type TravelCreditBalance = {
  credits: number;
  currency: string;
  expirySummary: { amount: number; expiresAt: string }[];
};

export type AccountDashboard = {
  profile: AccountProfile;
  stats: AccountStats;
  bookings: AccountBooking[];
  quotes: AccountQuote[];
  payments: AccountPayment[];
  documents: AccountDocument[];
  jetCards: JetCardAccount[];
  travelCredits: TravelCreditBalance;
};
