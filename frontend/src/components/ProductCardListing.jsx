import { Link } from 'react-router-dom';

export default function ProductCardListing({
  id,
  name,
  price,
  unit = 'hari',
  image,
  status = 'Tersedia',
}) {
  const isAvailable = status === 'Tersedia';

  return (
    <article className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] flex flex-col overflow-hidden group border border-surface-variant/50 hover:shadow-[0_8px_24px_rgba(31,41,55,0.1)] hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden bg-surface-variant">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className={`absolute top-[var(--spacing-xs)] right-[var(--spacing-xs)] backdrop-blur-md px-3 py-1 rounded-full text-caption flex items-center gap-[var(--spacing-xs)] border ${
            isAvailable
              ? 'bg-primary/15 text-on-primary-container border-primary/20'
              : 'bg-surface-variant text-on-surface-variant'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-primary' : 'bg-secondary'} inline-block`} />
          {status}
        </div>
      </div>
      <div className="p-[var(--spacing-md)] flex flex-col flex-grow gap-[var(--spacing-xs)]">
        <h3 className="text-label-md text-on-background line-clamp-2">{name}</h3>
        <div className="flex items-baseline gap-[var(--spacing-xs)] mt-auto">
          <span className="font-heading text-h3 text-primary">{price}</span>
          <span className="text-body-md text-on-surface-variant">/ {unit}</span>
        </div>
        <Link
          to={`/products/${id}`}
          className="w-full mt-[var(--spacing-xs)] text-center py-3 rounded-[var(--radius-lg)] text-label-md border-2 border-primary text-primary hover:bg-primary-container hover:border-primary-container hover:text-on-primary-container transition-all duration-200"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}