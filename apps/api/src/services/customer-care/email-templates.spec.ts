import { renderEmailTemplate } from './email-templates';

describe('email-templates quote/order campaigns', () => {
  it('renders quote_offered with price and aircraft', () => {
    const t = renderEmailTemplate('quote_offered', 'en', {
      requestId: 99,
      firstName: 'Alex',
      price: 12500,
      currency: 'USD',
      aircraft: 'Citation XLS',
    });
    expect(t.subject).toMatch(/#99/);
    expect(t.text).toMatch(/Citation XLS/);
    expect(t.text).toMatch(/12500/);
    expect(t.html).toContain('View My Quotes');
  });

  it('renders booking_cancelled', () => {
    const t = renderEmailTemplate('booking_cancelled', 'en', {
      bookingId: 7,
      firstName: 'Alex',
    });
    expect(t.subject).toMatch(/#7/);
    expect(t.text.toLowerCase()).toMatch(/cancel/);
  });
});
