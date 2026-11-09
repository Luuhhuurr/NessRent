import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { bookingService } from '../services/bookingService';
import { getUser } from '../lib/auth';
import { formatPrice, formatDate, getProductImage, getStatusLabel, statusLabel, statusTone } from '../lib/format';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = getUser();
  const userDisplayName =
    currentUser?.name || currentUser?.full_name || currentUser?.email?.split('@')[0] || 'Pengguna';

  const fetchData = useCallback(async () => {
    let products = [];
    let error = null;

    try {
      const productsResponse = await productService.getProducts();
      products = (productsResponse?.data?.products ?? []).slice(0, 6);
    } catch (err) {
      error = err?.message || 'Gagal memuat data.';
    }

    let transactions;
    try {
      const bookingsResponse = await bookingService.getMyBookings();
      transactions = bookingsResponse?.data?.bookings ?? [];
    } catch {
      transactions = [];
    }

    return { products, transactions, error };
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData();
        setProducts(result.products);
        setTransactions(result.transactions);
        setError(result.error);
      } catch (err) {
        setError(err?.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchData]);

  const completedCount = transactions.filter((t) =>
    ['completed', 'approved'].includes(String(t.status).toLowerCase())
  ).length;

  return (
    <>
      <section className="mb-[var(--spacing-lg)]">
        <h2 className="font-heading text-h2 text-on-surface">Selamat datang, {userDisplayName}</h2>
        <p className="text-body-lg text-on-surface-variant mt-1">Siap menyewa barang hari ini?</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <StatCard
          label="Transaksi selesai"
          value={loading ? '-' : completedCount}
          icon="check_circle"
          hint="Total pesanan yang telah selesai"
        />
        <StatCard
          label="Status verifikasi"
          value={currentUser?.status === 'verified' ? 'Terverifikasi' : currentUser?.status ?? '-'}
          icon="verified_user"
          hint="Akun sudah diverifikasi admin"
        />
      </section>

      <section className="flex flex-wrap gap-[var(--spacing-sm)] mb-[var(--spacing-lg)]">
        <Link
          to="/user/add-product"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-primary text-on-primary font-semibold text-label-md hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah barang
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] border border-outline text-on-surface font-semibold text-label-md hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          Cari barang
        </Link>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] border border-outline text-on-surface font-semibold text-label-md hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">list_alt</span>
          Lihat transaksi
        </Link>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] border border-outline text-on-surface font-semibold text-label-md hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          Profil saya
        </Link>
      </section>

      <section className="mb-[var(--spacing-lg)]">
        <div className="flex items-center justify-between mb-[var(--spacing-md)]">
          <h3 className="font-heading text-h3 text-on-surface">Barang populer</h3>
          <Link to="/products" className="text-label-md text-primary hover:underline">
            Lihat semua
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
            {[0, 1, 2].map((index) => (
              <div key={index} className="panel h-80 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="panel p-[var(--spacing-lg)] text-center">
            <span className="material-symbols-outlined text-error text-[48px]">error</span>
            <p className="text-body-md text-error mt-2">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="panel p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[56px] mb-4">inventory_2</span>
            <h3 className="font-heading text-h3 text-on-surface mb-2">Belum ada barang</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Jadilah yang pertama menambahkan barang untuk disewakan.
            </p>
            <Link
              to="/user/add-product"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-primary text-on-primary font-semibold text-label-md hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah barang
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.product_name || 'Tanpa Nama'}
                price={formatPrice(product.price)}
                image={getProductImage(product.image_url || product.image)}
                status={getStatusLabel(product.status)}
                category={product.category}
              />
            ))}
          </div>
        )}
      </section>

      <section className="panel p-[var(--spacing-md)]">
        <h3 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)]">Transaksi terakhir</h3>

        {loading && (
          <div className="animate-pulse flex flex-col gap-2">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-12 bg-surface-container rounded-[var(--radius-md)]" />
            ))}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="py-10 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[48px] mb-3">receipt_long</span>
            <p className="text-body-md text-on-surface-variant">Belum ada transaksi</p>
            <p className="text-caption text-on-surface-variant mt-1">Mulai sewa barang pertama Anda</p>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Nama barang</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Tanggal</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-sm text-on-surface">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-outline-variant/40 hover:bg-surface-container transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{transaction.product_name}</td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {formatDate(transaction.created_at || transaction.booking_date)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-caption ${statusTone(transaction.status)}`}
                      >
                        {statusLabel(transaction.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
