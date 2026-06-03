import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Rp 0';
  const num = (typeof price === 'number' ? price : parseFloat(price) || 0) * 1000;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusConfig = {
  pending: { label: 'Menunggu', color: 'bg-warning-container text-warning' },
  approved: { label: 'Disetujui', color: 'bg-[#D1FAE5] text-[#065F46]' },
  rejected: { label: 'Ditolak', color: 'bg-error-container text-error' },
  completed: { label: 'Selesai', color: 'bg-secondary-container text-on-secondary-container' },
  cancelled: { label: 'Dibatalkan', color: 'bg-surface-variant text-on-surface-variant' },
};

const statusFilters = ['Semua', 'pending', 'approved', 'rejected', 'completed'];

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  useEffect(() => {
    fetchTransactions();
  }, [activeFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = activeFilter !== 'Semua' ? activeFilter : null;
      const response = await bookingService.getMyBookings(status);
      if (response.success) {
        setTransactions(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat riwayat transaksi');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toString().includes(searchQuery);
    return matchesSearch;
  });

  return (
    <>
      {/* Page Header */}
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h1 text-on-surface mb-[var(--spacing-xs)]">
          Riwayat Transaksi
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Lihat semua aktivitas penyewaan Anda
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-[var(--spacing-xs)] mb-[var(--spacing-lg)] justify-between items-center bg-surface-container-lowest p-[var(--spacing-md)] rounded-[var(--radius-lg)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] border border-outline-variant/30">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <span className="material-symbols-outlined absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi..."
            className="w-full pl-10 pr-[var(--spacing-sm)] py-[var(--spacing-xs)] border border-outline-variant rounded-[var(--radius-md)] bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md text-on-surface placeholder:text-on-surface-variant transition-all"
          />
        </div>
        <div className="w-full md:w-auto flex gap-[var(--spacing-xs)] overflow-x-auto pb-[var(--spacing-xs)] md:pb-0">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-[var(--spacing-xs)] py-[2px] rounded-full font-label-md text-label-md transition-opacity ${
                activeFilter === filter
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container-low'
              }`}
            >
              {filter === 'Semua' ? filter : statusConfig[filter]?.label || filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-[var(--spacing-xs)]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-[var(--radius-lg)] p-[var(--spacing-md)] animate-pulse">
              <div className="flex gap-[var(--spacing-md)]">
                <div className="w-32 h-24 bg-surface-container rounded-[var(--radius-md)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-container rounded w-1/4" />
                  <div className="h-6 bg-surface-container rounded w-3/4" />
                  <div className="h-4 bg-surface-container rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-error-container/20 border border-error-container/50 rounded-[var(--radius-xl)] p-6 text-center">
          <span className="material-symbols-outlined text-error text-[48px] mb-2">error</span>
          <p className="text-body-md text-error">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-4 px-4 py-2 bg-primary-container text-on-primary-container rounded-[var(--radius-lg)] hover:bg-primary-fixed transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Transaction List */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-[var(--spacing-xs)]">
          {filteredTransactions.map((tx) => {
            const statusInfo = statusConfig[tx.status] || { label: tx.status, color: 'bg-surface-variant' };
            return (
              <div
                key={tx.id}
                className="bg-surface-container-lowest rounded-[var(--radius-lg)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] hover:shadow-[0_8px_24px_rgba(31,41,55,0.08)] transition-shadow duration-300 flex flex-col md:flex-row gap-[var(--spacing-md)] items-start md:items-center justify-between border border-outline-variant/30"
              >
                <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] items-start md:items-center w-full md:w-auto">
                  {/* Product Image */}
                  <div className="w-full md:w-32 h-24 bg-surface-container rounded-[var(--radius-md)] shrink-0 overflow-hidden">
                    <img
                      src={tx.product_image || 'https://placehold.co/128x96?text=No+Image'}
                      alt={tx.product_name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/128x96?text=No+Image'; }}
                    />
                  </div>
                  {/* Transaction Info */}
                  <div>
                    <div className="flex items-center gap-[var(--spacing-xs)] mb-[var(--spacing-xs)]">
                      <span className={`px-3 py-1 rounded-full font-caption text-caption ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-outline font-caption text-caption ml-[var(--spacing-xs)]">
                        #{tx.id}
                      </span>
                    </div>
                    <h3 className="font-heading text-h3 text-on-surface mb-[var(--spacing-xs)]">
                      {tx.product_name || 'Produk'}
                    </h3>
                    <div className="flex items-center gap-[var(--spacing-xs)] text-on-surface-variant text-body-md flex-wrap">
                      <span className="flex items-center gap-[var(--spacing-xs)]">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        {formatDate(tx.start_date)}
                      </span>
                      {tx.category && (
                        <span className="ml-2 bg-primary-container/10 px-2 py-0.5 rounded-full text-caption text-primary">
                          {tx.category}
                        </span>
                      )}
                    </div>
                    {tx.notes && (
                      <p className="text-caption text-on-surface-variant mt-1">
                        Catatan: {tx.notes.substring(0, 50)}
                        {tx.notes.length > 50 && '...'}
                      </p>
                    )}
                  </div>
                </div>
                {/* Amount & Action */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-[var(--spacing-xs)] md:mt-0 pt-[var(--spacing-xs)] md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                  <div className="font-heading text-h3 text-primary mb-0 md:mb-[var(--spacing-xs)]">
                    {formatPrice(tx.total_price)}
                  </div>
                  <Link
                    to={`/booking/${tx.id}`}
                    className="px-[var(--spacing-xs)] py-[2px] rounded-[var(--radius-md)] border border-on-surface text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTransactions.length === 0 && (
        <div className="bg-surface-container-lowest rounded-[var(--radius-lg)] p-[var(--spacing-xl)] text-center border border-outline-variant/30">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-[var(--spacing-md)]">receipt_long</span>
          <p className="text-body-md text-on-surface-variant">
            {searchQuery ? 'Tidak ada transaksi yang sesuai pencarian' : 'Belum ada transaksi'}
          </p>
          {!searchQuery && (
            <Link
              to="/products"
              className="inline-block mt-4 px-4 py-2 bg-primary-container text-on-primary-container rounded-[var(--radius-lg)] hover:bg-primary-fixed transition-colors"
            >
              Mulai Sewa
            </Link>
          )}
        </div>
      )}
    </>
  );
}