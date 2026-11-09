/**
 * Authorization smoke test.
 *
 * Starts from a running API (`npm run dev`) and a seeded admin account
 * (`npm run seed`), then walks through the matrix that matters for a
 * marketplace with two kinds of actors: a renter and a seller. It creates
 * its own throwaway accounts, checks every rule, and removes what it made.
 *
 *   npm run smoke
 *
 * The credentials come from the environment (ADMIN_EMAIL / ADMIN_PASSWORD in
 * backend/.env). They are never printed.
 */
const { pool } = require('../config/database');
const env = require('../config/env');
const fs = require('fs');
const path = require('path');
const { identitiesDir } = require('../config/multer');

const BASE_URL = `http://localhost:${env.port}/api`;
const stamp = `${Date.now()}`.slice(-8);

const renter = { name: 'Smoke Renter', email: `smoke-renter-${stamp}@nesrent.test`, nim: `90${stamp}01` };
const seller = { name: 'Smoke Seller', email: `smoke-seller-${stamp}@nesrent.test`, nim: `90${stamp}02` };
const stranger = { name: 'Smoke Stranger', email: `smoke-stranger-${stamp}@nesrent.test`, nim: `90${stamp}03` };
const PASSWORD = 'SmokeTest2026!';

const created = { productIds: [], bookingIds: [], userIds: [], files: [] };

const request = async (path, { method = 'GET', token, body, form } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: form ?? (body ? JSON.stringify(body) : undefined),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { status: response.status, body: payload };
};

const results = [];

const check = (name, expected, actual) => {
  const passed = expected === actual;
  results.push({ name, expected, actual, passed });
  const mark = passed ? '[32m✓[0m' : '[31m✗[0m';
  console.log(`${mark} ${name} — diharapkan ${expected}, dapat ${actual}`);
};

const register = async (account) => {
  const response = await request('/auth/register', {
    method: 'POST',
    body: { ...account, password: PASSWORD },
  });

  if (response.status !== 201) {
    throw new Error(`Gagal membuat akun uji: HTTP ${response.status}`);
  }

  created.userIds.push(response.body.data.user.id);
  return response.body.data.token;
};

const login = async (email, password) => {
  const response = await request('/auth/login', { method: 'POST', body: { email, password } });
  if (response.status !== 200) {
    throw new Error(`Login gagal: HTTP ${response.status}`);
  }
  return response.body.data.token;
};

const cleanup = async () => {
  for (const filename of created.files) {
    fs.rmSync(path.join(identitiesDir, filename), { force: true });
  }
  if (created.bookingIds.length > 0) {
    await pool.query('DELETE FROM bookings WHERE id IN (?)', [created.bookingIds]);
  }
  if (created.productIds.length > 0) {
    await pool.query('DELETE FROM products WHERE id IN (?)', [created.productIds]);
  }
  if (created.userIds.length > 0) {
    await pool.query('DELETE FROM users WHERE id IN (?)', [created.userIds]);
  }
};

const main = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error(
      'ADMIN_EMAIL dan ADMIN_PASSWORD belum diisi.\n' +
        'Isi keduanya di backend/.env lalu jalankan `npm run seed`.'
    );
    process.exit(1);
  }

  const adminToken = await login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  const renterToken = await register(renter);
  const sellerToken = await register(seller);
  const strangerToken = await register(stranger);

  // --- setup: a product owned by the seller -------------------------------
  const createdProduct = await request('/products', {
    method: 'POST',
    token: sellerToken,
    body: {
      product_name: `Produk Uji ${stamp}`,
      price: 70,
      category: 'Elektronik',
      description: 'Barang yang dibuat oleh smoke test.',
    },
  });
  const productId = createdProduct.body?.data?.id;
  created.productIds.push(productId);
  check('Seller membuat barang', 201, createdProduct.status);

  // --- setup: the renter books that product ------------------------------
  const createdBooking = await request('/bookings', {
    method: 'POST',
    token: renterToken,
    body: {
      product_id: productId,
      booking_date: '2026-02-01',
      end_date: '2026-02-04',
      notes: 'Titik uji',
      total_price: 1, // the client tries to dictate the price
    },
  });
  const bookingId = createdBooking.body?.data?.id;
  created.bookingIds.push(bookingId);
  check('Penyewa membuat pesanan', 201, createdBooking.status);

  const expectedTotal = 70 * 3;
  check(
    'Total harga dihitung server, bukan dari klien',
    expectedTotal,
    Number(createdBooking.body?.data?.total_price)
  );

  // --- authorization matrix ----------------------------------------------
  check('Admin membaca daftar pengguna', 200, (await request('/users', { token: adminToken })).status);
  check('Anonim ditolak dari daftar pengguna', 401, (await request('/users')).status);
  check('User biasa ditolak dari statistik admin', 403, (await request('/admin/stats', { token: renterToken })).status);

  check(
    'Penyewa lain tidak bisa membaca pesanan orang',
    403,
    (await request(`/bookings/${bookingId}`, { token: strangerToken })).status
  );
  check(
    'Pemilik barang boleh membaca pesanan atas barangnya',
    200,
    (await request(`/bookings/${bookingId}`, { token: sellerToken })).status
  );
  check(
    'Admin boleh membaca pesanan mana pun',
    200,
    (await request(`/bookings/${bookingId}`, { token: adminToken })).status
  );

  check(
    'User biasa tidak bisa mengubah barang milik orang lain',
    403,
    (
      await request(`/products/${productId}`, {
        method: 'PUT',
        token: renterToken,
        body: { product_name: 'Dibajak' },
      })
    ).status
  );
  check(
    'User biasa tidak bisa menghapus barang milik orang lain',
    403,
    (await request(`/products/${productId}`, { method: 'DELETE', token: renterToken })).status
  );
  check(
    'Pemilik barang boleh mengubah barangnya sendiri',
    200,
    (
      await request(`/products/${productId}`, {
        method: 'PUT',
        token: sellerToken,
        body: { product_name: `Produk Uji ${stamp} (diperbarui)` },
      })
    ).status
  );

  check(
    'User biasa tidak bisa mengubah status pesanan',
    403,
    (
      await request(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        token: renterToken,
        body: { status: 'approved' },
      })
    ).status
  );
  check(
    'Admin boleh mengubah status pesanan',
    200,
    (
      await request(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        token: adminToken,
        body: { status: 'approved' },
      })
    ).status
  );

  check(
    'Orang ketiga tidak bisa membatalkan pesanan orang lain',
    403,
    (await request(`/bookings/${bookingId}/cancel`, { method: 'PATCH', token: strangerToken })).status
  );

  // --- identity upload ----------------------------------------------------
  const form = new FormData();
  form.append('identity', new Blob([Buffer.from('smoke')], { type: 'image/png' }), 'smoke.png');
  const upload = await request('/upload/identity', { method: 'POST', token: renterToken, form });
  check('Dokumen identitas milik pengirim', 200, upload.status);
  if (upload.body?.data?.filename) created.files.push(upload.body.data.filename);

  const [ownerRows] = await pool.query(
    'SELECT identity_document FROM users WHERE id IN (?, ?) ORDER BY id',
    [created.userIds[0], created.userIds[1]]
  );
  check('Dokumen identitas tersimpan atas nama pengirim', true, Boolean(ownerRows[0]?.identity_document));
  check('Dokumen identitas tidak menimpa milik orang lain', false, Boolean(ownerRows[1]?.identity_document));

  // --- removed debug surface ----------------------------------------------
  const debugFiles = await fetch(`http://localhost:${env.port}/debug/files`);
  check('Rute debug /debug/files dihapus', 404, debugFiles.status);

  // --- envelope ------------------------------------------------------------
  const catalogue = await request('/products');
  check('Amplop respons konsisten', true, catalogue.body?.success === true && Array.isArray(catalogue.body?.data?.products));

  await cleanup();

  const failed = results.filter((result) => !result.passed);
  console.log(`\n${results.length - failed.length}/${results.length} pemeriksaan lolos.`);

  if (failed.length > 0) {
    console.error('Pemeriksaan yang gagal:');
    for (const item of failed) {
      console.error(`  - ${item.name} (diharapkan ${item.expected}, dapat ${item.actual})`);
    }
  }

  await pool.end();
  process.exit(failed.length === 0 ? 0 : 1);
};

main().catch(async (error) => {
  console.error('Smoke test gagal:', error.message);
  await cleanup().catch(() => {});
  await pool.end();
  process.exit(1);
});
