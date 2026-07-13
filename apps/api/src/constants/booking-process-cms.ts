export type BookingProcessCmsPayload = {
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  processTitle: string;
  processSubtitle: string;
  steps: { title: string; body: string }[];
  whyTitle: string;
  whyItems: { title: string; body: string }[];
  paymentTitle: string;
  paymentMethods: { title: string; body: string }[];
  ctaLabel: string;
};

export const BOOKING_PROCESS_CMS_DEFAULT: BookingProcessCmsPayload = {
  heroTitle: 'How to Charter a Flight',
  heroSubtitle:
    'Simple, efficient, reliable — follow four steps to book your private jet charter.',
  introTitle: 'Your Journey, Effortlessly Arranged',
  introBody:
    'JetVina offers a seamless private jet booking experience available 24/7 across multiple countries. Our AI-powered matching and dedicated charter specialists guide you from enquiry to wheels-up.',
  processTitle: 'The JetVina Booking Process',
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
  whyTitle: 'Why Choose Private Jet Charters by JetVina',
  whyItems: [
    {
      title: 'Global Coverage',
      body: 'Available 24/7, our private jet network spans multiple countries with seamless connectivity worldwide.',
    },
    {
      title: 'AI-Powered Efficiency',
      body: 'Our smart air charter system uses AI to match your needs, securing the best aircraft and planning your trip in 1–2 hours.',
    },
    {
      title: 'Uncompromised Safety',
      body: 'JetVina works with trusted operators and maintains strict safety review standards on every charter journey.',
    },
    {
      title: 'Industry Leader',
      body: 'With many satisfied clients, JetVina is a leading provider of premium private jet charter services.',
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

export function bookingProcessCmsJson(): string {
  return JSON.stringify(BOOKING_PROCESS_CMS_DEFAULT, null, 2);
}
