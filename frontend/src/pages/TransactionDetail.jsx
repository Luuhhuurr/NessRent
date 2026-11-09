import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { formatPrice, formatDate, getProductImage, statusLabel, statusTone } from '../lib/format';

export default function TransactionDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactionDetail = useCallback(async () => {
    const response = await bookingService.getBooking(id);
    return response?.data ?? null;
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setTransaction(await fetchTransactionDetail());
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat detail transaksi.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchTransactionDetail]);

  if (loading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="animate-pulse flex flex-col gap-[var(--spacing-lg)]">
          <div className="h-4 bg-surface-container rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
            <div className="lg:col-span-5 aspect-[4/3] bg-surface-container rounded-[var(--radius-xl)]" />
            <div className="lg:col-span-7 h-64 bg-surface-container rounded-[var(--radius-xl)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="panel p-[var(--spacing-lg)] text-center">
          <span className="material-symbols-outlined text-error text-[56px] mb-4">error</span>
          <h2 className="font-heading text-h2 text-on-surface mb-2">Transaksi tidak ditemukan</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            {error || 'Pesanan ini tidak tersedia atau bukan milik Anda.'}
          </p>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke riwayat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)] flex flex-col gap-[var(--spacing-xl)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[var(--spacing-sm)]">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali ke riwayat
        </Link>
        <div className="text-caption text-on-surface-variant flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Beranda</Link>
          <span>/</span>
          <Link to="/history" className="hover:text-primary">Riwayat</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">#{transaction.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
        <div className="lg:col-span-5 flex flex-col gap-[var(--spacing-lg)]">
          <div className="rounded-[var(--radius-xl)] overflow-hidden border border-outline-variant bg-surface-container aspect-[4/3]">
            <img
              src={getProductImage(transaction.image_url)}
              alt={transaction.product_name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="panel p-[var(--spacing-md)] flex flex-col gap-[var(--spacing-sm)]">
            <h1 className="font-heading text-h2 text-on-surface">{transaction.product_name}</h1>
            <p className="font-heading text-h3 text-on-surface">
              {formatPrice(transaction.price)}
              <span className="text-body-sm text-on-surface-variant font-body"> / hari</span>
            </p>
            <p className="text-body-sm text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {formatDate(transaction.booking_date)} — {formatDate(transaction.end_date)}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-[var(--spacing-lg)]">
          <section className="panel p-[var(--spacing-lg)] flex flex-col gap-[var(--spacing-md)]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-h3 text-on-surface">Ringkasan transaksi</h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption ${statusTone(transaction.status)}`}
              >
                {statusLabel(transaction.status)}
              </span>
            </div>

            <div className="border-t border-outline-variant pt-[var(--spacing-md)] flex flex-col gap-2">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">ID transaksi</span>
                <span className="text-on-surface font-medium">#{transaction.id}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Tanggal sewa</span>
                <span className="text-on-surface">{formatDate(transaction.booking_date)}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Tanggal kembali</span>
                <span className="text-on-surface">{formatDate(transaction.end_date)}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Dibuat pada</span>
                <span className="text-on-surface">{formatDate(transaction.created_at)}</span>
              </div>
              <div className="border-t border-outline-variant mt-2 pt-3 flex justify-between items-baseline">
                <span className="text-label-md text-on-surface-variant">Total bayar</span>
                <span className="font-heading text-h2 text-on-surface">
                  {formatPrice(transaction.total_price)}
                </span>
              </div>
            </div>
          </section>

          <section className="panel p-[var(--spacing-lg)] flex flex-col gap-2">
            <h3 className="font-heading text-h3 text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">location_on</span>
              Lokasi pengambilan
            </h3>
            <p className="text-body-md text-on-surface-variant">
              {transaction.pickup_location || transaction.notes || '-'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
