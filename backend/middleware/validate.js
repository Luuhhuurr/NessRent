const { ApiError } = require('./errorHandler');

/**
 * A validator is a function that receives a value and returns an error
 * message string, or null when the value is acceptable. Keeping them plain
 * functions means they can be unit tested without any HTTP plumbing.
 */

const isBlank = (value) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

const required = (label = 'Nilai ini wajib diisi') => (value) =>
  isBlank(value) ? label : null;

const string = ({ min = 0, max = 255, label = 'Nilai ini tidak valid' } = {}) => (value) => {
  if (isBlank(value)) return null;
  const text = String(value);
  if (text.length < min) return `${label} minimal ${min} karakter`;
  if (text.length > max) return `${label} maksimal ${max} karakter`;
  return null;
};

const email = () => (value) => {
  if (isBlank(value)) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) ? null : 'Format email tidak valid';
};

const nim = () => (value) => {
  if (isBlank(value)) return null;
  return /^\d{8,12}$/.test(String(value)) ? null : 'NIM harus terdiri dari 8-12 digit angka';
};

const oneOf = (allowed, label = 'Nilai ini tidak valid') => (value) => {
  if (isBlank(value)) return null;
  return allowed.includes(value) ? null : `${label}: ${allowed.join(', ')}`;
};

const integer = (label = 'Nilai ini harus berupa angka bulat') => (value) => {
  if (isBlank(value)) return null;
  return Number.isInteger(Number(value)) ? null : label;
};

const positiveNumber = (label = 'Nilai ini harus lebih besar dari nol') => (value) => {
  if (isBlank(value)) return null;
  return Number(value) > 0 ? null : label;
};

const date = (label = 'Format tanggal tidak valid') => (value) => {
  if (isBlank(value)) return null;
  return !Number.isNaN(Date.parse(value)) ? null : label;
};

const password = ({ min = 8 } = {}) => (value) => {
  if (isBlank(value)) return 'Password wajib diisi';
  const text = String(value);
  if (text.length < min) return `Password minimal ${min} karakter`;
  if (!/[A-Za-z]/.test(text) || !/\d/.test(text)) {
    return 'Password harus mengandung huruf dan angka';
  }
  return null;
};

/**
 * Runs the rules for one request section and collects every failure, so the
 * client sees all of its mistakes in one round trip instead of one at a time.
 */
const runRules = (rules, payload, section) => {
  const errors = {};

  for (const [field, validators] of Object.entries(rules)) {
    const value = payload ? payload[field] : undefined;
    for (const rule of validators) {
      const message = rule(value, { field, section });
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }

  return errors;
};

/**
 * Usage:
 *   router.post('/', validate({ body: { email: [required(), email()] } }), handler)
 */
const validate = ({ body, query, params } = {}) => (req, res, next) => {
  const errors = {
    ...(body ? runRules(body, req.body, 'body') : {}),
    ...(query ? runRules(query, req.query, 'query') : {}),
    ...(params ? runRules(params, req.params, 'params') : {}),
  };

  if (Object.keys(errors).length > 0) {
    return next(new ApiError('Data yang dikirim tidak valid', 422, errors));
  }

  return next();
};

module.exports = {
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
};
