import { useState } from 'react';

export default function BookingCard({
  pricePerDay,
  onBook,
  onAddToFavorites,
  isAvailable = true,
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate duration and total price
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const duration = calculateDuration();
  const totalPrice = pricePerDay * duration;

  const handleBook = () => {
    if (onBook) {
      onBook({ startDate, endDate, duration, totalPrice });
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] border border-surface-variant flex flex-col gap-[var(--spacing-md)] sticky top-[100px]">
      <h3 className="font-heading text-h3 text-on-surface">Atur Jadwal Sewa</h3>

      {/* Date Inputs */}
      <div className="grid grid-cols-2 gap-[var(--spacing-xs)]">
        <div className="space-y-[var(--spacing-xs)]">
          <label className="text-label-md text-on-surface-variant">Tanggal Mulai</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant">
              calendar_today
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-lg pr-[var(--spacing-sm)] py-[var(--spacing-xs)] border border-outline-variant rounded-[var(--radius-lg)] text-body-md text-on-surface bg-surface-container-low focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-[var(--spacing-xs)]">
          <label className="text-label-md text-on-surface-variant">Tanggal Selesai</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant">
              event
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-lg pr-[var(--spacing-sm)] py-[var(--spacing-xs)] border border-outline-variant rounded-[var(--radius-lg)] text-body-md text-on-surface bg-surface-container-low focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-surface-container-low rounded-[var(--radius-md)] p-[var(--spacing-xs)] space-y-[var(--spacing-xs)] border border-surface-variant border-dashed">
        <div className="flex justify-between text-body-md text-on-surface-variant">
          <span>Durasi:</span>
          <span className="font-medium text-on-surface">{duration} Hari</span>
        </div>
        <div className="flex justify-between text-label-md text-on-surface pt-[var(--spacing-xs)] border-t border-surface-variant">
          <span>Total Harga:</span>
          <span className="font-heading text-[20px] text-primary">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-[var(--spacing-xs)] pt-[var(--spacing-xs)]">
        <button
          onClick={handleBook}
          disabled={!isAvailable || !startDate || !endDate}
          className="w-full bg-primary-container text-on-primary-fixed text-label-md py-[var(--spacing-xs)] rounded-[var(--radius-lg)] hover:bg-primary-fixed-dim transition-colors active:scale-[0.98] flex items-center justify-center gap-[var(--spacing-xs)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">shopping_cart_checkout</span>
          {isAvailable ? 'Sewa Sekarang' : 'Tidak Tersedia'}
        </button>
        <button
          onClick={onAddToFavorites}
          className="w-full bg-transparent border border-on-surface text-on-surface text-label-md py-[var(--spacing-xs)] rounded-[var(--radius-lg)] hover:bg-surface-container transition-colors active:scale-[0.98] flex items-center justify-center gap-[var(--spacing-xs)]"
        >
          <span className="material-symbols-outlined">favorite_border</span>
          Tambah ke Favorit
        </button>
      </div>
    </div>
  );
}