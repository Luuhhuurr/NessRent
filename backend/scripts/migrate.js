/**
 * Applies the SQL files in config/migrations/ that have not been applied yet.
 *
 * Each file is recorded in a `migrations` table, so running the script twice
 * is safe — already-applied files are skipped.
 *
 * Usage: npm run migrate
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../config/env');

const migrationsDir = path.join(__dirname, '..', 'config', 'migrations');

/**
 * Removes whole-line `--` comments. They have to go before splitting, or a
 * statement that is preceded by a comment would be mistaken for a
 * comment-only chunk and skipped.
 */
const stripComments = (sql) => sql.replace(/^\s*--.*$/gm, '');

const splitStatements = (sql) =>
  stripComments(sql)
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

const main = async () => {
  const connection = await mysql.createConnection({
    ...env.db,
    multipleStatements: true,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`migrations\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`filename\` varchar(255) NOT NULL,
        \`applied_at\` timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uq_migrations_filename\` (\`filename\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const [appliedRows] = await connection.query('SELECT filename FROM `migrations`');
    const applied = new Set(appliedRows.map((row) => row.filename));

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('Tidak ada berkas migrasi untuk dijalankan.');
      return;
    }

    for (const filename of files) {
      if (applied.has(filename)) {
        console.log(`- ${filename} (sudah diterapkan)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, filename), 'utf8');

      for (const statement of splitStatements(sql)) {
        await connection.query(statement);
      }

      await connection.query('INSERT INTO `migrations` (filename) VALUES (?)', [filename]);
      console.log(`✓ ${filename} berhasil diterapkan`);
    }

    console.log('\nSemua migrasi selesai.');
  } catch (error) {
    console.error('Migrasi gagal:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
};

main();
