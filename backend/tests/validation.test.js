const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validate,
  required,
  string,
  email,
  nim,
  oneOf,
  integer,
  positiveNumber,
  date,
  password,
} = require('../middleware/validate');

/**
 * Runs the middleware against a fake request and returns the error it
 * forwarded, or null when the payload was accepted.
 */
const runValidation = (rules, payload) => {
  let forwarded = null;
  const req = { body: payload, query: {}, params: {} };
  const res = { status: () => res, json: () => res };
  const next = (err) => {
    forwarded = err;
  };

  validate(rules)(req, res, next);
  return forwarded;
};

test('validate accepts a payload that satisfies every rule', () => {
  const error = runValidation(
    { body: { email: [required(), email()], password: [required(), password()] } },
    { email: 'mahasiswa@unes.ac.id', password: 'rahasia123' }
  );

  assert.ok(!error);
});

test('validate reports every failing field at once', () => {
  const error = runValidation(
    { body: { email: [required(), email()], nim: [required(), nim()] } },
    { email: 'bukan-email', nim: '123' }
  );

  assert.ok(error);
  assert.equal(error.statusCode, 422);
  assert.equal(error.errors.email, 'Format email tidak valid');
  assert.equal(error.errors.nim, 'NIM harus terdiri dari 8-12 digit angka');
});

test('validate rejects a missing required field', () => {
  const error = runValidation({ body: { name: [required()] } }, { name: '   ' });

  assert.ok(error);
  assert.equal(error.statusCode, 422);
  assert.ok(error.errors.name);
});

test('required only complains about blank values', () => {
  const rule = required('Wajib diisi');
  assert.equal(rule('ada'), null);
  assert.equal(rule(''), 'Wajib diisi');
  assert.equal(rule(undefined), 'Wajib diisi');
  assert.equal(rule(null), 'Wajib diisi');
});

test('string enforces the length boundaries', () => {
  const rule = string({ min: 3, max: 5, label: 'Nama' });
  assert.equal(rule('abc'), null);
  assert.equal(rule('ab'), 'Nama minimal 3 karakter');
  assert.equal(rule('abcdef'), 'Nama maksimal 5 karakter');
  assert.equal(rule(''), null);
});

test('oneOf only accepts the listed values', () => {
  const rule = oneOf(['pending', 'verified'], 'Status');
  assert.equal(rule('pending'), null);
  assert.equal(rule('archived'), 'Status: pending, verified');
});

test('integer rejects decimals and non numeric input', () => {
  const rule = integer();
  assert.equal(rule(5), null);
  assert.equal(rule('5'), null);
  assert.equal(rule('abc'), 'Nilai ini harus berupa angka bulat');
});

test('positiveNumber rejects zero and negatives', () => {
  const rule = positiveNumber();
  assert.equal(rule(10), null);
  assert.equal(rule(0), 'Nilai ini harus lebih besar dari nol');
  assert.equal(rule(-3), 'Nilai ini harus lebih besar dari nol');
});

test('date rejects unparsable values', () => {
  const rule = date();
  assert.equal(rule('2026-01-01'), null);
  assert.equal(rule('31-01-2026'), 'Format tanggal tidak valid');
});

test('password requires a minimum length, a letter and a digit', () => {
  const rule = password({ min: 8 });
  assert.equal(rule('rahasia123'), null);
  assert.equal(rule('pendek'), 'Password minimal 8 karakter');
  assert.equal(rule('rahasiaaja'), 'Password harus mengandung huruf dan angka');
  assert.equal(rule('12345678'), 'Password harus mengandung huruf dan angka');
});
