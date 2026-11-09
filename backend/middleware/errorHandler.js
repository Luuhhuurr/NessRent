const env = require('../config/env');

class ApiError extends Error {
  constructor(message, statusCode = 500, errors = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  next(new ApiError(`Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`, 404));
};

// MySQL error codes that map onto a meaningful HTTP status.
const SQL_ERROR_STATUS = {
  ER_DUP_ENTRY: 409,
  ER_NO_REFERENCED_ROW: 400,
  ER_ROW_IS_REFERENCED: 409,
  ER_BAD_NULL_ERROR: 400,
  ER_DATA_TOO_LONG: 400,
};

const isFieldErrorMap = (value) =>
  Boolean(value) &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.values(value).every((item) => typeof item === 'string');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  // A malformed JSON body is a client mistake, not a server failure.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Format body JSON tidak valid' });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `Upload gagal: ${err.message}` });
  }

  const statusCode =
    err.statusCode || SQL_ERROR_STATUS[err.code] || (err instanceof ApiError ? err.statusCode : 500);

  // Only messages we raised ourselves are safe to show. A raw driver error
  // carries table and column names, which is information we do not hand out.
  const isKnownError = err instanceof ApiError || statusCode < 500;
  const message = isKnownError
    ? err.message
    : 'Terjadi kesalahan pada server. Silakan coba lagi.';

  if (statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const body = { success: false, message };

  // Only a field -> message map produced by our own validators is safe to
  // return. Driver errors also carry an `errors` property, which would leak
  // connection details.
  if (isFieldErrorMap(err.errors)) {
    body.errors = err.errors;
  }

  if (!env.isProduction && statusCode >= 500) body.stack = err.stack;

  return res.status(statusCode).json(body);
};

module.exports = { errorHandler, notFound, ApiError };
