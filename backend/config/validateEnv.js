const env = require('./env');

/**
 * Refuses to start the server with a missing or example JWT secret.
 *
 * This lives outside config/env.js so that the migration and seed scripts —
 * which only need the database — can run without one.
 */
const validateEnv = () => {
  if (env.hasPlaceholderSecret()) {
    throw new Error(
      'JWT_SECRET is missing or still set to the example placeholder.\n' +
        'Set a real value in backend/.env, for example:\n' +
        '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
    );
  }
};

module.exports = { validateEnv };
