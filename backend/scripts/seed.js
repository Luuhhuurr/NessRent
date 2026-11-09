/**
 * Creates the admin account and, optionally, a set of demo products so a
 * fresh clone has something to show.
 *
 * The admin password is never hardcoded — it comes from the environment or
 * from a command line argument:
 *
 *   ADMIN_EMAIL=admin@nesrent.ac.id ADMIN_PASSWORD='...' npm run seed
 *   npm run seed -- --email=admin@nesrent.ac.id --password='...'
 *
 * Usage: npm run seed [-- --with-demo]
 */
const bcrypt = require('bcryptjs');
const { pool, testConnection } = require('../config/database');

const args = process.argv.slice(2);
const flag = (name) => {
  const match = args.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.split('=').slice(1).join('=') : undefined;
};
const hasFlag = (name) => args.includes(`--${name}`);

const ADMIN_EMAIL = flag('email') || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = flag('password') || process.env.ADMIN_PASSWORD;
const ADMIN_NAME = flag('name') || process.env.ADMIN_NAME || 'Admin NesRent';
const ADMIN_NIM = flag('nim') || process.env.ADMIN_NIM || '2404130000';

const DEMO_PRODUCTS = [
  {
    product_name: 'Kamera Canon EOS M50',
    description: 'Kamera mirrorless ringan dengan lens 15-45mm. Cocok untuk tugas dokumentasi dan tugas akhir.',
    category: 'Elektronik',
    condition: 'Baik',
    price: 50,
  },
  {
    product_name: 'Honda CB150R',
    description: 'Motor sport 150cc,irit dan nyaman untuk perjalanan campus. Helm dan jas-love tersedia terpisah.',
    category: 'Kendaraan',
    condition: 'Baik',
    price: 120,
  },
  {
    product_name: 'Tenda Camping 4 Orang',
    description: 'Set tenda lengkap dengan alas, paku, dan matras. Cocok untuk acara outdoor mahasiswa.',
    category: 'Alat Camping',
    condition: 'Baik',
    price: 35,
  },
  {
    product_name: 'Tas Ransel Zara 25L',
    description: 'Ransel unisex kapasitas 25 liter, kondisi seperti baru. Cocok untuk kuliah atau kerja lapangan.',
    category: 'Fashion',
    condition: 'Baik',
    price: 20,
  },
];

const seedAdmin = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      'Email dan password admin wajib diisi.\n' +
        '  ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed\n' +
        '  atau\n' +
        '  npm run seed -- --email=... --password=...'
    );
    process.exit(1);
  }

  if (ADMIN_PASSWORD.length < 8) {
    console.error('Password admin minimal 8 karakter.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const [existing] = await pool.query('SELECT id, email, nim, role FROM users WHERE email = ?', [
    ADMIN_EMAIL,
  ]);

  if (existing.length > 0) {
    await pool.query(
      'UPDATE users SET name = ?, password = ?, role = ?, status = ? WHERE id = ?',
      [ADMIN_NAME, passwordHash, 'admin', 'verified', existing[0].id]
    );
    console.log(`✓ Akun admin diperbarui: ${ADMIN_EMAIL}`);
    return;
  }

  // The NIM is unique too. Refuse to continue rather than risk overwriting
  // somebody else's account if it is already taken.
  const [nimOwner] = await pool.query('SELECT id, email FROM users WHERE nim = ?', [ADMIN_NIM]);
  if (nimOwner.length > 0) {
    console.error(
      `NIM ${ADMIN_NIM} sudah dipakai oleh ${nimOwner[0].email}. ` +
        'Berikan NIM lain lewat --nim=<nim> atau env ADMIN_NIM.'
    );
    process.exit(1);
  }

  await pool.query(
    `INSERT INTO users (name, email, password, nim, role, status)
     VALUES (?, ?, ?, ?, 'admin', 'verified')`,
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash, ADMIN_NIM]
  );

  console.log(`✓ Akun admin dibuat: ${ADMIN_EMAIL}`);
};

const seedDemoProducts = async () => {
  const [existing] = await pool.query('SELECT COUNT(*) as count FROM products');
  if (existing[0].count > 0) {
    console.log('• Produk sudah ada, melewati seeding demo.');
    return;
  }

  const [admins] = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  const ownerId = admins[0]?.id ?? null;

  for (const product of DEMO_PRODUCTS) {
    await pool.query(
      `INSERT INTO products (owner_id, product_name, description, category, \`condition\`, price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ownerId, product.product_name, product.description, product.category, product.condition, product.price]
    );
  }

  console.log(`✓ ${DEMO_PRODUCTS.length} produk demo ditambahkan.`);
};

const main = async () => {
  const reachable = await testConnection();
  if (!reachable) {
    process.exit(1);
  }

  await seedAdmin();

  if (hasFlag('with-demo')) {
    await seedDemoProducts();
  }

  console.log('\nSeeding selesai.');
  await pool.end();
};

main().catch(async (error) => {
  console.error('Seeding gagal:', error.message);
  await pool.end();
  process.exit(1);
});
