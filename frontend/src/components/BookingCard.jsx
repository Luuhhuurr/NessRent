import { useState } from 'react';
import { formatPrice } from '../lib/format';

export default function BookingCard({ pricePerDay, onBook, isAvailable = true }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const duration = (() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  })();

  // Prices are handled in thousands of rupiah throughout the app.
  const totalPrice = pricePerDay * duration;

  const handleBook = () => {
    onBook?.({ startDate, endDate, duration, totalPrice });
  };

  const dateField =
    'w-full pl-10 pr-3 py-2 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors';

  return (
    <div className="panel p-[var(--spacing-md)] flex flex-col gap-[var(--spacing-md)] sticky top-[88px]">
      <h3 className="font-heading text-h3 text-on-surface">Atur jadwal sewa</h3>

      <div className="grid grid-cols-1 gap-[var(--spacing-sm)]">
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          <label className="text-label-md text-on-surface-variant" htmlFor="booking-start">
            Tanggal mulai
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              calendar_today
            </span>
            <input
              id="booking-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={dateField}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[var(--spacing-xs)]">
          <label className="text-label-md text-on-surface-variant" htmlFor="booking-end">
            Tanggal selesai
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              event
            </span>
            <input
              id="booking-end"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className={dateField}
            />
          </div>
        </div>
      </div>

      <div className="panel-muted p-[var(--spacing-sm)] flex flex-col gap-2">
        <div className="flex justify-between text-body-sm text-on-surface-variant">
          <span>Durasi</span>
          <span className="text-on-surface font-semibold">{duration} hari</span>
        </div>
        <div className="flex justify-between items-center border-t border-outline-variant pt-2">
          <span className="text-label-md text-on-surface-variant">Total harga</span>
          <span className="font-heading text-h3 text-on-surface">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <button
        onClick={handleBook}
        disabled={!isAvailable || !startDate || !endDate}
        className="w-full py-2.5 rounded-[var(--radius-md)] bg-primary text-on-primary text-label-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
        {isAvailable ? 'Sewa sekarang' : 'Tidak tersedia'}
      </button>
    </div>
  );
}
