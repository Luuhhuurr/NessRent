# PROJECT FLOW

Dokumen ini menjelaskan alur aplikasi NesRent dari sisi pengguna (frontend) dan
dari sisi API (backend). Routing, endpoint, dan aturan bisnis di sini mengikuti
kode yang benar-benar ada di repository ini.

---

## 1. Tumpukan teknologi

| Bagian | Teknologi |
|---|---|
| Backend | Node.js 20+, Express 5, mysql2/promise, JWT, bcryptjs, Multer |
| Database | MariaDB / MySQL, raw SQL, repository layer |
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios |

Server API berjalan di `http://localhost:5000`, aplikasi web di
`http://localhost:5173`. Keduanya dihubungkan lewat `VITE_API_URL`.

---

## 2. Basis data

Empat tabel, didefinisikan di `backend/config/schema.sql`:

| Tabel | Isi | Relasi |
|---|---|---|
| `users` | Akun mahasiswa dan admin | — |
| `products` | Barang yang disewakan, harga per hari | `owner_id → users.id` |
| `bookings` | Pesanan sewa | `user_id` = penyewa, `owner_id` = penjual, `product_id → products.id` |
| `blacklist` | Riwayat akun yang diblokir | `user_id → users.id`, `added_by → users.id` |

Status akun: `pending` → `verified` / `rejected` / `blacklist`.
Status barang: `available` / `unavailable` / `rented`.
Status pesanan: `pending` → `confirmed` → `approved` → `completed`, dengan
cabang `rejected` dan `cancelled`.

> **Harga disimpan dalam ribuan rupiah.** `products.price = 60` berarti Rp 60.000.
> Konversi ke rupiah hanya terjadi di satu tempat: `frontend/src/lib/format.js`
> → `formatPrice()`.

---

## 3. Halaman frontend

Semua halaman dilindungi oleh `RequireAuth` / `RequireAdmin`
(`frontend/src/routes/`), yang membaca token dari `localStorage` dan mengarahkan
pengguna yang belum login ke `/login`.

### Publik

| Route | Halaman | Isi |
|---|---|---|
| `/` | `Landing` | Hero, cara kerja, barang populer, CTA |
| `/products` | `ProductListing` | Katalog + pencarian + filter kategori & harga |
| `/products/:id` | `ProductDetail` | Galeri, spesifikasi, form booking |
| `/booking` | `Booking` | Form rentang tanggal dan lokasi pengambilan |
| `/booking-success` | `BookingSuccess` | Ringkasan pesanan + syarat & ketentuan |
| `/login` | `Login` | Form masuk |
| `/register` | `Register` | Form pendaftaran |
| `/register-success` | `RegisterSuccess` | Konfirmasi pendaftaran menunggu verifikasi |
| `*` | `NotFound` | 404 |

### Mahasiswa (perlu login)

| Route | Halaman | Isi |
|---|---|---|
| `/dashboard` | `Dashboard` | Ringkasan transaksi, barang untuk disewa |
| `/history` | `TransactionHistory` | Riwayat pesanan + filter status |
| `/transactions/:id` | `TransactionDetail` | Detail satu transaksi |
| `/dashboard/penyerahan` | `LokasiPenyerahan` | Barang milik saya yang sedang disewa |
| `/user/add-product` | `AddProduct` | Tambah barang baru |
| `/profile` | `Profile` | Data akun |
| `/logout` | `Logout` | Menghapus sesi dan kembali ke beranda |

### Admin

| Route | Halaman | Isi |
|---|---|---|
| `/admin` | `AdminDashboard` | Statistik, sebaran kategori, transaksi terbaru |
| `/admin/products` | `ProductManagement` | Kelola seluruh barang |
| `/admin/transactions` | `TransactionManagement` | Kelola dan ubah status transaksi |
| `/admin/users` | `AdminUsers` | Verifikasi, tolak, blokir akun |

---

## 4. Endpoint API

Base URL `http://localhost:5000/api`. 🔒 = butuh token, 🛡️ = admin saja.

### Auth — `/api/auth`

| Method | Endpoint | Alur |
|---|---|---|
| POST | `/register` | Validasi payload → hash password → buat akun `pending` → kembalikan pesan "menunggu verifikasi" |
| POST | `/login` | Cocokkan email + password → terbitkan JWT → simpan di `localStorage` |
| GET 🔒 | `/profile` | Data profil dari baris `users` |

### Products — `/api/products`

| Method | Endpoint | Alur |
|---|---|---|
| GET | `/` | Katalog + pagination nyata (`page`, `limit`, `category`, `search`) |
| GET | `/:id` | Detail barang |
| POST 🔒 | `/` | Tambah barang (pemilik = pengguna yang login) |
| PUT 🔒 | `/:id` | Ubah barang — **pemilik atau admin** |
| DELETE 🔒 | `/:id` | Hapus barang — **pemilik atau admin** |

### Bookings — `/api/bookings`

| Method | Endpoint | Alur |
|---|---|---|
| POST 🔒 | `/` | Simpan pesanan; **total dihitung server** dari harga produk × jumlah hari |
| GET 🔒 | `/` | Pesanan milik pengguna yang login (dengan `status` opsional) |
| GET 🔒 | `/:id` | Detail pesanan — **penyewa, penjual, atau admin** |
| PATCH 🔒 | `/:id/cancel` | Batalkan — **penyewa**, hanya saat status `pending` |
| PATCH 🛡️ | `/:id/status` | Ubah status oleh admin |
| DELETE 🔒 | `/:id` | Hapus — **penjual atau admin** |
| GET 🔒 | `/penyerahan` | Barang milik saya yang sedang disewa |
| GET 🛡️ | `/all` | Seluruh transaksi |

### Users — `/api/users` (semua 🛡️)

`GET /`, `GET /blacklist`, `GET /:id`, `PATCH /:id/verify`, `PATCH /:id/reject`,
`POST /:id/blacklist`, `DELETE /:id/blacklist`.

Blokir menulis ke tabel `blacklist` dan mengubah `users.status` menjadi
`blacklist`; `authenticate` lalu menolak akun tersebut di request berikutnya.

### Admin — `/api/admin` (semua 🛡️)

`GET /stats`, `GET /categories`, `GET /recent-bookings`.

### Upload — `/api/upload` (semua 🔒)

`POST /` (satu gambar produk), `POST /multiple` (maks. 5), `POST /identity`
(dokumen identitas, folder privat), `GET /identity/:userId` (unduh, admin).

---

## 5. Alur utama

### Alur penyewa

```
Landing → Katalog → Detail barang → pilih tanggal → Booking → BookingSuccess
   → (setuju syarat + tanda tangan) → Riwayat transaksi
```

1. Pengguna mencari barang di `/products` (pencarian dari navbar mengarah ke
   `/products?q=...`).
2. Di `/products/:id` tombol booking menyimpan pilihan ke `sessionStorage`
   (`bookingInfo`), lalu mengarahkan ke `/booking`.
3. `/booking` mengirim `product_id`, `booking_date`, `end_date`, `notes`.
   **Klien tidak mengirim harga** — server menghitung totalnya sendiri.
4. Server mengembalikan pesanan; `/booking-success` menampilkan ringkasan dan
   meminta persetujuan syarat sebelum masuk ke `/history`.

### Alur pemilik barang

```
Dashboard → Tambah barang → Katalog (barang Anda tampil) → Pesanan masuk
   → (/dashboard/penyerahan) tandai sudah diserahkan
```

### Alur admin

```
Login sebagai admin → /admin (statistik) → /admin/users (verifikasi/blokir)
   → /admin/transactions (ubah status) → /admin/products (moderasi barang)
```

---

## 6. Alur request di backend

```
Request
  → cors + express.json
  → route
      → authenticate  (verifikasi JWT, baca ulang user dari DB)
      → requireRole  (jika endpoint admin)
      → validate     (validator tulisan tangan; gagal → 422 + errors per field)
      → asyncHandler → controller → repository (SQL) → sendSuccess / sendError
  → notFound  → errorHandler (jawaban dengan amplop yang sama)
```

Pengaman yang ditegakkan di lapisan ini:

- **Role dicek ulang di database pada setiap request**, jadi perubahan status akun
  berlaku seketika.
- **Pemilik sumber daya diperiksa di controller**: admin, pemilik produk, atau
  penyewa/penjual booking — sesuai endpointnya.
- **Error SQL mentah tidak pernah sampai ke klien**; pesan 5xx diganti dengan
  teks generik dan stack hanya ditulis ke log server.

---

## 7. Alur data di frontend

```
Page → service (services/*.js) → lib/api.js (axios + interceptor token)
     → backend → amplop { success, message, data }
     → service mengembalikan response.data
     → page menyimpan hasilnya di state
```

- `lib/api.js` memasang `Authorization: Bearer` otomatis dan mengarahkan ke
  `/login` (menyimpan tujuan sebelumnya) saat server membalas 401.
- `lib/auth.js` menyimpan token + data pengguna di `localStorage`.
- `lib/format.js` adalah satu-satunya tempat harga, tanggal, dan status
  diterjemahkan ke bahasa tampilan.

---

## 8. Alur upload

```
Pilih file di form (AddProduct / ProductManagement)
  → multipart ke /api/upload
  → Multer menyimpan ke backend/uploads/products/
  → nama file dikembalikan
  → disimpan di products.image_url
  → ditampilkan lewat ASSET_URL + /uploads/products/<nama>
```

Dokumen identitas mengikuti jalur terpisah: disimpan di `uploads/identities/`,
tidak pernah dilayani secara statis, dan hanya bisa diunduh admin melalui
endpoint yang dilindungi token.
