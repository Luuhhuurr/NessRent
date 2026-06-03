export default function BookingSummary({
  items,
  deposit = 0,
  total: externalTotal = null,
  onContinue,
  continueLabel = 'Lanjutkan Booking',
  disabled = false,
}) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = externalTotal !== null ? externalTotal : subtotal + deposit;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_12px_32px_rgba(31,41,55,0.08)] border border-surface-variant">
      <h2 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)] flex items-center gap-2 border-b border-surface-variant pb-[var(--spacing-sm)]">
        <span className="material-symbols-outlined text-primary">receipt_long</span>
        Ringkasan Pembayaran
      </h2>

      {/* Items */}
      <div className="flex flex-col gap-[var(--spacing-xs)] mb-[var(--spacing-lg)] border-b border-surface-variant pb-[var(--spacing-md)]">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-body-md text-on-surface-variant">
            <span>
              {item.name}
            </span>
            <span className="text-on-surface font-medium">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
        {deposit > 0 && (
          <div className="flex justify-between items-center text-body-md text-on-surface-variant">
            <span>Deposit</span>
            <span className="text-on-surface font-medium">
              {formatCurrency(deposit)}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-[var(--spacing-md)]">
        <span className="text-label-md text-on-surface-variant">Total Biaya</span>
        <span className="font-heading text-h2 text-primary font-bold">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Deposit Info */}
      {deposit > 0 && (
        <div className="bg-secondary-fixed/50 rounded-[var(--radius-lg)] p-[var(--spacing-xs)] flex items-start gap-2 mb-[var(--spacing-lg)] border border-secondary-fixed-dim">
          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">info</span>
          <p className="text-caption text-on-secondary-fixed-variant leading-relaxed">
            Deposit akan dikembalikan setelah barang dikembalikan.
          </p>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onContinue}
        disabled={disabled}
        className="w-full bg-primary-container text-on-primary-container text-label-md py-[var(--spacing-xs)] rounded-[var(--radius-lg)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] hover:shadow-[0_8px_24px_rgba(31,41,55,0.10)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_20px_rgba(31,41,55,0.04)]"
      >
        {continueLabel}
        {!disabled && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
      </button>
    </div>
  );
}