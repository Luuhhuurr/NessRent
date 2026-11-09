const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PLACEHOLDER_MARKERS = ['change-in-production', 'your-super-secret', 'changeme', 'replace-with'];

const isPlaceholder = (value) =>
  !value || PLACEHOLDER_MARKERS.some((marker) => value.toLowerCase().includes(marker));

const toList = (value, fallback) =>
  (value || fallback)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 5000,

  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  hasPlaceholderSecret: () => isPlaceholder(process.env.JWT_SECRET),

  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'myapp_db',
  },

  cors: {
    origins: toList(
      process.env.CLIENT_ORIGIN,
      'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173'
    ),
  },

  upload: {
    dir: path.join(__dirname, '..', 'uploads'),
    maxFileSizeBytes: 5 * 1024 * 1024,
  },
};
