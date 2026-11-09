import { formatPrice } from '../lib/format';

export default function BookingSummary({
  items,
  deposit = 0,
  total: externalTotal = null,
  onContinue,
  continueLabel = 'Lanjutkan Booking',
  disabled = false,
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = externalTotal !== null ? externalTotal : subtotal + deposit;

  return (
    <div className="panel p-[var(--spacing-md)]">
      <h2 className="font-heading text-h3 text-on-surface flex items-center gap-2 border-b border-outline-variant pb-[var(--spacing-sm)]">
        <span className="material-symbols-outlined text-primary text-[22px]">receipt_long</span>
        Ringkasan Pembayaran
      </h2>

      <div className="flex flex-col gap-[var(--spacing-xs)] py-[var(--spacing-md)] border-b border-outline-variant">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-start gap-3 text-body-sm text-on-surface-variant">
            <span>{item.name}</span>
            <span className="text-on-surface font-medium whitespace-nowrap">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
        {deposit > 0 && (
          <div className="flex justify-between items-center text-body-sm text-on-surface-variant">
            <span>Deposit</span>
            <span className="text-on-surface font-medium">{formatPrice(deposit)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-baseline py-[var(--spacing-md)]">
        <span className="text-label-md text-on-surface-variant">Total Biaya</span>
        <span className="font-heading text-h2 text-on-surface">{formatPrice(total)}</span>
      </div>

      {deposit > 0 && (
        <div className="rounded-[var(--radius-md)] bg-info-container/40 border border-info/25 p-[var(--spacing-sm)] flex items-start gap-2 mb-[var(--spacing-md)]">
          <span className="material-symbols-outlined text-info text-[18px] mt-0.5">info</span>
          <p className="text-caption text-on-info-container leading-relaxed">
            Deposit akan dikembalikan setelah barang dikembalikan.
          </p>
        </div>
      )}

      <button
        onClick={onContinue}
        disabled={disabled}
        className="w-full bg-primary text-on-primary text-label-md py-2.5 rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {continueLabel}
        {!disabled && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
      </button>
    </div>
  );
}
