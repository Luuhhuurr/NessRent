const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateDays,
  calculateTotalPrice,
  validateEmail,
  validateNIM,
  formatCurrency,
} = require('../utils/helpers');

test('calculateDays counts whole days between two dates', () => {
  assert.equal(calculateDays('2026-01-01', '2026-01-04'), 3);
  assert.equal(calculateDays('2026-01-01', '2026-01-02'), 1);
});

test('calculateDays treats a same-day rental as one day', () => {
  assert.equal(calculateDays('2026-01-01', '2026-01-01'), 1);
});

test('calculateDays falls back to one day for unparsable input', () => {
  assert.equal(calculateDays('not-a-date', 'also-not-a-date'), 1);
  assert.equal(calculateDays(undefined, undefined), 1);
});

test('calculateDays is direction independent', () => {
  assert.equal(calculateDays('2026-01-04', '2026-01-01'), 3);
});

test('calculateTotalPrice multiplies the daily rate by the number of days', () => {
  assert.equal(calculateTotalPrice(70, '2026-01-01', '2026-01-04'), 210);
  assert.equal(calculateTotalPrice('60', '2026-01-01', '2026-01-03'), 120);
});

test('validateEmail accepts a normal address and rejects the rest', () => {
  assert.equal(validateEmail('mahasiswa@unes.ac.id'), true);
  assert.equal(validateEmail('no-at-sign'), false);
  assert.equal(validateEmail('missing@tld'), false);
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail(undefined), false);
});

test('validateNIM accepts 8-12 digits only', () => {
  assert.equal(validateNIM('34201234'), true);
  assert.equal(validateNIM('123456789012'), true);
  assert.equal(validateNIM('1234567'), false);
  assert.equal(validateNIM('3420123a'), false);
  assert.equal(validateNIM(''), false);
});

test('formatCurrency renders rupiah without decimals', () => {
  const formatted = formatCurrency(60000);
  assert.match(formatted, /60\.000/);
  assert.ok(formatted.includes('Rp'));
});
