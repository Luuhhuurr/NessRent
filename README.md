# NesRent

**Platform sewa barang antar mahasiswa UNNES.**

NesRent adalah marketplace peer-to-peer untuk mahasiswa: menyewa kamera, motor, dan
peralatan camping dari fellow mahasiswa di sekitar kampus. Proyek ini dibangun sebagai
portfolio full-stack — code yang rapi, API yang konsisten, dan UI dark-mode yang
dirancang untuk dibaca sebagai produk, bukan tugas kuliah.

---

## Stack

| Bagian | Teknologi |
|---|---|
| Backend | Node.js 20+, Express 5, mysql2/promise, JWT, bcrypt, Multer |
| Database | MariaDB / MySQL (XAMPP), raw SQL — tanpa ORM |
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios |
| Test | `node:test` bawaan Node — tanpa dependency tambahan |

Tidak ada ORM, tidak ada state management library, tidak ada UI kit. Formatter
tanggal, mata uang, dan harga ada di satu tempat (`frontend/src/lib/format.js`),
validasi ditulis tangan (`backend/middleware/validate.js`), dan query SQL-nya
berada di repository layer.

---

## Menjalankan proyek

### Prasyarat

- Node.js 20 atau lebih baru
- MariaDB/MySQL yang berjalan (default XAMPP: port `3306`, user `root`, tanpa password)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # lalu sesuaikan DB_PASSWORD dan JWT_SECRET
```

Buat `JWT_SECRET` yang acak:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Buat database dan tabelnya:

```bash
mysql -u root < config/schema.sql   # database baru
npm run migrate                      # database yang sudah ada
```

Buat akun admin (password dibaca dari env atau argumen CLI, tidak pernah di-hardcode):

```bash
npm run seed -- --email=admin@nesrent.ac.id --password='password-kuat-anda'
npm run seed -- --with-demo          # opsional: isi data contoh
```

Jalankan server:

```bash
npm run dev        # nodemon, http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL dan VITE_ASSET_URL
npm run dev            # Vite, http://localhost:5173
```

### Perintah lain

| Perintah | Lokasi | Fungsi |
|---|---|---|
| `npm test` | `backend/`, `frontend/` | Menjalankan unit test (`node:test`) |
| `npm run lint` | `frontend/` | ESLint (termasuk aturan React Compiler) |
| `npm run build` | `frontend/` | Build produksi ke `dist/` |
| `npm run migrate` | `backend/` | Menjalankan migrasi SQL yang belum diterapkan |
| `npm run seed` | `backend/` | Membuat akun admin + data demo |

---

## Fitur

**Mahasiswa**

- Registrasi dengan NIM, login, dan profil akun.
- Katalog barang dengan pencarian, filter kategori, filter rentang harga, dan sorting.
- Detail barang: galeri foto, spesifikasi, kondisi, dan ketersediaan.
- Booking dengan rentang tanggal; total dihitung server-side (harga × jumlah hari).
- Riwayat transaksi dengan filter status dan detail pesanan.
- Menambah barang sendiri dengan foto dari file lokal.
- Lokasi penyerahan: daftar barang milik Anda yang sedang disewa.

**Admin**

- Dashboard: total barang, total transaksi, sebaran kategori, transaksi terbaru.
- Verifikasi / tolak akun mahasiswa.
- Blokir dan lepas blokir akun dengan alasan tercatat.
- Kelola seluruh transaksi dan ubah statusnya.
- Kelola seluruh barang di katalog.

---

## Struktur proyek

```
backend/
  app.js                 # wiring Express (middleware, route, error handler)
  server.js              # listen + graceful shutdown
  config/                # env, database pool, multer, schema.sql, migrations/
  middleware/            # auth, validate, asyncHandler, errorHandler
  repositories/          # lapisan SQL murni (users, products, bookings)
  controllers/           # validasi -> panggil repository -> kirim response
  routes/                # definisi endpoint
  scripts/               # migrate.js, seed.js
  tests/                 # unit test node:test

frontend/
  src/lib/               # api client, auth, format (harga/tanggal/status), config
  src/routes/            # RequireAuth, RequireAdmin
  src/services/          # pemanggilan API per domain
  src/components/        # komponen UI
  src/pages/             # halaman per route
  tests/                 # unit test format
```

### Kontrak response

Semua endpoint menjawab dengan amplop yang sama, sehingga frontend tidak pernah
menebak bentuk data:

```jsonc
// sukses
{ "success": true, "message": "...", "data": { "products": [], "pagination": {} } }

// gagal
{ "success": false, "message": "...", "errors": { "email": "Format email tidak valid" } }
```

Endpoint daftar selalu membungkus hasilnya (`data.products`, `data.bookings`,
`data.users`) dan endpoint tunggal mengembalikan `data` berisi objeknya.

### Aturan harga

Harga di database disimpan dalam **ribuan rupiah** (`60` = Rp 60.000). Satu-satunya
tempat nilai ini dikonversi adalah `frontend/src/lib/format.js` → `formatPrice()`,
yang mengalikan dengan 1000 tepat satu kali.

---

## API

Base URL: `http://localhost:5000/api`. Endpoint bertanda 🔒 membutuhkan token JWT
(`Authorization: Bearer <token>`), endpoint bertanda 🛡️ hanya untuk admin.

### Auth

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/register` | Registrasi (status akun awal: `pending`) |
| POST | `/auth/login` | Login, mengembalikan token + data pengguna |
| GET 🔒 | `/auth/profile` | Profil pengguna yang sedang login |

### Products

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/products` | Katalog + pagination (`page`, `limit`, `category`, `search`) |
| GET | `/products/:id` | Detail barang |
| POST 🔒 | `/products` | Tambah barang (multipart, field `image`) |
| PUT 🔒 | `/products/:id` | Ubah barang — pemilik atau admin |
| DELETE 🔒 | `/products/:id` | Hapus barang — pemilik atau admin |

### Bookings

| Method | Endpoint | Keterangan |
|---|---|---|
| POST 🔒 | `/bookings` | Buat pesanan (total dihitung server) |
| GET 🔒 | `/bookings` | Pesanan milik pengguna yang login |
| GET 🔒 | `/bookings/:id` | Detail pesanan — penyewa, penjual, atau admin |
| PATCH 🔒 | `/bookings/:id/cancel` | Batalkan pesanan (penyewa, status `pending`) |
| PATCH 🛡️ | `/bookings/:id/status` | Ubah status pesanan |
| DELETE 🔒 | `/bookings/:id` | Hapus pesanan (penjual atau admin) |
| GET 🔒 | `/bookings/penyerahan` | Barang milik saya yang sedang disewa |
| GET 🛡️ | `/bookings/all` | Semua transaksi |

### Users (admin)

| Method | Endpoint | Keterangan |
|---|---|---|
| GET 🛡️ | `/users` | Daftar pengguna + pagination |
| GET 🛡️ | `/users/blacklist` | Pengguna yang diblokir |
| GET 🛡️ | `/users/:id` | Detail pengguna |
| PATCH 🛡️ | `/users/:id/verify` | Verifikasi akun |
| PATCH 🛡️ | `/users/:id/reject` | Tolak akun |
| POST 🛡️ | `/users/:id/blacklist` | Blokir akun (dengan alasan) |
| DELETE 🛡️ | `/users/:id/blacklist` | Lepas blokir |

### Admin

| Method | Endpoint | Keterangan |
|---|---|---|
| GET 🛡️ | `/admin/stats` | Ringkasan dashboard |
| GET 🛡️ | `/admin/categories` | Sebaran kategori |
| GET 🛡️ | `/admin/recent-bookings` | Transaksi terbaru |

### Upload

| Method | Endpoint | Keterangan |
|---|---|---|
| POST 🔒 | `/upload` | Satu gambar produk (jpg/png/webp, ≤ 5MB) |
| POST 🔒 | `/upload/multiple` | Maksimal 5 gambar |
| POST 🔒 | `/upload/identity` | Dokumen identitas (disimpan di folder privat) |
| GET 🔒 | `/upload/identity/:userId` | Unduh dokumen identitas (admin) |

---

## Catatan keamanan

Bagian ini menjelaskan keputusan yang sudah diambil di dalam kode.

- **Tidak ada backdoor admin.** Akun admin dibuat oleh `npm run seed` dan passwordnya
  di-hash dengan bcrypt. Nilai admin tidak pernah ada di dalam source code.
- **Token selalu dicek ulang ke database.** `authenticate` membaca ulang baris
  pengguna pada setiap request, jadi akun yang baru saja diblokir atau diturunkan
  perannya langsung kehilangan akses, bukan menunggu tokennya kedaluwarsa.
- **Setiap resource punya pemeriksaan kepemilikan.** Product hanya bisa diubah oleh
  pemiliknya atau admin; booking hanya bisa dibaca oleh penyewa, penjual, atau admin.
- **Total harga dihitung di server.** Nilai `total_price` yang dikirim klien diabaikan
  dan dihitung ulang dari harga produk dan jumlah hari.
- **Upload identitas tidak dilayani secara statis.** Hanya `uploads/products` yang
  dilayani lewat URL publik; dokumen identitas memerlukan token admin.
- **Validasi input berlapis.** Validator tulisan tangan menolak payload yang tidak
  valid dengan 422 dan daftar error per field, dan error SQL mentah tidak pernah
  sampai ke klien.
- **Pagination dibatasi.** `limit` dikunci di rentang 1–100 agar satu request tidak
  bisa mengubahnya menjadi pemindaian tabel penuh.

### Yang perlu dikerjakan Anda

- **Ganti `JWT_SECRET`.** Nilai yang pernah ada di riwayat git sudah publik — putuskan
  riwayat tersebut atau rotasi secret-nya, idealnya keduanya.
- **Ganti password admin hasil seed.** Password development tidak boleh dipakai di
  lingkungan nyata.
- **`.env` tidak lagi di-track** (sudah masuk `.gitignore`), tapi file lama masih ada
  di commit pertama. Menghapus riwayat perlu `git filter-repo` atau menulis ulang
  riwayat — belum dilakukan di sini.

---

## Pengujian

```bash
cd backend  && npm test    # 28 test: helper, pagination, validasi, auth, envelope
cd frontend && npm test    # 12 test: format harga, tanggal, status, URL gambar
cd frontend && npm run lint && npm run build
```

Test memakai `node:test` bawaan Node, tanpa framework tambahan. Cakupannya sengaja
dipilih pada bagian yang rawan rusak: aturan konversi harga, batas pagination,
perilaku validator, dan penjagaan role di middleware.
