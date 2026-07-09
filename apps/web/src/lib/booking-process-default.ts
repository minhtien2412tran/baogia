import { JB } from '../config/jetbay-cdn';

export type BookingStep = { title: string; body: string };
export type BookingWhyItem = { title: string; body: string };
export type PaymentMethod = { title: string; body: string };

export type BookingProcessPageData = {
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  processTitle: string;
  processSubtitle: string;
  steps: BookingStep[];
  whyTitle: string;
  whyItems: BookingWhyItem[];
  paymentTitle: string;
  paymentMethods: PaymentMethod[];
  ctaLabel: string;
};

export const DEFAULT_BOOKING_PROCESS: BookingProcessPageData = {
  heroTitle: 'How to Charter a Flight',
  heroSubtitle: 'Simple, efficient, reliable — follow four steps to book your private jet charter.',
  introTitle: 'Your Journey, Effortlessly Arranged',
  introBody:
    'J-TA offers a seamless private jet booking experience available 24/7 across 190+ countries. Our AI-powered matching and dedicated charter specialists guide you from enquiry to wheels-up.',
  processTitle: 'The J-TA Booking Process',
  processSubtitle: 'Simple, Efficient, Reliable',
  steps: [
    {
      title: 'Enquiry',
      body: 'Share your travel details and preferences, including destinations, dates, and passenger needs. Our proprietary system and team will carefully review your request to match you with the most suitable aircraft for your journey.',
    },
    {
      title: 'Tailored Quotation',
      body: 'Your dedicated Private Charter Specialist will design a personalised flight plan tailored to your requirements. We will recommend the most suitable aircraft and provide a competitive, transparent quotation based on your journey.',
    },
    {
      title: 'Confirmation & Payment',
      body: 'Once you are happy with your itinerary, you can review and sign the charter agreement securely. Choose your preferred payment method and confirm your booking with full transparency and no hidden fees.',
    },
    {
      title: 'Fly & Enjoy',
      body: 'From pre-flight arrangements to arrival, our team manages every detail of your journey. Enjoy a seamless experience with personalised service, allowing you to relax and focus on what matters most.',
    },
  ],
  whyTitle: 'Why Choose Private Jet Charters by J-TA',
  whyItems: [
    {
      title: 'Global Coverage',
      body: 'Available 24/7, our private jet network spans 190+ countries with seamless connectivity worldwide.',
    },
    {
      title: 'AI-Powered Efficiency',
      body: 'Our smart air charter system uses AI to match your needs, securing the best aircraft and planning your trip in 1–2 hours.',
    },
    {
      title: 'Uncompromised Safety',
      body: 'J-TA works with trusted operators and maintains strict safety review standards on every charter journey.',
    },
    {
      title: 'Industry Leader',
      body: 'With over 10,000 satisfied clients, J-TA is a leading provider of premium private jet charter services.',
    },
  ],
  paymentTitle: 'Payment Methods',
  paymentMethods: [
    {
      title: 'Bank Transfer',
      body: 'Transfer funds directly from your bank account. Reliable and preferred for larger transactions.',
    },
    {
      title: 'Credit Card',
      body: 'Instant payment via major credit card providers for a seamless checkout experience.',
    },
    {
      title: 'Card Hold + Bank Transfer',
      body: 'Secure your booking with a credit card hold, then complete payment via bank transfer.',
    },
  ],
  ctaLabel: 'Start a Search',
};

export function bookingStepImages(): string[] {
  return [...JB.pages.bookingProcess.steps];
}

export function parseBookingProcessBody(body: string | undefined | null): BookingProcessPageData {
  if (!body?.trim()) return DEFAULT_BOOKING_PROCESS;
  try {
    const parsed = JSON.parse(body) as Partial<BookingProcessPageData>;
    return mergeBookingProcess(parsed);
  } catch {
    return { ...DEFAULT_BOOKING_PROCESS, introBody: body };
  }
}

function mergeRecords<T extends Record<string, unknown>>(defaults: T[], overrides?: Partial<T>[]): T[] {
  if (!overrides?.length) return defaults;
  return defaults.map((item, i) => ({ ...item, ...(overrides[i] ?? {}) }));
}

function mergeBookingProcess(parsed: Partial<BookingProcessPageData>): BookingProcessPageData {
  return {
    ...DEFAULT_BOOKING_PROCESS,
    ...parsed,
    steps: mergeRecords(DEFAULT_BOOKING_PROCESS.steps, parsed.steps),
    whyItems: mergeRecords(DEFAULT_BOOKING_PROCESS.whyItems, parsed.whyItems),
    paymentMethods: mergeRecords(DEFAULT_BOOKING_PROCESS.paymentMethods, parsed.paymentMethods),
  };
}
