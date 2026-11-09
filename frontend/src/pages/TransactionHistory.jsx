import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { formatPrice, formatDate, getProductImage, statusLabel, statusTone } from '../lib/format';

const STATUS_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'completed', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' },
];

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const fetchTransactions = useCallback(async () => {
    const response = await bookingService.getMyBookings(activeFilter || null);
    return response?.data?.bookings ?? [];
  }, [activeFilter]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setTransactions(await fetchTransactions());
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat riwayat transaksi.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((tx) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      String(tx.product_name ?? '').toLowerCase().includes(term) || String(tx.id).includes(term)
    );
  });

  return (
    <>
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h2 text-on-surface">Riwayat transaksi</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Semua aktivitas penyewaan Anda dalam satu daftar.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] md:items-center justify-between mb-[var(--spacing-lg)]">
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi..."
            className="w-full pl-10 pr-3 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-[var(--spacing-xs)] overflow-x-auto">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value || 'all'}
              onClick={() => setActiveFilter(filter.value)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-label-md transition-colors ${
                activeFilter === filter.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col gap-[var(--spacing-sm)]">
          {[0, 1, 2].map((index) => (
            <div key={index} className="panel p-[var(--spacing-md)] animate-pulse h-32" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="panel p-[var(--spacing-lg)] text-center">
          <span className="material-symbols-outlined text-error text-[48px] mb-2">error</span>
          <p className="text-body-md text-error">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!loading && !error && filteredTransactions.length > 0 && (
        <div className="flex flex-col gap-[var(--spacing-sm)]">
          {filteredTransactions.map((tx) => (
            <article
              key={tx.id}
              className="panel p-[var(--spacing-md)] flex flex-col md:flex-row gap-[var(--spacing-md)] items-start md:items-center justify-between"
            >
              <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] items-start md:items-center w-full md:w-auto min-w-0">
                <div className="w-full md:w-32 h-24 bg-surface-container rounded-[var(--radius-md)] shrink-0 overflow-hidden">
                  <img
                    src={getProductImage(tx.image_url)}
                    alt={tx.product_name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-1 rounded-full text-caption ${statusTone(tx.status)}`}>
                      {statusLabel(tx.status)}
                    </span>
                    <span className="text-caption text-on-surface-variant">#{tx.id}</span>
                  </div>
                  <h3 className="text-body-lg text-on-surface truncate">{tx.product_name || 'Barang'}</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    {formatDate(tx.booking_date)} — {formatDate(tx.end_date)}
                  </p>
                  {tx.notes && (
                    <p className="text-caption text-on-surface-variant mt-1 truncate">Catatan: {tx.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant">
                <span className="font-heading text-h3 text-on-surface">{formatPrice(tx.total_price)}</span>
                <Link
                  to={`/transactions/${tx.id}`}
                  className="px-3 py-1.5 rounded-[var(--radius-md)] border border-outline text-on-surface text-label-md hover:border-primary hover:text-primary transition-colors"
                >
                  Lihat detail
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && filteredTransactions.length === 0 && (
        <div className="panel p-[var(--spacing-xl)] text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3">receipt_long</span>
          <p className="text-body-md text-on-surface-variant">
            {searchQuery ? 'Tidak ada transaksi yang sesuai pencarian.' : 'Belum ada transaksi.'}
          </p>
          {!searchQuery && (
            <Link
              to="/products"
              className="inline-block mt-4 px-4 py-2 bg-primary text-on-primary rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors"
            >
              Mulai sewa
            </Link>
          )}
        </div>
      )}
    </>
  );
}
