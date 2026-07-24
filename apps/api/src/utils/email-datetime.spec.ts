import {
  formatEmailDateTime,
  formatEmailItinerary,
  formatEmailLegLine,
} from './email-datetime';

describe('email-datetime', () => {
  const at = new Date('2026-07-24T07:30:00.000Z'); // 14:30 ICT

  it('formats full local datetime with timezone (not truncated ISO)', () => {
    const s = formatEmailDateTime(at, { timeZone: 'Asia/Ho_Chi_Minh', locale: 'en' });
    expect(s).toMatch(/24/);
    expect(s).toMatch(/2026/);
    expect(s).toMatch(/14:30/);
    expect(s).toContain('Asia/Ho_Chi_Minh');
    expect(s).not.toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  it('formats Vietnamese weekday/month', () => {
    const s = formatEmailDateTime(at, { timeZone: 'Asia/Ho_Chi_Minh', locale: 'vi' });
    expect(s.toLowerCase()).toMatch(/tháng|thứ/);
    expect(s).toContain('Asia/Ho_Chi_Minh');
  });

  it('builds leg line with cities and local time', () => {
    const line = formatEmailLegLine(
      {
        departureLocalAt: at,
        fromAirport: { iata: 'SGN', city: 'Ho Chi Minh City', timezone: 'Asia/Ho_Chi_Minh' },
        toAirport: { iata: 'HAN', city: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh' },
      },
      'en',
    );
    expect(line).toContain('SGN');
    expect(line).toContain('HAN');
    expect(line).toContain('Ho Chi Minh City');
    expect(line).toContain('14:30');
  });

  it('formats multi-leg itinerary', () => {
    const { itinerary, departureDateTime, departureTimezone } = formatEmailItinerary(
      [
        {
          departureLocalAt: at,
          fromAirport: { iata: 'SGN', city: 'HCMC', timezone: 'Asia/Ho_Chi_Minh' },
          toAirport: { iata: 'HAN', city: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh' },
        },
        {
          departureLocalAt: new Date('2026-07-25T02:00:00.000Z'),
          fromAirport: { iata: 'HAN', city: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh' },
          toAirport: { iata: 'SGN', city: 'HCMC', timezone: 'Asia/Ho_Chi_Minh' },
        },
      ],
      'en',
    );
    expect(itinerary).toContain('Leg 1:');
    expect(itinerary).toContain('Leg 2:');
    expect(departureDateTime).toContain('14:30');
    expect(departureTimezone).toBe('Asia/Ho_Chi_Minh');
  });

  it('handles missing date explicitly', () => {
    expect(formatEmailDateTime(null)).toMatch(/Not specified|Chưa xác định/);
  });
});
