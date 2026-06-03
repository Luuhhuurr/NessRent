export default function ProductCard({
  image,
  name,
  price,
  unit = 'hari',
  status = 'Tersedia',
  disabled = false
}) {
  const isAvailable = status === 'Tersedia';

  return (
    <div className="bg-surface rounded-[var(--radius-xl)] shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] hover:shadow-[0_8px_24px_0_rgba(31,41,55,0.1)] transition-all duration-300 flex flex-col overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-[200px] object-cover rounded-t-[var(--radius-xl)]"
      />
      <div className="p-[var(--spacing-md)] flex flex-col gap-[var(--spacing-xs)] flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-label-md text-on-surface">{name}</h3>
          <span
            className={`px-[var(--spacing-xs)] py-[2px] rounded-full text-caption ${
              isAvailable
                ? 'bg-primary-container/15 text-on-surface'
                : 'bg-surface-container text-secondary'
            }`}
          >
            {status}
          </span>
        </div>
        <p className="text-h3 text-primary mt-auto">
          {price}<span className="text-body-md text-secondary">/{unit}</span>
        </p>
        <button
          className="w-full text-label-md font-[600] py-[var(--spacing-xs)] rounded-[var(--radius-lg)] bg-primary-container text-on-primary-container hover:opacity-80 transition-all duration-300 mt-[var(--spacing-xs)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-secondary"
          disabled={disabled || !isAvailable}
        >
          Sewa
        </button>
      </div>
    </div>
  );
}