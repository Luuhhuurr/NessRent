const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { pool } = require('../config/database');
const { ApiError } = require('./errorHandler');

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch {
    return null;
  }
};

/**
 * Verifies the bearer token and then re-reads the user from the database.
 *
 * Re-reading matters: a token stays valid for days, so trusting the role
 * baked into it would let a demoted or blacklisted user keep their old
 * privileges until it expires.
 */
const authenticate = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next(new ApiError('Anda harus masuk terlebih dahulu', 401));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return next(new ApiError('Token tidak valid atau sudah kedaluwarsa', 401));
  }

  const [rows] = await pool.query(
    'SELECT id, name, email, nim, faculty, role, status FROM users WHERE id = ?',
    [payload.id]
  );

  const user = rows[0];
  if (!user) {
    return next(new ApiError('Pengguna tidak ditemukan', 401));
  }

  if (user.status === 'blacklist') {
    return next(new ApiError('Akun Anda telah diblokir', 403));
  }

  req.user = user;
  return next();
};

/**
 * Requires the authenticated user to hold one of the given roles.
 * Must always be mounted after `authenticate`.
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError('Anda harus masuk terlebih dahulu', 401));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError('Akses ditolak. Memerlukan hak admin.', 403));
  }
  return next();
};

/**
 * Attaches the user when a valid token is present, but never rejects the
 * request. Used by endpoints that are public but behave differently for
 * signed-in visitors.
 */
const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  const payload = verifyToken(token);
  if (!payload) return next();

  const [rows] = await pool.query(
    'SELECT id, name, email, nim, faculty, role, status FROM users WHERE id = ?',
    [payload.id]
  );

  if (rows[0] && rows[0].status !== 'blacklist') {
    req.user = rows[0];
  }
  return next();
};

module.exports = { authenticate, requireRole, optionalAuth };
