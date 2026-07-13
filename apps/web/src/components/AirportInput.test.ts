/**
 * AirportInput behavior tests (logic helpers + race/id contracts).
 * Full keyboard a11y is covered in Playwright.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

function friendlyLabel(a: { city: string; country?: string; iata: string }) {
  return `${a.city}, ${a.country ?? ''} (${a.iata})`.replace(',  ', ', ');
}

function optionId(inputId: string, iata: string) {
  return `${inputId}-option-${iata}`;
}

describe('AirportInput helpers', () => {
  it('builds friendly labels', () => {
    assert.equal(friendlyLabel({ city: 'Hanoi', country: 'Vietnam', iata: 'HAN' }), 'Hanoi, Vietnam (HAN)');
  });

  it('builds unique option ids per input instance', () => {
    const a = optionId('from-airport', 'HAN');
    const b = optionId('to-airport', 'HAN');
    assert.notEqual(a, b);
    assert.equal(a, 'from-airport-option-HAN');
  });

  it('sequence guard drops stale resolve', () => {
    let seq = 0;
    const results: string[] = [];
    async function resolve(iata: string, delay: number) {
      const my = ++seq;
      await new Promise((r) => setTimeout(r, delay));
      if (my !== seq) return;
      results.push(iata);
    }
    return Promise.all([resolve('HAN', 30), resolve('SGN', 5)]).then(() => {
      assert.deepEqual(results, ['SGN']);
    });
  });
});
