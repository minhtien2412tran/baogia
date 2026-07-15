import { renderEmailTemplate } from './email-templates';

import { renderQuoteSalesEmail } from './ops-email-templates';

describe('email-templates quote/order campaigns', () => {
  it('renders modern Vietnamese sales quote HTML', () => {
    const m = renderQuoteSalesEmail({
      locale: 'vi',
      quoteId: 44,
      name: 'Nguyen Van A',
      email: 'a@example.com',
      phone: '+84931098308',
      tripSummary: 'SGN→MEX',
      message: 'Midsize Jet',
    });
    expect(m.subject).toMatch(/#44/);
    expect(m.html).toContain('JETVINA');
    expect(m.html).toContain('Yêu cầu báo giá mới');
    expect(m.html).toContain('SGN→MEX');
    expect(m.html).toContain('c9a962');
  });

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
    expect(t.html).toContain('Citation XLS');
    expect(t.html).toContain('JETVINA');
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
