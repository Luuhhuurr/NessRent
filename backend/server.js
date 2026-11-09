const app = require('./app');
const env = require('./config/env');
const { validateEnv } = require('./config/validateEnv');
const { testConnection } = require('./config/database');

const start = async () => {
  validateEnv();

  const reachable = await testConnection();
  if (!reachable) {
    console.error('Tidak dapat terhubung ke database. Pastikan MySQL berjalan dan kredensial di backend/.env benar.');
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    console.log(`NesRent API berjalan di http://localhost:${env.port} (${env.nodeEnv})`);
  });

  server.on('error', (error) => {
    console.error('Gagal menjalankan server:', error.message);
    process.exit(1);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} diterima, menutup server...`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

start();
